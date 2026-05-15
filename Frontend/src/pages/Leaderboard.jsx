import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiAward, FiFilter, FiFlame, FiTrendingUp } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

const medalStyles = ['from-yellow-400 to-amber-600', 'from-slate-300 to-slate-500', 'from-amber-700 to-orange-700'];
const departments = ['All', 'Engineering', 'Product', 'Design', 'Data'];

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All');
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/leaderboard`, authConfig(token));
        setLeaders(data.data || []);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  const filteredLeaders = useMemo(
    () =>
      department === 'All' ? leaders : leaders.filter((leader) => (leader.department || 'Engineering') === department),
    [department, leaders],
  );

  return (
    <Layout title="Leaderboard" subtitle="Track top performers across XP, consistency, and engagement.">
      <div className="space-y-5">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Department Filter" />
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  department === dept
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-300'
                }`}
              >
                <FiFilter className="h-3.5 w-3.5" /> {dept}
              </button>
            ))}
          </div>
        </SurfaceCard>

        {loading ? (
          <SurfaceCard className="rounded-2xl p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400">Loading leaderboard...</p>
          </SurfaceCard>
        ) : filteredLeaders.length === 0 ? (
          <EmptyState
            icon={FiAward}
            title="No leaderboard data"
            description="No records found for this department yet."
          />
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {filteredLeaders.slice(0, 3).map((leader, idx) => (
                <motion.div
                  key={leader._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="premium-card rounded-2xl p-5 text-center"
                >
                  <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
                    <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white ${medalStyles[idx] || 'from-indigo-500 to-purple-600'}`}>
                      {leader.firstName?.charAt(0)}
                      {leader.lastName?.charAt(0)}
                    </div>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Rank #{idx + 1}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {leader.firstName} {leader.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{leader.role || 'Learner'}</p>
                  <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                    <FiTrendingUp /> {leader.xpPoints} XP
                  </p>
                </motion.div>
              ))}
            </section>

            <SurfaceCard className="overflow-hidden rounded-2xl p-0">
              <div className="border-b border-indigo-100/70 px-5 py-4 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Full Rankings</h3>
              </div>
              <div className="divide-y divide-indigo-100/70 dark:divide-slate-700">
                {filteredLeaders.map((leader, idx) => (
                  <motion.div
                    key={leader._id}
                    whileHover={{ x: 3 }}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 ${
                      user?._id === leader._id ? 'bg-indigo-50/70 dark:bg-slate-800/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                          idx < 3
                            ? `bg-gradient-to-br text-white ${medalStyles[idx]}`
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {leader.firstName} {leader.lastName}
                          {user?._id === leader._id ? (
                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                              You
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {leader.department || 'Engineering'} • {leader.role || 'Learner'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{leader.xpPoints} XP</p>
                      <p className="inline-flex items-center gap-1 text-xs text-orange-500">
                        <FiFlame /> {leader.currentStreak || 0} day streak
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SurfaceCard>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Leaderboard;
