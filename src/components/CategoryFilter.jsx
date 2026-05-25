import React from "react";

const tags = ["All", "Architecture", "Database", "DevOps", "Security", "Frontend", "Performance"];

export default function CategoryFilter({ activeTag, setActiveTag }) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center py-2">
      {tags.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-transparent shadow-lg shadow-cyan-500/15 scale-105"
                : "bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
