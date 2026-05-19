"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Client = {
  id: string;
  name: string;
  invite_code: string;
  active: boolean;
  created_at: string;
  current_weight: number | null;
  goal_weight: number | null;
};

function generateCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function getInitials(name: string) {
  return name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2);
}

const avatarColors = ["#5B4CF5", "#0EA5E9", "#10B981", "#F97316", "#EC4899"];

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const supabase = createClient();

  const fetchClients = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("coach_id", user.id)
      .eq("active", true)
      .order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addClient = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("clients").insert({
      coach_id: user.id,
      name: newName.trim(),
      invite_code: generateCode(),
    });
    if (!error) { setNewName(""); setShowModal(false); fetchClients(); }
    setSaving(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between rise">
          <div>
            <div className="text-[10.5px] tracking-[0.34em] uppercase text-white/45">ניהול</div>
            <h1 className="mt-1 text-[26px] font-extrabold leading-tight">מתאמנים</h1>
            <p className="text-[11.5px] text-white/40 mt-0.5">
              {loading ? "טוען..." : `${clients.length} מתאמנים פעילים`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="tap mt-1 w-10 h-10 rounded-full grid place-items-center"
            style={{ background: "#E11D2A", boxShadow: "0 6px 18px rgba(225,29,42,0.40)" }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Clients list */}
        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[88px] rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl grid place-items-center"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <UserIcon className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-[13px] text-white/40">אין מתאמנים עדיין</p>
            <p className="text-[11px] text-white/25">לחץ + להוסיף את המתאמן הראשון</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {clients.map((client, i) => (
              <div
                key={client.id}
                className="tap rounded-2xl p-4 rise cursor-pointer"
                style={{
                  animationDelay: `${i * 55}ms`,
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full grid place-items-center text-[13px] font-bold flex-shrink-0"
                    style={{
                      background: avatarColors[i % avatarColors.length] + "22",
                      border: `1.5px solid ${avatarColors[i % avatarColors.length]}44`,
                      color: avatarColors[i % avatarColors.length],
                    }}
                  >
                    {getInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px]">{client.name}</p>
                    <p className="text-[11px] text-white/40">
                      {client.current_weight ? `${client.current_weight} ק״ג` : "אין משקל עדיין"}
                    </p>
                  </div>
                  <span
                    className="text-[9.5px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
                  >
                    פעיל
                  </span>
                </div>

                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div>
                    <p className="text-[9.5px] text-white/35">קוד הצטרפות</p>
                    <p className="text-[15px] font-bold tracking-[0.18em] mt-0.5">{client.invite_code}</p>
                  </div>
                  <button
                    className="tap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
                    style={{
                      background: copied === client.invite_code ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
                      color: copied === client.invite_code ? "#10B981" : "rgba(255,255,255,0.55)",
                      boxShadow: `inset 0 0 0 1px ${copied === client.invite_code ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}
                    onClick={(e) => { e.stopPropagation(); copyCode(client.invite_code); }}
                  >
                    <CopyIcon className="w-3 h-3" />
                    {copied === client.invite_code ? "הועתק!" : "העתק"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add client modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full rounded-t-3xl p-6 pb-12"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.15)" }} />
            <h3 className="text-[18px] font-bold mb-1">מתאמן חדש</h3>
            <p className="text-[12px] text-white/40 mb-4">יווצר קוד הצטרפות אוטומטית</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="שם מלא"
              className="w-full h-14 rounded-2xl px-4 text-white text-[16px] outline-none"
              style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(225,29,42,0.35)", caretColor: "#E11D2A" }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && addClient()}
            />
            <button
              className="tap mt-3 w-full h-12 rounded-full font-semibold text-white disabled:opacity-40"
              style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
              onClick={addClient}
              disabled={saving || !newName.trim()}
            >
              {saving ? "יוצר..." : "צור קוד הצטרפות"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
