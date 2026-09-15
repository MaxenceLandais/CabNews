import { addDays, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

/** Editorial week starts Thursday. If `from` is Thursday, that day is day 1. */
export function editorialWeekStart(from: Date = new Date()): Date {
  const d = startOfDay(from);
  const sinceThursday = (d.getDay() - 4 + 7) % 7;
  return addDays(d, -sinceThursday);
}

/** Thursday → next Thursday inclusive (8 days). */
export function editorialWeekDays(from: Date = new Date()): Date[] {
  const start = editorialWeekStart(from);
  return Array.from({ length: 8 }, (_, i) => addDays(start, i));
}

export function toIsoDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function formatDayHeading(d: Date): string {
  return format(d, "EEEE d MMMM", { locale: fr });
}

export function formatDayShort(d: Date): string {
  return format(d, "EEE d", { locale: fr });
}

export function formatWeekRange(from: Date = new Date()): string {
  const days = editorialWeekDays(from);
  const a = days[0];
  const b = days[days.length - 1];
  if (!a || !b) return "";
  if (a.getMonth() === b.getMonth()) {
    return `${format(a, "d", { locale: fr })} – ${format(b, "d MMMM yyyy", { locale: fr })}`;
  }
  return `${format(a, "d MMM", { locale: fr })} – ${format(b, "d MMM yyyy", { locale: fr })}`;
}

export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = startOfDay(new Date(`${iso}T12:00:00`));
  const today = startOfDay(from);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
