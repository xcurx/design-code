import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Target,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600",
  EVALUATING: "bg-yellow-500/10 text-yellow-600",
  PENDING: "bg-blue-500/10 text-blue-600",
  FAILED: "bg-red-500/10 text-red-600",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [submissions, problemCount] = await Promise.all([
    prisma.submission.findMany({
      where: { userId: userId ?? "" },
      include: { problem: true, evaluation: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.problem.count(),
  ]);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}!
        </h2>
        <p className="text-muted-foreground">
          Practice UML class diagram design and get AI-powered feedback.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSubmissions.length > 0 ? `${averageScore}/100` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problems Attempted
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {problemsAttempted}/{problemCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Problems
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problemCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions + Quick Links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No submissions yet. Start solving a problem!
              </p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/submissions/${submission.id}`}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {submission.problem.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {submission.evaluation && (
                        <span className="text-sm font-semibold">
                          {Math.round(submission.evaluation.overallScore)}/100
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className={statusColors[submission.status] ?? ""}
                      >
                        {submission.status.toLowerCase()}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" variant="outline" nativeButton={false} render={<Link href="/problems" />}>
              Browse Problems
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline" nativeButton={false} render={<Link href="/submissions" />}>
              View All Submissions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
