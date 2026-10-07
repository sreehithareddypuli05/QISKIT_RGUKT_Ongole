import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Img } from '../data/images';

export default function EventPhotoCarousel({ images, label }: { images?: Img[]; label: string }) {
  const [index, setIndex] = useState(0);
  const list = images ?? [];
  useEffect(() => {
    if (list.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % list.length), 4200);
    return () => window.clearInterval(timer);
  }, [list.length]);
  if (!list.length) return <div className="event-photo-empty"><span>QIC event</span><strong>{label}</strong><small>Event photographs will appear here.</small></div>;
  const move = (d: number) => setIndex((i) => (i + d + list.length) % list.length);
  return <div className="event-carousel" aria-label={`${label} photographs`}>
    {list.map((image, i) => <img key={image.src} src={image.src} srcSet={image.srcSet} sizes="(min-width:1024px) 560px, 100vw" alt={image.alt} className={`event-carousel-image ${i === index ? 'is-active' : ''}`} />)}
    {list.length > 1 && <>
      <button type="button" className="carousel-arrow left" onClick={() => move(-1)} aria-label="Previous event photo"><ChevronLeft size={18}/></button>
      <button type="button" className="carousel-arrow right" onClick={() => move(1)} aria-label="Next event photo"><ChevronRight size={18}/></button>
      <div className="carousel-dots">{list.map((_, i) => <button key={i} type="button" aria-label={`Show photo ${i+1}`} onClick={() => setIndex(i)} className={i === index ? 'active' : ''}/>)}</div>
    </>}
  </div>;
}
