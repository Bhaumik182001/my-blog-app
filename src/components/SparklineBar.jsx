import React from "react";

/**
 * Pure CSS sparkline bar chart for engagement data.
 * Props:
 *   data: Array<{ label: string, value: number, slug?: string }>
 *   height: number (px, default 48)
 *   showLabels: boolean
 */
export default function SparklineBar({ data = [], height = 48, showLabels = false }) {
  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.value), 1);

  const getColor = (val, mx) => {
    const ratio = val / mx;
    if (ratio >= 0.7) return { bar: "bg-emerald-500", glow: "shadow-emerald-500/30", text: "text-emerald-400" };
    if (ratio >= 0.35) return { bar: "bg-cyan-500", glow: "shadow-cyan-500/30", text: "text-cyan-400" };
    return { bar: "bg-slate-600", glow: "", text: "text-slate-500" };
  };

  return (
    <div className="w-full">
      <div
        className="flex items-end gap-1"
        style={{ height: `${height}px` }}
        role="img"
        aria-label="Engagement sparkline"
      >
        {data.map((item, i) => {
          const pct = max > 0 ? (item.value / max) * 100 : 0;
          const colors = getColor(item.value, max);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end group relative"
              style={{ height: "100%" }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-200 shadow-xl">
                  {item.value} {item.value === 1 ? "like" : "likes"}
                </div>
              </div>
              {/* Bar */}
              <div
                className={`w-full rounded-t-sm ${colors.bar} transition-all duration-500 shadow-sm ${colors.glow}`}
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      {showLabels && (
        <div className="flex gap-1 mt-1.5">
          {data.map((item, i) => {
            const colors = getColor(item.value, max);
            return (
              <div key={i} className="flex-1 text-center">
                <span className={`text-[9px] font-bold ${colors.text} truncate block`} title={item.label}>
                  {item.label?.length > 6 ? item.label.slice(0, 5) + "…" : item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
