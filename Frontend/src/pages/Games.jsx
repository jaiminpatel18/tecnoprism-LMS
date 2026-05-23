import { motion } from 'framer-motion';
import { FiActivity, FiGift, FiGitBranch, FiStar, FiTarget, FiZap } from 'react-icons/fi';
import Layout from '../components/Layout';
import { ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const challenges = [
  { title: 'RPA Debugging Sprint', detail: 'Fix three failing bot workflows with minimum retries.', xp: 90, progress: 58 },
  { title: 'Prompt Engineering Duel', detail: 'Craft high-precision prompts for enterprise document extraction.', xp: 70, progress: 42 },
  { title: 'Workflow Optimization Quest', detail: 'Reduce process latency by 20% in orchestration simulation.', xp: 120, progress: 64 },
  { title: 'Agent Strategy Arena', detail: 'Design tool-using autonomous agents for incident response.', xp: 150, progress: 34 },
];

const gameModes = [
  {
    title: 'Drag-and-Drop Workflow Builder',
    category: 'Automation Workflows',
    icon: FiGitBranch,
    detail: 'Build end-to-end enterprise automations using visual nodes and validation checkpoints.',
  },
  {
    title: 'AI Prompt Challenge',
    category: 'Generative AI',
    icon: FiTarget,
    detail: 'Compete on prompt quality, output reliability, and governance alignment.',
  },
  {
    title: 'Bot-Building Simulation',
    category: 'RPA',
    icon: FiActivity,
    detail: 'Assemble bot pipelines with exception handling, fallback logic, and monitoring.',
  },
];

function Games() {
  return (
    <Layout
      title="Automation Games & Challenges"
      subtitle="Gamified tracks focused on RPA logic, AI problem solving, workflow debugging, and autonomous operations."
    >
      <div className="space-y-5">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Automation Level', value: '18', icon: FiStar },
            { label: 'Innovation Coins', value: '760', icon: FiGift },
            { label: 'Experiment Streak', value: '21 days', icon: FiZap },
          ].map((item) => (
            <SurfaceCard key={item.label} className="rounded-2xl p-4">
              <item.icon className="text-indigo-500" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
            </SurfaceCard>
          ))}
        </section>

        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Active AI + Automation Challenges" subtitle="Complete practical challenge loops to unlock XP, badges, and ranking boosts." />
          <div className="space-y-4">
            {challenges.map((quest, idx) => (
              <motion.div key={quest.title} whileHover={{ y: -2 }} className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <FiTarget className="mr-1 inline text-indigo-500" />
                    {quest.title}
                  </p>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                    +{quest.xp} XP
                  </span>
                </div>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{quest.detail}</p>
                <ProgressBar value={quest.progress + idx * 3} color="from-amber-500 to-orange-500" />
              </motion.div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Game Modes" subtitle="Simulation-first game formats built around enterprise automation use cases." />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {gameModes.map((mode) => (
              <div key={mode.title} className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700">
                <mode.icon className="text-indigo-500" />
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{mode.title}</p>
                <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-300">{mode.category}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{mode.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default Games;
