// Auth flow: Welcome / Login / Signup / Forgot / Join Code
// Dark mode · RTL · NextFit red

const Ia = {
  Mail:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  Lock:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>,
  User:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
  Eye:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19"/><path d="m1 1 22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>,
  ChevR: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 6 6 6-6 6"/></svg>,
  ChevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>,
  Coach: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>,
  Run:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="13" cy="4" r="2"/><path d="M4 22 7 17l3 1 2-5 4 4-1 3"/><path d="m4 11 5-1 4 4 4-1"/></svg>,
  Apple: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.6 13.2c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1-.9 0-2.3-1-3.8-1-2 0-3.8 1.1-4.8 2.9-2 3.5-.5 8.7 1.5 11.5.9 1.4 2.1 2.9 3.6 2.9 1.4-.1 2-.9 3.7-.9s2.2.9 3.8.9c1.6 0 2.6-1.4 3.5-2.8 1.1-1.6 1.6-3.2 1.6-3.3-.1 0-3-.9-3-3.4zM14.7 4.6c.8-1 1.3-2.4 1.2-3.7-1.1.1-2.5.8-3.3 1.7-.7.8-1.4 2.2-1.2 3.4 1.2.1 2.5-.6 3.3-1.4z"/></svg>,
  Google:(p) => <svg viewBox="0 0 24 24" {...p}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Help:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5"/><path d="M12 17h.01"/></svg>,
};

// Shared field component
function A_Field({ icon, label, value, onChange, type='text', placeholder, focused, autoFocus, dir='ltr' }) {
  const [pwShown, setPwShown] = React.useState(false);
  const isPassword = type === 'password';
  const showType = isPassword && !pwShown ? 'password' : 'text';
  return (
    <div>
      <label className="text-[11px] tracking-wide text-white/55">{label}</label>
      <div className="mt-1.5 relative rounded-2xl transition-all duration-200"
           style={{
             background: '#15140F',
             boxShadow: focused
               ? 'inset 0 0 0 1.5px rgba(225,29,42,0.55), 0 0 0 4px rgba(225,29,42,0.10)'
               : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
           }}>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </div>
        <input
          type={showType}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          autoFocus={autoFocus}
          dir={dir}
          placeholder={placeholder}
          className="w-full h-12 pr-10 pl-10 bg-transparent text-white text-[14.5px] outline-none placeholder:text-white/30"
          style={{ caretColor: '#FF4A57' }}
        />
        {isPassword && (
          <button type="button" onClick={() => setPwShown(p => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 tap">
            {pwShown ? <Ia.EyeOff className="w-[18px] h-[18px]"/> : <Ia.Eye className="w-[18px] h-[18px]"/>}
          </button>
        )}
      </div>
    </div>
  );
}

function A_RedButton({ children, className = '' }) {
  return (
    <button className={`tap w-full h-12 rounded-full text-white font-semibold text-[14.5px] ${className}`}
            style={{ background: '#E11D2A', boxShadow: '0 12px 30px rgba(225,29,42,0.45), inset 0 1px 0 rgba(255,255,255,0.20)' }}>
      {children}
    </button>
  );
}

function A_BackBtn() {
  return (
    <button className="tap w-9 h-9 grid place-items-center rounded-full text-white"
            style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
      <Ia.ChevR className="w-[18px] h-[18px]"/>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 1) Welcome — role choice
// ─────────────────────────────────────────────────────────────
const WELCOME_PHOTO = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80&auto=format&fit=crop';

function A_Welcome() {
  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb text-white" style={{ background: '#0B0A08' }}>
      {/* Full-bleed photo */}
      <img src={WELCOME_PHOTO} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(0.85) contrast(1.1) brightness(0.78)' }}/>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0.55) 0%, rgba(11,10,8,0.10) 25%, rgba(11,10,8,0.78) 58%, rgba(11,10,8,0.98) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(700px 350px at 0% 100%, rgba(225,29,42,0.30), transparent 60%)' }} />

      <div className="relative h-full w-full flex flex-col pt-[64px] pb-[36px] px-7">
        {/* Logo — pinned to upper right corner */}
        <div className="absolute top-12 right-5 z-10 rise" style={{ animationDelay: '60ms' }}>
          <NFMark size={26} />
        </div>

        {/* Display copy */}
        <div className="mt-auto rise" style={{ animationDelay: '160ms' }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/60">NextFit · Personal</div>
          <h1 className="mt-2 text-[34px] leading-[1.08] tracking-tight text-white font-semibold">
            מוכנים <span className="text-[40px] font-extrabold">להתחיל?</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/70 max-w-[32ch] leading-relaxed">
            התוכנית האישית שלך — או הכלי לנהל את המתאמנים. בחר כדי להמשיך.
          </p>
        </div>

        {/* Role cards */}
        <div className="mt-7 space-y-2.5 rise" style={{ animationDelay: '260ms' }}>
          <button className="tap w-full text-right p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
                  style={{ background: 'rgba(20,18,15,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}>
            <div className="w-11 h-11 rounded-xl grid place-items-center"
                 style={{ background: 'rgba(225,29,42,0.18)', color: '#FF8A95' }}>
              <Ia.Run className="w-5 h-5"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-white">אני מתאמן/ת</div>
              <div className="text-[11.5px] text-white/65 mt-0.5">הצטרפו עם קוד מהמאמן שלכם</div>
            </div>
            <Ia.ChevL className="w-4 h-4 text-white/55"/>
          </button>

          <button className="tap w-full text-right p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
                  style={{ background: '#E11D2A', boxShadow: '0 14px 36px rgba(225,29,42,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-white/15">
              <Ia.Coach className="w-5 h-5"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-white">אני מאמן/ת</div>
              <div className="text-[11.5px] text-white/85 mt-0.5">נהל את המתאמנים והתוכניות שלך</div>
            </div>
            <Ia.ChevL className="w-4 h-4 text-white/90"/>
          </button>
        </div>

        <div className="mt-4 text-center text-[10.5px] text-white/55 rise leading-relaxed" style={{ animationDelay: '360ms' }}>
          ההמשך מהווה הסכמה ל<span className="underline">תנאי השימוש</span> ול<span className="underline">מדיניות הפרטיות</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2) Login — trainer
// ─────────────────────────────────────────────────────────────
function A_Login() {
  const [email, setEmail] = React.useState('yoav@nextfit.app');
  const [password, setPassword] = React.useState('••••••••');
  const [focus, setFocus] = React.useState('password');
  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 380px at 100% 0%, rgba(225,29,42,0.12), transparent 60%)' }} />

      <div className="relative h-full w-full flex flex-col pt-[58px] pb-[40px] px-7">
        <div className="flex items-center justify-between">
          <A_BackBtn />
          <NFMark size={28} />
        </div>

        {/* Hero copy */}
        <div className="mt-8 rise" style={{ animationDelay: '40ms' }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/65">כניסת מאמן</div>
          <h1 className="mt-2 font-heb text-[34px] leading-[1.1] tracking-tight text-white">
            ברוכים <span className="text-[40px] font-extrabold">השבים</span>
            <span className="text-white/45">.</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/72 max-w-[36ch]">
            התחבר כדי לראות את המתאמנים שלך ולנהל את התוכניות.
          </p>
        </div>

        {/* Form */}
        <div className="mt-7 space-y-4 rise" style={{ animationDelay: '120ms' }}>
          <div onClick={() => setFocus('email')}>
            <A_Field
              icon={<Ia.Mail className="w-[18px] h-[18px]" />}
              label="כתובת אימייל"
              value={email}
              onChange={setEmail}
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              focused={focus === 'email'}
            />
          </div>
          <div onClick={() => setFocus('password')}>
            <A_Field
              icon={<Ia.Lock className="w-[18px] h-[18px]" />}
              label="סיסמה"
              value={password}
              onChange={setPassword}
              type="password"
              dir="ltr"
              placeholder="הסיסמה שלך"
              focused={focus === 'password'}
            />
            <div className="mt-2 flex justify-start">
              <button className="text-[11.5px] text-white/72 underline-offset-2 hover:underline">שכחתי סיסמה?</button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 rise" style={{ animationDelay: '220ms' }}>
          <A_RedButton>התחבר</A_RedButton>
        </div>

        {/* Or divider */}
        <div className="mt-5 flex items-center gap-3 rise" style={{ animationDelay: '280ms' }}>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[10.5px] tracking-wider uppercase text-white/55">או</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Social */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 rise" style={{ animationDelay: '320ms' }}>
          <button className="tap h-11 rounded-full flex items-center justify-center gap-2 text-white text-[13px]"
                  style={{ background: '#0A0A0B', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' }}>
            <Ia.Apple className="w-4 h-4"/>
            Apple
          </button>
          <button className="tap h-11 rounded-full flex items-center justify-center gap-2 text-white text-[13px]"
                  style={{ background: '#0A0A0B', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' }}>
            <Ia.Google className="w-4 h-4"/>
            Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/68">
          אין לך חשבון? <button className="text-white font-medium underline-offset-2 hover:underline">הירשם כמאמן</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) Signup — trainer
// ─────────────────────────────────────────────────────────────
function A_Signup() {
  const [name, setName]   = React.useState('יואב כהן');
  const [email, setEmail] = React.useState('');
  const [pw, setPw]       = React.useState('');
  const [focus, setFocus] = React.useState('email');
  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 380px at 0% 0%, rgba(225,29,42,0.12), transparent 60%)' }} />

      <div className="relative h-full w-full flex flex-col pt-[58px] pb-[40px] px-7">
        <div className="flex items-center justify-between">
          <A_BackBtn />
          <NFMark size={28} />
        </div>

        <div className="mt-8 rise" style={{ animationDelay: '40ms' }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/65">הרשמת מאמן</div>
          <h1 className="mt-2 font-heb text-[34px] leading-[1.1] tracking-tight text-white">
            בוא <span className="text-[40px] font-extrabold">נתחיל</span>
            <span className="text-white/45">.</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/72 max-w-[36ch]">
            צרו חשבון תוך פחות מדקה. עד 50 מתאמנים בחשבון הבסיסי.
          </p>
        </div>

        <div className="mt-6 space-y-3.5 rise" style={{ animationDelay: '120ms' }}>
          <div onClick={() => setFocus('name')}>
            <A_Field icon={<Ia.User className="w-[18px] h-[18px]" />} label="שם מלא" value={name} onChange={setName} placeholder="ישראל ישראלי" focused={focus === 'name'} dir="rtl" />
          </div>
          <div onClick={() => setFocus('email')}>
            <A_Field icon={<Ia.Mail className="w-[18px] h-[18px]" />} label="כתובת אימייל" value={email} onChange={setEmail} type="email" placeholder="name@example.com" focused={focus === 'email'} dir="ltr" />
          </div>
          <div onClick={() => setFocus('pw')}>
            <A_Field icon={<Ia.Lock className="w-[18px] h-[18px]" />} label="סיסמה" value={pw} onChange={setPw} type="password" placeholder="לפחות 8 תווים" focused={focus === 'pw'} dir="ltr" />
            <div className="mt-2 flex items-center gap-1">
              {[0,1,2,3].map(i => (
                <div key={i} className="flex-1 h-[3px] rounded-full" style={{ background: i < (pw.length >= 8 ? 4 : pw.length >= 4 ? 2 : pw.length > 0 ? 1 : 0) ? '#FF4A57' : 'rgba(255,255,255,0.08)' }} />
              ))}
              <span className="text-[10px] text-white/55 mr-1">{pw.length >= 8 ? 'חזקה' : pw.length >= 4 ? 'בינונית' : pw.length > 0 ? 'חלשה' : ''}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 rise" style={{ animationDelay: '220ms' }}>
          <A_RedButton>צור חשבון</A_RedButton>
        </div>

        <div className="mt-3 text-center text-[10.5px] text-white/55 leading-relaxed rise" style={{ animationDelay: '280ms' }}>
          ביצירת חשבון אתם מסכימים ל<span className="underline">תנאי השימוש</span><br/>ול<span className="underline">מדיניות הפרטיות</span>
        </div>

        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/68">
          כבר רשום? <button className="text-white font-medium underline-offset-2 hover:underline">התחבר</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4) Forgot password
// ─────────────────────────────────────────────────────────────
function A_Forgot() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent]   = React.useState(false);
  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 380px at 100% 0%, rgba(225,29,42,0.10), transparent 60%)' }} />

      <div className="relative h-full w-full flex flex-col pt-[58px] pb-[40px] px-7">
        <div className="flex items-center justify-between">
          <A_BackBtn />
          <NFMark size={28} />
        </div>

        <div className="mt-10 rise" style={{ animationDelay: '40ms' }}>
          <div className="w-14 h-14 rounded-2xl grid place-items-center mb-5"
               style={{ background: 'rgba(225,29,42,0.12)', color: '#FF8A95', boxShadow: 'inset 0 0 0 1px rgba(225,29,42,0.30)' }}>
            <Ia.Lock className="w-6 h-6"/>
          </div>
          <h1 className="font-heb text-[32px] leading-[1.1] tracking-tight text-white">
            שכחת <span className="text-[38px] font-extrabold">סיסמה?</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/60 max-w-[36ch]">
            הזן את האימייל שאיתו נרשמת ונשלח אליך קישור איפוס מאובטח.
          </p>
        </div>

        <div className="mt-7 rise" style={{ animationDelay: '120ms' }}>
          <A_Field icon={<Ia.Mail className="w-[18px] h-[18px]" />} label="כתובת אימייל" value={email} onChange={setEmail} type="email" placeholder="name@example.com" focused={!sent} dir="ltr" />
        </div>

        <div className="mt-5 rise" style={{ animationDelay: '200ms' }}>
          <A_RedButton>{sent ? 'נשלח ✓' : 'שלח קישור איפוס'}</A_RedButton>
        </div>

        {sent && (
          <div className="mt-4 p-3 rounded-2xl text-[12px] text-white/75 leading-relaxed" style={{ background: 'rgba(123,227,154,0.08)', boxShadow: 'inset 0 0 0 1px rgba(123,227,154,0.30)' }}>
            ✓ אם החשבון קיים, ישלח אליו אימייל עם קישור איפוס בדקות הקרובות.
          </div>
        )}

        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/50">
          נזכרת? <button className="text-white font-medium underline-offset-2 hover:underline">חזרה לכניסה</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5) Join — trainee code entry
// ─────────────────────────────────────────────────────────────
function A_JoinCode() {
  const [digits, setDigits] = React.useState(['4','7','9','2','',  '']);
  const idx = digits.findIndex(d => d === '');
  const cursor = idx === -1 ? 5 : idx;

  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb text-white" style={{ background: '#0B0A08' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 380px at 50% 0%, rgba(225,29,42,0.14), transparent 60%)' }} />

      <div className="relative h-full w-full flex flex-col pt-[58px] pb-[40px] px-7">
        <div className="flex items-center justify-between">
          <A_BackBtn />
          <NFMark size={28} />
        </div>

        <div className="mt-9 rise" style={{ animationDelay: '40ms' }}>
          <div className="text-[11px] tracking-[0.32em] uppercase text-white/45">הצטרפות למתאמן</div>
          <h1 className="mt-2 font-heb text-[34px] leading-[1.1] tracking-tight text-white">
            הזן את <span className="text-[40px] font-extrabold">הקוד</span>
            <span className="text-white/30">.</span>
          </h1>
          <p className="mt-2 text-[13.5px] text-white/60 max-w-[36ch]">
            קיבלת קוד בן 6 ספרות מהמאמן שלך? הזן אותו כדי לפתוח את התוכנית האישית.
          </p>
        </div>

        {/* OTP boxes */}
        <div className="mt-8 rise" style={{ animationDelay: '120ms' }} dir="ltr">
          <div className="flex items-center justify-between gap-1.5">
            {digits.map((d, i) => {
              const isCursor = i === cursor && idx !== -1;
              const filled = d !== '';
              return (
                <div key={i} className="relative flex-1" style={{ maxWidth: 48 }}>
                  <div className="aspect-square rounded-2xl flex items-center justify-center font-heb text-[26px] nums text-white tracking-tight transition-all duration-150"
                       style={{
                         background: isCursor ? 'rgba(225,29,42,0.06)' : '#15140F',
                         boxShadow: isCursor
                           ? 'inset 0 0 0 1.5px rgba(225,29,42,0.55), 0 0 0 4px rgba(225,29,42,0.10)'
                           : filled
                             ? 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                             : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                       }}>
                    {d}
                    {isCursor && (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-7 rounded-full"
                            style={{ background: '#FF4A57', animation: 'blink 1.1s infinite' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coach preview card (shown when first digits match a known coach) */}
        <div className="mt-7 rounded-2xl p-3.5 flex items-center gap-3 rise" style={{
          animationDelay: '220ms',
          background: '#15140F',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}>
          <div className="w-11 h-11 rounded-full grid place-items-center" style={{ background: 'linear-gradient(135deg, #FF4A57, #B81522)' }}>
            <span className="font-heb font-bold text-[15px] text-white">יע</span>
          </div>
          <div className="flex-1">
            <div className="text-[10.5px] tracking-wider uppercase text-white/45">מצטרף ל</div>
            <div className="text-[14px] font-medium text-white">יואב כהן · NextFit</div>
            <div className="text-[11px] text-white/50">מאמן כוח · 8 שנות ניסיון</div>
          </div>
          <Ia.Check className="w-5 h-5" style={{ color: '#7BE39A' }} />
        </div>

        <div className="mt-5 rise" style={{ animationDelay: '300ms' }}>
          <A_RedButton>המשך לתוכנית שלי</A_RedButton>
        </div>

        <div className="mt-auto pt-6 text-center text-[12.5px] text-white/50 flex items-center justify-center gap-1.5">
          <Ia.Help className="w-3.5 h-3.5"/>
          <span>אין לי קוד · </span>
          <button className="text-white underline-offset-2 hover:underline">דבר עם תמיכה</button>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}

Object.assign(window, { A_Welcome, A_Login, A_Signup, A_Forgot, A_JoinCode });
