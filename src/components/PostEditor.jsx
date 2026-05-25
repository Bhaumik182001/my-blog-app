import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Edit2, Columns, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const tags = ["Architecture", "Database", "DevOps", "Security", "Frontend", "Performance"];
const gradients = [
  "from-blue-600 via-indigo-600 to-cyan-500",
  "from-cyan-600 to-teal-500",
  "from-indigo-600 to-purple-600",
  "from-red-600 via-rose-600 to-amber-500",
  "from-sky-500 to-blue-500",
  "from-violet-500 to-indigo-600",
  "from-pink-500 via-purple-500 to-indigo-500",
  "from-emerald-500 to-teal-600"
];

export default function PostEditor({ isOpen, onClose, editingPost = null }) {
  const { state, dispatch, showToast } = useApp();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("Architecture");
  const [content, setContent] = useState("");
  const [coverGradient, setCoverGradient] = useState(gradients[0]);
  
  // Layout mode: 'write', 'preview', 'split'
  const [layoutMode, setLayoutMode] = useState("split");

  // Draft states
  const [draftRestorable, setDraftRestorable] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load editing post or check draft
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setExcerpt(editingPost.excerpt);
      setTag(editingPost.tag);
      setContent(editingPost.content);
      setCoverGradient(editingPost.coverGradient || gradients[0]);
      setDraftRestorable(false);
    } else {
      setTitle("");
      setExcerpt("");
      setTag("Architecture");
      setContent("");
      setCoverGradient(gradients[0]);

      // Check if draft exists
      if (isOpen) {
        const savedDraft = localStorage.getItem("engblog_draft");
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.title || parsed.excerpt || parsed.content) {
              setDraftRestorable(true);
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [editingPost, isOpen]);

  // Draft auto-save effect
  useEffect(() => {
    if (!isOpen || editingPost) return;

    const interval = setInterval(() => {
      if (title.trim() || excerpt.trim() || content.trim()) {
        const draft = { title, excerpt, tag, content, coverGradient };
        localStorage.setItem("engblog_draft", JSON.stringify(draft));
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, title, excerpt, tag, content, coverGradient, editingPost]);

  // Adjust default layout mode based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setLayoutMode("write");
      } else {
        setLayoutMode("split");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem("engblog_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || "");
        setExcerpt(parsed.excerpt || "");
        setTag(parsed.tag || "Architecture");
        setContent(parsed.content || "");
        setCoverGradient(parsed.coverGradient || gradients[0]);
        showToast("Draft restored successfully", "info");
      } catch (e) {
        showToast("Failed to restore draft", "error");
      }
    }
    setDraftRestorable(false);
  };

  const handleClearDraft = () => {
    localStorage.removeItem("engblog_draft");
    setDraftRestorable(false);
    showToast("Draft cleared", "info");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const computedReadTime = Math.max(1, Math.ceil(wordCount / 200));

    // Seed reactions if creating new
    const initialReactions = editingPost ? editingPost.reactions : { heart: 0, fire: 0, idea: 0, mindblown: 0, clap: 0 };

    const postData = {
      id: editingPost ? editingPost.id : "post-" + Date.now(),
      slug: editingPost ? editingPost.slug : slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      date: editingPost
        ? editingPost.date
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
      readTime: `${computedReadTime} min read`,
      tag,
      author: editingPost ? editingPost.author : state.currentUser,
      featured: editingPost ? editingPost.featured : false,
      likes: editingPost ? editingPost.likes : 0,
      likedByMe: editingPost ? editingPost.likedByMe : false,
      coverGradient,
      content: content,
      reactions: initialReactions
    };

    if (editingPost) {
      dispatch({ type: "UPDATE_POST", payload: postData });
      showToast("Post updated successfully!");
    } else {
      // Check for duplicate slug
      const isDuplicate = state.posts.some(p => p.slug === slug);
      if (isDuplicate) {
        showToast("An article with a similar title already exists!", "error");
        return;
      }
      dispatch({ type: "CREATE_POST", payload: postData });
      showToast("Post published successfully!");
      // Clear draft on publish
      localStorage.removeItem("engblog_draft");
    }

    onClose();
  };

  // Word count & Readability stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));

  const getFleschScore = (text) => {
    if (!text || text.trim().length === 0) return 100;
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const syllables = (text.match(/[aeiouy]+/gi) || []).length || 1;
    let score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.round(Math.max(0, Math.min(100, score)));
  };

  const getFleschLabel = (score) => {
    if (score >= 90) return "Very Easy (5th Grade)";
    if (score >= 80) return "Easy (6th Grade)";
    if (score >= 70) return "Fairly Easy (7th Grade)";
    if (score >= 60) return "Standard (8th Grade)";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Confusing";
  };

  const fleschScore = getFleschScore(content);
  const fleschLabel = getFleschLabel(fleschScore);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative bg-slate-900 border border-slate-800 w-full max-w-7xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl z-10"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                    <span>{editingPost ? "Edit Article" : "Write New Article"}</span>
                    {lastSaved && (
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Draft saved {lastSaved}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Publish to the global feed instantly with Markdown support
                  </p>
                </div>
              </div>

              {/* Layout controls */}
              <div className="flex items-center space-x-2">
                <div className="bg-slate-950 p-1 rounded-lg flex border border-slate-800 mr-4">
                  <button
                    onClick={() => setLayoutMode("write")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      layoutMode === "write" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Edit2 size={13} />
                    <span>Write</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode("preview")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      layoutMode === "preview" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode("split")}
                    className={`hidden lg:flex px-3 py-1.5 rounded-md text-xs font-semibold items-center space-x-1.5 transition-colors ${
                      layoutMode === "split" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Columns size={13} />
                    <span>Split</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 p-1 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body / Split screen */}
            <div className="flex-grow flex overflow-hidden min-h-0">
              {/* Form Input Side */}
              <div
                className={`w-full h-full flex flex-col p-6 overflow-y-auto divide-y divide-slate-800 bg-slate-900/40 border-r border-slate-800/50 ${
                  layoutMode === "preview" ? "hidden" : layoutMode === "split" ? "w-1/2" : "w-full"
                }`}
              >
                <div>
                  {/* Restore Draft Alert */}
                  {draftRestorable && (
                    <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl mb-4 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <Save className="text-cyan-400 shrink-0" size={14} />
                        <span>An unsaved draft from your previous session was found. Restore it?</span>
                      </div>
                      <div className="flex space-x-2 shrink-0">
                        <button
                          onClick={handleRestoreDraft}
                          className="bg-cyan-500 text-slate-950 px-3 py-1 rounded font-bold hover:bg-cyan-400 transition"
                        >
                          Restore
                        </button>
                        <button
                          onClick={handleClearDraft}
                          className="bg-slate-800 text-slate-400 px-3 py-1 rounded font-bold hover:bg-slate-705 transition"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Title & Tag */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Scaling WebSockets with Redis"
                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-600"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Category Tag</label>
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-300"
                      >
                        {tags.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1.5 pb-6">
                    <label className="text-xs font-semibold text-slate-400">Short Summary / Excerpt</label>
                    <input
                      type="text"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Provide a brief one-line description of the article..."
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-600"
                      required
                    />
                  </div>

                  {/* Cover Design */}
                  <div className="space-y-2 pb-6">
                    <label className="text-xs font-semibold text-slate-400">Cover Gradient Card</label>
                    <div className="flex flex-wrap gap-2">
                      {gradients.map((grad, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCoverGradient(grad)}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} border-2 ${
                            coverGradient === grad ? "border-cyan-400 scale-110 shadow-md shadow-cyan-400/20" : "border-transparent"
                          } transition-all`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editor textarea */}
                <div className="flex-grow flex flex-col pt-6 min-h-[250px]">
                  <label className="text-xs font-semibold text-slate-400 mb-2">Content (Markdown supported)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Your markdown header here..."
                    className="flex-grow w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-600 font-mono resize-none leading-relaxed"
                    required
                  />

                  {/* Stats summary row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-400 mt-4 p-3 bg-slate-950/30 border border-slate-850 rounded-xl">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-slate-350">Words:</span>
                      <span className="font-mono text-cyan-400">{wordCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-slate-350">Reading time:</span>
                      <span className="font-mono text-cyan-400">~{readTimeEst} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-slate-350">Readability:</span>
                      <span className={`font-mono font-bold ${
                        fleschScore >= 60 ? "text-emerald-400" : fleschScore >= 40 ? "text-amber-400" : "text-rose-450"
                      }`}>{fleschScore} ({fleschLabel})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Side */}
              <div
                className={`prose prose-invert max-w-none h-full overflow-y-auto p-8 bg-slate-950/20 ${
                  layoutMode === "write" ? "hidden" : layoutMode === "split" ? "w-1/2" : "w-full"
                }`}
              >
                {/* Banner Preview */}
                <div className={`w-full h-40 bg-gradient-to-r ${coverGradient} rounded-xl mb-6 flex flex-col justify-end p-6 border border-white/10 shadow-lg`}>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white/80 bg-white/10 self-start px-2.5 py-1 rounded-full backdrop-blur-md mb-2 border border-white/10">
                    {tag}
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-white line-clamp-2 tracking-tight drop-shadow-sm">
                    {title || "Untitled Article"}
                  </h1>
                </div>

                {/* Markdown rendering */}
                {content ? (
                  <div className="text-slate-300 space-y-4 text-sm leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, children }) => <h1 className="text-2xl font-black text-slate-100 mt-6 mb-2 border-b border-slate-800 pb-2">{children}</h1>,
                        h2: ({ node, children }) => <h2 className="text-xl font-bold text-slate-100 mt-4 mb-2">{children}</h2>,
                        h3: ({ node, children }) => <h3 className="text-lg font-bold text-slate-200 mt-3">{children}</h3>,
                        p:  ({ node, children }) => <p className="text-slate-300 leading-relaxed mb-3">{children}</p>,
                        ul: ({ node, children }) => <ul className="list-disc pl-5 my-2 text-slate-300 space-y-1">{children}</ul>,
                        ol: ({ node, children }) => <ol className="list-decimal pl-5 my-2 text-slate-300 space-y-1">{children}</ol>,
                        li: ({ node, children }) => <li className="mb-0.5">{children}</li>,
                        blockquote: ({ node, children }) => (
                          <blockquote className="border-l-4 border-cyan-500/60 bg-slate-900/40 px-5 py-3 rounded-r-xl italic my-4 text-slate-400">
                            {children}
                          </blockquote>
                        ),
                        code: ({ node, children, inline }) => (
                          inline
                            ? <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs text-cyan-400 font-mono">{children}</code>
                            : <code className="block bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 font-mono my-3 overflow-x-auto">{children}</code>
                        ),
                        pre: ({ node, children }) => (
                          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 font-mono my-3 overflow-x-auto">
                            {children}
                          </pre>
                        )
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                    <Eye size={40} className="stroke-[1.5] mb-2 text-slate-700" />
                    <p className="text-sm font-medium">Nothing to preview yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/60 backdrop-blur-md shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-700 text-slate-400 text-sm font-semibold rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-lg text-sm flex items-center space-x-2 transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:opacity-95"
              >
                <Save size={16} />
                <span>{editingPost ? "Save Changes" : "Publish Article"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
