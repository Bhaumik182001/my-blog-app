import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Flame, Heart, MessageSquare } from "lucide-react";

export default function TrendingSidebar() {
  const { state } = useApp();

  // Sort posts by likes descending and take top 3
  const trendingPosts = [...state.posts]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);

  return (
    <aside className="bg-slate-900/35 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md shadow-xl shadow-cyan-950/10 space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <Flame className="text-amber-500 animate-pulse" size={20} />
        <h3 className="text-lg font-bold text-slate-200">Hot Right Now</h3>
      </div>

      <div className="space-y-4">
        {trendingPosts.map((post, idx) => {
          const comments = state.comments[post.slug] || [];
          const commentsCount = comments.reduce(
            (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
            0
          );

          return (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-cyan-500/20 hover:bg-slate-900/60 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-500/70 transition-colors pt-0.5 font-mono">
                  0{idx + 1}
                </span>
                <div className="space-y-1.5 min-w-0 flex-grow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {post.tag}
                  </span>
                  <h4 className="text-sm font-bold text-slate-300 group-hover:text-slate-100 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center">
                      <Heart size={12} className="mr-1 text-rose-500/80 fill-rose-500/80" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare size={12} className="mr-1 text-cyan-500/80" />
                      {commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
