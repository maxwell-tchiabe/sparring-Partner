"use client"

import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent } from '@/components/common/Card';
import { formatDate } from '@/lib/utils';

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <Card variant="outline" className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-24 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="text-3xl">{badge.icon}</div>
      </div>
      <CardContent>
        <h3 className="font-semibold mt-2">{badge.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
        <p className="text-xs text-gray-500 mt-2">Earned on {formatDate(badge.earnedAt)}</p>
      </CardContent>
    </Card>
  );
}
