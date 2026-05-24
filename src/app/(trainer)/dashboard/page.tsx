"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NFMark } from "@/components/NFMark";

type ClientRow = {
  id: string;
  name: string;
  current_weight: number | null;
  goal_weight: number | null;
  planName: string | null;
  mealsToday: number;
  totalMeals: number;
};

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14M5 12h14" /></svg>;
}
function ChevRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 6 6 6-6 6" /></svg>;
}
function UtensilsIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

const avatarColors = ["#5B4CF5", "#0EA5E9", "#10B981", "#F97316", "#EC4899"];
function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2);
}

const HEB_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const HEB_MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [trainerName, setTrainerName] = useState("מאמן");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const todayLabel = (() => {
    const d = new Date();
    return `יום ${HEB_DAYS[d.getDay()]}, ${d.getDate()} ב${HEB_MONTHS[d.getMonth()]}`;
  })();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Trainer name from auth metadata
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "מאמן";
      setTrainerName(name.split(" ")[0]);

      // All active clients
      const { data: clientsData } = await supabase.from("clients")
        .select("id, name, current_weight, goal_weight")
        .eq("coach_id", user.id).eq("active", true)
        .order("created_at", { ascending: false });
      if (!clientsData || clientsData.length === 0) { setLoading(false); return; }

      const enriched: ClientRow[] = await Promise.all(
        clientsData.map(async (c) => {
          // Active meal plan name
          const { data: cmp } = await supabase.from("client_meal_plans")
            .select("meal_plan_id").eq("client_id", c.id).eq("active", true)
            .order("id", { ascending: false }).limit(1).maybeSingle();

          let planName: string | null = null;
          let totalMeals = 0;
          if (cmp?.meal_plan_id) {
            const { data: plan } = await supabase.from("meal_plans")
              .select("name").eq("id", cmp.meal_plan_id).single();
            if (plan) planName = plan.name;

            const { count } = await supabase.from("meals")
              .select("id", { count: "exact", head: true })
              .eq("plan_id", cmp.meal_plan_id);
            totalMeals = count ?? 0;
          }

          // Meals logged today
          const { count: mealsToday } = await supabase.from("meal_logs")
            .select("id", { count: "exact", head: true })
            .eq("client_id", c.id).eq("log_date", today);

          return {
            id: c.id,
            name: c.name,
            current_weight: c.current_weight,
            goal_weight: c.goal_weight,
            planName,
            mealsToday: mealsToday ?? 0,
            totalMeals,
          };
        })
      );

      setClients(enriched);
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stats
  const totalMealsLoggedToday = clients.reduce((s, c) => s + c.mealsToday, 0);
  const totalMealsPlanned = clients.reduce((s, c) => s + c.totalMeals, 0);
  const adherencePct = totalMealsPlanned > 0
    ? Math.round((totalMealsLoggedToday / totalMealsPlanned) * 100)
    : 0;
  const clientsWithActivity = clients.filter((c) => c.mealsToday > 0).length;

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <div className="px-5 pt-[58px] space-y-5">
          <div className="h-7 w-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-36 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
          </div>
          {[1,2].map((i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb" style={{ background: "#0B0A08", color: "#FAF9F6" }}>

      {/* Top bar */}
      <div className="px-5 pt-[58px] pb-3 flex items-center justify-between rise">
        <NFMark size={28} />
        <button className="tap w-9 h-9 grid place-items-center rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <BellIcon className="w-[17px] h-[17px] text-white/60" />
        </button>
      </div>

      <div className="px-5 space-y-5 pb-12">

        {/* Greeting */}
        <div className="rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">לוח בקרה</div>
          <h1 className="mt-1 text-[28px] leading-[1.15] tracking-tight">
            שלום, <span className="font-extrabold">{trainerName}</span><span style={{ color: "#E11D2A" }}>.</span>
          </h1>
        </div>

        {/* Hero card */}
        <div className="relative rounded-3xl overflow-hidden rise"
          style={{
            animationDelay: "80ms",
            background: "linear-gradient(135deg, #1A0E0F 0%, #110C1A 100%)",
            boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.18), 0 0 60px rgba(225,29,42,0.10)",
          }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(500px 300px at 110% -20%, rgba(225,29,42,0.18), transparent 60%)" }} />
          <div className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] tracking-wide text-white/50 uppercase">היום</p>
                <p className="mt-0.5 text-[32px] font-extrabold leading-none">{clientsWithActivity}</p>
                <p className="text-[12px] text-white/55 mt-0.5">
                  {clientsWithActivity === 1 ? "מתאמן אכל היום" : clientsWithActivity === 0 ? "מתאמנים אכלו היום" : "מתאמנים אכלו היום"}
                </p>
              </div>
              <div className="text-left">
                <p className="text-[11px] text-white/40">{todayLabel}</p>
                {totalMealsPlanned > 0 && (
                  <p className="text-[13px] font-semibold text-white/70 mt-1">
                    {totalMealsLoggedToday}/{totalMealsPlanned} ארוחות
                  </p>
                )}
              </div>
            </div>

            {clients.length > 0 && (
              <div className="mt-4 space-y-2">
                {clients.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: c.mealsToday > 0 ? "#10B981" : "rgba(255,255,255,0.20)" }} />
                    <p className="text-[12.5px] text-white/70">{c.name}</p>
                    {c.mealsToday > 0 && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                        {c.mealsToday} ארוחות
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 rise" style={{ animationDelay: "130ms" }}>
          {[
            { label: "מתאמנים", value: String(clients.length), accent: false },
            { label: "ארוחות היום", value: String(totalMealsLoggedToday), accent: false },
            { label: "ציות תזונה", value: totalMealsPlanned > 0 ? `${adherencePct}%` : "—", accent: true },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-3.5 flex flex-col gap-1"
              style={{
                background: stat.accent ? "rgba(225,29,42,0.08)" : "rgba(255,255,255,0.04)",
                boxShadow: stat.accent
                  ? "inset 0 0 0 1px rgba(225,29,42,0.22)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}>
              <p className="text-[22px] font-extrabold leading-none"
                style={{ color: stat.accent ? "#E11D2A" : "#FAF9F6" }}>
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
            <button className="tap flex items-center gap-0.5 text-[11px] text-white/45"
              onClick={() => router.push("/clients")}>
              כולם <ChevRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {clients.length === 0 ? (
            <div className="rounded-2xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
              <UserIcon className="w-7 h-7 mx-auto mb-3 text-white/20" />
              <p className="text-[13px] text-white/35">אין מתאמנים עדיין</p>
              <p className="text-[11px] text-white/25 mt-1">לחץ + להוסיף את המתאמן הראשון</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((client, i) => {
                const adherence = client.totalMeals > 0
                  ? Math.round((client.mealsToday / client.totalMeals) * 100)
                  : 0;
                return (
                  <button key={client.id}
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className="tap w-full text-right rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.035)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                    }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 grid place-items-center text-[11px] font-bold"
                        style={{
                          background: avatarColors[i % avatarColors.length] + "33",
                          border: `1.5px solid ${avatarColors[i % avatarColors.length]}55`,
                          color: avatarColors[i % avatarColors.length],
                        }}>
                        {getInitials(client.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[13.5px] leading-none">{client.name}</p>
                        <p className="text-[10.5px] text-white/40 mt-0.5">
                          {client.planName ?? "אין תפריט פעיל"}
                        </p>
                      </div>
                      {client.current_weight && (
                        <div className="text-left flex-shrink-0">
                          <p className="text-[13px] font-bold leading-none">
                            {client.current_weight} <span className="text-[10px] font-normal text-white/40">ק״ג</span>
                          </p>
                          {client.goal_weight && (
                            <p className="text-[9.5px] text-white/35 mt-0.5">יעד {client.goal_weight}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Today's nutrition progress */}
                    <div className="flex items-center gap-2">
                      <UtensilsIcon className="w-3 h-3 flex-shrink-0 text-white/25" />
                      <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ background: "#E11D2A", width: `${adherence}%`, transition: "width 600ms" }} />
                      </div>
                      <span className="text-[10px] text-white/35 flex-shrink-0">
                        {client.mealsToday}/{client.totalMeals} ארוחות היום
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Add client CTA */}
        <button
          onClick={() => router.push("/clients")}
          className="tap w-full h-[50px] rounded-full flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white rise"
          style={{
            animationDelay: "440ms",
            background: "#E11D2A",
            boxShadow: "0 10px 28px rgba(225,29,42,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}>
          <PlusIcon className="w-4 h-4" />
          הוסף מתאמן
        </button>

      </div>
    </main>
  );
}
