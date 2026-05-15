import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiTrendingUp } from 'react-icons/fi';
import { login, reset } from '../store/slices/authSlice';
import ThemeToggle from '../components/ThemeToggle';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const [localError, setLocalError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [dispatch, isSuccess, navigate, user]);

  useEffect(() => {
    if (isError) {
      setLocalError(message);
    }
  }, [isError, message]);

  const onChange = (e) => {
    setLocalError('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
      <div className="floating-orb -left-16 top-0 h-72 w-72 bg-indigo-500/30" />
      <div className="floating-orb -bottom-20 right-0 h-80 w-80 bg-fuchsia-500/25" />

      <section className="animate-grid relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-indigo-100">Tecnoprism</p>
            <h1 className="mt-2 text-4xl font-bold">Learning Experience Cloud</h1>
          </div>
          <ThemeToggle />
        </div>
        <div className="space-y-5">
          <p className="max-w-lg text-lg text-indigo-100">
            Intelligent upskilling journeys with collaboration, streaks, and real-time mastery analytics.
          </p>
          <div className="glass-panel w-fit rounded-2xl px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold">
              <FiTrendingUp /> Team completion score up 21% this week
            </span>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel gradient-border relative w-full max-w-md rounded-3xl p-7 md:p-9"
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Tecnoprism LMS</p>
            <ThemeToggle />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue your learning streak.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Company Email
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/80">
                <FiMail className="text-indigo-500" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="employee@tecnoprism.com"
                  className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/80">
                <FiLock className="text-indigo-500" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
              </div>
            </label>

            {localError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{localError}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <FiArrowRight />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            New to Tecnoprism LMS?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
              Create account
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default Login;
