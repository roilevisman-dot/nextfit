"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type MealItem = {
  food_name: string;
  amount: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type Meal = {
  id: string;
  name: string;
  time_window: string;
  items: MealItem[];
};

type Plan = {
  name: string;
  total_calories: number;
  meals: Meal[];
};

const WATER_GOAL = 2.5;
const DROPS = 8;
const R = 54;
const CIRC = 2 * Math.PI * R;

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UtensilsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

const MEAL_COLORS = ["#E11D2A", "#F97316", "#EAB308", "#10B981", "#3B82F6"];

function todayKey(clientId: string) {
  return `nf_done_${clientId}_${new Date().toISOString().split("T")[0]}`;
}

export default function NutritionPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<boolean[]>([]);
  const [water, setWater] = useState(0);

  const supabase = createClient();

  const fetchPlan = useCallback(async () => {
    const clientId = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!clientId) { setLoading(false); return; }

    // Restore today's done state
    const savedDone = localStorage.getItem(todayKey(clientId));
    if (savedDone) {
      try { setDone(JSON.parse(savedDone)); } catch { /* ignore */ }
    }

    const { data: cmp } = await supabase
      .from("client_meal_plans")
      .select("meal_plan_id")
      .eq("client_id", clientId)
      .eq("active", true)
      .single();
    if (!cmp) { setLoading(false); return; }

    const { data: planData } = await supabase
      .from("meal_plans")
      .select("name, total_calories")
      .eq("id", cmp.meal_plan_id)
      .single();
    if (!planData) { setLoading(false); return; }

    const { data: mealsData } = await supabase
      .from("meals")
      .select("id, name, time_window")
      .eq("plan_id", cmp.meal_plan_id)
      .order("order_index");
    if (!mealsData) { setLoading(false); return; }

    const mealsWithItems: Meal[] = await Promise.all(
      mealsData.map(async (meal) => {
        const { data: items } = await supabase
          .from("meal_items")
          .select("food_name, amount, calories, protein_g, carbs_g, fat_g")
          .eq("meal_id", meal.id)
          .order("order_index");
        return { ...meal, items: items ?? [] };
      })
    );

    setPlan({ ...planData, meals: mealsWithItems });
    setDone((prev) => prev.length === mealsWithItems.length ? prev : Array(mealsWithItems.length).fill(false));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  // Persist done state
  useEffect(() => {
    const clientId = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!clientId || done.length === 0) return;
    localStorage.setItem(todayKey(clientId), JSON.stringify(done));
  }, [done]);

  const toggleDone = (i: number) => setDone((d) => d.map((v, j) => j === i ? !v : v));
  const filledDrops = Math.round((water / WATER_GOAL) * DROPS);

  // Derived totals
  const allItems = plan?.meals.flatMap((m) => m.items) ?? [];
  const totalProt = allItems.reduce((a, i) => a + (i.protein_g ?? 0), 0);
  const totalCarb = allItems.reduce((a, i) => a + (i.carbs_g ?? 0), 0);
  const totalFat = allItems.reduce((a, i) => a + (i.fat_g ?? 0), 0);

  const consumedCalories = plan?.meals.reduce((acc, meal, idx) => {
    if (!done[idx]) return acc;
    return acc + meal.items.reduce((a, i) => a + (i.calories ?? 0), 0);
  }, 0) ?? 0;

  const totalCalories = plan?.total_calories ?? 0;
  const pct = totalCalories > 0 ? Math.min(consumedCalories / totalCalories, 1) : 0;
  const dash = pct * CIRC;

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-[58px] space-y-4">
          <div className="h-8 w-32 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-40 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen font-heb flex flex-col items-center justify-center pb-32 px-6 text-center"
        style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="w-16 h-16 rounded-2xl grid place-items-center mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          <UtensilsIcon className="w-7 h-7" style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>
        <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.60)" }}>טרם שויך תפריט</p>
        <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>המאמן שלך עדיין לא שיוך לך תפריט תזונה</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="rise">
          <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">תזונה</div>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight">התפריט היום</h1>
        </div>

        {/* Donut + Macros */}
        <div
          className="rounded-3xl p-5 rise"
          style={{ animationDelay: "50ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <circle
                  cx="65" cy="65" r={R} fill="none" stroke="#E11D2A" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${CIRC}`}
                  strokeDashoffset={CIRC / 4}
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[22px] font-extrabold leading-none">{consumedCalories.toLocaleString()}</p>
                <p className="text-[9px] text-white/45 mt-0.5">מתוך {totalCalories.toLocaleString()} קק״ל</p>
                <p className="text-[9px] mt-1" style={{ color: "#E11D2A" }}>
                  {(totalCalories - consumedCalories).toLocaleString()} נותרו
                </p>
              </div>
            </div>

            {/* Macro bars */}
            <div className="flex-1 space-y-3">
              {[
                { label: "חלבון", value: Math.round(totalProt), color: "#E11D2A" },
                { label: "פחמימות", value: Math.round(totalCarb), color: "#F97316" },
                { label: "שומן", value: Math.round(totalFat), color: "#EAB308" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-white/50">{m.label}</span>
                    <span className="text-[11px] font-semibold">{m.value}g</span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ background: m.color, width: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water tracker */}
        <div
          className="rounded-2xl p-4 rise"
          style={{ animationDelay: "90ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">מעקב שתייה</span>
            <span className="text-[11px] text-white/40">{water.toFixed(2)}L / {WATER_GOAL}L</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <button
              className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "rgba(255,255,255,0.07)" }}
              onClick={() => setWater((w) => Math.max(0, parseFloat((w - 0.25).toFixed(2))))}
            >−</button>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all" style={{ background: "#3B82F6", width: `${(water / WATER_GOAL) * 100}%` }} />
            </div>
            <button
              className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "#3B82F6" }}
              onClick={() => setWater((w) => Math.min(WATER_GOAL, parseFloat((w + 0.25).toFixed(2))))}
            >+</button>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: DROPS }).map((_, i) => (
              <div key={i} className="flex-1 h-5 rounded-md transition-all"
                style={{ background: i < filledDrops ? "#3B82F6" : "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="rise" style={{ animationDelay: "130ms" }}>
          <p className="text-[12.5px] font-semibold text-white/60 mb-2.5">ארוחות היום</p>
          <div className="space-y-2.5">
            {plan.meals.map((meal, i) => {
              const mealCal = meal.items.reduce((a, it) => a + (it.calories ?? 0), 0);
              const mealProt = meal.items.reduce((a, it) => a + (it.protein_g ?? 0), 0);
              const mealCarb = meal.items.reduce((a, it) => a + (it.carbs_g ?? 0), 0);
              const mealFat = meal.items.reduce((a, it) => a + (it.fat_g ?? 0), 0);
              const color = MEAL_COLORS[i % MEAL_COLORS.length];

              return (
                <div
                  key={meal.id}
                  className="rounded-2xl overflow-hidden flex items-stretch"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                    opacity: done[i] ? 1 : 0.80,
                  }}
                >
                  {/* Color strip + icon */}
                  <div
                    className="w-[72px] flex-shrink-0 grid place-items-center"
                    style={{ background: color + "18" }}
                  >
                    <UtensilsIcon className="w-6 h-6" style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-3 py-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[13px] font-semibold leading-tight">{meal.name}</p>
                        <p className="text-[10.5px] text-white/40 mt-0.5">
                          {meal.time_window} · {mealCal} קק״ל
                        </p>
                        {/* Food items list */}
                        {meal.items.length > 0 && (
                          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.30)" }}>
                            {meal.items.map((it) => it.food_name).join(", ")}
                          </p>
                        )}
                      </div>
                      <button
                        className="tap w-7 h-7 rounded-full grid place-items-center flex-shrink-0 ml-1 mt-0.5"
                        style={{
                          background: done[i] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)",
                          boxShadow: done[i] ? "inset 0 0 0 1px rgba(16,185,129,0.35)" : "inset 0 0 0 1px rgba(255,255,255,0.10)",
                        }}
                        onClick={() => toggleDone(i)}
                      >
                        <CheckIcon className="w-3.5 h-3.5" style={{ color: done[i] ? "#10B981" : "rgba(255,255,255,0.3)" }} />
                      </button>
                    </div>

                    {/* Mini macros */}
                    <div className="flex gap-2.5 mt-1.5">
                      {[
                        { l: "P", v: Math.round(mealProt), c: "#E11D2A" },
                        { l: "C", v: Math.round(mealCarb), c: "#F97316" },
                        { l: "F", v: Math.round(mealFat), c: "#EAB308" },
                      ].map((m, j) => (
                        <span key={j} className="text-[9.5px]" style={{ color: m.c }}>{m.l}: {m.v}g</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
