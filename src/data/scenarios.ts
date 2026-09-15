import type { ScenarioItem } from "./types";

export const SCENARIOS: ScenarioItem[] = [
  {
    id: "sc-ormuz",
    title: "Réouverture du détroit d’Ormuz",
    question: "Quand le détroit peut-il vraiment rouvrir, et à quel prix du baril ?",
    sector: "energy",
    status:
      "Quasi-blocus depuis la fin février. ~20 traversées/jour contre 130. Négos de 60 jours closes le 17 août. Frappes dans la nuit du 9 au 10 sept. Flash UKMTO samedi 12, 6h12 UTC : tanker affrété TotalEnergies, cargo ~2 Mbbl.",
    nextCatalyst: "Midterms US (début novembre) — seule date citée par Trump. Tout sinistre tanker d’ici là, à commencer par le flash du 12.",
    hypotheses: [
      {
        label: "Gel partiel post-midterms",
        likelihood: "plausible",
        implication: "Brent revient vers 80-90 $. L’inflation européenne décélère au T1 2027. La BCE peut pauser.",
      },
      {
        label: "Statu quo jusqu’à 2027",
        likelihood: "central",
        implication: "Diesel cher, IPC collant, OAT sous pression, PLF 2027 écrit dans le pétrole cher.",
      },
      {
        label: "Escalade (mines, raffineries saoudiennes, saisies)",
        likelihood: "queue",
        implication: "Brent >> 120 $, rationnement industriel, session d’urgence UE, risque récession zone euro.",
      },
    ],
  },
  {
    id: "sc-plf",
    title: "PLF 2027 sous tension de marché",
    question: "Le gouvernement peut-il encore écrire un budget sans se faire censurer ni se faire sanitiser par les marchés ?",
    sector: "budget",
    status:
      "OAT 10 ans au plus haut depuis 2008-2009, dette 117 % du PIB, promesse 4,7 % non tenue. Présidentielle avril 2027. Adjudication AFT chaque jeudi.",
    nextCatalyst: "Conseil des ministres de présentation du PLF (octobre) + adjudication du 17 sept. + flash Moody’s si un desk le filtre.",
    hypotheses: [
      {
        label: "Budget paramétrique + 49.3",
        likelihood: "central",
        implication: "Pas de grand soir fiscal. Année blanche partielle. Notation sous review, pas de crash.",
      },
      {
        label: "Censure d’automne",
        likelihood: "plausible",
        implication: "Loi spéciale, AFT en pilotage à vue, spread : crise politique = crise de dette.",
      },
      {
        label: "Package sérieux (dépenses + recettes)",
        likelihood: "faible",
        implication: "OAT se détend. Récit Lecornu « encore là dans un an » recadré vers 2027.",
      },
    ],
  },
  {
    id: "sc-sfr",
    title: "Closing SFR : 2027 tiendra-t-il ?",
    question: "Le deal à 20,35 Md€ survit-il à l’AdlC, à Bercy et au social ?",
    sector: "telecoms",
    status:
      "MoU 6 juin. Renvoi AdlC 15 juillet. Docs juridiques « S2 2026 ». Closing « S2 2027 au plus tôt ». Grève 24 sept.",
    nextCatalyst: "Documentation définitive (deadline S2 2026) et journée de grève du 24 septembre.",
    hypotheses: [
      {
        label: "Closing S2 2027 avec remèdes AdlC",
        likelihood: "central",
        implication: "Marché à 3 opérateurs. Papier concurrentiel + social de longue haleine.",
      },
      {
        label: "Glissement 2028 / périmètre amputé",
        likelihood: "plausible",
        implication: "Altice sous pression dette. Négociation d’actifs hors périmètre (XP Fibre, Outre-mer).",
      },
      {
        label: "Abandon ou veto politique",
        likelihood: "queue",
        implication: "Séisme télécoms. Recherche d’un plan B (fonds, scission, recapitalisation).",
      },
    ],
  },
  {
    id: "sc-mistral",
    title: "Mistral : labo ou opérateur d’infra ?",
    question: "La Série D finance-t-elle un retour frontier, ou acter le pivot services / compute ?",
    sector: "ia",
    status:
      "21 Md€ de valo, 3 Md€ levés, Samsung au cap table, 1 Md€ de CA promis pour 2026. Accusations de sortie de la course aux modèles.",
    nextCatalyst: "Prochaine release de modèle et chiffres de CA commentés au T4.",
    hypotheses: [
      {
        label: "Pivot réussi (compute + souverains)",
        likelihood: "plausible",
        implication: "CA 2026 visé tenable. Récit « 3e voie » réécrit en « cloud européen ». Moins sexy, plus cash.",
      },
      {
        label: "Entre-deux durable",
        likelihood: "central",
        implication: "Valo exige un récit frontier que les benchs ne valident pas. Pression actionnaires 2027.",
      },
      {
        label: "Rapprochement / tour de table stratégique",
        likelihood: "queue",
        implication: "Samsung, Microsoft ou un telco européen. Deal à surveiller comme un M&A, pas comme une levée.",
      },
    ],
  },
  {
    id: "sc-auto-chine",
    title: "Automobile : qui cède avant que BYD n’installe le prix",
    question: "Stellantis et Renault tiennent-ils le VE d’entrée de gamme, ou cèdent-ils des usines / marques ?",
    sector: "auto",
    status:
      "Part chinoise dans le VE France en hausse 2023-2026. Ampere sous revue. Filosa a promis un plan. Équipementiers du second rang déjà en mauvaise posture.",
    nextCatalyst: "Immatriculations mensuelles CCFA + stocks concessionnaires + tout mandat de cession thermique.",
    hypotheses: [
      {
        label: "Guerre des prix, usines tenues, marges sacrifiées",
        likelihood: "central",
        implication: "Emploi français sous tension T4. Papier social plus que papier produit.",
      },
      {
        label: "Cession d’actifs thermiques / rapprochement",
        likelihood: "plausible",
        implication: "Deal à traiter comme un M&A, pas comme une rumeur de couloir.",
      },
      {
        label: "Droits de douane UE réellement dissuasifs",
        likelihood: "faible",
        implication: "Répit 12-18 mois. N’efface pas l’écart de coût.",
      },
    ],
  },
];
