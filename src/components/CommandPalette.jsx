import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ArrowRight, Sun, Moon, Sparkles, Layout, User, BookOpen } from "lucide-react";

export default function CommandPalette({ isOpen, onClose }) {
  const { state, switchUser, showToast } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  // Handle global escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Filter posts
  const filteredPosts = state.posts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    p.tag.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const navigations = [
    { name: "Go to Home", path: "/", icon: <Layout size={14} className="text-blue-400" /> },
    { name: "Go to Topics / Categories", path: "/categories", icon: <BookOpen size={14} className="text-purple-400" /> },
    { name: "Go to Dashboard", path: "/dashboard", icon: <Layout size={14} className="text-emerald-400" /> },
    { name: "Go to Reading List", path: "/reading-list", icon: <FileText size={14} className="text-amber-400" /> },
  ];

  const filteredNavs = navigations.filter(n =>
    n.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleSwitchUser = (userId) => {
    switchUser(userId);
    onClose();
  };

  const handleToggleTheme = () => {
    if (toggleTheme) {
      toggleTheme();
      showToast(`Switched theme`, "info");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Palette Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative bg-slate-900/95 border border-slate-800/80 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[60vh] backdrop-blur-md"
        >
          {/* Search Input Bar */}
          <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-slate-800/60 bg-slate-950/20">
            <Search className="text-slate-500 shrink-0" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, navigation links, theme toggle..."
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-200 placeholder-slate-500 text-sm"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-slate-800 rounded text-[9px] font-mono text-slate-500 bg-slate-950/60 select-none">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
            {/* Navigations Section */}
            {filteredNavs.length > 0 && (
              <div className="py-2">
                <p className="px-3 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
                <div className="mt-1 space-y-0.5">
                  {filteredNavs.map((nav) => (
                    <button
                      key={nav.name}
                      onClick={() => handleNav(nav.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-850 hover:text-cyan-400 text-xs text-left transition duration-150"
                    >
                      <div className="flex items-center space-x-2.5">
                        {nav.icon}
                        <span className="font-semibold">{nav.name}</span>
                      </div>
                      <ArrowRight size={11} className="text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Articles Search Section */}
            {filteredPosts.length > 0 && (
              <div className="py-2">
                <p className="px-3 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Articles</p>
                <div className="mt-1 space-y-0.5">
                  {filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleNav(`/blog/${post.slug}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-850 hover:text-cyan-400 text-xs text-left transition duration-150"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <FileText size={14} className="text-cyan-500 shrink-0" />
                        <span className="font-semibold truncate">{post.title}</span>
                      </div>
                      <span className="text-[10px] bg-slate-950/60 text-slate-500 px-2 py-0.5 rounded border border-slate-800 shrink-0 ml-2">
                        {post.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Commands Actions Section */}
            <div className="py-2">
              <p className="px-3 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Actions & Themes</p>
              <div className="mt-1 space-y-0.5 animate-none">
                {/* Theme Toggle */}
                {("toggle theme").includes(query.toLowerCase()) && (
                  <button
                    onClick={handleToggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-850 hover:text-cyan-400 text-xs text-left transition duration-150"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles size={14} className="text-amber-400" />
                      <span className="font-semibold">Toggle App Theme (Dark/Light/OLED)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono capitalize">Current: {theme}</span>
                  </button>
                )}

                {/* Switch User Actions */}
                {Object.values({
                  alex: { id: "alex", name: "Switch to Alex Mercer" },
                  sarah: { id: "sarah", name: "Switch to Sarah Connor" },
                  john: { id: "john", name: "Switch to John Doe" }
                }).map(u => {
                  if (u.name.toLowerCase().includes(query.toLowerCase())) {
                    const isActive = state.currentUser.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-850 hover:text-cyan-400 text-xs text-left transition duration-150 ${
                          isActive ? "text-cyan-400 font-bold" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <User size={14} className="text-slate-500" />
                          <span>{u.name}</span>
                        </div>
                        {isActive && <span className="text-[9px] uppercase tracking-widest font-black text-cyan-400">active</span>}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* No matches */}
            {filteredNavs.length === 0 && filteredPosts.length === 0 && (
              <div className="py-6 text-center text-slate-500 text-xs font-semibold">
                No commands or articles matching your search query.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
