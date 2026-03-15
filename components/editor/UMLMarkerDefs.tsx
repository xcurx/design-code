"use client";

import type { RelationshipType } from "./types";

/**
 * SVG marker definitions for UML relationship edges.
 * Render this once inside the ReactFlow wrapper (e.g. in the canvas component).
 */
export function UMLMarkerDefs() {
  return (
    <svg className="absolute h-0 w-0">
      <defs>
        {/* ── Inheritance: hollow triangle ── */}
        <marker
          id="uml-inheritance"
          viewBox="0 0 20 20"
          refX="20"
          refY="10"
          markerWidth="20"
          markerHeight="20"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 20 10 L 0 20 Z"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* ── Association: open arrow ── */}
        <marker
          id="uml-association"
          viewBox="0 0 20 20"
          refX="20"
          refY="10"
          markerWidth="14"
          markerHeight="14"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 20 10 L 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </marker>

        {/* ── Aggregation: hollow diamond ── */}
        <marker
          id="uml-aggregation"
          viewBox="0 0 24 16"
          refX="0"
          refY="8"
          markerWidth="24"
          markerHeight="16"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 8 L 12 0 L 24 8 L 12 16 Z"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* ── Composition: filled diamond ── */}
        <marker
          id="uml-composition"
          viewBox="0 0 24 16"
          refX="0"
          refY="8"
          markerWidth="24"
          markerHeight="16"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 8 L 12 0 L 24 8 L 12 16 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* ── Dependency: open arrow (same shape as association, used with dashed line) ── */}
        <marker
          id="uml-dependency"
          viewBox="0 0 20 20"
          refX="20"
          refY="10"
          markerWidth="14"
          markerHeight="14"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 20 10 L 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </marker>
      </defs>
    </svg>
  );
}

/** Returns the marker-end URL string for a given relationship type. */
export function getMarkerEnd(type: RelationshipType): string {
  return `url(#uml-${type})`;
}

/**
 * For aggregation/composition the diamond sits at the source side,
 * so we use markerStart instead of markerEnd.
 */
export function getMarkerStart(type: RelationshipType): string | undefined {
  if (type === "aggregation" || type === "composition") {
    return `url(#uml-${type})`;
  }
  return undefined;
}

/**
 * The target-side marker: arrow for association/dependency/inheritance,
 * none for aggregation/composition (diamond is on source side only).
 */
export function getTargetMarker(type: RelationshipType): string | undefined {
  if (type === "aggregation" || type === "composition") {
    return undefined;
  }
  return `url(#uml-${type})`;
}
