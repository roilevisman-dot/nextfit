"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───
type MealItem = {
  food_name: string;
  amount: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};

type Alternative = {
  id: string;
  option_number: 1 | 2 | 3;
  items: MealItem[];
};

type Meal = {
  id: string;
  name: string;
  time_window: string | null;
  items: MealItem[];
  alternatives: Alternative[];
};

type Plan = {
  name: string;
  total_calories: number | null;
  meals: Meal[];
};

// ─── Icons ───
function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>;
}
function RefreshIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>;
}
function UtensilsIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
}
function XIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

const WATER_GOAL = 2.5;
const R = 54;
const CIRC = 2 * Math.PI * R;
const MEAL_COLORS = ["#E11D2A", "#F97316", "#EAB308", "#10B981", "#3B82F6", "#8B5CF6"];

export default function NutritionPage() {
  const supabase = createClient();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<boolean[]>([]);
  const [selectedAlts, setSelectedAlts] = useState<(string | null)[]>([]);
  const [altSheetIndex, setAltSheetIndex] = useState<number | null>(null);
  const [water, setWater] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const fetchPlan = useCallback(async () => {
    const clientId = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!clientId) { setLoading(false); return; }

    // Load water from DB first, fallback to localStorage
    const { data: waterLog } = await supabase.from("daily_water_logs")
      .select("water_liters")
      .eq("client_id", clientId)
      .eq("log_date", today)
      .single();
    if (waterLog) {
      setWater(waterLog.water_liters);
    } else {
      const saved = localStorage.getItem(`nf_water_${today}`);
      if (saved) setWater(parseFloat(saved));
    }

    // Load active meal plan
    const { data: cmp } = await supabase.from("client_meal_plans")
      .select("meal_plan_id")
      .eq("client_id", clientId).eq("active", true)
      .order("id", { ascending: false }).limit(1)
      .single();
    if (!cmp) { setLoading(false); return; }

    const [{ data: planData }, { data: mealsData }] = await Promise.all([
      supabase.from("meal_plans").select("name, total_calories").eq("id", cmp.meal_plan_id).single(),
      supabase.from("meals").select("id, name, time_window").eq("plan_id", cmp.meal_plan_id).order("order_index"),
    ]);
    if (!planData || !mealsData) { setLoading(false); return; }

    // Load items + alternatives for each meal
    const mealsWithAll: Meal[] = await Promise.all(
      mealsData.map(async (meal) => {
        const [{ data: items }, { data: altsData }] = await Promise.all([
          supabase.from("meal_items")
            .select("food_name, amount, calories, protein_g, carbs_g, fat_g")
            .eq("meal_id", meal.id).order("order_index"),
          supabase.from("meal_alternatives")
            .select("id, option_number")
            .eq("meal_id", meal.id).order("option_number"),
        ]);

        const alternatives: Alternative[] = await Promise.all(
          (altsData ?? []).map(async (alt) => {
            const { data: altItems } = await supabase.from("meal_alternative_items")
              .select("food_name, amount, calories, protein_g, carbs_g, fat_g")
              .eq("alternative_id", alt.id).order("order_index");
            return {
              id: alt.id,
              option_number: alt.option_number as 1 | 2 | 3,
              items: altItems ?? [],
            };
          })
        );

        return { id: meal.id, name: meal.name, time_window: meal.time_window, items: items ?? [], alternatives };
      })
    );

    setPlan({ ...planData, meals: mealsWithAll });

    // Load today's meal_logs for completion + selected alternatives
    const mealIds = mealsData.map((m) => m.id);
    if (mealIds.length > 0) {
      const { data: logs } = await supabase.from("meal_logs")
        .select("meal_id, alternative_id")
        .eq("client_id", clientId)
        .eq("log_date", today)
        .in("meal_id", mealIds);

      const doneArr = mealsData.map((m) => !!(logs ?? []).find((l) => l.meal_id === m.id));
      const altsArr = mealsData.map((m) => {
        const log = (logs ?? []).find((l) => l.meal_id === m.id);
        return log?.alternative_id ?? null;
      });
      setDone(doneArr);
      setSelectedAlts(altsArr);
    } else {
      setDone(new Array(mealsWithAll.length).fill(false));
      setSelectedAlts(new Array(mealsWithAll.length).fill(null));
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  // ─── Toggle meal done ───
  const toggleDone = async (i: number) => {
    const clientId = localStorage.getItem("nextfit_client_id");
    if (!clientId || !plan) return;
    const meal = plan.meals[i];
    const isDone = done[i];

    const newDone = done.map((v, j) => (j === i ? !v : v));
    setDone(newDone);

    if (!isDone) {
      await supabase.from("meal_logs").upsert(
        {
          client_id: clientId,
          meal_id: meal.id,
          log_date: today,
          completed_at: new Date().toISOString(),
          alternative_id: selectedAlts[i] ?? null,
        },
        { onConflict: "client_id,meal_id,log_date" }
      );
    } else {
      await supabase.from("meal_logs")
        .delete()
        .eq("client_id", clientId)
        .eq("meal_id", meal.id)
        .eq("log_date", today);
    }
  };

  // ─── Select alternative ───
  const selectAlt = async (mealIndex: number, altId: string | null) => {
    const clientId = localStorage.getItem("nextfit_client_id");
    if (!clientId || !plan) return;
    const newAlts = selectedAlts.map((v, j) => (j === mealIndex ? altId : v));
    setSelectedAlts(newAlts);
    setAltSheetIndex(null);

    // If meal was already done, update the log with the new alternative
    if (done[mealIndex]) {
      const meal = plan.meals[mealIndex];
      await supabase.from("meal_logs").upsert(
        { client_id: clientId, meal_id: meal.id, log_date: today, completed_at: new Date().toISOString(), alternative_id: altId },
        { onConflict: "client_id,meal_id,log_date" }
      );
    }
  };

  // ─── Water ───
  const changeWater = async (delta: number) => {
    const clientId = localStorage.getItem("nextfit_client_id");
    const next = Math.max(0, Math.min(WATER_GOAL, parseFloat((water + delta).toFixed(2))));
    setWater(next);
    localStorage.setItem(`nf_water_${today}`, next.toString());
    if (clientId) {
      await supabase.from("daily_water_logs").upsert(
        { client_id: clientId, log_date: today, water_liters: next },
        { onConflict: "client_id,log_date" }
      );
    }
  };

  // ─── Derived ───
  const allItems = plan?.meals.flatMap((m) => m.items) ?? [];
  const totalProt = allItems.reduce((a, i) => a + (i.protein_g ?? 0), 0);
  const totalCarb = allItems.reduce((a, i) => a + (i.carbs_g ?? 0), 0);
  const totalFat  = allItems.reduce((a, i) => a + (i.fat_g ?? 0), 0);
  const consumedCalories = plan?.meals.reduce((acc, meal, idx) => {
    if (!done[idx]) return acc;
    const activeItems = selectedAlts[idx]
      ? meal.alternatives.find((a) => a.id === selectedAlts[idx])?.items ?? meal.items
      : meal.items;
    return acc + activeItems.reduce((a, i) => a + (i.calories ?? 0), 0);
  }, 0) ?? 0;
  const totalCalories = plan?.total_calories ?? 0;
  const pct = totalCalories > 0 ? Math.min(consumedCalories / totalCalories, 1) : 0;

  const filledDrops = Math.round((water / WATER_GOAL) * 8);

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-[58px] space-y-4">
          <div className="h-8 w-32 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-40 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          {[1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen font-heb flex flex-col items-center justify-center pb-32 px-6 text-center"
        style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="w-16 h-16 rounded-2xl grid place-items-center mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
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
        <div className="rounded-3xl p-5 rise" style={{ animationDelay: "50ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <circle cx="65" cy="65" r={R} fill="none" stroke="#E11D2A" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${pct * CIRC} ${CIRC}`}
                  strokeDashoffset={CIRC / 4}
                  transform="rotate(-90 65 65)"
                  style={{ transition: "stroke-dasharray 800ms cubic-bezier(.22,1,.36,1)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[22px] font-extrabold leading-none">{consumedCalories.toLocaleString()}</p>
                <p className="text-[9px] text-white/45 mt-0.5">מתוך {totalCalories.toLocaleString()} קק״ל</p>
                <p className="text-[9px] mt-1" style={{ color: "#E11D2A" }}>
                  {Math.max(0, totalCalories - consumedCalories).toLocaleString()} נותרו
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: "חלבון",   value: Math.round(totalProt), color: "#E11D2A" },
                { label: "פחמימות", value: Math.round(totalCarb), color: "#F97316" },
                { label: "שומן",    value: Math.round(totalFat),  color: "#EAB308" },
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
        <div className="rounded-2xl p-4 rise" style={{ animationDelay: "90ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">מעקב שתייה</span>
            <span className="text-[11px] text-white/40">{water.toFixed(2)}L / {WATER_GOAL}L</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <button className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "rgba(255,255,255,0.07)" }}
              onClick={() => changeWater(-0.25)}>−</button>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all" style={{ background: "#3B82F6", width: `${(water / WATER_GOAL) * 100}%` }} />
            </div>
            <button className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "#3B82F6" }}
              onClick={() => changeWater(0.25)}>+</button>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
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
              const selectedAlt = meal.alternatives.find((a) => a.id === selectedAlts[i]);
              const activeItems = selectedAlt ? selectedAlt.items : meal.items;
              const mealCal = activeItems.reduce((a, it) => a + (it.calories ?? 0), 0);
              const mealProt = activeItems.reduce((a, it) => a + (it.protein_g ?? 0), 0);
              const mealCarb = activeItems.reduce((a, it) => a + (it.carbs_g ?? 0), 0);
              const mealFat  = activeItems.reduce((a, it) => a + (it.fat_g ?? 0), 0);
              const color = MEAL_COLORS[i % MEAL_COLORS.length];
              const hasAlts = meal.alternatives.length > 0;

              return (
                <div key={meal.id} className="rounded-2xl overflow-hidden flex items-stretch"
                  style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)", opacity: done[i] ? 1 : 0.80 }}>
                  {/* Color strip */}
                  <div className="w-[64px] flex-shrink-0 flex flex-col items-center justify-center gap-1 py-3"
                    style={{ background: color + "18" }}>
                    <UtensilsIcon className="w-5 h-5" style={{ color }} />
                    {done[i] && <CheckIcon className="w-3.5 h-3.5" style={{ color: "#10B981" }} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-3 py-2.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-[13px] font-semibold leading-tight">{meal.name}</p>
                          {selectedAlt && (
                            <span className="inline-flex items-center gap-1 text-[9.5px] px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>
                              חלופה {selectedAlt.option_number}
                              <button onClick={() => selectAlt(i, null)} className="tap">
                                <XIcon className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-white/40 mt-0.5">
                          {meal.time_window}{mealCal > 0 ? ` · ${mealCal} קק״ל` : ""}
                        </p>
                        {activeItems.length > 0 && (
                          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.28)" }}>
                            {activeItems.map((it) => `${it.food_name}${it.amount ? ` ${it.amount}` : ""}`).join(" · ")}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {hasAlts && (
                          <button onClick={() => setAltSheetIndex(i)}
                            className="tap w-7 h-7 rounded-full grid place-items-center"
                            style={{ background: "rgba(59,130,246,0.12)", boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.20)" }}>
                            <RefreshIcon className="w-3.5 h-3.5" style={{ color: "#60A5FA" }} />
                          </button>
                        )}
                        <button onClick={() => toggleDone(i)}
                          className="tap w-7 h-7 rounded-full grid place-items-center"
                          style={{
                            background: done[i] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)",
                            boxShadow: done[i] ? "inset 0 0 0 1px rgba(16,185,129,0.35)" : "inset 0 0 0 1px rgba(255,255,255,0.10)",
                          }}>
                          <CheckIcon className="w-3.5 h-3.5" style={{ color: done[i] ? "#10B981" : "rgba(255,255,255,0.30)" }} />
                        </button>
                      </div>
                    </div>

                    {/* Mini macros */}
                    <div className="flex gap-2.5 mt-1.5">
                      {[
                        { l: "P", v: Math.round(mealProt), c: "#E11D2A" },
                        { l: "C", v: Math.round(mealCarb), c: "#F97316" },
                        { l: "F", v: Math.round(mealFat),  c: "#EAB308" },
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

      {/* Alternative selection sheet */}
      {altSheetIndex !== null && plan && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }}
          onClick={() => setAltSheetIndex(null)}>
          <div className="w-full rounded-t-3xl pb-10 font-heb"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "80vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="px-5 pt-4 pb-3 sticky top-0" style={{ background: "#111009" }}>
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <h3 className="text-[17px] font-bold" style={{ color: "#FAF9F6" }}>
                החלף: {plan.meals[altSheetIndex].name}
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>בחר אופציה חלופית</p>
            </div>
            <div className="px-5 space-y-3 pb-4">
              {/* Default option */}
              <button onClick={() => selectAlt(altSheetIndex, null)}
                className="tap w-full rounded-2xl p-4 text-right"
                style={{
                  background: selectedAlts[altSheetIndex] === null ? "rgba(225,29,42,0.10)" : "rgba(255,255,255,0.04)",
                  boxShadow: selectedAlts[altSheetIndex] === null
                    ? "inset 0 0 0 1.5px rgba(225,29,42,0.30)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: "#FAF9F6" }}>ברירת מחדל</span>
                  {selectedAlts[altSheetIndex] === null && <CheckIcon className="w-4 h-4" style={{ color: "#E11D2A" }} />}
                </div>
                {plan.meals[altSheetIndex].items.length > 0 ? (
                  <>
                    <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {plan.meals[altSheetIndex].items.map((it) => `${it.food_name}${it.amount ? ` ${it.amount}` : ""}`).join(" · ")}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
                      {plan.meals[altSheetIndex].items.reduce((s, it) => s + (it.calories ?? 0), 0)} קק״ל
                    </p>
                  </>
                ) : null}
              </button>

              {/* Alternatives */}
              {plan.meals[altSheetIndex].alternatives.map((alt) => {
                const altCal = alt.items.reduce((s, it) => s + (it.calories ?? 0), 0);
                const isSelected = selectedAlts[altSheetIndex] === alt.id;
                return (
                  <button key={alt.id} onClick={() => selectAlt(altSheetIndex, alt.id)}
                    className="tap w-full rounded-2xl p-4 text-right"
                    style={{
                      background: isSelected ? "rgba(59,130,246,0.10)" : "rgba(255,255,255,0.04)",
                      boxShadow: isSelected
                        ? "inset 0 0 0 1.5px rgba(59,130,246,0.30)"
                        : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                    }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-semibold" style={{ color: "#FAF9F6" }}>חלופה {alt.option_number}</span>
                      {isSelected && <CheckIcon className="w-4 h-4" style={{ color: "#60A5FA" }} />}
                    </div>
                    <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {alt.items.map((it) => `${it.food_name}${it.amount ? ` ${it.amount}` : ""}`).join(" · ")}
                    </p>
                    {altCal > 0 && (
                      <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>{altCal} קק״ל</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
