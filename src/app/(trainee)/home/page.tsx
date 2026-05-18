"use client";

import { NFMark } from "@/components/NFMark";

/* ─── Inline SVG icons ─── */
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}
function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1.25 2.5-2.5 0-.61-.23-1.21-.64-1.67-.97-1.11-1.86-2.32-1.86-3.83a4 4 0 1 1 8 0c0 1.66-.5 3.16-1.5 4.5"/>
      <path d="M12 22c-4.4 0-8-3.6-8-8 0-1.66.5-3.16 1.5-4.5"/>
    </svg>
  );
}
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
function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  );
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}
function DropIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/>
    </svg>
  );
}
function DumbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/>
    </svg>
  );
}

/* ─── Top bar ─── */
function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2">
      <NFMark size={30} />
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full" style={{ color: "#1E1E24" }}>
        <BellIcon className="w-[18px] h-[18px]" />
        <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ background: "#E11D2A" }} />
      </button>
    </div>
  );
}

/* ─── Greeting ─── */
function Greeting() {
  return (
    <div className="px-6 pt-5 pb-5 rise" style={{ animationDelay: "40ms" }}>
      <div className="flex items-center gap-2 text-[12px] tracking-wide mb-2" style={{ color: "#52525B" }}>
        <span>ראשון · 18 במאי</span>
        <span className="w-1 h-1 rounded-full" style={{ background: "#71717A" }} />
        <span className="inline-flex items-center gap-1" style={{ color: "#E11D2A" }}>
          <FlameIcon className="w-3.5 h-3.5" />
          <span className="nums font-medium">12 ימים</span>
        </span>
      </div>
      <h1 className="text-[30px] leading-[1.15] tracking-tight" style={{ color: "#0A0A0C" }}>
        בוקר טוב,
        <br />
        <span className="text-[36px] font-extrabold" style={{ color: "#0A0A0C" }}>יעל</span>
        <span style={{ color: "#71717A" }}>.</span>
      </h1>
      <p className="text-[14px] mt-2 leading-relaxed" style={{ color: "#52525B" }}>
        עוד אימון אחד ואתה סוגרת שבוע מלא. בא לנו לראות.
      </p>
    </div>
  );
}

/* ─── Today's workout hero card ─── */
function TodayWorkout() {
  const done = 5, total = 8;
  const pct = done / total;

  return (
    <div className="px-5 rise" style={{ animationDelay: "120ms" }}>
      <div
        className="relative rounded-[28px] text-white p-5 overflow-hidden tap"
        style={{
          background: "#0A0A0C",
          boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.10)",
        }}
      >
        {/* Iris glow */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(79,70,229,0.55), rgba(79,70,229,0) 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 200px at 90% 0%, white, transparent 60%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-white/60">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E11D2A" }} />
            אימון היום
          </div>
          <div className="text-[11px] text-white/50 nums">יום 3 / 5</div>
        </div>

        <div className="relative mt-3 flex items-baseline gap-2">
          <h2 className="text-[26px] tracking-tight text-white">דחיפה עליונה</h2>
        </div>
        <div className="relative mt-1.5 flex items-center gap-2 text-[12.5px] text-white/55">
          <span>חזה · כתפיים · יד אחורית</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="nums">45 דק׳</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>בינוני</span>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between text-[12px] text-white/70">
            <span className="nums">{done} מתוך {total} תרגילים</span>
            <span className="nums text-white/90 font-medium">{Math.round(pct * 100)}%</span>
          </div>
          <div className="relative mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.10)" }}>
            <div
              className="absolute inset-y-0 right-0 h-full barfill"
              style={{
                "--p": pct,
                width: "100%",
                background: "linear-gradient(90deg, #FF4A57 0%, #E11D2A 100%)",
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* CTA + exercise dots */}
        <div className="relative mt-5 flex items-center gap-3">
          <button
            className="tap inline-flex items-center gap-2 bg-white rounded-full pl-4 pr-3 h-11 text-[14px] font-medium"
            style={{ color: "#0A0A0C" }}
          >
            <PlayIcon className="w-3.5 h-3.5" />
            המשך אימון
          </button>
          <div className="flex -space-x-2 space-x-reverse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full grid place-items-center ring-2"
                style={{ background: "#E11D2A" }}
              >
                <CheckIcon className="w-3.5 h-3.5 text-white" />
              </div>
            ))}
            <div className="w-7 h-7 rounded-full grid place-items-center nums text-[11px] text-white/70" style={{ background: "rgba(255,255,255,0.10)" }}>6</div>
            <div className="w-7 h-7 rounded-full grid place-items-center nums text-[11px] text-white/40" style={{ background: "rgba(255,255,255,0.10)" }}>7</div>
            <div className="w-7 h-7 rounded-full grid place-items-center nums text-[11px] text-white/40" style={{ background: "rgba(255,255,255,0.10)" }}>8</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat tiles: weight + hydration ─── */
function WeightTile() {
  const pts = [66.1, 65.8, 65.9, 65.4, 65.1, 64.6, 64.2];
  const w = 110, h = 36;
  const min = Math.min(...pts), max = Math.max(...pts);
  const path = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div
      className="rounded-3xl p-4 tap"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase" style={{ color: "#52525B" }}>
          משקל
        </div>
        <div
          className="inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full nums"
          style={{ color: "#1F7A55", background: "rgba(31,122,85,0.10)" }}
        >
          ↓ 0.3
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[28px] leading-none nums tracking-tight font-extrabold" style={{ color: "#0A0A0C" }}>
          64.2
        </span>
        <span className="text-[12px]" style={{ color: "#52525B" }}>ק״ג</span>
      </div>
      <div className="mt-2 -mx-1">
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block">
          <defs>
            <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#E11D2A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#wgrad)" />
          <path d={path} fill="none" stroke="#E11D2A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((v, i) => {
            const x = (i / (pts.length - 1)) * w;
            const y = h - ((v - min) / (max - min || 1)) * h;
            return i === pts.length - 1 ? (
              <circle key={i} cx={x} cy={y} r="2.2" fill="#E11D2A" />
            ) : null;
          })}
        </svg>
      </div>
      <div className="mt-1 text-[11px]" style={{ color: "#52525B" }}>השבוע</div>
    </div>
  );
}

function HydrationTile() {
  const current = 1.4, goal = 2.5;
  const pct = current / goal;
  const R = 28, C = 2 * Math.PI * R;

  return (
    <div
      className="rounded-3xl p-4 tap"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase" style={{ color: "#52525B" }}>שתייה</div>
        <button className="tap w-6 h-6 grid place-items-center rounded-full" style={{ background: "#FAF9F6", color: "#2D2D35" }}>
          <PlusIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="mt-1 flex items-center gap-3">
        <div className="relative w-[68px] h-[68px] -ml-1">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#EFEDE6" strokeWidth="6" />
            <circle
              cx="40" cy="40" r={R} fill="none"
              stroke="#E11D2A" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: "stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)" }}
            />
          </svg>
          <DropIcon className="w-4 h-4 absolute inset-0 m-auto" style={{ color: "#E11D2A" }} />
        </div>
        <div>
          <div className="text-[22px] leading-none nums font-bold" style={{ color: "#0A0A0C" }}>
            {current.toFixed(1)}
            <span className="text-[12px] font-normal" style={{ color: "#52525B" }}> / {goal}L</span>
          </div>
          <div className="mt-1.5 text-[11px] nums" style={{ color: "#52525B" }}>
            {Math.round(pct * 100)}% מהיעד
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        {[1, 1, 1, 1, 1, 0, 0, 0, 0, 0].map((on, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: on ? "#E11D2A" : "#ECEAE2" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Nutrition glance ─── */
function NutritionGlance() {
  const macros = [
    { label: "חלבון", value: 142, goal: 160, color: "#E11D2A" },
    { label: "פחמ׳",  value: 198, goal: 240, color: "#0A0A0C" },
    { label: "שומן",  value: 58,  goal: 70,  color: "#E8542A" },
  ];
  const meals = [
    { meal: "ארוחת בוקר", kcal: 420, done: true },
    { meal: "ביניים",      kcal: 220, done: true },
    { meal: "צהריים",      kcal: 680, done: true },
    { meal: "ביניים",      kcal: 280, done: false },
    { meal: "ערב",         kcal: 500, done: false },
  ];

  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: "280ms" }}>
      <div
        className="rounded-3xl p-5 tap"
        style={{ background: "#FFFFFF", boxShadow: "0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] tracking-wide uppercase" style={{ color: "#52525B" }}>תפריט היום</div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-[26px] tracking-tight font-extrabold nums leading-none" style={{ color: "#0A0A0C" }}>1,840</span>
              <span className="text-[12px] nums" style={{ color: "#52525B" }}>/ 2,100 קק״ל</span>
            </div>
          </div>
          <button className="tap text-[12px] font-medium inline-flex items-center gap-0.5 px-2 h-7 rounded-full" style={{ color: "#2D2D35" }}>
            פירוט
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {macros.map((m) => {
            const p = Math.min(1, m.value / m.goal);
            return (
              <div key={m.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px]" style={{ color: "#52525B" }}>{m.label}</span>
                  <span className="text-[11px] nums" style={{ color: "#2D2D35" }}>
                    {m.value}<span style={{ color: "#71717A" }}>/{m.goal}g</span>
                  </span>
                </div>
                <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "#ECEAE2" }}>
                  <div
                    className="h-full rounded-full barfill"
                    style={{
                      "--p": p,
                      width: "100%",
                      background: m.color,
                      transformOrigin: "right center",
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 -mx-1 flex items-center gap-2 overflow-x-auto nf-scroll">
          {meals.map((m, i) => (
            <div
              key={i}
              className="shrink-0 px-3 h-8 rounded-full inline-flex items-center gap-1.5 text-[12px]"
              style={
                m.done
                  ? { background: "#0A0A0C", color: "#ffffff" }
                  : { background: "#FAF9F6", color: "#2D2D35", boxShadow: "inset 0 0 0 1px #ECEAE2" }
              }
            >
              {m.done && <CheckIcon className="w-3 h-3" />}
              <span>{m.meal}</span>
              <span className="nums opacity-60">{m.kcal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Up next strip ─── */
function UpNext() {
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: "360ms" }}>
      <button
        className="w-full tap rounded-3xl p-4 flex items-center gap-3 text-right"
        style={{ background: "#FAF9F6", boxShadow: "0 0 0 1px #ECEAE2" }}
      >
        <div className="w-10 h-10 rounded-2xl grid place-items-center" style={{ background: "#FDECEE", color: "#B81522" }}>
          <DumbIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] tracking-wide uppercase" style={{ color: "#52525B" }}>הבא בתור · מחר</div>
          <div className="mt-0.5 text-[14px] font-medium" style={{ color: "#141418" }}>רגליים · ירידה לעומק</div>
        </div>
        <div className="text-[12px] nums" style={{ color: "#52525B" }}>52 דק׳</div>
        <ArrowIcon className="w-4 h-4" style={{ color: "#71717A" }} />
      </button>
    </div>
  );
}

/* ─── Page shell ─── */
export default function HomePage() {
  return (
    <div className="min-h-screen font-heb" style={{ background: "#FAF9F6" }}>
      <div className="nf-scroll overflow-y-auto">
        <TopBar />
        <Greeting />
        <TodayWorkout />
        <div className="px-5 mt-3 grid grid-cols-2 gap-3 rise" style={{ animationDelay: "200ms" }}>
          <WeightTile />
          <HydrationTile />
        </div>
        <NutritionGlance />
        <UpNext />
        <div className="h-4" />
      </div>
    </div>
  );
}
