-- =====================================================
-- Nextfit Migration v3
-- מערכת תזונה מלאה: חלופות + מעקב מים
-- הרץ ב-Supabase SQL Editor
-- =====================================================

-- ─── 1. חלופות לארוחה (עד 3 לכל ארוחה) ───
create table if not exists public.meal_alternatives (
  id            uuid default gen_random_uuid() primary key,
  meal_id       uuid references public.meals(id) on delete cascade not null,
  option_number smallint not null check (option_number between 1 and 3),
  unique(meal_id, option_number)
);

-- ─── 2. פריטי מזון לכל חלופה ───
create table if not exists public.meal_alternative_items (
  id             uuid default gen_random_uuid() primary key,
  alternative_id uuid references public.meal_alternatives(id) on delete cascade not null,
  food_name      text not null,
  amount         text,
  calories       integer,
  protein_g      numeric,
  carbs_g        numeric,
  fat_g          numeric,
  order_index    integer default 0
);

-- ─── 3. מעקב שתייה יומי ───
create table if not exists public.daily_water_logs (
  id            uuid default gen_random_uuid() primary key,
  client_id     uuid references public.clients(id) on delete cascade not null,
  log_date      date not null default current_date,
  water_liters  numeric not null default 0,
  unique(client_id, log_date)
);

-- ─── 4. עדכון meal_logs — הוסף עמודת alternative_id ───
alter table public.meal_logs
  add column if not exists alternative_id uuid references public.meal_alternatives(id);

-- ─── 5. RLS ───
alter table public.meal_alternatives       enable row level security;
alter table public.meal_alternative_items  enable row level security;
alter table public.daily_water_logs        enable row level security;

create policy "meal_alternatives_open"
  on public.meal_alternatives for all using (true) with check (true);

create policy "meal_alternative_items_open"
  on public.meal_alternative_items for all using (true) with check (true);

create policy "daily_water_logs_open"
  on public.daily_water_logs for all using (true) with check (true);

-- ─── סיום ───
select 'Migration v3 הושלמה בהצלחה' as status;
