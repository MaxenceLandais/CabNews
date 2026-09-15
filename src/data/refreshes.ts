import type { CrawlRefresh } from "./types";

export const CRAWLS: CrawlRefresh[] = [
  {
    id: "crawl-4",
    date: "2026-09-12",
    time: "17:20",
    summary:
      "Quatrième passe. Seeking Alpha (titres France, corps payant) : Exail, Thales, Capgemini, Soitec, Teleperformance, Renault Niagara, Air Liquide / Elliott. Filtre bureau strict — un secteur, pas un nuage de tags.",
    sourcesCrawled: 58,
    added: [
      "evt-sa-exail-0912",
      "evt-sa-thales-0912",
      "evt-sa-capgemini-0912",
      "evt-sa-renault-niagara-0910",
      "evt-sa-airliquide-0912",
    ],
    revised: ["evt-marches-lundi-0914", "evt-renault-ampere-0914", "evt-gifas-andries-0916"],
    highlights: [
      "Seeking Alpha : on ne paie pas le corps, on déduit sur le titre. Exail « €380 Million Problem » = risque earn-out du closing Thales.",
      "Capgemini « AI Deflation Risk » = le papier tech de la semaine, collé à la nomination de samedi.",
      "Filtre V3 : bureau d’affectation = premier secteur. Tags secondaires (pétrole, logiciel, defense-tech) ne polluent plus Tech.",
      "Carnet de veille ouvert : coller une détection + l’URL, le brief de la semaine suivante imite le geste.",
    ],
  },
  {
    id: "crawl-3",
    date: "2026-09-12",
    time: "15:40",
    summary:
      "Troisième passe de la semaine, samedi après-midi. UKMTO, agendas Élysée / ONU, notaires, Irep, FranceAgriMer, ANSM, NBS, KNDS. Quatre puces ajoutées, deux révisions. Le flash tanker peut réécrire le lundi.",
    sourcesCrawled: 47,
    added: [
      "evt-ukmto-flash-0912",
      "evt-macron-unga-0912",
      "evt-nom-capgemini-0912",
      "evt-shmyhal-0916",
    ],
    revised: ["evt-ormuz-0910", "evt-marches-lundi-0914"],
    highlights: [
      "Flash UKMTO 06:12 UTC : tanker affrété TotalEnergies, cargo ~2 Mbbl — pavillon non confirmé à 15h40.",
      "Macron part lundi pour l’UNGA, discours mardi 15. Shmyhal reçu mercredi à Matignon.",
      "Capgemini : communiqué samedi matin, passage de témoin opérationnel.",
      "Notaires Grand Paris + Irep + FranceAgriMer : trois signaux faibles intégrés au samedi.",
    ],
  },
  {
    id: "crawl-2",
    date: "2026-09-11",
    time: "19:10",
    summary:
      "Passe de vendredi soir. BLS (CPI), Sanofi, LSA / Ania, IEA, ministère des Armées (155 mm), NBS, Census Bureau, EMA, Agreste, ARCEP.",
    sourcesCrawled: 38,
    added: [
      "evt-cpi-us-0911",
      "evt-nom-sanofi-0911",
      "evt-carrefour-prix-0911",
      "evt-shadow-fleet-0911",
      "evt-ukraine-155-0911",
    ],
    revised: ["evt-mistral-j3-0911"],
    highlights: [
      "IPC américain d’août intégré, en vis-à-vis du PPI de jeudi et de la BCE.",
      "Nomination Sanofi R&D : profil IA + biotech, effectif 1er octobre.",
      "Guerre des prix Carrefour / Leclerc recoupée avec l’Ania.",
      "Checkpoint 155 mm avant la visite ukrainienne de mercredi.",
    ],
  },
  {
    id: "crawl-1",
    date: "2026-09-10",
    time: "18:30",
    summary:
      "Passe d’ouverture du cycle jeudi → jeudi. Calendriers Insee, BdF, AFT, BCE, CCFA, DGA, Dassault, BLS (PPI), Banque des Territoires.",
    sourcesCrawled: 41,
    added: [
      "evt-bce-0910",
      "evt-insee-ndc-0910",
      "evt-vortex-0910",
      "evt-ormuz-0910",
      "evt-dga-f5-0910",
      "evt-logivolt-0910",
      "evt-auto-ccfa-0910",
    ],
    revised: [],
    highlights: [
      "BCE +25 pb, Lagarde sans pause. Insee note de conjoncture 17h.",
      "VORTEX + commandes F5 : deux réponses visibles à l’arrêt du SCAF.",
      "CCFA août : la prise chinoise se lit dans le mix VE, pas dans le volume.",
      "Ormuz : Téhéran revendique des frappes, Brent > 101 $.",
    ],
  },
];

export const LAST_CRAWL = CRAWLS[0]!;
