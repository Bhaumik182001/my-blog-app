import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Keyboard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShortcutSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastKey = "";
    let lastKeyTime = 0;

    const handleKeyDown = (e) => {
      // Ignore if typing inside inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.contentEditable === "true" ||
          activeEl.tagName === "SELECT")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const now = Date.now();

      // Toggle cheat sheet on "?"
      if (e.key === "?") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Open new post modal on "n"
      if (key === "n") {
        e.preventDefault();
        window.dispatchEvent(new Event("open-editor"));
        return;
      }

      // Sequential shortcuts (e.g. g then h within 1 second)
      if (key === "g") {
        lastKey = "g";
        lastKeyTime = now;
        return;
      }

      if (lastKey === "g" && now - lastKeyTime < 1000) {
        if (key === "h") {
          e.preventDefault();
          navigate("/");
          lastKey = "";
        } else if (key === "d") {
          e.preventDefault();
          navigate("/dashboard");
          lastKey = "";
        } else if (key === "r") {
          e.preventDefault();
          navigate("/reading-list");
          lastKey = "";
        } else if (key === "t") {
          e.preventDefault();
          navigate("/categories");
          lastKey = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const shortcutsList = [
    { keys: ["g", "h"], desc: "Go to Home Feed" },
    { keys: ["g", "d"], desc: "Go to Dashboard Workspace" },
    { keys: ["g", "r"], desc: "Go to Reading List" },
    { keys: ["g", "t"], desc: "Go to Topics / Categories" },
    { keys: ["n"], desc: "Write a New Article" },
    { keys: ["ctrl", "k"], desc: "Open Spotlight Command Palette" },
    { keys: ["?"], desc: "Toggle Keyboard Shortcuts Help Guide" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-slate-900/95 border border-slate-800/80 rounded-2xl p-6 max-w-md w-full shadow-2xl backdrop-blur-md z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5 text-cyan-400">
                <Keyboard size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 bg-slate-950 rounded-lg border border-slate-800"
              >
                <X size={14} />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3.5">
              {shortcutsList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{item.desc}</span>
                  <div className="flex items-center space-x-1">
                    {item.keys.map((k, kIdx) => (
                      <React.Fragment key={kIdx}>
                        {kIdx > 0 && <span className="text-slate-600 font-bold px-0.5">then</span>}
                        <kbd className="px-2 py-1 bg-slate-950 border border-slate-800 text-[10px] font-bold text-cyan-400 rounded-md font-mono min-w-[24px] text-center shadow-sm">
                          {k}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer tip */}
            <div className="text-[10px] text-slate-500 text-center font-medium pt-2 border-t border-slate-850">
              Press any shortcut keys to execute commands instantly.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
