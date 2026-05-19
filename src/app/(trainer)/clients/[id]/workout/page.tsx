"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
};

type PlanExercise = {
  id?: string;
  exercise_id: string;
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg: number;
  order_index: number;
};

type WorkoutDay = {
  day_number: number;
  label: string;
  exercises: PlanExercise[];
};

const EXERCISE_LIBRARY: Exercise[] = [
  { id: "ex1", name: "לחיצת חזה", muscle_group: "חזה" },
  { id: "ex2", name: "פשיטת ידיים בכבלים", muscle_group: "חזה" },
  { id: "ex3", name: "משיכת מוט", muscle_group: "גב" },
  { id: "ex4", name: "חתירה בכבל", muscle_group: "גב" },
  { id: "ex5", name: "לחיצת כתפיים", muscle_group: "כתפיים" },
  { id: "ex6", name: "הרמות צד", muscle_group: "כתפיים" },
  { id: "ex7", name: "כפיפות מרפק", muscle_group: "בייספס" },
  { id: "ex8", name: "פשיטת מרפק", muscle_group: "טריספס" },
  { id: "ex9", name: "סקוואט", muscle_group: "רגליים" },
  { id: "ex10", name: "לגפרס", muscle_group: "רגליים" },
  { id: "ex11", name: "ראמן", muscle_group: "רגליים" },
  { id: "ex12", name: "כפיות", muscle_group: "רגליים" },
  { id: "ex13", name: "מתח", muscle_group: "גב" },
  { id: "ex14", name: "לחיצת חזה משופע", muscle_group: "חזה" },
  { id: "ex15", name: "מקבילים", muscle_group: "חזה" },
  { id: "ex16", name: "בטן — קראנצ׳", muscle_group: "בטן" },
  { id: "ex17", name: "פלאנק", muscle_group: "בטן" },
  { id: "ex18", name: "דדליפט", muscle_group: "גב" },
];

const DAY_LABELS = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳"];
const MUSCLE_GROUPS = ["הכל", "חזה", "גב", "כתפיים", "בייספס", "טריספס", "רגליים", "בטן"];

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

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
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

export default function ClientWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [clientName, setClientName] = useState("");
  const [numDays, setNumDays] = useState(3);
  const [activeDay, setActiveDay] = useState(0);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState("הכל");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: clientData } = await supabase.from("clients").select("name").eq("id", clientId).single();
      if (clientData) setClientName(clientData.name);
    };
    init();
  }, [supabase, clientId]);

  useEffect(() => {
    const built: WorkoutDay[] = Array.from({ length: numDays }, (_, i) => {
      const existing = days.find((d) => d.day_number === i + 1);
      return existing ?? { day_number: i + 1, label: DAY_LABELS[i], exercises: [] };
    });
    setDays(built);
    if (activeDay >= numDays) setActiveDay(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  const currentDay = days[activeDay];

  const addExercise = (ex: Exercise) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDay
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                { exercise_id: ex.id, name: ex.name, sets: 3, reps: 12, rest_seconds: 60, weight_kg: 0, order_index: d.exercises.length },
              ],
            }
          : d
      )
    );
    setShowPicker(false);
  };

  const removeExercise = (exIdx: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDay ? { ...d, exercises: d.exercises.filter((_, ei) => ei !== exIdx) } : d
      )
    );
  };

  const updateExercise = (exIdx: number, field: "sets" | "reps" | "rest_seconds" | "weight_kg", value: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDay
          ? { ...d, exercises: d.exercises.map((e, ei) => (ei === exIdx ? { ...e, [field]: value } : e)) }
          : d
      )
    );
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert workout plan
      const { data: plan, error: planError } = await supabase
        .from("workout_plans")
        .upsert({ coach_id: user.id, name: `תוכנית ${clientName}`, days_per_week: numDays })
        .select()
        .single();
      if (planError || !plan) throw planError;

      // Delete old days and re-insert
      await supabase.from("workout_days").delete().eq("plan_id", plan.id);

      for (const day of days) {
        if (day.exercises.length === 0) continue;
        const { data: dayRow } = await supabase
          .from("workout_days")
          .insert({ plan_id: plan.id, day_number: day.day_number, label: day.label })
          .select()
          .single();
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
            order_index: idx,
          }))
        );
      }

      // Assign plan to client
      await supabase.from("client_plans").upsert({ client_id: clientId, plan_id: plan.id, active: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      /* ignore */
    }
    setSaving(false);
  };

  const filteredLibrary = muscleFilter === "הכל"
    ? EXERCISE_LIBRARY
    : EXERCISE_LIBRARY.filter((e) => e.muscle_group === muscleFilter);

  return (
    <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <BackIcon className="w-4 h-4" />
          {clientName}
        </button>

        {/* Header */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תוכנית אימון</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
        </div>

        {/* Days per week selector */}
        <div
          className="rounded-2xl p-4 rise"
          style={{ animationDelay: "80ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.50)" }}>מספר ימי אימון בשבוע</p>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setNumDays(n)}
                className="tap flex-1 h-9 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  background: numDays === n ? "#E11D2A" : "rgba(255,255,255,0.05)",
                  color: numDays === n ? "#fff" : "rgba(255,255,255,0.45)",
                  boxShadow: numDays === n ? "0 4px 14px rgba(225,29,42,0.35)" : "none",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 rise" style={{ animationDelay: "120ms" }}>
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className="tap flex-shrink-0 px-3.5 h-9 rounded-full text-[12px] font-medium transition-all"
              style={{
                background: activeDay === i ? "#E11D2A" : "rgba(255,255,255,0.06)",
                color: activeDay === i ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: activeDay === i ? "0 4px 14px rgba(225,29,42,0.35)" : "none",
              }}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Exercises for active day */}
        {currentDay && (
          <div className="space-y-2.5 rise" style={{ animationDelay: "160ms" }}>
            {currentDay.exercises.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 py-10 text-center rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)" }}>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין תרגילים ב{currentDay.label}</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>לחץ + להוסיף תרגיל</p>
              </div>
            ) : (
              currentDay.exercises.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-[14px]">{ex.name}</p>
                    <button
                      onClick={() => removeExercise(exIdx)}
                      className="tap w-7 h-7 rounded-lg grid place-items-center"
                      style={{ background: "rgba(225,29,42,0.10)" }}
                    >
                      <TrashIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "משקל (ק״ג)", field: "weight_kg" as const, value: ex.weight_kg, step: 2.5, min: 0 },
                      { label: "סטים", field: "sets" as const, value: ex.sets, step: 1, min: 1 },
                      { label: "חזרות", field: "reps" as const, value: ex.reps, step: 1, min: 1 },
                      { label: "מנוחה (שנ׳)", field: "rest_seconds" as const, value: ex.rest_seconds, step: 15, min: 0 },
                    ].map(({ label, field, value, step, min }) => (
                      <div key={field} className="flex flex-col items-center gap-1.5 rounded-xl p-2.5"
                        style={{ background: field === "weight_kg" ? "rgba(225,29,42,0.07)" : "rgba(255,255,255,0.05)",
                          boxShadow: field === "weight_kg" ? "inset 0 0 0 1px rgba(225,29,42,0.18)" : "none" }}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateExercise(exIdx, field, Math.max(min, value - step))}
                            className="tap w-6 h-6 rounded-lg text-[16px] font-bold grid place-items-center"
                            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
                          >
                            −
                          </button>
                          <span className="text-[15px] font-bold w-8 text-center">{value || 0}</span>
                          <button
                            onClick={() => updateExercise(exIdx, field, value + step)}
                            className="tap w-6 h-6 rounded-lg text-[16px] font-bold grid place-items-center"
                            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Add exercise button */}
            <button
              onClick={() => setShowPicker(true)}
              className="tap w-full rounded-2xl p-4 flex items-center justify-center gap-2.5"
              style={{
                background: "rgba(255,255,255,0.02)",
                boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.08)",
              }}
            >
              <div className="w-7 h-7 rounded-full grid place-items-center" style={{ background: "rgba(225,29,42,0.12)" }}>
                <PlusIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
              </div>
              <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>הוסף תרגיל</span>
            </button>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: "linear-gradient(to top, #0B0A08 70%, transparent)" }}>
        <button
          onClick={saveAll}
          disabled={saving}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "#E11D2A", boxShadow: "0 10px 28px rgba(225,29,42,0.40)" }}
        >
          {saved ? (
            <>
              <CheckIcon className="w-5 h-5" />
              נשמר!
            </>
          ) : saving ? "שומר..." : "שמור תוכנית"}
        </button>
      </div>

      {/* Exercise picker modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(12px)" }}
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full rounded-t-3xl pb-10"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "82vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <h3 className="text-[17px] font-bold mb-3">בחר תרגיל</h3>
              {/* Muscle group filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {MUSCLE_GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setMuscleFilter(g)}
                    className="tap flex-shrink-0 px-3 h-7 rounded-full text-[11px] font-medium"
                    style={{
                      background: muscleFilter === g ? "#E11D2A" : "rgba(255,255,255,0.07)",
                      color: muscleFilter === g ? "#fff" : "rgba(255,255,255,0.50)",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto px-5 space-y-2">
              {filteredLibrary.map((ex) => {
                const alreadyAdded = currentDay?.exercises.some((e) => e.name === ex.name);
                return (
                  <button
                    key={ex.id}
                    onClick={() => !alreadyAdded && addExercise(ex)}
                    disabled={alreadyAdded}
                    className="tap w-full flex items-center gap-3 rounded-2xl p-3.5"
                    style={{
                      background: alreadyAdded ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                      opacity: alreadyAdded ? 0.45 : 1,
                    }}
                  >
                    <div className="flex-1 text-right">
                      <p className="font-medium text-[13.5px]">{ex.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{ex.muscle_group}</p>
                    </div>
                    {alreadyAdded ? (
                      <CheckIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
                    ) : (
                      <PlusIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                    )}
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
