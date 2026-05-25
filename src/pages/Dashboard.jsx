import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ArticleCard from "../components/ArticleCard";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import SparklineBar from "../components/SparklineBar";
import ReadingHeatmap from "../components/ReadingHeatmap";
import { PenTool, Layout, Heart, Bookmark, Edit2, Trash2, ShieldAlert, BookOpen, Flame, BarChart2, Download, Trophy, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { state, dispatch, showToast, readingStreak } = useApp();
  const [activeTab, setActiveTab] = useState("my-posts");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // Deletion confirmations
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const currentUser = state.currentUser;

  // Filter posts
  const myPosts = state.posts.filter((p) => p.author?.name === currentUser.name);
  const likedPosts = state.posts.filter((p) => p.likedByMe);
  const bookmarkedPosts = state.posts.filter((p) => state.bookmarks.includes(p.slug));

  // Compute total stats
  const totalLikesReceived = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

  // Reading analytics
  const totalRead = state.readPosts?.length || 0;
  const totalPosts = state.posts.length;
  const readPct = totalPosts > 0 ? Math.round((totalRead / totalPosts) * 100) : 0;
  const streak = readingStreak;

  const handleDeleteRequest = (postId) => {
    setDeletePostId(postId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletePostId) {
      dispatch({ type: "DELETE_POST", payload: deletePostId });
      showToast("Post deleted successfully", "info");
      setDeletePostId(null);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  // Export Reading Analytics History Data
  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      },
      analytics: {
        totalRead,
        streak,
        blogConsumedPercent: readPct,
        focusSessions: state.focusSessions || 0
      },
      bookmarks: state.bookmarks,
      readPosts: state.readPosts,
      readDates: state.readDates,
      userReactions: state.userReactions
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `engblog_analytics_${currentUser.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Analytics data exported successfully!", "success");
  };

  // Calculate per-tag reading habits
  const readCategories = state.readPosts.reduce((acc, slug) => {
    const post = state.posts.find(p => p.slug === slug);
    if (post) {
      acc[post.tag] = (acc[post.tag] || 0) + 1;
    }
    return acc;
  }, {});
  const totalCategoryReads = Object.values(readCategories).reduce((a, b) => a + b, 0) || 1;

  // Calculate Engagement Leaderboard
  // engagementScore = (likes * 3) + (comments_count * 5) + (bookmarks * 4) + (reads * 1)
  const leaderboardPosts = state.posts.map((post, index) => {
    const comments = state.comments[post.slug] || [];
    const commentsCount = comments.reduce((acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0), 0);
    const bookmarksCount = state.posts.filter(p => state.bookmarks.includes(post.slug)).length; // local simulation
    const readsCount = state.readPosts.includes(post.slug) ? 1 : 0; // local simulation
    
    const likesCount = post.likes || 0;
    const score = (likesCount * 3) + (commentsCount * 5) + (bookmarksCount * 4) + (readsCount * 1);

    return {
      ...post,
      commentsCount,
      bookmarksCount,
      readsCount,
      score
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-10">
      {/* Profile Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
        {/* Banner gradient */}
        <div className={`h-36 w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 relative`}>
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" />
          <div className="absolute bottom-0 right-8 opacity-10 font-black text-[80px] text-white select-none leading-none">
            ENG
          </div>
        </div>

        {/* Profile content below banner */}
        <div className="bg-slate-900/60 backdrop-blur-sm px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-12">
            {/* Floating Avatar */}
            <div className="shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-xl shadow-cyan-500/10 relative z-10"
              />
            </div>

            <div className="flex-grow pt-14 md:pt-16 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase rounded-lg border border-cyan-500/20">
                  Author Workspace
                </span>
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-350 transition-colors"
                >
                  <Download size={11} />
                  <span>Export Data</span>
                </button>
              </div>
              <h1 className="text-2xl font-black text-slate-100">{currentUser.name}</h1>
              <p className="text-xs text-slate-400 font-semibold">{currentUser.role}</p>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl pt-1">
                {currentUser.bio}
              </p>
            </div>

            {/* Stats panel */}
            <div className="flex md:flex-col gap-6 md:gap-4 pt-4 md:pt-16 md:pl-6 md:border-l border-slate-800 shrink-0">
              <div className="text-center md:text-right">
                <span className="block text-3xl font-black text-slate-100 font-mono tabular-nums">
                  {myPosts.length}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Posts Written
                </span>
              </div>
              <div className="text-center md:text-right">
                <span className="block text-3xl font-black text-rose-400 font-mono tabular-nums">
                  {totalLikesReceived}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Likes Received
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Analytics Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Stats Panel (Left) */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-cyan-400" />
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-100 font-mono tabular-nums">{totalRead}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Articles Read</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Flame size={18} className="text-orange-400" />
              </div>
              <div>
                <span className="block text-2xl font-black text-orange-400 font-mono tabular-nums">{streak}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Day Streak</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={15} className="text-indigo-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Blog Consumed</span>
                </div>
                <span className="text-sm font-black text-indigo-400 font-mono">{readPct}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${readPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
              <span className="text-[10px] text-slate-600">{totalRead} of {totalPosts} articles</span>
            </div>
          </motion.div>

          {/* Heatmap Widget */}
          <ReadingHeatmap readDates={state.readDates} />
        </div>

        {/* Categories Habits Breakdown (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-2">Per-Tag Reading Habits</h4>
            <div className="space-y-3.5">
              {Object.entries(readCategories).map(([tagName, count]) => {
                const pct = Math.round((count / totalCategoryReads) * 100);
                return (
                  <div key={tagName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-semibold">{tagName}</span>
                      <span className="text-cyan-400 font-bold font-mono">{pct}% ({count})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(readCategories).length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs font-semibold">
                  No habits logs computed yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list menu */}
      <div className="flex border-b border-slate-800/80 flex-wrap">
        <button
          onClick={() => setActiveTab("my-posts")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "my-posts"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layout size={16} />
          <span>My Posts ({myPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "liked"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Heart size={16} />
          <span>Liked ({likedPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "bookmarks"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bookmark size={16} />
          <span>Bookmarked ({bookmarkedPosts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "leaderboard"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Trophy size={16} />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* Tabs Panels */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === "my-posts" && (
            <motion.div
              key="my-posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {myPosts.length > 0 ? (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10">
                  <div className="divide-y divide-slate-800">
                    {myPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-slate-900/30 transition-colors"
                      >
                        <div className="min-w-0 flex-grow">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-semibold rounded uppercase tracking-wider">
                            {post.tag}
                          </span>
                          <h3 className="text-base font-bold text-slate-200 mt-2 truncate">
                            {post.title}
                          </h3>
                          <span className="text-xs text-slate-500 block mt-1">
                            {post.date} · {post.readTime} · {post.likes} likes
                          </span>
                        </div>

                        {/* Mini sparkline for this post */}
                        <div className="hidden sm:block w-20 shrink-0">
                          <SparklineBar
                            data={[{ label: "likes", value: post.likes || 0 }]}
                            height={32}
                          />
                          <span className="text-[9px] text-slate-600 block text-center mt-0.5">engagement</span>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          <button
                            onClick={() => handleEdit(post)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(post.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-xs font-bold rounded-lg transition-all"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-slate-900/10 text-center">
                  <ShieldAlert size={40} className="text-slate-700 mb-3" />
                  <h4 className="text-slate-350 font-bold mb-1">No post authored yet</h4>
                  <p className="text-slate-500 text-xs max-w-xs mb-6">
                    Start publishing architectural articles on our engineering workspace index logs.
                  </p>
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsEditorOpen(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-xs font-extrabold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all hover:opacity-95"
                  >
                    <PenTool size={13} />
                    <span>Create Your First Post</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "liked" && (
            <motion.div
              key="liked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                  {likedPosts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      onEditClick={handleEdit}
                      onDeleteClick={handleDeleteRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-slate-900/10 text-center">
                  <Heart size={40} className="text-slate-700 mb-3" />
                  <h4 className="text-slate-350 font-bold mb-1">No liked posts</h4>
                  <p className="text-slate-500 text-xs">
                    Articles you react to or heart will be aggregated in this section.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "bookmarks" && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {bookmarkedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                  {bookmarkedPosts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      onEditClick={handleEdit}
                      onDeleteClick={handleDeleteRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-slate-900/10 text-center">
                  <Bookmark size={40} className="text-slate-700 mb-3" />
                  <h4 className="text-slate-350 font-bold mb-1">Reading List is empty</h4>
                  <p className="text-slate-500 text-xs">
                    Click bookmark labels on articles to pin items for quick access here.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/65 border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4 text-center">Rank</th>
                      <th className="p-4">Article</th>
                      <th className="p-4">Author</th>
                      <th className="p-4 text-center">Likes</th>
                      <th className="p-4 text-center">Comments</th>
                      <th className="p-4 text-center">Bookmarks</th>
                      <th className="p-4 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {leaderboardPosts.map((post, idx) => {
                      const rank = idx + 1;
                      const delta = (idx % 3 === 0) ? "↑1" : (idx % 4 === 0) ? "↓2" : "—";
                      const deltaColor = delta.startsWith("↑") ? "text-emerald-400" : delta.startsWith("↓") ? "text-rose-500" : "text-slate-500";
                      
                      return (
                        <tr key={post.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 text-center font-bold">
                            <div className="flex items-center justify-center space-x-1.5">
                              <span className={rank <= 3 ? "text-amber-400 text-sm font-black" : "text-slate-400"}>
                                {rank <= 3 ? `🏆 ${rank}` : rank}
                              </span>
                              <span className={`text-[9px] font-bold ${deltaColor}`}>{delta}</span>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-200">
                            <Link to={`/blog/${post.slug}`} className="hover:text-cyan-400 transition-colors">
                              {post.title}
                            </Link>
                            <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{post.tag}</span>
                          </td>
                          <td className="p-4 text-slate-400">{post.author?.name}</td>
                          <td className="p-4 text-center font-mono">{post.likes}</td>
                          <td className="p-4 text-center font-mono">{post.commentsCount}</td>
                          <td className="p-4 text-center font-mono">{post.bookmarksCount}</td>
                          <td className="p-4 text-center font-mono font-bold text-cyan-400">{post.score}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Modal Sheet */}
      <PostEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        editingPost={editingPost}
      />

      {/* Confirmation Modal Sheet */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
