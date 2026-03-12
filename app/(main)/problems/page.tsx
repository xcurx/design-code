import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const difficultyColor: Record<string, string> = {
  EASY: "bg-green-500/10 text-green-600 border-green-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  HARD: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string; q?: string }>;
}) {
  const { difficulty, q } = await searchParams;

  const allProblems = await prisma.problem.findMany({
    orderBy: { createdAt: "asc" },
  });

  const filtered = difficulty && difficulty !== "ALL"
    ? allProblems.filter((p) => p.difficulty === difficulty)
    : allProblems;

  const problems = q
    ? filtered.filter((p) =>
        p.title.toLowerCase().includes(q.toLowerCase())
      )
    : filtered;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Problems</h2>
        <p className="text-muted-foreground">
          Choose a Low-Level Design problem to practice.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="q"
            placeholder="Search problems..."
            defaultValue={q ?? ""}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => (
            <button
              key={level}
              type="submit"
              name="difficulty"
              value={level}
              className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent ${
                (difficulty ?? "ALL") === level
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input text-muted-foreground"
              }`}
            >
              {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </form>
      </div>

      {/* Problem Grid */}
      {problems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No problems found. Try adjusting your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => {
            const requirements = problem.requirements as {
              expectedClasses?: string[];
              expectedPatterns?: string[];
            };

            return (
              <Link key={problem.id} href={`/problems/${problem.id}`}>
                <Card className="h-full cursor-pointer transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">
                        {problem.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ${difficultyColor[problem.difficulty]}`}
                      >
                        {problem.difficulty.charAt(0) +
                          problem.difficulty.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {problem.description
                        .replace(/^#.*\n/gm, "")
                        .replace(/\*\*/g, "")
                        .trim()
                        .slice(0, 120)}
                      ...
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs transition-colors hover:bg-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {requirements.expectedClasses?.length ?? 0} classes
                      </span>
                      {(requirements.expectedPatterns?.length ?? 0) > 0 && (
                        <span>
                          {requirements.expectedPatterns!.length} pattern
                          {requirements.expectedPatterns!.length > 1 ? "s" : ""}
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
