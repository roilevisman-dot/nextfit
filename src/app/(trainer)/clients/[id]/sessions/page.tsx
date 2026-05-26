"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Session = {
  id: string;
  session_date: string;
  completed_at: string | null;
  day_label: string;
  day_number: number;
};

const HEB_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const HEB_MONTHS = ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"];

function BackIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 19l-7-7 7-7" /></svg>;
}
function FlameIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1.25 2.5-2.5 0-.61-.23-1.21-.64-1.67-.97-1.11-1.86-2.32-1.86-3.83a4 4 0 1 1 8 0c0 1.66-.5 3.16-1.5 4.5"/><path d="M12 22c-4.4 0-8-3.6-8-8 0-1.66.5-3.16 1.5-4.5"/></svg>;
}
function CheckIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>;
}
function DumbbellIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12" /></svg>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return `${HEB_DAYS[d.getDay()]} ${d.getDate()} ${HEB_MONTHS[d.getMonth()]}`;
}

function formatTime(isoStr: string | null) {
  if (!isoStr) return null;
  const d = new Date(isoStr);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function SessionsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data: clientData } = await supabase
      .from("clients").select("name").eq("id", clientId).single();
    if (clientData) setClientName(clientData.name);

    // Get active plan to know which days exist
    const { data: cpRows } = await supabase
      .from("client_plans").select("plan_id")
      .eq("client_id", clientId).eq("active", true)
      .order("id", { ascending: false }).limit(1);
    const planId = cpRows?.[0]?.plan_id ?? null;

    if (!planId) { setLoading(false); return; }

    // Fetch sessions + day info in parallel
    const [{ data: sessionsRaw }, { data: daysData }] = await Promise.all([
      supabase.from("workout_sessions")
        .select("id, session_date, completed_at, day_id")
        .eq("client_id", clientId).eq("completed", true)
        .order("session_date", { ascending: false })
        .limit(60),
      supabase.from("workout_days")
        .select("id, day_number, label").eq("plan_id", planId),
    ]);

    const dayMap = new Map((daysData ?? []).map((d) => [d.id, d]));

    const built: Session[] = (sessionsRaw ?? [])
      .map((s) => {
        const day = dayMap.get(s.day_id);
        if (!day) return null;
        return {
          id: s.id,
          session_date: s.session_date,
          completed_at: s.completed_at,
          day_label: day.label,
          day_number: day.day_number,
        };
      })
      .filter((s): s is Session => s !== null);

    setSessions(built);
    setLoading(false);
  }, [clientId, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Stats
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const totalSessions = sessions.length;
  const sessionsThisWeek = sessions.filter((s) => s.session_date >= weekAgoStr).length;
  const lastSession = sessions[0] ?? null;

  // Streak: consecutive days ending today
  const sessionDates = new Set(sessions.map((s) => s.session_date));
  let streak = 0;
  const d = new Date(today);
  while (true) {
    const ds = d.toISOString().split("T")[0];
    if (sessionDates.has(ds)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  // Calendar dots: last 28 days
  const calDays: { dateStr: string; done: boolean }[] = [];
  for (let i = 27; i >= 0; i--) {
    const cd = new Date(today); cd.setDate(today.getDate() - i);
    const ds = cd.toISOString().split("T")[0];
    calDays.push({ dateStr: ds, done: sessionDates.has(ds) });
  }

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-28 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back */}
        <button onClick={() => router.back()} className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          <BackIcon className="w-4 h-4" />
          {clientName || "לקוח"}
        </button>

        {/* Header */}
        <div className="rise" style={{ animationDelay: "30ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>מעקב אימונים</div>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight">{clientName}</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 rise" style={{ animationDelay: "60ms" }}>
          {[
            { label: "סה״כ אימונים", value: totalSessions, Icon: DumbbellIcon, color: "#E11D2A" },
            { label: "השבוע", value: sessionsThisWeek, Icon: CheckIcon, color: "#10B981" },
            { label: "רצף ימים", value: streak, Icon: FlameIcon, color: "#F97316" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="rounded-2xl p-3 flex flex-col items-center gap-2"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
              <div className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: color + "18" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-[22px] font-extrabold leading-none nums">{value}</p>
              <p className="text-[9px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Last workout */}
        {lastSession && (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3 rise" style={{ animationDelay: "90ms", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: lastSession.session_date === todayStr ? "#10B981" : "rgba(255,255,255,0.20)" }} />
            <div className="flex-1">
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>אימון אחרון</p>
              <p className="text-[13px] font-semibold">{lastSession.day_label}</p>
            </div>
            <p className="text-[12px] nums" style={{ color: "rgba(255,255,255,0.45)" }}>
              {lastSession.session_date === todayStr ? "היום" : formatDate(lastSession.session_date)}
            </p>
          </div>
        )}

        {/* 28-day calendar dots */}
        <div className="rise" style={{ animationDelay: "120ms" }}>
          <p className="text-[10.5px] tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>
            28 הימים האחרונים
          </p>
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"].map((d) => (
                <div key={d} className="text-center text-[9px] pb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{d}</div>
              ))}
              {/* Fill empty cells before first day */}
              {(() => {
                const firstDay = new Date(calDays[0].dateStr + "T12:00:00").getDay();
                return Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />);
              })()}
              {calDays.map(({ dateStr, done }) => {
                const isToday = dateStr === todayStr;
                return (
                  <div key={dateStr} className="aspect-square rounded-lg grid place-items-center"
                    style={{
                      background: done ? "rgba(225,29,42,0.80)" : isToday ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                      boxShadow: isToday ? "inset 0 0 0 1px rgba(255,255,255,0.20)" : "none",
                    }}>
                    {done && <CheckIcon className="w-2.5 h-2.5" style={{ color: "#fff" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions list */}
        <div className="rise" style={{ animationDelay: "160ms" }}>
          <p className="text-[10.5px] tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>
            היסטוריה
          </p>
          {sessions.length === 0 ? (
            <div className="rounded-2xl p-8 flex flex-col items-center gap-2 text-center"
              style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
              <DumbbellIcon className="w-8 h-8" style={{ color: "rgba(255,255,255,0.15)" }} />
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>עדיין לא הושלמו אימונים</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => {
                const isToday = s.session_date === todayStr;
                const time = formatTime(s.completed_at);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{
                      background: isToday ? "rgba(225,29,42,0.07)" : "rgba(255,255,255,0.04)",
                      boxShadow: isToday ? "inset 0 0 0 1.5px rgba(225,29,42,0.22)" : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                    }}>
                    <div className="w-9 h-9 rounded-xl grid place-items-center flex-shrink-0"
                      style={{ background: isToday ? "rgba(225,29,42,0.15)" : "rgba(255,255,255,0.06)" }}>
                      <CheckIcon className="w-4 h-4" style={{ color: isToday ? "#E11D2A" : "#10B981" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold truncate">{s.day_label}</p>
                      <p className="text-[11px] nums mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        יום {s.day_number}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-[12px] nums font-medium" style={{ color: isToday ? "#FF8A95" : "rgba(255,255,255,0.55)" }}>
                        {isToday ? "היום" : formatDate(s.session_date)}
                      </p>
                      {time && (
                        <p className="text-[10px] nums mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{time}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
