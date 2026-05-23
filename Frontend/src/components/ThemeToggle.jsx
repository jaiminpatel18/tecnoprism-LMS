import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring relative inline-flex h-10 w-20 items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-[color:var(--text)] shadow-sm transition hover:bg-[color:var(--surface-muted)] hover:shadow-md"
      aria-label="Toggle theme"
    >
      <motion.span
        animate={{ x: isDark ? 40 : 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        className="absolute left-1 top-1 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
      />
      <span className="relative z-10 flex w-full justify-between px-1 text-sm">
        <FiSun className={isDark ? 'opacity-35' : 'opacity-100'} />
        <FiMoon className={isDark ? 'opacity-100' : 'opacity-35'} />
      </span>
    </button>
  );
}

export default ThemeToggle;
