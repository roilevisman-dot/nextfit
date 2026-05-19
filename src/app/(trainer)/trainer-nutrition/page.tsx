"use client";

const plans = [
  { name: "תפריט שומן רווי", calories: 1920, protein: 158, assignedTo: 2, lastUpdated: "12/05" },
  { name: "תפריט Full Body", calories: 2100, protein: 140, assignedTo: 1, lastUpdated: "08/05" },
];

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UtensilsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

export default function TrainerNutritionPage() {
  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">ניהול</div>
            <h1 className="mt-1 text-[26px] font-extrabold leading-tight">תפריטי תזונה</h1>
            <p className="text-[11.5px] text-white/40 mt-0.5">{plans.length} תפריטים פעילים</p>
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
                  <UtensilsIcon className="w-[18px] h-[18px]" style={{ color: "#E11D2A" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13.5px]">{plan.name}</p>
                  <p className="text-[11px] text-white/40">עודכן {plan.lastUpdated}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "קלוריות", value: plan.calories },
                  { label: "חלבון (g)", value: plan.protein },
                  { label: "מתאמנים", value: plan.assignedTo },
                ].map((s, si) => (
                  <div
                    key={si}
                    className="rounded-xl p-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-[16px] font-bold leading-none">{s.value}</p>
                    <p className="text-[9.5px] text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

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
          }}
        >
          <div
            className="w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "rgba(225,29,42,0.10)" }}
          >
            <PlusIcon className="w-4 h-4" style={{ color: "#E11D2A" }} />
          </div>
          <p className="text-[13px] font-medium">צור תפריט חדש</p>
          <p className="text-[11px] text-white/35">בנה תפריט תזונה מותאם אישית למתאמן</p>
        </button>

      </div>
    </main>
  );
}
