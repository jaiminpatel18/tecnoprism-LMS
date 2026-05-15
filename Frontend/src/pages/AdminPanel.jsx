import { FiActivity, FiBarChart2, FiUsers } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

function AdminPanel() {
  return (
    <Layout title="Admin Dashboard" subtitle="System-wide analytics, engagement monitoring, and operational controls.">
      <div className="space-y-5">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Active learners', value: '482', icon: FiUsers },
            { label: 'Completion rate', value: '84%', icon: FiActivity },
            { label: 'Avg. weekly XP', value: '412', icon: FiBarChart2 },
            { label: 'Open reports', value: '12', icon: FiActivity },
          ].map((card) => (
            <SurfaceCard key={card.label} className="rounded-2xl p-4">
              <card.icon className="text-indigo-500" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{card.value}</p>
            </SurfaceCard>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Engagement Analytics" subtitle="Completions and session participation trends." />
            <div className="space-y-4">
              {[
                { label: 'Jan', completions: 120, attendance: 80 },
                { label: 'Feb', completions: 190, attendance: 130 },
                { label: 'Mar', completions: 165, attendance: 140 },
                { label: 'Apr', completions: 240, attendance: 160 },
                { label: 'May', completions: 260, attendance: 190 },
                { label: 'Jun', completions: 310, attendance: 220 },
              ].map((row) => (
                <div key={row.label}>
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                  <div className="grid gap-2">
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-3 rounded-full bg-indigo-500"
                        style={{ width: `${Math.min((row.completions / 320) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-3 rounded-full bg-emerald-500"
                        style={{ width: `${Math.min((row.attendance / 240) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />Course completions</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Live attendance</span>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Department Mix" subtitle="Learning activity distribution." />
            <div className="space-y-3">
              {[
                { label: 'Engineering', value: 38, color: 'bg-indigo-500' },
                { label: 'Product', value: 24, color: 'bg-purple-500' },
                { label: 'Design', value: 18, color: 'bg-blue-500' },
                { label: 'Data', value: 20, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1.7fr]">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Engagement Heatmap" subtitle="Weekly intensity by day and time." />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, idx) => (
                <div
                  key={idx}
                  className={`h-6 rounded-md ${
                    idx % 5 === 0
                      ? 'bg-indigo-600'
                      : idx % 4 === 0
                        ? 'bg-indigo-400'
                        : idx % 3 === 0
                          ? 'bg-indigo-300'
                          : 'bg-indigo-100 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-0">
            <div className="border-b border-indigo-100/70 px-5 py-4 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">XP</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ava Shah', role: 'Engineer', xp: 3440, status: 'Active' },
                    { name: 'Rohan Mehta', role: 'Product Manager', xp: 3190, status: 'Active' },
                    { name: 'Meera Patel', role: 'Designer', xp: 2810, status: 'Away' },
                  ].map((row) => (
                    <tr key={row.name} className="border-t border-indigo-100/70 dark:border-slate-700">
                      <td className="px-5 py-3 text-slate-800 dark:text-slate-100">{row.name}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{row.role}</td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{row.xp}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SurfaceCard>
        </section>
      </div>
    </Layout>
  );
}

export default AdminPanel;
