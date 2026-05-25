import React from "react";
import { User, Globe, Mail } from "lucide-react";

export default function AuthorCard({ author }) {
  if (!author) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
      {/* Avatar */}
      <img
        src={author.avatar}
        alt={author.name}
        className="w-16 h-16 rounded-full border border-slate-900 bg-slate-950 shadow-lg"
      />

      {/* Info details */}
      <div className="flex-grow text-center sm:text-left space-y-2.5">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-0.5">
            Written By
          </span>
          <h4 className="text-lg font-black text-slate-100">{author.name}</h4>
          <span className="text-xs text-slate-400 font-medium">{author.role}</span>
        </div>

        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
          {author.bio || "Staff engineering contributor writing about high-performance software systems architecture."}
        </p>

        {/* Social Mock Icons */}
        <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-slate-500 hover:text-cyan-400 p-1 border border-slate-800 rounded hover:border-slate-700 transition"
          >
            <Mail size={14} />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-slate-500 hover:text-cyan-400 p-1 border border-slate-800 rounded hover:border-slate-700 transition"
          >
            <Globe size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
