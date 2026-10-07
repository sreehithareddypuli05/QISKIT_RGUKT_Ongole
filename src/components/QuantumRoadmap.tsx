import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ROADMAP } from '../data/content';
export default function QuantumRoadmap() {
  const [a, setA] = useState(0); const cur = ROADMAP[a];
  return (
    <div>
      <div role="tablist" aria-label="Learning roadmap" className="relative grid gap-3 md:grid-cols-5 md:gap-0">
        <div aria-hidden="true" className="absolute left-[19px] top-4 hidden h-[calc(100%-2rem)] w-px bg-line max-md:block" />
        <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[19px] hidden h-px bg-line md:block">
          <motion.div className="h-full bg-gradient-to-r from-violet-q to-violet-q" animate={{ width: `${(a / (ROADMAP.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
        </div>
        {ROADMAP.map((r, i) => (
          <button key={r.id} role="tab" id={`tab-${r.id}`} aria-selected={i === a} aria-controls="roadmap-panel" tabIndex={i === a ? 0 : -1}
            onClick={() => setA(i)} onMouseEnter={() => setA(i)}
            onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setA((i + 1) % ROADMAP.length); if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setA((i + ROADMAP.length - 1) % ROADMAP.length); }}
            className="relative flex items-center gap-4 text-left md:flex-col md:gap-4 md:text-center">
            <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-display text-sm font-semibold transition-colors ${i <= a ? 'border-violet-q bg-violet-q text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>{i + 1}</span>
            <span className={`font-display text-base font-medium transition-colors md:max-w-[9rem] ${i === a ? 'text-navy-q' : 'text-slate-500'}`}>{r.title}</span>
          </button>
        ))}
      </div>
      <div id="roadmap-panel" role="tabpanel" aria-labelledby={`tab-${cur.id}`} className="mt-10 min-h-[9rem] rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
            <h3 className="text-2xl font-semibold">{cur.title}</h3>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">{cur.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-violet-q/40 bg-white p-6">
        <p className="font-display font-semibold">Official 11-subject curriculum</p>
        <p className="mt-1 text-mute">This roadmap shows the learning journey in general terms. The detailed official curriculum — the names of the 11 subjects — will be added once an official source is available.</p>
      </div>
    </div>
  );
}
