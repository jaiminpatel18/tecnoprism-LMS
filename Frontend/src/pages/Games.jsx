import { motion } from 'framer-motion';
import { FiGift, FiStar, FiTarget, FiZap } from 'react-icons/fi';
import Layout from '../components/Layout';
import { ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';

function Games() {
  const quests = [
    { title: 'Daily Sprint', detail: 'Complete one module today', xp: 60, progress: 65 },
    { title: 'Collab Quest', detail: 'Comment on 2 team blogs', xp: 40, progress: 30 },
    { title: 'Knowledge Rush', detail: 'Finish 3 lessons in 48h', xp: 120, progress: 52 },
  ];

  return (
    <Layout title="Games & Quests" subtitle="Gamified challenges, streaks, and reward loops inspired by modern learning apps.">
      <div className="space-y-5">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Current Level', value: '12', icon: FiStar },
            { label: 'Quest Coins', value: '420', icon: FiGift },
            { label: 'Daily Streak', value: '14 days', icon: FiZap },
          ].map((item) => (
            <SurfaceCard key={item.label} className="rounded-2xl p-4">
              <item.icon className="text-indigo-500" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
            </SurfaceCard>
          ))}
        </section>

        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Active Challenges" subtitle="Finish tasks to unlock badges and XP bursts." />
          <div className="space-y-4">
            {quests.map((quest, idx) => (
              <motion.div
                key={quest.title}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700"
              >
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
                <ProgressBar value={quest.progress + idx * 4} color="from-amber-500 to-orange-500" />
              </motion.div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default Games;
