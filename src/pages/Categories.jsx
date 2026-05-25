import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ArticleCard from "../components/ArticleCard";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import { Grid, ArrowLeft, ArrowRight, Layers, CircleDot, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const categoryMeta = {
  Architecture: {
    desc: "System design, micro-frontends, messaging queues and scaling structures.",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    color: "text-blue-400"
  },
  Database: {
    desc: "PostgreSQL, connection pools, indexes, performance tuning, and scaling write paths.",
    gradient: "from-cyan-600 to-teal-500",
    color: "text-teal-400"
  },
  DevOps: {
    desc: "Kubernetes clusters, CI/CD automated pipelines, Docker images, and configuration management.",
    gradient: "from-indigo-600 to-purple-600",
    color: "text-purple-400"
  },
  Security: {
    desc: "Web security measures, input validations, strict CSP protocols and identity checks.",
    gradient: "from-red-600 via-rose-600 to-amber-500",
    color: "text-rose-400"
  },
  Frontend: {
    desc: "React render cycles optimizations, styling systems, and client interfaces structure.",
    gradient: "from-sky-500 to-blue-500",
    color: "text-sky-400"
  },
  Performance: {
    desc: "Network speedups, memory leaks diagnostic audits, and sub-millisecond response rates.",
    gradient: "from-amber-500 to-orange-500",
    color: "text-amber-400"
  }
};

export default function Categories() {
  const { tag } = useParams();
  const { state, dispatch, showToast } = useApp();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  // Switch between Grid view and Bubble Chart view
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "bubbles"

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
      showToast("Post deleted successfully", "info");
      setDeletePostId(null);
    }
  };

  // If a tag is requested in URL params, render tag feed
  if (tag) {
    const filteredPosts = state.posts.filter(
      (p) => p.tag.toLowerCase() === tag.toLowerCase()
    );
    const meta = categoryMeta[tag] || {
      desc: "Engineering articles relating to tag topic logs.",
      gradient: "from-cyan-500 to-blue-600",
      color: "text-cyan-400"
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="space-y-2">
            <Link
              to="/categories"
              className="flex items-center text-slate-500 hover:text-cyan-400 text-xs font-bold transition"
            >
              <ArrowLeft size={14} className="mr-1" />
              Categories Overview
            </Link>
            <h1 className="text-3xl font-black text-slate-100 flex items-center space-x-3">
              <span className={meta.color}>{tag}</span>
              <span className="text-sm font-normal text-slate-500">
                ({filteredPosts.length} posts)
              </span>
            </h1>
            <p className="text-xs text-slate-400">{meta.desc}</p>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onEditClick={handleEdit}
                onDeleteClick={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 border border-slate-800 rounded-2xl bg-slate-900/10 text-center">
            <Layers size={40} className="text-slate-800 mb-3" />
            <h4 className="text-slate-300 font-bold mb-1">No articles in this category</h4>
            <p className="text-slate-500 text-xs">
              Be the first to author a writeup under {tag} category.
            </p>
          </div>
        )}

        {/* Editor Modal Sheet */}
        <PostEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingPost(null);
          }}
          editingPost={editingPost}
        />

        {/* Delete Confirm Sheet */}
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

  // Count items per category tag
  const categoryCounts = state.posts.reduce((acc, curr) => {
    acc[curr.tag] = (acc[curr.tag] || 0) + 1;
    return acc;
  }, {});

  const categoriesList = Object.keys(categoryMeta);
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-10">
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Grid className="text-cyan-400" size={28} />
          <div>
            <h1 className="text-3xl font-black text-slate-100">Categories</h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse our engineering publications catalog sorted by topic areas
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-slate-950 p-1 rounded-lg flex border border-slate-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 transition ${
              viewMode === "grid" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Grid size={13} />
            <span>Grid view</span>
          </button>
          <button
            onClick={() => setViewMode("bubbles")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 transition ${
              viewMode === "bubbles" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CircleDot size={13} />
            <span>Bubble chart</span>
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((catName) => {
            const meta = categoryMeta[catName];
            const count = categoryCounts[catName] || 0;

            return (
              <Link
                key={catName}
                to={`/categories/${catName}`}
                className="group relative bg-slate-900/40 border border-slate-800 p-6 rounded-2xl overflow-hidden hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48"
              >
                {/* Corner color band */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${meta.gradient} opacity-10 blur-xl group-hover:opacity-20 transition`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-black ${meta.color}`}>{catName}</h3>
                    <span className="text-[10px] bg-slate-800 font-extrabold uppercase text-slate-400 px-2 py-0.5 rounded-full border border-slate-750">
                      {count} articles
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {meta.desc}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-slate-500 hover:text-cyan-400 group-hover:text-cyan-400 transition pt-4">
                  <span>View Articles</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Bubble Chart View Mode */
        <div className="bg-slate-900/10 border border-slate-800/80 rounded-3xl p-8 lg:p-12 min-h-[450px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* Radial ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl relative z-10">
            {categoriesList.map((catName, idx) => {
              const meta = categoryMeta[catName];
              const count = categoryCounts[catName] || 0;
              // Size ranges from 120px to 190px
              const size = 125 + (count / maxCount) * 65;

              return (
                <motion.div
                  key={catName}
                  animate={{
                    y: [0, idx % 2 === 0 ? -10 : -6, 0],
                    x: [0, idx % 3 === 0 ? 5 : -5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + idx,
                    ease: "easeInOut"
                  }}
                >
                  <Link
                    to={`/categories/${catName}`}
                    style={{ width: `${size}px`, height: `${size}px` }}
                    className={`flex flex-col items-center justify-center rounded-full bg-slate-950/60 border border-slate-800 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/10 text-center p-4 transition-all duration-300 hover:scale-105 relative group overflow-hidden`}
                  >
                    {/* Ring highlight */}
                    <div className={`absolute inset-0.5 rounded-full bg-gradient-to-br ${meta.gradient} opacity-5 group-hover:opacity-15 transition-opacity`} />
                    <div className="absolute -inset-px rounded-full border border-white/5 group-hover:border-cyan-500/20 transition-colors pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center p-2">
                      <span className={`text-xs uppercase tracking-widest font-black leading-tight mb-1 text-center ${meta.color} group-hover:text-slate-100 transition-colors`}>
                        {catName}
                      </span>
                      <span className="text-[10px] bg-slate-900/90 text-slate-400 font-extrabold uppercase px-2 py-0.5 rounded-full border border-slate-800 select-none">
                        {count} {count === 1 ? "post" : "posts"}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
