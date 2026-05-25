import React, { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NewsletterSignup() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setStatus("submitting");

    setTimeout(() => {
      setStatus("success");
      setEmail("");
      showToast("Subscription successful!");
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/60 to-slate-950/60 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-extrabold uppercase px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
            Weekly newsletter
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-100 leading-tight">
            Get Architecture Logs Direct to Inbox
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
            We publish deep-dive analysis briefs once a week. Absolutely no spam, only high-fidelity code logs and network reports.
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
          {status !== "success" ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  disabled={status === "submitting"}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl leading-5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition shadow-inner"
                  placeholder="enter your engineering email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs hover:shadow-lg hover:shadow-cyan-500/20 hover:opacity-95 transition-all shrink-0 flex items-center justify-center space-x-1.5"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-slate-950" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <div className="p-1 bg-emerald-500 text-slate-950 rounded-full shrink-0">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="text-xs font-bold">
                Subscription logs transmitted successfully. Welcome to EngBlog!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
