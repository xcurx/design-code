import type { Node, Edge } from "@xyflow/react";
import type {
  ClassNodeData,
  RelationshipEdgeData,
  RelationshipType,
  Visibility,
  UMLAttribute,
  UMLMethod,
} from "./types";

const VALID_RELATIONSHIP_TYPES = new Set<RelationshipType>([
  "inheritance",
  "association",
  "aggregation",
  "composition",
  "dependency",
]);

const VALID_VISIBILITIES = new Set<string>(["+", "-", "#", "~"]);

/**
 * Parse a UML diagram XML string and produce React Flow nodes and edges.
 * Auto-layouts classes in a grid so they don't overlap.
 */
export function parseXmlToDiagram(xmlString: string): {
  nodes: Node[];
  edges: Edge[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML: " + parseError.textContent);
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Map class name → node ID for relationship wiring
  const nameToId = new Map<string, string>();

  // ── Parse classes ──
  const classEls = doc.querySelectorAll("class");
  const GRID_COLS = Math.max(3, Math.ceil(Math.sqrt(classEls.length)));
  const CELL_W = 320;
  const CELL_H = 300;

  classEls.forEach((classEl, index) => {
    const name = classEl.getAttribute("name") || `Class${index + 1}`;
    const typeAttr = classEl.getAttribute("type") || "class";

    // Map type attribute to stereotype
    let stereotype: ClassNodeData["stereotype"] = undefined;
    if (typeAttr === "interface") stereotype = "interface";
    else if (typeAttr === "abstract") stereotype = "abstract";

    // Parse attributes
    const attributes: UMLAttribute[] = [];
    classEl.querySelectorAll("attributes > attribute").forEach((attrEl) => {
      const vis = attrEl.getAttribute("visibility") || "+";
      attributes.push({
        id: crypto.randomUUID(),
        visibility: VALID_VISIBILITIES.has(vis) ? (vis as Visibility) : "+",
        name: attrEl.getAttribute("name") || "field",
        type: attrEl.getAttribute("type") || "string",
      });
    });

    // Parse methods
    const methods: UMLMethod[] = [];
    classEl.querySelectorAll("methods > method").forEach((methodEl) => {
      const vis = methodEl.getAttribute("visibility") || "+";
      methods.push({
        id: crypto.randomUUID(),
        visibility: VALID_VISIBILITIES.has(vis) ? (vis as Visibility) : "+",
        name: methodEl.getAttribute("name") || "method",
        returnType: methodEl.getAttribute("returnType") || "void",
        parameters: methodEl.getAttribute("params") || "",
      });
    });

    const nodeId = crypto.randomUUID();
    nameToId.set(name, nodeId);

    // Grid layout
    const col = index % GRID_COLS;
    const row = Math.floor(index / GRID_COLS);

    const data: ClassNodeData = {
      name,
      stereotype,
      attributes,
      methods,
    };

    nodes.push({
      id: nodeId,
      type: "class",
      position: {
        x: 60 + col * CELL_W,
        y: 60 + row * CELL_H,
      },
      data,
    });
  });

  // ── Parse relationships ──
  const relEls = doc.querySelectorAll("relationship");
  relEls.forEach((relEl) => {
    const rawType = relEl.getAttribute("type") || "association";
    const relType: RelationshipType = VALID_RELATIONSHIP_TYPES.has(
      rawType as RelationshipType
    )
      ? (rawType as RelationshipType)
      : "association";

    const sourceName = relEl.getAttribute("source") || "";
    const targetName = relEl.getAttribute("target") || "";

    const sourceId = nameToId.get(sourceName);
    const targetId = nameToId.get(targetName);

    if (!sourceId || !targetId) {
      console.warn(
        `[XML Import] Skipping relationship: source="${sourceName}" or target="${targetName}" not found`
      );
      return;
    }

    const edgeData: RelationshipEdgeData = {
      relationshipType: relType,
      sourceMultiplicity: relEl.getAttribute("sourceMultiplicity") || undefined,
      targetMultiplicity: relEl.getAttribute("targetMultiplicity") || undefined,
    };

    edges.push({
      id: `e-${crypto.randomUUID()}`,
      source: sourceId,
      target: targetId,
      type: "relationship",
      data: edgeData,
    });
  });

  return { nodes, edges };
}
