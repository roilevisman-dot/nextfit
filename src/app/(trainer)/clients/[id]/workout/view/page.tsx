"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  weight_kg: number | null;
  youtube_url: string | null;
  notes: string | null;
};

type Day = {
  id: string;
  day_number: number;
  label: string;
  exercises: Exercise[];
};

type Session = {
  id: string;
  day_id: string;
  session_date: string;
  completed_at: string | null;
};

function BackIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 19l-7-7 7-7" /></svg>;
}
function EditIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function YTIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.2.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>;
}

const ACCENT = "#E11D2A";

export default function WorkoutViewPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [clientName, setClientName] = useState("");
  const [days, setDays] = useState<Day[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);

  const supabase = createClient();

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

      if (!cp?.plan_id) { setLoading(false); return; }

      const { data: planData } = await supabase
        .from("workout_plans")
        .select("days_per_week")
        .eq("id", cp.plan_id)
        .single();

      if (!planData) { setLoading(false); return; }

      const { data: wdays } = await supabase
        .from("workout_days")
        .select("id, day_number, label")
        .eq("plan_id", cp.plan_id)
        .order("day_number");

      const loadedDays: Day[] = await Promise.all(
        (wdays ?? []).map(async (day) => {
          const { data: exs } = await supabase
            .from("plan_exercises")
            .select("name, sets, reps, rest_seconds, weight_kg, youtube_url, notes")
            .eq("day_id", day.id)
            .order("order_index");
          return {
            id: day.id,
            day_number: day.day_number,
            label: day.label,
            exercises: exs ?? [],
          };
        })
      );

      setDays(loadedDays);

      // Load last 14 days of sessions
      const dayIds = (wdays ?? []).map((d) => d.id);
      if (dayIds.length > 0) {
        const since = new Date();
        since.setDate(since.getDate() - 14);
        const { data: sess } = await supabase
          .from("workout_sessions")
          .select("id, day_id, session_date, completed_at")
          .eq("client_id", clientId)
          .eq("completed", true)
          .in("day_id", dayIds)
          .gte("session_date", since.toISOString().split("T")[0])
          .order("session_date", { ascending: false });
        setSessions(sess ?? []);
      }

      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const currentDay = days[activeDay];

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-5 w-24 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-32" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.push(`/clients/${clientId}`)} className="tap flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />{clientName}
        </button>

        {/* Header */}
        <div className="rise">
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>תוכנית אימון</div>
          <h1 className="mt-1 text-[24px] font-extrabold">{clientName}</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{days.length} ימי אימון בשבוע</p>
        </div>

        {/* Day tabs */}
        {days.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {days.map((day, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className="tap flex-shrink-0 px-3.5 h-9 rounded-full text-[12px] font-medium"
                style={{ background: activeDay === i ? ACCENT : "rgba(255,255,255,0.06)", color: activeDay === i ? "#fff" : "rgba(255,255,255,0.45)", boxShadow: activeDay === i ? "0 4px 14px rgba(225,29,42,0.35)" : "none" }}>
                {day.label}
              </button>
            ))}
          </div>
        )}

        {/* Exercises */}
        {currentDay && (
          <div className="space-y-3 rise" style={{ animationDelay: "40ms" }}>
            {currentDay.exercises.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)" }}>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין תרגילים ב{currentDay.label}</p>
              </div>
            ) : currentDay.exercises.map((ex, ei) => (
              <div key={ei} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>

                {/* Exercise name + index */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg grid place-items-center flex-shrink-0 text-[12px] font-bold"
                    style={{ background: "rgba(225,29,42,0.12)", color: ACCENT }}>{ei + 1}</div>
                  <p className="font-semibold text-[15px]">{ex.name}</p>
                </div>

                {/* Stats row */}
                <div className="flex gap-2 flex-wrap mb-2">
                  {[
                    { label: "סטים", value: ex.sets },
                    { label: "חזרות", value: ex.reps },
                    { label: "מנוחה", value: `${ex.rest_seconds}שנ׳` },
                    ...(ex.weight_kg ? [{ label: "משקל", value: `${ex.weight_kg}ק״ג` }] : []),
                  ].map((s, si) => (
                    <div key={si} className="rounded-xl px-3 py-1.5 flex flex-col items-center"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span className="text-[14px] font-bold">{s.value}</span>
                      <span className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {ex.notes && (
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {ex.notes}
                  </p>
                )}

                {/* YouTube */}
                {ex.youtube_url && (
                  <a href={ex.youtube_url} target="_blank" rel="noopener noreferrer"
                    className="tap flex items-center gap-1.5 mt-2"
                    onClick={(e) => e.stopPropagation()}>
                    <YTIcon className="w-3.5 h-3.5" style={{ color: "#FF0000" }} />
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>סרטון הסבר</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {days.length === 0 && !loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.40)" }}>אין תוכנית אימון</p>
          </div>
        )}

        {/* Session history */}
        {sessions.length > 0 && (
          <div className="rise mt-2" style={{ animationDelay: "80ms" }}>
            <p className="text-[12px] font-semibold mb-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>פעילות 14 ימים אחרונים</p>
            <div className="space-y-2">
              {sessions.map((s) => {
                const dayLabel = days.find((d) => d.id === s.day_id)?.label ?? "אימון";
                const date = new Date(s.session_date);
                const dateStr = `${date.getDate().toString().padStart(2,"0")}/${(date.getMonth()+1).toString().padStart(2,"0")}`;
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                    style={{ background: "rgba(16,185,129,0.07)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.18)" }}>
                    <div className="w-6 h-6 rounded-full grid place-items-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.15)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-semibold">{dayLabel}</p>
                    </div>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>{dateStr}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4" style={{ background: "linear-gradient(to top, #0B0A08 70%, transparent)" }}>
        <button onClick={() => router.push(`/clients/${clientId}/workout`)}
          className="tap w-full h-13 rounded-full font-bold text-[15px] text-white flex items-center justify-center gap-2"
          style={{ background: ACCENT, boxShadow: "0 10px 28px rgba(225,29,42,0.40)" }}>
          <EditIcon className="w-5 h-5" />
          ערוך תוכנית
        </button>
      </div>
    </main>
  );
}
