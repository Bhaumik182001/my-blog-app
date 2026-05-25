import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Floating compass animation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex p-4 bg-slate-900 border border-slate-800 rounded-full text-cyan-400"
      >
        <Compass size={48} className="stroke-[1.5]" />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-8xl font-black font-mono tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-700">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-200">Lost in the Stack?</h2>
        <p className="text-slate-500 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
          The routing path you specified could not be resolved in our static workspace endpoints. Let's redirect you back to active nodes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-lg text-xs shadow-lg hover:shadow-cyan-500/20 hover:opacity-95 transition-all w-full sm:w-auto"
        >
          <Home size={14} />
          <span>Home Feed</span>
        </Link>
        <Link
          to="/categories"
          className="flex items-center justify-center space-x-2 px-5 py-2.5 border border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 font-extrabold rounded-lg text-xs transition-all w-full sm:w-auto"
        >
          <ArrowLeft size={14} />
          <span>Back to Topics</span>
        </Link>
      </div>
    </div>
  );
}
