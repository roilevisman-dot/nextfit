"use client";

import { useState } from "react";

const meals = [
  {
    label: "ארוחת בוקר",
    time: "07:00–08:00",
    calories: 480,
    emoji: "☀️",
    items: ["4 ביצים קשות", "2 פרוסות לחם מחיטה מלאה", "1/2 אבוקדו", "קפה שחור"],
    macros: { protein: 38, carbs: 42, fat: 22 },
  },
  {
    label: "ארוחת צהריים",
    time: "12:30–13:30",
    calories: 620,
    emoji: "🍗",
    items: ["200g חזה עוף", "150g אורז מלא", "ירקות מוקפצים", "כף שמן זית"],
    macros: { protein: 52, carbs: 65, fat: 14 },
  },
  {
    label: "חטיף אחה״צ",
    time: "16:00–17:00",
    calories: 280,
    emoji: "🥛",
    items: ["200g גבינה 5%", "1 בננה", "קומץ שקדים (20g)"],
    macros: { protein: 24, carbs: 32, fat: 8 },
  },
  {
    label: "ארוחת ערב",
    time: "19:00–20:00",
    calories: 540,
    emoji: "🐟",
    items: ["180g דג סלמון", "200g בטטה", "סלט ירקות גדול", "כף טחינה"],
    macros: { protein: 44, carbs: 48, fat: 16 },
  },
];

const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
const totalProtein = meals.reduce((s, m) => s + m.macros.protein, 0);

export default function NutritionPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [water, setWater] = useState(4);
  const waterGoal = 8;

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="rise">
          <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">תזונה</div>
          <h1 className="mt-1 text-[28px] font-extrabold leading-tight">תפריט שבועי</h1>
        </div>

        {/* Summary */}
        <div
          className="rounded-3xl p-5 rise"
          style={{
            animationDelay: "60ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[10.5px] text-white/45 uppercase tracking-wide mb-3">סיכום יומי</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "קלוריות", value: totalCalories, unit: "קק״ל", red: true },
              { label: "חלבון", value: totalProtein, unit: "גרם", red: false },
              { label: "ארוחות", value: meals.length, unit: "ביום", red: false },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <p className="text-[22px] font-extrabold leading-none" style={{ color: s.red ? "#E11D2A" : "#FAF9F6" }}>{s.value}</p>
                <p className="text-[10px] text-white/40">{s.unit}</p>
                <p className="text-[9px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Water */}
        <div
          className="rounded-2xl p-4 rise"
          style={{
            animationDelay: "100ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium">💧 מעקב שתייה</span>
            <span className="text-[11px] text-white/40">{water}/{waterGoal} כוסות</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: waterGoal }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWater(i < water ? i : i + 1)}
                className="tap flex-1 h-6 rounded-lg transition-all"
                style={{ background: i < water ? "#3B82F6" : "rgba(255,255,255,0.07)" }}
              />
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-2.5 rise" style={{ animationDelay: "140ms" }}>
          {meals.map((meal, mi) => (
            <div
              key={mi}
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <button
                className="tap w-full flex items-center justify-between p-4"
                onClick={() => setOpen(open === mi ? null : mi)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center text-[20px]"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {meal.emoji}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[13.5px]">{meal.label}</p>
                    <p className="text-[11px] text-white/40">{meal.time} · {meal.calories} קק״ל</p>
                  </div>
                </div>
                <span className="text-white/30 text-[18px] leading-none">{open === mi ? "−" : "+"}</span>
              </button>

              {open === mi && (
                <div className="px-4 pb-4">
                  <div className="h-px mb-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="space-y-1.5 mb-4">
                    {meal.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E11D2A" }} />
                        <p className="text-[13px] text-white/75">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid grid-cols-3 rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    {[
                      { label: "חלבון", value: meal.macros.protein },
                      { label: "פחמימות", value: meal.macros.carbs },
                      { label: "שומן", value: meal.macros.fat },
                    ].map((m, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[14px] font-bold">{m.value}g</p>
                        <p className="text-[10px] text-white/40">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
