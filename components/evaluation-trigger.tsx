"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface EvaluationTriggerProps {
  submissionId: string;
  status: string;
}

/**
 * Client component that:
 * 1. Fires off the evaluate POST when status is PENDING
 * 2. Polls via router.refresh() while status is PENDING or EVALUATING
 *    so the server component re-fetches DB and eventually shows the result
 */
export function EvaluationTrigger({ submissionId, status }: EvaluationTriggerProps) {
  const router = useRouter();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Only fire the evaluate POST once, when status is PENDING
    if (!hasTriggered.current && status === "PENDING") {
      hasTriggered.current = true;

      (async () => {
        try {
          console.log("[EvaluationTrigger] Triggering evaluation for:", submissionId);
          const res = await fetch(`/api/submissions/${submissionId}/evaluate`, {
            method: "POST",
          });

          if (!res.ok) {
            console.error("Evaluation failed to start", await res.text());
          }
        } catch (e) {
          console.error("Evaluation trigger error:", e);
        }
      })();
    }

    // Keep polling as long as status is PENDING or EVALUATING
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [submissionId, status, router]);

  return null;
}
