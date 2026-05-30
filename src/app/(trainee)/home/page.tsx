"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NFMark } from "@/components/NFMark";
import { pageCache } from "@/lib/page-cache";

function BellIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
}
function FlameIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1.25 2.5-2.5 0-.61-.23-1.21-.64-1.67-.97-1.11-1.86-2.32-1.86-3.83a4 4 0 1 1 8 0c0 1.66-.5 3.16-1.5 4.5"/><path d="M12 22c-4.4 0-8-3.6-8-8 0-1.66.5-3.16 1.5-4.5"/></svg>;
}
function PlayIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/></svg>;
}
function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
}
function ArrowIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>;
}
function PlusIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>;
}
function DropIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/></svg>;
}
function DumbIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>;
}

type Exercise = { name: string; sets: number; reps: string | number };
type WorkoutDay = { id: string; day_number: number; label: string; scheduled_dow: number | null; exercises: Exercise[] };
type MealItem = { food_name: string; calories: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null };
type Meal = { id: string; name: string; time_window: string | null; items: MealItem[] };
type MealPlan = { name: string; total_calories: number | null; meals: Meal[] };
type WeightLog = { weight: number; logged_at: string };

const DEFAULT_WATER_GOAL = 3;
const HEB_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const HEB_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [todayDayIndex, setTodayDayIndex] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [completedToday, setCompletedToday] = useState(false);
  const [thisWeekCount, setThisWeekCount] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [doneMeals, setDoneMeals] = useState<boolean[]>([]);
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(DEFAULT_WATER_GOAL);
  const [loading, setLoading] = useState(true);

  const addWater = () => {
    const next = Math.min(waterGoal, parseFloat((water + 0.25).toFixed(2)));
    setWater(next);
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`nf_water_${today}`, next.toString());
    const cid = localStorage.getItem("nextfit_client_id");
    if (cid) {
      supabase.from("daily_water_logs").upsert(
        { client_id: cid, log_date: today, water_liters: next },
        { onConflict: "client_id,log_date" }
      );
    }
  };

  useEffect(() => {
    const cid = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!cid) { router.push("/join"); return; }

    const today = new Date().toISOString().split("T")[0];
    const CACHE_KEY = `home-${cid}-${today}`;

    const init = async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);

      // Round 1: fetch all independent data in parallel
      const [
        { data: waterLog },
        { data: cd },
        { data: wlogs },
        { data: cpRows },
        { data: cmpRows },
      ] = await Promise.all([
        supabase.from("daily_water_logs").select("water_liters").eq("client_id", cid).eq("log_date", today).maybeSingle(),
        supabase.from("clients").select("name, current_weight, water_goal_liters").eq("id", cid).single(),
        supabase.from("weight_logs").select("weight, logged_at").eq("client_id", cid).gte("logged_at", since.toISOString()).order("logged_at"),
        supabase.from("client_plans").select("plan_id").eq("client_id", cid).eq("active", true).order("id", { ascending: false }).limit(1),
        supabase.from("client_meal_plans").select("meal_plan_id").eq("client_id", cid).eq("active", true).order("id", { ascending: false }).limit(1),
      ]);

      if (waterLog) setWater(waterLog.water_liters);
      else { const saved = localStorage.getItem(`nf_water_${today}`); if (saved) setWater(parseFloat(saved)); }
      if (cd) { setClientName(cd.name); setCurrentWeight(cd.current_weight); setWaterGoal(cd.water_goal_liters ?? DEFAULT_WATER_GOAL); }
      if (wlogs) setWeightLogs(wlogs);

      const planId = cpRows?.[0]?.plan_id ?? null;
      const mealPlanId = cmpRows?.[0]?.meal_plan_id ?? null;

      // Round 2: fetch dependent lists in parallel
      const [wdaysRes, workoutPlanRes, mpDataRes, mealsDataRes] = await Promise.all([
        planId
          ? supabase.from("workout_days").select("id, day_number, label, scheduled_dow").eq("plan_id", planId).order("day_number")
          : Promise.resolve({ data: null }),
        planId
          ? supabase.from("workout_plans").select("days_per_week").eq("id", planId).single()
          : Promise.resolve({ data: null }),
        mealPlanId
          ? supabase.from("meal_plans").select("name, total_calories").eq("id", mealPlanId).single()
          : Promise.resolve({ data: null }),
        mealPlanId
          ? supabase.from("meals").select("id, name, time_window").eq("plan_id", mealPlanId).order("order_index")
          : Promise.resolve({ data: null }),
      ]);

      const wdays = wdaysRes.data ?? [];
      const mealsData = mealsDataRes.data ?? [];
      const dayIds = wdays.map((d) => d.id);
      const mealIds = mealsData.map((m) => m.id);

      // Round 3: fetch all items/logs in parallel (no more N+1)
      const [allExsRes, sessionsRes, allItemsRes, logsRes] = await Promise.all([
        dayIds.length > 0
          ? supabase.from("plan_exercises").select("name, sets, reps, day_id").in("day_id", dayIds).order("order_index")
          : Promise.resolve({ data: null, count: null }),
        dayIds.length > 0
          ? supabase.from("workout_sessions").select("session_date").eq("client_id", cid).eq("completed", true).in("day_id", dayIds).order("session_date", { ascending: false }).limit(60)
          : Promise.resolve({ data: [] as { session_date: string }[] }),
        mealIds.length > 0
          ? supabase.from("meal_items").select("meal_id, food_name, calories, protein_g, carbs_g, fat_g").in("meal_id", mealIds).order("order_index")
          : Promise.resolve({ data: null }),
        mealIds.length > 0
          ? supabase.from("meal_logs").select("meal_id").eq("client_id", cid).eq("log_date", today).in("meal_id", mealIds)
          : Promise.resolve({ data: null }),
      ]);

      // Assemble workout days
      let snapDays: WorkoutDay[] = [];
      let snapTodayIdx = 0, snapCnt = 0, snapDpw = 3;
      let snapCompletedToday = false, snapThisWeekCount = 0;

      if (wdays.length > 0) {
        const allExs = allExsRes.data ?? [];
        const loadedDays: WorkoutDay[] = wdays.map((day) => ({
          id: day.id,
          day_number: day.day_number,
          label: day.label,
          scheduled_dow: (day as { scheduled_dow?: number | null }).scheduled_dow ?? null,
          exercises: allExs.filter((e) => (e as { day_id: string } & Exercise).day_id === day.id),
        }));
        setDays(loadedDays);

        const allSessions = (sessionsRes.data ?? []) as { session_date: string }[];
        const cnt = allSessions.length;
        const dpw = workoutPlanRes.data?.days_per_week ?? 3;
        const now2 = new Date(today);
        const startOfWeek = new Date(now2);
        startOfWeek.setDate(now2.getDate() - now2.getDay());
        const startOfWeekStr = startOfWeek.toISOString().split("T")[0];
        const completedTodayVal = allSessions.some((s) => s.session_date === today);
        const thisWeekCountVal = allSessions.filter((s) => s.session_date >= startOfWeekStr).length;

        setTotalSessions(cnt);
        setTodayDayIndex(cnt % loadedDays.length);
        setDaysPerWeek(dpw);
        setCompletedToday(completedTodayVal);
        setThisWeekCount(thisWeekCountVal);

        snapDays = loadedDays;
        snapTodayIdx = cnt % loadedDays.length;
        snapCnt = cnt;
        snapDpw = dpw;
        snapCompletedToday = completedTodayVal;
        snapThisWeekCount = thisWeekCountVal;
      }

      // Assemble meals
      let snapMealPlan: MealPlan | null = null;
      let snapDoneMeals: boolean[] = [];

      if (mpDataRes.data && mealsData.length > 0) {
        const allItems = allItemsRes.data ?? [];
        const logs = logsRes.data ?? [];
        const loadedMeals: Meal[] = mealsData.map((meal) => ({
          id: meal.id,
          name: meal.name,
          time_window: meal.time_window,
          items: allItems.filter((it) => (it as MealItem & { meal_id: string }).meal_id === meal.id),
        }));
        snapMealPlan = { name: mpDataRes.data.name, total_calories: mpDataRes.data.total_calories, meals: loadedMeals };
        snapDoneMeals = loadedMeals.map((m) => !!logs.find((l) => l.meal_id === m.id));
        setMealPlan(snapMealPlan);
        setDoneMeals(snapDoneMeals);
      }

      // Save snapshot for instant re-render on next visit
      pageCache.set(CACHE_KEY, {
        clientName: cd?.name ?? "",
        currentWeight: cd?.current_weight ?? null,
        weightLogs: wlogs ?? [],
        days: snapDays,
        todayDayIndex: snapTodayIdx,
        totalSessions: snapCnt,
        daysPerWeek: snapDpw,
        completedToday: snapCompletedToday,
        thisWeekCount: snapThisWeekCount,
        mealPlan: snapMealPlan,
        doneMeals: snapDoneMeals,
        waterGoal: cd?.water_goal_liters ?? DEFAULT_WATER_GOAL,
      });

      setLoading(false);
    };

    // Restore from cache for instant render — fetch in background to refresh
    const cached = pageCache.get<{
      clientName: string; currentWeight: number | null; weightLogs: WeightLog[];
      days: WorkoutDay[]; todayDayIndex: number; totalSessions: number;
      daysPerWeek: number; completedToday: boolean; thisWeekCount: number;
      mealPlan: MealPlan | null; doneMeals: boolean[]; waterGoal: number;
    }>(CACHE_KEY);

    if (cached) {
      setClientName(cached.clientName);
      setCurrentWeight(cached.currentWeight);
      setWeightLogs(cached.weightLogs);
      setDays(cached.days);
      setTodayDayIndex(cached.todayDayIndex);
      setTotalSessions(cached.totalSessions);
      setDaysPerWeek(cached.daysPerWeek);
      setCompletedToday(cached.completedToday);
      setThisWeekCount(cached.thisWeekCount);
      setMealPlan(cached.mealPlan);
      setDoneMeals(cached.doneMeals);
      setWaterGoal(cached.waterGoal);
      setLoading(false);
      init(); // silent background refresh
    } else {
      init();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMeal = async (i: number) => {
    const cid = localStorage.getItem("nextfit_client_id");
    if (!cid || !mealPlan) return;
    const meal = mealPlan.meals[i];
    const today = new Date().toISOString().split("T")[0];
    const next = doneMeals.map((v, j) => (j === i ? !v : v));
    setDoneMeals(next);
    if (!doneMeals[i]) {
      await supabase.from("meal_logs").upsert(
        { client_id: cid, meal_id: meal.id, log_date: today, completed_at: new Date().toISOString(), alternative_id: null },
        { onConflict: "client_id,meal_id,log_date" }
      );
    } else {
      await supabase.from("meal_logs").delete().eq("client_id", cid).eq("meal_id", meal.id).eq("log_date", today);
    }
  };

  // ─── Derived ───
  const now = new Date();
  const todayDow = now.getDay(); // 0=Sun … 6=Sat
  const hasSchedule = days.some((d) => d.scheduled_dow !== null);
  const scheduledTodayDay = hasSchedule ? (days.find((d) => d.scheduled_dow === todayDow) ?? null) : null;
  const isScheduledRestDay = hasSchedule && !scheduledTodayDay;
  // If schedule is set, use the scheduled day for today; otherwise fall back to rotation
  const todayDay = scheduledTodayDay ?? (days[todayDayIndex] ?? null);
  const nextDay = days.length > 1 ? days[(todayDayIndex + 1) % days.length] : null;
  const firstName = clientName.split(" ")[0] || "";
  const hour = now.getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  const dateStr = `${HEB_DAYS[now.getDay()]} · ${now.getDate()} ב${HEB_MONTHS[now.getMonth()]}`;

  const totalProtein = Math.round(mealPlan?.meals.reduce((s, m) => s + m.items.reduce((si, it) => si + (it.protein_g ?? 0), 0), 0) ?? 0);
  const totalCarbs   = Math.round(mealPlan?.meals.reduce((s, m) => s + m.items.reduce((si, it) => si + (it.carbs_g   ?? 0), 0), 0) ?? 0);
  const totalFat     = Math.round(mealPlan?.meals.reduce((s, m) => s + m.items.reduce((si, it) => si + (it.fat_g     ?? 0), 0), 0) ?? 0);
  const doneCalories = Math.round(mealPlan?.meals.reduce((s, m, i) => doneMeals[i] ? s + m.items.reduce((si, it) => si + (it.calories ?? 0), 0) : s, 0) ?? 0);
  const maxMacro = Math.max(totalProtein, totalCarbs, totalFat, 1);

  // Weight sparkline
  const wpts = weightLogs.length > 1 ? weightLogs.map((l) => l.weight) : [];
  const wMin = wpts.length ? Math.min(...wpts) : 0;
  const wMax = wpts.length ? Math.max(...wpts) : 1;
  const WW = 110, WH = 36;
  const wPath = wpts.map((v, i) => {
    const x = (i / Math.max(wpts.length - 1, 1)) * WW;
    const y = WH - ((v - wMin) / (wMax - wMin || 1)) * WH;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight;
  const prevWeight   = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2].weight : null;
  const weightDelta  = prevWeight !== null && latestWeight !== null ? latestWeight - prevWeight : null;

  const waterPct = water / waterGoal;

  if (loading) {
    return (
      <div className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
        <div className="px-6 pt-[58px] space-y-4">
          <div className="h-4 w-32 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-14 w-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-52 rounded-[28px] animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-36 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-36 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="h-36 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
      <div className="nf-scroll overflow-y-auto pb-8">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-[58px] pb-2">
          <NFMark size={30} />
          <button className="tap w-9 h-9 grid place-items-center rounded-full" style={{ color: "rgba(255,255,255,0.65)" }}>
            <BellIcon className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Greeting */}
        <div className="px-6 pt-4 pb-5 rise" style={{ animationDelay: "40ms" }}>
          <div className="flex items-center gap-2 text-[12px] tracking-wide mb-2" style={{ color: "rgba(255,255,255,0.40)" }}>
            <span>{dateStr}</span>
            {totalSessions > 0 && (
              <>
                <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                <span className="inline-flex items-center gap-1" style={{ color: "#E11D2A" }}>
                  <FlameIcon className="w-3.5 h-3.5" />
                  <span className="nums font-medium">{totalSessions} אימונים</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-[30px] leading-[1.15] tracking-tight" style={{ color: "#FAF9F6" }}>
            {greeting},<br />
            <span className="text-[36px] font-extrabold">{firstName || "שלום"}</span>
            <span style={{ color: "rgba(255,255,255,0.30)" }}>.</span>
          </h1>
          {todayDay && !completedToday && !isScheduledRestDay && (
            <p className="text-[14px] mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
              אימון היום: {todayDay.label} — {todayDay.exercises.length} תרגילים
            </p>
          )}
        </div>

        {/* Today workout hero */}
        {/* Workout hero — 3 states */}
        <div className="px-5 rise" style={{ animationDelay: "120ms" }}>
          {!todayDay ? (
            // No plan
            <div className="rounded-[28px] p-8 flex flex-col items-center gap-2 text-center"
              style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
              <DumbIcon className="w-8 h-8" style={{ color: "rgba(255,255,255,0.20)" }} />
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין תוכנית אימון פעילה</p>
            </div>
          ) : completedToday ? (
            // Already worked out today
            <div className="relative rounded-[28px] text-white p-5 overflow-hidden tap"
              style={{ background: "#0A0A0C", boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.10)" }}
              onClick={() => router.push("/workout")}>
              <div aria-hidden className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.40), rgba(16,185,129,0) 70%)" }} />
              <div className="relative flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase" style={{ color: "rgba(16,185,129,0.80)" }}>
                  <CheckIcon className="w-3.5 h-3.5" />
                  הושלם היום
                </div>
                <div className="text-[11px] text-white/50 nums">{thisWeekCount}/{daysPerWeek} השבוע</div>
              </div>
              <div className="relative mt-3">
                <h2 className="text-[26px] tracking-tight">{todayDay.label}</h2>
                <p className="mt-1 text-[12.5px]" style={{ color: "rgba(16,185,129,0.70)" }}>כל הכבוד! האימון הושלם</p>
              </div>
            </div>
          ) : isScheduledRestDay || thisWeekCount >= daysPerWeek ? (
            // Rest day
            <div className="relative rounded-[28px] text-white p-5 overflow-hidden"
              style={{ background: "#0A0A0C", boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.10)" }}>
              <div aria-hidden className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, rgba(100,100,120,0.30), transparent 70%)" }} />
              <div className="relative flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  יום מנוחה
                </div>
                <div className="text-[11px] text-white/50 nums">{thisWeekCount}/{daysPerWeek} השבוע</div>
              </div>
              <div className="relative mt-3">
                <h2 className="text-[26px] tracking-tight text-white/60">שאר ומנוחה</h2>
                <p className="mt-1 text-[12.5px] text-white/35">
                  {thisWeekCount >= daysPerWeek ? "השלמת את כל האימונים השבוע" : "אין אימון מתוכנן היום"}
                </p>
              </div>
            </div>
          ) : (
            // Normal — go work out
            <div
              className="relative rounded-[28px] text-white p-5 overflow-hidden tap"
              style={{ background: "#0A0A0C", boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.10)" }}
              onClick={() => router.push("/workout")}
            >
              <div aria-hidden className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, rgba(79,70,229,0.55), rgba(79,70,229,0) 70%)" }} />
              <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ background: "radial-gradient(1200px 200px at 90% 0%, white, transparent 60%)" }} />
              <div className="relative flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E11D2A" }} />
                  אימון היום
                </div>
                <div className="text-[11px] text-white/50 nums">{thisWeekCount}/{daysPerWeek} השבוע</div>
              </div>
              <div className="relative mt-3">
                <h2 className="text-[26px] tracking-tight">{todayDay.label}</h2>
                <p className="mt-1 text-[12.5px] text-white/55">{todayDay.exercises.length} תרגילים</p>
              </div>
              <div className="relative mt-5 flex items-center gap-3">
                <button
                  className="tap inline-flex items-center gap-2 bg-white rounded-full pl-4 pr-3 h-11 text-[14px] font-medium"
                  style={{ color: "#0A0A0C" }}
                  onClick={(e) => { e.stopPropagation(); router.push("/workout"); }}
                >
                  <PlayIcon className="w-3.5 h-3.5" />
                  התחל אימון
                </button>
                <div className="flex -space-x-2 space-x-reverse">
                  {todayDay.exercises.slice(0, 5).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full grid place-items-center"
                      style={{ background: "rgba(255,255,255,0.10)", boxShadow: "0 0 0 2px #0A0A0C" }}>
                      <span className="text-[11px] text-white/40 nums">{i + 1}</span>
                    </div>
                  ))}
                  {todayDay.exercises.length > 5 && (
                    <div className="w-7 h-7 rounded-full grid place-items-center text-[11px] text-white/40 nums"
                      style={{ background: "rgba(255,255,255,0.10)", boxShadow: "0 0 0 2px #0A0A0C" }}>
                      +{todayDay.exercises.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weight + Hydration */}
        <div className="px-5 mt-3 grid grid-cols-2 gap-3 rise" style={{ animationDelay: "200ms" }}>

          {/* Weight tile */}
          <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>משקל</div>
              {weightDelta !== null && (
                <div className="inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full nums"
                  style={{
                    color: weightDelta <= 0 ? "#10B981" : "#FF8A95",
                    background: weightDelta <= 0 ? "rgba(16,185,129,0.12)" : "rgba(225,29,42,0.12)",
                  }}>
                  {weightDelta > 0 ? "↑" : "↓"} {Math.abs(weightDelta).toFixed(1)}
                </div>
              )}
            </div>
            {latestWeight ? (
              <>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[28px] leading-none nums tracking-tight font-extrabold" style={{ color: "#FAF9F6" }}>{latestWeight}</span>
                  <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>ק״ג</span>
                </div>
                {wpts.length > 1 && (
                  <div className="mt-2 -mx-1">
                    <svg width="100%" height={WH} viewBox={`0 0 ${WW} ${WH}`} preserveAspectRatio="none" className="block">
                      <defs>
                        <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={`${wPath} L${WW},${WH} L0,${WH} Z`} fill="url(#wgrad)" />
                      <path d={wPath} fill="none" stroke="#E11D2A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-2 text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>לא הוגדר</div>
            )}
            <div className="mt-1 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {wpts.length > 1 ? "השבוע" : "משקל נוכחי"}
            </div>
          </div>

          {/* Hydration tile */}
          <div className="rounded-3xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>שתייה</div>
              <button className="tap w-6 h-6 grid place-items-center rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.70)" }}
                onClick={addWater}>
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <div className="relative w-[68px] h-[68px] -ml-1">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#E11D2A" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - waterPct)}
                    style={{ transition: "stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)" }} />
                </svg>
                <DropIcon className="w-4 h-4 absolute inset-0 m-auto" style={{ color: "#E11D2A" }} />
              </div>
              <div>
                <div className="text-[22px] leading-none nums font-bold" style={{ color: "#FAF9F6" }}>
                  {water.toFixed(1)}
                  <span className="text-[12px] font-normal" style={{ color: "rgba(255,255,255,0.40)" }}> / {waterGoal}L</span>
                </div>
                <div className="mt-1.5 text-[11px] nums" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {Math.round(waterPct * 100)}% מהיעד
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full"
                  style={{ background: i < Math.round(waterPct * 10) ? "#E11D2A" : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition glance */}
        <div className="px-5 mt-3 rise" style={{ animationDelay: "280ms" }}>
          {mealPlan ? (
            <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>תפריט היום</div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-[26px] tracking-tight font-extrabold nums leading-none" style={{ color: "#FAF9F6" }}>
                      {doneCalories.toLocaleString()}
                    </span>
                    {mealPlan.total_calories ? (
                      <span className="text-[12px] nums" style={{ color: "rgba(255,255,255,0.40)" }}>
                        / {mealPlan.total_calories.toLocaleString()} קק״ל
                      </span>
                    ) : (
                      <span className="text-[12px] nums" style={{ color: "rgba(255,255,255,0.40)" }}>קק״ל</span>
                    )}
                  </div>
                </div>
                <button className="tap text-[12px] font-medium inline-flex items-center gap-0.5 px-2 h-7 rounded-full"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  onClick={() => router.push("/nutrition")}>
                  פירוט
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {(totalProtein > 0 || totalCarbs > 0 || totalFat > 0) && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { label: "חלבון", value: totalProtein, color: "#E11D2A" },
                    { label: "פחמ׳",  value: totalCarbs,   color: "rgba(255,255,255,0.45)" },
                    { label: "שומן",  value: totalFat,     color: "#E8542A" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>{m.label}</span>
                        <span className="text-[11px] nums" style={{ color: "rgba(255,255,255,0.65)" }}>{m.value}g</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full barfill"
                          style={{ "--p": m.value / maxMacro, width: "100%", background: m.color, transformOrigin: "right center" } as React.CSSProperties} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 -mx-1 flex items-center gap-2 overflow-x-auto nf-scroll">
                {mealPlan.meals.map((meal, i) => {
                  const mealCal = meal.items.reduce((s, it) => s + (it.calories ?? 0), 0);
                  return (
                    <button key={i} onClick={() => toggleMeal(i)}
                      className="shrink-0 tap px-3 h-8 rounded-full inline-flex items-center gap-1.5 text-[12px]"
                      style={doneMeals[i]
                        ? { background: "rgba(225,29,42,0.15)", color: "#FAF9F6", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.30)" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }
                      }>
                      {doneMeals[i] && <CheckIcon className="w-3 h-3" style={{ color: "#E11D2A" }} />}
                      <span>{meal.name}</span>
                      {mealCal > 0 && <span className="nums opacity-60">{mealCal}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl p-5" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
              <div className="text-[11px] tracking-wide uppercase mb-2" style={{ color: "rgba(255,255,255,0.30)" }}>תפריט היום</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>המאמן עדיין לא שיוך תפריט</p>
            </div>
          )}
        </div>

        {/* Up next */}
        {nextDay && (
          <div className="px-5 mt-3 rise" style={{ animationDelay: "360ms" }}>
            <button className="w-full tap rounded-3xl p-4 flex items-center gap-3 text-right"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
              onClick={() => router.push("/workout")}>
              <div className="w-10 h-10 rounded-2xl grid place-items-center" style={{ background: "rgba(225,29,42,0.12)", color: "#E11D2A" }}>
                <DumbIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>הבא בתור</div>
                <div className="mt-0.5 text-[14px] font-medium" style={{ color: "#FAF9F6" }}>{nextDay.label}</div>
              </div>
              <div className="text-[12px] nums" style={{ color: "rgba(255,255,255,0.40)" }}>{nextDay.exercises.length} תרגילים</div>
              <ArrowIcon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.30)" }} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
