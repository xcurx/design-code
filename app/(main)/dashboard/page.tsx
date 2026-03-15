import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  Target,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  EVALUATING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  PENDING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const difficultyColors: Record<string, string> = {
  EASY: "text-emerald-600",
  MEDIUM: "text-amber-600",
  HARD: "text-red-600",
};

function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreTrackColor(score: number) {
  if (score >= 70) return "stroke-emerald-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-red-500";
}

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-muted"
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className={scoreTrackColor(score)}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [submissions, problems] = await Promise.all([
    prisma.submission.findMany({
      where: { userId: userId ?? "" },
      include: { problem: true, evaluation: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.problem.findMany({
      orderBy: { difficulty: "asc" },
      take: 5,
    }),
  ]);

  const problemCount = problems.length;
  const totalSubmissions = submissions.length;
  const completedSubmissions = submissions.filter(
    (s) => s.status === "COMPLETED" && s.evaluation
  );
  const averageScore =
    completedSubmissions.length > 0
      ? Math.round(
          completedSubmissions.reduce(
            (sum, s) => sum + (s.evaluation?.overallScore ?? 0),
            0
          ) / completedSubmissions.length
        )
      : 0;
  const problemsAttempted = new Set(submissions.map((s) => s.problemId)).size;
  const recentSubmissions = submissions.slice(0, 5);
  const bestScore = completedSubmissions.length > 0
    ? Math.round(Math.max(...completedSubmissions.map((s) => s.evaluation?.overallScore ?? 0)))
    : null;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-primary/5 p-6 sm:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-muted-foreground">
            {greeting},
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {firstName}
            <Sparkles className="ml-2 inline-block size-5 text-amber-500" />
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Sharpen your low-level design skills by building UML class diagrams
            and receiving instant AI-powered feedback.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/problems" />}
            >
              <BookOpen className="size-4" />
              Browse Problems
            </Button>
            {totalSubmissions > 0 && (
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/submissions" />}
              >
                View Submissions
              </Button>
            )}
          </div>
        </div>
        {/* Decorative circle */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/3" />
        <div className="pointer-events-none absolute -bottom-20 -right-8 size-48 rounded-full bg-primary/4" />
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <ClipboardList className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Submissions
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {totalSubmissions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <TrendingUp className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Avg Score
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {completedSubmissions.length > 0 ? (
                  <span className={scoreColor(averageScore)}>{averageScore}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Target className="size-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Attempted
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {problemsAttempted}
                <span className="text-sm font-normal text-muted-foreground">
                  /{problemCount}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Trophy className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Best Score
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {bestScore !== null ? (
                  <span className={scoreColor(bestScore)}>{bestScore}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Activity — wider */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            {totalSubmissions > 5 && (
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/submissions" />}
              >
                View all
                <ArrowRight className="ml-1 size-3" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <ClipboardList className="size-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium">No submissions yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a problem and start designing!
                </p>
                <Button
                  className="mt-4"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/problems" />}
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentSubmissions.map((submission) => {
                  const score = submission.evaluation
                    ? Math.round(submission.evaluation.overallScore)
                    : null;
                  return (
                    <Link
                      key={submission.id}
                      href={`/submissions/${submission.id}`}
                      className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg"
                    >
                      {/* Score ring or status indicator */}
                      <div className="relative flex size-11 shrink-0 items-center justify-center">
                        {score !== null ? (
                          <>
                            <ScoreRing score={score} />
                            <span
                              className={`absolute text-xs font-bold ${scoreColor(score)}`}
                            >
                              {score}
                            </span>
                          </>
                        ) : (
                          <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                            <Clock className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium group-hover:text-foreground">
                          {submission.problem.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatRelativeTime(submission.createdAt)}
                        </p>
                      </div>

                      {/* Status badge */}
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[11px] ${statusColors[submission.status] ?? ""}`}
                      >
                        {submission.status.charAt(0) +
                          submission.status.slice(1).toLowerCase()}
                      </Badge>

                      <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Problems */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="size-4 text-muted-foreground" />
              Suggested Problems
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/problems" />}
            >
              All
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="divide-y">
              {problems.map((problem) => {
                const attempted = submissions.some(
                  (s) => s.problemId === problem.id
                );
                return (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0 -mx-2 px-2 rounded-lg transition-colors hover:bg-muted/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium group-hover:text-foreground">
                        {problem.title}
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-medium ${difficultyColors[problem.difficulty]}`}
                      >
                        {problem.difficulty.charAt(0) +
                          problem.difficulty.slice(1).toLowerCase()}
                      </p>
                    </div>
                    {attempted && (
                      <Badge
                        variant="outline"
                        className="shrink-0 border-emerald-500/20 bg-emerald-500/10 text-[11px] text-emerald-600"
                      >
                        Attempted
                      </Badge>
                    )}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
