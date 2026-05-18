-- ==========================================
-- Nextfit Database Schema
-- הרץ את זה ב-Supabase SQL Editor
-- ==========================================

-- Coaches (מאמנים — מחובר ל-Supabase Auth)
create table public.coaches (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

-- Clients (מתאמנים)
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  name text not null,
  invite_code text unique not null,
  email text,
  phone text,
  goal_weight numeric,
  current_weight numeric,
  notes text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Workout Plans (תוכניות אימון)
create table public.workout_plans (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- Workout Days (ימי אימון בתוך תוכנית)
create table public.workout_days (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.workout_plans(id) on delete cascade not null,
  day_name text not null,
  workout_type text not null,
  order_index integer not null default 0
);

-- Exercise Library (ספריית תרגילים)
create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  muscle_group text,
  video_url text,
  description text,
  created_at timestamptz default now()
);

-- Plan Exercises (תרגילים בתוך יום אימון)
create table public.plan_exercises (
  id uuid default gen_random_uuid() primary key,
  day_id uuid references public.workout_days(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) not null,
  sets integer not null default 3,
  reps text not null,
  rest_seconds integer default 60,
  order_index integer not null default 0
);

-- Client ↔ Workout Plan
create table public.client_plans (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  plan_id uuid references public.workout_plans(id) on delete cascade not null,
  assigned_at timestamptz default now(),
  active boolean default true
);

-- Meal Plans (תפריטי תזונה)
create table public.meal_plans (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  name text not null,
  total_calories integer,
  notes text,
  created_at timestamptz default now()
);

-- Meals (ארוחות)
create table public.meals (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.meal_plans(id) on delete cascade not null,
  name text not null,
  time_window text,
  order_index integer not null default 0
);

-- Meal Items (פריטי אוכל בארוחה)
create table public.meal_items (
  id uuid default gen_random_uuid() primary key,
  meal_id uuid references public.meals(id) on delete cascade not null,
  food_name text not null,
  amount text,
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  order_index integer not null default 0
);

-- Client ↔ Meal Plan
create table public.client_meal_plans (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  meal_plan_id uuid references public.meal_plans(id) on delete cascade not null,
  assigned_at timestamptz default now(),
  active boolean default true
);

-- Weight Logs (שקילות)
create table public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  weight_kg numeric not null,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Progress Photos (תמונות התקדמות)
create table public.progress_photos (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  photo_url text not null,
  taken_at date not null default current_date,
  notes text,
  created_at timestamptz default now()
);

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================

alter table public.coaches enable row level security;
alter table public.clients enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_days enable row level security;
alter table public.exercises enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.client_plans enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.client_meal_plans enable row level security;
alter table public.weight_logs enable row level security;
alter table public.progress_photos enable row level security;

-- Coaches
create policy "coaches_own" on public.coaches for all using (auth.uid() = id);

-- Clients — מאמן רואה ומנהל את המתאמנים שלו
create policy "clients_coach" on public.clients for all using (auth.uid() = coach_id);

-- Workout plans — מאמן מנהל
create policy "workout_plans_coach" on public.workout_plans for all using (auth.uid() = coach_id);

-- Workout days
create policy "workout_days_coach" on public.workout_days for all using (
  exists (select 1 from public.workout_plans p where p.id = workout_days.plan_id and p.coach_id = auth.uid())
);

-- Exercises — כולם קוראים
create policy "exercises_read" on public.exercises for select using (true);

-- Plan exercises
create policy "plan_exercises_coach" on public.plan_exercises for all using (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.plan_id
    where d.id = plan_exercises.day_id and p.coach_id = auth.uid()
  )
);

-- Client plans
create policy "client_plans_coach" on public.client_plans for all using (
  exists (select 1 from public.clients c where c.id = client_plans.client_id and c.coach_id = auth.uid())
);

-- Meal plans
create policy "meal_plans_coach" on public.meal_plans for all using (auth.uid() = coach_id);

-- Meals
create policy "meals_coach" on public.meals for all using (
  exists (select 1 from public.meal_plans p where p.id = meals.plan_id and p.coach_id = auth.uid())
);

-- Meal items
create policy "meal_items_coach" on public.meal_items for all using (
  exists (
    select 1 from public.meals m
    join public.meal_plans p on p.id = m.plan_id
    where m.id = meal_items.meal_id and p.coach_id = auth.uid()
  )
);

-- Client meal plans
create policy "client_meal_plans_coach" on public.client_meal_plans for all using (
  exists (select 1 from public.clients c where c.id = client_meal_plans.client_id and c.coach_id = auth.uid())
);

-- Weight logs — מאמן רואה, כולם יכולים להוסיף
create policy "weight_logs_coach" on public.weight_logs for all using (
  exists (select 1 from public.clients c where c.id = weight_logs.client_id and c.coach_id = auth.uid())
);

-- Progress photos
create policy "progress_photos_coach" on public.progress_photos for all using (
  exists (select 1 from public.clients c where c.id = progress_photos.client_id and c.coach_id = auth.uid())
);

-- ==========================================
-- Trigger: יצירת coach אוטומטית בהרשמה
-- ==========================================
create or replace function public.handle_new_coach()
returns trigger as $$
begin
  insert into public.coaches (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_coach();

-- ==========================================
-- Sample exercise library (תרגילים לדוגמה)
-- ==========================================
insert into public.exercises (name, muscle_group) values
  ('לחיצת חזה בשכיבה', 'chest'),
  ('לחיצת חזה בשיפוע חיובי', 'chest'),
  ('פרפר עם משקולות', 'chest'),
  ('לחיצת כתפיים עומד', 'shoulders'),
  ('עלייה לצד', 'shoulders'),
  ('עלייה לפנים', 'shoulders'),
  ('פשיטות טריצפס בכבל', 'triceps'),
  ('לחיצה צרה', 'triceps'),
  ('מתח רחב', 'back'),
  ('חתירה בשכיבה', 'back'),
  ('חתירה בכבל', 'back'),
  ('כפיפות ביצפס עם משקולות', 'biceps'),
  ('כפיפות ביצפס בכבל', 'biceps'),
  ('סקוואט', 'legs'),
  ('לגפרס', 'legs'),
  ('כפיפות ברכיים שוכב', 'legs'),
  ('פשיטות רגליים', 'legs'),
  ('עלייה על קרש', 'legs'),
  ('מכרעים', 'legs');
