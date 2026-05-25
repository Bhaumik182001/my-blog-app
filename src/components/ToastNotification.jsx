import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function ToastNotification() {
  const { state, dispatch } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-emerald-400" size={20} />;
      case "error":
        return <AlertCircle className="text-rose-400" size={20} />;
      default:
        return <Info className="text-cyan-400" size={20} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-slate-900/90";
      case "error":
        return "border-rose-500/30 bg-slate-900/90";
      default:
        return "border-cyan-500/30 bg-slate-900/90";
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-2xl ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="flex items-center space-x-3">
              {getIcon(toast.type)}
              <span className="text-sm font-medium text-slate-200">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: "REMOVE_TOAST", payload: toast.id })}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
