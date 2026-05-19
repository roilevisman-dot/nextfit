"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type WeightLog = {
  id: string;
  weight: number;
  logged_at: string;
};

type Client = {
  name: string;
  current_weight: number | null;
  goal_weight: number | null;
};

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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

const TIME_FILTERS = [
  { label: "חודש", days: 30 },
  { label: "3 חודשים", days: 90 },
  { label: "הכל", days: 9999 },
];

function WeightChart({ logs }: { logs: WeightLog[] }) {
  if (logs.length < 2) {
    return (
      <div className="flex items-center justify-center h-40 text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        נדרשות לפחות 2 מדידות לגרף
      </div>
    );
  }

  const W = 340;
  const H = 140;
  const PAD = { top: 12, right: 12, bottom: 24, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const weights = logs.map((l) => l.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;

  const xOf = (i: number) => PAD.left + (i / (logs.length - 1)) * innerW;
  const yOf = (w: number) => PAD.top + ((maxW - w) / (maxW - minW)) * innerH;

  const points = logs.map((l, i) => ({ x: xOf(i), y: yOf(l.weight) }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const showEvery = Math.ceil(logs.length / 4);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis labels */}
      {[minW + 0.5, (minW + maxW) / 2, maxW - 0.5].map((w, i) => (
        <text
          key={i}
          x={PAD.left - 4}
          y={yOf(w) + 4}
          textAnchor="end"
          fontSize="8"
          fill="rgba(255,255,255,0.28)"
        >
          {w.toFixed(0)}
        </text>
      ))}

      {/* Grid lines */}
      {[minW + 0.5, (minW + maxW) / 2, maxW - 0.5].map((w, i) => (
        <line
          key={i}
          x1={PAD.left}
          y1={yOf(w)}
          x2={PAD.left + innerW}
          y2={yOf(w)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Area */}
      <path d={areaD} fill="url(#wg)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#E11D2A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#E11D2A" />
      ))}

      {/* X labels */}
      {logs.map((l, i) => {
        if (i % showEvery !== 0 && i !== logs.length - 1) return null;
        return (
          <text
            key={i}
            x={xOf(i)}
            y={H - 4}
            textAnchor="middle"
            fontSize="8"
            fill="rgba(255,255,255,0.28)"
          >
            {formatDate(l.logged_at)}
          </text>
        );
      })}
    </svg>
  );
}

export default function ClientProgressPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [addingSave, setAddingSave] = useState(false);
  const [addedOk, setAddedOk] = useState(false);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const [{ data: clientData }, { data: logsData }] = await Promise.all([
      supabase.from("clients").select("name, current_weight, goal_weight").eq("id", clientId).single(),
      supabase.from("weight_logs").select("id, weight, logged_at").eq("client_id", clientId).order("logged_at", { ascending: true }),
    ]);
    if (clientData) setClient(clientData);
    if (logsData) setLogs(logsData);
    setLoading(false);
  }, [supabase, clientId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filterDays = TIME_FILTERS[timeFilter].days;
  const cutoff = new Date(Date.now() - filterDays * 24 * 60 * 60 * 1000).toISOString();
  const filteredLogs = logs.filter((l) => l.logged_at >= cutoff);

  const latestWeight = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].weight : null;
  const firstWeight = filteredLogs.length > 0 ? filteredLogs[0].weight : null;
  const delta = latestWeight !== null && firstWeight !== null ? (latestWeight - firstWeight) : null;
  const totalChange = logs.length > 0 && client?.current_weight !== null
    ? (logs[0]?.weight ?? 0) - (latestWeight ?? 0)
    : null;

  const addLog = async () => {
    if (!newWeight || isNaN(Number(newWeight))) return;
    setAddingSave(true);
    const { error } = await supabase.from("weight_logs").insert({
      client_id: clientId,
      weight: Number(newWeight),
      logged_at: new Date(newDate).toISOString(),
    });
    if (!error) {
      await supabase.from("clients").update({ current_weight: Number(newWeight) }).eq("id", clientId);
      await fetchData();
      setAddedOk(true);
      setTimeout(() => { setAddedOk(false); setShowAddModal(false); setNewWeight(""); }, 1800);
    }
    setAddingSave(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-48 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <BackIcon className="w-4 h-4" />
          {client?.name}
        </button>

        {/* Header */}
        <div className="flex items-start justify-between rise" style={{ animationDelay: "40ms" }}>
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>התקדמות</div>
            <h1 className="mt-1 text-[24px] font-extrabold">{client?.name}</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="tap mt-1 w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "#E11D2A", boxShadow: "0 6px 18px rgba(225,29,42,0.40)" }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Weight summary */}
        <div
          className="rounded-2xl p-4 rise"
          style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-end gap-3 mb-4">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>משקל נוכחי</p>
              <p className="text-[44px] font-extrabold leading-none mt-1">
                {latestWeight ?? "—"}
                <span className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.40)" }}> ק״ג</span>
              </p>
            </div>
            {delta !== null && (
              <span
                className="mb-2 px-2.5 py-1 rounded-full text-[12px] font-semibold"
                style={{
                  background: delta < 0 ? "rgba(16,185,129,0.12)" : "rgba(249,115,22,0.12)",
                  color: delta < 0 ? "#10B981" : "#F97316",
                }}
              >
                {delta < 0 ? "" : "+"}{delta.toFixed(1)} ק״ג
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "יעד", value: client?.goal_weight ? `${client.goal_weight} ק״ג` : "—" },
              { label: "שינוי כולל", value: totalChange !== null ? `${totalChange > 0 ? "-" : "+"}${Math.abs(totalChange).toFixed(1)} ק״ג` : "—" },
              { label: "מדידות", value: logs.length },
            ].map(({ label, value }, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-[14px] font-bold leading-none">{value}</p>
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Time filter */}
          <div className="flex gap-1.5 mb-4">
            {TIME_FILTERS.map((f, i) => (
              <button
                key={i}
                onClick={() => setTimeFilter(i)}
                className="tap px-3.5 h-7 rounded-full text-[11px] font-medium"
                style={{
                  background: timeFilter === i ? "#E11D2A" : "rgba(255,255,255,0.06)",
                  color: timeFilter === i ? "#fff" : "rgba(255,255,255,0.45)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <WeightChart logs={filteredLogs} />
        </div>

        {/* Weight log table */}
        {logs.length > 0 && (
          <div
            className="rounded-2xl p-4 rise"
            style={{ animationDelay: "160ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10.5px] tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>היסטוריה</p>
            <div className="space-y-1.5">
              {[...logs].reverse().slice(0, 8).map((log, i) => {
                const prev = logs[logs.length - 2 - i];
                const diff = prev ? log.weight - prev.weight : null;
                const d = new Date(log.logged_at);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: i < Math.min(7, logs.length - 1) ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  >
                    <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}
                    </p>
                    <div className="flex items-center gap-2">
                      {diff !== null && (
                        <span className="text-[10.5px]" style={{ color: diff < 0 ? "#10B981" : "#F97316" }}>
                          {diff < 0 ? "" : "+"}{diff.toFixed(1)}
                        </span>
                      )}
                      <p className="text-[14px] font-semibold">{log.weight} ק״ג</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {logs.length === 0 && (
          <div className="flex flex-col items-center gap-2.5 py-12 text-center">
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין מדידות עדיין</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>לחץ + להוסיף מדידה ראשונה</p>
          </div>
        )}
      </div>

      {/* Add weight modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full rounded-t-3xl p-6 pb-12"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-[18px] font-bold mb-1">הוסף מדידה</h3>
            <p className="text-[12px] mb-4" style={{ color: "rgba(255,255,255,0.40)" }}>רשום משקל ותאריך</p>

            <div className="space-y-3">
              <input
                type="number"
                inputMode="decimal"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="משקל (ק״ג)"
                className="w-full h-14 rounded-2xl px-4 text-white text-[18px] font-bold outline-none"
                style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(225,29,42,0.35)", caretColor: "#E11D2A" }}
                autoFocus
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-12 rounded-2xl px-4 text-white text-[14px] outline-none"
                style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)", colorScheme: "dark" }}
              />
            </div>

            <button
              onClick={addLog}
              disabled={addingSave || !newWeight}
              className="tap mt-4 w-full h-12 rounded-full font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
            >
              {addedOk ? <><CheckIcon className="w-5 h-5" />נשמר!</> : addingSave ? "שומר..." : "שמור מדידה"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
