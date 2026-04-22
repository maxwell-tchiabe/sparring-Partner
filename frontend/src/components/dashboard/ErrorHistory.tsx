'use client';

import React from 'react';
import { LearningError } from '@/types';
import { Card, CardContent } from '@/components/common/Card';
import { formatDate } from '@/lib/utils';
import { ArrowRight, CheckCircle2, History } from 'lucide-react';

interface ErrorHistoryProps {
  errors: LearningError[];
}

export function ErrorHistory({ errors }: ErrorHistoryProps) {
  if (errors.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/20 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/10">
        <div className="p-4 rounded-full bg-slate-800/50 w-fit mx-auto mb-4">
          <History className="w-8 h-8 text-rose-500/50" />
        </div>
        <p className="text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">
          No errors recorded yet. Your progress is looking great!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errors.map((error) => (
        <ErrorItem key={error.id} error={error} />
      ))}
    </div>
  );
}

function ErrorItem({ error }: { error: LearningError }) {
  return (
    <Card className="border border-white/5 shadow-2xl transition-all duration-500 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 overflow-hidden group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
              {error.category}
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {formatDate(error.timestamp)}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-white/5 relative group-hover:border-white/10 transition-colors">
              <span className="text-[10px] font-black text-slate-500 block mb-3 uppercase tracking-widest">Original</span>
              <p className="text-slate-400 font-medium italic line-through decoration-rose-500/30 text-sm">{error.detail}</p>
            </div>
            
            <div className="p-2 rounded-full bg-slate-800/50 border border-white/5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
               <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 relative">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Corrected</span>
                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
              </div>
              <p className="text-emerald-300 font-black text-sm">{error.correction}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
