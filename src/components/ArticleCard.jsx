import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Edit2, Trash2, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import TagBadge from "./TagBadge";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";

export default function ArticleCard({ post, onEditClick, onDeleteClick }) {
  const { state } = useApp();
  const comments = state.comments[post.slug] || [];
  const commentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  const isOwner = post.author?.name === state.currentUser.name;
  const isRead = state.readPosts?.includes(post.slug);

  // 3D Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Max tilt is 8 degrees
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease-out, box-shadow 0.3s, border-color 0.3s"
      }}
      className="group bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:bg-slate-900/70 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full relative"
    >
      {/* Cover gradient thumbnail */}
      <div className={`relative h-28 w-full bg-gradient-to-br ${post.coverGradient || "from-cyan-500 to-blue-500"} overflow-hidden shrink-0`}>
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors duration-500" />
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <TagBadge tag={post.tag} />
            {post.likes >= 10 && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase rounded-full border border-amber-500/30">
                🔥 Hot
              </span>
            )}
            {post.id.startsWith("post-") && parseInt(post.id.split("-")[1]) > Date.now() - 1000 * 60 * 60 && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase rounded-full border border-emerald-500/30 animate-pulse">
                New
              </span>
            )}
          </div>
          <BookmarkButton slug={post.slug} size={16} />
          {isRead && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-[9px] font-bold ml-1">
              <CheckCircle size={9} />
              Read
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/blog/${post.slug}`} className="block group-hover:text-cyan-400 transition-colors mb-2">
          <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Author / Date / Info */}
        <div className="flex items-center space-x-3 mb-4 pt-4 border-t border-slate-800/80">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="w-8 h-8 rounded-full bg-slate-800"
          />
          <div className="min-w-0">
            <span className="block text-xs font-bold text-slate-300 truncate">
              {post.author?.name}
            </span>
            <span className="block text-[10px] text-slate-500">{post.date}</span>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center space-x-3">
              <LikeButton postId={post.id} likes={post.likes} likedByMe={post.likedByMe} size={18} />
              <span className="flex items-center space-x-1">
                <MessageSquare size={16} className="text-cyan-500/80" />
                <span className="font-semibold">{commentsCount}</span>
              </span>
              <ShareButton post={post} compact />
            </div>

          {/* Edit/Delete actions for own posts */}
          {isOwner ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEditClick(post);
                }}
                className="p-1.5 bg-slate-950/60 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg border border-slate-800 transition-colors"
                title="Edit article"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteClick(post.id);
                }}
                className="p-1.5 bg-slate-950/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors"
                title="Delete article"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : (
            <Link
              to={`/blog/${post.slug}`}
              className="text-cyan-500 hover:text-cyan-400 font-semibold flex items-center group-hover:translate-x-1 transition-transform"
            >
              <span>Read</span>
              <ArrowRight size={14} className="ml-1" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
