import os

path = r'test_templates/src/components/TemplatePreview.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_block = """const CountdownTimerPreview = () => (
  <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="text-3xl font-mono font-black text-red-500" style={{ animation: 'countdownPulse 1s ease-in-out infinite' }}>
        3
      </div>
      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2" />
    </div>
    {/* Pulsing ring */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-2 border-red-500/30" style={{ animation: 'countdownRing 1s ease-out infinite' }} />
    </div>
  </div>
);"""

new_block = """const CountdownTimerPreview = () => {
  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => (prev <= 1 ? 3 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#05060a] flex items-center justify-center select-none font-sans">
      {/* Radial crimson vignette backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.22)_0%,rgba(15,3,6,0.85)_50%,#020104_100%)] pointer-events-none" />

      {/* Subtle tactical grid lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(239,68,68,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Subtle CRT scanlines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)'
        }}
      />

      {/* Top HUD Header */}
      <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 px-3 py-1 rounded bg-black/60 border border-red-500/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="text-[9px] sm:text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
          T-MINUS // TIME REMAINING
        </span>
      </div>

      {/* Central Interactive HUD Dial */}
      <div className="relative flex items-center justify-center w-[75vw] h-[75vw] max-w-[340px] max-h-[340px] sm:max-w-[420px] sm:max-h-[420px]">
        {/* Outermost Radar Reticle with Ticks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" strokeDasharray="1 8" />
        </svg>

        {/* Dynamic Progress Arc Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="76"
            fill="none"
            stroke="rgba(239,68,68,0.15)"
            strokeWidth="5"
          />
          <circle
            cx="100"
            cy="100"
            r="76"
            fill="none"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={477.5}
            style={{
              strokeDashoffset: 477.5 * (1 - count / 3),
              transition: 'stroke-dashoffset 0.95s linear',
              filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.8))'
            }}
          />
        </svg>

        {/* Expanding Pulse Shockwave */}
        <div
          key={count}
          className="absolute inset-4 rounded-full border border-red-500/50 pointer-events-none"
          style={{ animation: 'countdownRing 1s cubic-bezier(0.1, 0.8, 0.2, 1) infinite' }}
        />

        {/* Center Number Block */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            key={`num-${count}`}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-red-600 leading-none drop-shadow-[0_0_35px_rgba(239,68,68,0.85)] tracking-tighter"
            style={{ animation: 'countdownPulse 0.95s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}
          >
            {count}
          </div>
          <div className="w-20 sm:w-28 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2 sm:mt-3 shadow-[0_0_10px_#ef4444]" />
          <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.25em] text-red-300/80 mt-1 uppercase font-semibold">
            SECONDS
          </span>
        </div>

        {/* Tactical Crosshair Coordinates */}
        <div className="absolute top-2 left-2 text-[8px] font-mono text-red-500/60">[00:03.00]</div>
        <div className="absolute top-2 right-2 text-[8px] font-mono text-red-500/60">SEC.SYS // REC</div>
        <div className="absolute bottom-2 left-2 text-[8px] font-mono text-red-500/60">LAT 37.77 // LNG</div>
        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-red-500/60">BURST CLIMAX</div>
      </div>

      {/* Bottom Status Card */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-[9px] sm:text-xs font-mono font-bold tracking-widest text-red-400 uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
          &lt; CLIMAX IMPACT AT T-ZERO &gt;
        </p>
      </div>
    </div>
  );
};"""

c_normalized = c.replace('\r\n', '\n')
old_normalized = old_block.replace('\r\n', '\n')
new_normalized = new_block.replace('\r\n', '\n')

if old_normalized in c_normalized:
    res = c_normalized.replace(old_normalized, new_normalized)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(res)
    print("SUCCESSFULLY_PATCHED")
else:
    print("OLD_BLOCK_NOT_FOUND")
