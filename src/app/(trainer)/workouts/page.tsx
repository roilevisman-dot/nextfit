"use client";

import { motion } from "framer-motion";
import { Plus, Dumbbell, Copy, Users } from "lucide-react";

const plans = [
  {
    name: "Push/Pull/Legs",
    days: 3,
    exercises: 12,
    assignedTo: 2,
    lastUpdated: "15/05",
  },
  {
    name: "Full Body",
    days: 3,
    exercises: 9,
    assignedTo: 1,
    lastUpdated: "10/05",
  },
];

export default function WorkoutsPage() {
  return (
    <div className="px-5 pt-8 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">תוכניות אימון</h1>
          <p className="text-muted-foreground text-sm mt-1">{plans.length} תוכניות</p>
        </div>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#c8ff00" }}
        >
          <Plus className="w-5 h-5" style={{ color: "#0a0a0a" }} />
        </button>
      </motion.div>

      <div className="flex flex-col gap-3">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-card border border-border rounded-3xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(200,255,0,0.12)" }}>
                  <Dumbbell className="w-5 h-5" style={{ color: "#c8ff00" }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">עודכן {plan.lastUpdated}</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-primary transition-colors">
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-4">
              {[
                { label: "ימי אימון", value: plan.days },
                { label: "תרגילים", value: plan.exercises },
              ].map((s, si) => (
                <div key={si} className="flex-1 bg-secondary rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
              <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5" style={{ color: "#c8ff00" }} />
                  <p className="text-lg font-bold text-foreground">{plan.assignedTo}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">מתאמנים</p>
              </div>
            </div>

            <button className="w-full mt-3 h-10 rounded-xl border border-border text-sm text-foreground hover:border-primary transition-colors">
              עריכה
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty state hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border border-dashed border-border rounded-3xl p-8 flex flex-col items-center gap-3 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">צור תוכנית חדשה</p>
        <p className="text-xs text-muted-foreground">בנה תוכנית מותאמת אישית למתאמן</p>
      </motion.div>
    </div>
  );
}
