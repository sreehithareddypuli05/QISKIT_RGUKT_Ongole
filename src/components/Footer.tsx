import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import { FACULTY, SITE, LINKS } from '../data/content';
import ExternalLink from './ExternalLink';
import { useAuth } from '../hooks/useAuth';

const QUICK = [['Home', '/'], ['Qiskit Fall Fest', '/qiskit-fall-fest'], ['Events', '/events'], ['Minor Degree', '/minor-degree'], ['AQV', '/amaravati-quantum-valley'], ['Achievements', '/achievements'], ['About', '/about']];
export default function Footer() {
  const {user}=useAuth();
  const visibleQuick = user ? QUICK : QUICK.filter(([,to])=>to==='/');
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(139,124,255,.12),transparent_28%)]" />
      <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.35fr_.8fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm leading-7 text-slate-500">{SITE.tagline}</p>
          <p className="mt-6 text-sm text-slate-400">Quantum Innovation Centre<br/>RGUKT Ongole</p>
          <ExternalLink href={LINKS.rgukt} className="mt-4 inline-flex items-center gap-1 text-sm text-[#1e568a]">RGUKT website <ArrowUpRight size={14}/></ExternalLink>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-semibold">Explore</h2>
          <ul className="mt-5 space-y-3">{visibleQuick.map(([l,t]) => <li key={t}><Link to={t} className="text-sm text-slate-500 transition hover:text-[#1e568a]">{l}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="font-display text-sm font-semibold">Faculty coordinators</h2>
          <ul className="mt-5 space-y-4">{FACULTY.map((f) => <li key={f.email}><a href={`mailto:${f.email}`} className="flex gap-2 text-slate-500 hover:text-[#1e568a]"><Mail size={15} className="mt-1 shrink-0"/><span><span className="block text-sm text-slate-900/75">{f.name}</span><span className="break-all text-xs">{f.email}</span></span></a></li>)}</ul>
        </div>
      </div>
      <div className="relative border-t border-slate-200 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} Quantum Innovation Centre, RGUKT Ongole.</div>
    </footer>
  );
}
