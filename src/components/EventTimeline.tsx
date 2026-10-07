import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import EventCard from './EventCard';
import { EVENTS } from '../data/content';
export default function EventTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const h = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  return (
    <div ref={ref} className="relative pl-8 sm:pl-14">
      <div className="absolute bottom-0 left-2 top-0 w-px bg-line sm:left-5" aria-hidden="true">
        <motion.div style={{ scaleY: h, transformOrigin: 'top' }} className="h-full w-full bg-gradient-to-b from-violet-q to-violet-q" />
      </div>
      <ol className="space-y-16">
        {EVENTS.map((e) => (
          <motion.li key={e.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .6 }} className="relative">
            <span aria-hidden="true" className="absolute -left-[30px] top-8 h-4 w-4 rounded-full border-4 border-paper bg-violet-q ring-2 ring-navy-q sm:-left-[46px]" />
            <p className="mb-4 font-display text-xl font-semibold text-navy-q">{e.start}</p>
            <EventCard e={e} />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
