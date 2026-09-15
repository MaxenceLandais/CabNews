import type { WeakSignalItem } from "./types";

export const SIGNALS: WeakSignalItem[] = [
  {
    id: "sig-auto-eti",
    title: "Équipementiers du second rang : le thermique n’a plus d’acheteur stratégique",
    thesis:
      "Au regard des volumes VE (CCFA), de la part chinoise et des défaillances BdF « matériel de transport », trois ETI de fonderie / plastique / faisceaux sont en mauvaise posture, proches d’un acquéreur opportuniste ou d’un dépôt.",
    evidence: [
      "Carnets encore ~80 % thermique alors que le mix VE d’entrée de gamme bascule vers BYD / MG / Geely.",
      "Défaillances BdF du secteur en hausse continue depuis 2023, au-dessus du rythme 2019.",
      "Forvia, Valeo, OPmobility ont déjà tranché ; le second rang n’a pas leur accès au marché des capitaux.",
    ],
    watch: "Tout mandat de cession, tout rumored PE, toute grève de site avant Noël. Croiser BODACC et tribunaux de commerce (Nanterre, Lyon, Douai).",
    risk: "acquereur",
    sectors: ["auto", "eti", "ma", "chine"],
    entities: ["FIEV", "Forvia", "Valeo", "BYD"],
    source: "BdF défaillances, CCFA, FIEV",
    sources: [
      { label: "Banque de France — défaillances", url: "https://www.banque-france.fr/statistiques/defaillances-dentreprises" },
      { label: "CCFA", url: "https://ccfa.fr/statistiques/" },
    ],
  },
  {
    id: "sig-mistral-mix",
    title: "Mistral : le 1 Md€ de CA 2026 est un mix compute, pas des licences modèle",
    thesis:
      "Le contrat Microsoft pèserait l’essentiel de la trajectoire. Un CA « IA générative » minoritaire changerait le papier Série D : ce n’est plus un labo, c’est un loueur de GPU labellisé UE.",
    evidence: [
      "Pivot assumé vers l’infra et l’hébergement de modèles tiers, y compris chinois.",
      "Valo 21 Md€ incompatible longtemps avec un récit frontier que les benchs ne valident pas.",
    ],
    watch: "Ventilation de CA au T4. Prochaine release de modèle. MW réellement commandés en France / Suède.",
    risk: "deal",
    sectors: ["ia", "tech"],
    entities: ["Mistral AI", "Arthur Mensch", "Samsung", "Microsoft"],
    source: "Mistral, 8 sept. 2026 ; recoupement presse",
    sources: [{ label: "Mistral AI", url: "https://mistral.ai/" }],
  },
  {
    id: "sig-oat-dealers",
    title: "OAT : deux primary dealers ont réduit leur appétit",
    thesis:
      "Le 3 septembre la couverture restait correcte (2,28×–3,10×) mais le livre aurait été plus concentré. Si la prochaine adjudication du jeudi sort sous 2×, le spread n’est plus un sujet de marché, c’est un sujet politique.",
    evidence: [
      "OAT 10 ans au plus haut depuis 2008-2009.",
      "Charge de la dette +18,3 % sur un an.",
      "Promesse de déficit 4,7 % non tenue.",
    ],
    watch: "Couverture AFT du 17 sept. Concentration du livre. Commentaires de primary dealers.",
    risk: "macro",
    sectors: ["public-finance", "banking", "marches", "budget"],
    entities: ["AFT", "Bercy"],
    source: "AFT, adjudications du 3 sept.",
    sources: [{ label: "AFT", url: "https://www.aft.gouv.fr/" }],
  },
  {
    id: "sig-sfr-gpec",
    title: "SFR : les 5 000 restants n’ont pas de plan B social écrit",
    thesis:
      "Côté repreneurs, le discours est « 3 000 reprises ». Côté organisations, le compartiment SFR SA n’aurait toujours pas de GPEC opposable. C’est le combustible de la grève du 24.",
    evidence: [
      "MoU du 6 juin, docs juridiques « S2 2026 » toujours attendus.",
      "Renvoi AdlC le 15 juillet, examen ~18 mois.",
    ],
    watch: "Grève du 24 sept. Fuites de GPEC. Position Bercy si le social pourrit l’examen concurrentiel.",
    risk: "deal",
    sectors: ["telecoms", "ma"],
    entities: ["SFR", "Altice", "Bouygues Telecom", "Iliad", "Orange"],
    source: "Protocoles 6 juin 2026 ; syndicats",
    sources: [{ label: "Autorité de la concurrence", url: "https://www.autoritedelaconcurrence.fr/" }],
  },
  {
    id: "sig-immo-volume",
    title: "Immobilier : le prix cède, le volume ne revient pas",
    thesis:
      "Les notaires du Grand Paris confirment un T2 encore en recul. Le canal BCE → barème → compromis met trois mois. Le hike du 10 sept. n’est pas dans les actes d’août : on le verra à Noël.",
    evidence: [
      "Taux moyens crédit immo à 3,27 % en juin (BdF), avant le hike.",
      "HCSF n’a pas assoupli le taux d’effort 35 %.",
      "Indice Insee-notaires au calendrier du 18 sept.",
    ],
    watch: "Barèmes des réseaux lundi 14. Indice du 18. Toute ouverture HCSF.",
    risk: "macro",
    sectors: ["immobilier", "banking"],
    entities: ["Notaires du Grand Paris", "HCSF", "Banque de France"],
    source: "BdF crédit habitat ; Insee-notaires",
    sources: [
      { label: "Banque de France — statistiques", url: "https://www.banque-france.fr/statistiques" },
      { label: "Insee — prix des logements", url: "https://www.insee.fr/fr/statistiques/series/102775218" },
    ],
  },
  {
    id: "sig-medias-auto",
    title: "Médias : l’auto ne finance plus la rentrée TV",
    thesis:
      "Irep / Kantar. L’auto pèse encore trop dans le mix TV. Si Stellantis coupe les budgets T4, TF1 et M6 le sentent avant les comptes. La nomination commerciale TF1 (profil retail) est déjà un aveu de mix.",
    evidence: [
      "Les budgets auto T3-T4 sont les premiers à sauter quand les stocks VE ne tournent pas.",
      "La pub retail et energy tient, portée par la guerre des prix.",
    ],
    watch: "Budgets nets T4. Grille Irep. Nominations commerciales.",
    risk: "sous-tension",
    sectors: ["medias", "auto", "retail"],
    entities: ["TF1", "M6", "Irep", "Stellantis"],
    source: "Irep / ARCOM",
    sources: [
      { label: "Irep", url: "https://www.irep.asso.fr/" },
      { label: "ARCOM", url: "https://www.arcom.fr/" },
    ],
  },
  {
    id: "sig-ansm",
    title: "Ruptures d’antibiotiques : le maillon faible n’est plus français, il est chinois",
    thesis:
      "ANSM. Le calendrier d’hiver se joue en septembre. Trois ans après France 2030, les principes actifs asiatiques commandent encore la forme pédiatrique.",
    evidence: [
      "Liste des tensions d’approvisionnement actualisée en continu.",
      "Relocalisations Seqens / Sanofi plus lentes que les discours 2023.",
    ],
    watch: "Liste ANSM, stocks stratégiques, questions au CDM santé.",
    risk: "macro",
    sectors: ["sante", "pharma", "chine"],
    entities: ["ANSM", "Sanofi", "Seqens"],
    source: "ANSM",
    sources: [{ label: "ANSM — disponibilités", url: "https://ansm.sante.fr/disponibilites-des-produits-de-sante" }],
  },
  {
    id: "sig-agri-engrais",
    title: "Le blé n’est pas le sujet, l’urée l’est",
    thesis:
      "FranceAgriMer : collecte 2026 dans la moyenne. Le second choc Ormuz se lit dans le gaz et les engrais, pas dans le rendu Rouen. Les ETI agro le diront dans les comptes T3.",
    evidence: [
      "Gaz européen cher + logistique mer Rouge / Ormuz.",
      "Ania : demandes de déflation déjà refusées en juillet, alors que la distribution rouvre la guerre des prix.",
    ],
    watch: "Agreste 15 sept. Cours de l’urée. Comptes T3 coopératives et ETI.",
    risk: "sous-tension",
    sectors: ["agriculture", "energy", "eti", "retail"],
    entities: ["FranceAgriMer", "Ania", "Yara", "InVivo"],
    source: "FranceAgriMer / Agreste / Ania",
    sources: [
      { label: "FranceAgriMer", url: "https://www.franceagrimer.fr/" },
      { label: "Agreste", url: "https://agreste.agriculture.gouv.fr/" },
    ],
  },
  {
    id: "sig-retail-eti",
    title: "Guerre des prix : les ETI agroalimentaire n’ont plus de collatéral",
    thesis:
      "Carrefour / Leclerc plus agressifs que 2025 sur le chariot-type. Volume vs marge. Les MDD et le non-alimentaire trinquent. Derrière, des ETI sans accès au marché des capitaux.",
    evidence: [
      "Ania : déflation refusée en juillet.",
      "Défaillances BdF « commerce ; industrie alimentaire » au-dessus de 2019.",
    ],
    watch: "BODACC, mandats de cession, war-rooms des fonds mid-cap.",
    risk: "faillite",
    sectors: ["retail", "eti", "agriculture"],
    entities: ["Carrefour", "E.Leclerc", "Ania"],
    source: "LSA / Ania / BdF",
    sources: [
      { label: "LSA", url: "https://www.lsa-conso.fr/" },
      { label: "Banque de France — défaillances", url: "https://www.banque-france.fr/statistiques/defaillances-dentreprises" },
    ],
  },
  {
    id: "sig-luxe-chine",
    title: "Luxe : la Chine ne « revient » pas, elle a changé de client",
    thesis:
      "Les desks commencent à pré-écrire un T3 LVMH mou. Ce n’est plus une surprise, c’est une structure : le stimulus PBoC ne réveille plus ni la pierre ni le duty-free.",
    evidence: [
      "NBS : immobilier toujours mort, ventes au détail sans rebond crédible du haut de gamme.",
      "Hermès tient, Kering non : le mix marque dit le client, pas le pays.",
    ],
    watch: "NBS lundi 14. Pré-rumeurs T3. Trafic HK / Hainan.",
    risk: "macro",
    sectors: ["chine", "marches", "retail"],
    entities: ["LVMH", "Kering", "Hermès", "PBoC"],
    source: "NBS / publications luxe",
    sources: [
      { label: "NBS Chine", url: "https://www.stats.gov.cn/english/" },
      { label: "LVMH finance", url: "https://www.lvmh.fr/actionnaires/" },
    ],
  },
  {
    id: "sig-defense-safran",
    title: "Safran, perdant d’Exail, doit trouver une cible",
    thesis:
      "Thales a signé Exail (3,9 Md€, closing 2028) au détriment de Safran. Un perdant de cette taille, dans un Monopoly DGA, ne reste pas sans dossier. La pause antitrust n’est pas une pause stratégique.",
    evidence: [
      "Thales Raytheon Systems déjà bouclé.",
      "KNDS / Rheinmetall / SAAB dans le viseur de La Lettre.",
    ],
    watch: "Tout avis DGA, toute fuite KNDS-Rheinmetall, tout mandat côté Safran.",
    risk: "deal",
    sectors: ["defense", "ma", "aero"],
    entities: ["Safran", "Thales", "Exail", "DGA", "KNDS"],
    source: "Usine Nouvelle / La Lettre",
    sources: [
      { label: "Usine Nouvelle", url: "https://www.usinenouvelle.com/" },
      { label: "La Lettre", url: "https://www.lalettre.fr/" },
    ],
  },
  {
    id: "sig-bpifrance-eti",
    title: "Le baromètre TPE-PME disait déjà le hike",
    thesis:
      "S1 2026 : solde d’opinion activité −5, investissement atone, coût du crédit 2e obstacle. Le hike du 10 sept. n’y est pas. Le S2 dira si le pétrole a cassé l’industrie.",
    evidence: [
      "Publication Le Lab, juillet 2026.",
      "Défaillances BdF en tendance haussière, notamment BTP, auto, commerce.",
    ],
    watch: "Défaillances du 9 oct. Prochain baromètre S2 (janv. 2027). Cessions forcées mid-cap.",
    risk: "sous-tension",
    sectors: ["eti", "industry", "banking"],
    entities: ["Bpifrance", "METI", "Medef"],
    source: "Bpifrance Le Lab",
    sources: [{ label: "Bpifrance Le Lab", url: "https://lelab.bpifrance.fr/" }],
  },
];
