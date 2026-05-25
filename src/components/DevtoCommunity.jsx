import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Heart, MessageSquare, User, RefreshCw, AlertCircle } from "lucide-react";

const DEVTO_BASE = "https://dev.to/api/articles";
const TAG_MAP = {
  All:          "devops",
  Architecture: "softwarearchitecture",
  Database:     "database",
  DevOps:       "devops",
  Security:     "security",
  Frontend:     "webdev",
  Performance:  "performance",
};
const PER_PAGE = 4;

function ArticleSkeleton() {
  return (
    <div className="p-4 border-b border-slate-800/50 animate-pulse">
      <div className="h-3 bg-slate-800 rounded w-5/6 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-full mb-3" />
      <div className="flex gap-4">
        <div className="h-2.5 bg-slate-800/60 rounded w-16" />
        <div className="h-2.5 bg-slate-800/60 rounded w-12" />
      </div>
    </div>
  );
}

export default function DevtoCommunity({ activeTag = "All" }) {
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tag = TAG_MAP[activeTag] || TAG_MAP.All;

  useEffect(() => {
    if (articles[tag]) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`${DEVTO_BASE}?tag=${tag}&per_page=${PER_PAGE}&top=7`)
      .then(r => { if (!r.ok) throw new Error("Dev.to unreachable"); return r.json(); })
      .then(data => {
        setArticles(prev => ({ ...prev, [tag]: data }));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [tag]);

  const current = articles[tag] || [];

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-[10px]">D</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">From the Community</h2>
            <p className="text-xs text-slate-500">
              Live from <span className="text-cyan-400 font-semibold">Dev.to</span> · {activeTag !== "All" ? `#${tag}` : "top articles"}
            </p>
          </div>
        </div>
        <a
          href={`https://dev.to/t/${tag}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          View all <ExternalLink size={11} />
        </a>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden animate-pulse">
              <div className="h-2 bg-gradient-to-r from-slate-700 to-slate-600" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
                <div className="h-2.5 bg-slate-800/60 rounded w-1/2 mt-3" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 border border-slate-800 rounded-2xl text-center">
            <AlertCircle size={24} className="text-amber-400 mb-2" />
            <p className="text-sm text-slate-400">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {current.map((article, i) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden hover:border-cyan-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col"
              >
                {/* Top accent */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-500" />
                <div className="p-4 flex flex-col flex-grow">
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={article.user?.profile_image_90 || `https://api.dicebear.com/8.x/avataaars/svg?seed=${article.user?.username}`}
                      alt={article.user?.name}
                      className="w-6 h-6 rounded-full border border-slate-700"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold truncate">
                      {article.user?.name || article.user?.username}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 leading-snug line-clamp-3 flex-grow transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Heart size={9} className="text-rose-400" />
                      {article.positive_reactions_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={9} className="text-cyan-500/70" />
                      {article.comments_count}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
                      <ExternalLink size={9} />
                      <span>Dev.to</span>
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
