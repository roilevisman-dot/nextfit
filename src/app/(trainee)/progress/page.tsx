"use client";

import { useState } from "react";

const weightLog = [
  { date: "17/05", weight: 82.5 },
  { date: "10/05", weight: 83.1 },
  { date: "03/05", weight: 84.0 },
  { date: "26/04", weight: 84.8 },
  { date: "19/04", weight: 85.5 },
];

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ScaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z"/>
      <path d="M6.5 7H4l-2 9h20l-2-9h-2.5"/>
      <line x1="12" y1="7" x2="12" y2="12"/>
    </svg>
  );
}

export default function ProgressPage() {
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const latest = weightLog[0].weight;
  const first = weightLog[weightLog.length - 1].weight;
  const diff = (latest - first).toFixed(1);
  const isLoss = Number(diff) < 0;

  const minW = Math.min(...weightLog.map((w) => w.weight));
  const maxW = Math.max(...weightLog.map((w) => w.weight));
  const range = maxW - minW || 1;

  // SVG line chart
  const chartW = 300;
  const chartH = 80;
  const points = [...weightLog].reverse().map((entry, i, arr) => {
    const x = (i / (arr.length - 1)) * chartW;
    const y = chartH - ((entry.weight - minW) / range) * (chartH - 16) - 8;
    return { x, y, ...entry };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">מעקב</div>
            <h1 className="mt-1 text-[28px] font-extrabold leading-tight">התקדמות</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="tap mt-1 w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "#E11D2A", boxShadow: "0 8px 20px rgba(225,29,42,0.40)" }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 rise" style={{ animationDelay: "60ms" }}>
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10.5px] text-white/45 mb-1">משקל נוכחי</p>
            <p className="text-[26px] font-extrabold leading-none">
              {latest}<span className="text-[13px] font-normal text-white/40"> ק״ג</span>
            </p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{
              background: isLoss ? "rgba(16,185,129,0.08)" : "rgba(225,29,42,0.08)",
              boxShadow: isLoss ? "inset 0 0 0 1px rgba(16,185,129,0.20)" : "inset 0 0 0 1px rgba(225,29,42,0.20)",
            }}
          >
            <p className="text-[10.5px] text-white/45 mb-1">שינוי כולל</p>
            <p
              className="text-[26px] font-extrabold leading-none"
              style={{ color: isLoss ? "#10B981" : "#E11D2A" }}
            >
              {isLoss ? "" : "+"}{diff}<span className="text-[13px] font-normal text-white/40"> ק״ג</span>
            </p>
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-2xl p-4 rise"
          style={{
            animationDelay: "100ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[12.5px] font-semibold mb-4">היסטוריית משקל</p>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ height: 88 }}>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((t, i) => (
              <line key={i} x1="0" y1={chartH * t} x2={chartW} y2={chartH * t}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {/* Area fill */}
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${pathD} L ${chartW} ${chartH} L 0 ${chartH} Z`}
              fill="url(#redGrad)"
            />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#E11D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots + labels */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3" fill="#E11D2A" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8" fill="rgba(250,249,246,0.5)">{p.weight}</text>
                <text x={p.x} y={chartH - 1} textAnchor="middle" fontSize="7" fill="rgba(250,249,246,0.3)">{p.date}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Log list */}
        <div
          className="rounded-2xl overflow-hidden rise"
          style={{
            animationDelay: "150ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3.5">
            <ScaleIcon className="w-4 h-4 text-white/40" />
            <p className="text-[12.5px] font-semibold">שקילות אחרונות</p>
          </div>
          {weightLog.map((entry, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[12px] text-white/40">{entry.date}</span>
              <span className="text-[13px] font-semibold">{entry.weight} ק״ג</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full rounded-t-3xl p-6 pb-10"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-[17px] font-bold mb-4">הוספת שקילה</h3>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="82.5"
              className="w-full h-14 rounded-2xl px-4 text-white text-center text-[22px] font-bold outline-none"
              style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)", caretColor: "#E11D2A" }}
              autoFocus
            />
            <button
              className="tap mt-3 w-full h-12 rounded-full font-semibold text-white"
              style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
              onClick={() => setShowModal(false)}
            >
              שמור
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
