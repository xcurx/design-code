import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Box, Puzzle, CheckCircle2, CircleDashed } from "lucide-react";
import { ProblemsFilter } from "@/components/problems-filter";

const difficultyColor: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  HARD: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; q?: string }>;
}) {
  const { difficulty, q } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  const [allProblems, userSubmissions] = await Promise.all([
    prisma.problem.findMany({
      orderBy: { createdAt: "asc" },
    }),
    userId
      ? prisma.submission.findMany({
          where: { userId },
          select: { problemId: true, status: true },
        })
      : Promise.resolve([]),
  ]);

  const filtered = difficulty && difficulty !== "ALL"
    ? allProblems.filter((p) => p.difficulty === difficulty)
    : allProblems;

  const problems = q
    ? filtered.filter((p) =>
        p.title.toLowerCase().includes(q.toLowerCase())
      )
    : filtered;

  // Track problem completion status
  const completedProblemIds = new Set(
    userSubmissions
      .filter((s) => s.status === "COMPLETED")
      .map((s) => s.problemId)
  );
  const attemptedProblemIds = new Set(
    userSubmissions
      .filter((s) => s.status !== "COMPLETED")
      .map((s) => s.problemId)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-primary/5 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
              Problem Directory
              <Sparkles className="size-5 text-amber-500" />
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Choose a Low-Level Design problem to practice. Problems range from standard OOP concepts to complex architectural challenges.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex flex-col items-center sm:items-end">
               <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Solved</span>
               <span className="text-2xl font-bold font-mono text-emerald-600">{completedProblemIds.size}<span className="text-sm text-muted-foreground">/{allProblems.length}</span></span>
             </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-8 size-60 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* ── Filters & Search ── */}
      <ProblemsFilter />

      {/* ── Problem Grid ── */}
      {problems.length === 0 ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 py-24 text-center mt-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl bg-muted/50 border shadow-sm mb-4">
              <Search className="size-6 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold text-foreground relative z-10">No problems found</h3>
            <p className="mt-1.5 mb-5 max-w-[300px] text-sm text-muted-foreground relative z-10">
              We couldn't find any problems matching your search. Try adjusting your filters or search term.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="relative z-10 shadow-sm"
              nativeButton={false}
              render={<Link href="/problems" />}
            >
              Clear Filters
            </Button>
          </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {problems.map((problem, idx) => {
            const requirements = problem.requirements as {
              expectedClasses?: string[];
              expectedPatterns?: string[];
            };

            const isCompleted = completedProblemIds.has(problem.id);
            const isAttempted = !isCompleted && attemptedProblemIds.has(problem.id);

            return (
              <Link 
                key={problem.id} 
                href={`/problems/${problem.id}`} 
                className="group h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 bg-gradient-to-b from-background to-background group-hover:to-muted/20">
                  <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                        {problem.title}
                      </CardTitle>
                      
                      {isCompleted ? (
                        <div className="shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-600 rounded-full p-1" title="Completed">
                          <CheckCircle2 className="size-4" />
                        </div>
                      ) : isAttempted ? (
                        <div className="shrink-0 flex items-center justify-center bg-amber-500/10 text-amber-600 rounded-full p-1" title="Attempted">
                          <CircleDashed className="size-4" />
                        </div>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 flex-1 flex flex-col">
                    
                    <div className="flex items-center justify-between">
                       <Badge
                        variant="outline"
                        className={`shrink-0 ${difficultyColor[problem.difficulty]}`}
                      >
                        {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
                      </Badge>
                      
                       <div className="flex flex-wrap justify-end gap-1.5">
                        {problem.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                      {problem.description
                        .replace(/^#.*\n/gm, "")
                        .replace(/\*\*/g, "")
                        .trim()}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 mb-1 border-t border-border/40">
                      <span className="flex items-center gap-1.5">
                        <Box className="size-3.5" />
                        {requirements.expectedClasses?.length ?? 0} classes
                      </span>
                      {(requirements.expectedPatterns?.length ?? 0) > 0 && (
                        <span className="flex items-center gap-1.5 border-l border-border/50 pl-4">
                          <Puzzle className="size-3.5" />
                          {requirements.expectedPatterns!.length} pattern{requirements.expectedPatterns!.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
