import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import ReadingList from "./pages/ReadingList";
import Categories from "./pages/Categories";
import NotFound from "./components/NotFound";

import UserMenu from "./components/UserMenu";
import PostEditor from "./components/PostEditor";
import ToastNotification from "./components/ToastNotification";
import BackToTop from "./components/BackToTop";
import ThemeToggle from "./components/ThemeToggle";
import NotificationCenter from "./components/NotificationCenter";
import CommandPalette from "./components/CommandPalette";
import ShortcutSheet from "./components/ShortcutSheet";

import { Menu, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = ({ onWriteClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/categories" },
    { name: "Reading List", path: "/reading-list" },
    { name: "About Team", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav className="glass-nav border-b border-slate-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-slate-950 font-black text-lg">E</span>
            </div>
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 group-hover:from-cyan-300 group-hover:to-slate-200 transition-all duration-500 uppercase tracking-wider">
              EngBlog
            </span>
          </Link>

          {/* Desktop Links Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-cyan-500/8 border border-cyan-500/20 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notification bell */}
            <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(o => !o)} />

            {/* Quick Action CRUD write */}
            <button
              onClick={onWriteClick}
              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-cyan-500/10 active:scale-95 ml-2"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Write</span>
            </button>

            {/* Profile drop-down */}
            <UserMenu onWriteClick={onWriteClick} />
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="flex lg:hidden items-center space-x-3">
            <UserMenu onWriteClick={onWriteClick} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-slate-200 focus:outline-none p-1.5 bg-slate-900 border border-slate-800 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-t border-slate-900 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-semibold rounded-lg ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onWriteClick();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-md"
              >
                <Plus size={16} className="stroke-[3]" />
                <span>Write New Article</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-slate-800/60 bg-slate-950 mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-slate-950 font-black">E</span>
            </div>
            <span className="font-black text-slate-200 uppercase tracking-wider">EngBlog Hub</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Engineering insights from distributed systems practitioners. Built for DevOps CI/CD demonstrations.
          </p>
          <div className="flex space-x-4">
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs text-slate-600 hover:text-cyan-400 font-semibold transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Tech Stack</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {["React 18", "Vite", "TailwindCSS", "Framer Motion", "React Router", "LocalStorage"].map((tech) => (
              <span key={tech} className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CI/CD Pipeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">CI/CD Pipeline</h4>
          <div className="flex flex-wrap gap-2">
            {["Jenkins", "Docker", "Nginx", "Prometheus"].map((tool) => (
              <span
                key={tool}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-semibold"
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mt-2">Pipeline powering this deployment.</p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-slate-600 text-xs">
          © 2026 EngBlog Hub. All rights reserved.
        </span>
        <span className="text-[10px] text-slate-700 uppercase tracking-widest font-semibold">
          React · Vite · TailwindCSS · DevOps
        </span>
      </div>
    </div>
  </footer>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex-grow flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reading-list" element={<ReadingList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:tag" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    const handleOpenPalette = () => {
      setIsPaletteOpen(true);
    };
    const handleOpenEditor = () => {
      setIsEditorOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenPalette);
    window.addEventListener("open-editor", handleOpenEditor);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenPalette);
      window.removeEventListener("open-editor", handleOpenEditor);
    };
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-200">
            {/* Main Navigation Bar */}
            <Navbar onWriteClick={() => setIsEditorOpen(true)} />

            {/* Router Core Outlet */}
            <main className="flex-grow flex flex-col overflow-hidden">
              <AnimatedRoutes />
            </main>

            {/* Footer Component */}
            <Footer />

            {/* Global Toast Notification Layer */}
            <ToastNotification />

            {/* Floating Back To Top Button */}
            <BackToTop />

            {/* Global Post Editor Modal (CRUD create) */}
            <PostEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />

            {/* Spotlight Command Palette Modal */}
            <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

            {/* Keyboard Shortcuts Cheat Sheet */}
            <ShortcutSheet />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}
