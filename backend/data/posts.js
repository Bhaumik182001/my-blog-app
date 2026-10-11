const { authors } = require("./authors");

const posts = [
  {
    id: "post-1",
    slug: "migrating-monolith-to-micro-frontends",
    title: "Migrating from Monolith to Micro-Frontends",
    excerpt: "Discover the architectural patterns and pitfalls we encountered when breaking down our 5-year-old React monolith into decoupled micro-frontends using Module Federation.",
    date: "Oct 24, 2025",
    readTime: "8 min read",
    tag: "Architecture",
    author: authors.alex,
    featured: true,
    likes: 24,
    reactions: { heart: 24, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    content: `
# Migrating from Monolith to Micro-Frontends

When an application scales, so does the complexity of managing it. In our journey scaling the EngBlog platform, we realized that our single React SPA was becoming too cumbersome for our growing team of engineers to manage. Build times were slow, deployments were risky, and team autonomy was non-existent.

In this article, we'll dive deep into our migration strategy.

## The Problem with the Monolith

Our initial architecture was a classic React SPA. While it served us well for the first few years, we eventually hit a wall:

- **Slow CI/CD Pipelines:** A single change triggered a complete rebuild and redeployment of the entire application.
- **Tight Coupling:** Different teams were stepping on each other's toes. A bug in the "comments" section could take down the entire "articles" page.
- **Dependency Hell:** Upgrading a single library often meant upgrading the entire application, which was a massive undertaking.

## Enter Module Federation

We evaluated several micro-frontend architectures, including iframes, web components, and build-time integration. We ultimately chose **Webpack Module Federation** for its dynamic loading capabilities and shared dependencies.

Here is a simplified example of our host application's configuration:

\`\`\`javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        articles_app: "articles_app@http://localhost:3001/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
\`\`\`

## The Strangler Fig Pattern

We didn't rewrite everything at once. We used the **Strangler Fig Pattern**, gradually replacing parts of the monolith with micro-frontends. We started with the least critical components, learned from our mistakes, and iteratively improved our process.

### Challenges Encountered

1.  **State Management:** Sharing state between micro-frontends is tricky. We opted for a lightweight event bus for cross-app communication, minimizing shared state as much as possible.
2.  **CSS Isolation:** We used CSS Modules to prevent styles from leaking across applications.
3.  **Routing:** The host application manages the primary routing, while each micro-frontend handles its internal routes.

## Results

The migration took six months, but the results were transformative. Build times dropped by 70%, deployment frequency increased 5x, and our teams regained their autonomy.
    `
  },
  {
    id: "post-2",
    slug: "optimizing-postgresql-high-concurrency",
    title: "Optimizing PostgreSQL for High-Concurrency Workloads",
    excerpt: "A deep dive into connection pooling, query optimization, and advanced indexing strategies that helped us scale our database tier to handle 50k requests per second.",
    date: "Sep 12, 2025",
    readTime: "12 min read",
    tag: "Database",
    author: authors.sarah,
    featured: false,
    likes: 18,
    reactions: { heart: 18, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-cyan-600 to-teal-500",
    content: `
# Optimizing PostgreSQL for High-Concurrency

Scaling a relational database to handle massive concurrency is one of the most challenging aspects of systems engineering. In this post, we share how we tuned our PostgreSQL clusters to reliably serve 50,000 requests per second.

## The Connection Chokepoint

PostgreSQL handles each connection using a separate process, which consumes significant memory and CPU context-switching overhead. As our traffic grew, we quickly exhausted our maximum connection limits.

### Implementing PgBouncer

Our first major win was implementing **PgBouncer**, a lightweight connection pooler for PostgreSQL. We configured it in *transaction pooling mode*, allowing us to serve thousands of client connections using only a small pool of actual database connections.

\`\`\`ini
[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = users.txt
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 100
\`\`\`

## Query Optimization and Indexing

Connection pooling only gets you so far if your queries are slow.

- **EXPLAIN ANALYZE is Your Friend:** We made it a mandatory step for engineers to attach \`EXPLAIN ANALYZE\` output to any PR introducing a new query.
- **Covering Indexes:** We heavily utilized covering indexes (using the \`INCLUDE\` clause) to allow index-only scans for our most frequent read paths.
- **Partial Indexes:** For queries that only target a specific subset of data (e.g., active users), partial indexes drastically reduced index size and maintenance overhead.

## Horizontal Scaling with Read Replicas

Once we optimized a single node as much as possible, we implemented a read-heavy architecture. All write operations went to the primary instance, while read operations were load-balanced across multiple read replicas.

This required careful application-level changes to handle eventual consistency, but it unlocked near-linear scaling for our read workloads.
    `
  },
  {
    id: "post-3",
    slug: "zero-downtime-deployments-kubernetes",
    title: "Implementing Zero-Downtime Deployments with Kubernetes",
    excerpt: "Learn how we leverage blue-green deployments, readiness probes, and graceful shutdowns to achieve true zero-downtime releases in our production GKE clusters.",
    date: "Aug 05, 2025",
    readTime: "10 min read",
    tag: "DevOps",
    author: authors.john,
    featured: false,
    likes: 32,
    reactions: { heart: 32, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-indigo-600 to-purple-600",
    content: `
# Zero-Downtime Deployments with Kubernetes

Deploying software should be a non-event. It shouldn't require maintenance windows or cause anxiety. By leveraging Kubernetes, we've built a deployment pipeline that guarantees zero downtime for our end-users.

## Health Probes

The foundation of zero-downtime deployments in Kubernetes is proper health checking. We configure both **liveness** and **readiness** probes for every application.

- **Liveness Probes:** Tells Kubernetes if the application is healthy. If it fails, the container is restarted.
- **Readiness Probes:** Tells Kubernetes if the application is ready to accept traffic. Traffic is only routed to the pod when this passes.

\`\`\`yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
\`\`\`

## Rolling Updates vs. Blue-Green

While Kubernetes supports rolling updates natively, we found that for major releases involving database schema changes, **Blue-Green Deployments** offered more safety.

With Blue-Green, we deploy the new version (Green) alongside the old version (Blue). We run our automated test suite against the Green environment. Only when we are 100% confident do we flip the service selector to route traffic to the Green pods.

## Graceful Shutdowns

When a pod is terminated, Kubernetes sends a \`SIGTERM\` signal. It's crucial that applications handle this gracefully.

1.  Stop accepting new connections.
2.  Finish processing in-flight requests.
3.  Close database connections.
4.  Exit cleanly.

If a pod doesn't exit within the \`terminationGracePeriodSeconds\`, Kubernetes forcefully kills it with a \`SIGKILL\`, which leads to dropped connections and a poor user experience.
    `
  },
  {
    id: "post-4",
    slug: "securing-web-applications-owasp-top-10",
    title: "Practical Steps for Securing Modern Web Applications",
    excerpt: "An engineering-first guide to mitigating the most critical web security vulnerabilities, from SQL injection to cross-site scripting (XSS) and broken authentication.",
    date: "Jul 18, 2025",
    readTime: "7 min read",
    tag: "Security",
    author: authors.john,
    featured: false,
    likes: 15,
    reactions: { heart: 15, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-red-600 via-rose-600 to-amber-500",
    content: `
# Securing Modern Web Applications

Security is often treated as an afterthought in software engineering, but building secure applications requires intentional design. In this post, we discuss practical ways to address the most critical OWASP Top 10 vulnerabilities.

## 1. Input Validation and Parameterized Queries

Never trust user input. SQL Injection remains a common vulnerability. Always use Parameterized Queries or Object-Relational Mappers (ORMs) that handle escaping automatically.

\`\`\`javascript
// Bad: Vulnerable to SQL Injection
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// Good: Parameterized Query
const query = 'SELECT * FROM users WHERE email = $1';
const values = [email];
await db.query(query, values);
\`\`\`

## 2. Cross-Site Scripting (XSS) Prevention

XSS occurs when an application includes untrusted data in a web page without proper validation or escaping.
Modern frameworks like React escape variables by default, but you must be careful with APIs like \`dangerouslySetInnerHTML\`.

Always sanitize rich content using tools like \`DOMPurify\` before rendering it.

## 3. Strict Content Security Policies (CSP)

A Content Security Policy is an added layer of security that helps detect and mitigate certain types of attacks, including XSS and data injection attacks. Configure your Nginx or backend server to return a strict \`Content-Security-Policy\` header.
    `
  },
  {
    id: "post-5",
    slug: "improving-react-performance-use-memo",
    title: "Optimizing React Rendering Performance at Scale",
    excerpt: "Understand how to diagnose rendering bottlenecks in React, when to use useMemo and useCallback, and how to structure context to avoid unnecessary re-renders.",
    date: "Jun 30, 2025",
    readTime: "9 min read",
    tag: "Frontend",
    author: authors.alex,
    featured: false,
    likes: 9,
    reactions: { heart: 9, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-sky-500 to-blue-500",
    content: `
# Optimizing React Rendering Performance

React is fast out of the box, but as an application grows, rendering performance can degrade. We recently underwent a performance audit of our core dashboards and managed to reduce render times by 40%. Here is how we did it.

## Identifying Render Bottlenecks

Before optimizing, measure. Use the **React DevTools Profiler** to record component rendering cycles and find which components are re-rendering most frequently.

## The useMemo and useCallback Myth

Many developers wrap every function in \`useCallback\` and every object in \`useMemo\`. This actually incurs a small overhead. Only use them when:

1. Passing callbacks or objects as props to memoized child components (\`React.memo\`).
2. The computation is genuinely expensive (e.g., filtering large lists).

## Structuring React Contexts

A common issue with React Context is that any change to the context value forces *all* consumers to re-render. To fix this:

- **Split Contexts:** Separate state context from dispatch/handler context.
- **Keep State Local:** If state is only used by a small subtree, don't put it in a global context.
    `
  },
  {
    id: "post-6",
    slug: "building-realtime-api-web-sockets",
    title: "Building a Resilient Realtime API with WebSockets",
    excerpt: "Learn how we designed a highly-available WebSockets API capable of pushing live dashboard updates to over 100,000 concurrent clients.",
    date: "May 14, 2025",
    readTime: "11 min read",
    tag: "Architecture",
    author: authors.alex,
    featured: false,
    likes: 12,
    reactions: { heart: 12, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-violet-500 to-indigo-600",
    content: `
# Resilient Realtime APIs with WebSockets

Pushed live updates are essential for modern SaaS dashboards. While polling is simple, it puts high load on the database. In this guide, we'll walk through building a WebSocket-based push service using Node.js and Redis Pub/Sub.

## Why WebSockets?

Unlike HTTP request-response, WebSockets offer full-duplex communication over a single TCP connection. This reduces headers size and provides sub-millisecond updates to clients.

## The Scaling Problem

A single server can only handle a limited number of TCP connections. To scale horizontally, we deployed multiple server instances behind a Load Balancer and connected them using a Redis Pub/Sub broker.

\`\`\`javascript
const WebSocket = require('ws');
const redis = require('redis');

const wss = new WebSocket.Server({ port: 8080 });
const subClient = redis.createClient();

subClient.subscribe('dashboard-updates');
subClient.on('message', (channel, message) => {
  // Broadcast message to all connected clients on this node
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});
\`\`\`

## Handling Reconnections Gracefully

Clients disconnect frequently due to network instability. We implement a heartbeat ping-pong mechanism to identify dead connections and support client-side exponential backoff reconnect logic.
    `
  },
  {
    id: "post-7",
    slug: "mastering-css-grid-flexbox-layouts",
    title: "Mastering Modern CSS Grid and Flexbox Layouts",
    excerpt: "Stop guessing CSS! A clean and visual comparison of CSS Grid vs. Flexbox, detailing when to use which and how to design complex responsive components.",
    date: "Apr 02, 2025",
    readTime: "6 min read",
    tag: "Frontend",
    author: authors.alex,
    featured: false,
    likes: 6,
    reactions: { heart: 6, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-pink-500 via-purple-500 to-indigo-500",
    content: `
# Mastering CSS Layouts: Grid and Flexbox

CSS layout options have evolved. Grid and Flexbox are the twin layout frameworks of modern web design, yet many engineers still struggle with when to use which.

## Flexbox: 1-Dimensional Layouts

Flexbox is best suited for laying out items in a single dimension (either a row or a column). It's great for navigation bars, alignment of text and icons, and distributed spacing.

## Grid: 2-Dimensional Layouts

Grid is designed for two-dimensional layouts—columns and rows at the same time. Use Grid for page layouts, gallery cards, and complex layouts that need alignment in both directions.

## Mixing Both for Complex UIs

Most modern pages use both. For example, a card grid uses CSS Grid to lay out cards, while each individual card uses Flexbox to align its internal elements (badge, title, author, footer).
    `
  },
  {
    id: "post-8",
    slug: "dockerizing-nodejs-for-production",
    title: "Dockerizing Node.js Microservices for Production",
    excerpt: "Best practices for containerizing Node.js applications, focusing on multi-stage builds, non-root users, security scans, and minimizing image sizes.",
    date: "Mar 10, 2025",
    readTime: "8 min read",
    tag: "DevOps",
    author: authors.john,
    featured: false,
    likes: 21,
    reactions: { heart: 21, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments: [],
    coverGradient: "from-emerald-500 to-teal-600",
    content: `
# Containerizing Node.js for Production

Containers provide consistent environments across local development and production. However, a naive Dockerfile can result in bloated images and security vulnerabilities. Let's look at a production-ready setup.

## Use Multi-Stage Builds

Multi-stage builds allow you to separate the build environment (which needs devDependencies like compilers or lint tools) from the final runtime environment, saving hundreds of megabytes.

\`\`\`dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]
\`\`\`

## Key Practices

- **Never Run as Root:** Node's default user is root. Switch to the built-in \`node\` user.
- **Use Alpine Images:** These are small, stripped-down Linux images that minimize download time and reduce attack surface area.
- **Handle Signals:** Node doesn't handle PID 1 signals (like SIGTERM) properly by default. Wrap your entrypoint with a process manager like \`tini\` if needed.
    `
  }
];

module.exports = { posts };
