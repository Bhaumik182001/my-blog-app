import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const icons = { dark: Moon, oled: Monitor, light: Sun };
const labels = { dark: "Dark", oled: "OLED", light: "Light" };

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const Icon = icons[theme] || Moon;

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={cycleTheme}
      title={`Switch theme (currently ${labels[theme]})`}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={16} />
      </motion.div>
      {/* Theme label tooltip */}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-slate-500 pointer-events-none opacity-0 group-hover:opacity-100 whitespace-nowrap">
        {labels[theme]}
      </span>
    </motion.button>
  );
}
