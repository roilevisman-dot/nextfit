"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NFMark } from "@/components/NFMark";

function ChevRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function HelpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5"/>
      <path d="M12 17h.01"/>
    </svg>
  );
}

const CODE_LENGTH = 6;

export default function JoinPage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const code = digits.join("");
  const filledCount = digits.filter((d) => d !== "").length;
  const cursorIdx = digits.findIndex((d) => d === "");
  const activeCursor = cursorIdx === -1 ? CODE_LENGTH - 1 : cursorIdx;

  const handleInput = (idx: number, val: string) => {
    const char = val.slice(-1);
    if (!char.match(/[0-9]/)) return;

    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    setError("");

    if (idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[idx]) {
        next[idx] = "";
        setDigits(next);
      } else if (idx > 0) {
        next[idx - 1] = "";
        setDigits(next);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "Enter" && filledCount === CODE_LENGTH) {
      handleJoin();
    }
  };

  const handleJoin = async () => {
    if (filledCount < CODE_LENGTH) {
      setError("הזן את כל 6 הספרות");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("clients")
      .select("id, name, coach_id")
      .eq("invite_code", code)
      .eq("active", true)
      .single();

    if (dbError || !data) {
      setError("קוד לא נמצא — בדוק עם המאמן שלך");
      setLoading(false);
      return;
    }

    localStorage.setItem("nextfit_client_id", data.id);
    localStorage.setItem("nextfit_client_name", data.name);
    localStorage.setItem("nextfit_coach_id", data.coach_id);
    router.push("/home");
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-heb text-white"
      style={{ background: "#0B0A08" }}
    >
      {/* Red glow top-center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 380px at 50% 0%, rgba(225,29,42,0.14), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col min-h-screen pt-[58px] pb-10 px-7">
        {/* Nav row */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <button
              className="tap w-9 h-9 grid place-items-center rounded-full text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              <ChevRightIcon className="w-[18px] h-[18px]" />
            </button>
          </Link>
          <NFMark size={28} />
        </div>

        {/* Hero copy */}
        <div className="mt-9 rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/45">
            הצטרפות למתאמן
          </div>
          <h1 className="mt-2 text-[34px] leading-[1.1] tracking-tight text-white">
            הזן את{" "}
            <span className="text-[40px] font-extrabold">הקוד</span>
            <span className="text-white/30">.</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/60 max-w-[36ch]">
            קיבלת קוד מהמאמן שלך? הזן אותו כדי לפתוח את התוכנית האישית.
          </p>
        </div>

        {/* OTP boxes */}
        <div className="mt-8 rise" style={{ animationDelay: "120ms" }} dir="ltr">
          <div className="flex items-center justify-between gap-1.5">
            {digits.map((d, i) => {
              const isCursor = i === activeCursor && filledCount < CODE_LENGTH;
              const filled = d !== "";
              return (
                <div key={i} className="relative flex-1" style={{ maxWidth: 48 }}>
                  <div
                    className="aspect-square rounded-2xl flex items-center justify-center text-[26px] nums text-white tracking-tight transition-all duration-150 relative"
                    style={{
                      background: isCursor ? "rgba(225,29,42,0.06)" : "#15140F",
                      boxShadow: isCursor
                        ? "inset 0 0 0 1.5px rgba(225,29,42,0.55), 0 0 0 4px rgba(225,29,42,0.10)"
                        : filled
                        ? "inset 0 0 0 1px rgba(255,255,255,0.18)"
                        : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                    }}
                    onClick={() => inputRefs.current[i]?.focus()}
                  >
                    {d}
                    {isCursor && !d && (
                      <span
                        className="blink-cursor absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-7 rounded-full"
                        style={{ background: "#FF4A57" }}
                      />
                    )}
                    <input
                      ref={(el) => { inputRefs.current[i] = el; }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      maxLength={1}
                      inputMode="numeric"
                      autoComplete="off"
                      value={d}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onFocus={() => {}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 p-3 rounded-2xl text-[12.5px] rise"
            style={{
              background: "rgba(225,29,42,0.10)",
              boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.30)",
              color: "#FF8A95",
            }}
          >
            {error}
          </div>
        )}

        {/* Coach preview card */}
        <div
          className="mt-7 rounded-2xl p-3.5 flex items-center gap-3 rise"
          style={{
            animationDelay: "220ms",
            background: "#15140F",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-11 h-11 rounded-full grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg, #FF4A57, #B81522)" }}
          >
            <span className="font-bold text-[15px] text-white">יע</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] tracking-wider uppercase text-white/45">
              מצטרף ל
            </div>
            <div className="text-[14px] font-medium text-white">
              יואב כהן · NextFit
            </div>
            <div className="text-[11px] text-white/50">מאמן כוח · 8 שנות ניסיון</div>
          </div>
          <CheckIcon className="w-5 h-5 shrink-0" style={{ color: "#7BE39A" }} />
        </div>

        {/* CTA */}
        <div className="mt-5 rise" style={{ animationDelay: "300ms" }}>
          <button
            onClick={handleJoin}
            disabled={loading || filledCount < CODE_LENGTH}
            className="tap w-full h-12 rounded-full text-white font-semibold text-[14.5px] disabled:opacity-40"
            style={{
              background: "#E11D2A",
              boxShadow: "0 12px 30px rgba(225,29,42,0.45), inset 0 1px 0 rgba(255,255,255,0.20)",
            }}
          >
            {loading ? "מחפש..." : "המשך לתוכנית שלי"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/50 flex items-center justify-center gap-1.5">
          <HelpIcon className="w-3.5 h-3.5" />
          <span>אין לי קוד · </span>
          <button className="text-white hover:underline underline-offset-2">
            דבר עם תמיכה
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cursor-blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
        .blink-cursor { animation: cursor-blink 1.1s infinite; }
      `}</style>
    </main>
  );
}
