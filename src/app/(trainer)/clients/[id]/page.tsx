"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Client = {
  id: string;
  name: string;
  invite_code: string;
  current_weight: number | null;
  goal_weight: number | null;
  created_at: string;
};

type WeightLog = {
  weight: number;
  logged_at: string;
};

const avatarColors = ["#5B4CF5", "#0EA5E9", "#10B981", "#F97316", "#EC4899"];

function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function WeightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11" />
    </svg>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18l6-6-6-6" />
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

function PlateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-8" /><path d="M22 20H2" />
    </svg>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchClient = useCallback(async () => {
    const [{ data: clientData }, { data: logsData }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase.from("weight_logs").select("weight, logged_at").eq("client_id", clientId).order("logged_at", { ascending: false }).limit(10),
    ]);
    if (clientData) setClient(clientData);
    if (logsData) setWeightLogs(logsData);
    setLoading(false);
  }, [supabase, clientId]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const avatarColor = avatarColors[0];
  const weightDelta = weightLogs.length >= 2
    ? (weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight).toFixed(1)
    : null;
  const daysSinceJoin = client
    ? Math.floor((Date.now() - new Date(client.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const sections = [
    { label: "תוכנית אימון", sub: "ניהול ימים ותרגילים", Icon: DumbbellIcon, href: `/clients/${clientId}/workout` },
    { label: "תפריט תזונה", sub: "ארוחות ומזונות", Icon: PlateIcon, href: `/clients/${clientId}/nutrition` },
    { label: "מעקב התקדמות", sub: "גרף משקל ומדדים", Icon: ChartIcon, href: `/clients/${clientId}/progress` },
  ];

  if (loading) {
    return (
      <main className="min-h-screen font-heb" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-6 space-y-4">
          <div className="h-8 w-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen font-heb flex items-center justify-center" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <p className="text-white/40">מתאמן לא נמצא</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="tap flex items-center gap-1.5 text-[13px] rise"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <BackIcon className="w-4 h-4" />
          מתאמנים
        </button>

        {/* Hero card */}
        <div
          className="rounded-3xl p-5 rise"
          style={{
            animationDelay: "40ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center text-[20px] font-bold flex-shrink-0"
              style={{
                background: avatarColor + "22",
                border: `2px solid ${avatarColor}44`,
                color: avatarColor,
              }}
            >
              {getInitials(client.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-extrabold leading-tight">{client.name}</h1>
              <p className="text-[11.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                קוד: {client.invite_code} · {daysSinceJoin} ימים
              </p>
            </div>
            <span
              className="text-[9.5px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
            >
              פעיל
            </span>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              {
                Icon: WeightIcon,
                label: "משקל נוכחי",
                value: client.current_weight ? `${client.current_weight} ק״ג` : "—",
                color: "#E11D2A",
              },
              {
                Icon: TargetIcon,
                label: "יעד",
                value: client.goal_weight ? `${client.goal_weight} ק״ג` : "—",
                color: "#F97316",
              },
              {
                Icon: CalendarIcon,
                label: "שינוי",
                value: weightDelta !== null ? `${Number(weightDelta) > 0 ? "+" : ""}${weightDelta}` : "—",
                color: Number(weightDelta) < 0 ? "#10B981" : "#F97316",
              },
            ].map(({ Icon, label, value, color }, i) => (
              <div
                key={i}
                className="rounded-2xl p-3 flex flex-col items-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="w-7 h-7 rounded-xl grid place-items-center"
                  style={{ background: color + "18" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <p className="text-[13px] font-bold leading-none">{value}</p>
                <p className="text-[9px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section nav */}
        <div className="space-y-2.5">
          <p className="text-[10.5px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>
            ניהול
          </p>
          {sections.map(({ label, sub, Icon, href }, i) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="tap w-full flex items-center gap-4 rounded-2xl p-4 rise"
              style={{
                animationDelay: `${80 + i * 55}ms`,
                background: "rgba(255,255,255,0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                style={{ background: "rgba(225,29,42,0.10)" }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: "#E11D2A" }} />
              </div>
              <div className="flex-1 text-right">
                <p className="font-semibold text-[14px]">{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
              </div>
              <ChevronIcon className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}
