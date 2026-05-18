"use client";

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12"/>
    </svg>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen font-heb pb-10" style={{ background: "#0B0A08", color: "#FAF9F6" }}>
      <div className="px-5 pt-[58px] space-y-5">

        {/* Avatar section */}
        <div className="flex flex-col items-center gap-3 pt-4 pb-2 rise">
          <div
            className="w-20 h-20 rounded-full grid place-items-center text-[28px] font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, #FF4A57, #B81522)" }}
          >
            יכ
          </div>
          <div className="text-center">
            <h1 className="text-[20px] font-bold">יואב כהן</h1>
            <p className="text-[12px] text-white/45 mt-0.5">מתאמן</p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(225,29,42,0.10)", boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.22)" }}
          >
            <DumbbellIcon className="w-3.5 h-3.5" style={{ color: "#E11D2A" }} />
            <span className="text-[11.5px] font-medium" style={{ color: "#FF8A95" }}>מאמן: ראובן לוי</span>
          </div>
        </div>

        {/* Stats chips */}
        <div className="grid grid-cols-3 gap-2 rise" style={{ animationDelay: "60ms" }}>
          {[
            { label: "ימי אימון", value: "47" },
            { label: "שבועות", value: "11" },
            { label: "ק״ג ירד", value: "3.0" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-3.5 text-center"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
            >
              <p className="text-[20px] font-extrabold leading-none">{s.value}</p>
              <p className="text-[9.5px] text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div
          className="rounded-2xl overflow-hidden rise"
          style={{
            animationDelay: "100ms",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <button
            className="tap w-full flex items-center gap-3 px-4 py-4"
          >
            <div
              className="w-8 h-8 rounded-xl grid place-items-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <BellIcon className="w-4 h-4 text-white/60" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-[13.5px] font-medium">התראות</p>
              <p className="text-[11px] text-white/40">נהל התראות</p>
            </div>
            <ChevRightIcon className="w-4 h-4 text-white/25 flex-shrink-0" />
          </button>
        </div>

        {/* Logout */}
        <button
          className="tap w-full flex items-center gap-3 px-4 py-4 rounded-2xl rise"
          style={{
            animationDelay: "140ms",
            background: "rgba(225,29,42,0.07)",
            boxShadow: "inset 0 0 0 1px rgba(225,29,42,0.18)",
          }}
        >
          <LogOutIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#E11D2A" }} />
          <span className="text-[13.5px] font-medium" style={{ color: "#FF8A95" }}>התנתק</span>
        </button>

      </div>
    </main>
  );
}
