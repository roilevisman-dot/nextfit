"use client";

import { NFMark } from "@/components/NFMark";

const clients = [
  { name: "יואב כהן", lastWorkout: "אתמול", weight: 82.5, goal: 78, plan: "Push/Pull/Legs", adherence: 88 },
  { name: "מיכל ברק", lastWorkout: "לפני 2 ימים", weight: 65.2, goal: 60, plan: "Full Body", adherence: 72 },
  { name: "דניאל שמש", lastWorkout: "לפני 3 ימים", weight: 91.0, goal: 85, plan: "Push/Pull/Legs", adherence: 95 },
];

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

function ChevRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      {/* Top bar */}
      <div className="px-5 pt-[58px] pb-4 flex items-center justify-between">
        <NFMark size={28} />
        <button
          className="tap w-9 h-9 grid place-items-center rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
        >
          <BellIcon className="w-[18px] h-[18px] text-white/70" />
        </button>
      </div>

      <div className="px-5 space-y-6 pb-10">
        {/* Greeting */}
        <div className="rise">
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/55">לוח בקרה</div>
          <h1 className="mt-1.5 text-[30px] leading-[1.1] tracking-tight">
            שלום, <span className="font-extrabold">מאמן</span>
            <span style={{ color: "#E11D2A" }}>.</span>
          </h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2.5 rise" style={{ animationDelay: "60ms" }}>
          {[
            { label: "מתאמנים", value: "3" },
            { label: "אימונים השבוע", value: "7" },
            { label: "ממוצע ציות", value: "84%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex flex-col gap-1"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <p className="text-[22px] font-extrabold" style={{ color: i === 2 ? "#E11D2A" : "#FAF9F6" }}>{stat.value}</p>
              <p className="text-[10px] text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Clients */}
        <div className="rise" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold">מתאמנים פעילים</p>
            <button className="text-[11.5px] text-white/50 flex items-center gap-0.5">
              כולם <ChevRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {clients.map((client, i) => (
              <button
                key={i}
                className="tap w-full text-right rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                  animationDelay: `${160 + i * 60}ms`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[14px]">{client.name}</p>
                    <p className="text-[11px] text-white/45 mt-0.5">אחרון: {client.lastWorkout}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold">{client.weight} <span className="text-[11px] font-normal text-white/50">ק״ג</span></p>
                    <p className="text-[10px] text-white/40">יעד: {client.goal}</p>
                  </div>
                </div>
                {/* Adherence bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: "#E11D2A", width: `${client.adherence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">{client.adherence}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add client */}
        <button
          className="tap w-full h-12 rounded-full flex items-center justify-center gap-2 text-[13.5px] font-medium text-white/70 rise"
          style={{
            animationDelay: "400ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
          }}
        >
          <PlusIcon className="w-4 h-4" />
          הוסף מתאמן
        </button>
      </div>
    </main>
  );
}
