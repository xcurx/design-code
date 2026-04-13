import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function SubmissionsHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      problem: { select: { title: true } },
      evaluation: { select: { overallScore: true } },
    },
  });

  return (
    <div className="container p-8 mx-auto max-w-5xl space-y-6 flex-1">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Submission History</h1>
        <p className="text-muted-foreground">View your past problem attempts and evaluations.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/submissions/${sub.id}`} className="block w-full h-full">
                      {sub.problem.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/submissions/${sub.id}`} className="w-full h-full flex items-center">
                      <Badge
                        variant={
                          sub.status === "COMPLETED"
                            ? "default"
                            : sub.status === "FAILED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/submissions/${sub.id}`} className="w-full h-full flex items-center">
                      {sub.evaluation ? (
                        <span
                          className={`font-semibold ${
                            sub.evaluation.overallScore >= 70
                              ? "text-green-500"
                              : sub.evaluation.overallScore >= 40
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {sub.evaluation.overallScore}/100
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <Link href={`/submissions/${sub.id}`} className="w-full h-full block">
                      {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
