"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Dumbbell, ChevronLeft } from "lucide-react";
import Link from "next/link";

const clients = [
  { name: "יואב כהן", lastWorkout: "אתמול", weight: 82.5, goal: 78, plan: "Push/Pull/Legs" },
  { name: "מיכל ברק", lastWorkout: "לפני 2 ימים", weight: 65.2, goal: 60, plan: "Full Body" },
  { name: "דניאל שמש", lastWorkout: "לפני 3 ימים", weight: 91.0, goal: 85, plan: "Push/Pull/Legs" },
];

export default function DashboardPage() {
  return (
    <div className="px-5 pt-8 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-foreground">לוח בקרה</h1>
        <p className="text-muted-foreground text-sm mt-1">שלום, ראובן 👋</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "מתאמנים", value: "3", icon: Users, color: "#c8ff00" },
          { label: "אימונים השבוע", value: "7", icon: Dumbbell, color: "#60a5fa" },
          { label: "ממוצע ציות", value: "84%", icon: TrendingUp, color: "#4ade80" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
              <Icon className="w-4 h-4" style={{ color: stat.color }} />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Clients */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">מתאמנים פעילים</p>
          <Link href="/clients" className="text-xs flex items-center gap-0.5" style={{ color: "#c8ff00" }}>
            כולם <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {clients.map((client, i) => {
            const progress = Math.round(((client.weight - client.goal) / (client.weight - client.goal + 1)) * 100);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">אחרון: {client.lastWorkout}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">{client.weight} ק״ג</p>
                    <p className="text-xs text-muted-foreground">יעד: {client.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full">
                    <div className="h-full rounded-full" style={{ background: "#c8ff00", width: "45%" }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{client.plan}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
