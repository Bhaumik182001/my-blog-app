import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Trash2, Reply, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentSection({ postSlug }) {
  const { state, dispatch, showToast } = useApp();
  const comments = state.comments[postSlug] || [];
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: "comment-" + Date.now(),
      content: commentText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      author: {
        name: state.currentUser.name,
        avatar: state.currentUser.avatar
      },
      replies: []
    };

    dispatch({
      type: "ADD_COMMENT",
      payload: { postSlug, comment: newComment }
    });
    setCommentText("");
    showToast("Comment posted!");
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: "reply-" + Date.now(),
      content: replyText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      author: {
        name: state.currentUser.name,
        avatar: state.currentUser.avatar
      }
    };

    dispatch({
      type: "ADD_REPLY",
      payload: { postSlug, commentId, reply: newReply }
    });
    setReplyText("");
    setReplyToId(null);
    showToast("Reply posted!");
  };

  const handleDeleteComment = (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      dispatch({
        type: "DELETE_COMMENT",
        payload: { postSlug, commentId }
      });
      showToast("Comment deleted", "info");
    }
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      dispatch({
        type: "DELETE_REPLY",
        payload: { postSlug, commentId, replyId }
      });
      showToast("Reply deleted", "info");
    }
  };

  const totalCommentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  return (
    <div className="mt-12 pt-10 border-t border-slate-800/80">
      <div className="flex items-center space-x-3 mb-8">
        <MessageSquare className="text-cyan-400" size={24} />
        <h3 className="text-2xl font-bold text-slate-100">
          Comments ({totalCommentsCount})
        </h3>
      </div>

      {/* Main Comment Input */}
      <form onSubmit={handleAddComment} className="flex space-x-4 mb-10">
        <img
          src={state.currentUser.avatar}
          alt={state.currentUser.name}
          className="w-10 h-10 rounded-full bg-slate-800 shrink-0"
        />
        <div className="flex-grow space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            rows="3"
            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-300 text-slate-200 placeholder-slate-500 resize-none text-sm leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:opacity-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/20 border border-slate-800 p-6 rounded-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-9 h-9 rounded-full bg-slate-900"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">
                      {comment.author.name}
                    </h4>
                    <span className="text-xs text-slate-500">{comment.date}</span>
                  </div>
                </div>

                {comment.author.name === state.currentUser.name && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Content */}
              <p className="text-sm text-slate-300 leading-relaxed pl-12">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="mt-4 pl-12 flex space-x-4">
                <button
                  onClick={() => {
                    setReplyToId(replyToId === comment.id ? null : comment.id);
                    setReplyText("");
                  }}
                  className="flex items-center text-xs text-slate-500 hover:text-cyan-400 font-semibold transition-colors"
                >
                  <Reply size={14} className="mr-1.5" />
                  Reply
                </button>
              </div>

              {/* Reply Form */}
              {replyToId === comment.id && (
                <form
                  onSubmit={(e) => handleAddReply(e, comment.id)}
                  className="mt-4 pl-12 flex space-x-3"
                >
                  <img
                    src={state.currentUser.avatar}
                    alt={state.currentUser.name}
                    className="w-8 h-8 rounded-full bg-slate-800 shrink-0"
                  />
                  <div className="flex-grow space-y-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-xs text-slate-200 placeholder-slate-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setReplyToId(null)}
                        className="px-3 py-1.5 border border-slate-800 text-slate-400 rounded-md text-xs hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold transition-all disabled:opacity-55"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-12 space-y-4 border-l border-slate-800/80">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="relative pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={reply.author.avatar}
                            alt={reply.author.name}
                            className="w-7 h-7 rounded-full bg-slate-900"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-slate-300">
                              {reply.author.name}
                            </h5>
                            <span className="text-[10px] text-slate-500">
                              {reply.date}
                            </span>
                          </div>
                        </div>

                        {reply.author.name === state.currentUser.name && (
                          <button
                            onClick={() => handleDeleteReply(comment.id, reply.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            aria-label="Delete reply"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pl-9">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
