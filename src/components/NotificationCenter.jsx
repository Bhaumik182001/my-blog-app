import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import {
  Bell, X, CheckCheck, Trash2,
  CheckCircle, AlertCircle, Info, AlertTriangle
} from "lucide-react";

const typeStyles = {
  success: { icon: CheckCircle,   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  error:   { icon: AlertCircle,   color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
  info:    { icon: Info,          color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
};

function relativeTime(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCenter({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const panelRef = useRef(null);

  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Mark all read when panel opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      dispatch({ type: "MARK_NOTIFICATIONS_READ" });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={onClose}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
            className="absolute right-0 mt-3 w-80 bg-slate-900/98 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Bell size={14} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">Notifications</span>
                {state.notifications.length > 0 && (
                  <span className="text-xs text-slate-500 font-medium">({state.notifications.length})</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {state.notifications.length > 0 && (
                  <button
                    onClick={() => dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" })}
                    className="text-[10px] text-slate-500 hover:text-rose-400 font-semibold transition-colors flex items-center space-x-1"
                  >
                    <Trash2 size={11} />
                    <span>Clear all</span>
                  </button>
                )}
                <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {state.notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCheck size={28} className="text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">All caught up!</p>
                  <p className="text-xs text-slate-600 mt-1">Actions like likes, comments, and posts will appear here.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {state.notifications.map((notif) => {
                    const style = typeStyles[notif.type] || typeStyles.info;
                    const Icon = style.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors ${!notif.read ? "bg-slate-800/10" : ""}`}
                      >
                        <Icon size={15} className={`${style.color} mt-0.5 shrink-0`} />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{relativeTime(notif.time)}</p>
                        </div>
                        <button
                          onClick={() => dispatch({ type: "CLEAR_NOTIFICATION", payload: notif.id })}
                          className="text-slate-600 hover:text-rose-400 transition-colors shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
