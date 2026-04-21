"use client"

import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning';
  content: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/10">
        <div className="p-4 rounded-full bg-slate-800/50 mb-4">
          <Sparkles className="h-8 w-8 text-cyan-500/50 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold text-center max-w-xs leading-relaxed">
          Continue practicing to receive personalized insights from our AI.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <InsightItem key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

function InsightItem({ insight }: { insight: Insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-cyan-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    }
  };

  const getColors = () => {
    switch (insight.type) {
      case 'improvement':
        return {
          glow: 'group-hover:shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20',
          label: 'text-emerald-500/80'
        };
      case 'suggestion':
        return {
          glow: 'group-hover:shadow-cyan-500/10',
          iconBg: 'bg-cyan-500/10 border-cyan-500/20',
          label: 'text-cyan-500/80'
        };
      case 'warning':
        return {
          glow: 'group-hover:shadow-amber-500/10',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          label: 'text-amber-500/80'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={cn(
      "p-8 rounded-[2rem] border border-white/5 transition-all duration-500 group bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 relative hover:-translate-y-1 shadow-2xl",
      colors.glow
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-xl border transition-transform duration-500 group-hover:rotate-6", colors.iconBg)}>
            {getIcon()}
          </div>
          <span className={cn("font-black text-[10px] uppercase tracking-[0.2em]", colors.label)}>
            {insight.type}
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed font-bold text-sm">{insight.content}</p>
      </div>
    </div>
  );
}
