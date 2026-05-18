"use client";

import { motion } from "framer-motion";
import { User, Dumbbell, ChevronLeft, Bell, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="px-5 pt-12 flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 py-4"
      >
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">יואב כהן</h1>
          <p className="text-muted-foreground text-sm">מתאמן</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-1.5">
          <Dumbbell className="w-3.5 h-3.5" style={{ color: "#c8ff00" }} />
          <span className="text-xs text-foreground font-medium">מאמן: ראובן לוי</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-card border border-border rounded-3xl overflow-hidden"
      >
        {[
          { icon: Bell, label: "התראות", sub: "נהל התראות" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button className="w-full flex items-center gap-3 px-5 py-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors">
          <LogOut className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">התנתק</span>
        </button>
      </motion.div>
    </div>
  );
}
