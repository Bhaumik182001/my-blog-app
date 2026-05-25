import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp, SEED_USERS } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookMarked, PenTool, Users, Check } from "lucide-react";

export default function UserMenu({ onWriteClick }) {
  const { state, switchUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full p-0.5 border border-slate-800 hover:border-slate-700 transition-colors"
      >
        <img
          src={state.currentUser.avatar}
          alt={state.currentUser.name}
          className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/20"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 bg-slate-900/95 border border-slate-800/80 rounded-xl shadow-2xl backdrop-blur-md z-50 py-2 divide-y divide-slate-800/60"
          >
            {/* User Profile */}
            <div className="px-4 py-2.5">
              <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-1">Signed in as</p>
              <div className="flex items-center space-x-2">
                <img
                  src={state.currentUser.avatar}
                  alt={state.currentUser.name}
                  className="w-8 h-8 rounded-full bg-slate-800"
                />
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {state.currentUser.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {state.currentUser.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onWriteClick();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-colors text-left"
              >
                <PenTool className="mr-3 text-slate-500" size={16} />
                Write Article
              </button>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-colors"
              >
                <LayoutDashboard className="mr-3 text-slate-500" size={16} />
                Dashboard
              </Link>
              <Link
                to="/reading-list"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-colors"
              >
                <BookMarked className="mr-3 text-slate-500" size={16} />
                Reading List
              </Link>
            </div>

            {/* Switch Personas Section */}
            <div className="py-2.5">
              <div className="px-4 pb-1.5 flex items-center space-x-1.5 text-slate-500">
                <Users size={12} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Switch Persona</span>
              </div>
              <div className="space-y-0.5 px-2">
                {Object.values(SEED_USERS).map((user) => {
                  const isCurrent = user.id === state.currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (!isCurrent) {
                          switchUser(user.id);
                        }
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition ${
                        isCurrent 
                          ? "bg-cyan-500/10 text-cyan-400" 
                          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img src={user.avatar} className="w-6 h-6 rounded-full bg-slate-850" alt="" />
                        <div className="truncate">
                          <p className="font-semibold leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">{user.role}</p>
                        </div>
                      </div>
                      {isCurrent && <Check size={12} className="text-cyan-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
