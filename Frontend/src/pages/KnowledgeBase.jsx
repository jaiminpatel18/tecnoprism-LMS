import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiBookOpen, FiClock, FiHeart, FiMessageSquare, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';

function KnowledgeBase() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBlogs();
  }, [token]);

  const fetchBlogs = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/blogs', config);
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/blogs/${blogId}/like`, {}, config);
      
      // Toggle locally to save a fetch
      setBlogs(blogs.map(blog => {
        if (blog._id === blogId) {
          const liked = blog.likes.includes(user._id);
          const newLikes = liked 
            ? blog.likes.filter(id => id !== user._id)
            : [...blog.likes, user._id];
          return { ...blog, likes: newLikes };
        }
        return blog;
      }));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  return (
    <Layout 
      title="Knowledge Base" 
      subtitle="Read articles, tutorials, and company updates shared by your peers."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiBookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No articles available</h3>
          <p className="text-gray-500 mt-2">Become the first to share knowledge with the team!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {blogs.map((blog, idx) => {
             const isLiked = user && blog.likes.includes(user._id);
             return (
              <motion.div 
                key={blog._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-gray-400 font-bold overflow-hidden">
                      <FiBookOpen className="w-16 h-16 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {blog.tags?.slice(0,2).map(tag => (
                      <span key={tag} className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-gray-800 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {/* Render raw text for simplicity right now */}
                    {blog.content}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {blog.author?.profilePicture ? (
                          <img src={blog.author.profilePicture} alt="author" className="w-full h-full object-cover" />
                        ) : (
                          blog.author?.firstName?.charAt(0) || <FiUser />
                        )}
                      </div>
                      <span className="font-medium truncate max-w-[100px]">
                        {blog.author?.firstName} {blog.author?.lastName}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleLike(blog._id)} 
                        className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <FiHeart className={isLiked ? 'fill-current' : ''} /> 
                        <span>{blog.likes.length}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors">
                        <FiMessageSquare /> 
                        <span>{blog.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
             );
          })}
        </div>
      )}
    </Layout>
  );
}

export default KnowledgeBase;