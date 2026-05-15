import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiArrowLeft, FiBookmark, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

function BlogArticle() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/blogs`, authConfig(token));
        setBlog((data.data || []).find((item) => item._id === id) || null);
      } catch (error) {
        console.error('Error fetching blog article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, token]);

  const paragraphs = useMemo(() => {
    if (!blog?.content) {
      return [];
    }
    const rough = blog.content.split('\n').filter(Boolean);
    return rough.length ? rough : [blog.content];
  }, [blog?.content]);

  if (loading) {
    return (
      <Layout title="Blog Article" subtitle="Loading article view.">
        <div className="premium-card h-80 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout title="Blog Article" subtitle="Could not find this article.">
        <EmptyState icon={FiMessageSquare} title="Article unavailable" description="This blog post may have been moved or deleted." />
      </Layout>
    );
  }

  return (
    <Layout title="Blog Article" subtitle="Readable, collaborative article experience with social actions.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="space-y-5">
          <SurfaceCard className="rounded-2xl p-5">
            <Link
              to="/blogs"
              className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
            >
              <FiArrowLeft /> Back to blogs
            </Link>
            {blog.coverImage ? (
              <img src={blog.coverImage} alt={blog.title} className="mb-5 h-72 w-full rounded-2xl object-cover" />
            ) : null}
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{blog.title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              By {blog.author?.firstName} {blog.author?.lastName}
            </p>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
              {paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-indigo-100/70 pt-4 dark:border-slate-700">
              <button type="button" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                <FiHeart className="mr-1 inline" /> Like
              </button>
              <button type="button" className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                <FiMessageSquare className="mr-1 inline" /> Comment
              </button>
              <button type="button" className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                <FiBookmark className="mr-1 inline" /> Bookmark
              </button>
              <button type="button" className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                <FiShare2 className="mr-1 inline" /> Share
              </button>
            </div>
          </SurfaceCard>
        </article>

        <aside className="space-y-4">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Comments" subtitle="Collaborative discussion thread." />
            <div className="space-y-3 text-sm">
              {['Great insights on practical execution.', 'Can we schedule a live breakdown for this topic?', 'Loved the examples and metrics.'].map(
                (comment) => (
                  <div key={comment} className="rounded-xl bg-slate-50 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {comment}
                  </div>
                ),
              )}
            </div>
          </SurfaceCard>
        </aside>
      </div>
    </Layout>
  );
}

export default BlogArticle;
