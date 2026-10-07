import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, LogOut, Mail, Pencil, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

const API_BASE=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
const card='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,.28)]';

export default function Dashboard(){
  const {user,logout}=useAuth(); const nav=useNavigate();
  const [profile,setProfile]=useState<any>(null); const [events,setEvents]=useState<any[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ if(!user){nav('/login',{replace:true});return;} Promise.all([authService.profile(),fetch(API_BASE+'/api/events').then(r=>r.json())]).then(([p,e])=>{setProfile(p);setEvents(Array.isArray(e)?e:[])}).finally(()=>setLoading(false)); },[user]);
  const doLogout=async()=>{await logout();nav('/',{replace:true});};
  if(!user) return null;
  return <PageTransition><section className="wrap py-10 sm:py-14">
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#f3f7fb] p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:justify-between">
      <div><p className="eyebrow">PERSONAL DASHBOARD</p><h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Welcome, {user.name?.split(' ')[0] || 'Member'}</h1><p className="mt-3 max-w-2xl text-slate-500">Your QIC account, academic profile and participation details are securely stored in the portal database.</p></div>
      <div className="flex flex-wrap gap-2"><button onClick={()=>nav('/login')} className="btn btn-ghost"><Pencil size={16}/>Edit profile</button><button onClick={doLogout} className="btn btn-light"><LogOut size={16}/>Logout</button></div>
    </div>
    {loading?<div className="grid min-h-[35vh] place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#1e568a]"/></div>:<>
      <div className="mt-8 grid gap-5 md:grid-cols-3"><motion.div whileHover={{y:-3}} className={card}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0f7] text-[#1e568a]"><CheckCircle2 size={19}/></span><div><p className="text-xs uppercase tracking-wider text-slate-400">Account</p><p className="font-semibold">{user.profile_complete?'Profile complete':'Profile incomplete'}</p></div></div></motion.div><motion.div whileHover={{y:-3}} className={card}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0f7] text-[#1e568a]"><Mail size={19}/></span><div><p className="text-xs uppercase tracking-wider text-slate-400">Email</p><p className="truncate font-semibold">{user.email}</p></div></div></motion.div><motion.div whileHover={{y:-3}} className={card}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f0f7] text-[#1e568a]"><ShieldCheck size={19}/></span><div><p className="text-xs uppercase tracking-wider text-slate-400">Verification</p><p className="font-semibold">Email verified</p></div></div></motion.div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <div className={card}><div className="flex items-center justify-between"><div><p className="eyebrow">PROFILE INFORMATION</p><h2 className="mt-1 text-2xl font-semibold">Academic & quantum profile</h2></div><UserRound className="text-[#1e568a]" size={22}/></div>
          {profile?<div className="mt-6 grid gap-4 sm:grid-cols-2">{[['Country',profile.country],['State',profile.state],['College / University',profile.college],['Degree',profile.degree],['Branch',profile.branch],['Year',profile.year],['Qiskit experience',profile.qiskit_experience],['Quantum level',profile.quantum_level]].map(([k,v])=><div key={k} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">{k}</p><p className="mt-1 font-medium text-slate-900">{v||'—'}</p></div>)}<div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Programming languages</p><div className="mt-2 flex flex-wrap gap-2">{(profile.programming_languages||[]).map((x:string)=><span key={x} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{x}</span>)}</div></div><div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">Activities</p><div className="mt-2 flex flex-wrap gap-2">{(profile.activities||[]).map((x:string)=><span key={x} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{x}</span>)}</div></div></div>:<div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">Your academic profile is not complete yet. Complete registration to see your details here.</div>}
        </div>
        <div className={card}><p className="eyebrow">UPCOMING</p><h2 className="mt-1 text-2xl font-semibold">Events</h2><div className="mt-5 space-y-3">{events.slice(0,4).map(e=><button key={e.id} onClick={()=>nav('/events')} className="w-full rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-left transition hover:border-[#9bbbd8] hover:bg-[#f3f7fb]"><p className="text-xs font-semibold uppercase tracking-wider text-[#1e568a]">{e.date||'QIC Event'}</p><p className="mt-1 font-semibold">{e.title}</p><p className="mt-1 line-clamp-2 text-sm text-slate-500">{e.description}</p></button>)}{!events.length&&<p className="text-sm text-slate-500">No upcoming events.</p>}</div><button className="btn btn-ghost mt-5 w-full" onClick={()=>nav('/events')}><CalendarDays size={16}/>View all events</button></div>
      </div>
    </>}
  </section></PageTransition>
}
