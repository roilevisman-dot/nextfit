"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Scale, Camera, Plus } from "lucide-react";

const weightLog = [
  { date: "17/05", weight: 82.5 },
  { date: "10/05", weight: 83.1 },
  { date: "03/05", weight: 84.0 },
  { date: "26/04", weight: 84.8 },
  { date: "19/04", weight: 85.5 },
];

export default function ProgressPage() {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const latest = weightLog[0].weight;
  const first = weightLog[weightLog.length - 1].weight;
  const diff = (latest - first).toFixed(1);
  const minW = Math.min(...weightLog.map((w) => w.weight));
  const maxW = Math.max(...weightLog.map((w) => w.weight));

  return (
    <div className="px-5 pt-12 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">התקדמות</h1>
          <p className="text-muted-foreground text-sm mt-1">מעקב משקל ותמונות</p>
        </div>
        <button
          onClick={() => setShowWeightModal(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#c8ff00" }}
        >
          <Plus className="w-5 h-5" style={{ color: "#0a0a0a" }} />
        </button>
      </motion.div>

      {/* Weight summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">משקל נוכחי</p>
          <p className="text-2xl font-bold text-foreground">{latest}
            <span className="text-sm font-normal text-muted-foreground"> ק״ג</span>
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">שינוי כולל</p>
          <p className="text-2xl font-bold" style={{ color: Number(diff) < 0 ? "#4ade80" : "#f87171" }}>
            {Number(diff) < 0 ? "" : "+"}{diff}
            <span className="text-sm font-normal text-muted-foreground"> ק״ג</span>
          </p>
        </div>
      </motion.div>

      {/* Weight chart (simple bars) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-3xl p-5"
      >
        <p className="text-sm font-semibold text-foreground mb-4">היסטוריית משקל</p>
        <div className="flex items-end gap-2 h-28">
          {[...weightLog].reverse().map((entry, i) => {
            const range = maxW - minW || 1;
            const heightPct = ((entry.weight - minW) / range) * 70 + 30;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{entry.weight}</span>
                <motion.div
                  className="w-full rounded-t-lg"
                  style={{ background: i === weightLog.length - 1 ? "#c8ff00" : "rgba(200,255,0,0.25)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }}
                />
                <span className="text-[10px] text-muted-foreground">{entry.date}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Weight log list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-card border border-border rounded-3xl overflow-hidden"
      >
        <div className="p-5 pb-3 flex items-center gap-2">
          <Scale className="w-4 h-4" style={{ color: "#c8ff00" }} />
          <p className="text-sm font-semibold text-foreground">שקילות אחרונות</p>
        </div>
        {weightLog.map((entry, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between border-t border-border">
            <span className="text-sm text-muted-foreground">{entry.date}</span>
            <span className="text-sm font-semibold text-foreground">{entry.weight} ק״ג</span>
          </div>
        ))}
      </motion.div>

      {/* Progress photos placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-3xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-4 h-4" style={{ color: "#c8ff00" }} />
          <p className="text-sm font-semibold text-foreground">תמונות התקדמות</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-secondary border border-border flex items-center justify-center">
              <Camera className="w-6 h-6 text-muted-foreground/40" />
            </div>
          ))}
        </div>
        <button className="w-full mt-3 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          הוסף תמונה
        </button>
      </motion.div>

      {/* Add weight modal */}
      {showWeightModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowWeightModal(false)}
        >
          <motion.div
            className="w-full bg-card border-t border-border rounded-t-3xl p-6 pb-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">הוספת שקילה</h3>
            <div className="flex flex-col gap-3">
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="משקל בק״ג (לדוגמה: 82.5)"
                className="w-full h-14 bg-secondary border border-border rounded-2xl px-4 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-center text-xl font-bold"
                autoFocus
              />
              <button
                className="w-full h-12 rounded-2xl font-semibold text-sm"
                style={{ background: "#c8ff00", color: "#0a0a0a" }}
                onClick={() => setShowWeightModal(false)}
              >
                שמור
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
