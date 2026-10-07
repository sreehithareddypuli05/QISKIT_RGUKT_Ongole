import { FormEvent, useEffect, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Loader2,
  Mail,
  LockKeyhole,
  UserRound,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { authService, AuthError, saveSession } from '../services/auth';

import { useAuth } from '../hooks/useAuth';


const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const field = 'qic-field';

const steps = ['Account', 'Profile'];

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};


function Field({
  label,
  icon: Icon,
  children,
  delay = 0,
}: {
  label: string;
  icon: any;
  children: any;
  delay?: number;
}) {
  return (
    <motion.label
      variants={inputVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.35, delay }}
      className="group block"
    >
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-slate-500">
        <Icon size={14} className="text-[#1e568a]" />
        {label}
      </span>

      {children}
    </motion.label>
  );
}


export default function LoginForm({
  profileOnly = false,
}: {
  profileOnly?: boolean;
}) {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [params] = useSearchParams();

  const [mode, setMode] = useState<'login' | 'register'>(
    profileOnly ? 'register' : 'register'
  );

  const [step, setStep] = useState(profileOnly ? 1 : 0);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const [states, setStates] = useState<string[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);

  const [form, setForm] = useState<any>(() => {
    let pending: any = {};

    try {
      pending = JSON.parse(
        sessionStorage.getItem('qic.pending.profile') || '{}'
      );
    } catch {}

    return {
      first_name: pending.first_name || '',
      last_name: pending.last_name || '',
      email: pending.email || '',
      password: '',
      country: 'India',
      state: '',
      college: '',
      degree: 'B.Tech',
      branch: 'CSE',
      year: '1st',
      qiskit_experience: 'No',
      programming_languages: [],
      activities: [],
      quantum_level: 'Beginner',
      referral_code: '',
    };
  });


  useEffect(() => {
    if (params.get('oauth_error')) {
      setMsg(params.get('oauth_error') || 'Google sign-in failed.');
    }
  }, [params]);


  useEffect(() => {
    fetch(API_BASE + '/api/meta/states')
      .then((r) => r.json())
      .then(setStates)
      .catch(() => {});
  }, []);


  useEffect(() => {
    if (!form.state) {
      setColleges([]);
      return;
    }

    fetch(
      API_BASE +
        '/api/meta/colleges?state=' +
        encodeURIComponent(form.state)
    )
      .then((r) => r.json())
      .then(setColleges)
      .catch(() => {});
  }, [form.state]);


  const set = (k: string, v: any) =>
    setForm((f: any) => ({
      ...f,
      [k]: v,
    }));


  const toggle = (k: string, v: string) =>
    set(
      k,
      form[k].includes(v)
        ? form[k].filter((x: string) => x !== v)
        : [...form[k], v]
    );


  const google = async () => {
    setMsg('');
    setBusy(true);

    try {
      const r = await authService.googleStart();
      window.location.href = r.url;
    } catch (e) {
      setMsg(
        e instanceof AuthError
          ? e.message
          : 'Google sign-in is unavailable.'
      );
    } finally {
      setBusy(false);
    }
  };


  // Account -> Profile
  const nextToProfile = (e: FormEvent) => {
    e.preventDefault();

    setMsg('');

    if (!form.first_name.trim()) {
      setMsg('Please enter your first name.');
      return;
    }

    if (!form.last_name.trim()) {
      setMsg('Please enter your last name.');
      return;
    }

    if (!form.email.trim()) {
      setMsg('Please enter your email address.');
      return;
    }

    if (form.password.length < 8) {
      setMsg('Use a password with at least 8 characters.');
      return;
    }

    sessionStorage.setItem(
      'qic.pending.profile',
      JSON.stringify({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      })
    );

    setStep(1);
  };


  const complete = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.state ||
      !form.college ||
      !form.programming_languages.length ||
      !form.activities.length
    ) {
      setMsg(
        'Please complete your state, college, programming languages and activities.'
      );
      return;
    }

    setBusy(true);
    setMsg('');

    try {
      await authService.saveProfile(form);

      const u = await authService.me();

      localStorage.setItem('qic.auth.user', JSON.stringify(u));

      sessionStorage.removeItem('qic.pending.profile');

      setUser(u);

      nav('/dashboard', { replace: true });
    } catch (e) {
      setMsg(
        e instanceof AuthError
          ? e.message
          : 'Unable to save your profile.'
      );
    } finally {
      setBusy(false);
    }
  };


  const login = async (e: FormEvent) => {
    e.preventDefault();

    setBusy(true);
    setMsg('');

    try {
      const r = await authService.login({
        email: form.email,
        password: form.password,
        remember: true,
      });

      saveSession(r, true);

      setUser(r.user);

      nav('/dashboard', { replace: true });
    } catch (e) {
      setMsg(
        e instanceof AuthError
          ? e.message
          : 'Unable to sign in.'
      );
    } finally {
      setBusy(false);
    }
  };


  const progress = useMemo(
    () => ((step + 1) / steps.length) * 100,
    [step]
  );


  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_90px_-55px_rgba(15,23,42,.35)]">

      {/* Progress */}
      <div className="border-b border-slate-100 bg-[#fbfcfd] px-5 py-5 sm:px-8">
        <div className="mx-auto max-w-4xl">

          <div className="flex items-center justify-between gap-2">

            {steps.map((s, i) => (
              <div
                key={s}
                className="flex min-w-0 flex-1 items-center gap-2"
              >

                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-bold transition-all duration-300 ${
                    i <= step
                      ? 'border-[#1e568a] bg-[#1e568a] text-white'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {i + 1}
                </span>

                <span
                  className={`hidden text-xs font-semibold sm:block ${
                    i <= step
                      ? 'text-[#1e568a]'
                      : 'text-slate-400'
                  }`}
                >
                  {s}
                </span>

                {i < steps.length - 1 && (
                  <span className="mx-1 h-px flex-1 bg-slate-200">
                    <span
                      className="block h-px origin-left bg-[#1e568a] transition-transform duration-500"
                      style={{
                        transform: `scaleX(${i < step ? 1 : 0})`,
                      }}
                    />
                  </span>
                )}

              </div>
            ))}

          </div>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-[#1e568a]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45 }}
            />
          </div>

        </div>
      </div>


      <div className="p-5 sm:p-8 lg:p-10">

        <AnimatePresence mode="wait">

          {/* LOGIN */}
          {!profileOnly && mode === 'login' ? (

            <motion.form
              key="login"
              onSubmit={login}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-xl"
            >

              <div className="mb-8">
                <p className="eyebrow">MEMBER ACCESS</p>

                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-2 text-slate-500">
                  Sign in to open your QIC profile and participation dashboard.
                </p>
              </div>


              <div className="grid gap-5">

                <Field label="Email address" icon={Mail}>
                  <input
                    className={field}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      set('email', e.target.value)
                    }
                    required
                  />
                </Field>


                <Field
                  label="Password"
                  icon={LockKeyhole}
                  delay={0.04}
                >
                  <input
                    className={field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      set('password', e.target.value)
                    }
                    required
                  />
                </Field>

              </div>


              <button
                className="btn btn-primary mt-7 w-full !rounded-xl !py-3.5"
                disabled={busy}
              >
                {busy ? (
                  <Loader2
                    className="animate-spin"
                    size={17}
                  />
                ) : (
                  <LogInIcon />
                )}

                Sign in
              </button>


              <button
                type="button"
                onClick={google}
                className="btn btn-ghost mt-3 w-full !rounded-xl !py-3.5"
                disabled={busy}
              >
                <GoogleIcon />
                Continue with Google
              </button>


              <p className="mt-6 text-center text-sm text-slate-500">
                New here?{' '}

                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setStep(0);
                    setMsg('');
                  }}
                  className="font-semibold text-[#1e568a]"
                >
                  Create an account
                </button>
              </p>

            </motion.form>

          ) : !profileOnly && step === 0 ? (

            /* ACCOUNT */
            <motion.form
              key="register"
              onSubmit={nextToProfile}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >

              <div className="mx-auto max-w-4xl">

                <div className="mb-8">

                  <p className="eyebrow">
                    STEP 1 · ACCOUNT
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                    Create your member account
                  </h2>

                  <p className="mt-2 max-w-2xl text-slate-500">
                    Enter your account details and continue to complete your profile.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={google}
                  className="btn btn-ghost w-full !rounded-xl !py-4"
                  disabled={busy}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>


                <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[.18em] text-slate-400">

                  <span className="h-px flex-1 bg-slate-200" />

                  or continue with email

                  <span className="h-px flex-1 bg-slate-200" />

                </div>


                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="First name"
                    icon={UserRound}
                  >
                    <input
                      className={field}
                      autoComplete="given-name"
                      placeholder="First name"
                      value={form.first_name}
                      onChange={(e) =>
                        set('first_name', e.target.value)
                      }
                      required
                    />
                  </Field>


                  <Field
                    label="Last name"
                    icon={UserRound}
                    delay={0.04}
                  >
                    <input
                      className={field}
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={form.last_name}
                      onChange={(e) =>
                        set('last_name', e.target.value)
                      }
                      required
                    />
                  </Field>

                </div>


                <div className="mt-5">

                  <Field
                    label="Email address"
                    icon={Mail}
                    delay={0.08}
                  >
                    <input
                      className={field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        set('email', e.target.value)
                      }
                      required
                    />
                  </Field>

                </div>


                <div className="mt-5">

                  <Field
                    label="Password"
                    icon={LockKeyhole}
                    delay={0.12}
                  >
                    <input
                      className={field}
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) =>
                        set('password', e.target.value)
                      }
                      minLength={8}
                      required
                    />
                  </Field>

                </div>


                {/* NEXT BUTTON */}
                <button
                  type="submit"
                  className="btn btn-primary mt-8 w-full !rounded-xl !py-4"
                  disabled={busy}
                >
                  {busy ? (
                    <Loader2
                      className="animate-spin"
                      size={17}
                    />
                  ) : (
                    <ArrowRight size={17} />
                  )}

                  Next
                  <ArrowRight size={17} />
                </button>


                <p className="mt-7 text-center text-sm text-slate-500">

                  Already registered?{' '}

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-semibold text-[#1e568a]"
                  >
                    Sign in
                  </button>

                </p>

              </div>

            </motion.form>

          ) : (

            /* PROFILE */
            <motion.form
              key="profile"
              onSubmit={complete}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-4xl"
            >

              <div className="mb-8">

                <p className="eyebrow">
                  STEP 2 · PROFILE
                </p>

                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  Complete your academic profile
                </h2>

                <p className="mt-2 text-slate-500">
                  State and college data are linked in the backend, so the college list updates dynamically.
                </p>

              </div>


              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Country"
                  icon={MapPin}
                >
                  <select
                    className={field}
                    value={form.country}
                    onChange={(e) =>
                      set('country', e.target.value)
                    }
                  >
                    <option>India</option>
                  </select>
                </Field>


                <Field
                  label="State / UT"
                  icon={MapPin}
                  delay={0.04}
                >
                  <select
                    className={field}
                    value={form.state}
                    onChange={(e) => {
                      set('state', e.target.value);
                      set('college', '');
                    }}
                    required
                  >
                    <option value="">
                      Select state
                    </option>

                    {states.map((s) => (
                      <option key={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

              </div>


              <div className="mt-5">

                <Field
                  label="College / University"
                  icon={GraduationCap}
                >

                  <div className="relative">

                    <select
                      className={`${field} pr-10`}
                      value={form.college}
                      onChange={(e) =>
                        set('college', e.target.value)
                      }
                      required
                      disabled={!form.state}
                    >

                      <option value="">
                        {form.state
                          ? 'Select your college / university'
                          : 'Choose a state first'}
                      </option>

                      {colleges.map((c) => (
                        <option
                          key={c.id}
                          value={c.name}
                        >
                          {c.name} · {c.city}
                        </option>
                      ))}

                    </select>

                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={17}
                    />

                  </div>

                </Field>

              </div>


              <div className="mt-5 grid gap-5 sm:grid-cols-3">

                <Field
                  label="Degree"
                  icon={GraduationCap}
                >
                  <select
                    className={field}
                    value={form.degree}
                    onChange={(e) =>
                      set('degree', e.target.value)
                    }
                  >
                    <option>B.Tech</option>
                    <option>B.Sc</option>
                    <option>M.Tech</option>
                    <option>M.Sc</option>
                    <option>Ph.D</option>
                    <option>Other</option>
                  </select>
                </Field>


                <Field
                  label="Branch"
                  icon={BookIcon}
                >
                  <select
                    className={field}
                    value={form.branch}
                    onChange={(e) =>
                      set('branch', e.target.value)
                    }
                  >
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>EEE</option>
                    <option>Mechanical</option>
                    <option>Chemical</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Other</option>
                  </select>
                </Field>


                <Field
                  label="Year"
                  icon={CalendarIcon}
                >
                  <select
                    className={field}
                    value={form.year}
                    onChange={(e) =>
                      set('year', e.target.value)
                    }
                  >
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                    <option>4th</option>
                    <option>Postgraduate</option>
                    <option>Research</option>
                  </select>
                </Field>

              </div>


              <div className="mt-7 grid gap-6 lg:grid-cols-2">

                <fieldset className="rounded-2xl border border-slate-200 p-5">

                  <legend className="px-1 text-sm font-semibold">
                    Have you used Qiskit before?
                  </legend>

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {['Yes', 'No'].map((x) => (
                      <button
                        type="button"
                        key={x}
                        onClick={() =>
                          set('qiskit_experience', x)
                        }
                        className={`btn !rounded-xl ${
                          form.qiskit_experience === x
                            ? 'btn-primary'
                            : 'btn-ghost'
                        }`}
                      >
                        {x}
                      </button>
                    ))}

                  </div>

                </fieldset>


                <fieldset className="rounded-2xl border border-slate-200 p-5">

                  <legend className="px-1 text-sm font-semibold">
                    Quantum knowledge level
                  </legend>

                  <select
                    className={`${field} mt-3`}
                    value={form.quantum_level}
                    onChange={(e) =>
                      set('quantum_level', e.target.value)
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>

                </fieldset>

              </div>


              <fieldset className="mt-6 rounded-2xl border border-slate-200 p-5">

                <legend className="px-1 text-sm font-semibold">

                  Programming languages{' '}

                  <span className="font-normal text-slate-400">
                    (select at least one)
                  </span>

                </legend>


                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  {['Python', 'C++', 'Java', 'Others'].map((x) => (
                    <label
                      key={x}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                        form.programming_languages.includes(x)
                          ? 'border-[#9bbbd8] bg-[#f3f7fb] text-[#153e63]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >

                      <input
                        className="accent-[#1e568a]"
                        type="checkbox"
                        checked={form.programming_languages.includes(x)}
                        onChange={() =>
                          toggle('programming_languages', x)
                        }
                      />

                      {x}

                    </label>
                  ))}

                </div>

              </fieldset>


              <fieldset className="mt-6 rounded-2xl border border-slate-200 p-5">

                <legend className="px-1 text-sm font-semibold">

                  Activities{' '}

                  <span className="font-normal text-slate-400">
                    (select at least one)
                  </span>

                </legend>


                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">

                  {[
                    'Workshop',
                    'Seminar',
                    'Expo',
                    'Hackathon',
                    'Game',
                  ].map((x) => (
                    <label
                      key={x}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                        form.activities.includes(x)
                          ? 'border-[#9bbbd8] bg-[#f3f7fb] text-[#153e63]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >

                      <input
                        className="accent-[#1e568a]"
                        type="checkbox"
                        checked={form.activities.includes(x)}
                        onChange={() =>
                          toggle('activities', x)
                        }
                      />

                      {x}

                    </label>
                  ))}

                </div>

              </fieldset>


              <div className="mt-6">

                <Field
                  label="Referral code (optional)"
                  icon={SparkIcon}
                >
                  <input
                    className={field}
                    placeholder="Enter referral code"
                    value={form.referral_code}
                    onChange={(e) =>
                      set('referral_code', e.target.value)
                    }
                  />
                </Field>

              </div>


              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    if (profileOnly) {
                      nav('/');
                    } else {
                      setStep(0);
                    }
                  }}
                >
                  <ArrowLeft size={16} />

                  {profileOnly
                    ? 'Back to home'
                    : 'Back'}
                </button>


                <button
                  className="btn btn-primary !rounded-xl"
                  disabled={busy}
                >

                  {busy ? (
                    <Loader2
                      className="animate-spin"
                      size={17}
                    />
                  ) : (
                    <UserRound size={17} />
                  )}

                  Complete registration

                  <ArrowRight size={16} />

                </button>

              </div>

            </motion.form>

          )}

        </AnimatePresence>


        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mx-auto mt-6 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {msg}
          </motion.div>
        )}

      </div>

    </div>
  );
}


function GoogleIcon() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full text-sm font-bold">
      G
    </span>
  );
}


function LogInIcon() {
  return (
    <span className="inline-flex">
      <ArrowRight size={17} />
    </span>
  );
}


function BookIcon() {
  return <GraduationCap size={14} />;
}


function CalendarIcon() {
  return <span className="text-[#1e568a]">•</span>;
}


function SparkIcon() {
  return <Sparkles size={14} />;
}