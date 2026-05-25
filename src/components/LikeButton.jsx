import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

export default function LikeButton({ postId, likes = 0, likedByMe = false, showCount = true, size = 20 }) {
  const { dispatch, showToast } = useApp();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TOGGLE_LIKE", payload: postId });
    if (!likedByMe) {
      showToast("Post liked!", "success");
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 group focus:outline-none transition-colors ${
        likedByMe ? "text-rose-500" : "text-slate-500 hover:text-rose-400"
      }`}
      aria-label="Like post"
    >
      <motion.span
        whileTap={{ scale: 1.4 }}
        animate={{ scale: likedByMe ? [1, 1.25, 1] : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="flex items-center justify-center"
      >
        <Heart
          size={size}
          fill={likedByMe ? "currentColor" : "none"}
          className={`transition-colors duration-300 ${
            likedByMe ? "drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]" : ""
          }`}
        />
      </motion.span>
      {showCount && (
        <span className="text-sm font-semibold transition-colors duration-200">
          {likes}
        </span>
      )}
    </button>
  );
}
