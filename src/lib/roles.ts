export const ROLES = [
  {
    id: "admin",
    label: "Direction",
    audience: "Fondateurs, éditeur, direction de la rédaction",
    blurb:
      "Tout le journal : bureaux, fuites, équipe, invitations. C’est le compte de Maxence Landais.",
  },
  {
    id: "chef",
    label: "Rédacteur en chef",
    audience: "Conférence de rédaction, arbitrage des unes",
    blurb: "Tous les bureaux, fuites, notes. Pas la gestion des accès.",
  },
  {
    id: "journaliste",
    label: "Journaliste",
    audience: "Permanents de la rédaction",
    blurb:
      "Espace personnel : bureaux suivis, anticipations, notes. Accès aux fuites. C’est le compte de Jeanne Dussueil.",
  },
  {
    id: "pigiste",
    label: "Pigiste",
    audience: "Contributeurs missionnés sur un ou deux bureaux",
    blurb: "Uniquement les desks assignés, suivi et anticipation. Pas les fuites.",
  },
  {
    id: "lecteur",
    label: "Lecteur rédaction",
    audience: "Stagiaires, documentalistes, relecteurs",
    blurb: "Lecture du brief, des promesses et des sources. Pas d’écriture, pas de fuites.",
  },
  {
    id: "invite",
    label: "Invité",
    audience: "Investisseurs, partenaires, direction d’un titre ami",
    blurb: "Vue de démonstration : prévisions, signaux, dataviz. Aucune fuite, aucune note.",
  },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export function roleLabel(id: string): string {
  return ROLES.find((r) => r.id === id)?.label ?? "Lecteur rédaction";
}

export function canSeeFuites(role: string): boolean {
  return role === "admin" || role === "chef" || role === "journaliste";
}

export function canManageTeam(role: string): boolean {
  return role === "admin";
}

export function canWriteNotes(role: string): boolean {
  return role === "admin" || role === "chef" || role === "journaliste" || role === "pigiste";
}

export const ROLE_IDS = ROLES.map((r) => r.id) as [RoleId, ...RoleId[]];
