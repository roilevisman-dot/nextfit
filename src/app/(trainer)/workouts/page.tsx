"use client";

const plans = [
  { name: "Push / Pull / Legs", days: 3, exercises: 12, assignedTo: 2, lastUpdated: "15/05" },
  { name: "Full Body", days: 3, exercises: 9, assignedTo: 1, lastUpdated: "10/05" },
];

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
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


export default function WorkoutsPage() {
  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">ניהול</div>
            <h1 className="mt-1 text-[26px] font-extrabold leading-tight">תוכניות אימון</h1>
            <p className="text-[11.5px] text-white/40 mt-0.5">{plans.length} תוכניות פעילות</p>
          </div>
          <button
            className="tap mt-1 w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "#E11D2A", boxShadow: "0 6px 18px rgba(225,29,42,0.40)" }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-2.5">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 rise"
              style={{
                animationDelay: `${i * 60}ms`,
                background: "rgba(255,255,255,0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              {/* Title row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                  style={{ background: "rgba(225,29,42,0.10)" }}
                >
                  <DumbbellIcon className="w-4.5 h-4.5" style={{ color: "#E11D2A" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13.5px]">{plan.name}</p>
                  <p className="text-[11px] text-white/40">עודכן {plan.lastUpdated}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "ימי אימון", value: plan.days },
                  { label: "תרגילים", value: plan.exercises },
                  { label: "מתאמנים", value: plan.assignedTo },
                ].map((s, si) => (
                  <div
                    key={si}
                    className="rounded-xl p-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-[18px] font-bold leading-none">{s.value}</p>
                    <p className="text-[9.5px] text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Edit button */}
              <button
                className="tap w-full h-9 rounded-xl text-[12.5px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                עריכה
              </button>
            </div>
          ))}
        </div>

        {/* New plan CTA */}
        <button
          className="tap w-full rounded-2xl p-6 flex flex-col items-center gap-2.5 rise"
          style={{
            animationDelay: "180ms",
            background: "rgba(255,255,255,0.02)",
            boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.08)",
            borderStyle: "dashed",
          }}
        >
          <div
            className="w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "rgba(225,29,42,0.10)" }}
          >
            <PlusIcon className="w-4 h-4" style={{ color: "#E11D2A" }} />
          </div>
          <p className="text-[13px] font-medium">צור תוכנית חדשה</p>
          <p className="text-[11px] text-white/35">בנה תוכנית מותאמת אישית למתאמן</p>
        </button>

      </div>
    </main>
  );
}
