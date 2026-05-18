"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NFMark } from "@/components/NFMark";

function RunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13" cy="4" r="2"/>
      <path d="M4 22 7 17l3 1 2-5 4 4-1 3"/>
      <path d="m4 11 5-1 4 4 4-1"/>
    </svg>
  );
}

function CoachIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/>
    </svg>
  );
}

function ChevLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 6l-6 6 6 6"/>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-heb text-white"
      style={{ background: "#0B0A08" }}
    >
      {/* Full-bleed gym photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "saturate(0.85) contrast(1.1) brightness(0.78)" }}
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,10,8,0.55) 0%, rgba(11,10,8,0.10) 25%, rgba(11,10,8,0.78) 58%, rgba(11,10,8,0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 350px at 0% 100%, rgba(225,29,42,0.30), transparent 60%)",
        }}
      />

      <div className="relative h-full w-full flex flex-col min-h-screen pt-[64px] pb-9 px-7">
        {/* Logo — top right */}
        <div className="absolute top-12 right-5 z-10 rise" style={{ animationDelay: "60ms" }}>
          <NFMark size={26} />
        </div>

        {/* Display copy — pushed to bottom */}
        <motion.div
          className="mt-auto rise"
          style={{ animationDelay: "160ms" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">
            NextFit · Personal
          </div>
          <h1 className="mt-2 text-[34px] leading-[1.08] tracking-tight text-white font-semibold">
            מוכנים{" "}
            <span className="text-[40px] font-extrabold">להתחיל?</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/70 max-w-[32ch] leading-relaxed">
            התוכנית האישית שלך — או הכלי לנהל את המתאמנים. בחר כדי להמשיך.
          </p>
        </motion.div>

        {/* Role cards */}
        <motion.div
          className="mt-7 space-y-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          {/* Trainee card */}
          <Link href="/join">
            <button
              className="tap w-full text-right p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
              style={{
                background: "rgba(20,18,15,0.78)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl grid place-items-center"
                style={{ background: "rgba(225,29,42,0.18)", color: "#FF8A95" }}
              >
                <RunIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-white">
                  אני מתאמן/ת
                </div>
                <div className="text-[11.5px] text-white/65 mt-0.5">
                  הצטרפו עם קוד מהמאמן שלכם
                </div>
              </div>
              <ChevLeftIcon className="w-4 h-4 text-white/55" />
            </button>
          </Link>

          {/* Trainer card */}
          <Link href="/login">
            <button
              className="tap w-full text-right p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
              style={{
                background: "#E11D2A",
                boxShadow:
                  "0 14px 36px rgba(225,29,42,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-white/15">
                <CoachIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-white">
                  אני מאמן/ת
                </div>
                <div className="text-[11.5px] text-white/85 mt-0.5">
                  נהל את המתאמנים והתוכניות שלך
                </div>
              </div>
              <ChevLeftIcon className="w-4 h-4 text-white/90" />
            </button>
          </Link>
        </motion.div>

        <motion.p
          className="mt-4 text-center text-[10.5px] text-white/55 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          ההמשך מהווה הסכמה ל
          <span className="underline">תנאי השימוש</span> ול
          <span className="underline">מדיניות הפרטיות</span>
        </motion.p>
      </div>
    </main>
  );
}
