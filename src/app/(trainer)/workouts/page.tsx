"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Plan = {
  id: string;
  name: string;
  days_per_week: number;
  created_at: string;
  totalExercises: number;
  clients: { id: string; name: string }[];
};

function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12" />
    </svg>
  );
}


function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: rawPlans } = await supabase
        .from("workout_plans")
        .select(`
          id, name, days_per_week, created_at,
          workout_days ( id, plan_exercises ( id ) ),
          client_plans ( client_id, active, clients ( id, name ) )
        `)
        .eq("coach_id", user.id)
        .order("created_at", { ascending: false });

      if (!rawPlans) { setLoading(false); return; }

      const mapped: Plan[] = rawPlans.map((p) => {
        const days = (p.workout_days as { id: string; plan_exercises: { id: string }[] }[]) ?? [];
        const totalExercises = days.reduce((sum, d) => sum + (d.plan_exercises?.length ?? 0), 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activeCPs = ((p.client_plans as any[]) ?? []).filter((cp) => cp.active && cp.clients);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clients = activeCPs.map((cp: any) => ({ id: cp.clients.id, name: cp.clients.name }));
        return { id: p.id, name: p.name, days_per_week: p.days_per_week, created_at: p.created_at, totalExercises, clients };
      });

      setPlans(mapped);
      setLoading(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-40 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[1, 2].map((i) => (
            <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Header */}
        <div className="rise">
          <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">ניהול</div>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight">תוכניות אימון</h1>
          <p className="text-[11.5px] text-white/40 mt-0.5">{plans.length} תוכניות פעילות</p>
        </div>

        {/* Empty state */}
        {plans.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <DumbbellIcon className="w-10 h-10 mb-2" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.40)" }}>אין תוכניות אימון עדיין</p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>בנה תוכנית מתוך פרופיל המתאמן</p>
          </div>
        )}

        {/* Plans list */}
        <div className="space-y-2.5">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className="rounded-2xl p-4 rise"
              style={{ animationDelay: `${i * 60}ms`, background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              {/* Title row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0" style={{ background: "rgba(225,29,42,0.10)" }}>
                  <DumbbellIcon className="w-5 h-5" style={{ color: "#E11D2A" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13.5px]">{plan.name}</p>
                  <p className="text-[11px] text-white/40">עודכן {formatDate(plan.created_at)}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "ימי אימון", value: plan.days_per_week },
                  { label: "תרגילים", value: plan.totalExercises },
                  { label: "מתאמנים", value: plan.clients.length },
                ].map((s, si) => (
                  <div key={si} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <p className="text-[18px] font-bold leading-none">{s.value}</p>
                    <p className="text-[9.5px] text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Client names */}
              {plan.clients.length > 0 && (
                <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {plan.clients.map((c) => c.name).join(", ")}
                </p>
              )}

              {/* View buttons per client */}
              <div className="flex flex-col gap-1.5">
                {plan.clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => router.push(`/clients/${c.id}/workout/view`)}
                    className="tap w-full h-9 rounded-xl text-[12.5px] font-medium flex items-center justify-center gap-2"
                    style={{ background: "rgba(225,29,42,0.10)", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.20)", color: "#E11D2A" }}
                  >
                    צפה בתוכנית — {c.name}
                  </button>
                ))}
                {plan.clients.length === 0 && (
                  <p className="text-[11px] text-center py-1" style={{ color: "rgba(255,255,255,0.25)" }}>לא משויך למתאמן</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
