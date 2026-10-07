import { useEffect, useRef } from 'react';
/** Interactive Bloch-sphere: the state vector follows the pointer, and drifts gently when idle. */
export default function HeroVisual() {
  const box = useRef<HTMLDivElement>(null);
  const vec = useRef<SVGLineElement>(null);
  const tip = useRef<SVGCircleElement>(null);
  const proj = useRef<SVGLineElement>(null);
  const shadow = useRef<SVGCircleElement>(null);
  const target = useRef<{ x: number; y: number } | null>(null);
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    let raf = 0, t = 0; let cur = { x: 90, y: -100 };
    const apply = (p: { x: number; y: number }) => {
      vec.current?.setAttribute('x2', String(p.x)); vec.current?.setAttribute('y2', String(p.y));
      tip.current?.setAttribute('cx', String(p.x)); tip.current?.setAttribute('cy', String(p.y));
      proj.current?.setAttribute('x2', String(p.x)); proj.current?.setAttribute('y2', String(p.x * 0.0 + p.x * 0.12 + 0));
      shadow.current?.setAttribute('cx', String(p.x)); shadow.current?.setAttribute('cy', String(p.x * 0.12));
    };
    apply(cur);
    if (reduce) return;
    const loop = () => {
      t += 0.008;
      const goal = target.current ?? { x: Math.cos(t) * 120, y: -Math.abs(Math.sin(t * 0.7)) * 120 - 20 };
      cur = { x: cur.x + (goal.x - cur.x) * 0.08, y: cur.y + (goal.y - cur.y) * 0.08 };
      apply(cur); raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [reduce]);
  const move = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect(); const s = 520 / r.width;
    let x = (e.clientX - r.left - r.width / 2) * s, y = (e.clientY - r.top - r.height / 2) * s;
    const d = Math.hypot(x, y), m = 165; if (d > m) { x = (x / d) * m; y = (y / d) * m; }
    target.current = { x, y };
  };
  return (
    <div ref={box} onPointerMove={move} onPointerLeave={() => (target.current = null)} className="relative mx-auto aspect-square w-full max-w-[520px]" role="img"
      aria-label="Interactive Bloch sphere illustration: the quantum state vector follows your pointer">
      <svg viewBox="-260 -260 520 520" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="sph" cx="35%" cy="30%"><stop offset="0" stopColor="#7C5CFF" stopOpacity=".28" /><stop offset=".6" stopColor="#3B3FD8" stopOpacity=".08" /><stop offset="1" stopColor="#18B9DC" stopOpacity=".16" /></radialGradient>
          <linearGradient id="vecg" x1="0" x2="1"><stop offset="0" stopColor="#3B3FD8" /><stop offset="1" stopColor="#18B9DC" /></linearGradient>
        </defs>
        <circle r="215" fill="none" stroke="#3B3FD8" strokeOpacity=".18" strokeDasharray="2 9" strokeLinecap="round" />
        <circle r="238" fill="none" stroke="#18B9DC" strokeOpacity=".18" />
        <circle r="180" fill="url(#sph)" stroke="#3B3FD8" strokeOpacity=".5" strokeWidth="1.2" />
        <ellipse rx="180" ry="52" fill="none" stroke="#3B3FD8" strokeOpacity=".45" />
        <ellipse rx="62" ry="180" fill="none" stroke="#7C5CFF" strokeOpacity=".3" />
        <ellipse rx="118" ry="180" fill="none" stroke="#7C5CFF" strokeOpacity=".2" />
        <line y1="-215" y2="215" stroke="#0B1530" strokeOpacity=".5" />
        <line x1="-215" x2="215" stroke="#0B1530" strokeOpacity=".2" strokeDasharray="4 5" />
        <text y="-222" textAnchor="middle" className="fill-navy-900 font-display text-[17px] font-semibold">|0⟩</text>
        <text y="238" textAnchor="middle" className="fill-navy-900 font-display text-[17px] font-semibold">|1⟩</text>
        <line ref={proj} x1="0" y1="0" x2="0" y2="0" stroke="#7C5CFF" strokeOpacity=".5" strokeDasharray="3 4" />
        <circle ref={shadow} r="4" fill="#7C5CFF" fillOpacity=".4" />
        <line ref={vec} x1="0" y1="0" stroke="url(#vecg)" strokeWidth="3.5" strokeLinecap="round" />
        <circle r="6" fill="#0B1530" />
        <circle ref={tip} r="9" fill="#fff" stroke="#3B3FD8" strokeWidth="3" />
        {!reduce && [0, 1.3, 2.6].map((d, i) => (
          <circle key={i} r="5" fill={['#18B9DC', '#7C5CFF', '#3B3FD8'][i]}>
            <animateMotion dur="9s" begin={`${-d * 3}s`} repeatCount="indefinite" path={['M180 0A180 52 0 1 1 -180 0A180 52 0 1 1 180 0Z', 'M62 0A62 180 0 1 1 -62 0A62 180 0 1 1 62 0Z', 'M118 0A118 180 0 1 1 -118 0A118 180 0 1 1 118 0Z'][i]} />
          </circle>
        ))}
      </svg>
    </div>
  );
}
