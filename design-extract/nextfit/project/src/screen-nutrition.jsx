// /nutrition — daily meal plan + macros + hydration
// Dark mode · RTL · NextFit red

const In = {
  Bell:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  ChevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Plus:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Minus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/></svg>,
  Drop:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/></svg>,
  Swap:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 4 4 7l3 3"/><path d="M4 7h12a4 4 0 0 1 4 4v0"/><path d="m17 20 3-3-3-3"/><path d="M20 17H8a4 4 0 0 1-4-4v0"/></svg>,
  Home:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>,
  Dumb:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Plate: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  Chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  User:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
};

const F_PHOTOS = {
  oats:    'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80&auto=format&fit=crop',
  protein: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format&fit=crop',
  chicken: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&auto=format&fit=crop',
  shake:   'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80&auto=format&fit=crop',
  salmon:  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop',
};

const MEALS = [
  { id: 'b', name: 'ארוחת בוקר', time: '07:30', dish: 'שיבולת שועל + חלבון', detail: 'דייסת שיבולת שועל, חמוקים, אבקת חלבון',  kcal: 420, p: 32, c: 58, f: 9,  photo: F_PHOTOS.oats,    done: true },
  { id: 'm1', name: 'ביניים',     time: '10:30', dish: 'חביתת לבן + פירות',  detail: '3 חלבונים, גבינה לבנה 5%, אגוזי מלך', kcal: 220, p: 22, c: 12, f: 8,  photo: F_PHOTOS.protein, done: true },
  { id: 'l', name: 'צהריים',     time: '13:30', dish: 'חזה עוף + אורז',     detail: '180 גר׳ חזה עוף, אורז בסמטי, ירק',     kcal: 680, p: 52, c: 78, f: 14, photo: F_PHOTOS.chicken, done: true },
  { id: 'm2', name: 'ביניים',     time: '17:00', dish: 'שייק חלבון',         detail: '30 גר׳ חלבון מי-גבן, חלב, בננה',       kcal: 280, p: 30, c: 28, f: 5,  photo: F_PHOTOS.shake,   done: false },
  { id: 'd', name: 'ערב',        time: '20:00', dish: 'סלמון + פירה בטטה', detail: '160 גר׳ סלמון אפוי, פירה בטטה, ברוקולי', kcal: 500, p: 38, c: 30, f: 22, photo: F_PHOTOS.salmon,  done: false },
];

function N_TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1">
      <NFMark size={30} />
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-white/80 hover:bg-white/5">
        <In.Bell className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}

function N_Header() {
  return (
    <div className="px-6 pt-4 pb-3 rise" style={{ animationDelay: '40ms' }}>
      <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">שלישי · 17 במאי</div>
      <h1 className="mt-1 font-heb text-[30px] leading-[1.1] tracking-tight text-white">
        התפריט <span className="text-[36px] font-extrabold">היום</span>
      </h1>
    </div>
  );
}

function N_CaloriesHero() {
  const consumed = 1320, goal = 2100;
  const pct = consumed / goal;
  const R = 78, C = 2 * Math.PI * R;
  return (
    <div className="px-5 rise" style={{ animationDelay: '120ms' }}>
      <div className="relative rounded-[28px] p-5 overflow-hidden"
           style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div aria-hidden className="absolute -top-20 -right-16 w-56 h-56 rounded-full"
             style={{ background: 'radial-gradient(closest-side, rgba(225,29,42,0.22), rgba(225,29,42,0) 70%)' }} />
        <div className="relative flex items-center gap-4">
          {/* Big ring */}
          <div className="relative w-[178px] h-[178px] shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12"/>
              <circle cx="100" cy="100" r={R} fill="none" stroke="url(#nGrad)" strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={C * (1 - pct)}
                      style={{ transition: 'stroke-dashoffset 1100ms cubic-bezier(.22,1,.36,1)' }}/>
              <defs>
                <linearGradient id="nGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF5A66"/>
                  <stop offset="100%" stopColor="#B81522"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-heb text-[36px] leading-none nums text-white tracking-tight">{consumed.toLocaleString()}</div>
                <div className="text-[11px] text-white/50 mt-1 nums">מתוך {goal.toLocaleString()} קק״ל</div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] nums" style={{ color: '#FF8A95' }}>
                  <span>נותרו</span>
                  <span>{(goal-consumed).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Macros */}
          <div className="flex-1 space-y-2.5">
            {[
              { label: 'חלבון',   value: 86,  goal: 160, unit: 'g', color: '#FF4A57', sub: 'יעד 160' },
              { label: 'פחמימה', value: 138, goal: 240, unit: 'g', color: '#F4F1E8', sub: 'יעד 240' },
              { label: 'שומן',    value: 38,  goal: 70,  unit: 'g', color: '#7BE39A', sub: 'יעד 70' },
            ].map(m => {
              const p = Math.min(1, m.value / m.goal);
              return (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11.5px] text-white/65">{m.label}</span>
                    <span className="text-[12px] nums text-white">{m.value}<span className="text-white/40 text-[10.5px]">{m.unit}</span></span>
                  </div>
                  <div className="mt-1 h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full barfill"
                         style={{ '--p': p, width: '100%', background: m.color, transformOrigin: 'right center' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function N_Hydration() {
  const cups = 5, goal = 10;
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '200ms' }}>
      <div className="rounded-[24px] p-4" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <In.Drop className="w-4 h-4" style={{ color: '#FF8A95' }} />
            <div>
              <div className="text-[11px] tracking-wide uppercase text-white/45">שתייה</div>
              <div className="text-[14px] text-white nums mt-0.5"><span className="font-medium">{(cups*0.25).toFixed(2)}L</span> <span className="text-white/40 text-[12px]">/ {(goal*0.25).toFixed(1)}L</span></div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="tap w-9 h-9 grid place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <In.Minus className="w-4 h-4 text-white/70" />
            </button>
            <button className="tap w-9 h-9 grid place-items-center rounded-full text-white" style={{ background: '#E11D2A', boxShadow: '0 8px 20px rgba(225,29,42,0.40)' }}>
              <In.Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-end gap-1.5">
          {Array.from({length: goal}).map((_,i) => (
            <div key={i} className="flex-1 rounded-md"
                 style={{
                   height: i < cups ? 28 : 14,
                   background: i < cups ? 'linear-gradient(180deg, #FF8A95 0%, #E11D2A 100%)' : 'rgba(255,255,255,0.06)',
                   boxShadow: i < cups ? '0 4px 12px rgba(225,29,42,0.30)' : 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                   transition: 'all 600ms cubic-bezier(.22,1,.36,1)',
                 }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function N_Meals() {
  return (
    <div className="px-5 mt-4 rise" style={{ animationDelay: '280ms' }}>
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">ארוחות היום</div>
        <button className="text-[11.5px] text-white/60 inline-flex items-center gap-0.5">
          <span>פירוט מלא</span>
          <In.ChevL className="w-3.5 h-3.5"/>
        </button>
      </div>
      <div className="space-y-2.5">
        {MEALS.map(m => <N_MealRow key={m.id} m={m}/>)}
      </div>
    </div>
  );
}

function N_MealRow({ m }) {
  return (
    <div className="tap rounded-2xl p-3 flex items-stretch gap-3 relative overflow-hidden"
         style={{
           background: m.done ? 'rgba(255,255,255,0.03)' : '#15140F',
           boxShadow: m.done
             ? 'inset 0 0 0 1px rgba(123,227,154,0.18)'
             : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
         }}>
      {/* photo */}
      <div className="w-[64px] h-[64px] rounded-xl overflow-hidden shrink-0 relative">
        <img src={m.photo} alt="" className={`absolute inset-0 w-full h-full object-cover ${m.done ? 'opacity-90' : ''}`} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%)' }}/>
        {m.done && (
          <div className="absolute bottom-1 left-1 w-4 h-4 rounded-full grid place-items-center" style={{ background: '#7BE39A' }}>
            <In.Check className="w-2.5 h-2.5 text-ink-950"/>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5">
            <span className="text-[10.5px] tracking-wider uppercase text-white/45">{m.name}</span>
            <span className="text-[10.5px] text-white/35 nums">· {m.time}</span>
          </div>
          <button className="tap w-6 h-6 grid place-items-center rounded-full text-white/50 hover:text-white">
            <In.Swap className="w-3.5 h-3.5"/>
          </button>
        </div>
        <div className={`mt-0.5 text-[14px] truncate ${m.done ? 'text-white/70' : 'text-white font-medium'}`}>{m.dish}</div>
        <div className="mt-1 flex items-center gap-2 text-[10.5px] text-white/45 nums">
          <span className="text-white/65">{m.kcal} קק״ל</span>
          <span className="w-1 h-1 rounded-full bg-white/20"/>
          <span>P {m.p}</span>
          <span className="w-1 h-1 rounded-full bg-white/20"/>
          <span>C {m.c}</span>
          <span className="w-1 h-1 rounded-full bg-white/20"/>
          <span>F {m.f}</span>
        </div>
      </div>

      {/* action */}
      <div className="flex items-center">
        {m.done ? (
          <span className="text-[11px] px-2.5 h-7 rounded-full inline-flex items-center text-white/65" style={{ background: 'rgba(123,227,154,0.10)', boxShadow: 'inset 0 0 0 1px rgba(123,227,154,0.30)' }}>
            <In.Check className="w-3 h-3 mr-1" style={{ color: '#7BE39A' }}/>
            הושלם
          </span>
        ) : (
          <button className="tap text-[11.5px] px-3 h-8 rounded-full text-white font-medium whitespace-nowrap"
                  style={{ background: '#E11D2A', boxShadow: '0 6px 16px rgba(225,29,42,0.35)' }}>
            אכלתי
          </button>
        )}
      </div>
    </div>
  );
}

function N_BottomTabs() {
  const items = [
    { key: 'home', label: 'בית', icon: In.Home },
    { key: 'workout', label: 'אימון', icon: In.Dumb },
    { key: 'food', label: 'תזונה', icon: In.Plate, active: true },
    { key: 'progress', label: 'התקדמות', icon: In.Chart },
    { key: 'profile', label: 'פרופיל', icon: In.User },
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

function NutritionScreen() {
  return (
    <div dir="rtl" className="relative h-full w-full font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 360px at 0% 0%, rgba(225,29,42,0.10), transparent 60%)' }} />
      <div className="nf-scroll relative h-full w-full overflow-y-auto pt-[54px] pb-[120px]">
        <N_TopBar />
        <N_Header />
        <N_CaloriesHero />
        <N_Hydration />
        <N_Meals />
        <div className="h-4" />
      </div>
      <N_BottomTabs />
    </div>
  );
}

Object.assign(window, { NutritionScreen });
