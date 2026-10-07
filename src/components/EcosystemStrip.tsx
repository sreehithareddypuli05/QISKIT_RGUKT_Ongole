import { motion } from 'framer-motion';
const STEPS = ['Education', 'Workshops', 'Qiskit', 'Research', 'Innovation', 'AQV'];
export default function EcosystemStrip() {
  return (
    <section aria-label="The QIC quantum ecosystem" className="border-y border-slate-200 bg-white">
      <div className="wrap py-8">
        <ol className="flex flex-col items-stretch gap-0 md:flex-row md:items-center">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center md:flex-row">
              <motion.span initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-full border border-navy-900/15 bg-paper px-5 py-2.5 font-display text-sm font-medium text-slate-900 transition-colors hover:border-violet-q hover:text-navy-q">{s}</motion.span>
              {i < STEPS.length - 1 && (
                <svg aria-hidden="true" className="h-8 w-3 md:h-3 md:min-w-8 md:flex-1 md:w-auto" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <line x1="0" y1="5" x2="100" y2="5" stroke="#7C5CFF" strokeWidth="2" className="flow-dash hidden md:block" vectorEffect="non-scaling-stroke" />
                  <line x1="50" y1="0" x2="50" y2="10" stroke="#7C5CFF" strokeWidth="2" className="md:hidden" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
