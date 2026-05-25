import React from "react";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function BookmarkButton({ slug, size = 20 }) {
  const { state, dispatch, showToast } = useApp();
  const isBookmarked = state.bookmarks.includes(slug);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TOGGLE_BOOKMARK", payload: slug });
    showToast(
      isBookmarked ? "Removed from Reading List" : "Saved to Reading List",
      isBookmarked ? "info" : "success"
    );
  };

  return (
    <button
      onClick={handleBookmark}
      className={`focus:outline-none transition-colors ${
        isBookmarked ? "text-cyan-400" : "text-slate-500 hover:text-cyan-400"
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
    >
      <motion.span
        whileTap={{ scale: 1.3 }}
        animate={{ scale: isBookmarked ? [1, 1.2, 1] : 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
        className="flex items-center justify-center"
      >
        <Bookmark
          size={size}
          fill={isBookmarked ? "currentColor" : "none"}
          className={`transition-colors duration-300 ${
            isBookmarked ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" : ""
          }`}
        />
      </motion.span>
    </button>
  );
}
