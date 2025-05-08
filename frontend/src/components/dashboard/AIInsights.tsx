"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface Insight {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning';
  content: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Continue practicing to receive personalized insights from our AI.
          </p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightItem key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InsightItem({ insight }: { insight: Insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'improvement':
        return 'bg-green-50 border-green-100';
      case 'suggestion':
        return 'bg-blue-50 border-blue-100';
      case 'warning':
        return 'bg-orange-50 border-orange-100';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBackgroundColor()}`}>
      <div className="flex">
        <div className="mr-3 mt-0.5">{getIcon()}</div>
        <div>
          <p className="text-gray-800">{insight.content}</p>
        </div>
      </div>
    </div>
  );
}
