"use client";

import { useState } from "react";

const TOTAL_CAL = 2100;
const consumed = 1320;
const remaining = TOTAL_CAL - consumed;

const macros = [
  { label: "חלבון", value: 86, max: 160, color: "#E11D2A" },
  { label: "פחמימות", value: 138, max: 240, color: "#F97316" },
  { label: "שומן", value: 38, max: 70, color: "#EAB308" },
];

const meals = [
  {
    name: "שיבולת שועל + חלבון",
    time: "07:30",
    cal: 420,
    done: true,
    img: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=120&q=80",
    macros: { p: 28, c: 58, f: 12 },
  },
  {
    name: "תבנית לגן + פירות",
    time: "10:30",
    cal: 220,
    done: true,
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&q=80",
    macros: { p: 8, c: 42, f: 6 },
  },
  {
    name: "חזה עוף + אורז מלא",
    time: "13:30",
    cal: 540,
    done: false,
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=120&q=80",
    macros: { p: 52, c: 65, f: 14 },
  },
  {
    name: "סלמון + בטטה",
    time: "19:00",
    cal: 480,
    done: false,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&q=80",
    macros: { p: 44, c: 38, f: 18 },
  },
];

const WATER_GOAL = 2.5;
const DROPS = 8;

// Donut chart helpers
const R = 54;
const CIRC = 2 * Math.PI * R;
const pct = consumed / TOTAL_CAL;
const dash = pct * CIRC;

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function NutritionPage() {
  const [water, setWater] = useState(1.25);
  const [done, setDone] = useState<boolean[]>(meals.map((m) => m.done));

  const filledDrops = Math.round((water / WATER_GOAL) * DROPS);

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
          style={{
            animationDelay: "50ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130">
                {/* Track */}
                <circle
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="12"
                />
                {/* Progress */}
                <circle
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke="#E11D2A"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${CIRC}`}
                  strokeDashoffset={CIRC / 4}
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[22px] font-extrabold leading-none">{consumed.toLocaleString()}</p>
                <p className="text-[9px] text-white/45 mt-0.5">מתוך {TOTAL_CAL.toLocaleString()} קק״ל</p>
                <p className="text-[9px] mt-1" style={{ color: "#E11D2A" }}>{remaining} נותרו</p>
              </div>
            </div>

            {/* Macro bars */}
            <div className="flex-1 space-y-3">
              {macros.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-white/50">{m.label}</span>
                    <span className="text-[11px] font-semibold">{m.value}g</span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: m.color, width: `${(m.value / m.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water tracker */}
        <div
          className="rounded-2xl p-4 rise"
          style={{
            animationDelay: "90ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">מעקב שתייה</span>
            <span className="text-[11px] text-white/40">{water.toFixed(2)}L / {WATER_GOAL}L</span>
          </div>

          {/* + / - controls */}
          <div className="flex items-center gap-3 mb-3">
            <button
              className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "rgba(255,255,255,0.07)" }}
              onClick={() => setWater((w) => Math.max(0, parseFloat((w - 0.25).toFixed(2))))}
            >
              −
            </button>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ background: "#3B82F6", width: `${(water / WATER_GOAL) * 100}%` }}
              />
            </div>
            <button
              className="tap w-9 h-9 rounded-full grid place-items-center font-bold text-[18px]"
              style={{ background: "#3B82F6" }}
              onClick={() => setWater((w) => Math.min(WATER_GOAL, parseFloat((w + 0.25).toFixed(2))))}
            >
              +
            </button>
          </div>

          {/* Drop indicators */}
          <div className="flex gap-1.5">
            {Array.from({ length: DROPS }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-5 rounded-md transition-all"
                style={{ background: i < filledDrops ? "#3B82F6" : "rgba(255,255,255,0.07)" }}
              />
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="rise" style={{ animationDelay: "130ms" }}>
          <p className="text-[12.5px] font-semibold text-white/60 mb-2.5">ארוחות היום</p>
          <div className="space-y-2.5">
            {meals.map((meal, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden flex items-center gap-0"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  opacity: done[i] ? 1 : 0.75,
                }}
              >
                {/* Food image */}
                <img
                  src={meal.img}
                  alt={meal.name}
                  className="w-[72px] h-[72px] object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 px-3 py-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-semibold leading-tight">{meal.name}</p>
                      <p className="text-[10.5px] text-white/40 mt-0.5">{meal.time} · {meal.cal} קק״ל</p>
                    </div>
                    <button
                      className="tap w-7 h-7 rounded-full grid place-items-center flex-shrink-0 ml-1"
                      style={{
                        background: done[i] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)",
                        boxShadow: done[i] ? "inset 0 0 0 1px rgba(16,185,129,0.35)" : "inset 0 0 0 1px rgba(255,255,255,0.10)",
                      }}
                      onClick={() => setDone((d) => d.map((v, j) => j === i ? !v : v))}
                    >
                      <CheckIcon className="w-3.5 h-3.5" style={{ color: done[i] ? "#10B981" : "rgba(255,255,255,0.3)" }} />
                    </button>
                  </div>

                  {/* Mini macros */}
                  <div className="flex gap-2.5 mt-1.5">
                    {[
                      { l: "P", v: meal.macros.p, c: "#E11D2A" },
                      { l: "C", v: meal.macros.c, c: "#F97316" },
                      { l: "F", v: meal.macros.f, c: "#EAB308" },
                    ].map((m, j) => (
                      <span key={j} className="text-[9.5px]" style={{ color: m.c }}>
                        {m.l}: {m.v}g
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
