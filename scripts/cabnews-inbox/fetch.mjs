#!/usr/bin/env node
/**
 * CabNews source inbox — mechanical OPEN-source collection (no LLM).
 * Soft-fails per source; writes inbox/sources/*.json for Grok Bot MAJ routines.
 *
 * Usage: node scripts/cabnews-inbox/fetch.mjs
 * Exit 0 if ≥1 source succeeded.
 */

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "inbox", "sources");
const USER_AGENT =
  "CabNewsInbox/1.0 (+https://github.com/MaxenceLandais/CabNews; open-source feed collector; no LLM)";
const FETCH_TIMEOUT_MS = 25_000;
const MAX_ITEMS_PER_SOURCE = 40;
const PRUNE_DAYS = 14;
const TZ = "Europe/Paris";

/** @typedef {{ id: string, title: string, url: string, source: string, fetchedAt: string, summary?: string }} InboxItem */
/** @typedef {{ ok: boolean, source: string, items: InboxItem[], error?: string }} SourceResult */

/**
 * Curated allowlist — only stable / lightly-scrapable open sources.
 * type: "rss" | "html-links" | "html-data-href"
 */
const SOURCES = [
  {
    id: "insee-flux-national",
    label: "Insee — flux nationaux",
    url: "https://www.insee.fr/fr/flux/1",
    type: "rss",
  },
  {
    id: "insee-publications",
    label: "Insee — publications nationales",
    url: "https://www.insee.fr/fr/flux/2",
    type: "rss",
  },
  {
    id: "senat-presse",
    label: "Sénat — communiqués de presse",
    url: "https://www.senat.fr/rss/presse.rss",
    type: "rss",
  },
  {
    id: "info-gouv",
    label: "info.gouv.fr — actualités",
    url: "https://www.info.gouv.fr/rss/actualites.xml",
    type: "rss",
  },
  {
    id: "ecb-press",
    label: "BCE / ECB — press",
    url: "https://www.ecb.europa.eu/rss/press.html",
    type: "rss",
  },
  {
    id: "economie-presse",
    label: "presse.economie.gouv.fr — listing HTML",
    url: "https://presse.economie.gouv.fr/",
    type: "html-links",
    linkHost: "presse.economie.gouv.fr",
    // Skip nav / taxonomy / feed endpoints
    skipPathRe:
      /^\/(page\/|wp-|feed\/|xmlrpc|agendas\/?$|medias\/?$|selection\/?$|g7\/?$|le-ministere\/?$|roland-|serge-|david-|maud-|sebastien-|anne-)/i,
  },
  {
    id: "bdf-actualites",
    label: "Banque de France — actualités (data-href)",
    url: "https://www.banque-france.fr/fr/actualites",
    type: "html-data-href",
    origin: "https://www.banque-france.fr",
  },
  // Soft-fail candidates (document instability; keep for rediscovery if they heal)
  {
    id: "vie-publique-rss",
    label: "Vie publique — RSS (often bot-gated)",
    url: "https://www.vie-publique.fr/rss.xml",
    type: "rss",
  },
  {
    id: "assemblee-rss",
    label: "Assemblée nationale — RSS (often 404)",
    url: "https://www.assemblee-nationale.fr/dyn/rss",
    type: "rss",
  },
];

function parisParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  // en-CA may use 24:00 at midnight edge — normalize hour
  let hour = parts.hour;
  if (hour === "24") hour = "00";
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour,
    minute: parts.minute,
  };
}

function parisStamp(date = new Date()) {
  const p = parisParts(date);
  return `${p.year}-${p.month}-${p.day}T${p.hour}-${p.minute}-Paris`;
}

function decodeEntities(s) {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(s) {
  return decodeEntities(String(s).replace(/<[^>]+>/g, " "));
}

function makeId(sourceId, url) {
  const h = createHash("sha256").update(`${sourceId}|${url}`).digest("hex");
  return `${sourceId}:${h.slice(0, 16)}`;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
      },
    });
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.bodyPreview = text.slice(0, 200);
      throw err;
    }
    return { text, finalUrl: res.url, contentType: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(t);
  }
}

function tagContent(block, tag) {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,
    "i",
  );
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function parseRssOrAtom(xml, sourceId, fetchedAt) {
  /** @type {InboxItem[]} */
  const items = [];
  const seen = new Set();

  // RSS 2.0 <item>
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const block of itemBlocks) {
    const title = stripTags(tagContent(block, "title"));
    let link =
      stripTags(tagContent(block, "link")) ||
      (block.match(/<link[^>]+href=["']([^"']+)["']/i) || [])[1] ||
      stripTags(tagContent(block, "guid"));
    const summaryRaw =
      tagContent(block, "description") ||
      tagContent(block, "summary") ||
      tagContent(block, "content:encoded") ||
      "";
    const summary = stripTags(summaryRaw).slice(0, 500) || undefined;
    if (!title || !link) continue;
    link = link.trim();
    if (seen.has(link)) continue;
    seen.add(link);
    items.push({
      id: makeId(sourceId, link),
      title,
      url: link,
      source: sourceId,
      fetchedAt,
      ...(summary ? { summary } : {}),
    });
    if (items.length >= MAX_ITEMS_PER_SOURCE) break;
  }

  if (items.length > 0) return items;

  // Atom <entry>
  const entries = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const block of entries) {
    const title = stripTags(tagContent(block, "title"));
    const linkMatch =
      block.match(/<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i) ||
      block.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']alternate["']/i) ||
      block.match(/<link[^>]+href=["']([^"']+)["']/i);
    const link = linkMatch ? linkMatch[1].trim() : "";
    const summaryRaw =
      tagContent(block, "summary") || tagContent(block, "content") || "";
    const summary = stripTags(summaryRaw).slice(0, 500) || undefined;
    if (!title || !link) continue;
    if (seen.has(link)) continue;
    seen.add(link);
    items.push({
      id: makeId(sourceId, link),
      title,
      url: link,
      source: sourceId,
      fetchedAt,
      ...(summary ? { summary } : {}),
    });
    if (items.length >= MAX_ITEMS_PER_SOURCE) break;
  }

  // Detect bot-gates / non-feed HTML returned as 200
  if (items.length === 0) {
    const head = xml.slice(0, 400).toLowerCase();
    if (
      head.includes("<!doctype html") ||
      head.includes("<html") ||
      head.includes("requires js enabled") ||
      head.includes("just a moment")
    ) {
      throw new Error("Response is HTML/bot-gate, not RSS/Atom");
    }
    throw new Error("No <item>/<entry> found in feed");
  }

  return items;
}

function parseEconomieHtml(html, sourceId, fetchedAt, skipPathRe) {
  /** @type {InboxItem[]} */
  const items = [];
  const seen = new Set();
  const re =
    /<a[^>]+href="(https:\/\/presse\.economie\.gouv\.fr\/([^"#?]+))"[\s\S]*?>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1];
    const pathPart = "/" + m[2].replace(/\/?$/, "/");
    if (skipPathRe && skipPathRe.test(pathPart)) continue;
    // article permalinks are /slug/ (single segment-ish, not root)
    const slug = m[2].replace(/\/$/, "");
    if (!slug || slug.includes("/") || slug.length < 12) continue;
    const title = stripTags(m[3]);
    if (!title || title.length < 12) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    items.push({
      id: makeId(sourceId, url),
      title,
      url,
      source: sourceId,
      fetchedAt,
    });
    if (items.length >= MAX_ITEMS_PER_SOURCE) break;
  }
  if (items.length === 0) throw new Error("No article links extracted");
  return items;
}

function parseBdfDataHref(html, sourceId, fetchedAt, origin) {
  /** @type {InboxItem[]} */
  const items = [];
  const seen = new Set();

  const push = (relOrAbs, title) => {
    if (!title || title.length < 8) return;
    let url = relOrAbs;
    if (url.startsWith("/")) url = origin + url;
    if (!url.startsWith("http")) return;
    // Skip pure nav hubs
    if (
      /\/(nous-trouver|accessibilite)(\/|$)/i.test(url) ||
      /\/a-votre-service\/particuliers\/[^/]+\/?$/i.test(url)
    ) {
      return;
    }
    if (seen.has(url)) return;
    seen.add(url);
    items.push({
      id: makeId(sourceId, url),
      title,
      url,
      source: sourceId,
      fetchedAt,
    });
  };

  // Featured cards: data-href + nearby card-title
  const featuredRe =
    /data-href="(\/fr\/[^"]+)"[\s\S]{0,2500}?card-title[^>]*>([\s\S]*?)<\/h3>/gi;
  let m;
  while ((m = featuredRe.exec(html)) !== null) {
    push(m[1], stripTags(m[2]));
    if (items.length >= MAX_ITEMS_PER_SOURCE) return items;
  }

  // List cards: <a class="card …" href="/fr/…" title="…"> or nested card-title
  const listRe =
    /<a\b[^>]*class="[^"]*card[^"]*"[^>]*href\s*=\s*"(\/fr\/[^"]+)"[^>]*(?:title\s*=\s*"([^"]*)")?[^>]*>/gi;
  while ((m = listRe.exec(html)) !== null) {
    const rel = m[1];
    let title = m[2] ? decodeEntities(m[2]) : "";
    if (!title) {
      const slice = html.slice(m.index, m.index + 1200);
      const tm = slice.match(/card-title[^>]*>([\s\S]*?)<\/h3>/i);
      if (tm) title = stripTags(tm[1]);
    }
    push(rel, title);
    if (items.length >= MAX_ITEMS_PER_SOURCE) break;
  }

  // Absolute href variants
  if (items.length < 3) {
    const absRe =
      /<a\b[^>]*href\s*=\s*"(https:\/\/www\.banque-france\.fr\/fr\/(?:actualites|communiques|interventions|publications)[^"]+)"[^>]*(?:title\s*=\s*"([^"]*)")?/gi;
    while ((m = absRe.exec(html)) !== null) {
      push(m[1], m[2] ? decodeEntities(m[2]) : stripTags(m[1].split("/").pop() || ""));
      if (items.length >= MAX_ITEMS_PER_SOURCE) break;
    }
  }

  if (items.length === 0) throw new Error("No BdF news cards found");
  return items;
}

/** @param {typeof SOURCES[number]} src */
async function collectSource(src, fetchedAt) {
  try {
    const { text } = await fetchText(src.url);
    let items;
    if (src.type === "rss") {
      items = parseRssOrAtom(text, src.id, fetchedAt);
    } else if (src.type === "html-links") {
      items = parseEconomieHtml(text, src.id, fetchedAt, src.skipPathRe);
    } else if (src.type === "html-data-href") {
      items = parseBdfDataHref(text, src.id, fetchedAt, src.origin);
    } else {
      throw new Error(`Unknown type ${src.type}`);
    }
    return /** @type {SourceResult} */ ({
      ok: true,
      source: src.id,
      items,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return /** @type {SourceResult} */ ({
      ok: false,
      source: src.id,
      items: [],
      error: msg,
    });
  }
}

async function pruneOld(dir, now = new Date()) {
  const cutoff = now.getTime() - PRUNE_DAYS * 24 * 60 * 60 * 1000;
  let removed = 0;
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return 0;
  }
  for (const name of entries) {
    if (name === ".gitkeep" || name === "LATEST.json") continue;
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-Paris\.json$/.test(name)) continue;
    const full = path.join(dir, name);
    try {
      const st = await fs.stat(full);
      if (st.mtimeMs < cutoff) {
        await fs.unlink(full);
        removed += 1;
      }
    } catch {
      /* ignore */
    }
  }
  return removed;
}

async function main() {
  const fetchedAt = new Date().toISOString();
  const stamp = parisStamp();
  await fs.mkdir(OUT_DIR, { recursive: true });

  /** @type {SourceResult[]} */
  const results = [];
  for (const src of SOURCES) {
    const r = await collectSource(src, fetchedAt);
    results.push(r);
    const status = r.ok
      ? `ok (${r.items.length} items)`
      : `FAIL (${r.error})`;
    console.log(`[${src.id}] ${status}`);
  }

  const okResults = results.filter((r) => r.ok);
  /** @type {InboxItem[]} */
  const allItems = [];
  const itemSeen = new Set();
  for (const r of okResults) {
    for (const it of r.items) {
      if (itemSeen.has(it.url)) continue;
      itemSeen.add(it.url);
      allItems.push(it);
    }
  }

  const payload = {
    schemaVersion: 1,
    generatedAt: fetchedAt,
    generatedAtParis: stamp,
    timezone: TZ,
    sources: SOURCES.map((s) => {
      const r = results.find((x) => x.source === s.id);
      return {
        id: s.id,
        label: s.label,
        url: s.url,
        type: s.type,
        ok: Boolean(r?.ok),
        itemCount: r?.items.length ?? 0,
        ...(r?.error ? { error: r.error } : {}),
      };
    }),
    itemCount: allItems.length,
    items: allItems,
  };

  const json = `${JSON.stringify(payload, null, 2)}\n`;
  const stampedPath = path.join(OUT_DIR, `${stamp}.json`);
  const latestPath = path.join(OUT_DIR, "LATEST.json");
  await fs.writeFile(stampedPath, json, "utf8");
  await fs.writeFile(latestPath, json, "utf8");

  const pruned = await pruneOld(OUT_DIR);
  console.log(
    `Wrote ${stampedPath} and LATEST.json (${allItems.length} items, ${okResults.length}/${SOURCES.length} sources ok, pruned ${pruned})`,
  );

  if (okResults.length < 1) {
    console.error("No source succeeded — failing the run.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
