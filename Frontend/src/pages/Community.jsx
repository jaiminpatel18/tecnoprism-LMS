import { FiHash, FiMessageCircle, FiUsers } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const channels = [
  { name: 'frontend-guild', members: 86, topic: 'Patterns, performance, and design systems' },
  { name: 'ai-learning', members: 124, topic: 'Prompting, model ops, and GenAI experiments' },
  { name: 'product-collab', members: 72, topic: 'Discovery, outcomes, and stakeholder alignment' },
];

function Community() {
  return (
    <Layout title="Community" subtitle="Collaborate with peers through channels, discussion threads, and knowledge circles.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Learning Channels" subtitle="Discord-inspired team rooms for ongoing collaboration." />
          <div className="space-y-3">
            {channels.map((channel) => (
              <div key={channel.name} className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <FiHash className="mr-1 inline text-indigo-500" />
                  {channel.name}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{channel.topic}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FiUsers /> {channel.members} members
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Hot Threads" subtitle="Trending discussions from active groups." />
          <div className="space-y-3 text-sm">
            {[
              'Best ways to structure component libraries in large apps?',
              'How are teams measuring quality in prompt engineering workflows?',
              'What makes a high-retention learning path in enterprise products?',
            ].map((thread) => (
              <div key={thread} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-slate-700 dark:text-slate-300">{thread}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <FiMessageCircle className="mr-1 inline" />
                  12 replies
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default Community;
