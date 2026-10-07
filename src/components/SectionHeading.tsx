import type { ReactNode } from 'react';
type P = { title: ReactNode; lead?: ReactNode; light?: boolean; as?: 'h1' | 'h2'; className?: string };
export default function SectionHeading({ title, lead, light, as: H = 'h2', className = '' }: P) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <H className={`text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-4xl ${light ? 'text-slate-900' : 'text-slate-900'}`}>{title}</H>
      {lead && <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${light ? 'text-slate-600' : 'text-slate-500'}`}>{lead}</p>}
    </div>
  );
}
