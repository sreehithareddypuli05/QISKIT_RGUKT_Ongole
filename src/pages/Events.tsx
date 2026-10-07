import { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';
import SectionHeading from '../components/SectionHeading';
import { EVENTS, LINKS } from '../data/content';
import { QFF, QML, QISKIT } from '../data/images';
import { useSeo } from '../hooks/useSeo';
import ExternalLink from '../components/ExternalLink';
import EventPhotoCarousel from '../components/EventPhotoCarousel';

const API_BASE=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');

type ApiEvent={id:number;title:string;description:string;date?:string;link?:string;location?:string;published?:number};

const galleryFor=(id?:string)=>id==='qml'?QML:id==='basics'?QISKIT:QFF;

export default function Events(){
  useSeo('Events','Quantum workshops, Qiskit sessions and community activities at QIC.');
  const [events,setEvents]=useState<ApiEvent[]>([]);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    fetch(API_BASE+'/api/events')
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>setEvents(Array.isArray(data)?data:[]))
      .catch(()=>setEvents([]))
      .finally(()=>setLoaded(true));
  },[]);

  const fallback=EVENTS.map(e=>({id:e.id,title:e.title,description:e.summary,date:e.date,link:e.link,location:e.hostedBy||'QIC EVENT'}));
  const visible=loaded && events.length ? events : fallback;

  return <PageTransition><main className="quantum-shell min-h-screen pb-24">
    <header className="events-header"><div className="wrap py-16 sm:py-20"><p className="eyebrow">QUANTUM INNOVATION CENTRE · RGUKT ONGole</p><SectionHeading as="h1" className="mt-3" title="Events" lead="Workshops, Qiskit sessions and quantum community activities at QIC."/></div></header>
    <section className="wrap py-14 sm:py-20">
      <div className="space-y-12">
        {visible.map((e,i)=>{
          const source=EVENTS.find(x=>x.id===e.id) || EVENTS.find(x=>x.title===e.title);
          return <article key={e.id ?? i} className="event-story">
            <EventPhotoCarousel images={source?.images || galleryFor(source?.id)} label={e.title} />
            <div className="event-story-copy">
              <p className="eyebrow">{e.date||'EVENT'}</p>
              <h2>{e.title}</h2>
              {source?.speaker && <p className="mt-2 font-semibold text-navy-q">By {source.speaker}</p>}
              {source?.hostedBy && <p className="mt-2 text-sm text-slate-500">Hosted by {source.hostedBy}{source.coHostedBy?.length ? <> · Co-hosted by {source.coHostedBy.join(' and ')}</> : null}</p>}
              <p className="event-summary">{e.description}</p>
              {source?.detail && <p className="mt-4 text-sm leading-6 text-slate-500">{source.detail}</p>}
              {e.link&&<ExternalLink href={e.link}>Official event / registration link →</ExternalLink>}
            </div>
          </article>
        })}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><p className="text-sm text-slate-600">For the latest RGUKT Nuzvid announcements, dates and official event notices, use the <ExternalLink href={LINKS.qff}>official RGUKT Nuzvid website</ExternalLink>.</p></div>
      </div>
    </section>
  </main></PageTransition>
}
