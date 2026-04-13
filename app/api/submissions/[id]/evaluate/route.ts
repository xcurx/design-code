import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { LLDResponse } from "@/types/lld";

const GRADIO_URL = process.env.GRADIO_URL || "http://127.0.0.1:7860";

const DEFAULT_PROMPT = 
  "Please analyze the following UML class diagram and provide a detailed report on the structural validity, relationship correctness, and design quality of the classes and relationships.";

/**
 * Calls the Gradio SSE API using the two-step lifecycle:
 * 1. POST to /gradio_api/call/LLD with data array → get event_id
 * 2. GET /gradio_api/call/LLD/{event_id} → stream SSE until "complete" event
 */
async function callGradioSSE(diagramXml: string, userPrompt: string): Promise<LLDResponse> {
  // Step 1: POST to initiate the job and get an event_id
  const initResponse = await fetch(`${GRADIO_URL}/gradio_api/call/LLD`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [diagramXml, userPrompt]
    })
  });

  if (!initResponse.ok) {
    const errorText = await initResponse.text();
    throw new Error(`Gradio initiation failed (${initResponse.status}): ${errorText}`);
  }

  const { event_id } = await initResponse.json();

  if (!event_id) {
    throw new Error("Failed to receive event_id from AI Engine");
  }

  console.log(`[Evaluate] Got event_id: ${event_id}, connecting to SSE stream...`);

  // Step 2: GET the SSE stream and wait for the "complete" event
  const sseResponse = await fetch(`${GRADIO_URL}/gradio_api/call/LLD/${event_id}`);

  if (!sseResponse.ok) {
    throw new Error(`Gradio SSE stream failed (${sseResponse.status})`);
  }

  if (!sseResponse.body) {
    throw new Error("No response body from Gradio SSE stream");
  }

  // Parse the SSE stream manually on the server side
  const reader = sseResponse.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let resultData: any = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete SSE messages (separated by double newlines)
    const messages = buffer.split("\n\n");
    // Keep the last incomplete chunk in the buffer
    buffer = messages.pop() || "";

    for (const message of messages) {
      const lines = message.trim().split("\n");
      let eventType = "";
      let eventData = "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          eventData = line.slice(6).trim();
        }
      }

      if (eventType === "complete") {
        try {
          const parsed = JSON.parse(eventData);
          // Gradio wraps the output in an array
          resultData = Array.isArray(parsed) ? parsed[0] : parsed;
        } catch (e) {
          throw new Error(`Failed to parse Gradio complete event data: ${eventData}`);
        }
        reader.cancel();
        break;
      }

      if (eventType === "error") {
        throw new Error(`Gradio AI Engine error: ${eventData}`);
      }

      if (eventType === "heartbeat") {
        console.log(`[Evaluate] Heartbeat received, still processing...`);
      }
    }

    if (resultData !== null) break;
  }

  if (!resultData) {
    throw new Error("SSE stream ended without a complete event");
  }

  return resultData as LLDResponse;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve the submission
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { problem: true, evaluation: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (submission.status === "COMPLETED" && submission.evaluation) {
      return NextResponse.json({ error: "Submission already evaluated" }, { status: 400 });
    }

    // Update status to EVALUATING
    await prisma.submission.update({
      where: { id },
      data: { status: "EVALUATING" },
    });

    const diagramXml = submission.diagramXml;
    
    // Construct the prompt combining defaults and problem requirements
    const problemRequirementsContext = submission.problem.requirements
      ? `\n\nAdditionally, consider these requirements for the specific problem:\n${JSON.stringify(submission.problem.requirements, null, 2)}`
      : "";

    const userPrompt = DEFAULT_PROMPT + problemRequirementsContext;

    console.log(`[Evaluate] Initiating Gradio SSE call for submission ${id}...`);
    
    // Use the two-step SSE approach (fetch + stream) instead of @gradio/client
    // to avoid polyfill issues in Next.js Server Components
    const lldResponse = await callGradioSSE(diagramXml, userPrompt);

    // Persist Results in DB
    const { score, description, improvement } = lldResponse;

    const evaluation = await prisma.evaluation.create({
      data: {
        submissionId: id,
        overallScore: score.overall_score || 0,
        structuralScore: score.structural_validation || 0,
        patternScore: score.design_patterns || 0,
        principlesScore: score.solid_principles || 0,
        couplingCohesionScore: score.coupling_cohesion || 0,
        strengths: [], 
        violations: [], 
        suggestions: improvement?.improvement_tips || [],
        rawAgentOutput: {
          description,
          score,
          improvement
        } as any
      }
    });

    // Mark as COMPLETED
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: { status: "COMPLETED" },
      include: {
        evaluation: true,
      }
    });

    return NextResponse.json(updatedSubmission);
    
  } catch (error: any) {
    console.error("LLD Analysis evaluation route failed:", error);
    try {
      await markSubmissionAsFailed(id);
    } catch (e) {
      console.error("Failed to mark submission as failed", e);
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function markSubmissionAsFailed(id: string) {
  return prisma.submission.update({
    where: { id },
    data: { status: "FAILED" },
  });
}
