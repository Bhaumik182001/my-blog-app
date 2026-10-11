"use strict";

const express = require("express");
const cors    = require("cors");

// ─── Seed data (in-memory store) ──────────────────────────────────────────────
// Deep-clone the seed so in-memory mutations don't affect the require() cache
const { posts: seedPosts } = require("./data/posts");
let posts = JSON.parse(JSON.stringify(seedPosts));

// ─── App setup ────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// GET /api/posts  – return all posts (content trimmed for list view)
app.get("/api/posts", (_req, res) => {
  res.json(posts);
});

// GET /api/posts/:slug  – return a single post by slug
app.get("/api/posts/:slug", (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

// POST /api/posts  – create a new post (in-memory)
app.post("/api/posts", (req, res) => {
  const {
    title, excerpt, content = "", tag = "General",
    author, coverGradient = "from-gray-500 to-gray-600",
    featured = false, readTime = "5 min read"
  } = req.body;

  if (!title || !excerpt || !author) {
    return res.status(400).json({ error: "title, excerpt, and author are required" });
  }

  const newPost = {
    id:            `post-${Date.now()}`,
    slug:          title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title,
    excerpt,
    content,
    tag,
    author,
    coverGradient,
    featured,
    readTime,
    date:          new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    likes:         0,
    reactions:     { heart: 0, fire: 0, idea: 0, mindblown: 0, clap: 0 },
    comments:      [],
  };

  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// DELETE /api/posts/:id  – remove a post by id (in-memory)
app.delete("/api/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  const [deleted] = posts.splice(index, 1);
  res.json({ deleted });
});

// POST /api/posts/:slug/comments  – add a comment to a post
app.post("/api/posts/:slug/comments", (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { content, author } = req.body;
  if (!content || !author) {
    return res.status(400).json({ error: "content and author are required" });
  }

  const comment = {
    id:      `c-${Date.now()}`,
    content,
    author,
    date:    new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    replies: [],
  };

  if (!Array.isArray(post.comments)) post.comments = [];
  post.comments.unshift(comment);

  res.status(201).json(comment);
});

// POST /api/posts/:slug/reactions  – toggle/update a reaction on a post
app.post("/api/posts/:slug/reactions", (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { reactionType, active } = req.body;
  const validTypes = ["heart", "fire", "idea", "mindblown", "clap"];

  if (!reactionType || !validTypes.includes(reactionType)) {
    return res.status(400).json({ error: `reactionType must be one of: ${validTypes.join(", ")}` });
  }

  if (!post.reactions) {
    post.reactions = { heart: 0, fire: 0, idea: 0, mindblown: 0, clap: 0 };
  }

  // active = true means user is toggling ON → increment; false → decrement
  const delta = active ? 1 : -1;
  post.reactions[reactionType] = Math.max(0, (post.reactions[reactionType] || 0) + delta);
  post.likes = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  res.json({ reactions: post.reactions, likes: post.likes });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[backend] Blog API running on http://localhost:${PORT}`);
});
