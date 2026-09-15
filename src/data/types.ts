export const SECTOR_GROUPS = [
  {
    id: "industrie",
    label: "Industrie",
    sectors: ["defense", "aero", "auto", "energy", "industry", "telecoms", "space", "eti"],
  },
  {
    id: "eco",
    label: "Éco & finance",
    sectors: ["public-finance", "budget", "banking", "ma", "marches", "immobilier"],
  },
  {
    id: "tech",
    label: "Tech",
    sectors: ["tech", "ia"],
  },
  {
    id: "societe",
    label: "Société",
    sectors: ["education", "agriculture", "retail", "medias", "sante", "pharma"],
  },
  {
    id: "monde",
    label: "Monde",
    sectors: ["chine", "russie", "usa", "ukraine"],
  },
] as const;

export const SECTORS = [
  { id: "defense", label: "Défense" },
  { id: "aero", label: "Aéronautique" },
  { id: "tech", label: "Tech" },
  { id: "ia", label: "IA" },
  { id: "energy", label: "Énergie" },
  { id: "industry", label: "Industrie" },
  { id: "public-finance", label: "Finances publiques" },
  { id: "telecoms", label: "Télécoms" },
  { id: "space", label: "Spatial" },
  { id: "ma", label: "M&A" },
  { id: "banking", label: "Banque d'affaires" },
  { id: "auto", label: "Automobile" },
  { id: "immobilier", label: "Immobilier" },
  { id: "marches", label: "Marchés financiers" },
  { id: "eti", label: "ETI" },
  { id: "education", label: "Éducation" },
  { id: "budget", label: "Budget" },
  { id: "agriculture", label: "Agriculture" },
  { id: "retail", label: "Grande distribution" },
  { id: "medias", label: "Médias" },
  { id: "sante", label: "Santé" },
  { id: "pharma", label: "Pharma" },
  { id: "chine", label: "Chine" },
  { id: "russie", label: "Russie" },
  { id: "usa", label: "États-Unis" },
  { id: "ukraine", label: "Ukraine" },
] as const;

export type SectorId = (typeof SECTORS)[number]["id"];
export type SectorGroupId = (typeof SECTOR_GROUPS)[number]["id"];

export const KINDS = [
  { id: "macro", label: "Éco / marchés" },
  { id: "earnings", label: "Résultats" },
  { id: "meeting", label: "Meeting" },
  { id: "visit", label: "Visite officielle" },
  { id: "publication", label: "Publication" },
  { id: "nomination", label: "Nomination" },
  { id: "deadline", label: "Deadline" },
  { id: "deal", label: "Deal / M&A" },
  { id: "signal", label: "Signal faible" },
  { id: "anniversary", label: "Anniversaire" },
  { id: "ranking", label: "Classement" },
  { id: "political", label: "Politique" },
] as const;

export type KindId = (typeof KINDS)[number]["id"];

export const WEEK_KIND_FILTERS = [
  { id: "all", label: "Toute la semaine" },
  { id: "macro", label: "Éco / marchés" },
  { id: "earnings", label: "Résultats" },
  { id: "meeting", label: "Meetings" },
  { id: "visit", label: "Visites" },
  { id: "publication", label: "Publications" },
  { id: "nomination", label: "Nominations" },
  { id: "deal", label: "Deals" },
  { id: "deadline", label: "Deadlines" },
] as const;

export type WeekKindFilter = (typeof WEEK_KIND_FILTERS)[number]["id"];

export type Importance = "haute" | "moyenne" | "veille";
export type Confidence = "confirme" | "recurrence" | "scenario";
export type PromiseStatus = "en_cours" | "tenu" | "manque" | "expire_bientot" | "a_verifier";

export interface SourceRef {
  label: string;
  url: string;
}

export interface EventItem {
  id: string;
  date: string;
  time?: string;
  title: string;
  lede: string;
  bullets: string[];
  kind: KindId;
  sectors: SectorId[];
  importance: Importance;
  confidence: Confidence;
  source?: string;
  sources?: SourceRef[];
  location?: string;
  entities: string[];
  whyItMatters: string;
  followUp?: string;
  relatedPromiseIds?: string[];
  addedOn: string;
  updatedOn?: string;
  flash?: boolean;
}

export interface PromiseItem {
  id: string;
  actor: string;
  role: string;
  pledge: string;
  pledgedOn: string;
  deadline: string;
  status: PromiseStatus;
  sector: SectorId;
  checkpoint: string;
  source: string;
  sources?: SourceRef[];
}

export interface AnniversaryItem {
  id: string;
  date: string;
  years: number;
  title: string;
  kind: "creation" | "rachat" | "fusion" | "cession" | "deal" | "prise_de_poste";
  entities: string[];
  sector: SectorId;
  angle: string;
  sources?: SourceRef[];
}

export interface PublicationItem {
  id: string;
  date: string;
  time?: string;
  title: string;
  publisher: string;
  recurrence: string;
  sector: SectorId;
  whyItMatters: string;
  previous?: string;
  sources?: SourceRef[];
  ranking?: boolean;
}

export interface ScenarioItem {
  id: string;
  title: string;
  question: string;
  sector: SectorId;
  status: string;
  nextCatalyst: string;
  hypotheses: { label: string; likelihood: string; implication: string }[];
}

export interface WeakSignalItem {
  id: string;
  title: string;
  thesis: string;
  evidence: string[];
  watch: string;
  risk: "sous-tension" | "acquereur" | "faillite" | "deal" | "macro";
  sectors: SectorId[];
  entities: string[];
  source: string;
  sources?: SourceRef[];
}

export interface NominationItem {
  id: string;
  date: string;
  person: string;
  role: string;
  organization: string;
  previous?: string;
  sector: SectorId;
  whyItMatters: string;
  source: string;
  sources?: SourceRef[];
  scope: "france" | "international" | "eti";
}

export interface VizSeriesPoint {
  period: string;
  [key: string]: string | number;
}

export interface VizKey {
  key: string;
  label: string;
  axis?: "left" | "right";
}

export interface VizProposal {
  id: string;
  title: string;
  question: string;
  angle: string;
  chart: "line" | "bar" | "area" | "composed";
  unitLeft: string;
  unitRight?: string;
  series: VizSeriesPoint[];
  keys: VizKey[];
  sources: SourceRef[];
  note: string;
}

export interface CrawlRefresh {
  id: string;
  date: string;
  time: string;
  summary: string;
  sourcesCrawled: number;
  added: string[];
  revised: string[];
  highlights: string[];
}

export interface SourceEntry {
  id: string;
  name: string;
  url: string;
  kind: "officiel" | "agenda" | "institut" | "corporate" | "presse" | "marche";
  country: string;
  usedFor: string;
  lastCrawl: string;
}

export interface SaHeadline {
  id: string;
  date: string;
  title: string;
  ticker: string;
  company: string;
  sector: SectorId;
  url: string;
  deduction: string;
  watch: string;
}

export function sectorLabel(id: SectorId): string {
  return SECTORS.find((s) => s.id === id)?.label ?? id;
}

export function kindLabel(id: KindId): string {
  return KINDS.find((k) => k.id === id)?.label ?? id;
}

export function groupSectors(groupId: SectorGroupId): SectorId[] {
  const g = SECTOR_GROUPS.find((x) => x.id === groupId);
  return g ? [...g.sectors] : [];
}
