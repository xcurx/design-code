"use client";

import { memo, useState, type KeyboardEvent } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { getMarkerStart, getTargetMarker } from "./UMLMarkerDefs";
import type { RelationshipEdgeType, RelationshipType } from "./types";

const DASHED_TYPES: RelationshipType[] = ["dependency"];

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  style,
}: EdgeProps<RelationshipEdgeType>) {
  const relationshipType = data?.relationshipType ?? "association";

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const isDashed = DASHED_TYPES.includes(relationshipType);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={getMarkerStart(relationshipType)}
        markerEnd={getTargetMarker(relationshipType)}
        style={{
          ...style,
          strokeWidth: selected ? 2.5 : 2,
          stroke: selected ? "var(--ring)" : "var(--foreground)",
          strokeDasharray: isDashed ? "8 4" : undefined,
        }}
      />

      {/* ── Multiplicity Labels ── */}
      <EdgeLabelRenderer>
        {/* Source multiplicity (near source) */}
        {data?.sourceMultiplicity ? (
          <MultiplicityLabel
            edgeId={id}
            side="source"
            value={data.sourceMultiplicity}
            x={sourceX}
            y={sourceY}
            labelX={labelX}
            labelY={labelY}
          />
        ) : null}

        {/* Target multiplicity (near target) */}
        {data?.targetMultiplicity ? (
          <MultiplicityLabel
            edgeId={id}
            side="target"
            value={data.targetMultiplicity}
            x={targetX}
            y={targetY}
            labelX={labelX}
            labelY={labelY}
          />
        ) : null}

        {/* Edge type label at center */}
        {data?.label ? (
          <div
            className="nodrag nopan pointer-events-auto absolute rounded bg-background/80 px-1.5 py-0.5 text-xs text-muted-foreground"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {data.label}
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  );
}

/**
 * Multiplicity label positioned near the source or target end of the edge.
 * Offset slightly from the endpoint toward the center.
 */
function MultiplicityLabel({
  edgeId,
  side,
  value,
  x,
  y,
  labelX,
  labelY,
}: {
  edgeId: string;
  side: "source" | "target";
  value: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
}) {
  // Position the label 25% of the way from the endpoint toward the center
  const posX = x + (labelX - x) * 0.25;
  const posY = y + (labelY - y) * 0.25;

  return (
    <div
      data-edge-id={edgeId}
      data-side={side}
      className="nodrag nopan pointer-events-auto absolute rounded bg-background/90 px-1 py-0.5 text-xs font-medium text-foreground"
      style={{
        transform: `translate(-50%, -50%) translate(${posX}px,${posY}px)`,
      }}
    >
      {value}
    </div>
  );
}

export default memo(RelationshipEdge);
