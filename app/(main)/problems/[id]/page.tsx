import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Layers, GitFork, Puzzle, CheckCircle2, Clock, XCircle, Code2, Sparkles, ChevronRight, ClipboardList } from "lucide-react";

const difficultyColor: Record<string, string> = {
  EASY: "bg-green-500/10 text-green-600 border-green-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  HARD: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600",
  EVALUATING: "bg-yellow-500/10 text-yellow-600",
  PENDING: "bg-blue-500/10 text-blue-600",
  FAILED: "bg-red-500/10 text-red-600",
};

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [problem, submissions] = await Promise.all([
    prisma.problem.findUnique({ where: { id } }),
    prisma.submission.findMany({
      where: { problemId: id, userId: session?.user?.id ?? "" },
      include: { evaluation: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!problem) notFound();

  const requirements = problem.requirements as {
    expectedClasses?: string[];
    expectedRelationships?: { type: string; source: string; target: string }[];
    expectedPatterns?: string[];
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-primary/5 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={`font-medium ${difficultyColor[problem.difficulty]}`}
              >
                {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
              </Badge>
               <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center gap-2">
              {problem.title}
             </h2>
          </div>
          
          <div className="shrink-0 flex items-center">
             <Button
                render={<Link href={`/problems/${problem.id}/solve`} />}
                nativeButton={false}
                size="lg"
                className="w-full sm:w-auto shadow-md transition-all hover:scale-105 hover:shadow-lg"
              >
                <Code2 className="mr-2 size-5" />
                Start Solving
                <ArrowRight className="ml-2 size-4" />
              </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-8 size-60 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                 Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none 
                prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-li:text-muted-foreground
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-muted prose-code:text-foreground prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Past Submissions */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Your Submissions</CardTitle>
              {submissions.length > 0 && (
                <Badge variant="secondary" className="font-mono">{submissions.length} attempts</Badge>
              )}
            </CardHeader>
            <CardContent className="p-0">
               {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/50 border mb-4">
                      <ClipboardList className="size-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No submissions yet</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                      Read the requirements carefully and click "Start Solving" to make your first attempt.
                    </p>
                  </div>
               ) : (
                <div className="divide-y divide-border/40">
                  {submissions.map((sub) => {
                    const isCompleted = sub.status === "COMPLETED";
                    const isFailed = sub.status === "FAILED";
                    const StatusIcon = isCompleted ? CheckCircle2 : isFailed ? XCircle : Clock;
                    
                    return (
                      <Link
                        key={sub.id}
                        href={`/submissions/${sub.id}`}
                        className="group flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-4">
                           <div className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${statusColors[sub.status] || "bg-muted border-border"}`}>
                             <StatusIcon className="size-4" />
                           </div>
                           <div>
                             <p className="text-sm font-medium group-hover:text-primary transition-colors">
                               Attempt from {sub.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                             </p>
                             <p className="text-xs text-muted-foreground mt-0.5">
                                at {sub.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                             </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end gap-1">
                             <Badge
                              variant="outline"
                              className={`text-[10px] uppercase font-bold tracking-wider ${statusColors[sub.status] ?? ""}`}
                            >
                              {sub.status}
                            </Badge>
                            {sub.evaluation && (
                              <span className="text-xs font-mono font-medium text-muted-foreground">
                                Score: {Math.round(sub.evaluation.overallScore)}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Right — Requirements (Sticky Sidebar) */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Expected Classes */}
          {requirements.expectedClasses &&
            requirements.expectedClasses.length > 0 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-muted/10 border-b border-border/40">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600">
                      <Layers className="size-4" />
                    </div>
                    Expected Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {requirements.expectedClasses.map((cls) => (
                      <Badge key={cls} variant="secondary" className="text-xs font-mono bg-muted/80 hover:bg-muted text-muted-foreground">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Expected Relationships */}
          {requirements.expectedRelationships &&
            requirements.expectedRelationships.length > 0 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-muted/10 border-b border-border/40">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                     <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-600">
                      <GitFork className="size-4" />
                    </div>
                    Expected Relationships
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2.5">
                    {requirements.expectedRelationships.map((rel, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs text-muted-foreground group"
                      >
                        <Badge variant="outline" className="text-[10px] uppercase shrink-0 bg-transparent border-border/60">
                          {rel.type}
                        </Badge>
                        <span className="truncate font-mono text-[11px] group-hover:text-foreground transition-colors">
                          <span className="text-foreground/80">{rel.source}</span> → <span className="text-foreground/80">{rel.target}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Expected Patterns */}
          {requirements.expectedPatterns &&
            requirements.expectedPatterns.length > 0 && (
               <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 bg-muted/10 border-b border-border/40">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600">
                      <Puzzle className="size-4" />
                    </div>
                    Design Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {requirements.expectedPatterns.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs bg-amber-500/5 text-amber-700/80 border border-amber-500/10 hover:bg-amber-500/10">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
