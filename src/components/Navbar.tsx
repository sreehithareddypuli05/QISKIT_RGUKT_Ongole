import { useEffect, useState, type MouseEvent } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogIn, LogOut, UserRound, LockKeyhole } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { NAV } from '../data/content';

export default function Navbar() {
  const [scrolled,setScrolled]=useState(false); const [open,setOpen]=useState(false); const loc=useLocation(); const nav=useNavigate(); const {user,logout,loading}=useAuth();
  useEffect(()=>{const f=()=>setScrolled(scrollY>12);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
  const doLogout=async()=>{await logout();nav('/',{replace:true})};
  const profileIncomplete=!!user && !user.profile_complete;
  const visibleNav = user ? NAV : NAV.filter(n=>n.to==='/' );
  const goLocked=(e:MouseEvent<HTMLButtonElement>)=>{e.preventDefault();nav('/profile-setup');};
  return <>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">Skip to content</a>
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled?'border-slate-200 bg-white/95 py-2 shadow-[0_8px_30px_-24px_rgba(15,23,42,.4)] backdrop-blur':'border-transparent bg-white py-3'}`}>
      <div className="wrap flex items-center justify-between gap-4"><Logo />
        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          {visibleNav.map(n=>profileIncomplete && n.to!=='/' ? <button key={n.to} type="button" onClick={goLocked} title="Complete your profile to unlock this page" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-slate-400 transition hover:bg-slate-50">{n.label.startsWith('Amaravati')?<><span className="2xl:hidden">AQV</span><span className="hidden 2xl:inline">Amaravati Quantum Valley</span></>:n.label}<LockKeyhole size={12}/></button> : <NavLink key={n.to} to={n.to} end={n.to==='/' } className={({isActive})=>`rounded-full px-3 py-2 text-[13px] font-medium transition ${isActive?'bg-[#e8f0f7] text-[#1e568a]':'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>{n.label.startsWith('Amaravati')?<><span className="2xl:hidden">AQV</span><span className="hidden 2xl:inline">Amaravati Quantum Valley</span></>:n.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          {!loading && (user?<div className="hidden items-center gap-1.5 md:flex"><NavLink to="/dashboard" className="btn btn-ghost !rounded-full !px-3 !py-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e8f0f7] text-xs text-[#1e568a]">{(user.name??user.email)[0].toUpperCase()}</span><span className="max-w-24 truncate">Profile</span></NavLink><button onClick={doLogout} className="btn btn-light !rounded-full !px-3 !py-2"><LogOut size={15}/>Logout</button></div>:<NavLink to="/login" className="btn btn-primary hidden !rounded-full !px-5 !py-2.5 md:inline-flex"><LogIn size={16}/>Login</NavLink>)}
          <button className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(o=>!o)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
        </div>
      </div>
    </header>
    <AnimatePresence>{open&&<motion.div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-40 overflow-y-auto bg-white pt-24 lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <nav aria-label="Mobile" className="wrap flex flex-col pb-10">
        {visibleNav.map((n,i)=><motion.div key={n.to} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:.04+i*.035}}>{profileIncomplete && n.to!=='/' ? <button type="button" onClick={goLocked} className="flex w-full items-center justify-between border-b border-slate-200 py-4 text-left font-display text-2xl text-slate-400">{n.label}<LockKeyhole size={18}/></button> : <NavLink to={n.to} end={n.to==='/' } className={({isActive})=>`block border-b border-slate-200 py-4 font-display text-2xl ${isActive?'text-[#1e568a]':'text-slate-900'}`}>{n.label}</NavLink>}</motion.div>)}
        {user?<><NavLink to="/dashboard" className="btn btn-primary mt-8"><UserRound size={16}/>Profile</NavLink><button onClick={doLogout} className="btn btn-light mt-3"><LogOut size={16}/>Logout</button></>:<NavLink to="/login" className="btn btn-light mt-8"><LogIn size={16}/>Login</NavLink>}
      </nav>
    </motion.div>}</AnimatePresence>
  </>;
}
