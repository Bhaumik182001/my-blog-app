import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    title: "Migrating from Monolith to Micro-Frontends",
    excerpt: "Discover the architectural patterns and pitfalls we encountered when breaking down our 5-year-old React monolith into decoupled micro-frontends using Module Federation.",
    date: "Oct 24, 2025",
    readTime: "8 min read",
    tag: "Architecture"
  },
  {
    id: 2,
    title: "Optimizing PostgreSQL for High-Concurrency Workloads",
    excerpt: "A deep dive into connection pooling, query optimization, and advanced indexing strategies that helped us scale our database tier to handle 50k requests per second.",
    date: "Sep 12, 2025",
    readTime: "12 min read",
    tag: "Database"
  },
  {
    id: 3,
    title: "Implementing Zero-Downtime Deployments with Kubernetes",
    excerpt: "Learn how we leverage blue-green deployments, readiness probes, and graceful shutdowns to achieve true zero-downtime releases in our production GKE clusters.",
    date: "Aug 05, 2025",
    readTime: "10 min read",
    tag: "DevOps"
  }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center max-w-3xl mx-auto mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Engineering at Scale
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          Deep dives, post-mortems, and architectural insights from the engineers building the next generation of resilient distributed systems.
        </p>
      </div>

      <div className="mb-12 flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-200">Latest Articles</h2>
        <span className="text-cyan-500 text-sm font-medium tracking-wider uppercase">Updated Weekly</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post.id} className="card group cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
                {post.tag}
              </span>
              <span className="text-slate-500 text-sm">{post.readTime}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
              {post.title}
            </h3>
            <p className="text-slate-400 mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm text-slate-500 font-medium">{post.date}</span>
              <span className="text-cyan-500 group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
