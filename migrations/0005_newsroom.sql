-- Cab News — rédactions, invitations, suivi personnel
create table if not exists staff_invites (
  email text primary key,
  role text not null,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id text primary key,
  email text not null default '',
  display_name text not null default '',
  role text not null default 'lecteur',
  created_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on profiles (email);
create index if not exists profiles_role_idx on profiles (role);

create table if not exists desk_watches (
  user_id text not null,
  sector_id text not null,
  primary key (user_id, sector_id)
);

create table if not exists event_follows (
  id serial primary key,
  user_id text not null,
  event_id text not null,
  kind text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, event_id, kind)
);

create index if not exists event_follows_user_idx on event_follows (user_id);

insert into staff_invites (email, role, display_name) values
  ('landaismaxence.lm@gmail.com', 'admin', 'Maxence Landais'),
  ('jeannedussueil@gmail.com', 'journaliste', 'Jeanne Dussueil')
on conflict (email) do update
  set role = excluded.role,
      display_name = excluded.display_name;
