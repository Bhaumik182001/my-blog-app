import React from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const handleOpen = () => {
    window.dispatchEvent(new Event("open-command-palette"));
  };

  return (
    <div 
      onClick={handleOpen} 
      className="relative max-w-xl mx-auto w-full group cursor-pointer"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </div>
      <div
        className="block w-full pl-12 pr-16 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl leading-5 text-slate-500 hover:text-slate-400 sm:text-sm transition-all shadow-lg backdrop-blur-sm select-none"
      >
        Search articles, commands, switch users...
      </div>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-slate-700 rounded text-xs font-mono text-slate-500 bg-slate-950/60">
          ctrl+k
        </kbd>
      </div>
    </div>
  );
}
