import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { VIZ } from "@/data/catalog";
import type { VizProposal } from "@/data/types";
import { PageHeader } from "@/components/page-header";

const STROKES = [
  "var(--color-accent)",
  "var(--color-paper)",
  "var(--color-ok)",
  "var(--color-warn)",
  "var(--color-muted)",
];

export function DatavizView() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Cinq propositions de la semaine">
        Données officielles uniquement — Insee, Banque de France, AFT, CCFA / SDES, Caisse des Dépôts,
        Bundesbank. L’originalité est l’angle, pas la source. Cinq images pour la conférence de
        rédaction, pas un dashboard.
      </PageHeader>
      {VIZ.map((v, i) => (
        <VizCard key={v.id} viz={v} index={i + 1} />
      ))}
    </div>
  );
}

function VizCard({ viz, index }: { viz: VizProposal; index: number }) {
  return (
    <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
      <p className="font-mono text-xs tracking-wider text-accent uppercase">
        Proposition {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-1 font-serif text-2xl tracking-tight">{viz.title}</h2>
      <p className="mt-2 text-sm font-medium leading-snug text-fg">{viz.question}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{viz.angle}</p>
      <div className="mt-5 h-72 w-full">
        <Chart viz={viz} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-subtle">{viz.note}</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {viz.sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Chart({ viz }: { viz: VizProposal }) {
  const tooltip = {
    contentStyle: {
      background: "var(--color-elevated)",
      border: "1px solid var(--color-line)",
      borderRadius: 8,
      color: "var(--color-fg)",
      fontSize: 12,
    },
    labelStyle: { color: "var(--color-muted)" },
  };

  if (viz.chart === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={viz.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltip} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-muted)" }} />
          {viz.keys.map((k, i) => (
            <Bar key={k.key} dataKey={k.key} name={k.label} fill={STROKES[i] ?? STROKES[0]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (viz.chart === "area") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={viz.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} unit=" %" />
          <Tooltip {...tooltip} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-muted)" }} />
          {viz.keys.map((k, i) => (
            <Area
              key={k.key}
              type="monotone"
              dataKey={k.key}
              name={k.label}
              stackId="a"
              stroke={STROKES[i] ?? STROKES[0]}
              fill={STROKES[i] ?? STROKES[0]}
              fillOpacity={0.25}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (viz.chart === "composed") {
    const left = viz.keys.find((k) => k.axis === "left") ?? viz.keys[0];
    const right = viz.keys.find((k) => k.axis === "right") ?? viz.keys[1];
    if (!left || !right) return null;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={viz.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} unit=" €" />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...tooltip} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-muted)" }} />
          <Bar yAxisId="left" dataKey={left.key} name={left.label} fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={right.key}
            name={right.label}
            stroke="var(--color-paper)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={viz.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltip} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-muted)" }} />
        {viz.keys.map((k, i) => (
          <Line
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.label}
            stroke={STROKES[i] ?? STROKES[0]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
