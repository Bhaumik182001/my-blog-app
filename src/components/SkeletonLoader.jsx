import React from "react";

export function WidgetSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3 p-3 bg-slate-900/20 border border-slate-850 rounded-xl animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3.5 bg-slate-850 rounded-md w-3/4" />
            <div className="h-2.5 bg-slate-850 rounded-md w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DevtoSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/20 border border-slate-850 rounded-2xl p-5 flex flex-col h-40 space-y-4 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-slate-800" />
            <div className="h-3 bg-slate-850 rounded w-16" />
          </div>
          <div className="space-y-2 flex-grow">
            <div className="h-4 bg-slate-850 rounded w-full" />
            <div className="h-4 bg-slate-850 rounded w-5/6" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-slate-850 rounded w-20" />
            <div className="h-3 bg-slate-850 rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden flex flex-col h-96 animate-pulse">
      <div className="h-28 w-full bg-slate-800" />
      <div className="p-5 flex-grow flex flex-col space-y-4">
        <div className="h-5 bg-slate-850 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-850 rounded w-full" />
          <div className="h-3.5 bg-slate-850 rounded w-5/6" />
        </div>
        <div className="flex-grow" />
        <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="space-y-1">
            <div className="h-3 bg-slate-850 rounded w-20" />
            <div className="h-2 bg-slate-850 rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
