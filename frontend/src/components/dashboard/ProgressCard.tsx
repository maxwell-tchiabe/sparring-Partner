"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { calculateProgress } from '@/lib/utils';

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
    <Card variant="outline" className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{current} / {total}</div>
        <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 text-right">{progress}%</div>
      </CardContent>
    </Card>
  );
}
