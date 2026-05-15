import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiClock, FiPlayCircle, FiStar, FiUser } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, ProgressBar, SectionHeading, SkeletonGrid, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('All');
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/courses`, authConfig(token));
        setCourses(data.data || []);
      } catch (error) {
        console.error('Error fetching courses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const filteredCourses =
    activeLevel === 'All' ? courses : courses.filter((course) => (course.level || 'Beginner') === activeLevel);

  return (
    <Layout
      title="Courses"
      subtitle="Explore role-specific learning paths with XP rewards, progress tracking, and collaborative milestones."
    >
      <div className="space-y-5">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading
            title="Learning Library"
            subtitle="Curated modules built by Tecnoprism experts and partner mentors."
          />
          <div className="flex flex-wrap gap-2">
            {['All', ...levels].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setActiveLevel(level)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeLevel === level
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </SurfaceCard>

        {loading ? (
          <SkeletonGrid />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            icon={FiPlayCircle}
            title="No courses found"
            description="No courses match this filter. Try switching difficulty or check back for fresh content."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, idx) => {
              const progress = (idx * 27 + 38) % 101;
              const difficulty = course.level || levels[idx % levels.length];
              const duration = `${Math.max(course.modules?.length || 1, 1) * 2.5} hrs`;
              const instructor = course.instructor || 'Tecnoprism Expert';
              return (
                <motion.article
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="premium-card group overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44 overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-2xl font-semibold text-white">
                        {course.category || 'Learning Path'}
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {difficulty}
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      <span className="inline-flex items-center gap-1">
                        <FiStar /> {course.pointsReward || 120} XP
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-slate-100">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <FiUser /> {instructor}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiClock /> {duration}
                      </span>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar value={progress} color="from-blue-500 to-indigo-600" />
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                    >
                      Continue learning
                      <FiPlayCircle />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Courses;
