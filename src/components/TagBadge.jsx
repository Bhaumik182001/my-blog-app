import React from "react";
import { Link } from "react-router-dom";

const tagColors = {
  Architecture: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  Database: "bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20",
  DevOps: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  Security: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  Frontend: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
  Performance: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  Default: "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
};

export default function TagBadge({ tag, clickable = true }) {
  const colorClass = tagColors[tag] || tagColors.Default;
  const classes = `inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors ${colorClass}`;

  if (clickable) {
    return (
      <Link to={`/categories/${tag}`} className={classes}>
        {tag}
      </Link>
    );
  }

  return <span className={classes}>{tag}</span>;
}
