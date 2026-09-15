import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SECTORS, type SectorId } from "@/data/types";

const sectorIds = SECTORS.map((s) => s.id) as [SectorId, ...SectorId[]];

const lessonSchema = z.object({
  detected: z.string().trim().min(12).max(800),
  sourceUrl: z
    .string()
    .trim()
    .min(8)
    .max(500)
    .refine((s) => /^https?:\/\//i.test(s), "URL http(s) requise"),
  sourceName: z.string().trim().min(2).max(80),
  sector: z.enum(sectorIds),
  angle: z.string().trim().min(12).max(800),
  missed: z.string().trim().max(500).optional().default(""),
});

export type VeilleLesson = {
  id: number;
  detected: string;
  sourceUrl: string;
  sourceName: string;
  sector: string;
  angle: string;
  missed: string;
  createdAt: string;
};

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

export const listLessons = createServerFn({ method: "POST" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    detected: string;
    source_url: string;
    source_name: string;
    sector: string;
    angle: string;
    missed: string;
    created_at: unknown;
  }>`select id, detected, source_url, source_name, sector, angle, missed, created_at
     from veille_lessons
     order by created_at desc
     limit 80`;
  return rows.map(
    (r): VeilleLesson => ({
      id: r.id,
      detected: r.detected,
      sourceUrl: r.source_url,
      sourceName: r.source_name,
      sector: r.sector,
      angle: r.angle,
      missed: r.missed,
      createdAt: asIso(r.created_at),
    }),
  );
});

export const addLesson = createServerFn({ method: "POST" })
  .validator((input: unknown) => lessonSchema.parse(input))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into veille_lessons (detected, source_url, source_name, sector, angle, missed)
      values (${data.detected}, ${data.sourceUrl}, ${data.sourceName}, ${data.sector}, ${data.angle}, ${data.missed ?? ""})
      returning id
    `;
    return { ok: true as const, id: rows[0]?.id ?? 0 };
  });
