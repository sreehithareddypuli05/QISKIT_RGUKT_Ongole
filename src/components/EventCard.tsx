import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronDown, Mic2 } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import ExternalLink from './ExternalLink';
import type { QicEvent } from '../data/content';

export default function EventCard({ e }: { e: QicEvent }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-quantum  sm:p-8 lg:grid-cols-2">
      {e.images ? <ImageCarousel images={e.images} /> : (
        <div className="relative flex min-h-[16rem] flex-col justify-end overflow-hidden border border-slate-200 bg-[#f4f1eb] p-7 text-slate-900">
          
          <dl className="relative space-y-4">
            {e.hostedBy && <div><dt className="text-sm text-slate-500">Hosted by</dt><dd className="font-display text-xl font-semibold">{e.hostedBy}</dd></div>}
            {e.coHostedBy && <div><dt className="text-sm text-slate-500">Co-hosted by</dt><dd className="font-display text-xl font-semibold">{e.coHostedBy.join(' and ')}</dd></div>}
          </dl>
        </div>
      )}
      <div className="flex flex-col">
        <p className="flex items-center gap-2 text-sm font-medium text-navy-q"><CalendarDays size={16}/>{e.date}</p>
        <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{e.title}</h3>
        {e.speaker && <p className="mt-2 flex items-center gap-2 text-slate-500"><Mic2 size={16}/>Speaker: <span className="font-medium text-slate-900/75">{e.speaker}</span></p>}
        <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">{e.summary}</p>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="mt-6 inline-flex w-fit items-center gap-2 font-semibold text-slate-900 hover:text-navy-q">
          {open ? 'Hide details' : 'Show details'}<ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`}/>
        </button>
        <AnimatePresence initial={false}>
          {open && <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
            <p className="mt-4 leading-7 text-slate-500">{e.detail}</p>
            <p className="mt-4 text-sm font-semibold">Topics</p>
            <ul className="mt-2 flex flex-wrap gap-2">{e.topics.map((t) => <li key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">{t}</li>)}</ul>
            {e.link && <p className="mt-4 font-semibold text-navy-q"><ExternalLink href={e.link}>Official website</ExternalLink></p>}
          </motion.div>}
        </AnimatePresence>
      </div>
    </article>
  );
}
