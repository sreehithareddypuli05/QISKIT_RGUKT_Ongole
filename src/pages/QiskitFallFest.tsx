import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowRight, CalendarDays, Code2, Globe2, Handshake, Lightbulb, MapPin, Users } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FallFestCarousel from '../components/FallFestCarousel';
import ExternalLink from '../components/ExternalLink';
import Reveal from '../components/Reveal';
import { LINKS } from '../data/content';
import { useSeo } from '../hooks/useSeo';

const tracks = [
  ['Quantique Hackathon', 'A challenge-oriented track for building and presenting quantum computing ideas.', Code2],
  ['QuantumXpo', 'A project expo where teams demonstrate quantum and quantum-adjacent projects.', Lightbulb],
  ['Quantum Startup Summit', 'A bridge between quantum technology, entrepreneurship and the emerging ecosystem.', Handshake],
  ['Hands-on Qiskit', 'Interactive circuit building and execution that makes quantum programming tangible.', Code2],
];

const schedule = [
  ['05 Oct', 'Opening + keynotes', 'Inauguration, Qiskit demonstration, expert sessions and community programming.'],
  ['06 Oct', 'Technical learning', 'Sessions that deepen understanding of quantum computing, algorithms and applications.'],
  ['07 Oct', 'Build + explore', 'Project-focused activities, demonstrations and collaborative learning.'],
  ['08 Oct', 'Community + innovation', 'Industry, startup and student-facing quantum activities.'],
  ['09 Oct', 'Showcase + close', 'Final activities and the wider community experience.'],
];

export default function QiskitFallFest() {
  useSeo('Qiskit Fall Fest', 'PLUS Qiskit Fall Fest 2026 at RGUKT Nuzvid, co-hosted by RGUKT Ongole and RGUKT R.K. Valley.');
  return (
    <PageTransition>
      <main className="quantum-shell min-h-screen pb-24">
        <header className="photo-hero" style={{'--hero-image': "url('/backgrounds/quantum-ai-lab.png')"} as CSSProperties}>
          <div className="wrap relative py-16 sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="eyebrow">IBM QUANTUM · RGUKT · 2026</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.025em] sm:text-5xl"><span className="text-[#1e568a]">PLUS Qiskit</span><br/>Fall Fest.</h1>
              <p className="mt-7 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">A five-day quantum computing festival bringing students, developers, researchers and the wider community together at RGUKT Nuzvid, with RGUKT Ongole and RGUKT R.K. Valley as co-hosts.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ExternalLink href={LINKS.qff} className="btn btn-primary">Official RGUKT Fall Fest site <ArrowRight size={16}/></ExternalLink>
                <Link to="/events" className="btn btn-ghost">See all events</Link>
              </div>
            </div>
          </div>
        </header>

        <section className="wrap py-16 sm:py-24">
          <Reveal><div className="grid gap-5 lg:grid-cols-[1fr_.75fr] lg:items-center">
            <div><p className="eyebrow">WHY THIS FEST MATTERS</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">A decade of quantum on the cloud, brought into the student community.</h2><p className="mt-5 max-w-2xl leading-7 text-slate-600">IBM Quantum’s 2026 Fall Fest programme celebrates ten years since IBM introduced the world’s first open-access quantum computer. The programme uses that milestone to connect the history of quantum computing with experiments, learning and community-led events.</p></div>
            <div className="research-rule py-7 sm:py-8"><p className="eyebrow">2026 GLOBAL FORMAT</p><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600"><li><strong className="text-slate-900">October–November:</strong> Fall Fest events run globally.</li><li><strong className="text-slate-900">Student-led:</strong> University students and volunteer hosts shape local events.</li><li><strong className="text-slate-900">Hands-on:</strong> Workshops, challenges, hackathons, talks and networking.</li></ul></div>
          </div></Reveal>
        </section>

        <section className="wrap py-16 sm:py-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [CalendarDays,'5–9 Oct','2026 festival dates'],
              [Globe2,'Global','Part of Qiskit Fall Fest'],
              [Users,'Student-led','Community-driven format'],
              [MapPin,'RGUKT Nuzvid','Andhra Pradesh'],
            ].map(([Icon,value,label]) => {
              const I = Icon as typeof CalendarDays;
              return <div key={String(value)} className="border-t border-slate-200 py-6"><I size={20} className="text-navy-q"/><p className="mt-5 text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>;
            })}
          </div>
        </section>

        <section className="wrap section-rule py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div>
              <p className="eyebrow">WHAT IS FALL FEST?</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">A global quantum community, expressed locally.</h2>
            </div>
            <div className="prose-quantum space-y-5">
              <p>IBM Quantum describes Qiskit Fall Fest as a collection of quantum computing events created and planned by university students and volunteer hosts, with support from IBM Quantum. The format is intentionally broad: workshops, hackathons, coding challenges, talks, social events and other community activities can all be part of a local fest.</p>
              <p>IBM’s 2026 host programme says Fall Fest events run globally through October and November. The goal is not just to teach quantum computing, but to give student organisers leadership experience and help grow local quantum communities.</p>
              <p>For 2025, IBM reported more than 32,000 participants across 150 Fall Fest events in 49 countries. That scale shows why the programme is valuable as a bridge between classroom learning and the international Qiskit ecosystem.</p>
            </div>
          </div>
        </section>

        <section className="wrap py-16 sm:py-24">
          <p className="eyebrow">RGUKT EDITION</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">What happens at the fest?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {tracks.map(([title,text,Icon]) => {
              const I = Icon as typeof Code2;
              return <div key={String(title)} className="border-t border-slate-200 py-7 transition-transform duration-500 hover:translate-y-[-3px]"><I size={21} className="text-navy-q"/><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-500">{text}</p></div>;
            })}
          </div>
        </section>

        <section className="wrap section-rule py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow">FIVE-DAY ARC</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">From curiosity to creation.</h2><p className="mt-5 leading-7 text-slate-500">The official RGUKT site publishes the detailed session schedule; this overview keeps the page readable while pointing visitors to the live source.</p></div>
            <ol className="space-y-3">
              {schedule.map(([day,title,text],i) => <Reveal key={day} delay={i*.04}><li className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[90px_1fr]"><span className="font-display text-sm font-semibold text-navy-q">{day}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></li></Reveal>)}
            </ol>
          </div>
        </section>

        <section className="wrap py-16 sm:py-24">
          <p className="eyebrow">REAL EVENT MOMENTS</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">The community behind the circuits.</h2>
          <p className="mt-4 max-w-2xl text-slate-500">A rotating selection of the Qiskit event photographs already included in the QIC project.</p>
          <div className="mt-10"><FallFestCarousel /></div>
        </section>

        <section className="wrap mt-4">
          <div className="research-rule py-7 sm:py-10 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="eyebrow">KEEP EXPLORING</p><h2 className="mt-3 text-3xl font-semibold">See how QIC connects Fall Fest to everyday learning.</h2><p className="mt-3 max-w-2xl text-slate-500">Explore the workshops, Quantum Minor, achievements and Amaravati Quantum Valley ecosystem.</p></div>
              <Link to="/events" className="btn btn-primary">Explore QIC events <ArrowRight size={16}/></Link>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
