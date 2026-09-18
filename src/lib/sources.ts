import { SOURCES } from "@/data/sources";
import type { SourceRef } from "@/data/types";

const URL_RE = /https?:\/\/[^\s)\]>'"]+/gi;

const ALIASES: Record<string, string> = {
  élysée: "s-elysee",
  elysee: "s-elysee",
  "palais de l'élysée": "s-elysee",
  bercey: "s-bercy",
  bercy: "s-bercy",
  "ministère de l'économie": "s-bercy",
  "presse.economie": "s-bercy-presse",
  gouvernement: "s-gouv",
  "conseil des ministres": "s-gouv",
  "vie publique": "s-viepub",
  "assemblée": "s-assemblee",
  "assemblee nationale": "s-assemblee",
  sénat: "s-senat",
  senat: "s-senat",
  insee: "s-insee",
  "banque de france": "s-bdf",
  bdf: "s-bdf",
  aft: "s-aft",
  "agence france trésor": "s-aft",
  bce: "s-bce",
  ecb: "s-bce",
  fed: "s-fed",
  fomc: "s-fed",
  "federal reserve": "s-fed",
  "maison blanche": "s-wh",
  whitehouse: "s-wh",
  "seeking alpha": "s-seeking",
  "la tribune": "s-latribune",
  "usine nouvelle": "s-usinen",
  "les echos": "s-lesechos",
  "le monde": "s-lemonde",
  "le figaro": "s-figaro",
  "financial times": "s-ft",
  reuters: "s-reuters",
  bloomberg: "s-bloomberg",
  afp: "s-afp",
  "agence france-presse": "s-afp",
  "agence france presse": "s-afp",
  "wall street journal": "s-wsj",
  wsj: "s-wsj",
  cnbc: "s-cnbc",
  nikkei: "s-nikkei",
  tass: "s-tass",
  caixin: "s-caixin",
  "economic times": "s-et",
  bodacc: "s-bodacc",
  jorf: "s-jorf",
  "journal officiel": "s-jorf",
  légifrance: "s-legifrance",
  legifrance: "s-legifrance",
  "cour des comptes": "s-ccomptes",
  hcsf: "s-hcsf",
  cré: "s-cre",
  cre: "s-cre",
  rte: "s-rte",
  asn: "s-asn",
  ansm: "s-ansm",
  dares: "s-dares",
  agreste: "s-agreste",
  franceagrimer: "s-fam",
  "france agri mer": "s-fam",
  "france gaz": "s-francegaz",
  francegaz: "s-francegaz",
  valeo: "s-valeo",
  chapsvision: "s-chaps",
  "chaps vision": "s-chaps",
  dassault: "s-dassault",
  safran: "s-safran",
  thales: "s-thales",
  knds: "s-knds",
  mistral: "s-mistral",
  sanofi: "s-sanofi",
  renault: "s-renault",
  stellantis: "s-stellantis",
  capgemini: "s-capgemini",
  "bnp paribas": "s-bnp",
  totalenergies: "s-total",
  total: "s-total",
  carrefour: "s-carrefour",
  edf: "s-edf",
  orange: "s-orange",
  tf1: "s-tf1",
  lvmh: "s-lvmh",
  onu: "s-un",
  unga: "s-un",
  fmi: "s-imf",
  imf: "s-imf",
  ocde: "s-oecd",
  oecd: "s-oecd",
  iea: "s-iea",
  eia: "s-eia",
  fao: "s-fao",
  nbs: "s-nbs",
  pboc: "s-pboc",
  sipri: "s-sipri",
  euronext: "s-euronext",
  "lloyd's": "s-lloyds",
  lloyds: "s-lloyds",
  ukmto: "s-ukmto",
  "caisse des dépôts": "s-cdc",
  bpifrance: "s-bpifrance",
  ofce: "s-ofce",
  rexecode: "s-rexecode",
  "terra nova": "s-tnova",
  montaigne: "s-montaigne",
  arcep: "s-arcep",
  arcom: "s-arcom",
  adlc: "s-adlc",
  "autorité de la concurrence": "s-adlc",
  dga: "s-dga",
  "ministère des armées": "s-defense",
  cnes: "s-cnes",
  gifas: "s-gifas",
  bls: "s-bls-cpi",
  census: "s-census",
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fromCatalogId(id: string): SourceRef | null {
  const s = SOURCES.find((x) => x.id === id);
  return s ? { label: shortLabel(s.name), url: s.url } : null;
}

function shortLabel(name: string): string {
  return name.split("—")[0]?.trim() || name;
}

function hostnameLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return url;
  }
}

function matchFragment(fragment: string): SourceRef | null {
  const raw = fragment.trim();
  if (!raw) return null;
  const n = norm(raw);
  if (n.length < 2) return null;
  const alias = ALIASES[n] ?? ALIASES[raw.toLowerCase().trim()];
  if (alias) return fromCatalogId(alias);
  const byName = SOURCES.find((s) => {
    const sn = norm(s.name);
    return sn === n || sn.includes(n) || (n.length >= 5 && n.includes(sn.slice(0, 12)));
  });
  if (byName) return { label: shortLabel(byName.name), url: byName.url };
  for (const [key, id] of Object.entries(ALIASES)) {
    if (n.includes(key) || key.includes(n)) return fromCatalogId(id);
  }
  return null;
}

export function resolveSources(item: { source?: string; sources?: SourceRef[] }): SourceRef[] {
  const out: SourceRef[] = [];
  const seen = new Set<string>();
  const add = (ref: SourceRef | null | undefined) => {
    if (!ref?.url) return;
    const key = ref.url.replace(/\/+$/, "");
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label: ref.label || hostnameLabel(ref.url), url: ref.url });
  };

  for (const s of item.sources ?? []) add(s);

  if (item.source) {
    const urls = item.source.match(URL_RE) ?? [];
    for (const u of urls) add({ label: hostnameLabel(u), url: u });
    const parts = item.source.split(/[·|,;/]+/);
    for (const part of parts) {
      const cleaned = part.replace(URL_RE, "").trim();
      add(matchFragment(cleaned));
    }
    if (!out.length) add(matchFragment(item.source));
  }

  return out;
}
