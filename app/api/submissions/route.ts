import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, diagramXml } = body;

    if (!problemId || !diagramXml) {
      return NextResponse.json(
        { error: "problemId and diagramXml are required" },
        { status: 400 }
      );
    }

    // Check if the problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        diagramXml,
        status: "PENDING",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    const submissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        ...(problemId ? { problemId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        problem: {
          select: { title: true, difficulty: true },
        },
        evaluation: {
          select: { overallScore: true },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
