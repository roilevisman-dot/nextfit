// SystemTokens — NextFit brand reference
function SystemTokens() {
  const colors = [
    ['Obsidian',     '#0A0A0B', 'רקע ראשי (כהה)'],
    ['Carbon',       '#15151A', 'כרטיסים (כהה)'],
    ['Bone',         '#FAF9F6', 'רקע ראשי (בהיר)'],
    ['Hairline',     '#ECEAE2', 'גבולות בהירים'],
    ['Ink',          '#0A0A0C', 'טקסט ראשי'],
    ['Slate',        '#52525B', 'טקסט משני'],
    ['Mist',         '#9A9AA3', 'טקסט מושתק'],
    ['NextFit Red',  '#E11D2A', 'אקסנט מותגי'],
    ['Red Hot',      '#FF4A57', 'הדגשה / נטוי'],
    ['Red Deep',     '#B81522', 'לחיצה / hover'],
    ['Red Soft',     '#FDECEE', 'רקע אקסנט (בהיר)'],
    ['Chrome',       'linear-gradient(180deg,#F4F4F6 0%,#C0C2C8 50%,#7E8088 100%)', 'מבטא מטאלי'],
    ['Moss',         '#1F7A55', 'הצלחה · ירידה במשקל'],
  ];
  return (
    <div dir="rtl" className="w-full h-full bg-paper p-6 font-heb text-ink-900 overflow-y-auto" style={{ boxShadow:'inset 0 0 0 1px #ECEAE2' }}>
      {/* Logo block */}
      <div className="flex flex-col items-start gap-2">
        <NFLogo height={88} />
        <div className="text-[10px] tracking-[0.16em] uppercase text-ink-500 -mt-1">Premium personal training</div>
      </div>

      <div className="mt-5 text-[11px] tracking-widest uppercase text-ink-500">Visual system</div>
      <h2 className="text-[34px] font-extrabold text-ink-950 leading-none mt-1 tracking-tight">Obsidian, Bone & Red.</h2>
      <p className="mt-2 text-[13px] text-ink-500 leading-relaxed max-w-[44ch]">
        כהה כפרימיום, בהיר כנקי, ואדום מותגי יחיד כסימן זהות. בלי גרדיאנטים רועשים — רק קונטראסט חד וטיפוגרפיה.
      </p>

      {/* Type */}
      <div className="mt-7">
        <div className="text-[10px] tracking-widest uppercase text-ink-500">Typography</div>
        <div className="mt-3 space-y-3 border-t border-line pt-3">
          <div className="flex items-baseline gap-3">
            <div className="text-[40px] font-extrabold leading-none text-ink-950">אא</div>
            <div>
              <div className="text-[13px] text-ink-900">Assistant · Extra Bold (800)</div>
              <div className="text-[11px] text-ink-500">לכותרות-דגל ולמילים מובלטות</div>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-[28px] tracking-tight leading-none text-ink-950 font-semibold">אבג Ag</div>
            <div>
              <div className="text-[13px] text-ink-900">Assistant · Sans (כל המשקלים)</div>
              <div className="text-[11px] text-ink-500">כל ה-UI, כותרות וטקסט גוף</div>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="font-mono text-[20px] leading-none text-ink-950 nums">1234.56</div>
            <div>
              <div className="text-[13px] text-ink-900">Tabular nums · Geist Mono</div>
              <div className="text-[11px] text-ink-500">מספרי סטטיסטיקה, משקל, קלוריות</div>
            </div>
          </div>
        </div>
      </div>

      {/* Color grid */}
      <div className="mt-7">
        <div className="text-[10px] tracking-widest uppercase text-ink-500">Color</div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
          {colors.map(([name, hex, role]) => (
            <div key={name} className="flex items-center gap-2.5 py-1">
              <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[12px] text-ink-900">{name}</span>
                  <span className="font-mono text-[10px] text-ink-400 truncate">{hex.startsWith('#') ? hex : '— gradient —'}</span>
                </div>
                <div className="text-[10.5px] text-ink-500 truncate">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-7">
        <div className="text-[10px] tracking-widest uppercase text-ink-500">Buttons</div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          <button className="tap text-white rounded-full px-4 h-10 text-[13px] font-medium" style={{ background: '#E11D2A', boxShadow:'0 8px 22px rgba(225,29,42,0.30)' }}>Primary · אדום</button>
          <button className="tap bg-ink-950 text-white rounded-full px-4 h-10 text-[13px] font-medium">Ink · כפתור שחור</button>
          <button className="tap bg-surface text-ink-900 rounded-full px-4 h-10 text-[13px] font-medium" style={{ boxShadow:'inset 0 0 0 1px #ECEAE2' }}>Secondary</button>
          <button className="tap bg-canvas text-ink-700 rounded-full px-4 h-10 text-[13px]">Ghost</button>
        </div>
      </div>

      {/* Radius & elevation */}
      <div className="mt-7">
        <div className="text-[10px] tracking-widest uppercase text-ink-500">Radius · Shadow</div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
          {[
            { r: 12, n: 'sm', s: '0 1px 2px rgba(0,0,0,.04)' },
            { r: 20, n: 'md', s: '0 1px 2px rgba(0,0,0,.04), 0 6px 18px rgba(0,0,0,.05)' },
            { r: 28, n: 'lg', s: '0 1px 2px rgba(0,0,0,.06), 0 18px 40px rgba(0,0,0,.10)' },
          ].map(x => (
            <div key={x.n} className="bg-surface p-3 flex flex-col items-start"
                 style={{ borderRadius: x.r, boxShadow: x.s + ', inset 0 0 0 1px #ECEAE2' }}>
              <div className="text-[10px] tracking-widest uppercase text-ink-500">{x.n}</div>
              <div className="text-[12px] text-ink-700 mt-1 nums">r {x.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Real NextFit mark — cropped from the supplied logo (transparent BG)
function NFMark({ size = 32 }) {
  // mark image is ~320×130 → ratio ~2.46:1
  return (
    <img src="assets/nextfit-mark-t.png" alt="NextFit"
         style={{ height: size, width: 'auto', display: 'block' }}
         draggable="false" />
  );
}

function NFLogo({ height = 72 }) {
  return (
    <img src="assets/nextfit-logo-t.png" alt="NextFit · Train today. Evolve tomorrow."
         style={{ height, width: 'auto', display: 'block' }}
         draggable="false" />
  );
}

Object.assign(window, { SystemTokens, NFMark, NFLogo });
