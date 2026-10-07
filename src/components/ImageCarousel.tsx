import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { Img } from '../data/images';
import ResponsiveImage from './ResponsiveImage';

export function Lightbox({ images, index, onClose, onIndex }: { images: Img[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const n = images.length;
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null; closeBtn.current?.focus(); document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', k);
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; prev?.focus(); };
  }, [go, onClose]);
  const im = images[index];
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-900/95 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button ref={closeBtn} onClick={onClose} aria-label="Close image viewer" className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-900 hover:bg-white/20"><X /></button>
      {n > 1 && <>
        <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous image" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-900 hover:bg-white/20"><ChevronLeft /></button>
        <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next image" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-900 hover:bg-white/20"><ChevronRight /></button></>}
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={im.src} alt={im.alt} className="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain" />
        <figcaption className="mt-3 text-center text-sm text-slate-600">{im.alt} ({index + 1}/{n})</figcaption>
      </figure>
    </motion.div>
  );
}

export default function ImageCarousel({ images, ratio = 'aspect-[16/10]' }: { images: Img[]; ratio?: string }) {
  const [i, setI] = useState(0); const [open, setOpen] = useState(false);
  const n = images.length; const close = useCallback(() => setOpen(false), []);
  return (
    <div>
      <div className={`group relative overflow-hidden rounded-2xl bg-navy-900/5 ${ratio}`}>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
            <button onClick={() => setOpen(true)} className="block h-full w-full cursor-zoom-in" aria-label={`Enlarge image ${i + 1} of ${n}: ${images[i].alt}`}>
              <ResponsiveImage img={images[i]} sizes="(min-width:1024px) 600px, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
            </button>
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy-900"><Expand size={16} aria-hidden="true" /></span>
        {n > 1 && <div className="absolute inset-x-0 bottom-3 flex justify-between px-3">
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous image" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy-900 hover:bg-white"><ChevronLeft size={18} /></button>
          <button onClick={() => setI((i + 1) % n)} aria-label="Next image" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy-900 hover:bg-white"><ChevronRight size={18} /></button>
        </div>}
      </div>
      {n > 1 && <div className="mt-3 flex gap-2" role="group" aria-label="Choose image">
        {images.map((im, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} aria-current={k === i} className={`h-14 w-20 overflow-hidden rounded-lg ring-2 transition ${k === i ? 'ring-navy-q' : 'opacity-60 ring-transparent hover:opacity-100'}`}>
            <img src={im.srcSet.split(' ')[0]} alt="" className="h-full w-full object-cover" loading="lazy" /></button>))}
      </div>}
      <AnimatePresence>{open && <Lightbox images={images} index={i} onIndex={setI} onClose={close} />}</AnimatePresence>
    </div>
  );
}
