"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Dumbbell, Utensils } from "lucide-react";
import { NFMark } from "@/components/NFMark";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "לוח בקרה" },
  { href: "/clients", icon: Users, label: "מתאמנים" },
  { href: "/workouts", icon: Dumbbell, label: "אימונים" },
  { href: "/trainer-nutrition", icon: Utensils, label: "תזונה" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(11,10,8,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand row */}
      <div className="flex items-center justify-between px-5 h-12">
        <NFMark size={24} />
        <span
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          מאמן
        </span>
      </div>

      {/* Nav tabs */}
      <nav className="flex" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-opacity"
              style={{ opacity: isActive ? 1 : 0.4 }}
            >
              <Icon
                className="w-[17px] h-[17px]"
                style={{ color: isActive ? "#E11D2A" : "#FAF9F6" }}
              />
              <span
                className="text-[9.5px] font-medium"
                style={{ color: isActive ? "#E11D2A" : "#FAF9F6" }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full"
                  style={{ background: "#E11D2A" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
