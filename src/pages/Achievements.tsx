import {useEffect,useState} from 'react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import ExternalLink from '../components/ExternalLink';
import AchievementCard from '../components/AchievementCard';
import { ACH1, ACH2 } from '../data/images';
import { LINKS } from '../data/content';
import {useSeo} from '../hooks/useSeo';

const API_BASE=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');

type ApiAchievement={id:number;title:string;description:string;date?:string;link?:string;image?:string};

const FALLBACK=[
 {img:ACH1,kicker:'GLOBAL QUANTUM ACHIEVEMENT',title:'Girl in Quantum Computing — Q-VOLUTION Hackathon',text:'Dear Students, Proud Moment for RGUKT Ongole – Shining on the Global Quantum Stage!. We are delighted to share that Chandala Keerthana (O220762, E2, ECE), RGUKT Ongole, has won the “Girl in Quantum Computing” International Competition and will be representing our campus at the Q-VOLUTION Hackathon Grand Finale & Awards Ceremony on the International Quantum Computing Stage. We warmly invite you to join the Live Streaming today at 8:30 PM and witness this proud moment for our institution. Let us come together to celebrate this remarkable achievement and support our student representing RGUKT Ongole on the global stage.',links:<><ExternalLink href={LINKS.liveStream}>Watch the live stream →</ExternalLink></>},
 {img:ACH2,kicker:'STUDENT ACHIEVEMENT · ECE',title:'RGUKT Ongole student achievement',text:'A proud student achievement from the Department of ECE, RGUKT Ongole, featuring Shaik Irfan and Keerthana Ch. Explore the original department announcement and the project created by the students.',links:<><ExternalLink href={LINKS.linkedinPost}>View the LinkedIn announcement →</ExternalLink><ExternalLink href={LINKS.funquan}>View the project →</ExternalLink></>},
];

export default function Achievements(){
 useSeo('Achievements','Student accomplishments, quantum competitions and community milestones from QIC.');
 const [items,setItems]=useState<ApiAchievement[]>([]); const [loaded,setLoaded]=useState(false);
 useEffect(()=>{fetch(API_BASE+'/api/achievements').then(r=>r.ok?r.json():Promise.reject()).then(data=>setItems(Array.isArray(data)?data:[])).catch(()=>setItems([])).finally(()=>setLoaded(true))},[]);
 const useApi=loaded&&items.length>1;
 return <PageTransition><main className="quantum-shell min-h-screen pb-24"><section className="wrap py-16 sm:py-24"><SectionHeading as="h1" title="Achievements" lead="Student accomplishments, quantum competitions and community highlights from QIC."/>
   <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
    {useApi ? items.map((x,i)=>{ const local=i===0?ACH1:ACH2; return <article key={x.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-5 ${i%2===1?'lg:order-2':''}`}><div className="overflow-hidden rounded-2xl bg-white p-2 border border-slate-200 shadow-[0_18px_45px_-32px_rgba(15,23,42,.5)]"><img src={local.src} srcSet={local.srcSet} sizes="(min-width:1024px) 40vw, 100vw" alt={local.alt} className="h-auto w-full rounded-xl object-contain" /></div></div>
      <div className={`lg:col-span-7 ${i%2===1?'lg:order-1':''}`}><p className="eyebrow">{x.date||'ACHIEVEMENT'}</p><h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{x.title}</h2><p className="mt-5 text-lg leading-relaxed text-mute">{x.description}</p><div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-semibold text-navy-q">{x.link&&<ExternalLink href={x.link}>View official source →</ExternalLink>}{i===0&&<ExternalLink href={LINKS.liveStream}>Live stream →</ExternalLink>}{i===1&&<ExternalLink href={LINKS.funquan}>View the project →</ExternalLink>}</div></div>
    </article> }) : FALLBACK.map((x,i)=><AchievementCard key={i} img={x.img} kicker={x.kicker} title={x.title} links={x.links} flip={i%2===1}>{x.text}</AchievementCard>)}
   </div>
 </section></main></PageTransition>
}
