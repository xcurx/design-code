"use client";

import { memo, useState, type KeyboardEvent } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEADER_COLORS,
  VISIBILITY_OPTIONS,
  type ClassNodeType,
  type ClassNodeData,
  type UMLAttribute,
  type UMLMethod,
  type Visibility,
} from "./types";

function ClassNode({ id, data, selected }: NodeProps<ClassNodeType>) {
  const { updateNodeData } = useReactFlow();
  const [editingField, setEditingField] = useState<string | null>(null);

  const headerColorClass = HEADER_COLORS[data.color ?? "default"] ?? HEADER_COLORS.default;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setEditingField(null);
    }
  };

  /** Only stop editing when focus moves outside the editing row container */
  const handleRowBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setEditingField(null);
    }
  };

  // ── Attribute actions ──

  function addAttribute() {
    const newAttr: UMLAttribute = {
      id: crypto.randomUUID(),
      visibility: "-",
      name: "attribute",
      type: "String",
    };
    updateNodeData(id, { attributes: [...data.attributes, newAttr] });
    setEditingField(`attr-${newAttr.id}`);
  }

  function updateAttribute(attrId: string, updates: Partial<UMLAttribute>) {
    updateNodeData(id, {
      attributes: data.attributes.map((a) =>
        a.id === attrId ? { ...a, ...updates } : a
      ),
    });
  }

  function removeAttribute(attrId: string) {
    updateNodeData(id, {
      attributes: data.attributes.filter((a) => a.id !== attrId),
    });
    if (editingField === `attr-${attrId}`) setEditingField(null);
  }

  // ── Method actions ──

  function addMethod() {
    const newMethod: UMLMethod = {
      id: crypto.randomUUID(),
      visibility: "+",
      name: "method",
      returnType: "void",
      parameters: "",
    };
    updateNodeData(id, { methods: [...data.methods, newMethod] });
    setEditingField(`method-${newMethod.id}`);
  }

  function updateMethod(methodId: string, updates: Partial<UMLMethod>) {
    updateNodeData(id, {
      methods: data.methods.map((m) =>
        m.id === methodId ? { ...m, ...updates } : m
      ),
    });
  }

  function removeMethod(methodId: string) {
    updateNodeData(id, {
      methods: data.methods.filter((m) => m.id !== methodId),
    });
    if (editingField === `method-${methodId}`) setEditingField(null);
  }

  return (
    <div
      className={cn(
        "min-w-50 rounded-md border border-border bg-card text-card-foreground shadow-md",
        selected && "ring-2 ring-ring"
      )}
    >
      {/* ── Connection Handles ── */}
      <Handle type="target" position={Position.Top} className="h-3! w-3! rounded-full! border-2! border-background! bg-primary!" />
      <Handle type="source" position={Position.Bottom} className="h-3! w-3! rounded-full! border-2! border-background! bg-primary!" />
      <Handle type="target" position={Position.Left} id="left" className="h-3! w-3! rounded-full! border-2! border-background! bg-primary!" />
      <Handle type="source" position={Position.Right} id="right" className="h-3! w-3! rounded-full! border-2! border-background! bg-primary!" />

      {/* ── Header: Stereotype + Class Name ── */}
      <div className={cn("rounded-t-md border-b border-border px-3 py-2 text-center", headerColorClass)}>
        {/* Stereotype */}
        {data.stereotype ? (
          editingField === "stereotype" ? (
            <select
              className="nodrag mx-auto block bg-transparent text-center text-xs italic outline-none"
              value={data.stereotype ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateNodeData(id, {
                  stereotype: (val || undefined) as ClassNodeData["stereotype"],
                });
              }}
              onBlur={() => setEditingField(null)}
              autoFocus
            >
              <option value="">None</option>
              <option value="interface">{"\u00AB"}interface{"\u00BB"}</option>
              <option value="abstract">{"\u00AB"}abstract{"\u00BB"}</option>
            </select>
          ) : (
            <div
              className="nodrag cursor-pointer text-xs italic opacity-80"
              onDoubleClick={() => setEditingField("stereotype")}
            >
              {`\u00AB${data.stereotype}\u00BB`}
            </div>
          )
        ) : null}

        {/* Class name */}
        {editingField === "name" ? (
          <input
            className={cn(
              "nodrag w-full bg-transparent text-center font-semibold outline-none",
              data.stereotype === "abstract" && "italic"
            )}
            value={data.name}
            onChange={(e) => updateNodeData(id, { name: e.target.value })}
            onBlur={() => setEditingField(null)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div
            className={cn(
              "nodrag cursor-pointer font-semibold",
              data.stereotype === "abstract" && "italic"
            )}
            onDoubleClick={() => setEditingField("name")}
          >
            {data.name || "ClassName"}
          </div>
        )}
      </div>

      {/* ── Attributes Compartment ── */}
      <div className="border-b border-border px-2 py-1.5 text-sm">
        {data.attributes.map((attr) => (
          <div
            key={attr.id}
            className="group/row flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/50"
          >
            {editingField === `attr-${attr.id}` ? (
              <div className="nodrag flex flex-1 items-center gap-1" onBlur={handleRowBlur}>
                <select
                  className="w-8 shrink-0 bg-transparent font-mono text-xs outline-none"
                  value={attr.visibility}
                  onChange={(e) =>
                    updateAttribute(attr.id, {
                      visibility: e.target.value as Visibility,
                    })
                  }
                >
                  {VISIBILITY_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <input
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  value={attr.name}
                  onChange={(e) =>
                    updateAttribute(attr.id, { name: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="name"
                  autoFocus
                />
                <span className="text-muted-foreground">:</span>
                <input
                  className="w-20 min-w-0 bg-transparent outline-none"
                  value={attr.type}
                  onChange={(e) =>
                    updateAttribute(attr.id, { type: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Type"
                />
                <button
                  className="shrink-0 text-destructive opacity-60 hover:opacity-100"
                  onClick={() => removeAttribute(attr.id)}
                  type="button"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className="nodrag flex-1 cursor-pointer font-mono"
                  onDoubleClick={() => setEditingField(`attr-${attr.id}`)}
                >
                  <span className="text-muted-foreground">
                    {attr.visibility}
                  </span>{" "}
                  {attr.name}
                  <span className="text-muted-foreground">: {attr.type}</span>
                </span>
                <button
                  className="nodrag shrink-0 text-destructive opacity-0 transition-opacity group-hover/row:opacity-60 hover:opacity-100!"
                  onClick={() => removeAttribute(attr.id)}
                  type="button"
                >
                  <Trash2 className="size-3" />
                </button>
              </>
            )}
          </div>
        ))}
        <button
          className="nodrag mt-0.5 flex w-full items-center gap-1 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          onClick={addAttribute}
          type="button"
        >
          <Plus className="size-3" />
          Attribute
        </button>
      </div>

      {/* ── Methods Compartment ── */}
      <div className="px-2 py-1.5 text-sm">
        {data.methods.map((method) => (
          <div
            key={method.id}
            className="group/row flex items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/50"
          >
            {editingField === `method-${method.id}` ? (
              <div className="nodrag flex flex-1 items-center gap-1" onBlur={handleRowBlur}>
                <select
                  className="w-8 shrink-0 bg-transparent font-mono text-xs outline-none"
                  value={method.visibility}
                  onChange={(e) =>
                    updateMethod(method.id, {
                      visibility: e.target.value as Visibility,
                    })
                  }
                >
                  {VISIBILITY_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <input
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  value={method.name}
                  onChange={(e) =>
                    updateMethod(method.id, { name: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="name"
                  autoFocus
                />
                <span className="text-muted-foreground">(</span>
                <input
                  className="w-24 min-w-0 bg-transparent outline-none"
                  value={method.parameters}
                  onChange={(e) =>
                    updateMethod(method.id, { parameters: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="params"
                />
                <span className="text-muted-foreground">):</span>
                <input
                  className="w-16 min-w-0 bg-transparent outline-none"
                  value={method.returnType}
                  onChange={(e) =>
                    updateMethod(method.id, { returnType: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="void"
                />
                <button
                  className="shrink-0 text-destructive opacity-60 hover:opacity-100"
                  onClick={() => removeMethod(method.id)}
                  type="button"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className="nodrag flex-1 cursor-pointer font-mono"
                  onDoubleClick={() => setEditingField(`method-${method.id}`)}
                >
                  <span className="text-muted-foreground">
                    {method.visibility}
                  </span>{" "}
                  {method.name}
                  <span className="text-muted-foreground">
                    ({method.parameters}): {method.returnType}
                  </span>
                </span>
                <button
                  className="nodrag shrink-0 text-destructive opacity-0 transition-opacity group-hover/row:opacity-60 hover:opacity-100!"
                  onClick={() => removeMethod(method.id)}
                  type="button"
                >
                  <Trash2 className="size-3" />
                </button>
              </>
            )}
          </div>
        ))}
        <button
          className="nodrag mt-0.5 flex w-full items-center gap-1 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          onClick={addMethod}
          type="button"
        >
          <Plus className="size-3" />
          Method
        </button>
      </div>
    </div>
  );
}

export default memo(ClassNode);
