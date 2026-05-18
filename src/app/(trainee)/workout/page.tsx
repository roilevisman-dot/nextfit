"use client";

import { NFMark } from "@/components/NFMark";

/* ─── Icons ─── */
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/>
    </svg>
  );
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function ChevLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  );
}
function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18M6 12h12M10 18h4"/>
    </svg>
  );
}
function RestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12h18M3 8h18M3 16h12"/>
    </svg>
  );
}

/* ─── Week data ─── */
const WEEK = [
  { d: "א", label: "ראשון",  date: "12", status: "done",    title: "משיכה אחורית",   meta: "גב · יד קדמית",              mins: 50, ex: 7,
    photo: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80&auto=format&fit=crop" },
  { d: "ב", label: "שני",    date: "13", status: "done",    title: "רגליים",          meta: "כיווץ · עומק",                mins: 55, ex: 6,
    photo: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80&auto=format&fit=crop" },
  { d: "ג", label: "שלישי",  date: "14", status: "rest",    title: "מנוחה",           meta: "התאוששות · ניידות",           mins: 20, ex: 0 },
  { d: "ד", label: "רביעי",  date: "15", status: "done",    title: "משיכה אנכית",    meta: "גב רחב · ביצועים",           mins: 48, ex: 7,
    photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop" },
  { d: "ה", label: "חמישי",  date: "16", status: "today",   title: "דחיפה עליונה",   meta: "חזה · כתפיים · יד אחורית",  mins: 45, ex: 8, progress: 5/8,
    photo: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80&auto=format&fit=crop" },
  { d: "ו", label: "שישי",   date: "17", status: "planned", title: "רגליים · ירידה לעומק", meta: "סקוואט · דדליפט",        mins: 52, ex: 7,
    photo: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80&auto=format&fit=crop" },
  { d: "ש", label: "שבת",    date: "18", status: "rest",    title: "מנוחה פעילה",    meta: "הליכה · נשימות",              mins: 30, ex: 0 },
] as const;

/* ─── Week strip ─── */
function WeekStrip() {
  return (
    <div className="px-5 mt-1 rise" style={{ animationDelay: "120ms" }}>
      <div className="flex items-stretch justify-between gap-1.5">
        {WEEK.map((day, i) => {
          const isToday  = day.status === "today";
          const isDone   = day.status === "done";
          const isRest   = day.status === "rest";
          return (
            <button
              key={i}
              className="tap flex-1 rounded-[18px] py-2.5 grid place-items-center relative"
              style={{
                background: isToday ? "rgba(225,29,42,0.10)" : "rgba(255,255,255,0.03)",
                boxShadow: isToday
                  ? "inset 0 0 0 1px rgba(225,29,42,0.45)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <div className={`text-[10px] tracking-wide ${isToday ? "text-white" : "text-white/45"}`}>{day.d}</div>
              <div className={`mt-0.5 nums text-[14px] ${isToday ? "text-white font-semibold" : isDone ? "text-white/80" : "text-white/50"}`}>{day.date}</div>
              <div
                className="mt-1.5 w-1.5 h-1.5 rounded-full"
                style={{
                  background: isToday ? "#E11D2A"
                    : isDone  ? "#7BE39A"
                    : isRest  ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.30)",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Today hero card ─── */
function TodayCard() {
  const today = WEEK.find((d) => d.status === "today");
  if (!today) return null;
  const prog = (today as { progress?: number }).progress ?? 0;

  return (
    <div className="px-5 mt-4 rise" style={{ animationDelay: "180ms" }}>
      <div
        className="relative rounded-[28px] overflow-hidden tap"
        style={{ height: 330, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={(today as { photo?: string }).photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.95) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(11,10,8,0) 0%, rgba(11,10,8,0.1) 35%, rgba(11,10,8,0.75) 75%, rgba(11,10,8,0.95) 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(220deg, rgba(225,29,42,0.20) 0%, rgba(225,29,42,0) 40%)" }}
        />

        {/* Top chips */}
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 h-7"
            style={{ background: "rgba(0,0,0,0.30)", backdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E11D2A" }} />
            <span className="text-[11px] tracking-wider uppercase text-white/85">היום · {today.label}</span>
          </div>
          <div
            className="rounded-full px-2.5 h-7 grid place-items-center text-[11px] text-white/80 nums"
            style={{ background: "rgba(0,0,0,0.30)", backdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
          >
            {Math.round(prog * today.ex)}/{today.ex} תרגילים
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 right-0 left-0 p-5">
          <div className="text-[12px] tracking-[0.04em] text-white/55 uppercase">פלג גוף עליון</div>
          <h2 className="mt-1 text-[30px] leading-[1.05] tracking-tight text-white">
            דחיפה <span className="text-[34px] font-extrabold">עליונה</span>
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-white/60">
            <span>{today.meta}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="nums">{today.mins} דק׳</span>
          </div>
          <div className="mt-3">
            <div className="relative h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div
                className="absolute inset-y-0 right-0 h-full barfill"
                style={{
                  "--p": prog,
                  width: "100%",
                  background: "linear-gradient(90deg, #FF5A66 0%, #E11D2A 100%)",
                } as React.CSSProperties}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              className="tap inline-flex items-center gap-2 rounded-full h-12 px-5 text-[14px] font-semibold text-white"
              style={{
                background: "#E11D2A",
                boxShadow: "0 10px 30px rgba(225,29,42,0.50), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <PlayIcon className="w-3.5 h-3.5 shrink-0" />
              המשך אימון
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Day row ─── */
function DayRow({ day }: { day: typeof WEEK[number] }) {
  const isToday   = day.status === "today";
  const isDone    = day.status === "done";
  const isRest    = day.status === "rest";
  const photo     = (day as { photo?: string }).photo;
  const progress  = (day as { progress?: number }).progress;

  return (
    <button
      className="w-full tap rounded-2xl p-3 flex items-center gap-3 text-right relative overflow-hidden"
      style={{
        background: isToday ? "rgba(225,29,42,0.06)" : "#15140F",
        boxShadow: isToday
          ? "inset 0 0 0 1px rgba(225,29,42,0.35)"
          : "inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="w-[58px] h-[58px] rounded-xl overflow-hidden shrink-0 relative"
        style={{ background: isRest ? "rgba(255,255,255,0.04)" : "#0A0A0B" }}
      >
        {photo && !isRest ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40">
            <RestIcon className="w-5 h-5" />
          </div>
        )}
        {isDone && (
          <div
            className="absolute bottom-1 left-1 w-4 h-4 rounded-full grid place-items-center"
            style={{ background: "#7BE39A" }}
          >
            <CheckIcon className="w-2.5 h-2.5" style={{ color: "#0A0A0C" }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] tracking-wider uppercase text-white/45">
            יום {day.d}׳ · {day.label}
          </span>
          {isToday && (
            <span
              className="text-[10px] px-1.5 h-4 grid place-items-center rounded-full text-white nums"
              style={{ background: "#E11D2A" }}
            >
              היום
            </span>
          )}
        </div>
        <div className={`mt-0.5 text-[14.5px] truncate ${isRest ? "text-white/60" : "text-white font-medium"}`}>
          {day.title}
        </div>
        <div className="mt-0.5 text-[11.5px] text-white/45 truncate">
          {isRest
            ? day.meta
            : <>{day.meta} · <span className="nums">{day.mins} דק׳</span> · <span className="nums">{day.ex} תרגילים</span></>}
        </div>
      </div>

      {/* Trailing */}
      {isToday ? (
        <div className="flex items-center gap-1 text-[11.5px] text-white">
          <span className="nums opacity-85">{Math.round((progress ?? 0) * 100)}%</span>
          <ChevLeftIcon className="w-4 h-4 text-white/60" />
        </div>
      ) : isDone ? (
        <div className="text-[11px] text-white/45 nums">17.05</div>
      ) : isRest ? (
        <span className="text-[11px] text-white/40">—</span>
      ) : (
        <ChevLeftIcon className="w-4 h-4 text-white/30" />
      )}
    </button>
  );
}

/* ─── Page shell ─── */
export default function WorkoutPage() {
  return (
    <div className="min-h-screen font-heb text-white" style={{ background: "#0B0A08" }}>
      {/* Red accent top-right */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(700px 360px at 100% 0%, rgba(225,29,42,0.10), transparent 60%)" }}
      />

      <div className="relative nf-scroll overflow-y-auto pb-[120px]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <NFMark size={30} />
          <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-white/80">
            <FilterIcon className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-4 rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">שבוע 8 · פרוגרמה</div>
          <h1 className="mt-1 text-[30px] leading-[1.1] tracking-tight text-white">
            כוח <span className="text-[36px] font-extrabold text-white/60">+</span> מסה
          </h1>
          <p className="text-[13px] text-white/55 mt-1.5 max-w-[36ch]">
            5 אימוני כוח, 2 ימי מנוחה. עוד 2 אימונים השבוע לסיום.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11.5px] text-white/80"
              style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }}
            >
              <CheckIcon className="w-3 h-3" style={{ color: "#7BE39A" }} />
              <span className="nums">3 הושלמו</span>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11.5px] text-white"
              style={{ background: "rgba(225,29,42,0.18)", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.40)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E11D2A" }} />
              היום · דחיפה
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11.5px] text-white/70"
              style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }}
            >
              <span className="nums">2 לפניך</span>
            </div>
          </div>
        </div>

        <WeekStrip />
        <TodayCard />

        {/* Plan list */}
        <div className="px-5 mt-5 rise" style={{ animationDelay: "260ms" }}>
          <div className="flex items-baseline justify-between mb-2.5 px-1">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">תוכנית השבוע</div>
            <div className="text-[11px] text-white/45 nums">7 ימים</div>
          </div>
          <div className="space-y-2">
            {WEEK.map((day, i) => (
              <DayRow key={i} day={day} />
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
