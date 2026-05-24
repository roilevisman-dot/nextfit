"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MealItem = {
  food_name: string;
  amount: string | null;
  calories: number | null;
};

type AltItem = MealItem;

type MealLog = {
  meal_id: string;
  alternative_id: string | null;
  altItems?: AltItem[];
};

type Meal = {
  id: string;
  name: string;
  time_window: string | null;
  items: MealItem[];
};

function BackIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 19l-7-7 7-7" /></svg>;
}
function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 13l4 4L19 7" /></svg>;
}
function DropIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z" /></svg>;
}
function UtensilsIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
}

const ACCENT = "#E11D2A";
const WATER_GOAL = 2.5;
const HEB_MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

export default function NutritionDailyPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [water, setWater] = useState<number | null>(null);
  const [totalCaloriesTarget, setTotalCaloriesTarget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const todayLabel = (() => {
    const d = new Date();
    return `${d.getDate()} ב${HEB_MONTHS[d.getMonth()]}`;
  })();

  useEffect(() => {
    const init = async () => {
      const { data: cd } = await supabase.from("clients").select("name").eq("id", clientId).single();
      if (cd) setClientName(cd.name);

      // Active plan
      const { data: cmpRows } = await supabase.from("client_meal_plans")
        .select("meal_plan_id")
        .eq("client_id", clientId).eq("active", true)
        .order("id", { ascending: false }).limit(1);
      const cmp = cmpRows?.[0];
      if (!cmp?.meal_plan_id) { setLoading(false); return; }

      const { data: planData } = await supabase.from("meal_plans")
        .select("total_calories").eq("id", cmp.meal_plan_id).single();
      if (planData) setTotalCaloriesTarget(planData.total_calories);

      const { data: mealsData } = await supabase.from("meals")
        .select("id, name, time_window")
        .eq("plan_id", cmp.meal_plan_id)
        .order("order_index");
      if (!mealsData) { setLoading(false); return; }

      // Load meal items
      const loadedMeals: Meal[] = await Promise.all(
        mealsData.map(async (m) => {
          const { data: items } = await supabase.from("meal_items")
            .select("food_name, amount, calories")
            .eq("meal_id", m.id).order("order_index");
          return { id: m.id, name: m.name, time_window: m.time_window, items: items ?? [] };
        })
      );
      setMeals(loadedMeals);

      // Load today's logs
      const mealIds = mealsData.map((m) => m.id);
      const [{ data: logsData }, { data: waterLog }] = await Promise.all([
        supabase.from("meal_logs")
          .select("meal_id, alternative_id")
          .eq("client_id", clientId).eq("log_date", today)
          .in("meal_id", mealIds),
        supabase.from("daily_water_logs")
          .select("water_liters")
          .eq("client_id", clientId).eq("log_date", today)
          .single(),
      ]);

      if (waterLog) setWater(waterLog.water_liters);

      // Load alternative items for logs that used an alternative
      const enrichedLogs: MealLog[] = await Promise.all(
        (logsData ?? []).map(async (log) => {
          if (!log.alternative_id) return { ...log, altItems: undefined };
          const { data: altItems } = await supabase.from("meal_alternative_items")
            .select("food_name, amount, calories")
            .eq("alternative_id", log.alternative_id)
            .order("order_index");
          return { ...log, altItems: altItems ?? [] };
        })
      );
      setLogs(enrichedLogs);
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // ─── Derived ───
  const consumedCalories = meals.reduce((sum, meal) => {
    const log = logs.find((l) => l.meal_id === meal.id);
    if (!log) return sum;
    const items = log.altItems ?? meal.items;
    return sum + items.reduce((s, it) => s + (it.calories ?? 0), 0);
  }, 0);
  const waterPct = water !== null ? Math.min(water / WATER_GOAL, 1) : 0;

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-5 w-24 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-28 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-12" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.push(`/clients/${clientId}`)} className="tap flex items-center gap-1.5 text-[13px]"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />{clientName}
        </button>

        {/* Header */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>מעקב תזונה</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-medium mt-1"
            style={{ background: "rgba(225,29,42,0.12)", color: "#FF8A95", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.22)" }}>
            {todayLabel}
          </span>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl p-4 rise" style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <p className="text-[10.5px] tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>סיכום היום</p>
          <div className="grid grid-cols-2 gap-3">

            {/* Calories */}
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>קלוריות</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-extrabold leading-none" style={{ color: ACCENT }}>
                  {consumedCalories.toLocaleString()}
                </span>
                {totalCaloriesTarget && (
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    / {totalCaloriesTarget.toLocaleString()}
                  </span>
                )}
              </div>
              {totalCaloriesTarget && (
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{
                    background: ACCENT,
                    width: `${Math.min(100, (consumedCalories / totalCaloriesTarget) * 100)}%`,
                    transition: "width 600ms ease",
                  }} />
                </div>
              )}
            </div>

            {/* Water */}
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>שתייה</p>
              <div className="flex items-center gap-2">
                <DropIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#3B82F6" }} />
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-extrabold leading-none" style={{ color: water !== null ? "#60A5FA" : "rgba(255,255,255,0.30)" }}>
                    {water !== null ? water.toFixed(1) : "—"}
                  </span>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>/ {WATER_GOAL}L</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{
                  background: "#3B82F6",
                  width: `${waterPct * 100}%`,
                  transition: "width 600ms ease",
                }} />
              </div>
            </div>
          </div>

          {/* Meal count */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>
              {logs.length} מתוך {meals.length} ארוחות הושלמו
            </span>
            <div className="flex gap-1 mr-1">
              {meals.map((m) => {
                const done = logs.some((l) => l.meal_id === m.id);
                return (
                  <div key={m.id} className="w-2 h-2 rounded-full"
                    style={{ background: done ? "#10B981" : "rgba(255,255,255,0.12)" }} />
                );
              })}
            </div>
          </div>
        </div>

        {/* Meals list */}
        {meals.length > 0 ? (
          <div className="space-y-2.5 rise" style={{ animationDelay: "120ms" }}>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>ארוחות</p>
            {meals.map((meal) => {
              const log = logs.find((l) => l.meal_id === meal.id);
              const isDone = !!log;
              const usedAlt = log?.altItems != null;
              const activeItems = usedAlt ? (log?.altItems ?? []) : meal.items;
              const mealCal = activeItems.reduce((s, it) => s + (it.calories ?? 0), 0);

              return (
                <div key={meal.id} className="rounded-2xl flex items-stretch"
                  style={{
                    background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                    boxShadow: isDone
                      ? "inset 0 0 0 1px rgba(16,185,129,0.18)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}>
                  {/* Status dot */}
                  <div className="w-12 flex-shrink-0 grid place-items-center">
                    {isDone ? (
                      <div className="w-7 h-7 rounded-full grid place-items-center"
                        style={{ background: "rgba(16,185,129,0.15)" }}>
                        <CheckIcon className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
                      </div>
                    ) : (
                      <UtensilsIcon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.20)" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 py-3 pr-3 pl-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-[13px] font-semibold"
                            style={{ color: isDone ? "#FAF9F6" : "rgba(255,255,255,0.50)" }}>
                            {meal.name}
                          </p>
                          {usedAlt && (
                            <span className="text-[9.5px] px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
                              החליף לחלופה
                            </span>
                          )}
                        </div>
                        {meal.time_window && (
                          <p className="text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                            {meal.time_window}
                          </p>
                        )}
                        {isDone && activeItems.length > 0 && (
                          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {activeItems.map((it) => `${it.food_name}${it.amount ? ` ${it.amount}` : ""}`).join(" · ")}
                          </p>
                        )}
                      </div>
                      {isDone && mealCal > 0 && (
                        <span className="text-[12px] font-semibold flex-shrink-0"
                          style={{ color: "#10B981" }}>
                          {mealCal} קל׳
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-6 text-center rise" style={{ animationDelay: "120ms", background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין תפריט פעיל למתאמן זה</p>
          </div>
        )}
      </div>
    </main>
  );
}
