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

const EMPTY_FORM = {
  name: "", age: "", phone: "", email: "",
  height_cm: "", current_weight: "", goal_weight: "", goal: "",
  chest_cm: "", waist_cm: "", hips_cm: "", arm_cm: "", thigh_cm: "",
};
type NewForm = typeof EMPTY_FORM;

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

const INP_STYLE = {
  background: "rgba(255,255,255,0.07)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
  caretColor: "#E11D2A",
} as const;

const INP_CLASS = "w-full h-11 rounded-xl px-3 text-white text-[14px] outline-none";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<NewForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const supabase = createClient();

  const set = (key: keyof NewForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewClient((p) => ({ ...p, [key]: e.target.value }));

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
    if (!newClient.name.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const n = newClient;
    const { error } = await supabase.from("clients").insert({
      coach_id: user.id,
      name: n.name.trim(),
      invite_code: generateCode(),
      age: n.age ? parseInt(n.age) : null,
      phone: n.phone.trim() || null,
      email: n.email.trim() || null,
      height_cm: n.height_cm ? parseFloat(n.height_cm) : null,
      current_weight: n.current_weight ? parseFloat(n.current_weight) : null,
      goal_weight: n.goal_weight ? parseFloat(n.goal_weight) : null,
      goal: n.goal.trim() || null,
      chest_cm: n.chest_cm ? parseFloat(n.chest_cm) : null,
      waist_cm: n.waist_cm ? parseFloat(n.waist_cm) : null,
      hips_cm: n.hips_cm ? parseFloat(n.hips_cm) : null,
      arm_cm: n.arm_cm ? parseFloat(n.arm_cm) : null,
      thigh_cm: n.thigh_cm ? parseFloat(n.thigh_cm) : null,
    });
    if (!error) { setNewClient(EMPTY_FORM); setShowModal(false); fetchClients(); }
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
            className="w-full rounded-t-3xl flex flex-col"
            style={{ background: "#111009", boxShadow: "0 -1px 0 rgba(255,255,255,0.08)", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex-shrink-0">
              <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold">מתאמן חדש</h3>
                <button onClick={() => setShowModal(false)} className="tap text-[13px]" style={{ color: "rgba(255,255,255,0.40)" }}>ביטול</button>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="overflow-y-auto flex-1 px-6 space-y-5 pb-4">

              {/* Contact */}
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>פרטי קשר</p>
                <div>
                  <p className="text-[10.5px] text-white/40 mb-1.5">שם מלא *</p>
                  <input
                    type="text" value={newClient.name} onChange={set("name")}
                    placeholder="ישראל ישראלי" className={INP_CLASS} autoFocus
                    style={{ ...INP_STYLE, boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.35)" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">גיל</p>
                    <input type="number" inputMode="numeric" value={newClient.age} onChange={set("age")} placeholder="25" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">טלפון</p>
                    <input type="tel" inputMode="tel" value={newClient.phone} onChange={set("phone")} placeholder="050-0000000" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div>
                  <p className="text-[10.5px] text-white/40 mb-1.5">אימייל</p>
                  <input type="email" inputMode="email" value={newClient.email} onChange={set("email")} placeholder="israel@example.com" className={INP_CLASS} style={INP_STYLE} />
                </div>
              </div>

              {/* Physical */}
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>פרטים גופניים</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">גובה (ס&quot;מ)</p>
                    <input type="number" inputMode="decimal" value={newClient.height_cm} onChange={set("height_cm")} placeholder="175" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">משקל התחלתי (ק&quot;ג)</p>
                    <input type="number" inputMode="decimal" value={newClient.current_weight} onChange={set("current_weight")} placeholder="80" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">משקל יעד (ק&quot;ג)</p>
                    <input type="number" inputMode="decimal" value={newClient.goal_weight} onChange={set("goal_weight")} placeholder="70" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div>
                  <p className="text-[10.5px] text-white/40 mb-1.5">מטרה</p>
                  <input type="text" value={newClient.goal} onChange={set("goal")} placeholder="הורדת שומן, חיזוק שרירים..." className={INP_CLASS} style={INP_STYLE} />
                </div>
              </div>

              {/* Circumferences */}
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.30em] uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>היקפים (ס&quot;מ)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">חזה</p>
                    <input type="number" inputMode="decimal" value={newClient.chest_cm} onChange={set("chest_cm")} placeholder="100" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">מותניים</p>
                    <input type="number" inputMode="decimal" value={newClient.waist_cm} onChange={set("waist_cm")} placeholder="85" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">ירכיים</p>
                    <input type="number" inputMode="decimal" value={newClient.hips_cm} onChange={set("hips_cm")} placeholder="100" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">זרוע</p>
                    <input type="number" inputMode="decimal" value={newClient.arm_cm} onChange={set("arm_cm")} placeholder="35" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                  <div>
                    <p className="text-[10.5px] text-white/40 mb-1.5">ירך</p>
                    <input type="number" inputMode="decimal" value={newClient.thigh_cm} onChange={set("thigh_cm")} placeholder="55" className={INP_CLASS} style={INP_STYLE} />
                  </div>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="px-6 pb-10 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                className="tap w-full h-12 rounded-full font-semibold text-white disabled:opacity-40"
                style={{ background: "#E11D2A", boxShadow: "0 10px 24px rgba(225,29,42,0.40)" }}
                onClick={addClient}
                disabled={saving || !newClient.name.trim()}
              >
                {saving ? "יוצר..." : "צור קוד הצטרפות"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
