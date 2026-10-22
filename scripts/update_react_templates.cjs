const fs = require('fs');

// 1. Update test_templates/src/data/templates.ts
let tpls = fs.readFileSync('test_templates/src/data/templates.ts', 'utf8');
const target = 'export const templates: Template[] = [';
const insert = `export const templates: Template[] = [
  {
    id: 'cinematic-light-trail-typewriter',
    name: 'Cinematic Light Trail & Glitch',
    category: 'Typography',
    description: 'Black screen typewriter typography with horizontal luminous light trails, CRT scanlines, 35mm film dust, digital glitch-out, and secondary scene reveal.',
    duration: '7s',
    difficulty: 'Easy',
    tags: ['typewriter', 'light-trail', 'anamorphic', 'glitch', 'cinematic', 'titles'],
    previewType: 'lightTrailTypewriter',
    featured: true
  },`;

if (!tpls.includes('cinematic-light-trail-typewriter')) {
  tpls = tpls.replace(target, insert);
  fs.writeFileSync('test_templates/src/data/templates.ts', tpls, 'utf8');
  console.log('1. Added to test_templates/src/data/templates.ts');
} else {
  console.log('1. Already in test_templates/src/data/templates.ts');
}

// 2. Update test_templates/src/components/TemplatePreview.tsx
let prev = fs.readFileSync('test_templates/src/components/TemplatePreview.tsx', 'utf8');
const switchTarget = "case 'typewriter':\n      return <TypewriterPreview />;";
const switchTargetCrlf = "case 'typewriter':\r\n      return <TypewriterPreview />;";
const caseCode = `case 'lightTrailTypewriter':
      return <LightTrailTypewriterPreview />;
    `;

if (!prev.includes('lightTrailTypewriter')) {
  if (prev.includes(switchTarget)) {
    prev = prev.replace(switchTarget, caseCode + switchTarget);
  } else if (prev.includes(switchTargetCrlf)) {
    prev = prev.replace(switchTargetCrlf, caseCode + switchTargetCrlf);
  } else {
    // replace by first case
    prev = prev.replace("case 'parallax':", caseCode + "case 'parallax':");
  }

  // Component definition to add at the end of TemplatePreview.tsx
  const compDef = `

// Cinematic Light Trail & Glitch Typewriter Preview Component
const LightTrailTypewriterPreview = () => {
  const [phase, setPhase] = React.useState<'typing' | 'glitch' | 'reveal'>('typing');
  const [typedChars, setTypedChars] = React.useState(0);
  const fullText = "THIS IS NOT ONE OF THOSE STORIES";

  React.useEffect(() => {
    let charIndex = 0;
    let timer: any;

    const runCycle = () => {
      setPhase('typing');
      charIndex = 0;
      setTypedChars(0);

      const typeInterval = setInterval(() => {
        charIndex++;
        setTypedChars(charIndex);
        if (charIndex >= fullText.length) {
          clearInterval(typeInterval);
          // Hold completed text, then glitch
          setTimeout(() => {
            setPhase('glitch');
            setTimeout(() => {
              setPhase('reveal');
              setTimeout(() => {
                runCycle();
              }, 2200);
            }, 600);
          }, 1200);
        }
      }, 70);
    };

    runCycle();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center select-none">
      {/* Background radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(0,0,0,0.95)_75%,#000000_100%)] pointer-events-none" />

      {/* Secondary revealed image when in reveal mode */}
      {phase === 'reveal' && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 animate-in fade-in zoom-in-105"
          style={{ backgroundImage: 'url(/boardroom_scene_hd.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
          <div className="absolute bottom-3 left-4 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            SCENE REVEALED
          </div>
        </div>
      )}

      {/* Horizontal Anamorphic Light Beam Streak */}
      {phase !== 'reveal' && typedChars > 0 && (
        <div className="absolute w-[95%] h-[4px] pointer-events-none flex items-center justify-center">
          {/* Outer soft bloom streak */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[6px]" />
          {/* Intense center razor core */}
          <div className="absolute w-[80%] h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#38bdf8]" />
        </div>
      )}

      {/* Typewriter Text or Glitched Text */}
      {phase !== 'reveal' && (
        <div className="relative z-10 px-6 text-center">
          {phase === 'glitch' ? (
            <div className="relative font-sans text-sm md:text-base font-black tracking-[0.2em] text-white uppercase animate-pulse">
              <span className="block skew-x-[-15deg] translate-x-1 text-red-500/80 absolute inset-0 blur-[0.5px]">
                {fullText}
              </span>
              <span className="block skew-x-[15deg] -translate-x-1 text-cyan-400/80 absolute inset-0 blur-[0.5px]">
                {fullText}
              </span>
              <span className="relative drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                {fullText}
              </span>
              <div className="absolute inset-0 bg-white/25 mix-blend-overlay animate-ping" />
            </div>
          ) : (
            <div className="font-sans text-sm md:text-base font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <span>{fullText.slice(0, typedChars)}</span>
              <span className="inline-block w-2 text-cyan-400 font-mono animate-pulse">_</span>
            </div>
          )}
        </div>
      )}

      {/* CRT Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)'
        }}
      />

      {/* Atmospheric Film Dust Hint */}
      <div className="absolute top-2 right-2 text-[9px] font-mono font-bold text-white/40 tracking-widest uppercase">
        CINEMATIC 2.39:1
      </div>
    </div>
  );
};
`;

  prev += compDef;
  fs.writeFileSync('test_templates/src/components/TemplatePreview.tsx', prev, 'utf8');
  console.log('2. Added LightTrailTypewriterPreview to TemplatePreview.tsx');
} else {
  console.log('2. Already present in TemplatePreview.tsx');
}
