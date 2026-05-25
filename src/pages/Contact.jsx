import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success'

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    
    if (!formData.message.trim()) {
      newErrors.message = "Message text is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulate network submission delay
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      showToast("Message sent successfully!");
    }, 1500);
  };

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-slate-100">Get in Touch</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Have questions about our server architecture? Or suggestions for our blog workspace? Drop us a line.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    disabled={status === "submitting"}
                    className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                      errors.name ? "border-rose-500/50" : "border-slate-800"
                    } rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-650`}
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <span className="text-rose-400 text-[10px] flex items-center mt-1">
                      <AlertCircle size={10} className="mr-1" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled={status === "submitting"}
                    className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                      errors.email ? "border-rose-500/50" : "border-slate-800"
                    } rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-650`}
                    placeholder="ada@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <span className="text-rose-400 text-[10px] flex items-center mt-1">
                      <AlertCircle size={10} className="mr-1" />
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-400">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  disabled={status === "submitting"}
                  className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                    errors.subject ? "border-rose-500/50" : "border-slate-800"
                  } rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-650`}
                  placeholder="System scaling inquiry"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                />
                {errors.subject && (
                  <span className="text-rose-400 text-[10px] flex items-center mt-1">
                    <AlertCircle size={10} className="mr-1" />
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message box */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-slate-400">
                  Message
                </label>
                <textarea
                  id="message"
                  disabled={status === "submitting"}
                  rows="5"
                  className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                    errors.message ? "border-rose-500/50" : "border-slate-800"
                  } rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition text-sm text-slate-200 placeholder-slate-650 resize-none`}
                  placeholder="Tell us what you're building..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
                {errors.message && (
                  <span className="text-rose-400 text-[10px] flex items-center mt-1">
                    <AlertCircle size={10} className="mr-1" />
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex justify-center items-center space-x-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-slate-950" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 space-y-5"
            >
              <div className="flex justify-center">
                <CheckCircle2 size={56} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-100">Message Transmitted!</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out to the EngBlog team. We have received your inquiry logs and will respond to your registered email address shortly.
                </p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="px-5 py-2.5 border border-slate-700 hover:border-slate-650 hover:bg-slate-800/40 text-slate-300 rounded-lg text-xs font-bold transition-all"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
