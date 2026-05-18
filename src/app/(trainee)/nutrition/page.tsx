"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Coffee, Sun, Sunset, Moon, ChevronDown, ChevronUp, Droplets } from "lucide-react";

const mealPlan = [
  {
    name: "ארוחת בוקר",
    time: "07:00–08:00",
    icon: Coffee,
    calories: 480,
    items: ["4 ביצים קשות", "2 פרוסות לחם מחיטה מלאה", "1/2 אבוקדו", "קפה שחור"],
    macros: { protein: 38, carbs: 42, fat: 22 },
  },
  {
    name: "ארוחת צהריים",
    time: "12:30–13:30",
    icon: Sun,
    calories: 620,
    items: ["200g חזה עוף", "150g אורז מלא", "ירקות מוקפצים", "כף שמן זית"],
    macros: { protein: 52, carbs: 65, fat: 14 },
  },
  {
    name: "חטיף אחה״צ",
    time: "16:00–17:00",
    icon: Sunset,
    calories: 280,
    items: ["200g גבינה 5%", "1 בננה", "קומץ שקדים (20g)"],
    macros: { protein: 24, carbs: 32, fat: 8 },
  },
  {
    name: "ארוחת ערב",
    time: "19:00–20:00",
    icon: Moon,
    calories: 540,
    items: ["180g דג סלמון", "200g בטטה", "סלט ירקות גדול", "כף טחינה"],
    macros: { protein: 44, carbs: 48, fat: 16 },
  },
];

const totalCalories = mealPlan.reduce((s, m) => s + m.calories, 0);
const totalProtein = mealPlan.reduce((s, m) => s + m.macros.protein, 0);

export default function NutritionPage() {
  const [openMeal, setOpenMeal] = useState<number | null>(0);
  const [water, setWater] = useState(4);
  const waterGoal = 8;

  return (
    <div className="px-5 pt-12 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">תפריט תזונה</h1>
        <p className="text-muted-foreground text-sm mt-1">תפריט שבועי מהמאמן</p>
      </motion.div>

      {/* Daily summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-card border border-border rounded-3xl p-5"
      >
        <p className="text-xs text-muted-foreground mb-3">סיכום יומי</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "קלוריות", value: totalCalories, unit: "קק״ל", color: "#c8ff00" },
            { label: "חלבון", value: totalProtein, unit: "גרם", color: "#60a5fa" },
            { label: "ארוחות", value: mealPlan.length, unit: "ביום", color: "#a78bfa" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.unit}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Water tracker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4" style={{ color: "#60a5fa" }} />
            <span className="text-sm font-medium text-foreground">מעקב שתייה</span>
          </div>
          <span className="text-sm text-muted-foreground">{water}/{waterGoal} כוסות</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i < water ? i : i + 1)}
              className="flex-1 h-7 rounded-lg transition-colors"
              style={{ background: i < water ? "#60a5fa" : "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Meal list */}
      <div className="flex flex-col gap-3">
        {mealPlan.map((meal, mi) => {
          const Icon = meal.icon;
          return (
            <motion.div
              key={mi}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + mi * 0.07 }}
              className="bg-card border border-border rounded-3xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5"
                onClick={() => setOpenMeal(openMeal === mi ? null : mi)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(200,255,0,0.10)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#c8ff00" }} />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.time} • {meal.calories} קק״ל</p>
                  </div>
                </div>
                {openMeal === mi
                  ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                }
              </button>

              {openMeal === mi && (
                <div className="px-5 pb-5">
                  <div className="h-px bg-border mb-4" />
                  <div className="flex flex-col gap-2 mb-4">
                    {meal.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#c8ff00" }} />
                        <p className="text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 bg-secondary rounded-xl p-3">
                    {[
                      { label: "חלבון", value: meal.macros.protein },
                      { label: "פחמימות", value: meal.macros.carbs },
                      { label: "שומן", value: meal.macros.fat },
                    ].map((m, i) => (
                      <div key={i} className="flex-1 text-center">
                        <p className="text-sm font-bold text-foreground">{m.value}g</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
