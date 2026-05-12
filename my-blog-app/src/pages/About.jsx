export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mb-16 relative">
         <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-100">
          About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Team</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          We are a globally distributed collective of software engineers, SREs, and architects obsessed with building reliable systems. We believe in open source, blameless post-mortems, and pushing the boundaries of web technologies.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Simplicity First</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We prefer boring technology and simple architectures over trendy complexity. Code is read more than written.</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Observability</h3>
              <p className="text-slate-400 text-sm leading-relaxed">If you can't measure it, you can't improve it. We build systems that are instrumented by default.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">The Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {['React', 'Vite', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kubernetes', 'Docker'].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
