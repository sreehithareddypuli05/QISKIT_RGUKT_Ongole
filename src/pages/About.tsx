import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import FacultyCard from '../components/FacultyCard';
import Reveal from '../components/Reveal';
import ExternalLink from '../components/ExternalLink';
import { FACULTY, LINKS } from '../data/content';
import { useSeo } from '../hooks/useSeo';

export default function About() {
  useSeo('About QIC', 'About the Quantum Innovation Centre website at RGUKT Ongole and its faculty coordinators.');
  return <PageTransition>
    <main className="quantum-shell min-h-screen pb-24">
      <header className="about-header"><div className="wrap py-16 sm:py-20"><Reveal><p className="eyebrow">THE WEBSITE · THE CENTRE</p><SectionHeading as="h1" title="About QIC" lead="This website presents the Quantum Innovation Centre at RGUKT Ongole — its learning programmes, events, student achievements and connection to the wider quantum ecosystem."/></Reveal></div></header>
      <section className="wrap py-14 sm:py-20">
        <Reveal><div className="about-intro"><div><p className="eyebrow">ABOUT THIS WEBSITE</p><h2>A clear digital home for quantum learning at RGUKT Ongole.</h2></div><div className="prose-quantum"><p>This QIC website brings the centre’s academic and community activities into one place. Visitors can explore the Quantum Technologies Minor Degree, Qiskit learning events, Qiskit Fall Fest, achievements and the Amaravati Quantum Valley Initiative.</p><p>The aim is simple: make the work happening around quantum education at RGUKT Ongole easy for students, faculty, collaborators and visitors to understand.</p></div></div></Reveal>
      </section>
      <section className="wrap section-rule pt-14 sm:pt-20" aria-labelledby="team">
        <Reveal><p className="eyebrow">QIC PEOPLE</p><h2 id="team" className="mt-2 text-3xl font-semibold sm:text-4xl">Faculty and programme coordination</h2><p className="mt-4 max-w-3xl text-slate-500">The current QIC team information below is aligned with RGUKT Ongole’s public coordinator information and recent Quantum Technologies programme references.</p></Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">{FACULTY.map((f, i) => <Reveal key={f.email} delay={i * .08}><FacultyCard {...f}/></Reveal>)}</div>
      </section>
      <section className="wrap mt-16 sm:mt-24 grid gap-8 lg:grid-cols-2">
        <Reveal><div className="about-note"><p className="eyebrow">OUR PURPOSE</p><h2>Learn. Experiment. Connect.</h2><p>QIC creates a space where quantum concepts can move from classroom foundations to Qiskit practice, workshops, projects and wider ecosystem opportunities.</p></div></Reveal>
        <Reveal delay={.08}><div className="about-note"><p className="eyebrow">UNIVERSITY</p><h2>RGUKT Ongole</h2><p>QIC is part of the learning and innovation environment at Rajiv Gandhi University of Knowledge Technologies, Ongole.</p><ExternalLink href={LINKS.rgukt} className="text-link">Visit RGUKT Ongole →</ExternalLink></div></Reveal>
      </section>
    </main>
  </PageTransition>;
}
