import { cn } from "@/lib/utils";
import type { Direction } from "@/lib/types";

export function DirectionBadge({
  direction,
  className,
}: {
  direction: Direction;
  className?: string;
}) {
  const styles: Record<Direction, string> = {
    LONG: "bg-green-500/15 text-green-500 border-green-500/30",
    SHORT: "bg-red-500/15 text-red-500 border-red-500/30",
    WAIT: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    UNKNOWN: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold tracking-wide",
        styles[direction],
        className,
      )}
    >
      {direction}
    </span>
  );
}

export function GradeBadge({ grade }: { grade?: string }) {
  if (!grade) return null;
  const top = grade.startsWith("A");
  const mid = grade.startsWith("B");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold",
        top
          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
          : mid
            ? "bg-sky-500/15 text-sky-500 border-sky-500/30"
            : "bg-muted text-muted-foreground border-border",
      )}
    >
      {grade}
    </span>
  );
}
