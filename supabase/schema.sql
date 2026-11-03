-- Supreme AutoSpa: lead inbox. Run once in the Supabase SQL editor.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','replied','scheduled','done','closed')),
  name text not null,
  phone text not null,
  email text,
  contact text,
  vtype text,
  vehicle text,
  color text,
  paint text,
  interior text,
  services jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  notes text,
  photos boolean not null default false,
  message text,
  owner_notes text not null default '',
  estimate text not null default '',
  history jsonb not null default '[]'::jsonb
);

alter table public.leads enable row level security;

-- Anyone on the website may send a request, as a NEW lead only.
create policy "public can submit a quote" on public.leads
  for insert to anon
  with check (status = 'new' and owner_notes = '' and estimate = '');

-- Only signed-in users can read or change leads. Create ONE user for the owner
-- in Authentication > Users, and turn off "Allow new users to sign up".
create policy "owner can read" on public.leads for select to authenticated using (true);
create policy "owner can update" on public.leads for update to authenticated using (true) with check (true);
