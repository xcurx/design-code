import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  ShieldCheck,
  TriangleAlert,
  Info,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Loader2,
  Brain,
  Sparkles,
  TrendingUp,
  Blocks,
  Scale,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { EvaluationTrigger } from "@/components/evaluation-trigger";

export default async function SubmissionResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { problem: true, evaluation: true },
  });

  if (!submission) {
    return (
      <div className="container mx-auto p-8 text-center flex-1 flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted p-6">
          <TriangleAlert className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Submission not found</h1>
        <Link
          href="/submissions"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>
      </div>
    );
  }

  if (submission.userId !== session.user.id) {
    return <div className="container mx-auto p-8 font-bold">Forbidden</div>;
  }

  // ── PENDING / EVALUATING state ──
  if (submission.status !== "COMPLETED" || !submission.evaluation) {
    const isPending = submission.status === "PENDING";
    const isEvaluating = submission.status === "EVALUATING";
    const isFailed = submission.status === "FAILED";

    return (
      <div className="container mx-auto p-8 max-w-3xl flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 text-center">
          {/* Animated icon */}
          {!isFailed && (
            <div className="relative">
              <div className="rounded-full bg-primary/10 p-6 animate-pulse">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 rounded-full bg-primary/20 p-1.5 animate-bounce">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}

          {isFailed && (
            <div className="rounded-full bg-destructive/10 p-6">
              <TriangleAlert className="h-12 w-12 text-destructive" />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {isFailed ? "Evaluation Failed" : "AI is Analyzing..."}
            </h1>
            <p className="text-muted-foreground max-w-md">
              {isPending && "Preparing your diagram for evaluation. This will take just a moment..."}
              {isEvaluating && "The AI engine is evaluating your UML diagram. This may take 30–120 seconds."}
              {isFailed && "The AI evaluator encountered an error processing your submission."}
            </p>
          </div>

          <Badge
            variant={isFailed ? "destructive" : "secondary"}
            className="text-sm py-1.5 px-4"
          >
            {isPending && "⏳ Queued"}
            {isEvaluating && "🧠 Processing"}
            {isFailed && "✕ Failed"}
          </Badge>

          {/* Progress dots animation */}
          {!isFailed && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-[pulse_1.4s_ease-in-out_infinite]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
            </div>
          )}

          {isFailed && (
            <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl text-sm text-destructive max-w-md">
              Please review your diagram for syntax errors and try submitting again.
            </div>
          )}

          <Link
            href={`/problems/${submission.problemId}/solve`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Link>

          {/* Poll while still in progress */}
          {(isPending || isEvaluating) && (
            <EvaluationTrigger submissionId={submission.id} status={submission.status} />
          )}
        </div>
      </div>
    );
  }

  // ── COMPLETED state ──
  const evalData = submission.evaluation;
  const rawOutput = evalData.rawAgentOutput as any;
  const descriptionMarkdown =
    rawOutput?.description || "*No detailed report available.*";
  const suggestions = (evalData.suggestions as string[]) || [];

  const scoreColor = (v: number) =>
    v >= 70 ? "text-emerald-500" : v >= 40 ? "text-amber-500" : "text-red-500";
  const scoreBg = (v: number) =>
    v >= 70 ? "bg-emerald-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
  const scoreLightBg = (v: number) =>
    v >= 70 ? "bg-emerald-500/10" : v >= 40 ? "bg-amber-500/10" : "bg-red-500/10";

  const scoreCategories = [
    { label: "Structural Validation", score: evalData.structuralScore, icon: Blocks },
    { label: "Design Patterns", score: evalData.patternScore, icon: Layers },
    { label: "SOLID Principles", score: evalData.principlesScore, icon: Scale },
    { label: "Coupling & Cohesion", score: evalData.couplingCohesionScore, icon: TrendingUp },
  ];

  return (
    <div className="container mx-auto max-w-6xl p-6 md:p-8 space-y-8 flex-1">
      {/* ── Header ── */}
      <div className="space-y-4">
        <Link
          href="/submissions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>

        {/* Hero Card */}
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-card via-card to-primary/[0.03]">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8">
            {/* Score Gauge */}
            <div className="shrink-0">
              <ScoreGauge value={evalData.overallScore} size={140} strokeWidth={12} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {submission.problem.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                Submitted{" "}
                {formatDistanceToNow(new Date(submission.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start pt-1">
                <Badge variant="outline" className="gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Completed
                </Badge>
                <Badge
                  variant="outline"
                  className={`gap-1.5 border-transparent ${scoreLightBg(evalData.overallScore)} ${scoreColor(evalData.overallScore)}`}
                >
                  {evalData.overallScore >= 70
                    ? "Strong"
                    : evalData.overallScore >= 40
                    ? "Needs Work"
                    : "Poor"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Score Breakdown Cards ── */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Score Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreCategories.map(({ label, score, icon: Icon }) => (
            <Card key={label} className="group hover:shadow-md transition-shadow border">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${scoreLightBg(score)}`}>
                    <Icon className={`h-4 w-4 ${scoreColor(score)}`} />
                  </div>
                  <span className={`text-2xl font-bold tabular-nums ${scoreColor(score)}`}>
                    {score}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground leading-tight">
                    {label}
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreBg(score)}`}
                      style={{ width: `${Math.max(score, 2)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Suggestions */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Key Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <Card
                  key={i}
                  className="border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/[0.07] transition-colors"
                >
                  <CardContent className="p-4 flex gap-3 text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <span className="leading-relaxed">{s}</span>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground italic">
                  No specific suggestions extracted.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: AI Report */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Detailed Evaluation Report
          </h3>
          <Card className="shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:leading-relaxed prose-li:leading-relaxed prose-code:text-xs prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-strong:font-semibold prose-table:text-sm">
                <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
