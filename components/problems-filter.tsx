"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, XCircle } from "lucide-react";

export function ProblemsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQ = searchParams.get("q") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "ALL";
  
  const [q, setQ] = useState(defaultQ);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`/problems?${params.toString()}`);
  };

  const clearSearch = () => {
    setQ("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/problems?${params.toString()}`);
  };

  const setDifficulty = (level: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (level === "ALL") {
      params.delete("difficulty");
    } else {
      params.set("difficulty", level);
    }
    router.push(`/problems?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-10 -mx-2 px-2">
      <form onSubmit={handleSearch} className="flex w-full sm:w-auto flex-wrap sm:flex-nowrap items-center gap-3">
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => handleSearch()}
            placeholder="Search problems..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-8 text-sm shadow-sm transition-all placeholder:text-muted-foreground hover:border-accent-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:shadow-md"
          />
          {q && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XCircle className="size-4" />
            </button>
          )}
        </div>
        
        <div className="flex w-full sm:w-auto p-1 items-center bg-muted/50 rounded-lg border">
          {["ALL", "EASY", "MEDIUM", "HARD"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`inline-flex flex-1 sm:flex-none justify-center h-7 items-center rounded-md px-3 text-xs font-semibold transition-all ${
                difficulty === level
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
