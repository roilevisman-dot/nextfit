// HomeScreen v2 — Dark + Ember + Photo
// Inspired by Kaizen-style fitness UI: full-bleed photo hero, warm dark canvas,
// ember orange accent, large Instrument-Serif display moments.

const Ic = {
  Bell:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Flame: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1.25 2.5-2.5 0-.61-.23-1.21-.64-1.67-.97-1.11-1.86-2.32-1.86-3.83a4 4 0 1 1 8 0c0 1.66-.5 3.16-1.5 4.5"/><path d="M12 22c-4.4 0-8-3.6-8-8 0-1.66.5-3.16 1.5-4.5"/></svg>,
  Play:  (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  ChevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Plus:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Drop:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/></svg>,
  Home:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>,
  Dumb:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Plate: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  Chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  User:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
};

// Triple-chevron arrow used on CTAs (RTL → points LEFT)
function TripleChev({ size = 14, className = '' }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-hidden="true">
      {[0.45, 0.7, 1].map((o, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: i === 0 ? 0 : -size * 0.55, opacity: o }}>
          <path d="M15 6l-6 6 6 6" />
        </svg>
      ))}
    </span>
  );
}

const HERO_PHOTO = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=900&q=80&auto=format&fit=crop';
const NEXT_PHOTO = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80&auto=format&fit=crop';

function D_TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1">
      <div className="flex items-center">
        <NFMark size={30} />
      </div>
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-white/80 hover:bg-white/5">
        <Ic.Bell className="w-[18px] h-[18px]" />
        <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ background: '#E11D2A' }} />
      </button>
    </div>
  );
}

function D_Greeting() {
  return (
    <div className="px-6 pt-4 pb-4 rise" style={{ animationDelay: '40ms' }}>
      <div className="flex items-center gap-2 text-[11px] tracking-wide mb-2 text-white/50">
        <span>שלישי · 17 במאי</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span className="inline-flex items-center gap-1" style={{ color: '#FF4A57' }}>
          <Ic.Flame className="w-3.5 h-3.5" />
          <span className="nums font-medium">12 ימים</span>
        </span>
      </div>
      <h1 className="font-heb text-[30px] leading-[1.1] tracking-tight text-white">
        בוקר טוב,
        <br />
        <span className="text-[44px] font-extrabold" style={{ color: '#F4F1E8' }}>יעל</span>
        <span className="text-white/30">.</span>
      </h1>
      <p className="text-[13.5px] text-white/55 mt-2 leading-relaxed max-w-[34ch]">
        עוד אימון אחד וסגרת שבוע מלא — בואי נראה את זה קורה.
      </p>
    </div>
  );
}

function D_TodayWorkout() {
  const done = 5, total = 8;
  const pct = done / total;
  return (
    <div className="px-5 rise" style={{ animationDelay: '120ms' }}>
      <div className="relative rounded-[28px] overflow-hidden tap"
           style={{ height: 360, boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}>
        {/* Photo */}
        <img src={HERO_PHOTO} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.95) contrast(1.05)' }} />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0) 0%, rgba(11,10,8,0.05) 40%, rgba(11,10,8,0.75) 75%, rgba(11,10,8,0.95) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(220deg, rgba(225,29,42,0.20) 0%, rgba(225,29,42,0) 40%)' }} />

        {/* Top chip + day */}
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 backdrop-blur-md bg-black/30 ring-1 ring-white/15 rounded-full px-2.5 h-7">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E11D2A' }}/>
            <span className="text-[11px] tracking-wider uppercase text-white/85">אימון היום</span>
          </div>
          <div className="backdrop-blur-md bg-black/30 ring-1 ring-white/15 rounded-full px-2.5 h-7 grid place-items-center text-[11px] text-white/80 nums">יום 3 / 5</div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 right-0 left-0 p-5">
          <div className="text-[12px] tracking-[0.04em] text-white/55 uppercase">פלג גוף עליון</div>
          <h2 className="mt-1 font-heb text-[32px] leading-[1.05] tracking-tight text-white">
            דחיפה <span className="font-extrabold">עליונה</span>
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-white/60">
            <span>חזה · כתפיים · יד אחורית</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="nums">45 דק׳</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>בינוני</span>
          </div>

          {/* progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11.5px] text-white/65">
              <span className="nums">{done} מתוך {total} תרגילים</span>
              <span className="nums text-white/90 font-medium">{Math.round(pct*100)}%</span>
            </div>
            <div className="relative mt-1.5 h-[5px] rounded-full bg-white/12 overflow-hidden">
              <div className="absolute inset-y-0 right-0 h-full barfill"
                   style={{ '--p': pct, width: '100%',
                            background: 'linear-gradient(90deg, #FF5A66 0%, #E11D2A 100%)' }} />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center gap-3">
            <button className="tap inline-flex items-center gap-2 rounded-full h-12 px-5 text-[14px] font-semibold text-white whitespace-nowrap"
                    style={{ background: '#E11D2A', boxShadow: '0 10px 30px rgba(225,29,42,0.50), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
              <Ic.Play className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">המשך אימון</span>
              <TripleChev size={11} className="ms-0.5 shrink-0" />
            </button>
            <div className="flex-1" />
            <button className="tap w-12 h-12 rounded-full grid place-items-center backdrop-blur-md bg-white/10 ring-1 ring-white/15 text-white">
              <Ic.Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function D_StatTiles() {
  return (
    <div className="px-5 mt-3 grid grid-cols-2 gap-3 rise" style={{ animationDelay: '200ms' }}>
      <D_WeightTile />
      <D_HydrationTile />
    </div>
  );
}

function D_WeightTile() {
  const pts = [66.1, 65.8, 65.9, 65.4, 65.1, 64.6, 64.2];
  const w = 110, h = 36;
  const min = Math.min(...pts), max = Math.max(...pts);
  const path = pts.map((v,i) => {
    const x = (i/(pts.length-1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div className="rounded-3xl p-4 tap relative overflow-hidden" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase text-white/45">משקל</div>
        <div className="inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full nums"
             style={{ background: 'rgba(80,200,120,0.12)', color: '#7BE39A' }}>
          ↓ 0.3
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-heb text-[28px] text-white leading-none nums tracking-tight">64.2</span>
        <span className="text-[12px] text-white/45">ק״ג</span>
      </div>
      <div className="mt-2 -mx-1">
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block">
          <defs>
            <linearGradient id="wgrad2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.30"/>
              <stop offset="100%" stopColor="#E11D2A" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#wgrad2)" />
          <path d={path} fill="none" stroke="#FF4A57" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((v,i) => {
            const x = (i/(pts.length-1)) * w;
            const y = h - ((v - min) / (max - min || 1)) * h;
            return i === pts.length-1 ? <circle key={i} cx={x} cy={y} r="2.2" fill="#E11D2A"/> : null;
          })}
        </svg>
      </div>
      <div className="mt-1 text-[11px] text-white/45">השבוע</div>
    </div>
  );
}

function D_HydrationTile() {
  const current = 1.4, goal = 2.5;
  const pct = current/goal;
  const R = 28, C = 2 * Math.PI * R;
  return (
    <div className="rounded-3xl p-4 tap relative overflow-hidden" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-wide uppercase text-white/45">שתייה</div>
        <button className="tap w-6 h-6 grid place-items-center rounded-full bg-white/8 text-white/80" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Ic.Plus className="w-3.5 h-3.5"/>
        </button>
      </div>
      <div className="mt-1 flex items-center gap-3">
        <div className="relative w-[68px] h-[68px] -ml-1">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="6" />
            <circle cx="40" cy="40" r={R} fill="none" stroke="#E11D2A" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - pct)}
                    style={{ transition: 'stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)' }}/>
          </svg>
          <Ic.Drop className="w-4 h-4 absolute inset-0 m-auto" style={{ color: '#FF4A57' }} />
        </div>
        <div>
          <div className="font-heb text-[22px] leading-none nums text-white">{current.toFixed(1)}<span className="text-[12px] text-white/45"> / {goal}L</span></div>
          <div className="mt-1.5 text-[11px] text-white/45 nums">{Math.round(pct*100)}% מהיעד</div>
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        {[1,1,1,1,1,0,0,0,0,0].map((on,i) => (
          <div key={i} className="h-1 flex-1 rounded-full" style={{ background: on ? '#E11D2A' : 'rgba(255,255,255,0.10)' }} />
        ))}
      </div>
    </div>
  );
}

function D_NutritionGlance() {
  const macros = [
    { label: 'חלבון', value: 142, goal: 160, color: '#E11D2A' },
    { label: 'פחמ׳',  value: 198, goal: 240, color: '#F4F1E8' },
    { label: 'שומן',  value: 58,  goal: 70,  color: '#7BE39A' },
  ];
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '280ms' }}>
      <div className="rounded-3xl p-5 tap" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] tracking-wide uppercase text-white/45">תפריט היום</div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="font-heb text-[26px] tracking-tight text-white nums leading-none">1,840</span>
              <span className="text-[12px] text-white/45 nums">/ 2,100 קק״ל</span>
            </div>
          </div>
          <button className="tap text-[12px] text-white/80 font-medium inline-flex items-center gap-0.5 px-2 h-7 rounded-full hover:bg-white/5">
            פירוט
            <Ic.ChevL className="w-3.5 h-3.5"/>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {macros.map(m => {
            const p = Math.min(1, m.value / m.goal);
            return (
              <div key={m.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-white/55">{m.label}</span>
                  <span className="text-[11px] nums text-white/85">{m.value}<span className="text-white/40">/{m.goal}g</span></span>
                </div>
                <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full barfill"
                       style={{ '--p': p, width: '100%', background: m.color, transformOrigin: 'right center' }} />
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
            <div key={i} className="shrink-0 px-3 h-8 rounded-full inline-flex items-center gap-1.5 text-[12px]"
                 style={{
                   background: m.done ? '#E11D2A' : 'rgba(255,255,255,0.04)',
                   color: m.done ? '#fff' : 'rgba(255,255,255,0.7)',
                   boxShadow: m.done ? '0 6px 16px rgba(225,29,42,0.30)' : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                 }}>
              {m.done && <Ic.Check className="w-3 h-3"/>}
              <span>{m.meal}</span>
              <span className="nums opacity-70">{m.kcal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function D_UpNext() {
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '360ms' }}>
      <button className="w-full tap rounded-3xl p-3.5 flex items-center gap-3 text-right relative overflow-hidden"
              style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 relative">
          <img src={NEXT_PHOTO} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)' }}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] tracking-wide uppercase text-white/45">הבא בתור · מחר</div>
          <div className="mt-0.5 text-[14px] text-white font-medium truncate">רגליים · ירידה לעומק</div>
        </div>
        <div className="text-[12px] text-white/55 nums">52 דק׳</div>
        <Ic.ChevL className="w-4 h-4 text-white/40"/>
      </button>
    </div>
  );
}

function D_BottomTabs() {
  const items = [
    { key: 'home',     label: 'בית',       icon: Ic.Home,  active: true },
    { key: 'workout',  label: 'אימון',     icon: Ic.Dumb },
    { key: 'food',     label: 'תזונה',     icon: Ic.Plate },
    { key: 'progress', label: 'התקדמות',   icon: Ic.Chart },
    { key: 'profile',  label: 'פרופיל',    icon: Ic.User },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-[26px] px-4 pt-3 pointer-events-none">
      <div className="pointer-events-auto rounded-[28px] backdrop-blur-md flex items-center justify-between px-2 py-2"
           style={{ background: 'rgba(21,20,15,0.78)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.5)' }}>
        {items.map(it => {
          const I = it.icon;
          return (
            <button key={it.key} className="tap relative flex-1 h-12 grid place-items-center rounded-2xl">
              <div className={`flex flex-col items-center gap-0.5 ${it.active ? 'text-white' : 'text-white/40'}`}>
                <I className="w-[20px] h-[20px]"/>
                <span className="text-[10px] tracking-tight">{it.label}</span>
              </div>
              {it.active && <span className="absolute -bottom-0.5 w-1 h-1 rounded-full" style={{ background: '#E11D2A' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeScreenDark() {
  return (
    <div dir="rtl" className="relative h-full w-full font-heb text-white" style={{ background: '#0B0A08' }}>
      {/* warm vignette */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(800px 400px at 100% 0%, rgba(225,29,42,0.12), transparent 60%)' }} />
      <div className="nf-scroll relative h-full w-full overflow-y-auto pt-[54px] pb-[120px]">
        <D_TopBar />
        <D_Greeting />
        <D_TodayWorkout />
        <D_StatTiles />
        <D_NutritionGlance />
        <D_UpNext />
        <div className="h-4"/>
      </div>
      <D_BottomTabs />
    </div>
  );
}

Object.assign(window, { HomeScreenDark });
