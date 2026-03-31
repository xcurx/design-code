import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProblemsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border bg-muted/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3 w-full max-w-md">
          <div className="h-8 w-48 animate-pulse bg-muted rounded-md" />
          <div className="h-4 w-full animate-pulse bg-muted rounded-md" />
          <div className="h-4 w-3/4 animate-pulse bg-muted rounded-md" />
        </div>
        <div className="flex flex-col sm:items-end space-y-2">
          <div className="h-3 w-12 animate-pulse bg-muted rounded-md" />
          <div className="h-8 w-16 animate-pulse bg-muted rounded-md" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-2 h-[52px]">
        <div className="h-9 w-full sm:w-64 animate-pulse bg-muted rounded-md" />
        <div className="h-9 w-full sm:w-[280px] animate-pulse bg-muted rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col overflow-hidden border-border/40 bg-muted/5">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/10 h-14 justify-center">
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="h-5 w-3/4 animate-pulse bg-muted rounded-md" />
                <div className="h-5 w-12 animate-pulse bg-muted rounded-md rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse bg-muted rounded-md" />
                <div className="flex gap-1.5">
                  <div className="h-4 w-12 animate-pulse bg-muted rounded-md" />
                  <div className="h-4 w-16 animate-pulse bg-muted rounded-md" />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-full animate-pulse bg-muted rounded-md" />
                <div className="h-3 w-full animate-pulse bg-muted rounded-md" />
                <div className="h-3 w-4/5 animate-pulse bg-muted rounded-md" />
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                <div className="h-3 w-16 animate-pulse bg-muted rounded-md" />
                <div className="h-3 w-20 animate-pulse bg-muted rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
