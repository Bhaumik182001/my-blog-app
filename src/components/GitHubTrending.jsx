import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, ExternalLink, RefreshCw, AlertCircle, Circle } from "lucide-react";

const TABS = [
  { label: "DevOps",        query: "topic:devops+topic:cicd" },
  { label: "Architecture",  query: "topic:microservices+topic:distributed-systems" },
  { label: "Frontend",      query: "topic:react+topic:typescript" },
];

const langColors = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f1e05a",
  Go:          "#00ADD8",
  Python:      "#3572A5",
  Rust:        "#dea584",
  Java:        "#b07219",
  "C++":       "#f34b7d",
  Shell:       "#89e051",
  Dockerfile:  "#384d54",
  Kotlin:      "#A97BFF",
};

function SkeletonCard() {
  return (
    <div className="p-3 border border-slate-800/60 rounded-xl animate-pulse space-y-2">
      <div className="h-3 bg-slate-800 rounded w-3/4" />
      <div className="h-2.5 bg-slate-800/60 rounded w-full" />
      <div className="flex gap-3">
        <div className="h-2.5 bg-slate-800/60 rounded w-12" />
        <div className="h-2.5 bg-slate-800/60 rounded w-10" />
      </div>
    </div>
  );
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

export default function GitHubTrending() {
  const [activeTab, setActiveTab] = useState(0);
  const [repos, setRepos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepos = async (tabIdx) => {
    const q = TABS[tabIdx].query;
    if (repos[tabIdx]) return; // cached
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=4`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error("GitHub API limit reached");
      const data = await res.json();
      setRepos(prev => ({ ...prev, [tabIdx]: data.items }));
    } catch (e) {
      setError(e.message || "Could not fetch repos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(activeTab);
  }, [activeTab]);

  const currentRepos = repos[activeTab] || [];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-slate-200 rounded flex items-center justify-center">
            <span className="text-slate-950 font-black text-[10px]">GH</span>
          </div>
          <span className="text-sm font-bold text-slate-200">GitHub Trending</span>
        </div>
        <button
          onClick={() => {
            setRepos(prev => { const n = {...prev}; delete n[activeTab]; return n; });
            fetchRepos(activeTab);
          }}
          disabled={loading}
          className="text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/60 bg-slate-950/20">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === i ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
            {activeTab === i && (
              <motion.div
                layoutId="gh-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="p-3 space-y-2.5">
        {loading && !currentRepos.length ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle size={22} className="text-amber-400 mb-2" />
            <p className="text-xs text-slate-400">{error}</p>
            <p className="text-[10px] text-slate-600 mt-1">GitHub API: 60 req/hr unauthenticated</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5"
            >
              {currentRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-slate-800/60 rounded-xl hover:border-cyan-500/20 hover:bg-slate-800/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors leading-snug line-clamp-1">
                      {repo.full_name}
                    </p>
                    <ExternalLink size={11} className="text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                  </div>
                  {repo.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-600">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <Circle
                          size={8}
                          style={{ color: langColors[repo.language] || "#8888aa" }}
                          className="fill-current"
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={9} className="text-amber-400" />
                      {fmtNum(repo.stargazers_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={9} />
                      {fmtNum(repo.forks_count)}
                    </span>
                  </div>
                </a>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
