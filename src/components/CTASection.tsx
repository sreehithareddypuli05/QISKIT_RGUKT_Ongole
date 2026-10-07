import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
export default function CTASection({ title, text, to, label }: { title: string; text: string; to: string; label: string }) {
  return (
    <section className="wrap mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-14 sm:px-14 sm:py-20">
        
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-slate-600">{text}</p>
          <Link to={to} className="btn btn-primary group mt-8">{label}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
