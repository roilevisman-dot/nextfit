# NextFit — הנחיות לפיתוח

## מה האפליקציה
פלטפורמת ניהול מתאמנים למאמני כושר.
שני צדדים: **מאמן** (trainer) ו**מתאמן** (trainee).

## חוקים קריטיים — אסור לשבור

### אין נתונים פיקטיביים
- **אסור** להוסיף מערכים/אובייקטים קשיחים עם שמות כמו "יואב כהן", "מיכל ברק", "דניאל שמש" וכו'
- **אסור** להוסיף hardcoded stats (כמו "84%", "7 אימונים", "3 מתאמנים")
- **כל** הנתונים חייבים לבוא מ-Supabase בזמן ריצה
- אם הטבלה ריקה — מציגים מצב ריק נקי, לא נתונים מדומים

### זיהוי משתמשים
- **מאמן**: מזוהה דרך `supabase.auth.getUser()` → `user.id`
- **מתאמן**: מזוהה דרך `localStorage.getItem("nextfit_client_id")` (לא Supabase Auth)

## Stack
- Next.js 14 App Router, TypeScript, Tailwind CSS v4
- Supabase (PostgreSQL + RLS) — project: `muewyimwfltihqaifzsa`
- Deployed: `nextfit-phi.vercel.app`
- GitHub: `roilevisman-dot/nextfit`, branch: `main`

## עיצוב
- רקע: `#0B0A08` | טקסט: `#FAF9F6` | אקסנט: `#E11D2A` (אדום)
- אנימציות: `.tap` (לחיצה), `.rise` (כניסה)
- RTL, עברית, font-heb
- אין אמוג'ים, אין קומנטים מיותרים בקוד

## מבנה ניתובים
```
/login                                  → כניסת מאמן
/join                                   → הצטרפות מתאמן (קוד 5 ספרות)
/(trainer)/dashboard                    → לוח בקרה
/(trainer)/clients                      → רשימת מתאמנים
/(trainer)/clients/[id]                 → פרופיל מתאמן
/(trainer)/clients/[id]/nutrition       → בניית תפריט תזונה
/(trainer)/clients/[id]/nutrition/daily → מעקב יומי (Supabase Realtime)
/(trainer)/clients/[id]/workout         → בניית תוכנית אימון
/(trainer)/clients/[id]/progress        → התקדמות מתאמן
/(trainee)/home                         → דף הבית
/(trainee)/nutrition                    → תפריט + סימון ארוחות + מים
/(trainee)/workout                      → תוכנית אימון
/(trainee)/progress                     → מעקב משקל וגרף
/(trainee)/profile                      → פרופיל אישי
```

## טבלאות מרכזיות ב-Supabase
- `clients` — coach_id, name, invite_code, active, current_weight, goal_weight, height_cm, מידות גוף
- `meal_plans` — coach_id, name, total_calories
- `meals` — plan_id, name, time_window, order_index
- `meal_items` — meal_id, food_name, amount, calories, protein_g, carbs_g, fat_g, order_index
- `meal_alternatives` — meal_id, option_number (1-3)
- `meal_alternative_items` — alternative_id, food_name, amount, calories, ...
- `client_meal_plans` — client_id, meal_plan_id, active
- `meal_logs` — client_id, meal_id, log_date, completed_at, alternative_id — UNIQUE(client_id, meal_id, log_date)
- `daily_water_logs` — client_id, log_date, water_liters — UNIQUE(client_id, log_date)
- `weight_logs` — client_id, weight, logged_at

## כללי תכנות
- תמיד לענות למשתמש בעברית
- לא ליצור קבצי .md חדשים אלא אם מתבקש במפורש
- לא להוסיף קומנטים לקוד אלא אם הלוגיקה לא ברורה
- delete+insert במקום upsert כשאין unique constraint מוגדר
