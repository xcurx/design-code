"use client";

import {
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import {
  BoxSelect,
  ChevronDown,
  Code2,
  Minus,
  Plus,
  Redo2,
  Send,
  Undo2,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  RELATIONSHIP_LABELS,
  type ClassNodeData,
  type RelationshipType,
} from "./types";

interface EditorToolbarProps {
  activeRelationshipType: RelationshipType;
  onRelationshipTypeChange: (type: RelationshipType) => void;
  onPreviewXml: () => void;
  onSubmit: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const RELATIONSHIP_ICONS: Record<RelationshipType, string> = {
  inheritance: "△",
  association: "→",
  aggregation: "◇",
  composition: "◆",
  dependency: "⇢",
};

export default function EditorToolbar({
  activeRelationshipType,
  onRelationshipTypeChange,
  onPreviewXml,
  onSubmit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorToolbarProps) {
  const { addNodes, zoomIn, zoomOut, fitView } = useReactFlow();

  function addClassNode(stereotype?: ClassNodeData["stereotype"]) {
    const id = crypto.randomUUID();
    const data: ClassNodeData = {
      name: stereotype === "interface" ? "IInterface" : "ClassName",
      stereotype,
      attributes: [],
      methods: [],
    };
    addNodes({
      id,
      type: "class",
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data,
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background/95 px-2 py-1 shadow-sm backdrop-blur-sm">
      {/* ── Add nodes ── */}
      <Button variant="outline" size="sm" onClick={() => addClassNode()}>
        <Plus className="size-3.5" />
        Class
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => addClassNode("interface")}
      >
        <BoxSelect className="size-3.5" />
        Interface
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* ── Relationship type selector ── */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" />}
        >
          <span className="mr-1 font-mono text-xs">
            {RELATIONSHIP_ICONS[activeRelationshipType]}
          </span>
          {RELATIONSHIP_LABELS[activeRelationshipType]}
          <ChevronDown className="ml-1 size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6}>
          {(Object.keys(RELATIONSHIP_LABELS) as RelationshipType[]).map(
            (type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => onRelationshipTypeChange(type)}
              >
                <span className="mr-2 w-4 text-center font-mono text-xs">
                  {RELATIONSHIP_ICONS[type]}
                </span>
                {RELATIONSHIP_LABELS[type]}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* ── Undo / Redo ── */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        <Undo2 className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
      >
        <Redo2 className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* ── Zoom controls ── */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => zoomIn()}
        aria-label="Zoom in"
      >
        <ZoomIn className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => zoomOut()}
        aria-label="Zoom out"
      >
        <ZoomOut className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => fitView({ padding: 0.2 })}
        aria-label="Fit view"
      >
        <Maximize className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* ── Actions ── */}
      <Button variant="outline" size="sm" onClick={onPreviewXml}>
        <Code2 className="size-3.5" />
        Preview XML
      </Button>
      <Button size="sm" onClick={onSubmit}>
        <Send className="size-3.5" />
        Submit
      </Button>
    </div>
  );
}
