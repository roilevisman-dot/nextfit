"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ClientPlan = {
  clientId: string;
  clientName: string;
  planId: string;
  planName: string;
  totalCalories: number | null;
  updatedAt: string;
};

type ClientNoPlan = {
  clientId: string;
  clientName: string;
};

function PlusIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14" /></svg>;
}
function UtensilsIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
}
function ChevronIcon(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6" /></svg>;
}

const avatarColors = ["#5B4CF5","#0EA5E9","#10B981","#F97316","#EC4899"];
function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2);
}
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}`;
}

export default function TrainerNutritionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [withPlan, setWithPlan] = useState<ClientPlan[]>([]);
  const [noPlan, setNoPlan] = useState<ClientNoPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // All clients of this coach
      const { data: clients } = await supabase.from("clients")
        .select("id, name")
        .eq("coach_id", user.id)
        .eq("active", true)
        .order("name");
      if (!clients) { setLoading(false); return; }

      // Active meal plan per client
      const { data: cmps } = await supabase.from("client_meal_plans")
        .select("client_id, meal_plan_id")
        .in("client_id", clients.map((c) => c.id))
        .eq("active", true);

      const planIds = [...new Set((cmps ?? []).map((r) => r.meal_plan_id))];
      let plansMap: Record<string, { name: string; total_calories: number | null; created_at: string }> = {};

      if (planIds.length > 0) {
        const { data: plans } = await supabase.from("meal_plans")
          .select("id, name, total_calories, created_at")
          .in("id", planIds);
        for (const p of plans ?? []) plansMap[p.id] = p;
      }

      const withArr: ClientPlan[] = [];
      const noArr: ClientNoPlan[] = [];

      for (const client of clients) {
        const cmp = (cmps ?? []).find((r) => r.client_id === client.id);
        if (cmp && plansMap[cmp.meal_plan_id]) {
          const plan = plansMap[cmp.meal_plan_id];
          withArr.push({
            clientId: client.id,
            clientName: client.name,
            planId: cmp.meal_plan_id,
            planName: plan.name,
            totalCalories: plan.total_calories,
            updatedAt: formatDate(plan.created_at),
          });
        } else {
          noArr.push({ clientId: client.id, clientName: client.name });
        }
      }

      setWithPlan(withArr);
      setNoPlan(noArr);
      setLoading(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-40 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[1,2,3].map((i) => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
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
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight">תפריטי תזונה</h1>
          <p className="text-[11.5px] text-white/40 mt-0.5">
            {withPlan.length > 0 ? `${withPlan.length} מתאמנים עם תפריט פעיל` : "אין תפריטים פעילים עדיין"}
          </p>
        </div>

        {/* Clients with plans */}
        {withPlan.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[10.5px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>תפריטים פעילים</p>
            {withPlan.map((item, i) => (
              <button key={item.clientId}
                onClick={() => router.push(`/clients/${item.clientId}/nutrition`)}
                className="tap w-full rounded-2xl p-4 flex items-center gap-4 text-right rise"
                style={{ animationDelay: `${i * 50}ms`, background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl grid place-items-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: avatarColors[i % avatarColors.length] + "22", color: avatarColors[i % avatarColors.length] }}>
                  {getInitials(item.clientName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px]">{item.clientName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>{item.planName}</span>
                    {item.totalCalories && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(225,29,42,0.12)", color: "#FF8A95" }}>
                        {item.totalCalories.toLocaleString()} קל׳
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>עודכן {item.updatedAt}</p>
                </div>

                <ChevronIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.20)" }} />
              </button>
            ))}
          </div>
        )}

        {/* Clients without plans */}
        {noPlan.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[10.5px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>ללא תפריט</p>
            {noPlan.map((item) => (
              <button key={item.clientId}
                onClick={() => router.push(`/clients/${item.clientId}/nutrition`)}
                className="tap w-full rounded-2xl p-4 flex items-center gap-4 text-right"
                style={{ background: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>

                <div className="w-11 h-11 rounded-2xl grid place-items-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                  {getInitials(item.clientName)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>{item.clientName}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>לחץ לבניית תפריט</p>
                </div>

                <div className="w-7 h-7 rounded-full grid place-items-center flex-shrink-0"
                  style={{ background: "rgba(225,29,42,0.10)" }}>
                  <PlusIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {withPlan.length === 0 && noPlan.length === 0 && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
            <UtensilsIcon className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.20)" }} />
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>אין מתאמנים עדיין</p>
            <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>הוסף מתאמנים מדף הלקוחות</p>
          </div>
        )}
      </div>
    </main>
  );
}
