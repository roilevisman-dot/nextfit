// HomeScreen — NextFit trainee /home
// 390×844 mobile · RTL Hebrew · Geist/Heebo + Instrument Serif
// Palette: Porcelain canvas, deep ink, iris accent

const Icon = {
  Bell:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Flame:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1.25 2.5-2.5 0-.61-.23-1.21-.64-1.67-.97-1.11-1.86-2.32-1.86-3.83a4 4 0 1 1 8 0c0 1.66-.5 3.16-1.5 4.5"/><path d="M12 22c-4.4 0-8-3.6-8-8 0-1.66.5-3.16 1.5-4.5"/></svg>,
  Play:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/></svg>,
  Check:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Plus:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Drop:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/></svg>,
  Trend:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>,
  Home:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>,
  Dumb:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Plate:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  Chart:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  User:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Top bar
// ─────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2">
      <div className="flex items-center">
        <NFMark size={30} />
      </div>
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-ink-800 hover:bg-line/60">
        <Icon.Bell className="w-[18px] h-[18px]" />
        <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#E11D2A]" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Greeting + streak
// ─────────────────────────────────────────────────────────────
function Greeting() {
  return (
    <div className="px-6 pt-5 pb-5 rise" style={{ animationDelay: '40ms' }}>
      <div className="flex items-center gap-2 text-ink-500 text-[12px] tracking-wide mb-2">
        <span>שלישי · 17 במאי</span>
        <span className="w-1 h-1 rounded-full bg-ink-400" />
        <span className="inline-flex items-center gap-1 text-ember">
          <Icon.Flame className="w-3.5 h-3.5" />
          <span className="nums font-medium">12 ימים</span>
        </span>
      </div>
      <h1 className="font-heb text-[30px] leading-[1.15] tracking-tight text-ink-950">
        בוקר טוב,
        <br />
        <span className="text-[36px] font-extrabold text-ink-950">יעל</span>
        <span className="text-ink-400">.</span>
      </h1>
      <p className="text-[14px] text-ink-500 mt-2 leading-relaxed">
        עוד אימון אחד ואתה סוגרת שבוע מלא. בא לנו לראות.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — today's workout
// ─────────────────────────────────────────────────────────────
function TodayWorkout() {
  const done = 5, total = 8;
  const pct = done / total;
  return (
    <div className="px-5 rise" style={{ animationDelay: '120ms' }}>
      <div className="relative rounded-4xl bg-ink-950 text-white p-5 overflow-hidden shadow-lift tap">
        {/* iris glow accent */}
        <div aria-hidden className="absolute -top-24 -left-24 w-64 h-64 rounded-full"
             style={{ background: 'radial-gradient(closest-side, rgba(79,70,229,0.55), rgba(79,70,229,0) 70%)' }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.06]"
             style={{ background: 'radial-gradient(1200px 200px at 90% 0%, white, transparent 60%)' }} />

        <div className="relative flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A]" />
            אימון היום
          </div>
          <div className="text-[11px] text-white/50 nums">יום 3 / 5</div>
        </div>

        <div className="relative mt-3 flex items-baseline gap-2">
          <h2 className="font-heb text-[26px] tracking-tight text-white">דחיפה עליונה</h2>
        </div>
        <div className="relative mt-1.5 flex items-center gap-2 text-[12.5px] text-white/55">
          <span>חזה · כתפיים · יד אחורית</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="nums">45 דק׳</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>בינוני</span>
        </div>

        {/* progress */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between text-[12px] text-white/70">
            <span className="nums">{done} מתוך {total} תרגילים</span>
            <span className="nums text-white/90 font-medium">{Math.round(pct*100)}%</span>
          </div>
          <div className="relative mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="absolute inset-y-0 right-0 h-full barfill"
                 style={{ '--p': pct, width: '100%',
                          background: 'linear-gradient(90deg, #FF4A57 0%, #E11D2A 100%)' }} />
          </div>
        </div>

        {/* CTA + small steps */}
        <div className="relative mt-5 flex items-center gap-3">
          <button className="tap inline-flex items-center gap-2 bg-white text-ink-950 rounded-full pl-4 pr-3 h-11 text-[14px] font-medium">
            <Icon.Play className="w-3.5 h-3.5" />
            המשך אימון
          </button>
          <div className="flex -space-x-2 space-x-reverse">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-7 h-7 rounded-full bg-[#E11D2A] ring-2 ring-ink-950 grid place-items-center">
                <Icon.Check className="w-3.5 h-3.5 text-white" />
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-white/10 ring-2 ring-ink-950 grid place-items-center nums text-[11px] text-white/70">6</div>
            <div className="w-7 h-7 rounded-full bg-white/10 ring-2 ring-ink-950 grid place-items-center nums text-[11px] text-white/40">7</div>
            <div className="w-7 h-7 rounded-full bg-white/10 ring-2 ring-ink-950 grid place-items-center nums text-[11px] text-white/40">8</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat tiles — weight + hydration ring
// ─────────────────────────────────────────────────────────────
function StatTiles() {
  return (
    <div className="px-5 mt-3 grid grid-cols-2 gap-3 rise" style={{ animationDelay: '200ms' }}>
      <WeightTile />
      <HydrationTile />
    </div>
  );
}

function WeightTile() {
  // tiny sparkline
  const pts = [66.1, 65.8, 65.9, 65.4, 65.1, 64.6, 64.2];
  const w = 110, h = 36;
  const min = Math.min(...pts), max = Math.max(...pts);
  const path = pts.map((v,i) => {
    const x = (i/(pts.length-1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-soft tap" style={{ boxShadow:'0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase text-ink-500">משקל</div>
        <div className="inline-flex items-center gap-0.5 text-[11px] text-moss bg-moss/10 px-1.5 py-0.5 rounded-full nums">
          ↓ 0.3
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-heb text-[28px] text-ink-950 leading-none nums tracking-tight">64.2</span>
        <span className="text-[12px] text-ink-500">ק״ג</span>
      </div>
      <div className="mt-2 -mx-1">
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block">
          <defs>
            <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#E11D2A" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#wgrad)" />
          <path d={path} fill="none" stroke="#E11D2A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((v,i) => {
            const x = (i/(pts.length-1)) * w;
            const y = h - ((v - min) / (max - min || 1)) * h;
            return i === pts.length-1 ? <circle key={i} cx={x} cy={y} r="2.2" fill="#E11D2A"/> : null;
          })}
        </svg>
      </div>
      <div className="mt-1 text-[11px] text-ink-500">השבוע</div>
    </div>
  );
}

function HydrationTile() {
  const current = 1.4, goal = 2.5;
  const pct = current/goal;
  const R = 28, C = 2 * Math.PI * R;
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-soft tap relative" style={{ boxShadow:'0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase text-ink-500">שתייה</div>
        <button className="tap w-6 h-6 grid place-items-center rounded-full bg-canvas text-ink-700">
          <Icon.Plus className="w-3.5 h-3.5"/>
        </button>
      </div>
      <div className="mt-1 flex items-center gap-3">
        <div className="relative w-[68px] h-[68px] -ml-1">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#EFEDE6" strokeWidth="6" />
            <circle cx="40" cy="40" r={R} fill="none" stroke="#E11D2A" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - pct)}
                    style={{ transition: 'stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)' }}/>
          </svg>
          <Icon.Drop className="w-4 h-4 text-[#E11D2A] absolute inset-0 m-auto" />
        </div>
        <div>
          <div className="font-heb text-[22px] leading-none nums text-ink-950">{current.toFixed(1)}<span className="text-[12px] text-ink-500"> / {goal}L</span></div>
          <div className="mt-1.5 text-[11px] text-ink-500 nums">{Math.round(pct*100)}% מהיעד</div>
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        {[1,1,1,1,1,0,0,0,0,0].map((on,i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${on ? 'bg-[#E11D2A]' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Today's nutrition card
// ─────────────────────────────────────────────────────────────
function NutritionGlance() {
  const consumed = 1840, goal = 2100;
  const pct = consumed / goal;
  const macros = [
    { label: 'חלבון', value: 142, goal: 160, color: '#E11D2A' },
    { label: 'פחמ׳',  value: 198, goal: 240, color: '#0A0A0C' },
    { label: 'שומן',  value: 58,  goal: 70,  color: '#E8542A' },
  ];
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '280ms' }}>
      <div className="rounded-3xl bg-surface p-5 shadow-soft tap" style={{ boxShadow:'0 0 0 1px #ECEAE2, 0 1px 2px rgba(10,10,12,0.03)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] tracking-wide uppercase text-ink-500">תפריט היום</div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="font-heb text-[26px] tracking-tight text-ink-950 nums leading-none">1,840</span>
              <span className="text-[12px] text-ink-500 nums">/ 2,100 קק״ל</span>
            </div>
          </div>
          <button className="tap text-[12px] text-ink-700 font-medium inline-flex items-center gap-0.5 px-2 h-7 rounded-full hover:bg-canvas">
            פירוט
            <Icon.Arrow className="w-3.5 h-3.5"/>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {macros.map(m => {
            const p = Math.min(1, m.value / m.goal);
            return (
              <div key={m.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-ink-500">{m.label}</span>
                  <span className="text-[11px] nums text-ink-700">{m.value}<span className="text-ink-400">/{m.goal}g</span></span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-line overflow-hidden">
                  <div className="h-full rounded-full barfill"
                       style={{ '--p': p, width: '100%',
                                background: m.color, transformOrigin: 'right center' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 -mx-1 flex items-center gap-2 overflow-x-auto nf-scroll">
          {[
            { meal: 'ארוחת בוקר', kcal: 420, done: true },
            { meal: 'ביניים', kcal: 220, done: true },
            { meal: 'צהריים', kcal: 680, done: true },
            { meal: 'ביניים', kcal: 280, done: false },
            { meal: 'ערב', kcal: 500, done: false },
          ].map((m,i) => (
            <div key={i} className={`shrink-0 px-3 h-8 rounded-full inline-flex items-center gap-1.5 text-[12px] ${m.done ? 'bg-ink-950 text-white' : 'bg-canvas text-ink-700 border border-line'}`}>
              {m.done && <Icon.Check className="w-3 h-3"/>}
              <span>{m.meal}</span>
              <span className="nums opacity-60">{m.kcal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Up-next strip
// ─────────────────────────────────────────────────────────────
function UpNext() {
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '360ms' }}>
      <button className="w-full tap rounded-3xl bg-paper p-4 flex items-center gap-3 text-right" style={{ boxShadow:'0 0 0 1px #ECEAE2' }}>
        <div className="w-10 h-10 rounded-2xl bg-[#FDECEE] grid place-items-center text-[#B81522]">
          <Icon.Dumb className="w-5 h-5"/>
        </div>
        <div className="flex-1">
          <div className="text-[11px] tracking-wide uppercase text-ink-500">הבא בתור · מחר</div>
          <div className="mt-0.5 text-[14px] text-ink-900 font-medium">רגליים · ירידה לעומק</div>
        </div>
        <div className="text-[12px] text-ink-500 nums">52 דק׳</div>
        <Icon.Arrow className="w-4 h-4 text-ink-400"/>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar
// ─────────────────────────────────────────────────────────────
function BottomTabs() {
  const items = [
    { key: 'home',     label: 'בית',       icon: Icon.Home,  active: true },
    { key: 'workout',  label: 'אימון',     icon: Icon.Dumb },
    { key: 'food',     label: 'תזונה',     icon: Icon.Plate },
    { key: 'progress', label: 'התקדמות',   icon: Icon.Chart },
    { key: 'profile',  label: 'פרופיל',    icon: Icon.User },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-[26px] px-4 pt-3 pointer-events-none">
      <div className="pointer-events-auto rounded-[28px] backdrop-blur-md flex items-center justify-between px-2 py-2"
           style={{ background: 'rgba(255,255,255,0.86)', boxShadow:'0 0 0 1px rgba(0,0,0,0.05), 0 12px 30px rgba(10,10,12,0.10)' }}>
        {items.map(it => {
          const I = it.icon;
          return (
            <button key={it.key} className="tap relative flex-1 h-12 grid place-items-center rounded-2xl">
              <div className={`flex flex-col items-center gap-0.5 ${it.active ? 'text-ink-950' : 'text-ink-400'}`}>
                <I className="w-[20px] h-[20px]"/>
                <span className="text-[10px] tracking-tight">{it.label}</span>
              </div>
              {it.active && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#E11D2A]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen shell — fills IOSDevice content area
// ─────────────────────────────────────────────────────────────
function HomeScreen() {
  return (
    <div dir="rtl" className="relative h-full w-full bg-canvas font-heb text-ink-900">
      <div className="nf-scroll h-full w-full overflow-y-auto pt-[54px] pb-[120px]">
        <TopBar />
        <Greeting />
        <TodayWorkout />
        <StatTiles />
        <NutritionGlance />
        <UpNext />
        <div className="h-4"/>
      </div>
      <BottomTabs />
    </div>
  );
}

Object.assign(window, { HomeScreen });
