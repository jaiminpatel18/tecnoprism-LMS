import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBell, FiBookOpen, FiHome, FiTarget, FiUser, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const mobileNav = [
  { label: 'Home', icon: FiHome, path: '/dashboard' },
  { label: 'Courses', icon: FiBookOpen, path: '/courses' },
  { label: 'Paths', icon: FiTarget, path: '/career-paths' },
  { label: 'Sessions', icon: FiVideo, path: '/sessions' },
  { label: 'Alerts', icon: FiBell, path: '/notifications' },
  { label: 'Profile', icon: FiUser, path: '/profile' },
];

function Layout({ children, title, subtitle }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0) || 'T';
    const last = user?.lastName?.charAt(0) || 'P';
    return `${first}${last}`.toUpperCase();
  }, [user?.firstName, user?.lastName]);

  return (
    <div className="relative flex min-h-screen">
      <div className="floating-orb left-0 top-0 h-56 w-56 bg-indigo-400/45" />
      <div className="floating-orb bottom-24 right-0 h-64 w-64 bg-sky-400/35" />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

      <div className="relative z-10 flex min-h-screen flex-1 flex-col px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-6">
        <header className="glass-panel mb-6 rounded-2xl px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Tecnoprism Learning Cloud</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                to="/notifications"
                className="focus-ring relative rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2.5 text-[color:var(--text)] shadow-sm transition hover:bg-[color:var(--surface-muted)] hover:shadow-md"
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                  4
                </span>
              </Link>
              <Link
                to="/profile"
                className="focus-ring flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1.5 shadow-sm transition hover:bg-[color:var(--surface-muted)] hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Learner'}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>

      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="glass-panel fixed bottom-3 left-3 right-3 z-40 rounded-2xl px-2 py-2 md:hidden"
      >
        <ul className="flex items-center justify-between gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition ${
                    active
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}

export default Layout;
