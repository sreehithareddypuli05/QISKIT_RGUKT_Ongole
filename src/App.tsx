import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { useAuth } from './hooks/useAuth';

const Events = lazy(() => import('./pages/Events'));
const QiskitFallFest = lazy(() => import('./pages/QiskitFallFest'));
const MinorDegree = lazy(() => import('./pages/MinorDegree'));
const AQV = lazy(() => import('./pages/AmaravatiQuantumValley'));
const Achievements = lazy(() => import('./pages/Achievements'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));

function ProtectedRoute({children,allowIncomplete=false}:{children:ReactNode;allowIncomplete?:boolean}){
  const {user,loading}=useAuth();
  const location=useLocation();
  if(loading) return <div className="grid min-h-[60vh] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#1e568a]"/></div>;
  if(!user) return <Navigate to="/login" replace state={{from:location.pathname}} />;
  if(!allowIncomplete && !user.profile_complete) return <Navigate to="/profile-setup" replace state={{from:location.pathname}} />;
  return <>{children}</>;
}

export default function App() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const root = document.querySelector('#main');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('section:not(.scroll-reveal), header:not(.scroll-reveal), article:not(.scroll-reveal), figure:not(.scroll-reveal), .event-story:not(.scroll-reveal), .faculty-profile:not(.scroll-reveal), .minor-stat:not(.scroll-reveal), .minor-modules article:not(.scroll-reveal), .aqv-node:not(.scroll-reveal)'));
    targets.forEach((el) => el.classList.add('scroll-target'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loc.pathname]);

  return <>
    <Navbar />
    <main id="main">
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
        <Routes location={loc} key={loc.pathname}>
          {/* Public pages: home, login and the OAuth callback only. */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/profile-setup" element={<ProtectedRoute allowIncomplete><ProfileSetup /></ProtectedRoute>} />

          {/* Everything else is private and requires a valid backend session. */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/qiskit-fall-fest" element={<ProtectedRoute><QiskitFallFest /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/minor-degree" element={<ProtectedRoute><MinorDegree /></ProtectedRoute>} />
          <Route path="/amaravati-quantum-valley" element={<ProtectedRoute><AQV /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </>;
}
