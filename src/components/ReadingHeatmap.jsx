import React from "react";

export default function ReadingHeatmap({ readDates = [] }) {
  // Count frequency of each date
  const dateCounts = readDates.reduce((acc, d) => {
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  // Generate last 84 days (12 weeks)
  const days = [];
  const today = new Date();
  
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      count: dateCounts[dateStr] || 0,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      monthName: d.toLocaleDateString("en-US", { month: "short" })
    });
  }

  // Get color based on read count
  const getColor = (count) => {
    if (count === 0) return "bg-slate-900 border-slate-950/20";
    if (count === 1) return "bg-cyan-950 text-cyan-400 border-cyan-800/40";
    if (count === 2) return "bg-cyan-800 text-cyan-200 border-cyan-700/50";
    return "bg-cyan-500 text-slate-950 border-cyan-400/80";
  };

  // Group days by week (7 days per week)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="bg-slate-900/35 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reading Heatmap (Last 12 Weeks)</h4>
        <div className="flex items-center space-x-1.5 text-[9px] text-slate-500">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-950/20" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-950 border border-cyan-850" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-850 border border-cyan-750" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-500 border border-cyan-400" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5 min-w-[320px] justify-between">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3.5 h-3.5 rounded border transition-all hover:scale-115 ${getColor(day.count)}`}
                  title={`${day.count} read${day.count === 1 ? "" : "s"} on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-1">
        <span>12 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
