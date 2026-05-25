import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) {
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

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 text-rose-500">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4">
              <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-slate-100 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-rose-600/25"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
