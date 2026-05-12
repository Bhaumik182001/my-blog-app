import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => (
  <nav className="glass-nav">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 group-hover:to-slate-200 transition-colors">
            EngBlog
          </span>
        </Link>
        <div className="flex space-x-8">
          <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">Home</Link>
          <Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">About</Link>
          <Link to="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">Contact</Link>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="border-t border-slate-800/50 bg-slate-950 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-slate-500 font-medium">© 2026 EngBlog. Build the future.</span>
        </div>
        <div className="flex space-x-6 text-slate-500">
          <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
