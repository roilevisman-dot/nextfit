"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FOOD_DATABASE, searchFoods, calcMacros, type FoodEntry } from "@/lib/food-library";

// ─── Types ───
type FoodItem = {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Alternative = {
  id: string;
  option_number: 1 | 2 | 3;
  items: FoodItem[];
};

type Meal = {
  id: string;
  label: string;
  time: string;
  items: FoodItem[];
  alternatives: Alternative[];
  altExpanded: boolean;
};

// ─── Icons ───
function BackIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 19l-7-7 7-7" /></svg>;
}
function PlusIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14" /></svg>;
}
function TrashIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;
}
function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 13l4 4L19 7" /></svg>;
}
function ChevronIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6" /></svg>;
}
function SearchIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
}

const ACCENT = "#E11D2A";

const DEFAULT_MEALS: Omit<Meal, "alternatives" | "altExpanded">[] = [
  { id: "m1", label: "ארוחת בוקר",  time: "08:00", items: [] },
  { id: "m2", label: "ביניים א׳",    time: "10:30", items: [] },
  { id: "m3", label: "ארוחת צהריים", time: "13:00", items: [] },
  { id: "m4", label: "ביניים ב׳",    time: "16:30", items: [] },
  { id: "m5", label: "ארוחת ערב",    time: "19:30", items: [] },
];

function makeAlt(n: 1 | 2 | 3): Alternative {
  return { id: `alt-${n}-${Math.random().toString(36).slice(2)}`, option_number: n, items: [] };
}

function makeMeal(label = "ארוחה חדשה", time = "12:00"): Meal {
  return {
    id: Math.random().toString(36).slice(2),
    label, time,
    items: [],
    alternatives: [makeAlt(1), makeAlt(2), makeAlt(3)],
    altExpanded: false,
  };
}

// ─── Food Picker Modal ───
type PickerTarget = { mealId: string; altOptionNumber: null | 1 | 2 | 3 };

function FoodPicker({
  target, onAdd, onClose,
}: {
  target: PickerTarget;
  onAdd: (target: PickerTarget, item: FoodItem) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FoodEntry | null>(null);
  const [grams, setGrams] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [custom, setCustom] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => searchRef.current?.focus(), 100); }, []);

  const results = searchFoods(query).slice(0, 20);
  const macros = selected && grams ? calcMacros(selected, parseFloat(grams) || 0) : null;

  const handleAdd = () => {
    if (customMode) {
      if (!custom.name.trim()) return;
      const item: FoodItem = {
        id: Math.random().toString(36).slice(2),
        name: custom.name.trim(),
        amount: "—",
        calories: parseFloat(custom.calories) || 0,
        protein: parseFloat(custom.protein) || 0,
        carbs: parseFloat(custom.carbs) || 0,
        fat: parseFloat(custom.fat) || 0,
      };
      onAdd(target, item);
      return;
    }
    if (!selected || !grams || !macros) return;
    const g = parseFloat(grams);
    const item: FoodItem = {
      id: Math.random().toString(36).slice(2),
      name: selected.name,
      amount: `${g}g`,
      calories: macros.calories,
      protein: macros.protein_g,
      carbs: macros.carbs_g,
      fat: macros.fat_g,
    };
    onAdd(target, item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <div className="w-full rounded-t-3xl pb-10 flex flex-col font-heb"
        style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Handle + header */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0">
          <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold" style={{ color: "#FAF9F6" }}>הוסף מזון</h3>
            <button onClick={() => setCustomMode(!customMode)}
              className="tap text-[11px] px-3 py-1.5 rounded-full"
              style={{ background: customMode ? ACCENT : "rgba(255,255,255,0.08)", color: customMode ? "#fff" : "rgba(255,255,255,0.55)" }}>
              {customMode ? "חפש במאגר" : "הוסף ידנית"}
            </button>
          </div>

          {!customMode && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <SearchIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              <input ref={searchRef} value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); setGrams(""); }}
                placeholder="חפש מזון... (חזה עוף, אורז, בננה...)"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/30"
                style={{ color: "#FAF9F6", caretColor: ACCENT }} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 flex-1">
          {customMode ? (
            <div className="space-y-3 pb-4">
              {[
                { key: "name", label: "שם המזון", type: "text", placeholder: "למשל: סלט ירקות" },
                { key: "calories", label: "קלוריות", type: "number", placeholder: "0" },
                { key: "protein", label: "חלבון (g)", type: "number", placeholder: "0" },
                { key: "carbs", label: "פחמימות (g)", type: "number", placeholder: "0" },
                { key: "fat", label: "שומן (g)", type: "number", placeholder: "0" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <p className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>{label}</p>
                  <input type={type} value={(custom as Record<string, string>)[key]}
                    onChange={(e) => setCustom((c) => ({ ...c, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", color: "#FAF9F6", caretColor: ACCENT }} />
                </div>
              ))}
            </div>
          ) : selected ? (
            // Gram input for selected food
            <div className="pb-4 space-y-4">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="font-semibold text-[14px]" style={{ color: "#FAF9F6" }}>{selected.name}</p>
                <p className="text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  כל 100g: {selected.caloriesPer100g} קל׳ · חל׳ {selected.proteinPer100g}g · פח׳ {selected.carbsPer100g}g · שומן {selected.fatPer100g}g
                </p>
              </div>
              <div>
                <p className="text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>כמות בגרמים</p>
                <input type="number" value={grams} onChange={(e) => setGrams(e.target.value)}
                  placeholder={`${selected.defaultGrams}`}
                  autoFocus
                  className="w-full rounded-xl px-3 py-3 text-[16px] font-bold outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", color: "#FAF9F6", caretColor: ACCENT }} />
              </div>
              {macros && parseFloat(grams) > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "קל׳", value: macros.calories, color: ACCENT },
                    { label: "חל׳", value: `${macros.protein_g}g`, color: "#E11D2A" },
                    { label: "פח׳", value: `${macros.carbs_g}g`, color: "#F97316" },
                    { label: "שומן", value: `${macros.fat_g}g`, color: "#EAB308" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <p className="text-[14px] font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setSelected(null)} className="tap text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                ← חזור לחיפוש
              </button>
            </div>
          ) : (
            // Search results
            <div className="space-y-1.5 pb-4">
              {results.length === 0 && (
                <p className="text-center py-8 text-[13px]" style={{ color: "rgba(255,255,255,0.30)" }}>לא נמצאו תוצאות</p>
              )}
              {results.map((food, fi) => (
                <button key={fi} onClick={() => { setSelected(food); setGrams(String(food.defaultGrams)); }}
                  className="tap w-full flex items-center justify-between rounded-2xl p-3.5"
                  style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
                  <div className="text-right">
                    <p className="font-medium text-[13px]" style={{ color: "#FAF9F6" }}>{food.name}</p>
                    <p className="text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      כל 100g: {food.caloriesPer100g} קל׳ · חל׳ {food.proteinPer100g}g
                    </p>
                  </div>
                  <PlusIcon className="w-4 h-4 flex-shrink-0 ml-3" style={{ color: "rgba(255,255,255,0.25)" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add button */}
        {(selected || customMode) && (
          <div className="px-5 pt-3 pb-safe flex-shrink-0">
            <button onClick={handleAdd}
              disabled={customMode ? !custom.name.trim() : (!selected || !grams || parseFloat(grams) <= 0)}
              className="tap w-full h-12 rounded-full font-bold text-[15px] text-white disabled:opacity-40"
              style={{ background: ACCENT }}>
              הוסף לארוחה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ───
export default function ClientNutritionPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: cd } = await supabase.from("clients").select("name").eq("id", clientId).single();
      if (cd) setClientName(cd.name);

      // Load existing plan
      const { data: cmpRows } = await supabase.from("client_meal_plans")
        .select("meal_plan_id")
        .eq("client_id", clientId).eq("active", true)
        .order("id", { ascending: false }).limit(1);
      const cmp = cmpRows?.[0];

      if (cmp?.meal_plan_id) {
        const { data: mealsData } = await supabase.from("meals")
          .select("id, name, time_window, order_index")
          .eq("plan_id", cmp.meal_plan_id)
          .order("order_index");

        if (mealsData && mealsData.length > 0) {
          const loadedMeals: Meal[] = await Promise.all(
            mealsData.map(async (m) => {
              const { data: items } = await supabase.from("meal_items")
                .select("id, food_name, amount, calories, protein_g, carbs_g, fat_g")
                .eq("meal_id", m.id)
                .order("order_index");

              const { data: altsData } = await supabase.from("meal_alternatives")
                .select("id, option_number")
                .eq("meal_id", m.id)
                .order("option_number");

              const alternatives: Alternative[] = [1, 2, 3].map((n) => {
                const altRow = altsData?.find((a) => a.option_number === n);
                return altRow
                  ? { id: altRow.id, option_number: n as 1|2|3, items: [] }
                  : makeAlt(n as 1|2|3);
              });

              // Load items for each existing alternative
              await Promise.all(
                alternatives.map(async (alt, ai) => {
                  const altRow = altsData?.find((a) => a.option_number === alt.option_number);
                  if (!altRow) return;
                  const { data: altItems } = await supabase.from("meal_alternative_items")
                    .select("id, food_name, amount, calories, protein_g, carbs_g, fat_g")
                    .eq("alternative_id", altRow.id)
                    .order("order_index");
                  alternatives[ai].items = (altItems ?? []).map((it) => ({
                    id: it.id,
                    name: it.food_name,
                    amount: it.amount ?? "—",
                    calories: it.calories ?? 0,
                    protein: it.protein_g ?? 0,
                    carbs: it.carbs_g ?? 0,
                    fat: it.fat_g ?? 0,
                  }));
                })
              );

              return {
                id: m.id,
                label: m.name,
                time: m.time_window ?? "",
                items: (items ?? []).map((it) => ({
                  id: it.id,
                  name: it.food_name,
                  amount: it.amount ?? "—",
                  calories: it.calories ?? 0,
                  protein: it.protein_g ?? 0,
                  carbs: it.carbs_g ?? 0,
                  fat: it.fat_g ?? 0,
                })),
                alternatives,
                altExpanded: false,
              };
            })
          );
          setMeals(loadedMeals);
          setLoading(false);
          return;
        }
      }

      // No existing plan — start with defaults
      setMeals(DEFAULT_MEALS.map((m) => ({
        ...m,
        alternatives: [makeAlt(1), makeAlt(2), makeAlt(3)],
        altExpanded: false,
      })));
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // ─── Meal mutators ───
  const addItemToTarget = (target: PickerTarget, item: FoodItem) => {
    setMeals((prev) => prev.map((m) => {
      if (m.id !== target.mealId) return m;
      if (target.altOptionNumber === null) {
        return { ...m, items: [...m.items, item] };
      }
      return {
        ...m,
        alternatives: m.alternatives.map((a) =>
          a.option_number === target.altOptionNumber
            ? { ...a, items: [...a.items, item] }
            : a
        ),
      };
    }));
    setPickerTarget(null);
  };

  const removeItem = (mealId: string, itemId: string) => {
    setMeals((prev) => prev.map((m) =>
      m.id === mealId ? { ...m, items: m.items.filter((i) => i.id !== itemId) } : m
    ));
  };

  const removeAltItem = (mealId: string, optionNumber: number, itemId: string) => {
    setMeals((prev) => prev.map((m) =>
      m.id === mealId ? {
        ...m,
        alternatives: m.alternatives.map((a) =>
          a.option_number === optionNumber ? { ...a, items: a.items.filter((i) => i.id !== itemId) } : a
        ),
      } : m
    ));
  };

  const toggleAlt = (mealId: string) => {
    setMeals((prev) => prev.map((m) =>
      m.id === mealId ? { ...m, altExpanded: !m.altExpanded } : m
    ));
  };

  const addMeal = () => setMeals((prev) => [...prev, makeMeal()]);

  const removeMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  // ─── Save ───
  const saveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const totalCalories = meals.reduce((acc, m) =>
        acc + m.items.reduce((a, i) => a + i.calories, 0), 0);

      const { data: plan } = await supabase.from("meal_plans")
        .upsert({ coach_id: user.id, name: `תפריט ${clientName}`, total_calories: Math.round(totalCalories) })
        .select().single();
      if (!plan) throw new Error("no plan");

      // Delete old meals (cascades to items + alternatives)
      await supabase.from("meals").delete().eq("plan_id", plan.id);

      for (const [mi, meal] of meals.entries()) {
        const hasContent = meal.items.length > 0 || meal.alternatives.some((a) => a.items.length > 0);
        if (!hasContent) continue;

        const { data: mealRow } = await supabase.from("meals")
          .insert({ plan_id: plan.id, name: meal.label, time_window: meal.time, order_index: mi })
          .select().single();
        if (!mealRow) continue;

        if (meal.items.length > 0) {
          await supabase.from("meal_items").insert(
            meal.items.map((item, idx) => ({
              meal_id: mealRow.id,
              food_name: item.name,
              amount: item.amount,
              calories: item.calories,
              protein_g: item.protein,
              carbs_g: item.carbs,
              fat_g: item.fat,
              order_index: idx,
            }))
          );
        }

        for (const alt of meal.alternatives) {
          if (alt.items.length === 0) continue;
          const { data: altRow } = await supabase.from("meal_alternatives")
            .insert({ meal_id: mealRow.id, option_number: alt.option_number })
            .select().single();
          if (!altRow) continue;
          await supabase.from("meal_alternative_items").insert(
            alt.items.map((item, idx) => ({
              alternative_id: altRow.id,
              food_name: item.name,
              amount: item.amount,
              calories: item.calories,
              protein_g: item.protein,
              carbs_g: item.carbs,
              fat_g: item.fat,
              order_index: idx,
            }))
          );
        }
      }

      await supabase.from("client_meal_plans")
        .upsert({ client_id: clientId, meal_plan_id: plan.id, active: true }, { onConflict: "client_id,meal_plan_id" });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ }
    setSaving(false);
  };

  // ─── Derived ───
  const totalCalories  = meals.reduce((a, m) => a + m.items.reduce((s, i) => s + i.calories, 0), 0);
  const totalProtein   = meals.reduce((a, m) => a + m.items.reduce((s, i) => s + i.protein,  0), 0);
  const totalCarbs     = meals.reduce((a, m) => a + m.items.reduce((s, i) => s + i.carbs,    0), 0);
  const totalFat       = meals.reduce((a, m) => a + m.items.reduce((s, i) => s + i.fat,      0), 0);

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-5 w-24 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[1,2,3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-36" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.back()} className="tap flex items-center gap-1.5 text-[13px]"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />{clientName}
        </button>

        {/* Header */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תפריט תזונה</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
        </div>

        {/* Totals */}
        <div className="rounded-2xl p-4 rise" style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <p className="text-[10.5px] tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>סיכום יומי</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "קלוריות", value: Math.round(totalCalories), color: ACCENT },
              { label: "חלבון",   value: `${Math.round(totalProtein)}g`, color: ACCENT },
              { label: "פחמימות", value: `${Math.round(totalCarbs)}g`,   color: "#F97316" },
              { label: "שומן",    value: `${Math.round(totalFat)}g`,     color: "#EAB308" },
            ].map(({ label, value, color }, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-[15px] font-bold leading-none" style={{ color }}>{value}</p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-3">
          {meals.map((meal, mi) => {
            const mealCal = meal.items.reduce((a, i) => a + i.calories, 0);
            const definedAlts = meal.alternatives.filter((a) => a.items.length > 0);

            return (
              <div key={meal.id} className="rounded-2xl rise" style={{ animationDelay: `${120 + mi * 45}ms`, background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>

                {/* Meal header */}
                <div className="flex items-center justify-between p-4 pb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] truncate">{meal.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {meal.time}{mealCal > 0 && ` · ${mealCal} קל׳`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPickerTarget({ mealId: meal.id, altOptionNumber: null })}
                      className="tap w-8 h-8 rounded-full grid place-items-center"
                      style={{ background: "rgba(225,29,42,0.12)" }}>
                      <PlusIcon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    </button>
                    {meals.length > 1 && (
                      <button onClick={() => removeMeal(meal.id)}
                        className="tap w-8 h-8 rounded-full grid place-items-center"
                        style={{ background: "rgba(255,255,255,0.05)" }}>
                        <TrashIcon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.30)" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main food items */}
                <div className="px-4 pb-2 space-y-1.5">
                  {meal.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium truncate">{item.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {item.amount} · {item.calories} קל׳ · חל׳ {item.protein}g
                        </p>
                      </div>
                      <button onClick={() => removeItem(meal.id, item.id)}
                        className="tap w-6 h-6 rounded-lg grid place-items-center flex-shrink-0"
                        style={{ background: "rgba(225,29,42,0.08)" }}>
                        <TrashIcon className="w-3 h-3" style={{ color: ACCENT }} />
                      </button>
                    </div>
                  ))}
                  {meal.items.length === 0 && (
                    <button onClick={() => setPickerTarget({ mealId: meal.id, altOptionNumber: null })}
                      className="tap w-full py-3 rounded-xl text-[12px] text-center"
                      style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
                      הוסף מזונות
                    </button>
                  )}
                </div>

                {/* Alternatives toggle */}
                <button onClick={() => toggleAlt(meal.id)}
                  className="tap w-full flex items-center justify-between px-4 py-2.5 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-[11.5px] font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
                    חלופות{definedAlts.length > 0 ? ` (${definedAlts.length}/3)` : ""}
                  </span>
                  <ChevronIcon className="w-4 h-4" style={{
                    color: "rgba(255,255,255,0.30)",
                    transform: meal.altExpanded ? "rotate(180deg)" : "none",
                    transition: "transform 200ms",
                  }} />
                </button>

                {/* Alternatives content */}
                {meal.altExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    {meal.alternatives.map((alt) => {
                      const altCal = alt.items.reduce((s, i) => s + i.calories, 0);
                      return (
                        <div key={alt.option_number} className="rounded-xl p-3"
                          style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11.5px] font-semibold" style={{ color: "rgba(255,255,255,0.60)" }}>
                              חלופה {alt.option_number}{altCal > 0 && ` · ${altCal} קל׳`}
                            </span>
                            <button onClick={() => setPickerTarget({ mealId: meal.id, altOptionNumber: alt.option_number })}
                              className="tap w-6 h-6 rounded-full grid place-items-center"
                              style={{ background: "rgba(225,29,42,0.10)" }}>
                              <PlusIcon className="w-3 h-3" style={{ color: ACCENT }} />
                            </button>
                          </div>
                          {alt.items.length === 0 ? (
                            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.20)" }}>ריק — לחץ + להוסיף</p>
                          ) : (
                            <div className="space-y-1">
                              {alt.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                                  style={{ background: "rgba(255,255,255,0.04)" }}>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11.5px] font-medium truncate">{item.name}</p>
                                    <p className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.30)" }}>
                                      {item.amount} · {item.calories} קל׳
                                    </p>
                                  </div>
                                  <button onClick={() => removeAltItem(meal.id, alt.option_number, item.id)}
                                    className="tap w-5 h-5 rounded grid place-items-center flex-shrink-0"
                                    style={{ background: "rgba(225,29,42,0.08)" }}>
                                    <TrashIcon className="w-2.5 h-2.5" style={{ color: ACCENT }} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add meal button */}
          <button onClick={addMeal}
            className="tap w-full flex items-center justify-center gap-2 rounded-2xl py-4"
            style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>
            <PlusIcon className="w-4 h-4" />
            <span className="text-[13px] font-medium">הוסף ארוחה</span>
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: "linear-gradient(to top, #0B0A08 70%, transparent)" }}>
        <button onClick={saveAll} disabled={saving}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: ACCENT, boxShadow: "0 10px 28px rgba(225,29,42,0.40)" }}>
          {saved ? (<><CheckIcon className="w-5 h-5" />נשמר!</>) : saving ? "שומר..." : "שמור תפריט"}
        </button>
      </div>

      {/* Food picker */}
      {pickerTarget && (
        <FoodPicker target={pickerTarget} onAdd={addItemToTarget} onClose={() => setPickerTarget(null)} />
      )}
    </main>
  );
}
