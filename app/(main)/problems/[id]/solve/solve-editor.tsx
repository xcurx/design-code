"use client";

import { ReactFlowProvider } from "@xyflow/react";
import EditorCanvas from "@/components/editor/EditorCanvas";

interface SolveEditorProps {
  problemId: string;
  problemTitle: string;
}

export default function SolveEditor({
  problemId,
  problemTitle,
}: SolveEditorProps) {
  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] flex-col">
      <ReactFlowProvider>
        <EditorCanvas problemId={problemId} problemTitle={problemTitle} />
      </ReactFlowProvider>
    </div>
  );
}
