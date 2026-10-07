import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QISKIT } from '../data/images';

export default function FallFestCarousel({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % QISKIT.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const move = (dir: number) => setIndex((i) => (i + dir + QISKIT.length) % QISKIT.length);

  return (
    <div className="relative w-full">
      <div className={`photo-frame relative overflow-hidden ${compact ? 'aspect-[16/9]' : 'aspect-[16/8.8]'}`}>
        {QISKIT.map((image, i) => (
          <img
            key={image.src}
            src={image.src}
            srcSet={image.srcSet}
            sizes="(min-width:1024px) 1100px, 100vw"
            alt={image.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${i === index ? 'scale-100 opacity-100' : 'scale-[1.025] opacity-0'}`}
          />
        ))}
        <button type="button" onClick={() => move(-1)} aria-label="Previous Qiskit event photo" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Next Qiskit event photo" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-900 shadow-md transition hover:bg-white">
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {QISKIT.map((_, i) => (
            <button type="button" key={i} onClick={() => setIndex(i)} aria-label={`Show Qiskit photo ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/55'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
