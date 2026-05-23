import { motion } from 'framer-motion';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SurfaceCard({ className, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay }}
      className={cn('premium-card', className)}
    >
      {children}
    </motion.div>
  );
}

export function ProgressBar({ value, color = 'from-indigo-500 to-purple-600' }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="premium-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="premium-card h-52 animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
        />
      ))}
    </div>
  );
}
