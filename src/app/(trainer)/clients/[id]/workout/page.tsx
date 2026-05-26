"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PlanExercise = {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  weight_kg: number;
  youtube_url: string;
  notes: string;
  order_index: number;
};

type WorkoutDay = {
  day_number: number;
  label: string;
  scheduled_dow: number | null;
  exercises: PlanExercise[];
};

const DOW_SHORT = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const DOW_FULL  = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

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
  return { exercise_id: "", name, sets: 3, reps: "12", rest_seconds: 60, weight_kg: 0, youtube_url: "", notes: "", order_index: 0 };
}

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

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
  return m?.[1] ?? null;
}

export default function ClientWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [clientName, setClientName] = useState("");
  const [numDays, setNumDays] = useState(3);
  const [durationWeeks, setDurationWeeks] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [groupFilter, setGroupFilter] = useState("הכל");
  const [freeText, setFreeText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loadError, setLoadError] = useState("");
  const numDaysChangedByUser = useRef(false);
  const existingPlanHadDays = useRef(false);

  const supabase = createClient();

  // Load existing data on mount
  useEffect(() => {
    const init = async () => {
      const { data: clientData } = await supabase.from("clients").select("name").eq("id", clientId).single();
      if (clientData) setClientName(clientData.name);

      const { data: cpRows } = await supabase
        .from("client_plans")
        .select("plan_id")
        .eq("client_id", clientId)
        .eq("active", true)
        .order("id", { ascending: false })
        .limit(1);
      const cp = cpRows?.[0] ?? null;

      if (cp?.plan_id) {
        setPlanId(cp.plan_id);

        const { data: planData } = await supabase
          .from("workout_plans")
          .select("days_per_week, duration_weeks")
          .eq("id", cp.plan_id)
          .single();

        if (planData) {
          const n = planData.days_per_week;
          setDurationWeeks(planData.duration_weeks ?? null);
          setNumDays(n);

          const { data: wdays, error: wdaysError } = await supabase
            .from("workout_days")
            .select("id, day_number, label, scheduled_dow")
            .eq("plan_id", cp.plan_id)
            .order("day_number");

          if (wdaysError) {
            setLoadError("שגיאה בטעינת תוכנית האימון. נסה לרענן את הדף.");
            setLoading(false);
            return;
          }
          if (wdays && wdays.length > 0) {
            existingPlanHadDays.current = true;
          }

          const loadedDays: WorkoutDay[] = await Promise.all(
            Array.from({ length: n }, async (_, i) => {
              const dayRow = wdays?.find((d) => d.day_number === i + 1);
              if (!dayRow) return { day_number: i + 1, label: DAY_LABELS[i], scheduled_dow: null, exercises: [] };
              const { data: exs } = await supabase
                .from("plan_exercises")
                .select("exercise_id, name, sets, reps, rest_seconds, weight_kg, youtube_url, notes, order_index")
                .eq("day_id", dayRow.id)
                .order("order_index");
              return {
                day_number: dayRow.day_number,
                label: dayRow.label,
                scheduled_dow: dayRow.scheduled_dow ?? null,
                exercises: (exs ?? []).map((e) => ({
                  exercise_id: e.exercise_id ?? "",
                  name: e.name ?? "",
                  sets: e.sets ?? 3,
                  reps: String(e.reps ?? "12"),
                  rest_seconds: e.rest_seconds ?? 60,
                  weight_kg: e.weight_kg ?? 0,
                  youtube_url: e.youtube_url ?? "",
                  notes: e.notes ?? "",
                  order_index: e.order_index ?? 0,
                })),
              };
            })
          );
          setDays(loadedDays);
        }
      } else {
        // No existing plan — initialize empty days
        setDays(Array.from({ length: 3 }, (_, i) => ({ day_number: i + 1, label: DAY_LABELS[i], scheduled_dow: null, exercises: [] })));
      }

      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Resize days array when user manually changes numDays
  useEffect(() => {
    if (loading) return;
    if (!numDaysChangedByUser.current) { numDaysChangedByUser.current = true; return; }
    setDays((prev) =>
      Array.from({ length: numDays }, (_, i) => prev[i] ?? { day_number: i + 1, label: DAY_LABELS[i], scheduled_dow: null, exercises: [] })
    );
    if (activeDay >= numDays) setActiveDay(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  const currentDay = days[activeDay];

  const addExercise = (name: string) => {
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: [...d.exercises, newEx(name)] } : d));
    setShowPicker(false);
    setFreeText("");
  };

  const removeExercise = (ei: number) =>
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: d.exercises.filter((_, j) => j !== ei) } : d));

  const updateField = (ei: number, field: keyof PlanExercise, value: string | number) =>
    setDays((prev) => prev.map((d, i) => i === activeDay ? { ...d, exercises: d.exercises.map((e, j) => j === ei ? { ...e, [field]: value } : e) } : d));

  const spin = (ei: number, field: "sets" | "rest_seconds" | "weight_kg", dir: 1 | -1) => {
    const step = field === "rest_seconds" ? 15 : field === "weight_kg" ? 2.5 : 1;
    const min = field === "weight_kg" || field === "rest_seconds" ? 0 : 1;
    const cur = (currentDay?.exercises[ei]?.[field] as number) ?? 0;
    updateField(ei, field, Math.max(min, parseFloat((cur + dir * step).toFixed(1))));
  };

  const spinReps = (ei: number, dir: 1 | -1) => {
    const cur = String(currentDay?.exercises[ei]?.reps ?? "12");
    const range = cur.match(/^(\d+)-(\d+)$/);
    if (range) {
      const lo = Math.max(1, parseInt(range[1]) + dir);
      const hi = Math.max(lo + 1, parseInt(range[2]) + dir);
      updateField(ei, "reps", `${lo}-${hi}`);
    } else {
      const n = Math.max(1, parseInt(cur || "12") + dir);
      updateField(ei, "reps", String(n));
    }
  };

  const pickDow = (dayIdx: number, dow: number | null) => {
    setDays((prev) => prev.map((d, i) => i === dayIdx
      ? { ...d, scheduled_dow: dow, label: dow !== null ? DOW_FULL[dow] : DAY_LABELS[i] }
      : d
    ));
  };

  const saveAll = async () => {
    const hasAnyExercises = days.some((d) => d.exercises.length > 0);
    if (!hasAnyExercises && existingPlanHadDays.current) {
      alert("לא ניתן לשמור תוכנית ריקה. הוסף לפחות תרגיל אחד לפני השמירה.");
      return;
    }
    setSaving(true);
    setSaveError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("לא מחובר");

      let currentPlanId = planId;

      if (currentPlanId) {
        // Update existing plan — delete all days (cascade deletes exercises) then re-insert
        await supabase.from("workout_plans").update({ days_per_week: numDays, duration_weeks: durationWeeks }).eq("id", currentPlanId);
        await supabase.from("workout_days").delete().eq("plan_id", currentPlanId);
      } else {
        // Create new plan
        const { data: newPlan, error: planErr } = await supabase
          .from("workout_plans")
          .insert({ coach_id: user.id, name: `תוכנית ${clientName}`, days_per_week: numDays, duration_weeks: durationWeeks })
          .select()
          .single();
        if (planErr || !newPlan) throw new Error(planErr?.message ?? "שגיאה ביצירת תוכנית");
        currentPlanId = newPlan.id;
        setPlanId(currentPlanId);
        // מחק קשרים ישנים לפני יצירת חדש
        await supabase.from("client_plans").delete().eq("client_id", clientId);
        await supabase.from("client_plans").insert({ client_id: clientId, plan_id: currentPlanId, active: true });
      }

      // Insert days + exercises
      for (const day of days) {
        if (day.exercises.length === 0) continue;
        const { data: dayRow, error: dayErr } = await supabase
          .from("workout_days")
          .insert({ plan_id: currentPlanId, day_number: day.day_number, label: day.label, scheduled_dow: day.scheduled_dow ?? null })
          .select()
          .single();
        if (dayErr || !dayRow) throw new Error(dayErr?.message ?? "שגיאה ביצירת יום");
        const { error: exErr } = await supabase.from("plan_exercises").insert(
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
        if (exErr) throw new Error(exErr.message);
      }

      setSaved(true);
      setTimeout(() => router.push(`/clients/${clientId}/workout/view`), 1000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 4000);
    }
    setSaving(false);
  };

  const library = groupFilter === "הכל" ? EXERCISE_LIBRARY : EXERCISE_LIBRARY.filter((e) => e.group === groupFilter);

  if (loadError) {
    return (
      <main className="min-h-screen font-heb flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <p className="text-[14px]" style={{ color: "#FF8A95" }}>{loadError}</p>
        <button onClick={() => window.location.reload()} className="tap px-5 h-10 rounded-full text-[13px] font-medium text-white" style={{ background: "#E11D2A" }}>
          רענן דף
        </button>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-5 w-24 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-8 w-40 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        <button onClick={() => router.back()} className="tap flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />{clientName}
        </button>

        <div>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תוכנית אימון</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
          {planId && <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>תוכנית קיימת — עריכה תדרוס</p>}
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

        {/* Duration selector */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>משך התוכנית</p>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {([null, 4, 6, 8, 12, 16] as (number | null)[]).map((w) => (
              <button key={w ?? "inf"} onClick={() => setDurationWeeks(w)}
                className="tap flex-shrink-0 px-3.5 h-9 rounded-xl text-[12.5px] font-semibold"
                style={{ background: durationWeeks === w ? "#E11D2A" : "rgba(255,255,255,0.05)", color: durationWeeks === w ? "#fff" : "rgba(255,255,255,0.45)", boxShadow: durationWeeks === w ? "0 4px 14px rgba(225,29,42,0.35)" : "none" }}>
                {w ? `${w} שב׳` : "ללא הגבלה"}
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

        {/* DOW scheduler for current day */}
        {currentDay && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
            <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>יום בשבוע — {currentDay.label}</p>
            <div className="flex gap-1.5">
              {DOW_SHORT.map((name, dow) => (
                <button key={dow} onClick={() => pickDow(activeDay, currentDay.scheduled_dow === dow ? null : dow)}
                  className="tap flex-1 h-9 rounded-xl text-[12px] font-semibold"
                  style={{
                    background: currentDay.scheduled_dow === dow ? "#E11D2A" : "rgba(255,255,255,0.05)",
                    color: currentDay.scheduled_dow === dow ? "#fff" : "rgba(255,255,255,0.45)",
                    boxShadow: currentDay.scheduled_dow === dow ? "0 4px 14px rgba(225,29,42,0.35)" : "none",
                  }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

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

                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[15px]">{ex.name}</p>
                  <button onClick={() => removeExercise(ei)} className="tap w-7 h-7 rounded-lg grid place-items-center" style={{ background: "rgba(225,29,42,0.10)" }}>
                    <TrashIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  {([
                    { label: "משקל", unit: "ק״ג", field: "weight_kg" as const },
                    { label: "סטים",  unit: "",    field: "sets"       as const },
                    { label: "מנוחה", unit: "שנ׳", field: "rest_seconds" as const },
                  ] as const).map(({ label, unit, field }) => (
                    <div key={field} className="rounded-2xl p-3"
                      style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}>
                      <p className="text-[10px] text-center mb-2.5" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
                      <div className="flex items-center justify-between gap-1">
                        <button onClick={() => spin(ei, field, -1)}
                          className="tap w-9 h-9 rounded-xl text-[22px] font-bold grid place-items-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.08)" }}>−</button>
                        <div className="flex items-baseline justify-center gap-0.5 flex-1">
                          <span className="text-[28px] font-extrabold leading-none nums">{ex[field] ?? 0}</span>
                          {unit && <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>{unit}</span>}
                        </div>
                        <button onClick={() => spin(ei, field, 1)}
                          className="tap w-9 h-9 rounded-xl text-[22px] font-bold grid place-items-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.08)" }}>+</button>
                      </div>
                    </div>
                  ))}

                  {/* Reps tile — accepts "12" or "8-12" */}
                  <div className="rounded-2xl p-3"
                    style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}>
                    <p className="text-[10px] text-center mb-2.5" style={{ color: "rgba(255,255,255,0.38)" }}>חזרות</p>
                    <div className="flex items-center justify-between gap-1">
                      <button onClick={() => spinReps(ei, -1)}
                        className="tap w-9 h-9 rounded-xl text-[22px] font-bold grid place-items-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)" }}>−</button>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => updateField(ei, "reps", e.target.value)}
                        className="flex-1 text-center text-[24px] font-extrabold leading-none nums bg-transparent outline-none min-w-0"
                        style={{ color: "#FAF9F6" }}
                        inputMode="text"
                      />
                      <button onClick={() => spinReps(ei, 1)}
                        className="tap w-9 h-9 rounded-xl text-[22px] font-bold grid place-items-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)" }}>+</button>
                    </div>
                    <p className="text-[9px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.22)" }}>12 או 8-12</p>
                  </div>
                </div>

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
                  {ex.youtube_url && !extractYouTubeId(ex.youtube_url) && (
                    <span className="text-[10px] flex-shrink-0" style={{ color: "#F97316" }}>קישור לא תקין</span>
                  )}
                </div>
                {extractYouTubeId(ex.youtube_url) && (
                  <div className="relative rounded-xl overflow-hidden mb-2" style={{ aspectRatio: "16/9" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(ex.youtube_url)}/mqdefault.jpg`}
                      alt="תצוגה מקדימה"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
                      <div className="w-12 h-12 rounded-full grid place-items-center" style={{ background: "rgba(200,0,0,0.85)" }}>
                        <YTIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.60)", color: "rgba(255,255,255,0.70)" }}>
                      תצוגה מקדימה
                    </div>
                  </div>
                )}

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
        {saveError && (
          <p className="text-center text-[12px] mb-2" style={{ color: "#F97316" }}>שגיאה בשמירה — בדוק חיבור ונסה שוב</p>
        )}
        <button onClick={saveAll} disabled={saving}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: saveError ? "#F97316" : "#E11D2A", boxShadow: `0 10px 28px rgba(225,29,42,0.40)` }}>
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
