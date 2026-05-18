"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Plus, Copy, User } from "lucide-react";
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

function generateCode(name: string): string {
  const letters = name.replace(/\s/g, "").slice(0, 2).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${num}`;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
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

    const code = generateCode(newName);
    const { error } = await supabase.from("clients").insert({
      coach_id: user.id,
      name: newName.trim(),
      invite_code: code,
    });

    if (!error) {
      setNewName("");
      setShowNew(false);
      fetchClients();
    }
    setSaving(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="px-5 pt-8 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">מתאמנים</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "טוען..." : `${clients.length} מתאמנים פעילים`}
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#c8ff00" }}
        >
          <Plus className="w-5 h-5" style={{ color: "#0a0a0a" }} />
        </button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">אין מתאמנים עדיין</p>
          <p className="text-xs mt-1">לחץ + להוסיף את המתאמן הראשון</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.current_weight ? `${client.current_weight} ק״ג` : "אין משקל עדיין"}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(200,255,0,0.1)", color: "#c8ff00" }}>
                  פעיל
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">קוד הצטרפות</p>
                  <p className="text-sm font-bold text-foreground tracking-widest">{client.invite_code}</p>
                </div>
                <button
                  onClick={() => copyCode(client.invite_code)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary transition-colors"
                  style={{ color: copied === client.invite_code ? "#c8ff00" : "#737373" }}
                >
                  <Copy className="w-3 h-3" />
                  {copied === client.invite_code ? "הועתק!" : "העתק"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showNew && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowNew(false)}
        >
          <motion.div
            className="w-full bg-card border-t border-border rounded-t-3xl p-6 pb-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">מתאמן חדש</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="שם מלא"
                className="w-full bg-secondary border border-border rounded-2xl px-4 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                style={{ height: "52px" }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addClient()}
              />
              <button
                className="w-full h-12 rounded-2xl font-semibold text-sm disabled:opacity-40"
                style={{ background: "#c8ff00", color: "#0a0a0a" }}
                onClick={addClient}
                disabled={saving || !newName.trim()}
              >
                {saving ? "יוצר..." : "צור קוד הצטרפות"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
