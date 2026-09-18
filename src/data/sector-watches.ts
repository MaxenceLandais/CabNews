import type { EventItem, KindId, SectorId, SourceRef } from "./types";

export interface WatchSeed {
  title: string;
  lede: string;
  kind: KindId;
  label: string;
  url: string;
  entities: string[];
}

const W: Record<SectorId, WatchSeed[]> = {
  defense: [
    { title: "LPM / cadences 155 mm — point DGA", lede: "Veille quotidienne munitions et drones. Le stock Sénat « quelques milliers » n’est plus un secret, c’est un trou industriel.", kind: "publication", label: "Ministère des Armées", url: "https://www.defense.gouv.fr/", entities: ["DGA", "KNDS"] },
    { title: "Harmattan AI / Valeo — moteurs de drones", lede: "Premier contrat auto→défense. Relancer le site AuRA et la montée en cadence 2027.", kind: "signal", label: "Usine Nouvelle", url: "https://www.usinenouvelle.com/", entities: ["Valeo", "Harmattan AI"] },
    { title: "Thales / Exail — closing et earn-out", lede: "Titres Seeking Alpha et AdC. Le Monopoly défense a un trou de documentation.", kind: "deal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Thales", "Exail"] },
    { title: "Ukraine : besoins drones & 155 mm", lede: "Chaque briefing Kyiv recale les commandes françaises. À croiser LPM.", kind: "visit", label: "Présidence ukrainienne", url: "https://www.president.gov.ua/en", entities: ["Ukraine", "DGA"] },
    { title: "BODACC — ETI défense", lede: "Nominations et cessions d’ETI de munitions / optronique. Les paywalls ratent le BODACC.", kind: "nomination", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  aero: [
    { title: "Airbus / Gifas — carnet civil", lede: "Cadences A320 et moteurs. Le civil finance le militaire, pas l’inverse.", kind: "publication", label: "Gifas", url: "https://www.gifas.fr/", entities: ["Airbus", "Gifas"] },
    { title: "Dassault — F5 / VORTEX", lede: "Lots notifiés. Radar RBE2-XG : dans le lot ou dans le suivant.", kind: "deadline", label: "Dassault Aviation", url: "https://www.dassault-aviation.com/fr/", entities: ["Dassault", "DGA"] },
    { title: "Safran — moteurs et cible post-Exail", lede: "Perdant d’Exail. Un dossier de substitution doit circuler.", kind: "deal", label: "Safran finance", url: "https://www.safran-group.com/fr/finance", entities: ["Safran"] },
    { title: "EASA / DGAC — airworthiness", lede: "Veille certifications drones et eVTOL. Calendrier européen.", kind: "publication", label: "EASA", url: "https://www.easa.europa.eu/", entities: ["EASA"] },
    { title: "Nikkei — supply chain aéro Asie", lede: "Traduit du japonais. Titane, composites, sous-traitance.", kind: "signal", label: "Nikkei", url: "https://asia.nikkei.com/", entities: ["Nikkei"] },
  ],
  auto: [
    { title: "CCFA — mix VE du jour", lede: "La prise chinoise se lit dans le VE, pas dans le volume total.", kind: "publication", label: "CCFA", url: "https://ccfa.fr/statistiques/", entities: ["CCFA", "BYD"] },
    { title: "Valeo — relais drones / datacenters", lede: "L’auto ne suffit plus. Usine AuRA et contrat Harmattan.", kind: "signal", label: "Valeo", url: "https://www.valeo.com/", entities: ["Valeo"] },
    { title: "Renault / Ampere — cadences Douai", lede: "Moody’s IG ne remplace pas un carnet. Suivre les volumes.", kind: "earnings", label: "Renault finance", url: "https://www.renaultgroup.com/finance/", entities: ["Renault"] },
    { title: "FIEV — second rang thermique", lede: "Défaillances BdF matériel de transport. ETI à appeler.", kind: "signal", label: "FIEV", url: "https://www.fiev.fr/", entities: ["FIEV"] },
    { title: "Stellantis — plan VE T3", lede: "Deadline guidance. Angle : prix d’entrée vs BYD.", kind: "deadline", label: "Stellantis investors", url: "https://www.stellantis.com/en/investors", entities: ["Stellantis"] },
  ],
  energy: [
    { title: "CRE — prix de détail gaz / élec", lede: "Après France gaz (22/09) : ce que le régulateur laisse filer.", kind: "publication", label: "CRE", url: "https://www.cre.fr/", entities: ["CRE"] },
    { title: "Leasing PAC — arbitrage Matignon", lede: "Signal faible : décision gouvernementale encore ouverte. 25 000 ménages visés.", kind: "signal", label: "Les Échos", url: "https://www.lesechos.fr/", entities: ["DGEC", "EDF"] },
    { title: "Brent / gazole pompe", lede: "Le litre écrit le PLF. Recouper Insee et EIA Ormuz.", kind: "macro", label: "EIA Hormuz", url: "https://www.eia.gov/todayinenergy/detail.php?id=61763", entities: ["EIA"] },
    { title: "RTE — raccordements", lede: "Data centers vs PAC vs industrie. La file d’attente est le papier.", kind: "publication", label: "RTE", url: "https://www.rte-france.com/", entities: ["RTE"] },
    { title: "TotalEnergies — trading Golfe", lede: "Desk pétrole = vrai QG Ormuz.", kind: "signal", label: "TotalEnergies", url: "https://totalenergies.com/fr/medias", entities: ["TotalEnergies"] },
  ],
  industry: [
    { title: "Made in Europe — suite Bercy", lede: "Après le 22/09 : Conseil compétitivité 24/09. Ce qui sort de salon Debré.", kind: "meeting", label: "Bercy presse", url: "https://presse.economie.gouv.fr/ip-made-in-europe-lheure-du-choix/", entities: ["Sébastien Martin"] },
    { title: "ArcelorMittal — sites France", lede: "Fos, Dunkerque, Mardyck, Le Creusot. Visites et CBAM.", kind: "visit", label: "Usine Nouvelle", url: "https://www.usinenouvelle.com/metallurgie-siderurgie/arcelormittal/", entities: ["ArcelorMittal"] },
    { title: "Bpifrance Le Lab — TPE-PME", lede: "Solde d’opinion et coût du crédit. Le hike n’y est pas encore.", kind: "publication", label: "Bpifrance Le Lab", url: "https://lelab.bpifrance.fr/", entities: ["Bpifrance"] },
    { title: "BdF — défaillances sectorielles", lede: "Construction, commerce, matériel de transport.", kind: "signal", label: "Banque de France", url: "https://www.banque-france.fr/statistiques/defaillances-dentreprises", entities: ["Banque de France"] },
    { title: "JORF / BODACC — dirigeants industrie", lede: "Les nominations industrielles sortent aux annonces légales, pas en une.", kind: "nomination", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  telecoms: [
    { title: "SFR — social du deal", lede: "Grève / closing. ARCEP observe, Orange intègre.", kind: "deadline", label: "ARCEP", url: "https://www.arcep.fr/", entities: ["SFR", "Orange"] },
    { title: "ARCEP — observatoire fibre", lede: "Le réseau est le collatéral du deal.", kind: "publication", label: "ARCEP", url: "https://www.arcep.fr/", entities: ["ARCEP"] },
    { title: "Orange — investisseurs", lede: "Intégration SFR et capex.", kind: "earnings", label: "Orange finance", url: "https://www.orange.com/fr/investisseurs", entities: ["Orange"] },
    { title: "AdC — concentrations telecoms", lede: "Renvois et engagements.", kind: "deal", label: "Autorité de la concurrence", url: "https://www.autoritedelaconcurrence.fr/", entities: ["AdC"] },
    { title: "Annonces légales — opérateurs", lede: "Nominations commerciales et techniques au BODACC.", kind: "nomination", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  space: [
    { title: "CNES — agenda vols", lede: "Calendrier spatial français. VORTEX et suivants.", kind: "publication", label: "CNES", url: "https://cnes.fr/fr", entities: ["CNES"] },
    { title: "Ariane / ESA", lede: "Cadence et compétition Falcon / Chine.", kind: "signal", label: "ESA", url: "https://www.esa.int/", entities: ["ESA"] },
    { title: "DGA spatial", lede: "Commandes militaires en orbite.", kind: "publication", label: "DGA", url: "https://www.defense.gouv.fr/dga", entities: ["DGA"] },
    { title: "Nikkei — lanceurs asiatiques", lede: "Traduit du japonais. JAXA / privés.", kind: "signal", label: "Nikkei", url: "https://asia.nikkei.com/", entities: ["JAXA"] },
    { title: "ETI spatial — BODACC", lede: "Cessions de sous-traitants New Space.", kind: "deal", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  eti: [
    { title: "Baromètre TPE-PME", lede: "Activité, trésorerie, crédit. Le pétrole casse l’industrie au S2.", kind: "publication", label: "Bpifrance Le Lab", url: "https://lelab.bpifrance.fr/", entities: ["Bpifrance"] },
    { title: "Défaillances BdF", lede: "Cibler les ETI à appeler avant le tribunal.", kind: "signal", label: "Banque de France", url: "https://www.banque-france.fr/statistiques/defaillances-dentreprises", entities: ["Banque de France"] },
    { title: "BODACC — cessions", lede: "Mandats, liquidations, nominations gérants.", kind: "nomination", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
    { title: "Medef / METI — terrain", lede: "Ce que les fédérations disent du PLF, pas le communiqué.", kind: "meeting", label: "Medef", url: "https://www.medef.com/", entities: ["Medef"] },
    { title: "Crédit ETI — banques", lede: "Coût du crédit 2e obstacle. Hike BCE du 10 sept.", kind: "macro", label: "Banque de France", url: "https://www.banque-france.fr/statistiques", entities: ["Banque de France"] },
  ],
  "public-finance": [
    { title: "AFT — adjudications / OAT", lede: "Couverture < 2× = papier politique, plus un papier de marché.", kind: "macro", label: "AFT", url: "https://www.aft.gouv.fr/", entities: ["AFT"] },
    { title: "Charge de la dette", lede: "+18,3 % sur un an. OAT > 4 %.", kind: "publication", label: "Insee", url: "https://www.insee.fr/fr/statistiques", entities: ["Insee", "AFT"] },
    { title: "FMI staff France", lede: "Paragraphe dette lu à Bercy avant Washington.", kind: "publication", label: "FMI WEO", url: "https://www.imf.org/en/Publications/WEO", entities: ["FMI"] },
    { title: "Cour des comptes — fenêtre d’automne", lede: "Le rapport recadre le PLF mieux qu’un meeting.", kind: "publication", label: "Cour des comptes", url: "https://www.ccomptes.fr/", entities: ["Cour des comptes"] },
    { title: "BdF — statistiques monétaires", lede: "Fonds, crédit, anticipations d’inflation.", kind: "publication", label: "Banque de France", url: "https://www.banque-france.fr/statistiques", entities: ["Banque de France"] },
  ],
  budget: [
    { title: "PLF 2027 — fuites d’arbitrage", lede: "Lecornu ~54 Md€ (Figaro). CDM 1er oct. Ni 49.3 ni ordonnances si pas d’obstruction.", kind: "political", label: "Vie publique", url: "https://www.vie-publique.fr/", entities: ["Lecornu"] },
    { title: "Assemblée — textes en cours", lede: "Ordre du jour, commissions des finances.", kind: "meeting", label: "Assemblée nationale", url: "https://www.assemblee-nationale.fr/", entities: ["Assemblée nationale"] },
    { title: "Sénat — travaux", lede: "Calendrier budgétaire et commissions.", kind: "meeting", label: "Sénat", url: "https://www.senat.fr/", entities: ["Sénat"] },
    { title: "Promesse CFA / APL / RSA", lede: "Tenir le courrier du 9 sept. dès les premières fuites PLF.", kind: "deadline", label: "Gouvernement", url: "https://www.gouvernement.fr/", entities: ["Matignon"] },
    { title: "Braun-Pivet / 49.3", lede: "Le curseur institutionnel du budget.", kind: "political", label: "Assemblée nationale", url: "https://www.assemblee-nationale.fr/", entities: ["Yaël Braun-Pivet"] },
  ],
  banking: [
    { title: "CIB — rotation matières / dollar", lede: "Nominations BNP et pairs. Le pétrole cher recale les desks.", kind: "nomination", label: "BNP Paribas", url: "https://invest.bnpparibas/fr", entities: ["BNP Paribas"] },
    { title: "Crédit habitat — normes HCSF", lede: "35 % / 25 ans. Un geste après le hike ?", kind: "macro", label: "HCSF", url: "https://www.economie.gouv.fr/hcsf", entities: ["HCSF"] },
    { title: "Primary dealers OAT", lede: "Appétit du livre. Concentration = signal.", kind: "signal", label: "AFT", url: "https://www.aft.gouv.fr/", entities: ["AFT"] },
    { title: "Seeking Alpha — banques FR", lede: "Titres publics, déduire le nom à suivre.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
    { title: "BCE — transmission crédit", lede: "Dépôt 2,50 %. Effet sur les réseaux français.", kind: "macro", label: "BCE", url: "https://www.ecb.europa.eu/press/govcdec/mopo/html/index.fr.html", entities: ["BCE"] },
  ],
  ma: [
    { title: "AdC — concentrations du jour", lede: "Décisions, renvois, engagements. SFR, Exail, ETI.", kind: "deal", label: "Autorité de la concurrence", url: "https://www.autoritedelaconcurrence.fr/", entities: ["AdC"] },
    { title: "Commission UE — mergers", lede: "Phase 1 / 2 sur dossiers France.", kind: "deal", label: "Commission concentrations", url: "https://competition-cases.ec.europa.eu/", entities: ["Commission européenne"] },
    { title: "Seeking Alpha — cibles CAC", lede: "Un titre US met un chiffre. Recouper avant d’écrire le multiple.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
    { title: "BODACC — cessions", lede: "Les deals mid-cap sortent ici avant La Lettre.", kind: "deal", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
    { title: "Banques d’affaires — mandats", lede: "Nominations et rumeurs de process.", kind: "nomination", label: "La Lettre", url: "https://www.lalettre.fr/", entities: ["La Lettre"] },
  ],
  marches: [
    { title: "CAC / Brent / OAT — séance", lede: "Trois prix. Le fourth est le gazole à la pompe.", kind: "macro", label: "Euronext Paris", url: "https://www.euronext.com/fr/markets/paris", entities: ["Euronext"] },
    { title: "Fed — digestion Warsh", lede: "Projections et dollar. Traduire pour les OAT.", kind: "macro", label: "Federal Reserve", url: "https://www.federalreserve.gov/", entities: ["Fed"] },
    { title: "WSJ / CNBC — titres US", lede: "Traduit de l’anglais. Ce qui bouge les futures avant Paris.", kind: "publication", label: "WSJ", url: "https://www.wsj.com/", entities: ["WSJ"] },
    { title: "Seeking Alpha France", lede: "Titres publics seulement — déduire l’entreprise.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/market-outlook/global-investing/analysis/france", entities: ["Seeking Alpha"] },
    { title: "AFT — résultat d’adjudication", lede: "Couverture, TMP, demande.", kind: "macro", label: "AFT", url: "https://www.aft.gouv.fr/", entities: ["AFT"] },
  ],
  immobilier: [
    { title: "Notaires / volumes", lede: "Le volume est le problème, pas le prix. HCSF inchangé.", kind: "publication", label: "Notaires de France", url: "https://www.notaires.fr/", entities: ["Notaires"] },
    { title: "Crédit habitat BdF", lede: "Production, taux, durée.", kind: "macro", label: "Banque de France", url: "https://www.banque-france.fr/statistiques", entities: ["Banque de France"] },
    { title: "Insee — prix des logements", lede: "Transmission du crédit, pas un indice de prestige.", kind: "publication", label: "Insee", url: "https://www.insee.fr/fr/information/2830163", entities: ["Insee"] },
    { title: "HCSF — 35 % / 25 ans", lede: "Pas d’assouplissement au T2. Les réseaux demanderont un geste.", kind: "deadline", label: "HCSF", url: "https://www.economie.gouv.fr/hcsf", entities: ["HCSF"] },
    { title: "Bailleurs / promoteurs — BODACC", lede: "Défaillances promotion et foncières régionales.", kind: "signal", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  tech: [
    { title: "ChapsVision — alternative Palantir", lede: "DGSI, discussions États européens. Entreprise française, secteur stratégique.", kind: "signal", label: "BFMTV", url: "https://www.bfmtv.com/", entities: ["ChapsVision"] },
    { title: "Capgemini — n°2 et mix IA", lede: "Profil US = arbitrage IA vs body shopping.", kind: "nomination", label: "Capgemini", url: "https://investors.capgemini.com/fr/", entities: ["Capgemini"] },
    { title: "Seeking Alpha — IT services FR", lede: "Teleperformance, Capgemini, Soitec.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
    { title: "ANSSI / cyber", lede: "Veille incidents et doctrine souveraine.", kind: "publication", label: "ANSSI", url: "https://www.ssi.gouv.fr/", entities: ["ANSSI"] },
    { title: "Nikkei / Inde — IT", lede: "Traduit. Sous-traitance et visas, effet sur les ESN.", kind: "signal", label: "Economic Times", url: "https://economictimes.indiatimes.com/", entities: ["Economic Times"] },
  ],
  ia: [
    { title: "Mistral — mix compute vs licences", lede: "Le 1 Md€ de CA 2026 est-il un loueur de GPU labellisé UE ?", kind: "signal", label: "Mistral AI", url: "https://mistral.ai/", entities: ["Mistral AI"] },
    { title: "ChapsVision ArgonOS", lede: "Déploiement DGSI « plusieurs mois » (Lescure). Suivre les ministères.", kind: "deadline", label: "Les Échos", url: "https://www.lesechos.fr/", entities: ["ChapsVision"] },
    { title: "RTE / data centers IA", lede: "MW réellement commandés. File de raccordement.", kind: "signal", label: "RTE", url: "https://www.rte-france.com/", entities: ["RTE"] },
    { title: "Caixin — modèles chinois", lede: "Traduit du mandarin. Open-source et export de modèles.", kind: "publication", label: "Caixin", url: "https://www.caixinglobal.com/", entities: ["Caixin"] },
    { title: "ANSSI — IA de confiance", lede: "Doctrine souveraine vs hyperscalers.", kind: "publication", label: "ANSSI", url: "https://www.ssi.gouv.fr/", entities: ["ANSSI"] },
  ],
  education: [
    { title: "CFA / apprentis — promesse Lecornu", lede: "« Ni financement des CFA, ni aides à l’embauche ». À tester sur le PLF.", kind: "deadline", label: "Gouvernement", url: "https://www.gouvernement.fr/", entities: ["Lecornu"] },
    { title: "DEPP — effectifs", lede: "Rentrée et préparation PISA.", kind: "publication", label: "DEPP", url: "https://www.education.gouv.fr/", entities: ["DEPP"] },
    { title: "PISA 2025 — 4 déc.", lede: "On ne le découvre pas en décembre.", kind: "ranking", label: "OCDE PISA", url: "https://www.oecd.org/pisa/", entities: ["OCDE"] },
    { title: "DARES — apprentissage", lede: "Entrées en contrat, ruptures.", kind: "publication", label: "DARES", url: "https://dares.travail-gouv.fr/", entities: ["DARES"] },
    { title: "Assemblée — textes éducation", lede: "Ordre du jour commissions.", kind: "political", label: "Assemblée nationale", url: "https://www.assemblee-nationale.fr/", entities: ["Assemblée nationale"] },
  ],
  agriculture: [
    { title: "FranceAgriMer — blé / mer Noire", lede: "Odessa + FAO. Le prix écrit l’aide, pas l’inverse.", kind: "macro", label: "FranceAgriMer", url: "https://www.franceagrimer.fr/", entities: ["FranceAgriMer"] },
    { title: "Agreste — conjoncture", lede: "Collecte, cheptel, trésorerie exploitations.", kind: "publication", label: "Agreste", url: "https://agreste.agriculture.gouv.fr/", entities: ["Agreste"] },
    { title: "Pêcheurs — suite Chabaud", lede: "Aides indexées, PTZ trésorerie. Tenir le deal.", kind: "deadline", label: "Ministère de l’Agriculture", url: "https://agriculture.gouv.fr/", entities: ["Chabaud"] },
    { title: "FAO Food Price Index", lede: "Traduit. Céréales et huiles.", kind: "publication", label: "FAO", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/", entities: ["FAO"] },
    { title: "Sénat — textes agricoles", lede: "Travaux en cours, PAC européenne.", kind: "political", label: "Sénat", url: "https://www.senat.fr/", entities: ["Sénat"] },
  ],
  retail: [
    { title: "Guerre des prix — prospectus", lede: "Carrefour, Leclerc, Intermarché. L’Ania parle déflation.", kind: "signal", label: "LSA", url: "https://www.lsa-conso.fr/", entities: ["LSA", "Ania"] },
    { title: "Carrefour — finance", lede: "Investor update et volumes.", kind: "earnings", label: "Carrefour", url: "https://www.carrefour.com/fr/finance", entities: ["Carrefour"] },
    { title: "Insee — consommation", lede: "Confiance des ménages et carburant.", kind: "publication", label: "Insee", url: "https://www.insee.fr/fr/statistiques", entities: ["Insee"] },
    { title: "US Census — retail (traduit)", lede: "Ventes au détail US. Anticipe le moral des importateurs.", kind: "macro", label: "US Census", url: "https://www.census.gov/retail/index.html", entities: ["US Census"] },
    { title: "BODACC — indépendants", lede: "Liquidations de commerces de centre-ville.", kind: "signal", label: "BODACC", url: "https://www.bodacc.fr/", entities: ["BODACC"] },
  ],
  medias: [
    { title: "ARCOM — décisions", lede: "Fréquences, pub, indépendance.", kind: "publication", label: "ARCOM", url: "https://www.arcom.fr/", entities: ["ARCOM"] },
    { title: "Irep — marché pub", lede: "Mix auto / retail. Le carburant mange le display.", kind: "publication", label: "Irep", url: "https://www.irep.asso.fr/", entities: ["Irep"] },
    { title: "TF1 / groupes — nominations", lede: "Commerciale et numérique.", kind: "nomination", label: "Groupe TF1", url: "https://www.groupe-tf1.fr/", entities: ["TF1"] },
    { title: "Seeking Alpha — media EU", lede: "Titres, déduire le dossier.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
    { title: "Assemblée — texts audiovisuel", lede: "Travaux en cours.", kind: "political", label: "Assemblée nationale", url: "https://www.assemblee-nationale.fr/", entities: ["Assemblée nationale"] },
  ],
  sante: [
    { title: "ANSM — ruptures", lede: "Antibiotiques, formes pédiatriques. Le stock est le papier.", kind: "publication", label: "ANSM", url: "https://ansm.sante.fr/disponibilites-des-produits-de-sante", entities: ["ANSM"] },
    { title: "HAS / Sécu", lede: "Avis et enveloppe. PLFSS en ligne de mire.", kind: "political", label: "Vie publique", url: "https://www.vie-publique.fr/", entities: ["HAS"] },
    { title: "Sénat — textes santé", lede: "Commissions et propositions.", kind: "meeting", label: "Sénat", url: "https://www.senat.fr/", entities: ["Sénat"] },
    { title: "Nominations ARS / JORF", lede: "Les ARS bougent au Journal officiel.", kind: "nomination", label: "JORF", url: "https://www.journal-officiel.gouv.fr/", entities: ["JORF"] },
    { title: "OMS / international", lede: "Veille traduite alertes sanitaires.", kind: "publication", label: "OMS", url: "https://www.who.int/fr", entities: ["OMS"] },
  ],
  pharma: [
    { title: "CHMP — agenda EMA", lede: "Avis du mois. Croiser nominations R&D.", kind: "publication", label: "EMA CHMP", url: "https://www.ema.europa.eu/en/committees/chmp", entities: ["EMA"] },
    { title: "Sanofi — pipeline", lede: "Chief R&D Ashrafian (1er oct.). Specialist care.", kind: "nomination", label: "Sanofi", url: "https://www.sanofi.com/fr/actualites", entities: ["Sanofi"] },
    { title: "ANSM — ruptures princeps", lede: "Formes pédiatriques et antibiotiques.", kind: "signal", label: "ANSM", url: "https://ansm.sante.fr/disponibilites-des-produits-de-sante", entities: ["ANSM"] },
    { title: "Seeking Alpha — Big Pharma EU", lede: "Titres, déduire le catalyseur.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
    { title: "Caixin — API Chine", lede: "Traduit du mandarin. Dépendance principes actifs.", kind: "signal", label: "Caixin", url: "https://www.caixinglobal.com/", entities: ["Caixin"] },
  ],
  chine: [
    { title: "NBS — industriel / ventes / FAI", lede: "Traduit du mandarin (NBS). Le vrai thermomètre, pas le PMI flash.", kind: "publication", label: "NBS Chine", url: "https://www.stats.gov.cn/english/", entities: ["NBS"] },
    { title: "PBOC — LPR / immobilier", lede: "Levier immobilier et yuan.", kind: "macro", label: "PBOC", url: "https://www.pbc.gov.cn/en/", entities: ["PBOC"] },
    { title: "Caixin — une du jour", lede: "Traduit. Ce que Pékin laisse filer.", kind: "publication", label: "Caixin", url: "https://www.caixinglobal.com/", entities: ["Caixin"] },
    { title: "BYD / VE Europe", lede: "Part de marché VE France (CCFA).", kind: "signal", label: "CCFA", url: "https://ccfa.fr/statistiques/", entities: ["BYD"] },
    { title: "Arcelor × China Oriental", lede: "Acier électrique, phase 1 juin 2027.", kind: "deal", label: "GMK Center", url: "https://gmk.center/en/tag/arcelormittal-en/", entities: ["ArcelorMittal"] },
  ],
  russie: [
    { title: "TASS / interfax — énergie", lede: "Traduit du russe. Prix gaz, flotte fantôme, OPEP+.", kind: "macro", label: "TASS", url: "https://tass.com/", entities: ["TASS"] },
    { title: "CBR — taux", lede: "Banque centrale russe. Roubles et guerre.", kind: "macro", label: "CBR", url: "https://www.cbr.ru/eng/", entities: ["CBR"] },
    { title: "UKMTO — Golfe / mer Noire", lede: "Flash tanker. Recouper Lloyd’s List.", kind: "signal", label: "UKMTO", url: "https://www.ukmto.org/", entities: ["UKMTO"] },
    { title: "Gazprom / Europe", lede: "Ce qu’il reste de flux. Angle France gaz 22/09.", kind: "macro", label: "IEA", url: "https://www.iea.org/reports/oil-market-report", entities: ["IEA"] },
    { title: "Sanctions / flotte fantôme", lede: "Assurance, pavillons, Brent.", kind: "signal", label: "Lloyd's List", url: "https://www.lloydslist.com/", entities: ["Lloyd's List"] },
  ],
  usa: [
    { title: "Fed / Trésor — dollar", lede: "Traduit de l’anglais. Warsh, projections, OAT.", kind: "macro", label: "Federal Reserve", url: "https://www.federalreserve.gov/", entities: ["Fed"] },
    { title: "BLS — CPI / PPI / payrolls", lede: "Calendrier US. Ce qui recale la BCE.", kind: "publication", label: "BLS CPI", url: "https://www.bls.gov/cpi/", entities: ["BLS"] },
    { title: "WSJ une — corporate US", lede: "Traduit. Deals et guidance qui touchent le CAC.", kind: "publication", label: "WSJ", url: "https://www.wsj.com/", entities: ["WSJ"] },
    { title: "Maison Blanche — énergie", lede: "Ormuz, pétrole, midterms.", kind: "political", label: "White House", url: "https://www.whitehouse.gov/", entities: ["Maison Blanche"] },
    { title: "Seeking Alpha — US names FR", lede: "Titres qui citent des sous-jacents français.", kind: "signal", label: "Seeking Alpha", url: "https://seekingalpha.com/", entities: ["Seeking Alpha"] },
  ],
  ukraine: [
    { title: "Kyiv — reconstruction / armes", lede: "Besoins 155 mm et drones. Recaler LPM.", kind: "visit", label: "Présidence ukrainienne", url: "https://www.president.gov.ua/en", entities: ["Ukraine"] },
    { title: "Arcelor Kryvyi Rih", lede: "Attaques, production, salariés.", kind: "signal", label: "Usine Nouvelle", url: "https://www.usinenouvelle.com/", entities: ["ArcelorMittal"] },
    { title: "Mer Noire — grain", lede: "FAO + FranceAgriMer.", kind: "macro", label: "FAO", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/", entities: ["FAO"] },
    { title: "UE — facilité Ukraine", lede: "Textes en cours AN / Sénat / Conseil.", kind: "political", label: "Conseil UE", url: "https://www.consilium.europa.eu/fr/", entities: ["Conseil UE"] },
    { title: "Drones — leçons de front", lede: "Helsing, Harmattan, Valeo, Eurenco.", kind: "signal", label: "Usine Nouvelle", url: "https://www.usinenouvelle.com/", entities: ["Helsing", "Eurenco"] },
  ],
};

export function padSectorDay(events: EventItem[], sector: SectorId, iso: string): EventItem[] {
  const seeds = W[sector] ?? [];
  const out = [...events];
  const have = new Set(out.map((e) => e.title.toLowerCase()));
  let i = 0;
  for (const seed of seeds) {
    if (out.length >= 5) break;
    if (have.has(seed.title.toLowerCase())) continue;
    i += 1;
    const sources: SourceRef[] = [{ label: seed.label, url: seed.url }];
    out.push({
      id: `watch-${sector}-${iso}-${i}`,
      date: iso,
      title: seed.title,
      lede: seed.lede,
      bullets: [
        "Veille de bureau — pas un flash confirmé si la source n’a pas daté le jour.",
        `Source : ${seed.label}. Toujours cliquable.`,
      ],
      kind: seed.kind,
      sectors: [sector],
      importance: "veille",
      confidence: "recurrence",
      source: seed.label,
      sources,
      entities: seed.entities,
      whyItMatters: "Cinq puces minimum par bureau et par jour. Celle-ci tient la garde quand l’agenda officiel est muet.",
      addedOn: iso,
    });
  }
  return out;
}
