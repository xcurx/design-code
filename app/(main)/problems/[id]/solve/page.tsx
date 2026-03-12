import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SolveEditor from "./solve-editor";

export default async function SolvePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: { id },
    select: { id: true, title: true },
  });

  if (!problem) notFound();

  return <SolveEditor problemId={problem.id} problemTitle={problem.title} />;
}
