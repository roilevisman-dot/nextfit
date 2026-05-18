"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NFMark } from "@/components/NFMark";

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="m3 7 9 6 9-6"/>
    </svg>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2"/>
      <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="m1 1 22 22"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    </svg>
  );
}

function ChevRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.6 13.2c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1-.9 0-2.3-1-3.8-1-2 0-3.8 1.1-4.8 2.9-2 3.5-.5 8.7 1.5 11.5.9 1.4 2.1 2.9 3.6 2.9 1.4-.1 2-.9 3.7-.9s2.2.9 3.8.9c1.6 0 2.6-1.4 3.5-2.8 1.1-1.6 1.6-3.2 1.6-3.3-.1 0-3-.9-3-3.4zM14.7 4.6c.8-1 1.3-2.4 1.2-3.7-1.1.1-2.5.8-3.3 1.7-.7.8-1.4 2.2-1.2 3.4 1.2.1 2.5-.6 3.3-1.4z"/>
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
    </svg>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  focused?: boolean;
}

function Field({ icon, label, value, onChange, type = "text", placeholder, focused }: FieldProps) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && !showPw ? "password" : "text";

  return (
    <div>
      <label className="text-[11px] tracking-wide text-white/55">{label}</label>
      <div
        className="mt-1.5 relative rounded-2xl transition-all duration-200"
        style={{
          background: "#15140F",
          boxShadow: focused
            ? "inset 0 0 0 1.5px rgba(225,29,42,0.55), 0 0 0 4px rgba(225,29,42,0.10)"
            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </div>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pr-10 pl-10 bg-transparent text-white text-[14.5px] outline-none placeholder:text-white/30"
          style={{ caretColor: "#FF4A57", direction: "ltr" }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="tap absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          >
            {showPw ? (
              <EyeOffIcon className="w-[18px] h-[18px]" />
            ) : (
              <EyeIcon className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TrainerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage("אימייל או סיסמה שגויים");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }
      setMessage("נשלח לך מייל אישור — בדוק את תיבת הדואר");
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-heb text-white"
      style={{ background: "#0B0A08" }}
    >
      {/* Red glow top-right */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 380px at 100% 0%, rgba(225,29,42,0.12), transparent 60%)",
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
        <div className="mt-8 rise" style={{ animationDelay: "40ms" }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/65">
            {mode === "login" ? "כניסת מאמן" : "הרשמת מאמן"}
          </div>
          <h1 className="mt-2 text-[34px] leading-[1.1] tracking-tight text-white">
            {mode === "login" ? (
              <>ברוכים <span className="text-[40px] font-extrabold">השבים</span><span className="text-white/45">.</span></>
            ) : (
              <>בוא <span className="text-[40px] font-extrabold">נתחיל</span><span className="text-white/45">.</span></>
            )}
          </h1>
          <p className="mt-2 text-[13.5px] text-white/70 max-w-[36ch]">
            {mode === "login"
              ? "התחבר כדי לראות את המתאמנים שלך ולנהל את התוכניות."
              : "צרו חשבון תוך פחות מדקה. עד 50 מתאמנים בחשבון הבסיסי."}
          </p>
        </div>

        {/* Form */}
        <div className="mt-7 space-y-4 rise" style={{ animationDelay: "120ms" }}>
          <div onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}>
            <Field
              icon={<MailIcon className="w-[18px] h-[18px]" />}
              label="כתובת אימייל"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="name@example.com"
              focused={focusedField === "email"}
            />
          </div>
          <div onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}>
            <Field
              icon={<LockIcon className="w-[18px] h-[18px]" />}
              label="סיסמה"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="הסיסמה שלך"
              focused={focusedField === "password"}
            />
            {mode === "login" && (
              <div className="mt-2 flex justify-start">
                <button className="text-[11.5px] text-white/70 hover:underline underline-offset-2">
                  שכחתי סיסמה?
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error / success message */}
        {message && (
          <div
            className="mt-4 p-3 rounded-2xl text-[12.5px] leading-relaxed rise"
            style={{
              background: message.includes("נשלח")
                ? "rgba(123,227,154,0.08)"
                : "rgba(225,29,42,0.10)",
              boxShadow: message.includes("נשלח")
                ? "inset 0 0 0 1px rgba(123,227,154,0.30)"
                : "inset 0 0 0 1px rgba(225,29,42,0.30)",
              color: message.includes("נשלח") ? "#7BE39A" : "#FF8A95",
            }}
          >
            {message}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 rise" style={{ animationDelay: "220ms" }}>
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="tap w-full h-12 rounded-full text-white font-semibold text-[14.5px] disabled:opacity-40"
            style={{
              background: "#E11D2A",
              boxShadow: "0 12px 30px rgba(225,29,42,0.45), inset 0 1px 0 rgba(255,255,255,0.20)",
            }}
          >
            {loading ? "..." : mode === "login" ? "התחבר" : "צור חשבון"}
          </button>
        </div>

        {/* Or divider */}
        <div className="mt-5 flex items-center gap-3 rise" style={{ animationDelay: "280ms" }}>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[10.5px] tracking-wider uppercase text-white/55">או</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Social */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 rise" style={{ animationDelay: "320ms" }}>
          <button
            className="tap h-11 rounded-full flex items-center justify-center gap-2 text-white text-[13px]"
            style={{
              background: "#0A0A0B",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
            }}
          >
            <AppleIcon className="w-4 h-4" />
            Apple
          </button>
          <button
            className="tap h-11 rounded-full flex items-center justify-center gap-2 text-white text-[13px]"
            style={{
              background: "#0A0A0B",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
            }}
          >
            <GoogleIcon className="w-4 h-4" />
            Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/68">
          {mode === "login" ? (
            <>
              אין לך חשבון?{" "}
              <button
                className="text-white font-medium hover:underline underline-offset-2"
                onClick={() => { setMode("signup"); setMessage(""); }}
              >
                הירשם כמאמן
              </button>
            </>
          ) : (
            <>
              כבר רשום?{" "}
              <button
                className="text-white font-medium hover:underline underline-offset-2"
                onClick={() => { setMode("login"); setMessage(""); }}
              >
                התחבר
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
