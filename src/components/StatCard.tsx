import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
export default function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    let raf = 0; const t0 = performance.now();
    const f = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div ref={ref} className="border-l border-slate-200 pl-6">
      <p className="font-display text-6xl font-semibold tabular-nums text-slate-900 sm:text-7xl" aria-label={`${value}${suffix} ${label}`}>
        <span aria-hidden="true">{n}{suffix}</span></p>
      <p className="mt-2 text-slate-600">{label}</p>
    </div>
  );
}
