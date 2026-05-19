"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>
    </svg>
  );
}
function DumbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/>
    </svg>
  );
}
function PlateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
    </svg>
  );
}
function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/>
    </svg>
  );
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/home",      label: "בית",      Icon: HomeIcon },
  { href: "/workout",   label: "אימון",    Icon: DumbIcon },
  { href: "/nutrition", label: "תזונה",    Icon: PlateIcon },
  { href: "/progress",  label: "התקדמות",  Icon: ChartIcon },
  { href: "/profile",   label: "פרופיל",   Icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[26px] px-4 pt-3 z-50 pointer-events-none">
      <nav
        className="pointer-events-auto rounded-[28px] flex items-center justify-between px-2 py-2"
        style={{
          background: "rgba(15,14,10,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07), 0 12px 30px rgba(0,0,0,0.55)",
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          const color = active ? "#ffffff" : "rgba(255,255,255,0.38)";

          return (
            <Link key={href} href={href} className="tap relative flex-1 h-12 grid place-items-center rounded-2xl">
              <div className="flex flex-col items-center gap-0.5" style={{ color }}>
                <Icon className="w-[20px] h-[20px]" />
                <span className="text-[10px] tracking-tight">{label}</span>
              </div>
              {active && (
                <span
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                  style={{ background: "#E11D2A" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
