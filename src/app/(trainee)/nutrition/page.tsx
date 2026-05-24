"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type MealItem = {
  food_name: string;
  amount: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};
type Alternative = { id: string; option_number: 1 | 2 | 3; items: MealItem[] };
type Meal = { id: string; name: string; time_window: string | null; items: MealItem[]; alternatives: Alternative[] };
type Plan = { name: string; total_calories: number | null; meals: Meal[] };

function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>;
}
function ChevronIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6" /></svg>;
}
function XIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}
function SunIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
}
function LeafIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5.5 4.5-9 9-9s8 3.5 8 8.5c0 4-2.5 6.5-7 6.5"/><path d="M11 20V12"/></svg>;
}
function BowlIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20c5.523 0 10-2.686 10-6H2c0 3.314 4.477 6 10 6z"/><path d="M5 14c0-4 3-7 7-7s7 3 7 7"/><path d="M12 7V4"/></svg>;
}
function MoonIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
function UtensilsIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
}
function DropIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/></svg>;
}

function getMealIcon(name: string, size = "w-6 h-6", color = "#E11D2A") {
  const props = { className: size, style: { color } };
  if (name.includes("בוקר")) return <SunIcon {...props} />;
  if (name.includes("ביניים")) return <LeafIcon {...props} />;
  if (name.includes("צהריים") || name.includes("צהר")) return <BowlIcon {...props} />;
  if (name.includes("ערב")) return <MoonIcon {...props} />;
  return <UtensilsIcon {...props} />;
}

const WATER_GOAL = 2.5;
const ACCENT = "#E11D2A";

export default function NutritionPage() {
  const supabase = createClient();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState<boolean[]>([]);
  const [selectedAlts, setSelectedAlts] = useState<(string | null)[]>([]);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [detailTabId, setDetailTabId] = useState<string | null>(null);
  const [water, setWater] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const fetchPlan = useCallback(async () => {
    const clientId = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!clientId) { setLoading(false); return; }

    const { data: waterLog } = await supabase.from("daily_water_logs")
      .select("water_liters").eq("client_id", clientId).eq("log_date", today).single();
    if (waterLog) setWater(waterLog.water_liters);
    else {
      const saved = localStorage.getItem(`nf_water_${today}`);
      if (saved) setWater(parseFloat(saved));
    }

    const { data: cmp } = await supabase.from("client_meal_plans")
      .select("meal_plan_id").eq("client_id", clientId).eq("active", true)
      .order("id", { ascending: false }).limit(1).single();
    if (!cmp) { setLoading(false); return; }

    const [{ data: planData }, { data: mealsData }] = await Promise.all([
      supabase.from("meal_plans").select("name, total_calories").eq("id", cmp.meal_plan_id).single(),
      supabase.from("meals").select("id, name, time_window").eq("plan_id", cmp.meal_plan_id).order("order_index"),
    ]);
    if (!planData || !mealsData) { setLoading(false); return; }

    const mealsWithAll: Meal[] = await Promise.all(
      mealsData.map(async (meal) => {
        const [{ data: items }, { data: altsData }] = await Promise.all([
          supabase.from("meal_items").select("food_name, amount, calories, protein_g, carbs_g, fat_g").eq("meal_id", meal.id).order("order_index"),
          supabase.from("meal_alternatives").select("id, option_number").eq("meal_id", meal.id).order("option_number"),
        ]);
        const alternatives: Alternative[] = await Promise.all(
          (altsData ?? []).map(async (alt) => {
            const { data: altItems } = await supabase.from("meal_alternative_items")
              .select("food_name, amount, calories, protein_g, carbs_g, fat_g").eq("alternative_id", alt.id).order("order_index");
            return { id: alt.id, option_number: alt.option_number as 1 | 2 | 3, items: altItems ?? [] };
          })
        );
        return { id: meal.id, name: meal.name, time_window: meal.time_window, items: items ?? [], alternatives };
      })
    );

    setPlan({ ...planData, meals: mealsWithAll });

    const mealIds = mealsData.map((m) => m.id);
    if (mealIds.length > 0) {
      const { data: logs } = await supabase.from("meal_logs")
        .select("meal_id, alternative_id").eq("client_id", clientId).eq("log_date", today).in("meal_id", mealIds);
      setDone(mealsData.map((m) => !!(logs ?? []).find((l) => l.meal_id === m.id)));
      setSelectedAlts(mealsData.map((m) => (logs ?? []).find((l) => l.meal_id === m.id)?.alternative_id ?? null));
    } else {
      setDone(new Array(mealsWithAll.length).fill(false));
      setSelectedAlts(new Array(mealsWithAll.length).fill(null));
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const openDetail = (i: number) => {
    setDetailIndex(i);
    setDetailTabId(selectedAlts[i]);
  };

  const toggleDone = async (i: number) => {
    const clientId = localStorage.getItem("nextfit_client_id");
    if (!clientId || !plan) return;
    const meal = plan.meals[i];
    const newDone = done.map((v, j) => (j === i ? !v : v));
    setDone(newDone);
    if (!done[i]) {
      await supabase.from("meal_logs").upsert(
        { client_id: clientId, meal_id: meal.id, log_date: today, completed_at: new Date().toISOString(), alternative_id: selectedAlts[i] ?? null },
        { onConflict: "client_id,meal_id,log_date" }
      );
    } else {
      await supabase.from("meal_logs").delete().eq("client_id", clientId).eq("meal_id", meal.id).eq("log_date", today);
    }
  };

  const switchTab = async (altId: string | null) => {
    if (detailIndex === null || !plan) return;
    setDetailTabId(altId);
    const newAlts = selectedAlts.map((v, j) => (j === detailIndex ? altId : v));
    setSelectedAlts(newAlts);
    if (done[detailIndex]) {
      const clientId = localStorage.getItem("nextfit_client_id");
      if (!clientId) return;
      const meal = plan.meals[detailIndex];
      await supabase.from("meal_logs").upsert(
        { client_id: clientId, meal_id: meal.id, log_date: today, completed_at: new Date().toISOString(), alternative_id: altId },
        { onConflict: "client_id,meal_id,log_date" }
      );
    }
  };

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

  const consumedCalories = plan?.meals.reduce((acc, meal, idx) => {
    if (!done[idx]) return acc;
    const activeItems = selectedAlts[idx]
      ? meal.alternatives.find((a) => a.id === selectedAlts[idx])?.items ?? meal.items
      : meal.items;
    return acc + activeItems.reduce((a, i) => a + (i.calories ?? 0), 0);
  }, 0) ?? 0;
  const totalCalories = plan?.total_calories ?? 0;
  const doneMealsCount = done.filter(Boolean).length;
  const waterPct = water / WATER_GOAL;

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-[58px] space-y-4">
          <div className="h-8 w-32 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-28 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          {[1,2,3,4,5].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen font-heb flex flex-col items-center justify-center pb-32 px-6 text-center" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="w-16 h-16 rounded-2xl grid place-items-center mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
          <UtensilsIcon className="w-7 h-7" style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>
        <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.60)" }}>טרם שויך תפריט</p>
        <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>המאמן שלך עדיין לא שיוך לך תפריט תזונה</p>
      </main>
    );
  }

  // Detail sheet derived data
  const detailMeal = detailIndex !== null ? plan.meals[detailIndex] : null;
  const detailAlt = detailTabId !== null
    ? detailMeal?.alternatives.find((a) => a.id === detailTabId) ?? null
    : null;
  const detailItems = detailAlt ? detailAlt.items : (detailMeal?.items ?? []);
  const detailCal = detailItems.reduce((a, it) => a + (it.calories ?? 0), 0);
  const detailProt = detailItems.reduce((a, it) => a + (it.protein_g ?? 0), 0);
  const detailCarb = detailItems.reduce((a, it) => a + (it.carbs_g ?? 0), 0);
  const detailFat = detailItems.reduce((a, it) => a + (it.fat_g ?? 0), 0);

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="rise">
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תזונה</div>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight">התפריט היום</h1>
        </div>

        {/* Summary card */}
        <div className="rounded-3xl p-5 rise" style={{ animationDelay: "40ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>קלוריות</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[32px] font-extrabold leading-none" style={{ color: ACCENT }}>{consumedCalories.toLocaleString()}</span>
                {totalCalories > 0 && <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>/ {totalCalories.toLocaleString()}</span>}
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>ארוחות</p>
              <p className="text-[28px] font-extrabold leading-none mt-1" style={{ color: "rgba(255,255,255,0.80)" }}>
                {doneMealsCount}<span className="text-[16px] font-normal text-white/30">/{plan.meals.length}</span>
              </p>
            </div>
          </div>
          {totalCalories > 0 && (
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{
                background: `linear-gradient(90deg, ${ACCENT}, #FF4D5A)`,
                width: `${Math.min(100, (consumedCalories / totalCalories) * 100)}%`,
                transition: "width 700ms ease",
              }} />
            </div>
          )}
        </div>

        {/* Water tracker */}
        <div className="rounded-2xl p-4 rise" style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DropIcon className="w-4 h-4" style={{ color: "#3B82F6" }} />
              <span className="text-[13px] font-semibold">שתייה</span>
            </div>
            <span className="text-[13px] font-bold" style={{ color: water >= WATER_GOAL ? "#10B981" : "rgba(255,255,255,0.70)" }}>
              {water.toFixed(2)}<span className="text-[11px] font-normal text-white/35"> / {WATER_GOAL}L</span>
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full" style={{ background: "#3B82F6", width: `${waterPct * 100}%`, transition: "width 500ms ease" }} />
          </div>
          <div className="flex items-center gap-3">
            <button className="tap flex-1 h-10 rounded-2xl font-bold text-[20px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
              onClick={() => changeWater(-0.25)}>−</button>
            <div className="flex gap-1 flex-1 justify-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < Math.round(waterPct * 10) ? "#3B82F6" : "rgba(255,255,255,0.10)" }} />
              ))}
            </div>
            <button className="tap flex-1 h-10 rounded-2xl font-bold text-[20px]"
              style={{ background: "#3B82F6" }}
              onClick={() => changeWater(0.25)}>+</button>
          </div>
        </div>

        {/* Meals list */}
        <div className="space-y-3 rise" style={{ animationDelay: "120ms" }}>
          <p className="text-[10.5px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>ארוחות היום</p>
          {plan.meals.map((meal, i) => {
            const selectedAlt = meal.alternatives.find((a) => a.id === selectedAlts[i]);
            const activeItems = selectedAlt ? selectedAlt.items : meal.items;
            const mealCal = activeItems.reduce((a, it) => a + (it.calories ?? 0), 0);
            const isDone = done[i];

            return (
              <button key={meal.id} onClick={() => openDetail(i)}
                className="tap w-full rounded-3xl p-4 flex items-center gap-4 text-right"
                style={{
                  background: isDone ? "rgba(225,29,42,0.07)" : "rgba(255,255,255,0.04)",
                  boxShadow: isDone
                    ? "inset 0 0 0 1.5px rgba(225,29,42,0.22)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0"
                  style={{
                    background: isDone ? "rgba(225,29,42,0.15)" : "rgba(255,255,255,0.06)",
                    boxShadow: isDone ? "inset 0 0 0 1px rgba(225,29,42,0.25)" : "none",
                  }}>
                  {isDone
                    ? <CheckIcon className="w-7 h-7" style={{ color: ACCENT }} />
                    : getMealIcon(meal.name, "w-6 h-6", "rgba(255,255,255,0.55)")}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[15px]" style={{ color: isDone ? "#FAF9F6" : "rgba(255,255,255,0.75)" }}>{meal.name}</p>
                    {selectedAlt && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(225,29,42,0.15)", color: "#FF8A95" }}>
                        אופציה {selectedAlt.option_number}
                      </span>
                    )}
                    {!selectedAlt && meal.alternatives.length > 0 && (
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
                        {meal.alternatives.length} אופציות
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {meal.time_window}{mealCal > 0 ? ` · ${mealCal} קק״ל` : ""}
                  </p>
                  {activeItems.length > 0 && (
                    <p className="text-[10.5px] mt-1 truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {activeItems.slice(0, 3).map((it) => it.food_name).join(" · ")}
                      {activeItems.length > 3 && " ···"}
                    </p>
                  )}
                </div>

                <ChevronIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Meal Detail Sheet ─── */}
      {detailIndex !== null && detailMeal && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)" }}
          onClick={() => setDetailIndex(null)}>
          <div className="w-full rounded-t-3xl flex flex-col font-heb"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "88vh" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Handle + header */}
            <div className="px-5 pt-4 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: "rgba(225,29,42,0.12)" }}>
                    {getMealIcon(detailMeal.name, "w-6 h-6", ACCENT)}
                  </div>
                  <div>
                    <h2 className="text-[19px] font-extrabold" style={{ color: "#FAF9F6" }}>{detailMeal.name}</h2>
                    {detailMeal.time_window && (
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>{detailMeal.time_window}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setDetailIndex(null)} className="tap w-8 h-8 rounded-full grid place-items-center"
                  style={{ background: "rgba(255,255,255,0.07)" }}>
                  <XIcon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />
                </button>
              </div>
            </div>

            {/* Option tabs — shown only when alternatives exist */}
            {detailMeal.alternatives.length > 0 && (
              <div className="px-5 pb-3 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {/* מקורי tab */}
                  <button
                    onClick={() => switchTab(null)}
                    className="tap flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                    style={{
                      background: detailTabId === null ? ACCENT : "rgba(255,255,255,0.07)",
                      color: detailTabId === null ? "#fff" : "rgba(255,255,255,0.50)",
                      boxShadow: detailTabId === null ? "0 4px 12px rgba(225,29,42,0.30)" : "none",
                    }}>
                    מקורי
                  </button>
                  {detailMeal.alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      onClick={() => switchTab(alt.id)}
                      className="tap flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                      style={{
                        background: detailTabId === alt.id ? ACCENT : "rgba(255,255,255,0.07)",
                        color: detailTabId === alt.id ? "#fff" : "rgba(255,255,255,0.50)",
                        boxShadow: detailTabId === alt.id ? "0 4px 12px rgba(225,29,42,0.30)" : "none",
                      }}>
                      אופציה {alt.option_number}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Macros bar */}
            <div className="mx-5 mb-4 rounded-2xl p-3 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "קל׳", value: detailCal, color: ACCENT },
                  { label: "חלבון", value: `${Math.round(detailProt)}g`, color: "#E11D2A" },
                  { label: "פחמ׳", value: `${Math.round(detailCarb)}g`, color: "rgba(255,255,255,0.60)" },
                  { label: "שומן", value: `${Math.round(detailFat)}g`, color: "rgba(255,255,255,0.45)" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-[16px] font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Food items */}
            <div className="overflow-y-auto flex-1 px-5">
              <p className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.28)" }}>מזונות</p>
              {detailItems.length === 0 ? (
                <p className="text-center py-6 text-[13px]" style={{ color: "rgba(255,255,255,0.30)" }}>לא הוגדרו מזונות לארוחה זו</p>
              ) : (
                <div className="space-y-2 pb-4">
                  {detailItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-2xl px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold truncate" style={{ color: "#FAF9F6" }}>{item.food_name}</p>
                        {item.amount && item.amount !== "—" && (
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.amount}</p>
                        )}
                      </div>
                      {item.calories !== null && item.calories > 0 && (
                        <span className="text-[13px] font-bold flex-shrink-0 ml-3" style={{ color: ACCENT }}>
                          {item.calories} קל׳
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-5 pb-10 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => { toggleDone(detailIndex); setDetailIndex(null); }}
                className="tap w-full h-13 rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] text-white"
                style={{
                  background: done[detailIndex] ? "rgba(255,255,255,0.08)" : ACCENT,
                  boxShadow: done[detailIndex] ? "none" : "0 8px 24px rgba(225,29,42,0.35)",
                }}>
                {done[detailIndex] ? (
                  <><XIcon className="w-5 h-5" />בטל הושלם</>
                ) : (
                  <><CheckIcon className="w-5 h-5" />סמן כהושלם</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
