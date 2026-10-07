import type { ReactNode } from 'react';
import type { Img } from '../data/images';
import ResponsiveImage from './ResponsiveImage';
type P = { img: Img; kicker: string; title: string; children: ReactNode; links: ReactNode; flip?: boolean };
export default function AchievementCard({ img, kicker, title, children, links, flip }: P) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
        <div className="overflow-hidden rounded-2xl bg-white p-2 border border-slate-200 shadow-[0_18px_45px_-32px_rgba(15,23,42,.5)]"><div className="overflow-hidden rounded-xl"><ResponsiveImage img={img} sizes="(min-width:1024px) 40vw, 100vw" fit="contain" className="!h-auto" /></div></div>
      </div>
      <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
        <p className="font-display text-sm font-medium text-navy-q">{kicker}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-mute">{children}</div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-semibold text-navy-q">{links}</div>
      </div>
    </article>
  );
}
