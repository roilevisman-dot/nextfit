// /progress — weight chart + body measurements + photos + PRs
// Dark mode · RTL · NextFit red

const Ip = {
  Bell:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  ChevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Plus:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Camera:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.5"/></svg>,
  Trophy:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 4h12v3a6 6 0 0 1-12 0V4z"/><path d="M6 5H4a2 2 0 0 0 0 4h2"/><path d="M18 5h2a2 2 0 0 1 0 4h-2"/><path d="M9 21h6"/><path d="M12 17v4"/></svg>,
  TrendD:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>,
  Home:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>,
  Dumb:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Plate: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>,
  Chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  User:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
};

const WEIGHT_SERIES = [
  { d: '20.03', v: 68.4 },
  { d: '27.03', v: 67.8 },
  { d: '03.04', v: 67.1 },
  { d: '10.04', v: 66.5 },
  { d: '17.04', v: 66.0 },
  { d: '24.04', v: 65.4 },
  { d: '01.05', v: 65.0 },
  { d: '08.05', v: 64.6 },
  { d: '17.05', v: 64.2 },
];

function P_TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1">
      <NFMark size={30} />
      <button className="tap relative w-9 h-9 grid place-items-center rounded-full text-white/80 hover:bg-white/5">
        <Ip.Bell className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}

function P_Header() {
  return (
    <div className="px-6 pt-4 pb-3 rise" style={{ animationDelay: '40ms' }}>
      <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">8 שבועות · התקדמות</div>
      <h1 className="mt-1 font-heb text-[30px] leading-[1.1] tracking-tight text-white">
        ההתקדמות <span className="text-[36px] font-extrabold">שלך</span>
      </h1>
      <p className="text-[13px] text-white/55 mt-1.5">
        <span style={{ color: '#7BE39A' }}>−4.2 ק״ג</span> מאז ההתחלה. אתה בכיוון.
      </p>
    </div>
  );
}

function P_PeriodFilter() {
  return (
    <div className="px-5 mt-1 rise" style={{ animationDelay: '80ms' }}>
      <div className="inline-flex p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        {['שבוע','חודש','3 חודשים','הכל'].map((t, i) => (
          <button key={t} className={`tap text-[11.5px] px-3 h-7 rounded-full ${i===2 ? 'text-white' : 'text-white/50'}`}
                  style={i===2 ? { background: '#0A0A0B', boxShadow: '0 4px 12px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(255,255,255,0.10)' } : {}}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function P_WeightChart() {
  const pts = WEIGHT_SERIES;
  const W = 340, H = 160, PADL = 0, PADR = 0, PADT = 18, PADB = 28;
  const vals = pts.map(p => p.v);
  const min = Math.min(...vals) - 0.4, max = Math.max(...vals) + 0.4;
  const xs = (i) => PADL + (i / (pts.length-1)) * (W - PADL - PADR);
  const ys = (v) => PADT + (1 - (v - min) / (max - min)) * (H - PADT - PADB);
  const line = pts.map((p,i) => `${i===0?'M':'L'}${xs(i).toFixed(1)},${ys(p.v).toFixed(1)}`).join(' ');
  const area = `${line} L${xs(pts.length-1).toFixed(1)},${H-PADB} L${xs(0).toFixed(1)},${H-PADB} Z`;
  const cur = pts[pts.length-1];
  const start = pts[0];
  const delta = (cur.v - start.v).toFixed(1);

  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '160ms' }}>
      <div className="relative rounded-[28px] p-5 overflow-hidden"
           style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] tracking-wide uppercase text-white/45">משקל נוכחי</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heb text-[40px] nums text-white leading-none tracking-tight">{cur.v.toFixed(1)}</span>
              <span className="text-[14px] text-white/45">ק״ג</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full nums"
                    style={{ background: 'rgba(123,227,154,0.12)', color: '#7BE39A' }}>
                ↓ {Math.abs(delta)}
              </span>
            </div>
          </div>
          <button className="tap text-[11.5px] text-white font-medium inline-flex items-center gap-1 h-9 px-3 rounded-full"
                  style={{ background: '#E11D2A', boxShadow: '0 8px 20px rgba(225,29,42,0.35)' }}>
            <Ip.Plus className="w-3.5 h-3.5"/>
            עדכן
          </button>
        </div>

        {/* chart */}
        <div className="mt-4 -mx-1">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full" style={{ height: 170 }}>
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E11D2A" stopOpacity="0.30"/>
                <stop offset="100%" stopColor="#E11D2A" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* baselines */}
            {[0.25, 0.5, 0.75].map(p => (
              <line key={p} x1={0} x2={W} y1={PADT + p*(H-PADT-PADB)} y2={PADT + p*(H-PADT-PADB)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4"/>
            ))}
            <path d={area} fill="url(#pGrad)" />
            <path d={line} fill="none" stroke="#FF4A57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p,i) => (
              <circle key={i} cx={xs(i)} cy={ys(p.v)} r={i === pts.length-1 ? 4 : 2.2}
                      fill={i === pts.length-1 ? '#E11D2A' : '#FF8A95'}
                      stroke={i === pts.length-1 ? '#FFFFFF' : 'transparent'} strokeWidth={i === pts.length-1 ? 2 : 0}/>
            ))}
            {/* x-axis labels */}
            {pts.filter((_,i) => i%2===0).map((p,i) => (
              <text key={i} x={xs(i*2)} y={H-8} textAnchor="middle" fontSize="9"
                    fill="rgba(255,255,255,0.40)" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>{p.d}</text>
            ))}
          </svg>
        </div>

        {/* range pills */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/40 nums">
          <span>התחלה {start.v}</span>
          <span>יעד 62.0</span>
        </div>
      </div>
    </div>
  );
}

function P_Measurements() {
  const items = [
    { label: 'חזה',  v: '96.0', unit: 'ס״מ', delta: '+1.2' },
    { label: 'מותן', v: '74.5', unit: 'ס״מ', delta: '−3.0' },
    { label: 'ירך',  v: '58.0', unit: 'ס״מ', delta: '+0.8' },
    { label: 'אחוז שומן', v: '18', unit: '%', delta: '−2.1' },
  ];
  return (
    <div className="px-5 mt-3 rise" style={{ animationDelay: '220ms' }}>
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">מידות גוף</div>
        <span className="text-[11px] text-white/45">10.05</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map(m => {
          const isDown = m.delta.startsWith('−');
          const isGood = (m.label === 'מותן' && isDown) || (m.label === 'אחוז שומן' && isDown) || (!isDown && (m.label === 'חזה' || m.label === 'ירך'));
          return (
            <div key={m.label} className="rounded-2xl p-3 tap" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/55">{m.label}</span>
                <span className="text-[10.5px] px-1.5 py-0.5 rounded-full nums"
                      style={{
                        background: isGood ? 'rgba(123,227,154,0.10)' : 'rgba(255,255,255,0.06)',
                        color: isGood ? '#7BE39A' : 'rgba(255,255,255,0.65)',
                      }}>{m.delta}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-heb text-[22px] nums text-white leading-none tracking-tight">{m.v}</span>
                <span className="text-[11px] text-white/40">{m.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function P_Photos() {
  return (
    <div className="px-5 mt-4 rise" style={{ animationDelay: '300ms' }}>
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">תמונות התקדמות</div>
        <button className="text-[11.5px] inline-flex items-center gap-1 text-white/60">
          <Ip.Camera className="w-3.5 h-3.5"/>
          הוסיפי תמונה
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <PhotoFrame caption="פתיחה" date="20.03" filled="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=70&auto=format&fit=crop"/>
        <PhotoFrame caption="ביניים" date="10.04" filled="https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=400&q=70&auto=format&fit=crop"/>
        <PhotoFrame caption="עכשיו" date="17.05" filled="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=70&auto=format&fit=crop" current/>
      </div>
    </div>
  );
}

function PhotoFrame({ caption, date, filled, current }) {
  return (
    <div className="relative">
      <div className="aspect-[3/4] rounded-2xl overflow-hidden relative"
           style={{ background: '#1C1B17', boxShadow: current ? 'inset 0 0 0 1.5px rgba(225,29,42,0.55)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        {filled ? (
          <>
            <img src={filled} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.85) brightness(0.85)' }}/>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)' }}/>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/35">
            <Ip.Camera className="w-6 h-6"/>
          </div>
        )}
        <div className="absolute bottom-0 right-0 left-0 p-2">
          <div className="text-[10px] tracking-wider uppercase text-white/85">{caption}</div>
          <div className="text-[10px] text-white/50 nums">{date}</div>
        </div>
        {current && (
          <div className="absolute top-2 right-2 text-[9px] tracking-wider uppercase px-1.5 h-4 grid place-items-center rounded-full text-white"
               style={{ background: '#E11D2A' }}>עכשיו</div>
        )}
      </div>
    </div>
  );
}

function P_PRs() {
  const prs = [
    { lift: 'סקוואט', val: '85', unit: 'ק״ג', reps: '5', delta: '+5' },
    { lift: 'דדליפט', val: '105', unit: 'ק״ג', reps: '3', delta: '+10' },
    { lift: 'לחיצת חזה', val: '52.5', unit: 'ק״ג', reps: '6', delta: '+2.5' },
  ];
  return (
    <div className="px-5 mt-4 rise" style={{ animationDelay: '380ms' }}>
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <div className="text-[11px] tracking-[0.18em] uppercase text-white/45">שיאים אישיים</div>
        <span className="text-[11px] text-white/45">PB</span>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#15140F', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        {prs.map((p,i) => (
          <div key={p.lift} className="flex items-center gap-3 p-3.5" style={{ borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div className="w-9 h-9 rounded-xl grid place-items-center"
                 style={{ background: 'rgba(225,29,42,0.12)', color: '#FF8A95' }}>
              <Ip.Trophy className="w-4 h-4"/>
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] text-white font-medium">{p.lift}</div>
              <div className="text-[11px] text-white/45 nums">{p.reps} חזרות · שיא חדש לפני שבוע</div>
            </div>
            <div className="text-left">
              <div className="font-heb text-[18px] nums text-white tracking-tight">{p.val}<span className="text-[11px] text-white/40"> {p.unit}</span></div>
              <div className="text-[10.5px] nums" style={{ color: '#7BE39A' }}>{p.delta} ק״ג</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function P_BottomTabs() {
  const items = [
    { key: 'home', label: 'בית', icon: Ip.Home },
    { key: 'workout', label: 'אימון', icon: Ip.Dumb },
    { key: 'food', label: 'תזונה', icon: Ip.Plate },
    { key: 'progress', label: 'התקדמות', icon: Ip.Chart, active: true },
    { key: 'profile', label: 'פרופיל', icon: Ip.User },
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

function ProgressScreen() {
  return (
    <div dir="rtl" className="relative h-full w-full font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 360px at 100% 0%, rgba(225,29,42,0.10), transparent 60%)' }} />
      <div className="nf-scroll relative h-full w-full overflow-y-auto pt-[54px] pb-[120px]">
        <P_TopBar />
        <P_Header />
        <P_PeriodFilter />
        <P_WeightChart />
        <P_Measurements />
        <P_Photos />
        <P_PRs />
        <div className="h-4" />
      </div>
      <P_BottomTabs />
    </div>
  );
}

Object.assign(window, { ProgressScreen });
