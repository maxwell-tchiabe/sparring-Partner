"use client"

import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent } from '@/components/common/Card';
import { formatDate } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/20 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/10">
        <p className="text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">
          Complete your first session to earn your first badge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  // Dynamically get Lucide icon
  const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.Award;

  return (
    <Card className="overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group rounded-[2rem] bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 relative hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-0 relative z-10">
        <div className="h-40 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]">
            <IconComponent className="w-12 h-12 text-white" />
          </div>
          {/* Decorative particles for premium feel */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/20 animate-ping" />
          <div className="absolute bottom-6 left-8 w-1 h-1 rounded-full bg-white/10 animate-pulse" />
        </div>
        
        <div className="p-8">
          <h3 className="font-black text-xl text-white tracking-tight">{badge.name}</h3>
          <p className="text-sm text-slate-400 mt-2 font-bold leading-relaxed">{badge.description}</p>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Achieved</span>
            <span className="text-xs font-black text-indigo-400">{formatDate(badge.earnedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
