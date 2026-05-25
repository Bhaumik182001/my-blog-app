import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!content) return;

    // Scan lines for # headers
    const lines = content.split("\n");
    const foundHeadings = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        foundHeadings.push({ level, text, id });
      }
    });

    setHeadings(foundHeadings);
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Leave space for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="sticky top-28 bg-slate-900/10 border border-slate-800 p-6 rounded-2xl">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
        <List className="text-cyan-400" size={16} />
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Table of Contents
        </h4>
      </div>

      <nav className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {headings.map((heading, i) => (
          <button
            key={i}
            onClick={() => scrollToHeading(heading.id)}
            className={`block text-left text-xs text-slate-400 hover:text-cyan-400 transition-colors w-full ${
              heading.level === 3 ? "pl-4 text-slate-500" : "font-semibold"
            }`}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
