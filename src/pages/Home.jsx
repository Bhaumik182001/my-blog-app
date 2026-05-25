import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import FeaturedPost from "../components/FeaturedPost";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ArticleCard from "../components/ArticleCard";
import TrendingSidebar from "../components/TrendingSidebar";
import NewsletterSignup from "../components/NewsletterSignup";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import HackerNewsFeed from "../components/HackerNewsFeed";
import GitHubTrending from "../components/GitHubTrending";
import QuoteWidget from "../components/QuoteWidget";
import DevtoCommunity from "../components/DevtoCommunity";
import { HelpCircle, PenTool, FileText, Heart, MessageCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCanvas from "../components/HeroCanvas";
import FocusTimer from "../components/FocusTimer";

export default function Home() {
  const { state, dispatch, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // State for writing/editing
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // State for confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  // States for ticking counters
  const [stats, setStats] = useState({ posts: 0, likes: 0, comments: 0 });

  // Calculate live targets
  const totalPostsCount = state.posts.length;
  const totalLikesCount = state.posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalCommentsCount = Object.values(state.comments).reduce(
    (acc, curr) => acc + curr.reduce((sum, c) => sum + 1 + (c.replies ? c.replies.length : 0), 0),
    0
  );

  useEffect(() => {
    // Tick counters up to live targets on load
    const duration = 1000; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setStats({
        posts: Math.min(totalPostsCount, Math.round((totalPostsCount / steps) * stepCount)),
        likes: Math.min(totalLikesCount, Math.round((totalLikesCount / steps) * stepCount)),
        comments: Math.min(totalCommentsCount, Math.round((totalCommentsCount / steps) * stepCount))
      });

      if (stepCount >= steps) {
        clearInterval(timer);
        // Ensure exact target numbers
        setStats({
          posts: totalPostsCount,
          likes: totalLikesCount,
          comments: totalCommentsCount
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [totalPostsCount, totalLikesCount, totalCommentsCount]);

  // Find the featured post (fallback to first post if none flagged)
  const featuredPost = state.posts.find(p => p.featured) || state.posts[0];
  const regularPosts = state.posts.filter(p => p.id !== featuredPost?.id);

  // Filter & Search regular posts
  const filteredPosts = regularPosts.filter((post) => {
    const matchesTag = activeTag === "All" || post.tag === activeTag;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeleteRequest = (postId) => {
    setDeletePostId(postId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletePostId) {
      dispatch({ type: "DELETE_POST", payload: deletePostId });
      showToast("Article deleted permanently", "info");
      setDeletePostId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-16">
      {/* Hero Header Section */}
      <section className="text-center max-w-4xl mx-auto relative pt-16">
        {/* Interactive Particle Canvas Backdrop */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <HeroCanvas />
        </div>
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 relative"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-slate-900/80 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-400 shadow-sm shadow-cyan-500/10 backdrop-blur-sm"
          >
            <Zap size={11} className="fill-cyan-400" />
            <span>EngBlog Hub · Full-Stack Interactive Demo</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-100 to-slate-500">
              Engineering
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              at Scale
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Deep architecture reviews, post-mortems, and cloud platform tutorials written by engineers building resilient distributed software.
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setEditingPost(null); setIsEditorOpen(true); }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 text-sm"
            >
              <PenTool size={15} />
              <span>Write a Post</span>
            </motion.button>
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="px-6 py-3 bg-slate-900/60 border border-slate-800 text-slate-400 font-semibold rounded-xl text-sm backdrop-blur-sm cursor-default"
            >
              CRUD · Likes · Comments · Bookmarks
            </motion.span>
          </div>
        </motion.div>

        {/* Dynamic Counters Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-px max-w-lg mx-auto mt-14 bg-slate-800/50 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl"
        >
          <div className="bg-slate-900/60 text-center py-5 px-4 hover:bg-slate-900/80 transition-colors">
            <FileText size={16} className="mx-auto mb-1.5 text-slate-500" />
            <span className="block text-2xl md:text-3xl font-black text-slate-100 font-mono tabular-nums">
              {stats.posts}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Articles
            </span>
          </div>
          <div className="bg-slate-900/60 text-center py-5 px-4 hover:bg-slate-900/80 transition-colors">
            <Heart size={16} className="mx-auto mb-1.5 text-rose-500/70" />
            <span className="block text-2xl md:text-3xl font-black text-rose-400 font-mono tabular-nums">
              {stats.likes}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Likes
            </span>
          </div>
          <div className="bg-slate-900/60 text-center py-5 px-4 hover:bg-slate-900/80 transition-colors">
            <MessageCircle size={16} className="mx-auto mb-1.5 text-cyan-500/70" />
            <span className="block text-2xl md:text-3xl font-black text-cyan-400 font-mono tabular-nums">
              {stats.comments}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Comments
            </span>
          </div>
        </motion.div>
      </section>

      {/* Featured Article Card */}
      {featuredPost && (
        <section className="relative z-10">
          <FeaturedPost post={featuredPost} />
        </section>
      )}

      {/* Filter / Search and Main feed Grid */}
      <section className="space-y-8 pt-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-800/80 pb-6">
          <div className="w-full md:w-auto">
            <CategoryFilter activeTag={activeTag} setActiveTag={setActiveTag} />
          </div>
          <div className="w-full md:max-w-xs">
            <SearchBar />
          </div>
        </div>

        {/* Dual Layout Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Feed Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
                <span>All Articles</span>
                {activeTag !== "All" && (
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-normal">
                    {activeTag}
                  </span>
                )}
              </h2>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {filteredPosts.length} matches
              </span>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      onEditClick={handleEdit}
                      onDeleteClick={handleDeleteRequest}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-slate-900/10">
                <HelpCircle size={48} className="text-slate-700 stroke-[1.5] mb-3" />
                <h4 className="text-slate-350 font-bold mb-1">No articles found</h4>
                <p className="text-slate-500 text-xs text-center max-w-xs">
                  Try checking your spelling or adjusting your category tag filter parameters.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <TrendingSidebar />
            <FocusTimer />
            <QuoteWidget />
            <HackerNewsFeed />
            <GitHubTrending />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative pt-6">
        <NewsletterSignup />
      </section>

      {/* Dev.to Community Posts */}
      <section className="pt-4">
        <DevtoCommunity activeTag={activeTag} />
      </section>

      {/* Editor Modal Overlay */}
      <PostEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        editingPost={editingPost}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this engineering post? It will be removed permanently from your local workspace state feed."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
