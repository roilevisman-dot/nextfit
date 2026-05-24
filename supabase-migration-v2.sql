-- =====================================================
-- Nextfit Migration v2
-- תיקון סכמה + טבלאות מעקב + גישה למתאמנים
-- הרץ ב-Supabase SQL Editor
-- =====================================================

-- ─── 1. תיקון workout_plans ───
alter table public.workout_plans
  add column if not exists days_per_week integer not null default 3;

-- ─── 2. תיקון workout_days ───
-- שנה שמות עמודות
do $$ begin
  if exists (select 1 from information_schema.columns
    where table_name='workout_days' and column_name='day_name') then
    alter table public.workout_days rename column day_name to label;
  end if;
end $$;

alter table public.workout_days
  add column if not exists day_number integer not null default 1;

do $$ begin
  if exists (select 1 from information_schema.columns
    where table_name='workout_days' and column_name='workout_type') then
    alter table public.workout_days drop column workout_type;
  end if;
end $$;

-- ─── 3. תיקון plan_exercises ───
-- exercise_id יהיה nullable (המאמן כותב שם תרגיל חופשי)
alter table public.plan_exercises
  alter column exercise_id drop not null;

alter table public.plan_exercises
  add column if not exists name text;

-- ─── 4. תיקון weight_logs ───
-- שנה weight_kg → weight
do $$ begin
  if exists (select 1 from information_schema.columns
    where table_name='weight_logs' and column_name='weight_kg') then
    alter table public.weight_logs rename column weight_kg to weight;
  end if;
end $$;

-- logged_at: שנה מ-date ל-timestamptz אם צריך
do $$ begin
  if (select data_type from information_schema.columns
    where table_name='weight_logs' and column_name='logged_at') = 'date' then
    alter table public.weight_logs
      alter column logged_at type timestamptz using logged_at::timestamptz;
  end if;
end $$;

-- ─── 5. טבלת מעקב אימונים ───
create table if not exists public.workout_sessions (
  id          uuid default gen_random_uuid() primary key,
  client_id   uuid references public.clients(id) on delete cascade not null,
  day_id      uuid references public.workout_days(id) on delete cascade not null,
  session_date date not null default current_date,
  completed   boolean default false,
  started_at  timestamptz default now(),
  completed_at timestamptz
);

-- ─── 6. טבלת מעקב סטים/משקלים ───
create table if not exists public.exercise_logs (
  id            uuid default gen_random_uuid() primary key,
  session_id    uuid references public.workout_sessions(id) on delete cascade not null,
  exercise_name text not null,
  set_number    integer not null,
  reps          integer,
  weight_kg     numeric,
  logged_at     timestamptz default now()
);

-- ─── 7. טבלת מעקב ארוחות ───
create table if not exists public.meal_logs (
  id           uuid default gen_random_uuid() primary key,
  client_id    uuid references public.clients(id) on delete cascade not null,
  meal_id      uuid references public.meals(id) on delete cascade not null,
  log_date     date not null default current_date,
  completed_at timestamptz default now()
);

-- ─── 8. RLS לטבלאות החדשות ───
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs     enable row level security;
alter table public.meal_logs         enable row level security;

-- ─── 9. גישת קריאה פתוחה למתאמנים (anon) ───
-- המתאמן לא מחובר כ-auth user, רק יש לו client_id

-- clients: קריאה פתוחה (לצורך join בקוד)
drop policy if exists "clients_invite_lookup" on public.clients;
create policy "clients_public_read" on public.clients for select using (true);

-- תוכניות אימון — קריאה פתוחה
create policy if not exists "workout_plans_public_read" on public.workout_plans
  for select using (true);
create policy if not exists "workout_days_public_read" on public.workout_days
  for select using (true);
create policy if not exists "plan_exercises_public_read" on public.plan_exercises
  for select using (true);
create policy if not exists "client_plans_public_read" on public.client_plans
  for select using (true);

-- תפריטי תזונה — קריאה פתוחה
create policy if not exists "meal_plans_public_read" on public.meal_plans
  for select using (true);
create policy if not exists "meals_public_read" on public.meals
  for select using (true);
create policy if not exists "meal_items_public_read" on public.meal_items
  for select using (true);
create policy if not exists "client_meal_plans_public_read" on public.client_meal_plans
  for select using (true);

-- weight_logs — קריאה פתוחה + כתיבה פתוחה
create policy if not exists "weight_logs_public_read"   on public.weight_logs for select using (true);
create policy if not exists "weight_logs_public_insert" on public.weight_logs for insert with check (true);

-- מעקב אימונים — כתיבה וקריאה פתוחות (client_id מסונן בקוד)
create policy "workout_sessions_open" on public.workout_sessions for all using (true) with check (true);
create policy "exercise_logs_open"    on public.exercise_logs    for all using (true) with check (true);
create policy "meal_logs_open"        on public.meal_logs        for all using (true) with check (true);

-- ─── סיום ───
select 'Migration v2 הושלמה בהצלחה' as status;
