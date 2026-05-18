-- הרץ אחרי supabase-schema.sql
-- יוצר את רשומת המאמן + מתאמן לדוגמה עם קוד הזמנה

-- 1. הוסף את המאמן (החשבון שנרשמת)
insert into public.coaches (id, name, email)
select id, split_part(email, '@', 1), email
from auth.users
where email = 'roi.levisman@gmail.com'
on conflict (id) do nothing;

-- 2. הוסף מתאמן לדוגמה עם קוד TEST01
insert into public.clients (coach_id, name, invite_code, active, current_weight, goal_weight)
select id, 'רועי לוי', '100001', true, 82.5, 78
from public.coaches
where email = 'roi.levisman@gmail.com'
on conflict do nothing;

-- 3. תקן את מדיניות ה-RLS — אפשר קריאת קוד הזמנה ללא אימות
create policy "clients_invite_lookup" on public.clients
  for select using (true);
