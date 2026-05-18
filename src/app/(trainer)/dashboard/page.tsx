"use client";

import { NFMark } from "@/components/NFMark";

const clients = [
  {
    initials: "יכ",
    color: "#5B4CF5",
    name: "יואב כהן",
    plan: "Push / Pull / Legs",
    lastWorkout: "אתמול",
    weight: 82.5,
    goal: 78,
    adherence: 88,
  },
  {
    initials: "מב",
    color: "#0EA5E9",
    name: "מיכל ברק",
    plan: "Full Body",
    lastWorkout: "לפני 2 ימים",
    weight: 65.2,
    goal: 60,
    adherence: 72,
  },
  {
    initials: "דש",
    color: "#10B981",
    name: "דניאל שמש",
    plan: "Push / Pull / Legs",
    lastWorkout: "לפני 3 ימים",
    weight: 91.0,
    goal: 85,
    adherence: 95,
  },
];

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

function ChevRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C9 7 7 9 7 13a5 5 0 0 0 10 0c0-4-2-6-5-11zM12 17a2 2 0 0 1-2-2c0-2 2-4 2-4s2 2 2 4a2 2 0 0 1-2 2z"/>
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>

      {/* Top bar */}
      <div className="px-5 pt-[58px] pb-3 flex items-center justify-between rise">
        <NFMark size={28} />
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              className="tap w-9 h-9 grid place-items-center rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <BellIcon className="w-[17px] h-[17px] text-white/60" />
            </button>
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "#E11D2A" }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5 pb-12">

        {/* Greeting */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">לוח בקרה</div>
          <h1 className="mt-1 text-[28px] leading-[1.15] tracking-tight">
            שלום,{" "}
            <span className="font-extrabold">מאמן</span>
            <span style={{ color: "#E11D2A" }}>.</span>
          </h1>
        </div>

        {/* Hero card */}
        <div
          className="relative rounded-3xl overflow-hidden rise"
          style={{
            animationDelay: "80ms",
            background: "linear-gradient(135deg, #1A0E0F 0%, #110C1A 100%)",
            boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.18), 0 0 60px rgba(225,29,42,0.10)",
          }}
        >
          {/* Red glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(500px 300px at 110% -20%, rgba(225,29,42,0.18), transparent 60%)" }}
          />
          <div className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] tracking-wide text-white/50 uppercase">היום</p>
                <p className="mt-0.5 text-[32px] font-extrabold leading-none">2</p>
                <p className="text-[12px] text-white/55 mt-0.5">אימונים מתוכננים</p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <FlameIcon className="w-4 h-4" style={{ color: "#E11D2A" }} />
                <span className="text-[12px] font-semibold text-white/80">7 ימים רצופים</span>
              </div>
            </div>

            {/* Mini progress of today */}
            <div className="mt-4 space-y-2">
              {["יואב כהן — 09:00", "דניאל שמש — 18:30"].map((session, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: i === 0 ? "#E11D2A" : "rgba(255,255,255,0.25)" }}
                  />
                  <p className="text-[12.5px] text-white/70">{session}</p>
                  {i === 0 && (
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide"
                      style={{ background: "rgba(225,29,42,0.18)", color: "#FF6B76" }}
                    >
                      עוד מעט
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 rise" style={{ animationDelay: "130ms" }}>
          {[
            { label: "מתאמנים", value: "3", accent: false },
            { label: "אימונים השבוע", value: "7", accent: false },
            { label: "ממוצע ציות", value: "84%", accent: true },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-3.5 flex flex-col gap-1"
              style={{
                background: stat.accent ? "rgba(225,29,42,0.08)" : "rgba(255,255,255,0.04)",
                boxShadow: stat.accent
                  ? "inset 0 0 0 1px rgba(225,29,42,0.22)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              <p
                className="text-[22px] font-extrabold leading-none"
                style={{ color: stat.accent ? "#E11D2A" : "#FAF9F6" }}
              >
                {stat.value}
              </p>
              <p className="text-[9.5px] text-white/45 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Clients */}
        <div className="rise" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13.5px] font-semibold">מתאמנים פעילים</p>
            <button className="tap flex items-center gap-0.5 text-[11px] text-white/45">
              כולם <ChevRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {clients.map((client, i) => (
              <button
                key={i}
                className="tap w-full text-right rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  animationDelay: `${220 + i * 55}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex-shrink-0 grid place-items-center text-[11px] font-bold text-white"
                    style={{ background: client.color + "33", border: `1.5px solid ${client.color}55` }}
                  >
                    <span style={{ color: client.color }}>{client.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px] leading-none">{client.name}</p>
                    <p className="text-[10.5px] text-white/40 mt-0.5">{client.plan}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-[13px] font-bold leading-none">{client.weight} <span className="text-[10px] font-normal text-white/40">ק״ג</span></p>
                    <p className="text-[9.5px] text-white/35 mt-0.5">יעד {client.goal}</p>
                  </div>
                </div>

                {/* Adherence */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: "#E11D2A", width: `${client.adherence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/35 flex-shrink-0">{client.adherence}%</span>
                  <span className="text-[10px] text-white/30 flex-shrink-0">· {client.lastWorkout}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add client CTA */}
        <button
          className="tap w-full h-[50px] rounded-full flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white rise"
          style={{
            animationDelay: "440ms",
            background: "#E11D2A",
            boxShadow: "0 10px 28px rgba(225,29,42,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          <PlusIcon className="w-4 h-4" />
          הוסף מתאמן
        </button>

      </div>
    </main>
  );
}
