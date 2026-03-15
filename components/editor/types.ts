import type { Edge, Node } from "@xyflow/react";

export type Visibility = "+" | "-" | "#" | "~";

export interface UMLAttribute {
  id: string;
  visibility: Visibility;
  name: string;
  type: string;
}

export interface UMLMethod {
  id: string;
  visibility: Visibility;
  name: string;
  returnType: string;
  parameters: string;
}

export interface ClassNodeData {
  [key: string]: unknown;
  name: string;
  stereotype?: "interface" | "abstract";
  attributes: UMLAttribute[];
  methods: UMLMethod[];
  color?: string;
}

export type ClassNodeType = Node<ClassNodeData, "class">;

export const VISIBILITY_OPTIONS: Visibility[] = ["+", "-", "#", "~"];

export const HEADER_COLORS: Record<string, string> = {
  default: "bg-primary text-primary-foreground",
  blue: "bg-blue-600 text-white",
  green: "bg-emerald-600 text-white",
  purple: "bg-violet-600 text-white",
  orange: "bg-amber-600 text-white",
  red: "bg-rose-600 text-white",
};

// ── Edge / Relationship types ──

export type RelationshipType =
  | "inheritance"
  | "association"
  | "aggregation"
  | "composition"
  | "dependency";

export interface RelationshipEdgeData {
  [key: string]: unknown;
  relationshipType: RelationshipType;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  label?: string;
}

export type RelationshipEdgeType = Edge<RelationshipEdgeData, "relationship">;

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  inheritance: "Inheritance",
  association: "Association",
  aggregation: "Aggregation",
  composition: "Composition",
  dependency: "Dependency",
};
