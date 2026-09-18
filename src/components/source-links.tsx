import { ExternalLink } from "lucide-react";
import type { MouseEvent } from "react";
import type { SourceRef } from "@/data/types";
import { resolveSources } from "@/lib/sources";
import { cn } from "@/lib/utils";

export function SourceLinks({
  item,
  sources,
  compact,
  className,
  onNavigate,
}: {
  item?: { source?: string; sources?: SourceRef[] };
  sources?: SourceRef[];
  compact?: boolean;
  className?: string;
  onNavigate?: (e: MouseEvent) => void;
}) {
  const list = sources ?? (item ? resolveSources(item) : []);
  if (!list.length) {
    return compact ? null : (
      <p className={cn("text-xs text-subtle", className)}>Source à recouper.</p>
    );
  }
  return (
    <ul className={cn("flex flex-wrap gap-x-3 gap-y-1", className)}>
      {list.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className={cn(
              "inline-flex items-center gap-1 underline-offset-4 hover:underline",
              compact ? "text-xs text-muted hover:text-fg" : "text-sm text-fg",
            )}
          >
            {s.label}
            <ExternalLink className="size-3 opacity-60" aria-hidden />
            <span className="sr-only">(ouvre un nouvel onglet)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
