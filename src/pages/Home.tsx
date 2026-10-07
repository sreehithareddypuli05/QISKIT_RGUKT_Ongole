import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Atom, BookOpen, CalendarDays, Compass, Sparkles, Trophy } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import FallFestCarousel from '../components/FallFestCarousel';
import { SITE } from '../data/content';
import { useSeo } from '../hooks/useSeo';
import { QISKIT } from '../data/images';

const sections=[
 {to:'/qiskit-fall-fest',title:'Qiskit Fall Fest',eyebrow:'GLOBAL QUANTUM COMMUNITY',icon:Atom,text:'Understand Qiskit Fall Fest, the IBM Quantum-supported community programme and the RGUKT edition.',meta:'Festival · Qiskit · IBM Quantum'},
 {to:'/events',title:'Events',eyebrow:'LEARN + BUILD',icon:CalendarDays,text:'Explore workshops, Qiskit sessions and event photographs from the QIC community.',meta:'Workshops · talks · showcases'},
 {to:'/minor-degree',title:'Quantum Minor',eyebrow:'ACADEMICS',icon:BookOpen,text:'Follow the learning path from quantum foundations and circuits to programming and applications.',meta:'Learning pathway'},
 {to:'/amaravati-quantum-valley',title:'Amaravati Quantum Valley',eyebrow:'ECOSYSTEM',icon:Compass,text:'See how research, education, industry and quantum infrastructure connect across Andhra Pradesh.',meta:'Andhra Pradesh ecosystem'},
 {to:'/achievements',title:'Achievements',eyebrow:'STUDENT IMPACT',icon:Trophy,text:'Discover student accomplishments, projects and milestones connected to the quantum community.',meta:'Student stories'},
 {to:'/about',title:'About QIC',eyebrow:'THE CENTRE',icon:Sparkles,text:'Learn about the Quantum Innovation Centre, its people, purpose and direction.',meta:'Mission · faculty · contact'},
];

export default function Home(){const {user}=useAuth();useSeo('Home','Quantum Innovation Centre at RGUKT Ongole — quantum learning, Qiskit, events and the Amaravati Quantum Valley ecosystem.');return <PageTransition><main className="quantum-shell">
 <section className="quantum-hero relative isolate min-h-[calc(100svh-76px)] overflow-hidden">
  <video
  className="quantum-hero-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  aria-hidden="true"
>
  <source
    src="/backgrounds/home-background-HD-1080p.mp4"
    type="video/mp4"
  />
</video>
 <div className="quantum-hero-content">
   <div className="wrap relative z-10 flex min-h-[calc(100svh-76px)] items-center py-16 sm:py-20">
    <div className="max-w-2xl"><Reveal><p className="eyebrow">RGUKT ONGOLE · QUANTUM INNOVATION CENTRE</p><h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.02em] text-slate-950 sm:text-5xl lg:text-[4rem]">Quantum Innovation Centre</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{SITE.tagline} QIC brings together quantum learning, Qiskit practice, student workshops and connections to the emerging quantum ecosystem.</p><div className="mt-7 flex flex-wrap gap-3"><Link to={user?'/events':'/login'} className="btn btn-primary">Explore QIC events <ArrowRight size={16}/></Link><Link to={user?'/minor-degree':'/login'} className="btn btn-ghost">Quantum Minor</Link></div></Reveal></div>
   </div>
   <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-slate-400 sm:flex"><span className="h-px w-10 bg-slate-300"/>Scroll to explore<span className="h-px w-10 bg-slate-300"/></div>
 </div>
 </section>

 <section className="wrap py-20 sm:py-28"><Reveal><SectionHeading title="Explore QIC" lead="A quick view of the centre, its events, academic pathway, achievements and quantum ecosystem."/></Reveal>
  <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{sections.map(({to,title,eyebrow,icon:Icon,text,meta},i)=>{const locked=!user;const content=<><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e8f0f7] text-[#1e568a]"><Icon size={19}/></span>{locked?<LockKeyhole size={16} className="text-slate-300"/>:<ArrowRight size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#1e568a]"/>}</div><p className="eyebrow mt-8 text-[10px]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p><p className="mt-5 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{meta}</p>{locked&&<p className="mt-4 text-xs font-semibold text-[#1e568a]">Login to unlock this section</p>}</>;return <Reveal key={to} delay={i*.05}>{locked?<Link to="/login" className="group block h-full border-t border-slate-200 py-6 sm:border-t-0 sm:border-l sm:p-7">{content}</Link>:<Link to={to} className="group block h-full border-t border-slate-200 py-6 sm:border-t-0 sm:border-l sm:p-7">{content}</Link>}</Reveal>})}</div>
 </section>

 <section className="section-rule wrap py-20 sm:py-28"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center"><Reveal><p className="eyebrow">QISKIT · QUANTUM COMMUNITY</p><h2 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Qiskit learning at QIC</h2><p className="mt-5 max-w-lg leading-7 text-slate-600">Qiskit connects quantum concepts with practical programming. QIC uses that approach in workshops, events and student learning activities.</p><Link to={user?'/qiskit-fall-fest':'/login'} className="mt-7 inline-flex items-center gap-2 font-semibold text-[#1e568a]">Read the Fall Fest story <ArrowRight size={16}/></Link></Reveal><Reveal delay={.08}><FallFestCarousel compact/></Reveal></div></section>

 <section className="wrap py-20 sm:py-28"><div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center"><Reveal><div><p className="eyebrow">QUANTUM LEARNING</p><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">From fundamentals to working quantum circuits.</h2><p className="mt-5 max-w-xl leading-8 text-slate-600">The QIC learning environment connects the Quantum Minor, Qiskit workshops and student-led activities. The site keeps those experiences together so students can move from concepts to practice.</p><Link to={user?'/minor-degree':'/login'} className="mt-7 inline-flex items-center gap-2 font-semibold text-[#1e568a]">View the learning pathway <ArrowRight size={16}/></Link></div></Reveal><Reveal delay={.08}><div className="editorial-image"><img src="/backgrounds/quantum-chip.png" alt="Quantum processor chip on laboratory equipment" className="h-[330px] w-full object-cover sm:h-[430px]"/></div></Reveal></div></section>

 <section className="wrap pb-24 sm:pb-32"><Reveal><div className="border-y border-slate-200 bg-slate-50 p-8 sm:p-12 lg:p-14"><div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">START EXPLORING</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-5xl">Explore the QIC programme</h2><p className="mt-4 max-w-2xl text-slate-600">Browse events, explore the academic pathway, see student achievements or understand the wider Amaravati Quantum Valley ecosystem.</p></div><Link to={user?'/about':'/login'} className="btn btn-primary shrink-0">Meet QIC <ArrowRight size={16}/></Link></div></div></Reveal></section>
 </main></PageTransition>}
