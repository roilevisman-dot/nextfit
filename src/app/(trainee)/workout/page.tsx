"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NFMark } from "@/components/NFMark";

type PlanExercise = {
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg: number | null;
  youtube_url: string | null;
  notes: string | null;
  order_index: number;
};

type WorkoutDay = {
  id: string;
  day_number: number;
  label: string;
  exercises: PlanExercise[];
};

type Plan = {
  name: string;
  days_per_week: number;
  duration_weeks: number | null;
  days: WorkoutDay[];
};

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function ChevLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12" />
    </svg>
  );
}

function TimerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 3h6M12 3v2" />
    </svg>
  );
}

const TODAY = new Date().toISOString().split("T")[0];

export default function WorkoutPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());
  const [markingDone, setMarkingDone] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [planStartDate, setPlanStartDate] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const fetchPlan = useCallback(async () => {
    const cid = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!cid) { router.push("/join"); return; }
    setClientId(cid);

    const { data: cpRows } = await supabase
      .from("client_plans")
      .select("plan_id")
      .eq("client_id", cid)
      .eq("active", true)
      .order("id", { ascending: false })
      .limit(1);
    const cp = cpRows?.[0] ?? null;
    if (!cp) { setLoading(false); return; }

    // Fetch plan metadata + days in parallel
    const [{ data: planData }, { data: daysData }] = await Promise.all([
      supabase.from("workout_plans").select("name, days_per_week, duration_weeks, created_at").eq("id", cp.plan_id).single(),
      supabase.from("workout_days").select("id, day_number, label").eq("plan_id", cp.plan_id).order("day_number"),
    ]);

    if (!planData || !daysData) { setLoading(false); return; }

    const dayIds = daysData.map((d) => d.id);

    // Fetch all exercises + sessions in parallel — no N+1
    const [{ data: allExData }, { data: sessions }] = await Promise.all([
      supabase.from("plan_exercises").select("day_id, name, sets, reps, rest_seconds, weight_kg, youtube_url, notes, order_index").in("day_id", dayIds).order("order_index"),
      supabase.from("workout_sessions").select("day_id").eq("client_id", cid).eq("session_date", TODAY).eq("completed", true).in("day_id", dayIds),
    ]);

    const daysWithExercises: WorkoutDay[] = daysData.map((day) => ({
      ...day,
      exercises: (allExData ?? []).filter((e) => (e as PlanExercise & { day_id: string }).day_id === day.id),
    }));

    setCompletedDays(new Set(sessions?.map((s) => s.day_id) ?? []));

    if (planData.created_at) setPlanStartDate(planData.created_at);
    setPlan({ ...planData, duration_weeks: planData.duration_weeks ?? null, days: daysWithExercises });
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const markDone = async () => {
    if (!currentDay || !clientId || completedDays.has(currentDay.id)) return;
    setMarkingDone(true);
    await supabase.from("workout_sessions").insert({
      client_id: clientId,
      day_id: currentDay.id,
      session_date: TODAY,
      completed: true,
      completed_at: new Date().toISOString(),
    });
    setCompletedDays((prev) => new Set([...prev, currentDay.id]));
    setMarkingDone(false);
  };

  const currentDay = plan?.days[activeDay];

  if (loading) {
    return (
      <div className="min-h-screen font-heb text-white" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-32 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-40 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
    );
  }

  if (!plan || plan.days.length === 0) {
    return (
      <div className="min-h-screen font-heb text-white flex flex-col items-center justify-center pb-32 px-6 text-center" style={{ background: "#0B0A08" }}>
        <div
          className="w-16 h-16 rounded-2xl grid place-items-center mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <DumbbellIcon className="w-7 h-7" style={{ color: "rgba(255,255,255,0.25)" }} />
        </div>
        <p className="text-[15px] font-semibold" style={{ color: "rgba(255,255,255,0.60)" }}>
          טרם שויכה תוכנית
        </p>
        <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
          המאמן שלך עדיין לא שיוך לך תוכנית אימון
        </p>
      </div>
    );
  }

  const totalExercises = plan.days.reduce((a, d) => a + d.exercises.length, 0);

  return (
    <div className="min-h-screen font-heb text-white" style={{ background: "#0B0A08" }}>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(700px 360px at 100% 0%, rgba(225,29,42,0.10), transparent 60%)" }}
      />

      <div className="relative pb-[120px]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <NFMark size={30} />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-4 rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>
            תוכנית אימון
          </div>
          <h1 className="mt-1 text-[28px] leading-[1.1] tracking-tight text-white font-extrabold">
            {plan.name}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.50)" }}>
              {plan.days_per_week} ימי אימון · {totalExercises} תרגילים סה״כ
            </p>
            {planStartDate && (() => {
              const dayNum = Math.max(1, Math.floor((Date.now() - new Date(planStartDate).getTime()) / 86400000) + 1);
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ background: "rgba(225,29,42,0.12)", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.22)", color: "#FF8A95" }}>
                  {plan.duration_weeks ? `יום ${dayNum} מתוך ${plan.duration_weeks * 7}` : `יום ${dayNum} לתוכנית`}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Day tabs */}
        <div className="px-5 rise" style={{ animationDelay: "100ms" }}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {plan.days.map((day, i) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(i)}
                className="tap flex-shrink-0 px-4 py-2 rounded-2xl text-[12.5px] font-medium transition-all"
                style={{
                  background: activeDay === i ? "#E11D2A" : "rgba(255,255,255,0.06)",
                  color: activeDay === i ? "#fff" : "rgba(255,255,255,0.50)",
                  boxShadow: activeDay === i
                    ? "0 6px 18px rgba(225,29,42,0.35)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active day content */}
        {currentDay && (
          <div className="px-5 mt-4 space-y-2.5 rise" style={{ animationDelay: "160ms" }}>
            {/* Day hero */}
            <div
              className="rounded-3xl p-5"
              style={{
                background: "rgba(225,29,42,0.06)",
                boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.20)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.25em] uppercase" style={{ color: "rgba(225,29,42,0.80)" }}>
                    {currentDay.label}
                  </p>
                  <p className="text-[22px] font-extrabold mt-0.5">
                    {currentDay.exercises.length} תרגילים
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    ~{currentDay.exercises.reduce((acc, e) => acc + e.sets * 3 + e.rest_seconds * (e.sets - 1) / 60, 0).toFixed(0)} דקות משוערות
                  </p>
                </div>
                {completedDays.has(currentDay.id) ? (
                  <div className="flex items-center gap-2 px-4 h-10 rounded-full"
                    style={{ background: "rgba(16,185,129,0.15)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.30)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 13l4 4L19 7"/></svg>
                    <span className="text-[13px] font-semibold" style={{ color: "#10B981" }}>הושלם!</span>
                  </div>
                ) : (
                  <button
                    onClick={markDone}
                    disabled={markingDone}
                    className="tap flex items-center gap-2 px-4 h-10 rounded-full text-[13px] font-semibold text-white disabled:opacity-60"
                    style={{ background: "#E11D2A", boxShadow: "0 8px 24px rgba(225,29,42,0.45)" }}
                  >
                    <PlayIcon className="w-3 h-3" />
                    {markingDone ? "..." : "סיימתי!"}
                  </button>
                )}
              </div>
            </div>

            {/* Exercise list */}
            {currentDay.exercises.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-[12px]"
                style={{ color: "rgba(255,255,255,0.30)" }}>
                אין תרגילים ביום זה
              </div>
            ) : (
              currentDay.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
                  <div className="tap p-4 flex items-center gap-4 text-right w-full">
                    {/* Number */}
                    <div
                      className="w-9 h-9 rounded-xl grid place-items-center text-[13px] font-bold flex-shrink-0"
                      style={{ background: "rgba(225,29,42,0.10)", color: "#E11D2A" }}
                    >
                      {exIdx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] truncate">{ex.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                          <DumbbellIcon className="w-3 h-3" />
                          {ex.sets} × {ex.reps}
                        </span>
                        <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.20)" }} />
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                          <TimerIcon className="w-3 h-3" />
                          {ex.rest_seconds}שנ׳
                        </span>
                        {ex.weight_kg ? (
                          <>
                            <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.20)" }} />
                            <span className="text-[11px]" style={{ color: "rgba(225,29,42,0.80)" }}>{ex.weight_kg}ק״ג</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <ChevLeftIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
                  </div>

                  {(ex.notes || ex.youtube_url) && (
                    <div className="px-4 pb-3 space-y-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      {ex.notes && (
                        <p className="text-[11px] leading-relaxed pt-2" style={{ color: "rgba(255,255,255,0.38)" }}>{ex.notes}</p>
                      )}
                      {ex.youtube_url && (
                        <a href={ex.youtube_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] pt-1" style={{ color: "rgba(255,100,100,0.75)" }}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.2.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
                          סרטון הסבר
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
