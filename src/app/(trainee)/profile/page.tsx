"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ClientData = {
  name: string;
  created_at: string;
  current_weight: number | null;
  goal_weight: number | null;
  age: number | null;
  phone: string | null;
  email: string | null;
  height_cm: number | null;
  goal: string | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
};

function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

export default function ProfilePage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const cid = typeof window !== "undefined" ? localStorage.getItem("nextfit_client_id") : null;
    if (!cid) { window.location.href = "/join"; return; }
    supabase
      .from("clients")
      .select("name, created_at, current_weight, goal_weight, age, phone, email, height_cm, goal, chest_cm, waist_cm, hips_cm, arm_cm, thigh_cm")
      .eq("id", cid)
      .single()
      .then(({ data }) => {
        if (data) setClient(data);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("nextfit_client_id");
    window.location.href = "/";
  };

  const daysSinceJoin = client
    ? Math.floor((Date.now() - new Date(client.created_at).getTime()) / 86400000)
    : 0;
  const weeksSinceJoin = Math.floor(daysSinceJoin / 7);

  if (loading) {
    return (
      <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08" }}>
        <div className="px-5 pt-[58px] space-y-4">
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="w-20 h-20 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="h-6 w-32 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen font-heb pb-10 flex flex-col items-center justify-center" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
        <UserIcon className="w-10 h-10 mb-3" style={{ color: "rgba(255,255,255,0.20)" }} />
        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.40)" }}>לא נמצא פרופיל</p>
      </main>
    );
  }

  const personalRows = [
    { label: "גיל", value: client.age ? `${client.age}` : null },
    { label: "גובה", value: client.height_cm ? `${client.height_cm} ס"מ` : null },
    { label: "טלפון", value: client.phone },
    { label: "אימייל", value: client.email },
    { label: "מטרה", value: client.goal },
    { label: "חזה", value: client.chest_cm ? `${client.chest_cm} ס"מ` : null },
    { label: "מותניים", value: client.waist_cm ? `${client.waist_cm} ס"מ` : null },
    { label: "ירכיים", value: client.hips_cm ? `${client.hips_cm} ס"מ` : null },
    { label: "זרוע", value: client.arm_cm ? `${client.arm_cm} ס"מ` : null },
    { label: "ירך", value: client.thigh_cm ? `${client.thigh_cm} ס"מ` : null },
  ].filter((r): r is { label: string; value: string } => r.value !== null && r.value !== undefined);

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Avatar section */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-2 rise">
          <div
            className="w-20 h-20 rounded-full grid place-items-center text-[28px] font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, #FF4A57, #B81522)" }}
          >
            {getInitials(client.name)}
          </div>
          <div className="text-center">
            <h1 className="text-[20px] font-bold">{client.name}</h1>
            <p className="text-[12px] text-white/45 mt-0.5">מתאמן</p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="grid grid-cols-3 gap-2 rise" style={{ animationDelay: "60ms" }}>
          {[
            { label: "ימים", value: String(daysSinceJoin) },
            { label: "שבועות", value: String(weeksSinceJoin) },
            { label: "משקל נוכחי", value: client.current_weight ? `${client.current_weight}` : "—" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-3.5 text-center"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <p className="text-[20px] font-extrabold leading-none">{s.value}</p>
              <p className="text-[9.5px] text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Personal details */}
        {personalRows.length > 0 && (
          <div className="rise" style={{ animationDelay: "100ms" }}>
            <p className="text-[10.5px] tracking-[0.30em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.30)" }}>פרטים אישיים</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
              {personalRows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < personalRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>{row.label}</span>
                  <span className="text-[13px] font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="tap w-full flex items-center gap-3 px-4 py-4 rounded-2xl rise"
          style={{ animationDelay: "180ms", background: "rgba(225,29,42,0.07)", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.18)" }}
        >
          <LogOutIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#E11D2A" }} />
          <span className="text-[13.5px] font-medium" style={{ color: "#FF8A95" }}>התנתק</span>
        </button>

      </div>
    </main>
  );
}
