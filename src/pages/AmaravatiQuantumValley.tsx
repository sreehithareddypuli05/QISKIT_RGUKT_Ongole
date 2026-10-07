import PageTransition from '../components/PageTransition';
import type { CSSProperties } from 'react';
import SectionHeading from '../components/SectionHeading';
import AQVEcosystem from '../components/AQVEcosystem';
import ResponsiveImage from '../components/ResponsiveImage';
import ImageCarousel from '../components/ImageCarousel';
import ExternalLink from '../components/ExternalLink';
import Reveal from '../components/Reveal';
import { AQV } from '../data/images';
import { AQV_THEMES, AQV_PARTNERS, AQV_FUTURE, AQV_SOURCES, LINKS } from '../data/content';
import { useSeo } from '../hooks/useSeo';
export default function AmaravatiQuantumValley() {
  useSeo('Amaravati Quantum Valley Initiative', 'Amaravati Quantum Valley Initiative — vision, mission, partners, reference facilities at SRM University-AP and Medha Towers, and education.');
  return (
    <PageTransition>
      <header className="photo-hero" style={{'--hero-image': "url('/backgrounds/quantum-reference-facility.png')"} as CSSProperties}>
        <div className="wrap relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h1 className="font-display text-4xl font-semibold uppercase leading-tight sm:text-5xl lg:text-6xl">Amaravati<br />Quantum<br />Valley</h1>
            <p className="mt-3 font-display text-xl text-navy-q">Initiative</p>
            <p className="mt-6 max-w-lg text-lg text-slate-600">An Andhra Pradesh initiative to build a full quantum and deep-tech ecosystem in Amaravati.</p>
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/20"><div className="aspect-[16/10]"><ResponsiveImage img={AQV[1]} eager sizes="(min-width:1024px) 600px, 100vw" /></div></div>
        </div>
      </header>

      <section className="wrap mt-24 grid gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-semibold sm:text-4xl">Vision</h2>
          <p className="mt-5 text-lg leading-relaxed text-mute">To establish Amaravati as a globally competitive quantum and deep-tech innovation hub, described in public reporting as India’s first integrated quantum hub, bringing hardware, research, industry and education together in one place.</p>
        </Reveal>
        <Reveal delay={.1}>
          <h2 className="text-3xl font-semibold sm:text-4xl">Mission</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {AQV_THEMES.map((t) => <li key={t} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-display font-medium">{t}</li>)}
          </ul>
        </Reveal>
      </section>

      <section className="wrap mt-24">
        <Reveal><SectionHeading title="One valley, many partners" lead="AQV connects government, academia, industry, startups, research, talent development and quantum infrastructure. Explore each node." /></Reveal>
        <div className="mt-12"><AQVEcosystem /></div>
      </section>

      <section className="wrap mt-24" aria-labelledby="qrf">
        <h2 id="qrf" className="text-3xl font-semibold sm:text-4xl">Quantum computers at SRM and Medha Towers</h2>
        <p className="mt-4 max-w-3xl text-lg text-mute">On World Quantum Day, 14 April 2026, two Amaravati Quantum Reference Facilities were unveiled. They let hardware be tested and certified, making Andhra Pradesh the first state in India with a dedicated quantum test reference facility, according to press reports.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="research-rule py-7"><p className="font-display text-sm text-navy-q">Amaravati 1S</p><h3 className="mt-1 text-2xl font-semibold">SRM University-AP</h3>
              <p className="mt-3 text-mute">An open-access facility meant to support research, students, startups and companies working on quantum technologies.</p>
              <p className="mt-3 text-sm"><ExternalLink href={LINKS.srmQrc} className="font-semibold text-navy-q">SRM Quantum Reference Centre</ExternalLink></p></div>
            <div className="research-rule py-7"><p className="font-display text-sm text-navy-q">Amaravati 1Q</p><h3 className="mt-1 text-2xl font-semibold">Medha Towers</h3>
              <p className="mt-3 text-mute">A facility aimed at industrial applications. The machine shown in the supplied photograph carries Qbit Force branding.</p></div>
          </div>
          <figure><div className="aspect-[4/3] overflow-hidden rounded-2xl"><ResponsiveImage img={AQV[2]} sizes="(min-width:1024px) 520px, 100vw" /></div><figcaption className="mt-3 text-sm text-mute">Visit to quantum hardware at a reference facility.</figcaption></figure>
        </div>
      </section>

      <section className="wrap mt-24 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Partners</h2>
          <ul className="mt-8 divide-y divide-line border-y border-slate-200">
            {AQV_PARTNERS.map((p) => <li key={p.name} className="py-5"><p className="font-display font-semibold">{p.name}</p><p className="mt-1 text-sm text-mute">{p.role}</p></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Future plans</h2>
          <p className="mt-3 text-sm text-mute">Announced goals reported in the press, not completed achievements.</p>
          <ol className="mt-6 space-y-5 border-l-2 border-violet-q/30 pl-6">
            {AQV_FUTURE.map((f) => <li key={f.t} className="relative"><span aria-hidden="true" className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-violet-q" /><p className="font-display font-semibold">{f.t}</p><p className="mt-1 text-mute">{f.d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="wrap mt-24">
        <h2 className="text-3xl font-semibold sm:text-4xl">Education</h2>
        <div className="mt-8 grid gap-0 border-y border-slate-200 md:grid-cols-3">
          {[['Talent pipeline', 'AQV pairs infrastructure with large-scale skilling; the Wiser Quantum Talent Hub is reported to target 35 lakh students by 2035.'],
            ['Open access for learners', 'The 1S facility at SRM University-AP is open to students and researchers for experimentation.'],
            ['RGUKT Ongole students', 'Two QIC students were named among the Top 10 in Andhra Pradesh in the WISER Global Quantum + AI Summer Program 2026.']].map(([t, d]) => (
            <div key={t} className="research-rule py-7"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-3 text-mute">{d}</p></div>))}
        </div>
      </section>

      <section className="wrap mt-24"><Reveal><div className="grid gap-12 lg:grid-cols-2"><div><p className="eyebrow">VISION</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Make Andhra Pradesh a serious quantum innovation destination.</h2><p className="mt-5 leading-8 text-mute">AQV is being built around a connected ecosystem rather than a single laboratory: quantum hardware, reference facilities, research, education, startups and industry collaboration are intended to reinforce one another.</p></div><div><p className="eyebrow">MISSION</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Move from infrastructure to usable quantum capability.</h2><p className="mt-5 leading-8 text-mute">Public announcements emphasise talent development, access to quantum systems, hardware validation, industry use cases and partnerships between government, academia and technology companies.</p></div></div></Reveal></section>

      <section className="wrap mt-24"><Reveal><p className="eyebrow">EDUCATION + ECOSYSTEM</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Learning is part of the infrastructure.</h2><div className="mt-8 research-list"><div className="grid gap-4 py-5 md:grid-cols-[220px_1fr]"><strong>SRM University-AP</strong><p className="text-mute">Its Quantum Reference Facility is designed as a shared platform for startups, researchers and industry to test, benchmark and validate quantum components and systems.</p></div><div className="grid gap-4 py-5 md:grid-cols-[220px_1fr]"><strong>Medha Towers</strong><p className="text-mute">The Amaravati 1Q reference facility forms the second part of the two-site AQV reference infrastructure and supports access to quantum hardware.</p></div><div className="grid gap-4 py-5 md:grid-cols-[220px_1fr]"><strong>Qbit Force</strong><p className="text-mute">Qbit Force is associated with the hardware delivered at Medha Towers and has described the facility as an open-access quantum hardware environment.</p></div><div className="grid gap-4 py-5 md:grid-cols-[220px_1fr]"><strong>Talent + events</strong><p className="text-mute">The ecosystem includes quantum workshops, student visits, algorithm programmes and talent initiatives intended to turn access to infrastructure into practical skills.</p></div></div></Reveal></section>

      <section className="wrap mt-24">
        <h2 className="text-3xl font-semibold sm:text-4xl">Gallery</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ImageCarousel images={AQV} ratio="aspect-[4/3]" />
          <p className="self-center text-lg text-mute">Three AQV visuals: the Telugu announcement poster for the reference facilities, a rendering of the Valley’s towers, and a visit to quantum hardware at a reference facility.</p>
        </div>
      </section>

      <section className="wrap mt-24" aria-labelledby="src">
        <h2 id="src" className="text-2xl font-semibold">Sources</h2>
        <p className="mt-2 text-sm text-mute">Facts on this page come from public news reporting, which differs in places (for example, qubit counts and vendor names). Please check official announcements for the latest.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{AQV_SOURCES.map((s) => <li key={s.href}><ExternalLink href={s.href} className="text-navy-q">{s.label}</ExternalLink></li>)}</ul>
      </section>
    </PageTransition>
  );
}
