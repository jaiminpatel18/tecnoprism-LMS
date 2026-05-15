import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { register, reset } from '../store/slices/authSlice';
import ThemeToggle from '../components/ThemeToggle';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const { firstName, lastName, email, password } = formData;
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
    if (!email.endsWith('@tecnoprism.com')) {
      setLocalError('Use your @tecnoprism.com company email.');
      return;
    }
    dispatch(register({ firstName, lastName, email, password }));
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-indigo-200">Tecnoprism LMS</p>
            <h1 className="mt-2 text-4xl font-semibold">Build skills with your team</h1>
          </div>
          <ThemeToggle />
        </div>
        <div className="space-y-4 text-indigo-100">
          <p>• Personalized learning paths powered by role-based recommendations.</p>
          <p>• XP, streaks, and badges that make growth addictive and measurable.</p>
          <p>• Live expert sessions and peer community in one collaborative workspace.</p>
        </div>
      </section>

      <section className="relative flex items-center justify-center p-6 lg:p-10">
        <div className="floating-orb -left-20 top-10 h-72 w-72 bg-indigo-500/25" />
        <div className="floating-orb -bottom-10 right-10 h-64 w-64 bg-sky-500/20" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel gradient-border relative w-full max-w-xl rounded-3xl p-7 md:p-9"
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Create account</p>
            <ThemeToggle />
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Create your workspace identity</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join Tecnoprism&apos;s internal learning platform.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                First Name
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/80">
                  <FiUser className="text-indigo-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={onChange}
                    required
                    className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Last Name
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/80">
                  <FiUser className="text-indigo-500" />
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={onChange}
                    required
                    className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
                  />
                </div>
              </label>
            </div>

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
                  placeholder="name@tecnoprism.com"
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
                  className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
                />
              </div>
            </label>

            {localError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{localError}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              <FiArrowRight />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have access?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default Signup;
