"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Client = {
  id: string;
  name: string;
  invite_code: string;
  current_weight: number | null;
  goal_weight: number | null;
  created_at: string;
  age: number | null;
  phone: string | null;
  email: string | null;
  height_cm: number | null;
  goal: string | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
};

type WeightLog = {
  weight: number;
  logged_at: string;
};

type EditForm = {
  age: string; phone: string; email: string; height_cm: string;
  goal_weight: string; goal: string;
  chest_cm: string; waist_cm: string; hips_cm: string; arm_cm: string; thigh_cm: string;
};

const avatarColors = ["#5B4CF5", "#0EA5E9", "#10B981", "#F97316", "#EC4899"];

function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 19l-7-7 7-7" /></svg>;
}
function WeightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11" /></svg>;
}
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 18l6-6-6-6" /></svg>;
}
function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12" /></svg>;
}
function PlateIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>;
}
function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-8" /><path d="M22 20H2" /></svg>;
}
function PenIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}

const INP_STYLE = { background: "rgba(255,255,255,0.07)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)", caretColor: "#E11D2A" } as const;
const INP_CLASS = "w-full h-11 rounded-xl px-3 text-white text-[14px] outline-none";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ age: "", phone: "", email: "", height_cm: "", goal_weight: "", goal: "", chest_cm: "", waist_cm: "", hips_cm: "", arm_cm: "", thigh_cm: "" });
  const [editSaving, setEditSaving] = useState(false);

  const supabase = createClient();

  const fetchClient = useCallback(async () => {
    const [{ data: clientData }, { data: logsData }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase.from("weight_logs").select("weight, logged_at").eq("client_id", clientId).order("logged_at", { ascending: false }).limit(10),
    ]);
    if (clientData) setClient(clientData);
    if (logsData) setWeightLogs(logsData);
    setLoading(false);
  }, [supabase, clientId]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const openEdit = () => {
    if (!client) return;
    setEditForm({
      age: client.age?.toString() ?? "",
      phone: client.phone ?? "",
      email: client.email ?? "",
      height_cm: client.height_cm?.toString() ?? "",
      goal_weight: client.goal_weight?.toString() ?? "",
      goal: client.goal ?? "",
      chest_cm: client.chest_cm?.toString() ?? "",
      waist_cm: client.waist_cm?.toString() ?? "",
      hips_cm: client.hips_cm?.toString() ?? "",
      arm_cm: client.arm_cm?.toString() ?? "",
      thigh_cm: client.thigh_cm?.toString() ?? "",
    });
    setShowEdit(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    const f = editForm;
    await supabase.from("clients").update({
      age: f.age ? parseInt(f.age) : null,
      phone: f.phone.trim() || null,
      email: f.email.trim() || null,
      height_cm: f.height_cm ? parseFloat(f.height_cm) : null,
      goal_weight: f.goal_weight ? parseFloat(f.goal_weight) : null,
      goal: f.goal.trim() || null,
      chest_cm: f.chest_cm ? parseFloat(f.chest_cm) : null,
      waist_cm: f.waist_cm ? parseFloat(f.waist_cm) : null,
      hips_cm: f.hips_cm ? parseFloat(f.hips_cm) : null,
      arm_cm: f.arm_cm ? parseFloat(f.arm_cm) : null,
      thigh_cm: f.thigh_cm ? parseFloat(f.thigh_cm) : null,
    }).eq("id", clientId);
    await fetchClient();
    setShowEdit(false);
    setEditSaving(false);
  };

  const setF = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditForm((p) => ({ ...p, [key]: e.target.value }));

  const avatarColor = avatarColors[0];
  const weightDelta = weightLogs.length >= 2
    ? (weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight).toFixed(1)
    : null;
  const daysSinceJoin = client
    ? Math.floor((Date.now() - new Date(client.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const sections = [
    { label: "תוכנית אימון", sub: "ניהול ימים ותרגילים", Icon: DumbbellIcon, href: `/clients/${clientId}/workout` },
    { label: "תפריט תזונה", sub: "ארוחות ומזונות", Icon: PlateIcon, href: `/clients/${clientId}/nutrition` },
    { label: "מעקב התקדמות", sub: "גרף משקל ומדדים", Icon: ChartIcon, href: `/clients/${clientId}/progress` },
  ];

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen font-heb flex items-center justify-center" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <p className="text-white/40">מתאמן לא נמצא</p>
      </main>
    );
  }

  const personalRows = [
    { label: "גיל", value: client.age ? `${client.age}` : null },
    { label: "גובה", value: client.height_cm ? `${client.height_cm} ס"מ` : null },
    { label: "טלפון", value: client.phone },
    { label: "אימייל", value: client.email },
    { label: "מטרה", value: client.goal },
    { label: "חזה", value: client.chest_cm ? `${client.chest_cm} ס"מ` : null },
    { label: "מותניים", value: client.waist_cm ? `${client.waist_cm} ס"מ` : null },
    { label: "ירכיים", value: client.hips_cm ? `${client.hips_cm} ס"מ` : null },
    { label: "זרוע", value: client.arm_cm ? `${client.arm_cm} ס"מ` : null },
    { label: "ירך", value: client.thigh_cm ? `${client.thigh_cm} ס"מ` : null },
  ].filter((r): r is { label: string; value: string } => r.value !== null && r.value !== undefined);

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <BackIcon className="w-4 h-4" />
          מתאמנים
        </button>

        {/* Hero card */}
        <div
          className="rounded-3xl p-5 rise"
          style={{ animationDelay: "40ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center text-[20px] font-bold flex-shrink-0"
              style={{ background: avatarColor + "22", border: `2px solid ${avatarColor}44`, color: avatarColor }}
            >
              {getInitials(client.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-extrabold leading-tight">{client.name}</h1>
              <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                קוד: {client.invite_code} · {daysSinceJoin} ימים
              </p>
            </div>
            <span
              className="text-[9.5px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
            >
              פעיל
            </span>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { Icon: WeightIcon, label: "משקל נוכחי", value: client.current_weight ? `${client.current_weight} ק״ג` : "—", color: "#E11D2A" },
              { Icon: TargetIcon, label: "יעד", value: client.goal_weight ? `${client.goal_weight} ק״ג` : "—", color: "#F97316" },
              { Icon: CalendarIcon, label: "שינוי", value: weightDelta !== null ? `${Number(weightDelta) > 0 ? "+" : ""}${weightDelta}` : "—", color: Number(weightDelta) < 0 ? "#10B981" : "#F97316" },
            ].map(({ Icon, label, value, color }, i) => (
              <div key={i} className="rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="w-7 h-7 rounded-xl grid place-items-center" style={{ background: color + "18" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <p className="text-[13px] font-bold leading-none">{value}</p>
                <p className="text-[9px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section nav */}
        <div className="space-y-2.5">
          <p className="text-[10.5px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>ניהול</p>
          {sections.map(({ label, sub, Icon, href }, i) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="tap w-full flex items-center gap-4 rounded-2xl p-4 rise"
              style={{ animationDelay: `${80 + i * 55}ms`, background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0" style={{ background: "rgba(225,29,42,0.10)" }}>
                <Icon className="w-[18px] h-[18px]" style={{ color: "#E11D2A" }} />
              </div>
              <div className="flex-1 text-right">
                <p className="font-semibold text-[14px]">{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
              </div>
              <ChevronIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
            </button>
          ))}
        </div>

        {/* Personal Details */}
        <div className="rise" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10.5px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>פרטים אישיים</p>
            <button onClick={openEdit} className="tap flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "rgba(225,29,42,0.80)" }}>
              <PenIcon className="w-3.5 h-3.5" />
              ערוך
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
            {personalRows.length === 0 ? (
              <div className="px-4 py-5 text-center">
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>לחץ ערוך להוספת פרטים</p>
              </div>
            ) : personalRows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < personalRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
              >
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>{row.label}</span>
                <span className="text-[13px] font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit modal */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowEdit(false)}
        >
          <div
            className="w-full rounded-t-3xl flex flex-col"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-5 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold">עריכת פרטים</h3>
                <button onClick={() => setShowEdit(false)} className="tap text-[13px]" style={{ color: "rgba(255,255,255,0.40)" }}>ביטול</button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-6 space-y-5 pb-4">

              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>פרטי קשר</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">גיל</p>
                    <input type="number" inputMode="numeric" value={editForm.age} onChange={setF("age")} placeholder="25" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">טלפון</p>
                    <input type="tel" inputMode="tel" value={editForm.phone} onChange={setF("phone")} placeholder="050-0000000" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div>
                  <p className="text-[10.5px] text-white/40 mb-1.5">אימייל</p>
                  <input type="email" inputMode="email" value={editForm.email} onChange={setF("email")} placeholder="israel@example.com" className={INP_CLASS} style={INP_STYLE} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>פרטים גופניים</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">גובה (ס&quot;מ)</p>
                    <input type="number" inputMode="decimal" value={editForm.height_cm} onChange={setF("height_cm")} placeholder="175" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">משקל יעד (ק&quot;ג)</p>
                    <input type="number" inputMode="decimal" value={editForm.goal_weight} onChange={setF("goal_weight")} placeholder="70" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div>
                  <p className="text-[10.5px] text-white/40 mb-1.5">מטרה</p>
                  <input type="text" value={editForm.goal} onChange={setF("goal")} placeholder="הורדת שומן, חיזוק שרירים..." className={INP_CLASS} style={INP_STYLE} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>היקפים (ס&quot;מ)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">חזה</p>
                    <input type="number" inputMode="decimal" value={editForm.chest_cm} onChange={setF("chest_cm")} placeholder="100" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">מותניים</p>
                    <input type="number" inputMode="decimal" value={editForm.waist_cm} onChange={setF("waist_cm")} placeholder="85" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">ירכיים</p>
                    <input type="number" inputMode="decimal" value={editForm.hips_cm} onChange={setF("hips_cm")} placeholder="100" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">זרוע</p>
                    <input type="number" inputMode="decimal" value={editForm.arm_cm} onChange={setF("arm_cm")} placeholder="35" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">ירך</p>
                    <input type="number" inputMode="decimal" value={editForm.thigh_cm} onChange={setF("thigh_cm")} placeholder="55" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-10 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                className="tap w-full h-12 rounded-full font-semibold text-white disabled:opacity-40"
                style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
                onClick={saveEdit}
                disabled={editSaving}
              >
                {editSaving ? "שומר..." : "שמור שינויים"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
