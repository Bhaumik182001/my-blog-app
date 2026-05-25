import React from "react";
import { authors } from "../data/authors";
import { Users, Code, Award, Landmark, Globe, Mail } from "lucide-react";

export default function About() {
  const authorList = Object.values(authors);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16">
      {/* Intro Header */}
      <section className="text-center space-y-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-100">
          About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Engineering Team</span>
        </h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We are a globally distributed collective of software engineers, SREs, and architects obsessed with building highly-available distributed systems at scale.
        </p>
      </section>

      {/* Grid of author profiles */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Users className="text-cyan-400" size={20} />
          <h2 className="text-lg font-bold text-slate-200">Meet Our Contributors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {authorList.map((author) => (
            <div
              key={author.id}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:border-slate-700/50 hover:bg-slate-900/60 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full group-hover:scale-150 transition" />

              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full border border-slate-800 bg-slate-950 relative z-10"
              />

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-200 text-sm md:text-base group-hover:text-cyan-400 transition-colors">
                  {author.name}
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {author.role}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-xs flex-grow">
                {author.bio}
              </p>

              {/* Social icons */}
              <div className="flex items-center space-x-3 text-slate-500 pt-2 shrink-0">
                <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>
                  <Mail size={14} />
                </a>
                <a href="#" className="hover:text-cyan-400 transition" onClick={(e) => e.preventDefault()}>
                  <Globe size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Award className="text-cyan-400" size={20} />
          <h2 className="text-lg font-bold text-slate-200">Our Core Principles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
              Simplicity First
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              We prefer boring, proven technologies and clean, readable layouts over trendy complexity. Code is read infinitely more than it is written.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
              Observability by Default
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              If it isn't instrumented, it isn't complete. We design applications to expose metrics, traces, and indicators as a tier-1 feature priority.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack List */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Code className="text-cyan-400" size={20} />
          <h2 className="text-lg font-bold text-slate-200">The Technology Stack</h2>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {["React", "Vite", "Tailwind CSS", "Framer Motion", "Lucide React", "Node.js", "PostgreSQL", "Kubernetes", "Docker", "Jenkins"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 bg-slate-900/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 text-xs font-bold rounded-lg border border-slate-800 transition cursor-default"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
