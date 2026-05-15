import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiBookmark, FiBookOpen, FiHeart, FiMessageSquare, FiTrendingUp, FiUser } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SkeletonGrid, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

function KnowledgeBase() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/blogs`, authConfig(token));
        setBlogs(data.data || []);
      } catch (error) {
        console.error('Error fetching blogs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  const trending = useMemo(() => blogs.slice(0, 3), [blogs]);

  const handleLike = async (blogId) => {
    try {
      await axios.post(`${API_URL}/api/blogs/${blogId}/like`, {}, authConfig(token));
      setBlogs((prev) =>
        prev.map((blog) => {
          if (blog._id !== blogId) {
            return blog;
          }
          const liked = blog.likes?.includes(user?._id);
          const likes = liked
            ? blog.likes.filter((item) => item !== user?._id)
            : [...(blog.likes || []), user?._id];
          return { ...blog, likes };
        }),
      );
    } catch (error) {
      console.error('Error liking blog', error);
    }
  };

  return (
    <Layout title="Blogs & Knowledge Base" subtitle="Read, react, and share practical insights from across the organization.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {loading ? (
            <SkeletonGrid />
          ) : blogs.length === 0 ? (
            <EmptyState
              icon={FiBookOpen}
              title="No blogs published yet"
              description="Start sharing insights with the team and build internal knowledge momentum."
            />
          ) : (
            blogs.map((blog, idx) => {
              const liked = blog.likes?.includes(user?._id);
              return (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="premium-card overflow-hidden rounded-2xl"
                >
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="h-52 w-full object-cover" />
                  ) : (
                    <div className="h-52 bg-gradient-to-r from-indigo-600 to-blue-600" />
                  )}

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {(blog.tags || ['Engineering', 'Product']).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link to={`/blogs/${blog._id}`} className="block text-xl font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100">
                      {blog.title}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{blog.content}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100/70 pt-4 dark:border-slate-700">
                      <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                          {blog.author?.firstName?.charAt(0) || <FiUser />}
                        </span>
                        <span>
                          {blog.author?.firstName} {blog.author?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleLike(blog._id)}
                          className={`inline-flex items-center gap-1 transition ${liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
                        >
                          <FiHeart className={liked ? 'fill-current' : ''} /> {blog.likes?.length || 0}
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                          <FiMessageSquare /> {blog.comments?.length || 0}
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                          <FiBookmark />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </section>

        <aside className="space-y-4">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Trending Today" subtitle="Most engaged reads this week." />
            <div className="space-y-3">
              {trending.map((blog) => (
                <Link key={blog._id} to={`/blogs/${blog._id}`} className="block rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{blog.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(blog.createdAt || Date.now()), 'MMM d')} • {(blog.likes?.length || 0) + 10} reactions
                  </p>
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Creator Leaderboard" />
            <div className="space-y-2">
              {[
                { name: 'Ava Shah', posts: 14 },
                { name: 'Rohan Mehta', posts: 11 },
                { name: 'Meera Patel', posts: 9 },
              ].map((creator, idx) => (
                <div
                  key={creator.name}
                  className="flex items-center justify-between rounded-xl border border-indigo-100/70 px-3 py-2 text-sm dark:border-slate-700"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    #{idx + 1} {creator.name}
                  </p>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-300">
                    <FiTrendingUp /> {creator.posts}
                  </span>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </aside>
      </div>
    </Layout>
  );
}

export default KnowledgeBase;
