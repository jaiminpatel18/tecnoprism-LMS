import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiCpu,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiTarget,
  FiUsers,
  FiVideo,
} from 'react-icons/fi';
import { logout, reset } from '../store/slices/authSlice';

const primaryNav = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Courses', icon: FiBookOpen, path: '/courses' },
  { name: 'Expert Sessions', icon: FiVideo, path: '/sessions' },
  { name: 'Career Paths', icon: FiCpu, path: '/career-paths' },
  { name: 'Blogs', icon: FiCompass, path: '/blogs' },
  { name: 'Games', icon: FiTarget, path: '/games' },
  { name: 'Leaderboard', icon: FiAward, path: '/leaderboard' },
  { name: 'Certificates', icon: FiLayers, path: '/certificates' },
  { name: 'Community', icon: FiUsers, path: '/community' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

const utilityNav = [
  { name: 'Notifications', icon: FiMessageSquare, path: '/notifications', badge: 4 },
  { name: 'Profile', icon: FiGrid, path: '/profile' },
  { name: 'Admin Panel', icon: FiUsers, path: '/admin' },
];

function Sidebar({ collapsed, onToggle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 96 : 280 }}
      transition={{ type: 'spring', stiffness: 290, damping: 26 }}
      className="glass-panel sticky top-0 hidden h-screen shrink-0 rounded-r-3xl border-l-0 border-t-0 border-b-0 px-3 py-4 md:flex md:flex-col"
    >
      <div className="flex items-center justify-between px-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 text-white shadow-lg">
            <FiBookOpen className="h-5 w-5" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Tecnoprism LMS</p>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Learning OS</p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="focus-ring rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-indigo-600 transition hover:bg-[color:var(--surface-muted)] dark:text-indigo-300"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="mt-2 space-y-1 overflow-y-auto px-1 pb-2">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.name}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-indigo-100/70 pt-3 dark:border-slate-700/70">
        {utilityNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300'
                    : 'text-slate-500 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.name}</span> : null}
              {item.badge ? (
                <span
                  className={`ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ${
                    collapsed ? 'h-2 w-2 min-w-2 px-0 text-transparent' : 'h-5'
                  }`}
                >
                  {collapsed ? '.' : item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}

        <div className="mt-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
              {user?.firstName?.charAt(0) || 'T'}
              {user?.lastName?.charAt(0) || 'P'}
            </div>
            {!collapsed ? (
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.role || 'Learner'}</p>
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-900/20"
        >
          <FiLogOut className="h-5 w-5 shrink-0" />
          {!collapsed ? <span>Sign out</span> : null}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
