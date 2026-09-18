import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { canManageTeam, canSeeFuites, canWriteNotes, ROLE_IDS, type RoleId } from "@/lib/roles";

export type NewsroomProfile = {
  userId: string;
  email: string;
  displayName: string;
  role: RoleId;
  canSeeFuites: boolean;
  canManageTeam: boolean;
  canWriteNotes: boolean;
};

type ProfileRow = { user_id: string; email: string; display_name: string; role: string };

async function sessionEmail(userId: string, bearerToken?: string): Promise<string> {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const session = await getSessionUser(bearerToken);
  if (session?.id === userId && session.email) return session.email.toLowerCase().trim();
  if (session?.email) return session.email.toLowerCase().trim();
  return "";
}

function asRole(raw: string): RoleId {
  return (ROLE_IDS as readonly string[]).includes(raw) ? (raw as RoleId) : "lecteur";
}

function toProfile(row: ProfileRow): NewsroomProfile {
  const role = asRole(row.role);
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    role,
    canSeeFuites: canSeeFuites(role),
    canManageTeam: canManageTeam(role),
    canWriteNotes: canWriteNotes(role),
  };
}

async function upsertProfile(userId: string, email: string, displayName: string): Promise<NewsroomProfile> {
  const sql = await getSql();
  const existing = await sql<ProfileRow>`
    select user_id, email, display_name, role from profiles where user_id = ${userId} limit 1
  `;
  let role: RoleId = existing[0] ? asRole(existing[0].role) : "lecteur";
  let name = displayName || existing[0]?.display_name || "";

  if (email) {
    const invite = await sql<{ role: string; display_name: string }>`
      select role, display_name from staff_invites where email = ${email} limit 1
    `;
    if (invite[0]) {
      role = asRole(invite[0].role);
      if (!name) name = invite[0].display_name;
    }
  }

  if (!existing[0] && role === "lecteur") {
    const count = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    if ((count[0]?.n ?? 0) === 0) role = "admin";
  }

  const savedEmail = email || existing[0]?.email || "";
  await sql`
    insert into profiles (user_id, email, display_name, role)
    values (${userId}, ${savedEmail}, ${name || "Rédaction"}, ${role})
    on conflict (user_id) do update
      set email = excluded.email,
          display_name = case when excluded.display_name = '' then profiles.display_name else excluded.display_name end,
          role = excluded.role
  `;
  const row = await sql<ProfileRow>`
    select user_id, email, display_name, role from profiles where user_id = ${userId} limit 1
  `;
  return toProfile(row[0]!);
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const bearer = (context as { bearerToken?: string }).bearerToken;
    const email = await sessionEmail(context.userId, bearer);
    return upsertProfile(context.userId, email, "");
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const mine = await sql<ProfileRow>`
      select user_id, email, display_name, role from profiles where user_id = ${context.userId} limit 1
    `;
    if (!mine[0] || !canManageTeam(mine[0].role)) {
      throw new Error("Réservé à la direction");
    }
    const invites = await sql<{ email: string; role: string; display_name: string }>`
      select email, role, display_name from staff_invites order by role, email
    `;
    const members = await sql<ProfileRow>`
      select user_id, email, display_name, role from profiles order by role, display_name
    `;
    return { invites, members: members.map(toProfile) };
  });


export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      email: z.string().email(),
      role: z.enum(ROLE_IDS),
      displayName: z.string().trim().min(1).max(80),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const mine = await sql<ProfileRow>`
      select user_id, email, display_name, role from profiles where user_id = ${context.userId} limit 1
    `;
    if (!mine[0] || !canManageTeam(mine[0].role)) throw new Error("Réservé à la direction");
    const email = data.email.toLowerCase().trim();
    await sql`
      insert into staff_invites (email, role, display_name)
      values (${email}, ${data.role}, ${data.displayName})
      on conflict (email) do update
        set role = excluded.role, display_name = excluded.display_name
    `;
    await sql`
      update profiles set role = ${data.role}, display_name = ${data.displayName}
      where email = ${email}
    `;
    return { ok: true as const };
  });

export const listMyDesks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ sector_id: string }>`
      select sector_id from desk_watches where user_id = ${context.userId} order by sector_id
    `;
    return rows.map((r) => r.sector_id);
  });

export const toggleMyDesk = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ sectorId: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ sector_id: string }>`
      select sector_id from desk_watches
      where user_id = ${context.userId} and sector_id = ${data.sectorId}
      limit 1
    `;
    if (existing[0]) {
      await sql`
        delete from desk_watches where user_id = ${context.userId} and sector_id = ${data.sectorId}
      `;
      return { watching: false as const };
    }
    await sql`
      insert into desk_watches (user_id, sector_id) values (${context.userId}, ${data.sectorId})
      on conflict do nothing
    `;
    return { watching: true as const };
  });

export type FollowRow = {
  eventId: string;
  kind: "suivi" | "anticipation";
  note: string;
  createdAt: string;
};

export const listMyFollows = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ event_id: string; kind: string; note: string; created_at: string }>`
      select event_id, kind, note, created_at::text as created_at
      from event_follows
      where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(
      (r): FollowRow => ({
        eventId: r.event_id,
        kind: r.kind === "anticipation" ? "anticipation" : "suivi",
        note: r.note,
        createdAt: r.created_at,
      }),
    );
  });

export const upsertFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      eventId: z.string().min(1),
      kind: z.enum(["suivi", "anticipation"]),
      note: z.string().max(4000).optional(),
      remove: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.remove) {
      await sql`
        delete from event_follows
        where user_id = ${context.userId} and event_id = ${data.eventId} and kind = ${data.kind}
      `;
      return { ok: true as const };
    }
    const note = data.note?.trim() ?? "";
    await sql`
      insert into event_follows (user_id, event_id, kind, note)
      values (${context.userId}, ${data.eventId}, ${data.kind}, ${note})
      on conflict (user_id, event_id, kind) do update set note = excluded.note
    `;
    return { ok: true as const };
  });
