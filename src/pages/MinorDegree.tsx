import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import QuantumRoadmap from '../components/QuantumRoadmap';
import Reveal from '../components/Reveal';
import CTASection from '../components/CTASection';
import { STATS } from '../data/content';
import { useSeo } from '../hooks/useSeo';

const subjects = [
  ['01','Quantum Foundations','States, qubits, superposition and measurement.'],
  ['02','Quantum Mathematics','Vectors, matrices, probability and complex amplitudes.'],
  ['03','Quantum Mechanics for Computing','The physical ideas behind quantum information.'],
  ['04','Quantum Computing','Qubits, circuits and the quantum computing model.'],
  ['05','Quantum Gates & Circuits','Single- and multi-qubit operations and circuit design.'],
  ['06','Quantum Algorithms','Core algorithms and the ideas behind quantum advantage.'],
  ['07','Quantum Programming','Turning quantum concepts into executable programs.'],
  ['08','Qiskit','Hands-on programming with IBM’s open-source quantum software.'],
  ['09','Quantum Machine Learning','Quantum approaches to learning and optimisation.'],
  ['10','Quantum Applications','Security, optimisation, simulation and other emerging applications.'],
  ['11','Project / Applied Quantum Learning','Connecting coursework with workshops, projects and research exposure.'],
];

const modules = [
  ['Quantum foundations', 'States, qubits, superposition, measurement and the ideas that distinguish quantum systems.'],
  ['Quantum mathematics', 'The mathematical language used to describe states, operators, probabilities and quantum evolution.'],
  ['Quantum gates & circuits', 'How gates transform qubits and how circuits turn quantum ideas into computation.'],
  ['Quantum algorithms', 'An introduction to the algorithmic thinking behind quantum speedups and applications.'],
  ['Qiskit programming', 'Hands-on quantum programming using IBM’s open-source Qiskit software stack.'],
  ['Applied learning', 'Workshops, projects and emerging applications such as quantum machine learning.'],
];

export default function MinorDegree() {
  useSeo('Quantum Minor Degree', 'The Quantum Technologies Minor Degree at RGUKT Ongole.');
  return <PageTransition><main className="quantum-shell min-h-screen pb-24">
    <header className="minor-header"><div className="wrap py-16 sm:py-20"><Reveal><p className="eyebrow">ACADEMIC PROGRAMME · RGUKT ONGOLE</p><SectionHeading as="h1" title="Quantum Technologies Minor Degree" lead="A structured pathway that takes students from quantum foundations to computing, programming and applied quantum learning."/></Reveal></div></header>
    <section className="wrap py-12 sm:py-16"><div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><Reveal><div><p className="eyebrow">THE PROGRAMME</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">11 subjects. 150+ students. One quantum learning pathway.</h2><p className="mt-5 max-w-2xl leading-8 text-slate-600">The Quantum Technologies Minor Degree gives students a structured introduction to quantum science, quantum computing and practical tools such as Qiskit. More than 150 students are enrolled under the minor, making it a significant part of the RGUKT quantum learning ecosystem.</p></div></Reveal><Reveal delay={.08}><div className="editorial-image"><img src="/backgrounds/quantum-chip.png" alt="Quantum processor chip" className="h-[280px] w-full object-cover sm:h-[340px]"/></div></Reveal></div><div className="minor-stats mt-12">{STATS.slice(0,2).map((s,i)=><Reveal key={s.label} delay={i*.06}><div className="minor-stat"><strong>{s.value}{s.suffix}</strong><span>{s.label}</span></div></Reveal>)}</div></section>
    <section className="wrap section-rule py-14 sm:py-20"><div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]"><Reveal><p className="eyebrow">11-SUBJECT STRUCTURE</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">A broad foundation in quantum technologies.</h2><p className="mt-5 leading-7 text-slate-600">The page uses subject areas rather than inventing an official semester-wise course-title list. Together they show the progression from quantum basics to Qiskit and applied work.</p></Reveal><div className="research-list">{subjects.map(([n,title,text],i)=><Reveal key={title} delay={i*.025}><article className="grid grid-cols-[42px_1fr] gap-4"><span className="font-display text-sm font-semibold text-navy-q">{n}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></article></Reveal>)}</div></div></section>
    <section className="wrap py-14 sm:py-20"><Reveal><SectionHeading title="The learning journey" lead="A responsive step-by-step view of how the minor develops quantum understanding."/></Reveal><div className="mt-10"><QuantumRoadmap/></div></section>
    <section className="wrap section-rule py-14 sm:py-20"><Reveal><div className="minor-practice"><div><p className="eyebrow">PRACTICAL LEARNING</p><h2>Qiskit turns theory into something students can run.</h2></div><p>QIC’s workshops complement the academic pathway with hands-on exposure to Qiskit, quantum gates and quantum machine learning. The Events page records the three highlighted programmes conducted in 2026.</p></div></Reveal></section>
    <CTASection title="See the learning in action" text="Explore the QIC workshops and quantum learning experiences." to="/events" label="View the three events" />
  </main></PageTransition>;
}
