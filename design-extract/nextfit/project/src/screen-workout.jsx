// /workout — weekly training plan
// Dark mode · RTL · NextFit red

const Iw = {
  Bell:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Play:  (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.5-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  ChevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Clock: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  Filter:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  Home:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>,
  Dumb:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Plate: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  Chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  User:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
  Rest:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h18"/><path d="M3 8h18"/><path d="M3 16h12"/></svg>,
};

function TripleChevW({ size = 12 }) {
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      {[0.45, 0.7, 1].map((o, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: i === 0 ? 0 : -size * 0.55, opacity: o }}>
          <path d="M15 6l-6 6 6 6" />
        </svg>
      ))}
    </span>
  );
}

// Workout demo photos
const W_PHOTOS = {
  push:  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80&auto=format&fit=crop',
  pull:  'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80&auto=format&fit=crop',
  legs:  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80&auto=format&fit=crop',
  upper: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop',
  cardio:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
};

const WEEK = [
  { d: 'א', label: 'ראשון',  date: '12', status: 'done',    title: 'משיכה אחורית',   meta: 'גב · יד קדמית', mins: 50, ex: 7, photo: W_PHOTOS.pull },
  { d: 'ב', label: 'שני',    date: '13', status: 'done',    title: 'רגליים',          meta: 'כיווץ · עומק',  mins: 55, ex: 6, photo: W_PHOTOS.legs },
  { d: 'ג', label: 'שלישי',  date: '14', status: 'rest',    title: 'מנוחה',           meta: 'התאוששות · ניידות', mins: 20, ex: 0 },
  { d: 'ד', label: 'רביעי',  date: '15', status: 'done',    title: 'משיכה אנכית',    meta: 'גב רחב · ביצועים', mins: 48, ex: 7, photo: W_PHOTOS.upper },
  { d: 'ה', label: 'חמישי',  date: '16', status: 'today',   title: 'דחיפה עליונה',   meta: 'חזה · כתפיים · יד אחורית', mins: 45, ex: 8, photo: W_PHOTOS.push, progress: 5/8 },
  { d: 'ו', label: 'שישי',   date: '17', status: 'planned', title: 'רגליים · ירידה לעומק', meta: 'סקוואט · דדליפט', mins: 52, ex: 7, photo: W_PHOTOS.legs },
  { d: 'ש', label: 'שבת',    date: '18', status: 'rest',    title: 'מנוחה פעילה',    meta: 'הליכה · נשימות', mins: 30, ex: 0 },
];

function W_TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1">
      <NFMark size={30} />
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-white/80 hover:bg-white/5">
        <Iw.Filter className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}

function W_Header() {
  return (
    <div className="px-6 pt-4 pb-4 rise" style={{ animationDelay: '40ms' }}>
      <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">שבוע 8 · פרוגרמה</div>
      <h1 className="mt-1 font-heb text-[30px] leading-[1.1] tracking-tight text-white">
        כוח <span className="text-[36px] font-extrabold text-white/60">+</span> מסה
      </h1>
      <p className="text-[13px] text-white/55 mt-1.5 max-w-[36ch]">
        5 אימוני כוח, 2 ימי מנוחה. עוד 2 אימונים השבוע לסיום.
      </p>

      {/* tally chips */}
      <div className="mt-3 flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full backdrop-blur bg-white/5 ring-1 ring-white/10 text-[11.5px] text-white/80">
          <Iw.Check className="w-3 h-3" style={{ color: '#7BE39A' }} />
          <span className="nums">3 הושלמו</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-[11.5px] text-white"
             style={{ background: 'rgba(225,29,42,0.18)', boxShadow: 'inset 0 0 0 1px rgba(225,29,42,0.40)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E11D2A' }}/>
          <span>היום · דחיפה</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-white/5 ring-1 ring-white/10 text-[11.5px] text-white/70">
          <span className="nums">2 לפניך</span>
        </div>
      </div>
    </div>
  );
}

function W_WeekStrip() {
  return (
    <div className="px-5 mt-1 rise" style={{ animationDelay: '120ms' }}>
      <div className="flex items-stretch justify-between gap-1.5">
        {WEEK.map((day, i) => {
          const isToday = day.status === 'today';
          const isDone  = day.status === 'done';
          const isRest  = day.status === 'rest';
          return (
            <button key={i} className="tap flex-1 rounded-[18px] py-2.5 grid place-items-center relative"
                    style={{
                      background: isToday ? 'rgba(225,29,42,0.10)' : 'rgba(255,255,255,0.03)',
                      boxShadow: isToday
                        ? 'inset 0 0 0 1px rgba(225,29,42,0.45)'
                        : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                    }}>
              <div className={`text-[10px] tracking-wide ${isToday ? 'text-white' : 'text-white/45'}`}>{day.d}</div>
              <div className={`mt-0.5 nums text-[14px] ${isToday ? 'text-white font-semibold' : isDone ? 'text-white/80' : 'text-white/50'}`}>{day.date}</div>
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full"
                   style={{
                     background: isToday ? '#E11D2A'
                       : isDone ? '#7BE39A'
                       : isRest ? 'rgba(255,255,255,0.15)'
                       : 'rgba(255,255,255,0.30)',
                   }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function W_TodayCard() {
  const t = WEEK.find(d => d.status === 'today');
  if (!t) return null;
  return (
    <div className="px-5 mt-4 rise" style={{ animationDelay: '180ms' }}>
      <div className="relative rounded-[28px] overflow-hidden tap"
           style={{ height: 330, boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}>
        <img src={t.photo} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.95) contrast(1.05)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0) 0%, rgba(11,10,8,0.1) 35%, rgba(11,10,8,0.75) 75%, rgba(11,10,8,0.95) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(220deg, rgba(225,29,42,0.20) 0%, rgba(225,29,42,0) 40%)' }} />

        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 backdrop-blur-md bg-black/30 ring-1 ring-white/15 rounded-full px-2.5 h-7">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E11D2A' }}/>
            <span className="text-[11px] tracking-wider uppercase text-white/85">היום · {t.label}</span>
          </div>
          <div className="backdrop-blur-md bg-black/30 ring-1 ring-white/15 rounded-full px-2.5 h-7 grid place-items-center text-[11px] text-white/80 nums">
            {Math.round(t.progress * t.ex)}/{t.ex} תרגילים
          </div>
        </div>

        <div className="absolute bottom-0 right-0 left-0 p-5">
          <div className="text-[12px] tracking-[0.04em] text-white/55 uppercase">פלג גוף עליון</div>
          <h2 className="mt-1 font-heb text-[30px] leading-[1.05] tracking-tight text-white">
            דחיפה <span className="text-[34px] font-extrabold">עליונה</span>
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-white/60">
            <span>{t.meta}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"/>
            <span className="nums">{t.mins} דק׳</span>
          </div>

          <div className="mt-3">
            <div className="relative h-[4px] rounded-full bg-white/12 overflow-hidden">
              <div className="absolute inset-y-0 right-0 h-full barfill"
                   style={{ '--p': t.progress, width: '100%',
                            background: 'linear-gradient(90deg, #FF5A66 0%, #E11D2A 100%)' }} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="tap inline-flex items-center gap-2 rounded-full h-12 px-5 text-[14px] font-semibold text-white whitespace-nowrap"
                    style={{ background: '#E11D2A', boxShadow: '0 10px 30px rgba(225,29,42,0.50), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
              <Iw.Play className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">המשך אימון</span>
              <TripleChevW size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function W_PlanList() {
  return (
    <div className="px-5 mt-5 rise" style={{ animationDelay: '260ms' }}>
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">תוכנית השבוע</div>
        <div className="text-[11px] text-white/45 nums">7 ימים</div>
      </div>
      <div className="space-y-2">
        {WEEK.map((day, i) => <W_DayRow key={i} day={day} />)}
      </div>
    </div>
  );
}

function W_DayRow({ day }) {
  const isToday = day.status === 'today';
  const isDone  = day.status === 'done';
  const isRest  = day.status === 'rest';

  return (
    <button className="w-full tap rounded-2xl p-3 flex items-center gap-3 text-right relative overflow-hidden"
            style={{
              background: isToday ? 'rgba(225,29,42,0.06)' : '#15140F',
              boxShadow: isToday
                ? 'inset 0 0 0 1px rgba(225,29,42,0.35)'
                : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}>
      {/* Photo or rest icon */}
      <div className="w-[58px] h-[58px] rounded-xl overflow-hidden shrink-0 relative"
           style={{ background: isRest ? 'rgba(255,255,255,0.04)' : '#0A0A0B' }}>
        {day.photo && !isRest ? (
          <>
            <img src={day.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)' }}/>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40">
            <Iw.Rest className="w-5 h-5"/>
          </div>
        )}
        {isDone && (
          <div className="absolute bottom-1 left-1 w-4 h-4 rounded-full grid place-items-center"
               style={{ background: '#7BE39A' }}>
            <Iw.Check className="w-2.5 h-2.5 text-ink-950"/>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] tracking-wider uppercase text-white/45">יום {day.d}׳ · {day.label}</span>
          {isToday && (
            <span className="text-[10px] px-1.5 h-4 grid place-items-center rounded-full text-white nums"
                  style={{ background: '#E11D2A' }}>היום</span>
          )}
        </div>
        <div className={`mt-0.5 text-[14.5px] truncate ${isRest ? 'text-white/60' : 'text-white font-medium'}`}>{day.title}</div>
        <div className="mt-0.5 text-[11.5px] text-white/45 truncate">
          {isRest ? day.meta : <>{day.meta} · <span className="nums">{day.mins} דק׳</span> · <span className="nums">{day.ex} תרגילים</span></>}
        </div>
      </div>

      {/* Trailing */}
      {isToday ? (
        <div className="flex items-center gap-1 text-[11.5px] text-white">
          <span className="nums opacity-85">{Math.round(day.progress * 100)}%</span>
          <Iw.ChevL className="w-4 h-4 text-white/60"/>
        </div>
      ) : isDone ? (
        <div className="text-[11px] text-white/45 nums">17.05</div>
      ) : isRest ? (
        <span className="text-[11px] text-white/40">—</span>
      ) : (
        <Iw.ChevL className="w-4 h-4 text-white/30"/>
      )}
    </button>
  );
}

function W_BottomTabs() {
  const items = [
    { key: 'home', label: 'בית', icon: Iw.Home },
    { key: 'workout', label: 'אימון', icon: Iw.Dumb, active: true },
    { key: 'food', label: 'תזונה', icon: Iw.Plate },
    { key: 'progress', label: 'התקדמות', icon: Iw.Chart },
    { key: 'profile', label: 'פרופיל', icon: Iw.User },
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

function WorkoutScreen() {
  return (
    <div dir="rtl" className="relative h-full w-full font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 360px at 100% 0%, rgba(225,29,42,0.10), transparent 60%)' }} />
      <div className="nf-scroll relative h-full w-full overflow-y-auto pt-[54px] pb-[120px]">
        <W_TopBar />
        <W_Header />
        <W_WeekStrip />
        <W_TodayCard />
        <W_PlanList />
        <div className="h-4" />
      </div>
      <W_BottomTabs />
    </div>
  );
}

Object.assign(window, { WorkoutScreen });
