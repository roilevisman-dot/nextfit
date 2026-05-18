// Splash — opening animation. Starts and ends on the SAME final logo frame,
// so the loop is seamless. Pattern:
//   render → seek to last frame (visible: final logo) → after 600ms reset to 0 + play →
//   on ended → freeze on last frame → after 2s replay.
function SplashScreen() {
  const videoRef = React.useRef(null);
  const [showSkip, setShowSkip] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    let timer;

    const settleAtEnd = () => {
      try { v.pause(); } catch {}
      if (v.duration && isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.05);
    };

    const startCycle = () => {
      if (cancelled) return;
      // Start at the final frame so the user always sees the logo first
      settleAtEnd();
      timer = setTimeout(() => {
        if (cancelled) return;
        try { v.currentTime = 0; } catch {}
        v.play().catch(() => {});
      }, 600);
    };

    const onEnded = () => {
      settleAtEnd();
      timer = setTimeout(() => {
        if (cancelled) return;
        try { v.currentTime = 0; } catch {}
        v.play().catch(() => {});
      }, 2000);
    };

    const onLoaded = () => startCycle();

    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('ended', onEnded);
    // Kick — if metadata is already loaded by the time we attach
    if (v.readyState >= 1) startCycle();

    const skipT = setTimeout(() => setShowSkip(true), 2200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(skipT);
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div dir="rtl" className="relative h-full w-full overflow-hidden font-heb" style={{ background: '#000' }}>
      <video
        ref={videoRef}
        src="assets/splash.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center center' }}
      />

      <div aria-hidden className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />

      <div aria-hidden className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
           style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }} />

      <div className="absolute bottom-0 left-0 right-0 px-8 pb-12">
        <div className="text-center">
          <div className="text-[10.5px] tracking-[0.32em] uppercase text-white/55">Train today</div>
          <div className="mt-1 text-[10.5px] tracking-[0.32em] uppercase text-white/85">
            Evolve <span>tomorrow</span>
          </div>
          <div className="mt-5 mx-auto h-[2px] rounded-full overflow-hidden w-40"
               style={{ background: 'rgba(255,255,255,0.10)' }}>
            <div className="h-full splashfill" style={{ background: 'linear-gradient(90deg, #FF8A95 0%, #E11D2A 100%)' }}/>
          </div>
        </div>
      </div>

      {showSkip && (
        <button className="absolute top-16 left-5 z-30 tap text-[11px] text-white/55 px-3 h-7 rounded-full backdrop-blur"
                style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)', animation: 'fadein 500ms ease both' }}>
          דלג
        </button>
      )}

      <style>{`
        @keyframes splashfill { from { transform: translateX(100%); } to { transform: translateX(0%); } }
        .splashfill {
          width: 100%;
          transform-origin: right center;
          animation: splashfill 10600ms cubic-bezier(.22,1,.36,1) infinite;
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { SplashScreen });
