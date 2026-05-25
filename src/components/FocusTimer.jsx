import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Play, Pause, RotateCcw, Flame, CheckCircle } from "lucide-react";

export default function FocusTimer() {
  const { state, dispatch, showToast } = useApp();
  const [mode, setMode] = useState("focus"); // "focus" or "break"
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const durationMap = {
    focus: 25 * 60,
    break: 5 * 60
  };

  useEffect(() => {
    setTimeLeft(durationMap[mode]);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            
            if (mode === "focus") {
              dispatch({ type: "INCREMENT_FOCUS_SESSION" });
              showToast("Focus session completed! Take a break.", "success");
              setMode("break");
            } else {
              showToast("Break finished! Time to focus.", "info");
              setMode("focus");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMap[mode]);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const percent = ((durationMap[mode] - timeLeft) / durationMap[mode]) * 100;

  return (
    <div className="bg-slate-900/35 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md shadow-xl shadow-cyan-950/10 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center space-x-2">
          <Flame className="text-cyan-400" size={18} />
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Pomodoro Focus Timer</h4>
        </div>
        <div className="flex items-center space-x-1 bg-slate-950/40 border border-slate-800/40 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-cyan-400">
          <span>Streak: {state.focusSessions || 0} cycles</span>
        </div>
      </div>

      {/* Mode selectors */}
      <div className="flex bg-slate-950/40 border border-slate-800/50 rounded-lg p-0.5">
        <button
          onClick={() => setMode("focus")}
          className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${
            mode === "focus" 
              ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/25 text-cyan-400" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => setMode("break")}
          className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all ${
            mode === "break" 
              ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/25 text-cyan-400" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Break (5m)
        </button>
      </div>

      {/* Visual countdown progress circle */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* SVG ring background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-slate-800"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              className="stroke-cyan-500/70"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - percent / 100)}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono tabular-nums text-slate-100 leading-none">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">
              {mode === "focus" ? "Studying" : "Resting"}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center space-x-3">
        <button
          onClick={handleReset}
          className="p-2 bg-slate-950/40 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center space-x-2 ${
            isRunning 
              ? "bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:opacity-95 shadow-cyan-500/10"
          }`}
        >
          {isRunning ? (
            <>
              <Pause size={14} fill="currentColor" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
