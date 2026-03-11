import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Layers, GitFork, Puzzle } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {problem.title}
            </h2>
            <Badge
              variant="outline"
              className={difficultyColor[problem.difficulty]}
            >
              {problem.difficulty.charAt(0) +
                problem.difficulty.slice(1).toLowerCase()}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          render={<Link href={`/problems/${problem.id}/solve`} />}
          nativeButton={false}
          className="shrink-0"
        >
          Start Solving
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </CardContent>
          </Card>

          {/* Past Submissions */}
          {submissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {submissions.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/submissions/${sub.id}`}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="text-sm text-muted-foreground">
                        {sub.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        {sub.evaluation && (
                          <span className="text-sm font-semibold">
                            {Math.round(sub.evaluation.overallScore)}/100
                          </span>
                        )}
                        <Badge
                          variant="secondary"
                          className={statusColors[sub.status] ?? ""}
                        >
                          {sub.status.toLowerCase()}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Requirements */}
        <div className="space-y-4">
          {/* Expected Classes */}
          {requirements.expectedClasses &&
            requirements.expectedClasses.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    Expected Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {requirements.expectedClasses.map((cls) => (
                      <Badge key={cls} variant="outline" className="text-xs">
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <GitFork className="h-4 w-4" />
                    Expected Relationships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {requirements.expectedRelationships.map((rel, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {rel.type}
                        </Badge>
                        <span className="truncate">
                          {rel.source} → {rel.target}
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Puzzle className="h-4 w-4" />
                    Design Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {requirements.expectedPatterns.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
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
