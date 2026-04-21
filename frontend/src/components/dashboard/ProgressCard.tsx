"use client"

import React from 'react';
import { Card, CardContent } from '@/components/common/Card';
import { calculateProgress } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  icon: React.ReactNode;
  color: string;
}

export function ProgressCard({ title, current, total, icon, color }: ProgressCardProps) {
  const progress = calculateProgress(current, total);
  
  return (
    <Card className="overflow-hidden border border-white/5 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="space-y-1">
             <span className="text-[10px] font-black text-cyan-500/80 uppercase tracking-[0.2em]">{title}</span>
             <div className="flex items-baseline gap-1">
               <span className="text-3xl font-black tracking-tighter text-white">{current}</span>
               <span className="text-slate-500 font-bold text-sm">/ {total}</span>
             </div>
          </div>
          <div className={cn(
            "p-3 rounded-2xl shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
            color.includes('blue') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            color.includes('emerald') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            color.includes('purple') ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          )}>
            {icon}
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-in-out relative",
                color.split(' ')[0]
              )} 
              style={{ 
                width: `${progress}%`,
                boxShadow: `0 0 15px ${color.includes('blue') ? 'rgba(37,99,235,0.5)' : color.includes('emerald') ? 'rgba(16,185,129,0.5)' : color.includes('purple') ? 'rgba(147,51,234,0.5)' : 'rgba(249,115,22,0.5)'}`
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
            <span className="text-slate-500">Progress</span>
            <span className="text-white group-hover:text-cyan-400 transition-colors">{progress}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
