import { addDays, format, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

/** Rolling 8-day forecast window: today → today+7. Past days drop off. */
export function forecastWindowStart(from: Date = new Date()): Date {
  return startOfDay(from);
}

export function forecastWindowDays(from: Date = new Date()): Date[] {
  const start = forecastWindowStart(from);
  return Array.from({ length: 8 }, (_, i) => addDays(start, i));
}

/** @deprecated Rolling window replaced Thursday→Thursday. Kept for any leftover import. */
export function editorialWeekStart(from: Date = new Date()): Date {
  return forecastWindowStart(from);
}

export function editorialWeekDays(from: Date = new Date()): Date[] {
  return forecastWindowDays(from);
}

export function toIsoDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** 18 / 09 / 2026 */
export function formatFrSlash(input: Date | string): string {
  const d = typeof input === "string" ? parseISO(input) : input;
  return format(d, "dd / MM / yyyy");
}

export function formatDayHeading(d: Date): string {
  return format(d, "EEEE d MMMM", { locale: fr });
}

export function formatDayShort(d: Date): string {
  return format(d, "EEE d", { locale: fr });
}

export function formatWeekRange(from: Date = new Date()): string {
  const days = forecastWindowDays(from);
  const a = days[0];
  const b = days[days.length - 1];
  if (!a || !b) return "";
  return `${formatFrSlash(a)} — ${formatFrSlash(b)}`;
}

export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = startOfDay(new Date(`${iso}T12:00:00`));
  const today = startOfDay(from);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
