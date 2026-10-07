import PageTransition from '../components/PageTransition';
import LoginForm from '../components/LoginForm';
import {useSeo} from '../hooks/useSeo';
export default function Login(){useSeo('Login & Registration');return <PageTransition><section className="wrap py-10 sm:py-14"><div className="mx-auto max-w-5xl"><div className="mb-8 text-center"><p className="eyebrow">QUANTUM INNOVATION CENTRE · RGUKT</p><h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Join the quantum community</h1><p className="mx-auto mt-3 max-w-2xl text-slate-500">Create your account, verify your email, complete your academic profile and access events, learning opportunities and achievements.</p></div><LoginForm/></div></section></PageTransition>}
