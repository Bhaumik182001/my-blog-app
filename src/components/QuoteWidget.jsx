import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, AlertCircle } from "lucide-react";

const CACHE_KEY = "engblog_quote_cache";
const CACHE_DATE_KEY = "engblog_quote_date";

export default function QuoteWidget() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async (force = false) => {
    // Use sessionStorage cache (once per browser session unless forced)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached && !force) {
      try {
        setQuote(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {}
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.quotable.io/random?tags=technology|science|inspirational|education&maxLength=180"
      );
      if (!res.ok) throw new Error("Quotable API unreachable");
      const data = await res.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setQuote(data);
    } catch (e) {
      // Fallback hardcoded quotes
      const fallbacks = [
        { content: "The function of good software is to make the complex appear simple.", author: "Grady Booch" },
        { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
        { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
      ];
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setQuote(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuote(); }, []);

  return (
    <div className="relative bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 overflow-hidden">
      {/* Decorative quote icon */}
      <div className="absolute top-3 right-4 opacity-10 pointer-events-none">
        <Quote size={48} className="text-indigo-400" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Quote size={13} className="text-indigo-400" />
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Quote of the Day</span>
        </div>
        <button
          onClick={() => fetchQuote(true)}
          disabled={loading}
          className="text-indigo-400/60 hover:text-indigo-400 transition-colors disabled:opacity-40"
          title="New quote"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 animate-pulse"
          >
            <div className="h-3 bg-indigo-500/20 rounded w-full" />
            <div className="h-3 bg-indigo-500/20 rounded w-5/6" />
            <div className="h-3 bg-indigo-500/20 rounded w-3/4" />
            <div className="h-2.5 bg-indigo-500/10 rounded w-1/3 mt-2" />
          </motion.div>
        ) : (
          <motion.div
            key={quote?.content}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-slate-300 leading-relaxed italic font-medium relative z-10">
              "{quote?.content}"
            </p>
            <p className="text-xs text-indigo-400 font-bold mt-2 not-italic">
              — {quote?.author}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
