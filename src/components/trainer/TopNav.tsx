"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Dumbbell, Utensils } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה" },
  { href: "/clients", icon: Users, label: "מתאמנים" },
  { href: "/workouts", icon: Dumbbell, label: "אימונים" },
  { href: "/trainer-nutrition", icon: Utensils, label: "תזונה" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border safe-top">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#c8ff00" }}>
            <Dumbbell className="w-4 h-4" style={{ color: "#0a0a0a" }} />
          </div>
          <span className="font-bold text-foreground">Nextfit</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">מאמן</span>
        </div>
      </div>
      <nav className="flex border-t border-border">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative"
            >
              <Icon
                className="w-4 h-4 transition-colors"
                style={{ color: isActive ? "#c8ff00" : "#737373" }}
              />
              <span
                className="text-[10px] font-medium transition-colors"
                style={{ color: isActive ? "#c8ff00" : "#737373" }}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: "#c8ff00" }} />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
