import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ShareButton({ post, compact = false }) {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = `${window.location.origin}/blog/${post?.slug}`;
  const text = `"${post?.title}" — EngBlog Hub`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, text, url });
      } catch (e) {
        // User cancelled — do nothing
      }
    } else {
      setOpen(o => !o);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast("Could not copy — please copy the URL manually.", "error");
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  if (compact) {
    // Inline icon button for ArticleCard
    return (
      <button
        onClick={copyLink}
        title="Copy link"
        className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-500/5"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
      </button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 rounded-xl text-xs font-bold transition-all"
      >
        <Share2 size={14} />
        <span>Share</span>
      </motion.button>

      {/* Fallback dropdown (shown when Web Share API unavailable) */}
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute right-0 mt-2 w-48 bg-slate-900/98 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl z-30 overflow-hidden py-1"
        >
          <button
            onClick={copyLink}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-sky-400 transition-colors"
          >
            <ExternalLink size={13} />
            Share on X / Twitter
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-blue-400 transition-colors"
          >
            <ExternalLink size={13} />
            Share on LinkedIn
          </a>
        </motion.div>
      )}
    </div>
  );
}
