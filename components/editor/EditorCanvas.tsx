"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import ClassNode from "./ClassNode";
import RelationshipEdge from "./RelationshipEdge";
import { UMLMarkerDefs } from "./UMLMarkerDefs";
import EditorToolbar from "./EditorToolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  ClassNodeData,
  RelationshipEdgeData,
  RelationshipType,
} from "./types";

// ── node & edge type registrations (stable reference) ──

const nodeTypes: NodeTypes = { class: ClassNode };
const edgeTypes: EdgeTypes = { relationship: RelationshipEdge };

// ── History helpers ──

interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
}

const MAX_HISTORY = 50;

// ── Component ──

interface EditorCanvasProps {
  problemId: string;
  problemTitle: string;
}

export default function EditorCanvas({
  problemId,
  problemTitle,
}: EditorCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [activeRelType, setActiveRelType] =
    useState<RelationshipType>("association");
  const [xmlPreviewOpen, setXmlPreviewOpen] = useState(false);

  // ── Undo / Redo ──
  const historyRef = useRef<HistoryEntry[]>([{ nodes: [], edges: [] }]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef = useRef(false);

  const pushHistory = useCallback(
    (nextNodes: Node[], nextEdges: Edge[]) => {
      if (skipHistoryRef.current) {
        skipHistoryRef.current = false;
        return;
      }
      const idx = historyIndexRef.current;
      // discard any future entries
      historyRef.current = historyRef.current.slice(0, idx + 1);
      historyRef.current.push({
        nodes: nextNodes.map((n) => ({ ...n })),
        edges: nextEdges.map((e) => ({ ...e })),
      });
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.shift();
      }
      historyIndexRef.current = historyRef.current.length - 1;
    },
    []
  );

  // Snapshot whenever nodes/edges change (debounce-free for simplicity)
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const canUndo = historyIndexRef.current > 0;
  const canRedo =
    historyIndexRef.current < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const entry = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    setNodes(entry.nodes);
    setEdges(entry.edges);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const entry = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    setNodes(entry.nodes);
    setEdges(entry.edges);
  }, [setNodes, setEdges]);

  // Save history on meaningful user interactions
  const handleNodesChange: typeof onNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      // push snapshot after a short tick so state is updated
      requestAnimationFrame(() => {
        pushHistory(nodesRef.current, edgesRef.current);
      });
    },
    [onNodesChange, pushHistory]
  );

  const handleEdgesChange: typeof onEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      requestAnimationFrame(() => {
        pushHistory(nodesRef.current, edgesRef.current);
      });
    },
    [onEdgesChange, pushHistory]
  );

  // ── Connection handler ──
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `e-${crypto.randomUUID()}`,
        type: "relationship",
        data: {
          relationshipType: activeRelType,
        } satisfies RelationshipEdgeData,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      requestAnimationFrame(() => {
        pushHistory(nodesRef.current, edgesRef.current);
      });
    },
    [activeRelType, setEdges, pushHistory]
  );

  // ── XML generation (minimal — full version in Step 11) ──
  const generateXml = useCallback(() => {
    const classNodes = nodes.filter((n) => n.type === "class") as (Node & {
      data: ClassNodeData;
    })[];

    const lines: string[] = ['<diagram>'];
    lines.push("  <classes>");
    for (const node of classNodes) {
      const d = node.data as ClassNodeData;
      const typeAttr = d.stereotype ?? "class";
      lines.push(`    <class name="${escapeXml(d.name)}" type="${typeAttr}">`);
      lines.push("      <attributes>");
      for (const attr of d.attributes) {
        lines.push(
          `        <attribute visibility="${attr.visibility}" name="${escapeXml(attr.name)}" type="${escapeXml(attr.type)}" />`
        );
      }
      lines.push("      </attributes>");
      lines.push("      <methods>");
      for (const method of d.methods) {
        lines.push(
          `        <method visibility="${method.visibility}" name="${escapeXml(method.name)}" returnType="${escapeXml(method.returnType)}" params="${escapeXml(method.parameters)}" />`
        );
      }
      lines.push("      </methods>");
      lines.push("    </class>");
    }
    lines.push("  </classes>");

    lines.push("  <relationships>");
    for (const edge of edges) {
      const d = edge.data as RelationshipEdgeData | undefined;
      if (!d) continue;
      const sourceNode = classNodes.find((n) => n.id === edge.source);
      const targetNode = classNodes.find((n) => n.id === edge.target);
      lines.push(
        `    <relationship type="${d.relationshipType}" source="${escapeXml(sourceNode?.data?.name ?? edge.source)}" target="${escapeXml(targetNode?.data?.name ?? edge.target)}"${d.sourceMultiplicity ? ` sourceMultiplicity="${escapeXml(d.sourceMultiplicity)}"` : ""}${d.targetMultiplicity ? ` targetMultiplicity="${escapeXml(d.targetMultiplicity)}"` : ""} />`
      );
    }
    lines.push("  </relationships>");
    lines.push("</diagram>");
    return lines.join("\n");
  }, [nodes, edges]);

  const [xmlContent, setXmlContent] = useState("");

  const handlePreviewXml = useCallback(() => {
    setXmlContent(generateXml());
    setXmlPreviewOpen(true);
  }, [generateXml]);

  const handleSubmit = useCallback(() => {
    // Placeholder: will be wired to submission API in Step 12
    const _xml = generateXml();
  }, [generateXml]);

  // ── Left sidebar: class list ──
  const classNodes = useMemo(
    () => nodes.filter((n) => n.type === "class") as (Node & { data: ClassNodeData })[],
    [nodes]
  );

  return (
    <div className="flex h-full">
      {/* ── Left sidebar: classes in diagram ── */}
      <div className="flex w-52 shrink-0 flex-col border-r bg-background">
        <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
          Classes ({classNodes.length})
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-0.5 p-1.5">
            {classNodes.map((node) => {
              const d = node.data as ClassNodeData;
              return (
                <button
                  key={node.id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/50"
                  onClick={() => {
                    // Focus on this node
                    setNodes((nds) =>
                      nds.map((n) => ({
                        ...n,
                        selected: n.id === node.id,
                      }))
                    );
                  }}
                >
                  <span className="truncate font-medium">
                    {d.stereotype ? `«${d.stereotype}» ` : ""}
                    {d.name || "Unnamed"}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {d.attributes.length}A {d.methods.length}M
                  </span>
                </button>
              );
            })}
            {classNodes.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                Add a class to start
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ── Main canvas area ── */}
      <div className="relative flex flex-1 flex-col">
        {/* Toolbar — floating */}
        <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
          <EditorToolbar
            activeRelationshipType={activeRelType}
            onRelationshipTypeChange={setActiveRelType}
            onPreviewXml={handlePreviewXml}
            onSubmit={handleSubmit}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        </div>

        {/* React Flow canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: "relationship" }}
          snapToGrid
          snapGrid={[16, 16]}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          className="flex-1"
        >
          <UMLMarkerDefs />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="rounded-lg border! bg-background/80!"
          />
        </ReactFlow>
      </div>

      {/* ── XML Preview Dialog ── */}
      <Dialog open={xmlPreviewOpen} onOpenChange={setXmlPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Diagram XML Preview</DialogTitle>
            <DialogDescription>
              This XML will be sent to the AI evaluation service.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto rounded-lg bg-muted">
            <pre className="p-4 text-xs leading-relaxed">
              <code>{xmlContent}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
