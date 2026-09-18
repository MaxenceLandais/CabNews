import { addDays, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { SECTORS, type EventItem, type KindId, type SectorId } from "@/data/types";
import { forecastWindowDays, toIsoDate } from "@/lib/week";

const WEEKDAYS: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

const MONTHS: Record<string, number> = {
  janvier: 1,
  fevrier: 2,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  aout: 8,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  decembre: 12,
  décembre: 12,
};

const SECTOR_KEYS: { id: SectorId; keys: string[] }[] = [
  { id: "defense", keys: ["défense", "defense", "armée", "dga", "lpm", "thales", "safran", "knds", "drone"] },
  { id: "aero", keys: ["aéronautique", "aeronautique", "airbus", "dassault", "rafale"] },
  { id: "auto", keys: ["auto", "renault", "stellantis", "valeo", "forvia", "byd"] },
  { id: "energy", keys: ["énergie", "energie", "gaz", "pétrole", "petrole", "edf", "total", "pac", "pompe à chaleur", "leasing"] },
  { id: "industry", keys: ["industrie", "arcelor", "acier", "made in europe", "usine"] },
  { id: "telecoms", keys: ["télécom", "telecom", "sfr", "orange", "bouygues"] },
  { id: "space", keys: ["spatial", "cnes", "satellite", "ariane"] },
  { id: "eti", keys: ["eti", "pme", "tpe"] },
  { id: "public-finance", keys: ["finances publiques", "aft", "oat", "déficit", "deficit", "dette"] },
  { id: "budget", keys: ["budget", "plf", "49.3", "lecornu"] },
  { id: "banking", keys: ["banque", "bnp", "société générale", "credit agricole"] },
  { id: "ma", keys: ["m&a", "rachat", "opa", "closing", "fusion"] },
  { id: "marches", keys: ["marché", "marche", "cac", "bourse", "brent", "fed", "bce"] },
  { id: "immobilier", keys: ["immobilier", "logement", "hcsf", "crédit immo"] },
  { id: "tech", keys: ["tech", "capgemini", "orange cyber", "chapsvision", "chatvision"] },
  { id: "ia", keys: ["ia", "intelligence artificielle", "mistral", "llm"] },
  { id: "education", keys: ["éducation", "education", "cfa", "apprentissage", "pisa"] },
  { id: "agriculture", keys: ["agriculture", "pêche", "peche", "blé", "ble", "agrimer"] },
  { id: "retail", keys: ["distribution", "carrefour", "leclerc", "retail"] },
  { id: "medias", keys: ["média", "media", "tf1", "arcom"] },
  { id: "sante", keys: ["santé", "sante", "hôpital", "ansm"] },
  { id: "pharma", keys: ["pharma", "sanofi", "médicament", "medicament"] },
  { id: "chine", keys: ["chine", "pékin", "pekin", "byd", "caixin"] },
  { id: "russie", keys: ["russie", "moscou", "gazprom"] },
  { id: "usa", keys: ["états-unis", "etats-unis", "washington", "fed", "trump"] },
  { id: "ukraine", keys: ["ukraine", "kyiv", "kiev", "odessa"] },
];

const KIND_KEYS: { id: KindId; keys: string[] }[] = [
  { id: "visit", keys: ["visite", "déplacement", "deplacement", "inaugur"] },
  { id: "meeting", keys: ["conférence", "conference", "congrès", "congres", "séminaire", "seminaire", "table ronde"] },
  { id: "nomination", keys: ["nomination", "nommé", "nomme", "prend la tête"] },
  { id: "publication", keys: ["publication", "rapport", "indice", "insee"] },
  { id: "deal", keys: ["rachat", "opa", "closing", "deal"] },
  { id: "deadline", keys: ["deadline", "échéance", "echeance", "date limite"] },
  { id: "political", keys: ["assemblée", "assemblee", "sénat", "senat", "plf", "ministre"] },
  { id: "earnings", keys: ["résultats", "resultats", "trimestre", "guidance"] },
  { id: "macro", keys: ["marché", "marche", "taux", "inflation"] },
  { id: "signal", keys: ["signal", "fuite", "bruit"] },
];

export interface ClassifiedNote {
  date: string;
  sector: SectorId;
  kind: KindId;
  title: string;
  event: EventItem;
}

function nextWeekday(from: Date, dow: number): Date {
  const d = startOfDay(from);
  const delta = (dow - d.getDay() + 7) % 7;
  return addDays(d, delta === 0 ? 0 : delta);
}

function parseDate(text: string, from: Date): string | null {
  const window = forecastWindowDays(from);
  const last = window[window.length - 1]!;
  const year = from.getFullYear();
  const lower = text.toLowerCase();

  const slash = lower.match(/\b(\d{1,2})\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{2,4}))?\b/);
  if (slash) {
    const day = Number(slash[1]);
    const month = Number(slash[2]);
    const y = slash[3] ? Number(slash[3].length === 2 ? `20${slash[3]}` : slash[3]) : year;
    return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const named = lower.match(/\b(\d{1,2})\s+(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre)\b/);
  if (named) {
    const day = Number(named[1]);
    const month = MONTHS[named[2]!] ?? 9;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  for (const [name, dow] of Object.entries(WEEKDAYS)) {
    if (lower.includes(name)) {
      const d = nextWeekday(from, dow);
      if (d <= last) return toIsoDate(d);
    }
  }

  if (/\b(ce mois|dans le mois|ce mois-ci|octobre|novembre)\b/.test(lower) && !/\bseptembre\b/.test(lower)) {
    return toIsoDate(last);
  }

  return null;
}

function parseSector(text: string): SectorId {
  const lower = text.toLowerCase();
  let best: { id: SectorId; n: number } | null = null;
  for (const row of SECTOR_KEYS) {
    const n = row.keys.reduce((acc, k) => acc + (lower.includes(k) ? k.length : 0), 0);
    if (n && (!best || n > best.n)) best = { id: row.id, n };
  }
  return best?.id ?? "industry";
}

function parseKind(text: string): KindId {
  const lower = text.toLowerCase();
  for (const row of KIND_KEYS) {
    if (row.keys.some((k) => lower.includes(k))) return row.id;
  }
  return "meeting";
}

function titleFrom(text: string): string {
  const line = text.split(/\n/)[0]?.trim() ?? text.trim();
  if (line.length <= 140) return line.replace(/\.$/, "");
  return `${line.slice(0, 137).trim()}…`;
}

export function classifyNote(text: string, from: Date = new Date()): ClassifiedNote {
  const date = parseDate(text, from) ?? toIsoDate(addDays(startOfDay(from), 1));
  const sector = parseSector(text);
  const kind = parseKind(text);
  const title = titleFrom(text);
  const id = `note-${Date.now().toString(36)}`;
  const event: EventItem = {
    id,
    date,
    title,
    lede: text.trim().slice(0, 600),
    bullets: ["Intégré depuis Mes Notes — à recouper avant papier.", `Classé automatiquement : ${SECTORS.find((s) => s.id === sector)?.label ?? sector}.`],
    kind,
    sectors: [sector],
    importance: "moyenne",
    confidence: "scenario",
    source: "Note de pupitre",
    sources: [],
    entities: [],
    whyItMatters: "Note de pupitre. Le brief apprend la source et l’acteur pour les récurrences suivantes.",
    followUp: "Garder le nom et le site. Relancer à la prochaine édition.",
    addedOn: toIsoDate(from),
    flash: true,
  };
  return { date, sector, kind, title, event };
}

export function formatClassified(c: ClassifiedNote): string {
  const d = new Date(`${c.date}T12:00:00`);
  return `${format(d, "EEEE d MMMM", { locale: fr })} · ${SECTORS.find((s) => s.id === c.sector)?.label ?? c.sector}`;
}
