import PageTransition from '../components/PageTransition';
import LoginForm from '../components/LoginForm';
import { useSeo } from '../hooks/useSeo';

export default function ProfileSetup(){
  useSeo('Complete your QIC profile');
  return <PageTransition><section className="wrap py-8 sm:py-12"><div className="mx-auto max-w-5xl"><div className="mb-7 text-center"><p className="eyebrow">WELCOME TO QIC · PROFILE SETUP</p><h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Complete your quantum profile</h1><p className="mx-auto mt-3 max-w-2xl text-slate-500">Your email is verified. Finish your academic and quantum details once to unlock the full QIC experience.</p></div><LoginForm profileOnly /></div></section></PageTransition>
}
