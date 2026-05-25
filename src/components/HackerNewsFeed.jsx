import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, TrendingUp, ThumbsUp, User, RefreshCw, AlertCircle } from "lucide-react";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const STORY_COUNT = 6;

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 p-3 animate-pulse">
      <div className="w-8 h-8 bg-slate-800 rounded-lg shrink-0" />
      <div className="flex-grow space-y-1.5">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-3/4" />
        <div className="h-2.5 bg-slate-800/60 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function HackerNewsFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const idsRes = await fetch(`${HN_BASE}/topstories.json`);
      const ids = await idsRes.json();
      const top = ids.slice(0, STORY_COUNT);
      const fetched = await Promise.all(
        top.map(id => fetch(`${HN_BASE}/item/${id}.json`).then(r => r.json()))
      );
      setStories(fetched.filter(s => s && s.title));
      setLastFetch(new Date());
    } catch (e) {
      setError("Could not reach Hacker News. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStories, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-black text-[9px]">Y</span>
          </div>
          <span className="text-sm font-bold text-slate-200">Hacker News Live</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase rounded-full animate-pulse">
            Live
          </span>
        </div>
        <button
          onClick={fetchStories}
          disabled={loading}
          className="text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Body */}
      <div className="divide-y divide-slate-800/40">
        {loading ? (
          Array.from({ length: STORY_COUNT }).map((_, i) => <SkeletonRow key={i} />)
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <AlertCircle size={24} className="text-rose-400 mb-2" />
            <p className="text-xs text-slate-400">{error}</p>
            <button
              onClick={fetchStories}
              className="mt-3 text-xs text-cyan-400 font-semibold hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {stories.map((story, i) => (
              <motion.a
                key={story.id}
                href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 hover:bg-slate-800/40 transition-colors group block"
              >
                {/* Rank badge */}
                <div className="w-7 h-7 bg-slate-800/80 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-orange-400 transition-colors shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 leading-snug line-clamp-2 transition-colors">
                    {story.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={9} />
                      {story.score}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={9} />
                      {story.by}
                    </span>
                  </div>
                </div>
                <ExternalLink size={11} className="text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
              </motion.a>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {lastFetch && !loading && (
        <div className="px-4 py-2 border-t border-slate-800/40 text-[10px] text-slate-600">
          Last updated {lastFetch.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
