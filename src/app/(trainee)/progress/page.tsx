"use client";

import { useState } from "react";

const weightLog = [
  { date: "17/05", weight: 64.2 },
  { date: "01/05", weight: 66.1 },
  { date: "17/04", weight: 68.0 },
  { date: "03/04", weight: 69.4 },
  { date: "20/03", weight: 71.0 },
  { date: "06/03", weight: 72.8 },
];

const bodyMetrics = [
  { label: "BMI", value: "22.4" },
  { label: "חזה (ס״מ)", value: "96" },
  { label: "אחוז שומן", value: "18%" },
  { label: "מותן (ס״מ)", value: "74" },
];

const tabs = ["שבוע", "חודש", "3 חודשים"];

// SVG line chart
const chartW = 300;
const chartH = 90;
const minW = Math.min(...weightLog.map((w) => w.weight));
const maxW = Math.max(...weightLog.map((w) => w.weight));
const range = maxW - minW || 1;

const points = [...weightLog].reverse().map((entry, i, arr) => ({
  x: (i / (arr.length - 1)) * chartW,
  y: chartH - ((entry.weight - minW) / range) * (chartH - 20) - 10,
  ...entry,
}));

const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const latest = weightLog[0].weight;
  const first = weightLog[weightLog.length - 1].weight;
  const diff = (latest - first).toFixed(1);
  const isLoss = Number(diff) < 0;

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">מעקב</div>
            <h1 className="mt-1 text-[26px] font-extrabold leading-tight">ההתקדמות שלך</h1>
            <p className="text-[11.5px] text-white/40 mt-0.5">8 שבועות התקדמות, אתה בדרך הנכונה</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="tap mt-1 w-9 h-9 rounded-full grid place-items-center flex-shrink-0"
            style={{ background: "#E11D2A", boxShadow: "0 6px 18px rgba(225,29,42,0.40)" }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Time tabs */}
        <div
          className="flex p-1 rounded-full rise"
          style={{ animationDelay: "40ms", background: "rgba(255,255,255,0.05)" }}
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              className="tap flex-1 py-1.5 rounded-full text-[12px] font-medium transition-all"
              style={{
                background: activeTab === i ? "#E11D2A" : "transparent",
                color: activeTab === i ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: activeTab === i ? "0 4px 12px rgba(225,29,42,0.35)" : "none",
              }}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Weight card */}
        <div
          className="rounded-3xl p-5 rise"
          style={{
            animationDelay: "80ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          {/* Current weight */}
          <div className="mb-4">
            <p className="text-[10.5px] text-white/40 mb-0.5">משקל נוכחי</p>
            <div className="flex items-end gap-2">
              <p className="text-[48px] font-extrabold leading-none tracking-tight">{latest}</p>
              <p className="text-[16px] text-white/40 pb-2">ק״ג</p>
              <div
                className="mb-2 mr-auto px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: isLoss ? "rgba(16,185,129,0.12)" : "rgba(225,29,42,0.12)",
                  color: isLoss ? "#10B981" : "#E11D2A",
                }}
              >
                {isLoss ? "" : "+"}{diff} ק״ג
              </div>
            </div>
          </div>

          {/* Line chart */}
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ height: 100 }}>
            <defs>
              <linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75].map((t, i) => (
              <line key={i} x1="0" y1={chartH * t} x2={chartW} y2={chartH * t}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {/* Area */}
            <path
              d={`${pathD} L ${chartW} ${chartH} L 0 ${chartH} Z`}
              fill="url(#redArea)"
            />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#E11D2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 2.5}
                fill={i === points.length - 1 ? "#E11D2A" : "#E11D2A"}
                stroke={i === points.length - 1 ? "rgba(225,29,42,0.3)" : "none"}
                strokeWidth="4"
              />
            ))}
          </svg>

          {/* Date labels */}
          <div className="flex justify-between mt-1">
            {points.map((p, i) => (
              <span key={i} className="text-[8.5px] text-white/30">{p.date}</span>
            ))}
          </div>
        </div>

        {/* Body metrics */}
        <div className="grid grid-cols-4 gap-2 rise" style={{ animationDelay: "130ms" }}>
          {bodyMetrics.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <p className="text-[15px] font-extrabold leading-none">{m.value}</p>
              <p className="text-[8.5px] text-white/35 mt-1 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Weight log */}
        <div
          className="rounded-2xl overflow-hidden rise"
          style={{
            animationDelay: "170ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <p className="px-4 py-3.5 text-[12.5px] font-semibold">שקילות אחרונות</p>
          {weightLog.map((entry, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[11.5px] text-white/40">{entry.date}</span>
              <span className="text-[13px] font-semibold">{entry.weight} ק״ג</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add weight modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full rounded-t-3xl p-6 pb-12"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-[18px] font-bold mb-1">הוספת שקילה</h3>
            <p className="text-[12px] text-white/40 mb-4">הזן את המשקל הנוכחי שלך</p>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="64.2"
              inputMode="decimal"
              className="w-full h-16 rounded-2xl text-white text-center text-[28px] font-bold outline-none"
              style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(225,29,42,0.40)", caretColor: "#E11D2A" }}
              autoFocus
            />
            <button
              className="tap mt-4 w-full h-12 rounded-full font-semibold text-white"
              style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
              onClick={() => { setShowModal(false); setNewWeight(""); }}
            >
              שמור שקילה
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
