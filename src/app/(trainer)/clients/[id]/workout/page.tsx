"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PlanExercise = {
  exercise_id: string;
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg: number;
  youtube_url: string;
  notes: string;
  order_index: number;
};

type WorkoutDay = {
  day_number: number;
  label: string;
  exercises: PlanExercise[];
};

const EXERCISE_LIBRARY = [
  { name: "לחיצת חזה", group: "חזה" },
  { name: "לחיצת חזה בשיפוע", group: "חזה" },
  { name: "פרפר עם משקולות", group: "חזה" },
  { name: "מקבילים", group: "חזה" },
  { name: "מתח רחב", group: "גב" },
  { name: "חתירה במוט", group: "גב" },
  { name: "חתירה בכבל", group: "גב" },
  { name: "דדליפט", group: "גב" },
  { name: "לחיצת כתפיים", group: "כתפיים" },
  { name: "הרמות צד", group: "כתפיים" },
  { name: "הרמות קדמיות", group: "כתפיים" },
  { name: "כפיפות יד קדמית", group: "יד קדמית" },
  { name: "כפיפות יד קדמית בכבל", group: "יד קדמית" },
  { name: "פטיש", group: "יד קדמית" },
  { name: "פשיטות יד אחורית", group: "יד אחורית" },
  { name: "לחיצה צרה", group: "יד אחורית" },
  { name: "יד אחורית בכבל", group: "יד אחורית" },
  { name: "סקוואט", group: "רגליים" },
  { name: "לגפרס", group: "רגליים" },
  { name: "כפיפות ברכיים", group: "רגליים" },
  { name: "פשיטות רגליים", group: "רגליים" },
  { name: "מכרעים", group: "רגליים" },
  { name: "עלייה על קרש", group: "רגליים" },
  { name: "קראנץ׳", group: "בטן" },
  { name: "פלאנק", group: "בטן" },
];

const GROUPS = ["הכל", "חזה", "גב", "כתפיים", "יד קדמית", "יד אחורית", "רגליים", "בטן"];
const DAY_LABELS = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳"];

function newEx(name: string): PlanExercise {
  return { exercise_id: "", name, sets: 3, reps: 12, rest_seconds: 60, weight_kg: 0, youtube_url: "", notes: "", order_index: 0 };
}

/* ── Icons ── */
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
function YTIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.2.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>;
}

export default function ClientWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [clientName, setClientName] = useState("");
  const [numDays, setNumDays] = useState(3);
  const [activeDay, setActiveDay] = useState(0);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [groupFilter, setGroupFilter] = useState("הכל");
  const [freeText, setFreeText] = useState("");
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

  useEffect(() => {
    setDays((prev) =>
      Array.from({ length: numDays }, (_, i) => prev[i] ?? { day_number: i + 1, label: DAY_LABELS[i], exercises: [] })
    );
    if (activeDay >= numDays) setActiveDay(0);
  }, [numDays]);

  const currentDay = days[activeDay];

  /* ── helpers ── */
  const addExercise = (name: string) => {
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: [...d.exercises, newEx(name)] } : d));
    setShowPicker(false);
    setFreeText("");
  };

  const removeExercise = (ei: number) =>
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: d.exercises.filter((_, j) => j !== ei) } : d));

  const updateField = (ei: number, field: keyof PlanExercise, value: string | number) =>
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: d.exercises.map((e, j) => j === ei ? { ...e, [field]: value } : e) } : d));

  const spin = (ei: number, field: "sets" | "reps" | "rest_seconds" | "weight_kg", dir: 1 | -1) => {
    const step = field === "rest_seconds" ? 15 : field === "weight_kg" ? 2.5 : 1;
    const min = field === "weight_kg" || field === "rest_seconds" ? 0 : 1;
    const cur = (currentDay?.exercises[ei]?.[field] as number) ?? 0;
    updateField(ei, field, Math.max(min, parseFloat((cur + dir * step).toFixed(1))));
  };

  /* ── save ── */
  const saveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: plan } = await supabase
        .from("workout_plans")
        .upsert({ coach_id: user.id, name: `תוכנית ${clientName}`, days_per_week: numDays })
        .select().single();
      if (!plan) throw new Error();

      await supabase.from("workout_days").delete().eq("plan_id", plan.id);

      for (const day of days) {
        if (day.exercises.length === 0) continue;
        const { data: dayRow } = await supabase
          .from("workout_days")
          .insert({ plan_id: plan.id, day_number: day.day_number, label: day.label })
          .select().single();
        if (!dayRow) continue;
        await supabase.from("plan_exercises").insert(
          day.exercises.map((e, idx) => ({
            day_id: dayRow.id,
            exercise_id: null,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            rest_seconds: e.rest_seconds,
            weight_kg: e.weight_kg || null,
            youtube_url: e.youtube_url || null,
            notes: e.notes || null,
            order_index: idx,
          }))
        );
      }

      await supabase.from("client_plans").upsert({ client_id: clientId, plan_id: plan.id, active: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const library = groupFilter === "הכל" ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter((e) => e.group === groupFilter);

  /* ── render ── */
  return (
    <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.back()} className="tap flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />{clientName}
        </button>

        {/* Header */}
        <div>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תוכנית אימון</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
        </div>

        {/* Days selector */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>ימי אימון בשבוע</p>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button key={n} onClick={() => setNumDays(n)}
                className="tap flex-1 h-9 rounded-xl text-[13px] font-semibold"
                style={{ background: numDays === n ? "#E11D2A" : "rgba(255,255,255,0.05)", color: numDays === n ? "#fff" : "rgba(255,255,255,0.45)", boxShadow: numDays === n ? "0 4px 14px rgba(225,29,42,0.35)" : "none" }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {days.map((day, i) => (
            <button key={i} onClick={() => setActiveDay(i)}
              className="tap flex-shrink-0 px-3.5 h-9 rounded-full text-[12px] font-medium"
              style={{ background: activeDay === i ? "#E11D2A" : "rgba(255,255,255,0.06)", color: activeDay === i ? "#fff" : "rgba(255,255,255,0.45)", boxShadow: activeDay === i ? "0 4px 14px rgba(225,29,42,0.35)" : "none" }}>
              {day.label}
            </button>
          ))}
        </div>

        {/* Exercise cards */}
        {currentDay && (
          <div className="space-y-3">
            {currentDay.exercises.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)" }}>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין תרגילים ב{currentDay.label}</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>לחץ + להוסיף</p>
              </div>
            ) : currentDay.exercises.map((ex, ei) => (
              <div key={ei} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>

                {/* Title row */}
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[15px]">{ex.name}</p>
                  <button onClick={() => removeExercise(ei)} className="tap w-7 h-7 rounded-lg grid place-items-center" style={{ background: "rgba(225,29,42,0.10)" }}>
                    <TrashIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
                  </button>
                </div>

                {/* 2×2 spinners */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {([
                    { label: "משקל (ק״ג)", field: "weight_kg" as const, accent: true },
                    { label: "סטים", field: "sets" as const, accent: false },
                    { label: "חזרות", field: "reps" as const, accent: false },
                    { label: "מנוחה (שנ׳)", field: "rest_seconds" as const, accent: false },
                  ] as const).map(({ label, field, accent }) => (
                    <div key={field} className="flex flex-col items-center gap-1.5 rounded-xl p-2.5"
                      style={{ background: accent ? "rgba(225,29,42,0.07)" : "rgba(255,255,255,0.05)", boxShadow: accent ? "inset 0 0 0 1px rgba(225,29,42,0.18)" : "none" }}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => spin(ei, field, -1)} className="tap w-7 h-7 rounded-lg text-[18px] font-bold grid place-items-center" style={{ background: "rgba(255,255,255,0.07)" }}>−</button>
                        <span className="text-[16px] font-bold w-9 text-center">{ex[field] ?? 0}</span>
                        <button onClick={() => spin(ei, field, 1)} className="tap w-7 h-7 rounded-lg text-[18px] font-bold grid place-items-center" style={{ background: "rgba(255,255,255,0.07)" }}>+</button>
                      </div>
                      <p className="text-[9.5px]" style={{ color: accent ? "rgba(225,29,42,0.80)" : "rgba(255,255,255,0.35)" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* YouTube URL */}
                <div className="flex items-center gap-2 rounded-xl px-3 h-10 mb-2" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
                  <YTIcon className="w-4 h-4 flex-shrink-0" style={{ color: ex.youtube_url ? "#FF0000" : "rgba(255,255,255,0.20)" }} />
                  <input
                    type="url"
                    value={ex.youtube_url}
                    onChange={(e) => updateField(ei, "youtube_url", e.target.value)}
                    placeholder="קישור YouTube (אופציונלי)"
                    dir="ltr"
                    className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-white/25"
                    style={{ color: "#FAF9F6" }}
                  />
                </div>

                {/* Notes */}
                <textarea
                  value={ex.notes}
                  onChange={(e) => updateField(ei, "notes", e.target.value)}
                  placeholder="הערות: סופר סט, ירידת משקלים, טכניקה..."
                  rows={2}
                  className="w-full rounded-xl px-3 py-2.5 text-[12px] bg-transparent outline-none resize-none placeholder:text-white/25"
                  style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)", color: "#FAF9F6" }}
                />
              </div>
            ))}

            {/* Add exercise button */}
            <button onClick={() => setShowPicker(true)}
              className="tap w-full rounded-2xl p-4 flex items-center justify-center gap-2.5"
              style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.08)" }}>
              <div className="w-7 h-7 rounded-full grid place-items-center" style={{ background: "rgba(225,29,42,0.12)" }}>
                <PlusIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
              </div>
              <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>הוסף תרגיל</span>
            </button>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4" style={{ background: "linear-gradient(to top, #0B0A08 70%, transparent)" }}>
        <button onClick={saveAll} disabled={saving}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "#E11D2A", boxShadow: "0 10px 28px rgba(225,29,42,0.40)" }}>
          {saved ? <><CheckIcon className="w-5 h-5" />נשמר!</> : saving ? "שומר..." : "שמור תוכנית"}
        </button>
      </div>

      {/* Exercise picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }} onClick={() => setShowPicker(false)}>
          <div className="w-full rounded-t-3xl pb-10" style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>

            <div className="px-5 pt-5 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <h3 className="text-[17px] font-bold mb-3">הוסף תרגיל</h3>

              {/* Free text input */}
              <div className="flex gap-2 mb-3">
                <input
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && freeText.trim() && addExercise(freeText.trim())}
                  placeholder="כתוב שם תרגיל חופשי..."
                  className="flex-1 h-11 rounded-2xl px-4 text-[13px] outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(225,29,42,0.35)", caretColor: "#E11D2A", color: "#FAF9F6" }}
                />
                <button
                  onClick={() => freeText.trim() && addExercise(freeText.trim())}
                  disabled={!freeText.trim()}
                  className="tap w-11 h-11 rounded-2xl grid place-items-center disabled:opacity-40"
                  style={{ background: "#E11D2A" }}>
                  <PlusIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Group filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {GROUPS.map((g) => (
                  <button key={g} onClick={() => setGroupFilter(g)}
                    className="tap flex-shrink-0 px-3 h-7 rounded-full text-[11px] font-medium"
                    style={{ background: groupFilter === g ? "#E11D2A" : "rgba(255,255,255,0.07)", color: groupFilter === g ? "#fff" : "rgba(255,255,255,0.50)" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Library list */}
            <div className="overflow-y-auto px-5 space-y-2">
              {library.map((ex) => {
                const already = currentDay?.exercises.some((e) => e.name === ex.name);
                return (
                  <button key={ex.name} onClick={() => !already && addExercise(ex.name)} disabled={already}
                    className="tap w-full flex items-center justify-between rounded-2xl p-3.5"
                    style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)", opacity: already ? 0.4 : 1 }}>
                    <div className="text-right">
                      <p className="font-medium text-[13.5px]">{ex.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{ex.group}</p>
                    </div>
                    {already
                      ? <CheckIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
                      : <PlusIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.30)" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
