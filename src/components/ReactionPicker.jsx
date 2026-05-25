import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, Flame, Lightbulb, Zap, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJI_META = {
  heart:     { emoji: "❤️", label: "Love", color: "text-rose-400" },
  fire:      { emoji: "🔥", label: "Hot", color: "text-orange-400" },
  idea:      { emoji: "💡", label: "Smart", color: "text-yellow-400" },
  mindblown: { emoji: "🤯", label: "Wow", color: "text-purple-400" },
  clap:      { emoji: "👏", label: "Clap", color: "text-emerald-400" }
};

export default function ReactionPicker({ postSlug }) {
  const { state, dispatch } = useApp();
  const [showPicker, setShowPicker] = useState(false);

  const post = state.posts.find(p => p.slug === postSlug);
  if (!post) return null;

  const reactions = post.reactions || { heart: 0, fire: 0, idea: 0, mindblown: 0, clap: 0 };
  const myReactions = state.userReactions[postSlug] || {
    heart: false, fire: false, idea: false, mindblown: false, clap: false
  };

  const handleToggle = (type) => {
    dispatch({
      type: "TOGGLE_REACTION",
      payload: { postSlug, reactionType: type }
    });
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div className="relative flex flex-col items-center">
      {/* Primary Toggle Button */}
      <button
        onMouseEnter={() => setShowPicker(true)}
        onClick={() => setShowPicker(!showPicker)}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
          Object.values(myReactions).some(Boolean)
            ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
        }`}
      >
        <motion.span whileTap={{ scale: 0.8 }} className="text-lg">
          {myReactions.heart ? "❤️" : myReactions.fire ? "🔥" : myReactions.idea ? "💡" : "❤️"}
        </motion.span>
      </button>
      
      <span className="text-[10px] font-extrabold text-slate-500 mt-1.5 font-mono">
        {totalReactions}
      </span>

      {/* Floating Reaction Bar Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            onMouseLeave={() => setShowPicker(false)}
            className="absolute bottom-16 bg-slate-950/95 border border-slate-800 rounded-full px-3 py-2 flex items-center space-x-2.5 shadow-2xl backdrop-blur-md z-30"
          >
            {Object.entries(EMOJI_META).map(([type, meta]) => {
              const active = myReactions[type];
              return (
                <button
                  key={type}
                  onClick={() => {
                    handleToggle(type);
                    setShowPicker(false);
                  }}
                  className={`text-xl hover:scale-130 active:scale-95 transition-transform duration-150 flex flex-col items-center relative ${
                    active ? "filter drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]" : ""
                  }`}
                  title={meta.label}
                >
                  <span>{meta.emoji}</span>
                  {active && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Reactions Counts grid under the picker button */}
      <div className="flex flex-col items-center gap-1 mt-4">
        {Object.entries(reactions).map(([type, count]) => {
          if (count === 0) return null;
          const active = myReactions[type];
          return (
            <button
              key={type}
              onClick={() => handleToggle(type)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold transition ${
                active 
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" 
                  : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300"
              }`}
            >
              <span>{EMOJI_META[type]?.emoji}</span>
              <span className="font-mono">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
