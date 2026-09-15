import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SECTOR_GROUPS, SECTORS, sectorLabel, type SectorId } from "@/data/types";
import { useCabinet } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SectorBar({ compact }: { compact?: boolean }) {
  const sectors = useCabinet((s) => s.sectors);
  const toggleSector = useCabinet((s) => s.toggleSector);
  const setOnlySector = useCabinet((s) => s.setOnlySector);
  const clearSectors = useCabinet((s) => s.clearSectors);

  const selectValue = sectors.length === 1 ? sectors[0] : "";

  return (
    <div className="no-print flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Choisir un secteur parmi les 26</span>
          <select
            value={selectValue}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) clearSectors();
              else setOnlySector(v as SectorId);
            }}
            className="h-11 w-full appearance-none rounded-md border border-line bg-elevated py-0 pr-10 pl-3 text-sm text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="">Tous les secteurs</option>
            {SECTOR_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.sectors.map((id) => (
                  <option key={id} value={id}>
                    {sectorLabel(id)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle" />
        </label>
        {sectors.length > 0 ? (
          <p className="shrink-0 font-mono text-xs text-muted">
            {sectors.length === 1
              ? `Bureau ${sectorLabel(sectors[0]!)} uniquement`
              : `${sectors.length} bureaux`}
          </p>
        ) : null}
      </div>

      {compact ? null : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            <FilterChip active={sectors.length === 0} onClick={clearSectors}>
              Tous
            </FilterChip>
            {SECTORS.map((s) => (
              <FilterChip
                key={s.id}
                active={sectors.includes(s.id)}
                onClick={() => toggleSector(s.id)}
              >
                {s.label}
              </FilterChip>
            ))}
          </div>
          <p className="text-xs text-subtle">
            26 bureaux. Un clic = ce bureau. Les tags secondaires (pétrole dans une puces marchés,
            logiciel dans une puces auto) ne polluent plus la sélection.
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors duration-150",
        active ? "bg-paper text-paper-ink" : "text-muted hover:bg-elevated hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
