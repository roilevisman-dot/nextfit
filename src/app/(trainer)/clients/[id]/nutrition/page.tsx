"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FoodItem = {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Meal = {
  id: string;
  label: string;
  time: string;
  items: FoodItem[];
};

const FOOD_LIBRARY: Omit<FoodItem, "id" | "amount">[] = [
  { name: "חזה עוף (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "ביצה שלמה", calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  { name: "חלבון ביצה", calories: 17, protein: 3.6, carbs: 0.2, fat: 0 },
  { name: "אורז לבן (100g מבושל)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "קווקר (50g)", calories: 189, protein: 6.5, carbs: 32, fat: 3.5 },
  { name: "לחם מלא פרוסה", calories: 80, protein: 3, carbs: 15, fat: 1 },
  { name: "בטטה (100g)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "גבינת קוטג׳ (100g)", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: "יוגורט יווני (100g)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "טונה (100g)", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: "סלמון (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "בננה", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "תפוח", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "שיבולת שועל (50g)", calories: 187, protein: 6.8, carbs: 32, fat: 3.4 },
  { name: "שמן זית (כף)", calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  { name: "אגוזים מעורבים (30g)", calories: 185, protein: 4.5, carbs: 6, fat: 18 },
  { name: "חומוס (100g)", calories: 166, protein: 9, carbs: 27, fat: 3 },
  { name: "טופו (100g)", calories: 76, protein: 8, carbs: 2, fat: 4.2 },
  { name: "חלב דל שומן (200ml)", calories: 68, protein: 6.8, carbs: 9.6, fat: 0.2 },
  { name: "פרוטאין שייק (מנה)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
];

const DEFAULT_MEALS: Meal[] = [
  { id: "m1", label: "ארוחת בוקר", time: "08:00", items: [] },
  { id: "m2", label: "ארוחת ביניים", time: "11:00", items: [] },
  { id: "m3", label: "ארוחת צהריים", time: "13:30", items: [] },
  { id: "m4", label: "ארוחת ערב", time: "19:00", items: [] },
];

function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ClientNutritionPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [clientName, setClientName] = useState("");
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);
  const [activeMeal, setActiveMeal] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.from("clients").select("name").eq("id", clientId).single();
      if (data) setClientName(data.name);
    };
    init();
  }, [supabase, clientId]);

  const totalCalories = meals.reduce((acc, m) => acc + m.items.reduce((a, i) => a + i.calories, 0), 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.items.reduce((a, i) => a + i.protein, 0), 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.items.reduce((a, i) => a + i.carbs, 0), 0);
  const totalFat = meals.reduce((acc, m) => acc + m.items.reduce((a, i) => a + i.fat, 0), 0);

  const addFoodToMeal = (mealId: string, food: typeof FOOD_LIBRARY[0]) => {
    const newItem: FoodItem = {
      id: Math.random().toString(36).slice(2),
      name: food.name,
      amount: "1 מנה",
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };
    setMeals((prev) => prev.map((m) => m.id === mealId ? { ...m, items: [...m.items, newItem] } : m));
    setActiveMeal(null);
  };

  const removeItem = (mealId: string, itemId: string) => {
    setMeals((prev) => prev.map((m) => m.id === mealId ? { ...m, items: m.items.filter((i) => i.id !== itemId) } : m));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: plan } = await supabase
        .from("meal_plans")
        .upsert({ coach_id: user.id, name: `תפריט ${clientName}`, total_calories: Math.round(totalCalories) })
        .select()
        .single();
      if (!plan) throw new Error("no plan");

      await supabase.from("meals").delete().eq("plan_id", plan.id);

      for (const meal of meals) {
        if (meal.items.length === 0) continue;
        const { data: mealRow } = await supabase
          .from("meals")
          .insert({ plan_id: plan.id, name: meal.label, time_window: meal.time, order_index: meals.indexOf(meal) })
          .select()
          .single();
        if (!mealRow) continue;
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

      await supabase.from("client_meal_plans").upsert({ client_id: clientId, meal_plan_id: plan.id, active: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      /* ignore */
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <BackIcon className="w-4 h-4" />
          {clientName}
        </button>

        {/* Header */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תפריט תזונה</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
        </div>

        {/* Daily totals */}
        <div
          className="rounded-2xl p-4 rise"
          style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <p className="text-[10.5px] tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>סיכום יומי</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "קלוריות", value: Math.round(totalCalories), color: "#E11D2A" },
              { label: "חלבון", value: `${Math.round(totalProtein)}g`, color: "#E11D2A" },
              { label: "פחמימות", value: `${Math.round(totalCarbs)}g`, color: "#F97316" },
              { label: "שומן", value: `${Math.round(totalFat)}g`, color: "#EAB308" },
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
          {meals.map((meal, mi) => (
            <div
              key={meal.id}
              className="rounded-2xl p-4 rise"
              style={{
                animationDelay: `${120 + mi * 55}ms`,
                background: "rgba(255,255,255,0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              {/* Meal header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-[14px]">{meal.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {meal.time} · {meal.items.reduce((a, i) => a + i.calories, 0)} קל׳
                  </p>
                </div>
                <button
                  onClick={() => setActiveMeal(meal.id)}
                  className="tap w-8 h-8 rounded-full grid place-items-center"
                  style={{ background: "rgba(225,29,42,0.12)" }}
                >
                  <PlusIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
                </button>
              </div>

              {/* Food items */}
              {meal.items.length > 0 && (
                <div className="space-y-1.5">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium truncate">{item.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {item.calories} קל׳ · {item.protein}g חל׳
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(meal.id, item.id)}
                        className="tap w-6 h-6 rounded-lg grid place-items-center flex-shrink-0"
                        style={{ background: "rgba(225,29,42,0.08)" }}
                      >
                        <TrashIcon className="w-3 h-3" style={{ color: "#E11D2A" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {meal.items.length === 0 && (
                <button
                  onClick={() => setActiveMeal(meal.id)}
                  className="tap w-full py-3 rounded-xl text-[12px] text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  הוסף מזונות
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: "linear-gradient(to top, #0B0A08 70%, transparent)" }}>
        <button
          onClick={saveAll}
          disabled={saving}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "#E11D2A", boxShadow: "0 10px 28px rgba(225,29,42,0.40)" }}
        >
          {saved ? (
            <>
              <CheckIcon className="w-5 h-5" />
              נשמר!
            </>
          ) : saving ? "שומר..." : "שמור תפריט"}
        </button>
      </div>

      {/* Food picker modal */}
      {activeMeal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }}
          onClick={() => setActiveMeal(null)}
        >
          <div
            className="w-full rounded-t-3xl pb-10"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "82vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <h3 className="text-[17px] font-bold">בחר מזון</h3>
            </div>
            <div className="overflow-y-auto px-5 space-y-2">
              {FOOD_LIBRARY.map((food, fi) => (
                <button
                  key={fi}
                  onClick={() => addFoodToMeal(activeMeal, food)}
                  className="tap w-full flex items-center justify-between rounded-2xl p-3.5"
                  style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
                >
                  <div className="text-right">
                    <p className="font-medium text-[13px]">{food.name}</p>
                    <p className="text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {food.calories} קל׳ · חל׳ {food.protein}g · פח׳ {food.carbs}g · שומן {food.fat}g
                    </p>
                  </div>
                  <PlusIcon className="w-4 h-4 flex-shrink-0 ml-3" style={{ color: "rgba(255,255,255,0.30)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
