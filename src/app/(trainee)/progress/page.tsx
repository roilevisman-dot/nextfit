"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type WeightEntry = { date: string; weight: number; logged_at: string };
type ClientData = {
  current_weight: number | null;
  goal_weight: number | null;
  height_cm: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  hips_cm: number | null;
};

function PlusIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14" /></svg>;
}

const TABS = ["שבוע", "חודש", "3 חודשים"];
const DAYS = [7, 30, 90];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

export default function ProgressPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [allLogs, setAllLogs] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const clientId = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!clientId) { setLoading(false); return; }

    const [{ data: cd }, { data: wlogs }] = await Promise.all([
      supabase.from("clients")
        .select("current_weight, goal_weight, height_cm, waist_cm, chest_cm, arm_cm, thigh_cm, hips_cm")
        .eq("id", clientId).single(),
      supabase.from("weight_logs")
        .select("weight, logged_at")
        .eq("client_id", clientId)
        .order("logged_at", { ascending: false })
        .limit(90),
    ]);

    if (cd) setClientData(cd);
    if (wlogs) {
      setAllLogs(wlogs.map((l) => ({
        date: formatDate(l.logged_at),
        weight: l.weight,
        logged_at: l.logged_at,
      })));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveWeight = async () => {
    const val = parseFloat(newWeight);
    if (!val || val < 20 || val > 300) return;
    const clientId = localStorage.getItem("nextfit_client_id");
    if (!clientId) return;
    setSaving(true);
    await supabase.from("weight_logs").insert({ client_id: clientId, weight: val, logged_at: new Date().toISOString() });
    await supabase.from("clients").update({ current_weight: val }).eq("id", clientId);
    setNewWeight("");
    setShowModal(false);
    setSaving(false);
    fetchData();
  };

  // ─── Derived ───
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS[activeTab]);
  const filteredLogs = allLogs.filter((l) => new Date(l.logged_at) >= cutoff).reverse();

  const latest = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].weight
    : (clientData?.current_weight ?? null);
  const first = filteredLogs.length > 1 ? filteredLogs[0].weight : null;
  const diff = first !== null && latest !== null ? (latest - first) : null;
  const isLoss = diff !== null && diff < 0;

  const bmi = clientData?.current_weight && clientData?.height_cm
    ? (clientData.current_weight / Math.pow(clientData.height_cm / 100, 2)).toFixed(1)
    : null;

  const metrics = [
    clientData?.height_cm ? { label: "גובה (ס״מ)", value: String(clientData.height_cm) } : null,
    bmi ? { label: "BMI", value: bmi } : null,
    clientData?.waist_cm ? { label: "מותן (ס״מ)", value: String(clientData.waist_cm) } : null,
    clientData?.chest_cm ? { label: "חזה (ס״מ)", value: String(clientData.chest_cm) } : null,
    clientData?.hips_cm ? { label: "ירכיים (ס״מ)", value: String(clientData.hips_cm) } : null,
    clientData?.arm_cm ? { label: "זרוע (ס״מ)", value: String(clientData.arm_cm) } : null,
    clientData?.thigh_cm ? { label: "ירך (ס״מ)", value: String(clientData.thigh_cm) } : null,
    clientData?.goal_weight ? { label: "יעד (ק״ג)", value: String(clientData.goal_weight) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Chart
  const chartW = 300, chartH = 90;
  const weights = filteredLogs.map((l) => l.weight);
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 1;
  const range = maxW - minW || 1;
  const points = filteredLogs.map((entry, i) => ({
    x: filteredLogs.length > 1 ? (i / (filteredLogs.length - 1)) * chartW : chartW / 2,
    y: chartH - ((entry.weight - minW) / range) * (chartH - 20) - 10,
    ...entry,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-[58px] space-y-4">
          <div className="h-8 w-40 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-10 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-52 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">מעקב</div>
            <h1 className="mt-1 text-[26px] font-extrabold leading-tight">ההתקדמות שלך</h1>
            {allLogs.length > 0 && (
              <p className="text-[11.5px] text-white/40 mt-0.5">{allLogs.length} שקילות מוקלטות</p>
            )}
          </div>
          <button onClick={() => setShowModal(true)}
            className="tap mt-1 w-9 h-9 rounded-full grid place-items-center flex-shrink-0"
            style={{ background: "#E11D2A", boxShadow: "0 6px 18px rgba(225,29,42,0.40)" }}>
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-full rise" style={{ animationDelay: "40ms", background: "rgba(255,255,255,0.05)" }}>
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className="tap flex-1 py-1.5 rounded-full text-[12px] font-medium transition-all"
              style={{
                background: activeTab === i ? "#E11D2A" : "transparent",
                color: activeTab === i ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: activeTab === i ? "0 4px 12px rgba(225,29,42,0.35)" : "none",
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Weight card */}
        <div className="rounded-3xl p-5 rise" style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <div className="mb-4">
            <p className="text-[10.5px] text-white/40 mb-0.5">משקל נוכחי</p>
            <div className="flex items-end gap-2">
              <p className="text-[48px] font-extrabold leading-none tracking-tight">
                {latest ?? "—"}
              </p>
              {latest && <p className="text-[16px] text-white/40 pb-2">ק״ג</p>}
              {diff !== null && (
                <div className="mb-2 mr-auto px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{
                    background: isLoss ? "rgba(16,185,129,0.12)" : "rgba(225,29,42,0.12)",
                    color: isLoss ? "#10B981" : "#E11D2A",
                  }}>
                  {isLoss ? "" : "+"}{diff.toFixed(1)} ק״ג
                </div>
              )}
            </div>
          </div>

          {points.length > 1 ? (
            <>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ height: 100 }}>
                <defs>
                  <linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((t, i) => (
                  <line key={i} x1="0" y1={chartH * t} x2={chartW} y2={chartH * t}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                <path d={`${pathD} L ${chartW} ${chartH} L 0 ${chartH} Z`} fill="url(#redArea)" />
                <path d={pathD} fill="none" stroke="#E11D2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 2.5}
                    fill="#E11D2A"
                    stroke={i === points.length - 1 ? "rgba(225,29,42,0.3)" : "none"}
                    strokeWidth="4" />
                ))}
              </svg>
              <div className="flex justify-between mt-1">
                {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((p, i) => (
                  <span key={i} className="text-[8.5px] text-white/30">{p.date}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>
                {latest ? "הוסף שקילה נוספת לראות גרף" : "לחץ + להוסיף שקילה ראשונה"}
              </p>
            </div>
          )}
        </div>

        {/* Body metrics */}
        {metrics.length > 0 && (
          <div className={`grid gap-2 rise`} style={{
            animationDelay: "130ms",
            gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)`,
          }}>
            {metrics.map((m, i) => (
              <div key={i} className="rounded-2xl p-3 text-center"
                style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
                <p className="text-[15px] font-extrabold leading-none">{m.value}</p>
                <p className="text-[8.5px] text-white/35 mt-1 leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Weight log */}
        {allLogs.length > 0 && (
          <div className="rounded-2xl overflow-hidden rise" style={{ animationDelay: "170ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
            <p className="px-4 py-3.5 text-[12.5px] font-semibold">שקילות אחרונות</p>
            {allLogs.slice(0, 10).map((entry, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[11.5px] text-white/40">{entry.date}</span>
                <span className="text-[13px] font-semibold">{entry.weight} ק״ג</span>
              </div>
            ))}
          </div>
        )}

        {metrics.length === 0 && allLogs.length === 0 && !loading && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>המאמן שלך טרם הזין מדדים</p>
          </div>
        )}
      </div>

      {/* Add weight modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowModal(false)}>
          <div className="w-full rounded-t-3xl p-6 pb-12 font-heb"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-[18px] font-bold mb-1">הוספת שקילה</h3>
            <p className="text-[12px] text-white/40 mb-4">הזן את המשקל הנוכחי שלך</p>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder={latest ? String(latest) : "70.0"}
              inputMode="decimal"
              className="w-full h-16 rounded-2xl text-white text-center text-[28px] font-bold outline-none"
              style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(225,29,42,0.40)", caretColor: "#E11D2A" }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveWeight()}
            />
            <button
              className="tap mt-4 w-full h-12 rounded-full font-semibold text-white disabled:opacity-50"
              style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
              disabled={saving || !newWeight}
              onClick={saveWeight}>
              {saving ? "שומר..." : "שמור שקילה"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
