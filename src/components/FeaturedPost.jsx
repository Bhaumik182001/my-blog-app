import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import TagBadge from "./TagBadge";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

export default function FeaturedPost({ post }) {
  const { state } = useApp();
  if (!post) return null;

  const comments = state.comments[post.slug] || [];
  const commentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-slate-900/50 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl group hover:border-slate-700/70 transition-all duration-500"
    >
      {/* Ambient background glow */}
      <div className={`absolute top-0 right-0 w-full lg:w-2/3 h-full bg-gradient-to-br ${post.coverGradient || "from-cyan-500/20 to-blue-600/20"} opacity-15 blur-3xl group-hover:opacity-25 group-hover:scale-105 transition-all duration-700`} />

      {/* Dot-grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Gradient overlay from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-transparent z-10" />

      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        {/* Text Content */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          {/* Badges row */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-black tracking-wider uppercase rounded-full shadow-sm shadow-cyan-500/10">
              <Star size={9} className="fill-cyan-400" />
              <span>Featured Post</span>
            </span>
            <TagBadge tag={post.tag} />
          </div>

          <Link to={`/blog/${post.slug}`} className="group/title block mb-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 group-hover/title:text-cyan-300 leading-tight transition-colors duration-300">
              {post.title}
            </h2>
          </Link>

          <p className="text-slate-400 text-base leading-relaxed mb-8 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Stats pills row */}
          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-400 font-semibold backdrop-blur-sm">
              <Clock size={11} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-400 font-semibold backdrop-blur-sm">
              <MessageSquare size={11} className="text-cyan-500/80" />
              {commentsCount} comments
            </span>
          </div>

          {/* Author + actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/60">
            <div className="flex items-center space-x-3">
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                className="w-10 h-10 rounded-xl border-2 border-slate-800 shadow-md"
              />
              <div>
                <span className="block text-sm font-bold text-slate-200">
                  {post.author?.name}
                </span>
                <span className="block text-xs text-slate-500">{post.date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <LikeButton postId={post.id} likes={post.likes} likedByMe={post.likedByMe} />
              <BookmarkButton slug={post.slug} />
            </div>
          </div>
        </div>

        {/* Visual Cover Side */}
        <div className={`hidden lg:flex lg:col-span-5 relative bg-gradient-to-br ${post.coverGradient || "from-cyan-500 to-blue-600"} items-center justify-center p-10 border-l border-white/5`}>
          {/* Inner dim overlay */}
          <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]" />
          {/* Pattern */}
          <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

          <div className="relative text-center max-w-xs space-y-6">
            <span className="block text-[72px] font-black text-white/8 select-none leading-none tracking-tight">
              ENG
            </span>

            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center px-7 py-3.5 bg-white/95 hover:bg-cyan-300 text-slate-950 font-bold rounded-2xl shadow-xl transition-all duration-300 transform group-hover:scale-105 text-sm"
            >
              <span>Read Article</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
