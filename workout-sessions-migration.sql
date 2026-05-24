create table if not exists public.workout_sessions (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  day_id uuid references public.workout_days(id) on delete cascade not null,
  session_date date not null default current_date,
  completed boolean not null default true,
  completed_at timestamptz,
  unique(client_id, day_id, session_date)
);

alter table public.workout_sessions enable row level security;

create policy if not exists "workout_sessions_open"
  on public.workout_sessions for all using (true) with check (true);
