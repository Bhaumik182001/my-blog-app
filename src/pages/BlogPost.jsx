import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Clock, MessageSquare, Edit3, Trash2, CheckCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TagBadge from "../components/TagBadge";
import ReadingProgress from "../components/ReadingProgress";
import TableOfContents from "../components/TableOfContents";
import AuthorCard from "../components/AuthorCard";
import CommentSection from "../components/CommentSection";
import BookmarkButton from "../components/BookmarkButton";
import ShareButton from "../components/ShareButton";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import ReactionPicker from "../components/ReactionPicker";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogPost() {
  const { slug } = useParams();
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const articleRef = useRef(null);

  // Find current post
  const post = state.posts.find((p) => p.slug === slug);

  // States for CRUD modal triggers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // AI summary states
  const [showSummary, setShowSummary] = useState(false);

  // Scroll percentage for currently reading floating pill
  const [scrollPercent, setScrollPercent] = useState(0);

  const isRead = state.readPosts?.includes(slug);

  // Scroll-to-bottom reading detection
  useEffect(() => {
    if (!post || isRead) return;
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Trigger when 85% of article is visible / scrolled past
      if (top + height * 0.15 < windowH) {
        dispatch({ type: "MARK_READ", payload: slug });
        showToast("Article marked as read! ✓", "success");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post, isRead, slug]);

  // Track scroll position percentage
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = (window.pageYOffset / totalHeight) * 100;
        setScrollPercent(Math.round(Math.min(100, Math.max(0, pct))));
      }
    };
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-3xl font-black text-slate-100">Article Not Found</h2>
        <p className="text-slate-400 text-sm">
          The article you are looking for does not exist or has been deleted from this session.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-bold"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Link>
      </div>
    );
  }

  const isOwner = post.author?.name === state.currentUser.name;

  const handleDeleteConfirm = () => {
    dispatch({ type: "DELETE_POST", payload: post.id });
    showToast("Post deleted successfully", "info");
    navigate("/");
  };

  const slugify = (children) => {
    const text = React.Children.toArray(children)
      .map((child) => (typeof child === "string" ? child : child?.props?.children || ""))
      .join("");
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const comments = state.comments[post.slug] || [];
  const commentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  // Generate mock AI summary bullet points
  const getMockSummary = (text) => {
    if (!text) return [];
    const clean = text
      .replace(/#[^\n]+/g, "")
      .replace(/[*_`\[\]]/g, "")
      .trim();
    const sentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
    const keyPoints = sentences.slice(0, 3);
    return keyPoints.length > 0 
      ? keyPoints.map(p => `${p}.`) 
      : [
          "This engineering guide outlines critical strategies for distributed architecture migration.",
          "Performance diagnostics indicate key bottleneck resolutions across DB connection pathways.",
          "Implementation plans detail failover scenarios and telemetry tracing standards under load tests."
        ];
  };

  const summaryPoints = getMockSummary(post.content);

  return (
    <>
      {/* Scroll indicator bar */}
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Navigation / Control panel */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <Link
            to="/"
            className="flex items-center text-slate-400 hover:text-cyan-400 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} className="mr-2 animate-pulse" />
            Back to Articles
          </Link>

          <div className="flex items-center space-x-3">
            {/* Read badge */}
            {isRead && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl">
                <CheckCircle size={13} />
                Read
              </span>
            )}

            <ShareButton post={post} />

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 rounded-xl text-xs font-bold transition-all"
                >
                  <Edit3 size={14} />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-bold transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete Post</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cover visual banner */}
        <div className={`w-full h-56 md:h-80 bg-gradient-to-r ${post.coverGradient || "from-cyan-500 to-blue-500"} rounded-3xl mb-12 flex flex-col justify-end p-6 md:p-12 relative overflow-hidden border border-white/5 shadow-2xl`}>
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
          <div className="relative z-10 space-y-3">
            <TagBadge tag={post.tag} />
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl tracking-tight drop-shadow-md">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Triple grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel widgets (Reactions / Bookmarks) */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 flex lg:flex-col justify-center items-center gap-6 py-4 lg:py-0 border-y lg:border-y-0 lg:border-r border-slate-800/80">
            <ReactionPicker postSlug={post.slug} />
            <BookmarkButton slug={post.slug} size={24} />
          </div>

          {/* Core Content Area */}
          <article ref={articleRef} className="lg:col-span-8 space-y-8 min-w-0">
            {/* AI Summary Accordion Widget */}
            <div className="border border-slate-800 bg-slate-900/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-lg">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full flex items-center justify-between px-6 py-4 font-bold text-sm text-cyan-400 hover:bg-slate-800/20 transition-all text-left"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-cyan-450 animate-pulse text-cyan-400" />
                  <span>AI-Powered TL;DR Summary</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{showSummary ? "Hide" : "Show"}</span>
              </button>
              <AnimatePresence>
                {showSummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-800/60 overflow-hidden"
                  >
                    <div className="p-6 bg-slate-950/20 space-y-3 text-slate-300 text-xs leading-relaxed">
                      {summaryPoints.map((pt, i) => (
                        <div key={i} className="flex items-start space-x-2.5">
                          <span className="text-cyan-500 font-extrabold mt-0.5">•</span>
                          <p>{pt}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Author info mini header */}
            <div className="flex items-center space-x-4 border-b border-slate-800/60 pb-6">
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full bg-slate-800"
              />
              <div>
                <span className="block font-bold text-slate-200">{post.author?.name}</span>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    {commentsCount} comments
                  </span>
                </div>
              </div>
            </div>

            {/* Markdown rendered body content */}
            <div className="prose prose-invert max-w-none text-slate-350 leading-relaxed text-sm space-y-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, children }) => (
                    <h1
                      id={slugify(children)}
                      className="text-2xl font-black text-slate-100 mt-10 mb-4 border-b border-slate-800/60 pb-3"
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ node, children }) => (
                    <h2
                      id={slugify(children)}
                      className="text-xl font-bold text-slate-100 mt-8 mb-3"
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ node, children }) => (
                    <h3
                      id={slugify(children)}
                      className="text-lg font-bold text-slate-200 mt-6"
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ node, children }) => (
                    <p className="mb-4 text-slate-300 leading-relaxed text-sm">{children}</p>
                  ),
                  ul: ({ node, children }) => (
                    <ul className="list-disc pl-5 my-3 text-slate-300 space-y-1">{children}</ul>
                  ),
                  ol: ({ node, children }) => (
                    <ol className="list-decimal pl-5 my-3 text-slate-300 space-y-1">{children}</ol>
                  ),
                  li: ({ node, children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ node, children }) => (
                    <blockquote className="border-l-4 border-cyan-500/60 bg-slate-900/30 px-6 py-4 rounded-r-xl italic my-6 text-slate-400">
                      {children}
                    </blockquote>
                  ),
                  code: ({ node, children, inline }) =>
                    inline ? (
                      <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs text-cyan-400 font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 font-mono my-4 overflow-x-auto">
                        {children}
                      </code>
                    ),
                  pre: ({ node, children }) => (
                    <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 font-mono my-4 overflow-x-auto">
                      {children}
                    </pre>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Author Footer card info */}
            <div className="pt-8 border-t border-slate-800/80">
              <AuthorCard author={post.author} />
            </div>

            {/* Comments Thread Section */}
            <div className="pt-10">
              <CommentSection postSlug={post.slug} />
            </div>
          </article>

          {/* Sticky Table of Contents sidebar (right) */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28">
            <TableOfContents content={post.content} slugify={slugify} />
          </div>
        </div>
      </div>

      {/* Editor Modal for modifications */}
      <PostEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingPost={post}
      />

      {/* Delete confirmation dialog popup */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action is permanent and will wipe the article data from your local browser state memory."
        confirmText="Confirm Delete"
      />

      {/* Currently Reading Floating Status Pill */}
      {scrollPercent > 0 && scrollPercent < 100 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-slate-850 rounded-full px-5 py-2.5 shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-bold text-slate-200 border-cyan-500/20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="truncate max-w-[200px]">Reading: {post.title}</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-cyan-400">{scrollPercent}%</span>
        </div>
      )}
    </>
  );
}
