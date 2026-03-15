create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key,
  name text not null,
  role text not null default 'teacher' check (role in ('teacher', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int not null default 0
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.categories(id) on delete set null
);

create table if not exists public.word_sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  grade_id uuid not null references public.grades(id),
  unit_id uuid references public.units(id),
  category_id uuid references public.categories(id),
  description text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  word_set_id uuid not null references public.word_sets(id) on delete cascade,
  english text not null,
  korean text not null,
  part_of_speech text,
  example_sentence text,
  order_no int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (word_set_id, lower(english), korean)
);

create table if not exists public.playback_presets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  show_mode text not null check (show_mode in ('EN_KO', 'KO_EN', 'RANDOM')),
  interval_ms int not null default 1500,
  transition text not null default 'NONE' check (transition in ('NONE', 'FADE')),
  repeat_count int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.set_revisions (
  id uuid primary key default gen_random_uuid(),
  word_set_id uuid not null references public.word_sets(id) on delete cascade,
  snapshot_json jsonb not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_words_set_order on public.words(word_set_id, order_no);
create index if not exists idx_words_lower_english on public.words(lower(english));
create index if not exists idx_word_sets_filters on public.word_sets(owner_id, grade_id, unit_id, category_id);

alter table public.profiles enable row level security;
alter table public.word_sets enable row level security;
alter table public.words enable row level security;
alter table public.playback_presets enable row level security;
alter table public.set_revisions enable row level security;

create policy "profiles_owner_select" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id);

create policy "word_sets_owner_crud" on public.word_sets
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "words_owner_crud" on public.words
  for all using (
    exists (
      select 1 from public.word_sets ws
      where ws.id = words.word_set_id and ws.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.word_sets ws
      where ws.id = words.word_set_id and ws.owner_id = auth.uid()
    )
  );

create policy "playback_owner_crud" on public.playback_presets
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "revisions_owner_crud" on public.set_revisions
  for all using (
    exists (
      select 1 from public.word_sets ws
      where ws.id = set_revisions.word_set_id and ws.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.word_sets ws
      where ws.id = set_revisions.word_set_id and ws.owner_id = auth.uid()
    )
  );
