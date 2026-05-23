import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiArrowLeft, FiAward, FiCheckCircle, FiLock, FiPlayCircle } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import { SkeletonBlock, SkeletonLine } from '../components/skeletons/SkeletonBase';
import { API_URL, authConfig } from '../utils/api';

const findLessonIndex = (course, moduleId, lessonId) => {
  for (let moduleIndex = 0; moduleIndex < (course?.modules || []).length; moduleIndex += 1) {
    const module = course.modules[moduleIndex];
    if (module._id?.toString() !== String(moduleId)) {
      continue;
    }
    for (let lessonIndex = 0; lessonIndex < (module.lessons || []).length; lessonIndex += 1) {
      const lesson = module.lessons[lessonIndex];
      if (lesson._id?.toString() === String(lessonId)) {
        return { moduleIndex, lessonIndex };
      }
    }
  }
  return { moduleIndex: 0, lessonIndex: 0 };
};

function CourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [progressState, setProgressState] = useState({
    progress: 0,
    completedLessons: [],
    isCompleted: false,
    certificateId: null,
    awarded: null,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/courses/${id}`, authConfig(token));
        const payload = data.data;
        setCourse(payload);
        setEnrolled(Boolean(payload.isEnrolled));
        setProgressState({
          progress: payload.userEnrollment?.progress || 0,
          completedLessons: payload.userEnrollment?.completedLessons || [],
          isCompleted: Boolean(payload.userEnrollment?.isCompleted),
          certificateId: payload.userEnrollment?.certificateId || null,
          awarded: null,
        });

        if (payload.userEnrollment?.lastAccessedLesson?.moduleId && payload.userEnrollment?.lastAccessedLesson?.lessonId) {
          const indices = findLessonIndex(
            payload,
            payload.userEnrollment.lastAccessedLesson.moduleId,
            payload.userEnrollment.lastAccessedLesson.lessonId,
          );
          setActiveModule(indices.moduleIndex);
          setActiveLesson(indices.lessonIndex);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]);

  const currentLesson = course?.modules?.[activeModule]?.lessons?.[activeLesson];
  const lessonCount = useMemo(
    () => course?.modules?.reduce((sum, module) => sum + (module.lessons?.length || 0), 0) || 0,
    [course],
  );

  const completedLessonSet = useMemo(
    () => new Set((progressState.completedLessons || []).map((item) => String(item))),
    [progressState.completedLessons],
  );

  const activeLessonCompleted = Boolean(currentLesson?._id && completedLessonSet.has(String(currentLesson._id)));
  const completedModuleCount = (course?.modules || []).filter((module) =>
    (module.lessons || []).every((lesson) => completedLessonSet.has(String(lesson._id))),
  ).length;

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await axios.post(`${API_URL}/api/courses/${id}/enroll`, {}, authConfig(token));
      const refreshed = await axios.get(`${API_URL}/api/courses/${id}`, authConfig(token));
      const payload = refreshed.data.data;
      setCourse(payload);
      setEnrolled(Boolean(payload.isEnrolled));
      setProgressState((prev) => ({
        ...prev,
        progress: payload.userEnrollment?.progress || 0,
        completedLessons: payload.userEnrollment?.completedLessons || [],
        isCompleted: Boolean(payload.userEnrollment?.isCompleted),
        certificateId: payload.userEnrollment?.certificateId || null,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in this course.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkLessonComplete = async () => {
    if (!course || !currentLesson) {
      return;
    }

    try {
      setMarkingComplete(true);
      const currentModule = course.modules?.[activeModule];
      const { data } = await axios.post(
        `${API_URL}/api/courses/${id}/progress`,
        {
          moduleId: currentModule?._id,
          lessonId: currentLesson?._id,
          completed: true,
        },
        authConfig(token),
      );

      setProgressState((prev) => ({
        ...prev,
        ...data.data,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lesson progress.');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleLessonOpen = async (module, lesson, moduleIndex, lessonIndex) => {
    if (!enrolled) {
      return;
    }

    setActiveModule(moduleIndex);
    setActiveLesson(lessonIndex);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/courses/${id}/progress`,
        {
          moduleId: module?._id,
          lessonId: lesson?._id,
          completed: false,
        },
        authConfig(token),
      );

      setProgressState((prev) => ({
        ...prev,
        ...data.data,
      }));
    } catch (err) {
      console.error('Failed to sync lesson resume state', err);
    }
  };

  if (loading) {
    return (
      <Layout title="Course Experience" subtitle="Preparing your learning environment.">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <div className="premium-card rounded-3xl p-6">
              <SkeletonLine className="h-4 w-32" />
              <SkeletonLine className="mt-4 h-6 w-2/3" />
              <SkeletonLine className="mt-3 h-4 w-3/4" />
              <div className="mt-5 flex flex-wrap gap-2">
                {[...Array(4)].map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-7 w-24 rounded-full" />
                ))}
              </div>
              <SkeletonBlock className="mt-6 h-10 w-36 rounded-xl" />
            </div>
            <div className="premium-card rounded-2xl p-5">
              <SkeletonLine className="h-4 w-32" />
              <SkeletonBlock className="mt-4 h-3 w-full rounded-full" />
              <SkeletonBlock className="mt-3 h-10 w-full rounded-xl" />
            </div>
          </div>
          <div className="premium-card rounded-2xl p-4">
            <SkeletonLine className="h-4 w-28" />
            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, idx) => (
                <SkeletonBlock key={idx} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout title="Course Experience" subtitle="Could not load this course.">
        <EmptyState icon={FiLock} title="Unable to open course" description={error || 'Course not found.'} />
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
        >
          <FiArrowLeft /> Back to courses
        </button>
      </Layout>
    );
  }

  return (
    <Layout title={course.title} subtitle="AI + automation learning track with module-level progress, XP rewards, and certification.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <SurfaceCard className="relative overflow-hidden rounded-3xl p-6">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
            >
              <FiArrowLeft /> Back to courses
            </button>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white">
              <p className="text-sm text-indigo-100">
                {course.learningDomain || course.category || 'AI Automation'}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{currentLesson?.title || course.title}</h2>
              <p className="mt-2 max-w-xl text-sm text-indigo-100">{currentLesson?.description || course.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-white/15 px-3 py-1">{lessonCount} lessons</span>
                <span className="rounded-full bg-white/15 px-3 py-1">{course.level || 'Intermediate'}</span>
                <span className="rounded-full bg-amber-300/25 px-3 py-1 text-amber-100">
                  <FiAward className="mr-1 inline" /> {course.pointsReward || 150} XP
                </span>
                {(course.technologies || []).slice(0, 2).map((tech) => (
                  <span key={tech} className="rounded-full bg-white/15 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                {enrolled ? (
                  <button
                    type="button"
                    disabled={markingComplete || activeLessonCompleted || progressState.isCompleted}
                    onClick={handleMarkLessonComplete}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 disabled:opacity-60"
                  >
                    <FiCheckCircle />
                    {progressState.isCompleted
                      ? 'Course Completed'
                      : activeLessonCompleted
                        ? 'Lesson Completed'
                        : markingComplete
                          ? 'Marking...'
                          : 'Mark Lesson Complete'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={enrolling}
                    onClick={handleEnroll}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] disabled:opacity-70"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll now'}
                  </button>
                )}
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Course Progress" subtitle="Tracks completed lessons and unlocks certificate automatically." />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Completed modules</span>
                <span>
                  {enrolled ? completedModuleCount : 0}/{course.modules?.length || 0}
                </span>
              </div>
              <ProgressBar value={enrolled ? progressState.progress || 0 : 0} />
              <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                {progressState.isCompleted
                  ? `Certificate generated (${progressState.certificateId || 'N/A'}) and badge awarded.`
                  : `Reward unlock at 100% completion: Proficiency Badge + ${course.pointsReward || 150} XP`}
              </div>
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard className="rounded-2xl p-4">
          <SectionHeading title="Curriculum" subtitle={`${course.modules?.length || 0} modules`} />
          <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            {course.modules?.map((module, moduleIndex) => (
              <div key={`${module.title}-${moduleIndex}`} className="rounded-xl border border-indigo-100/70 dark:border-slate-700">
                <div className="border-b border-indigo-100/70 px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:text-slate-100">
                  Module {moduleIndex + 1}: {module.title}
                </div>
                <div className="divide-y divide-indigo-100/70 dark:divide-slate-700">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const active = moduleIndex === activeModule && lessonIndex === activeLesson;
                    const completed = completedLessonSet.has(String(lesson._id));
                    return (
                      <button
                        type="button"
                        key={`${lesson.title}-${lessonIndex}`}
                        onClick={() => handleLessonOpen(module, lesson, moduleIndex, lessonIndex)}
                        className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300'
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                        } ${!enrolled ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        {completed ? <FiCheckCircle className="mt-0.5 text-emerald-500" /> : <FiPlayCircle className="mt-0.5" />}
                        <span>
                          {lesson.title}
                          <span className="mt-1 block text-xs text-slate-400">{lesson.durationMinutes || 10} min</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default CourseViewer;
