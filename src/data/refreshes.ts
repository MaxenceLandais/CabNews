import type { CrawlRefresh } from "./types";

export const CRAWLS: CrawlRefresh[] = [
  {
    id: "crawl-9",
    date: "2026-09-17",
    time: "12:15",
    summary:
      "Neuvième passe, jeudi midi. Digestion Fed : CAC vert (+0,4–0,6 %), Brent ~104 $ (espoirs oléoduc saoudien) ; Amundi×ICG 9,9 % ; Exosens guidance ; Macron–Aoun–Abdallah II / après-FINUL ; Dati jour 2 ; séminaire budget Matignon cet après-midi ; AFT indexés en fenêtre.",
    sourcesCrawled: 84,
    added: [
      "evt-amundi-icg-0917",
      "evt-exosens-guidance-0917",
      "evt-lecornu-seminaire-0917",
    ],
    revised: [
      "evt-marches-jeudi-0917",
      "evt-liban-finul-0916",
      "evt-dati-ghosn-0916",
      "evt-aft-jeu-0917",
      "evt-elgaia-0913",
    ],
    highlights: [
      "Marchés midi : CAC ~8 172–8 189 (+0,4–0,6 %) ; Brent ~104,11 $ (−1,6 %) — hike Warsh absorbé.",
      "Deals : Amundi 9,9 % ICG (~620 M€) ; Exosens CA 558–570 M€, titre +10–12 %.",
      "Liban : Macron reçoit Aoun + Abdallah II ; réunion militaire après-FINUL (retrait dès janvier).",
      "Dati jour 2 : interrogatoire ; séminaire Lecornu budget 2027 à Matignon (puis Figaro).",
      "AFT : fenêtre 10h50/11h50 — résultats à coller dès publication (pas de chiffres inventés).",
    ],
  },
  {
    id: "crawl-8",
    date: "2026-09-17",
    time: "06:10",
    summary:
      "Huitième passe, jeudi matin. Fed +25 pb livrée (Warsh unanime, biais encore hawkish) ; Lecornu prolonge les aides carburant ciblées jusqu’au 31/12 ; marchés en digestion ; AFT indexés + BdF anticipations au menu ; renvoi Ghosn rejeté ; El Gaia versions IRGC/CENTCOM ; catch-up SA TotalEnergies × Mistral.",
    sourcesCrawled: 78,
    added: [
      "evt-carburant-aides-0916",
      "evt-marches-jeudi-0917",
      "evt-sa-total-mistral-0915",
    ],
    revised: [
      "evt-fed-fomc-0916",
      "evt-marches-mercredi-0916",
      "evt-carburant-ruptures-0916",
      "evt-cdm-0916",
      "evt-gilets-jaunes-spectre-0916",
      "evt-dati-ghosn-0916",
      "evt-aft-jeu-0917",
      "evt-elgaia-0913",
    ],
    highlights: [
      "Fed : +25 pb à 3,75–4,00 % (12–0) ; médiane 4,1 % fin 2026 — autre hike possible ; Wall Street déjà négative la veille.",
      "Carburants : aides ciblées prolongées au 31/12 (pêcheurs 35 c€/l, BTP 20, agri 15) ; gazole ~2,36 €/l.",
      "Marchés jeudi : digestion hike + AFT indexés + Brent ~105–106 $.",
      "Dati–Ghosn : renvoi rejeté, interrogatoire Dati le 17 ; El Gaia : versions IRGC vs CENTCOM.",
      "Seeking Alpha : TotalEnergies × Mistral (>100 M€ / 3 ans) — bureau énergie.",
    ],
  },
  {
    id: "crawl-7",
    date: "2026-09-16",
    time: "16:40",
    summary:
      "Septième passe, mercredi après-midi. Post-CDM Macron « mobilisation totale » carburants, porte ouverte aux aides ; Fed à 20h Paris (+ retail US +1,2 %) ; marchés en pause ; El Gaia remorqué (2 disparus) ; audience Dati–Ghosn ouverte.",
    sourcesCrawled: 72,
    added: [
      "evt-fed-fomc-0916",
      "evt-marches-mercredi-0916",
    ],
    revised: [
      "evt-carburant-ruptures-0916",
      "evt-cdm-0916",
      "evt-gilets-jaunes-spectre-0916",
      "evt-dati-ghosn-0916",
      "evt-elgaia-0913",
    ],
    highlights: [
      "CDM / carburants : Macron exige une mobilisation totale (volumes internationaux + flexibilité UE raffineries) ; ~10 % des stations en difficulté ; porte ouverte à de nouveaux dispositifs.",
      "Fed 20h Paris : +25 pb (>90 %) vers 3,75–4,00 % ; retail US août +1,2 % renforce le biais ; conf. Warsh 20h30.",
      "Marchés : CAC prudent ~8 100 ; Brent en pause ~107–108 $ après 108,82 $ mardi — verdict monétaire ce soir.",
      "Ormuz : El Gaia remorqué vers Oman, 23 évacués, 2 marins recherchés.",
      "Procès Dati–Ghosn : audience ouverte 13h30, renvoi Ghosn examiné en premier.",
    ],
  },
  {
    id: "crawl-6",
    date: "2026-09-16",
    time: "13:35",
    summary:
      "Sixième passe, mercredi midi. Choc carburants (ruptures TotalEnergies, pêcheurs Frontignan), spectre gilets jaunes, ouverture procès Dati–Ghosn, Liban après-FINUL, clôture marchés mardi (L’Oréal > LVMH). Révision Lecornu plafonds (choc énergie / 30 Md€) et CDM Bregeon.",
    sourcesCrawled: 68,
    added: [
      "evt-carburant-ruptures-0916",
      "evt-gilets-jaunes-spectre-0916",
      "evt-dati-ghosn-0916",
      "evt-liban-finul-0916",
      "evt-marches-mardi-0915",
    ],
    revised: [
      "evt-lecornu-plafonds-0915",
      "evt-cdm-0916",
      "evt-lvmh-t3-0915",
      "evt-hcsf-0915",
    ],
    highlights: [
      "Carburants : gazole ~2,34 €/l ; Bregeon écarte la pénurie ; ~86 % des stations TotalEnergies en rupture ; pêcheurs à Frontignan (J3).",
      "Spectre gilets jaunes : Bayrou/Hollande + LFI/PS ; intersyndicale FP le 29 sept.",
      "Procès Dati–Ghosn ouvert à Paris (13h30) ; Ghosn demande le renvoi depuis Beyrouth.",
      "Marchés mardi : CAC 8 090 (−0,34 %), Brent 108,8 $, OAT ~4,50 % ; L’Oréal passe devant LVMH — Fed mercredi.",
    ],
  },
  {
    id: "crawl-5",
    date: "2026-09-16",
    time: "06:12",
    summary:
      "Cinquième passe, mardi matin. BdF projections intermédiaires (PIB 0,4 %), lettres plafonds Lecornu, HCSF inchangé + Moulin sur l’AFT, séquence Ormuz El Gaia / projectile UKMTO 14–15, catch-up Bercy 1,3 Md€, cession Capgemini Government Solutions.",
    sourcesCrawled: 62,
    added: [
      "evt-bdf-projections-0915",
      "evt-lecornu-plafonds-0915",
      "evt-hcsf-0915",
      "evt-ukmto-0915",
      "evt-elgaia-0913",
      "evt-bercy-redressement-0911",
      "evt-capgemini-cession-0912",
    ],
    revised: [
      "evt-hcsf-immo-0914",
      "evt-plf-couloirs-0914",
      "evt-cdm-0916",
      "evt-aft-jeu-0917",
      "evt-ormuz-0910",
      "evt-ukmto-flash-0912",
      "evt-nom-capgemini-0912",
    ],
    highlights: [
      "BdF : PIB 2026 à 0,4 % (−0,1 pt), IPCH 2,3 % / 1,9 % / 1,6 %, chômage vers 8,4 % fin 2026.",
      "Lecornu rouvre les lettres plafonds : dépenses hors défense stables 2027 vs 2026.",
      "HCSF : normes crédit et réserves inchangées ; OAT ~4,49 % le 15, Moulin rassure sur l’AFT.",
      "Ormuz : El Gaia (13) + projectile UKMTO (14/15) — la séquence Golfe tient le pétrole.",
    ],
  },
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
