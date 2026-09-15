create table if not exists veille_lessons (
  id serial primary key,
  detected text not null,
  source_url text not null,
  source_name text not null,
  sector text not null,
  angle text not null,
  missed text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists veille_lessons_created_at_idx on veille_lessons (created_at desc);
