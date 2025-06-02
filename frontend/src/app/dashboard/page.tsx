'use client';

import React, { useEffect, useState } from 'react';
import { Book, MessageCircle, Award, TrendingUp } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { BadgeGrid } from '@/components/dashboard/BadgeGrid';
import { ErrorHistory } from '@/components/dashboard/ErrorHistory';
import { AIInsights } from '@/components/dashboard/AIInsights';
import {
  getDashboardStats,
  getAIInsights,
  getUserBadges,
  getLearningErrors,
} from '@/services/api';
import type { DashboardStats, AIInsight, Badge, LearningError } from '@/types';

// Temp user ID for demonstration purposes
// In a real application, you would replace this with actual user authentication logic
const TEMP_USER_ID = 'current-user-id'; // Replace with actual user ID logic

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [errors, setErrors] = useState<LearningError[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, insightsData, badgesData, errorsData] =
          await Promise.all([
            getDashboardStats(TEMP_USER_ID),
            getAIInsights(TEMP_USER_ID),
            getUserBadges(TEMP_USER_ID),
            getLearningErrors(TEMP_USER_ID),
          ]);

        setStats(statsData);
        setInsights(insightsData);
        setBadges(badgesData);
        setErrors(errorsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  /* if (loading || !stats) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>Loading...</p>
      </div>
    );
  }
 */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Your Learning Dashboard</h1>
        <p className="text-gray-600">
          Track your progress and see personalized insights
        </p>
      </header>

      {/* Progress Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressCard
          title="Vocabulary"
          current={stats.vocabulary.learned}
          total={stats.vocabulary.total}
          icon={<Book className="h-5 w-5 text-white" />}
          color="bg-blue-500"
        />
        <ProgressCard
          title="Conversations"
          current={stats.conversations.completed}
          total={stats.conversations.total}
          icon={<MessageCircle className="h-5 w-5 text-white" />}
          color="bg-green-500"
        />
        <ProgressCard
          title="Grammar Score"
          current={stats.grammarScore.current}
          total={stats.grammarScore.total}
          icon={<Award className="h-5 w-5 text-white" />}
          color="bg-purple-500"
        />
        <ProgressCard
          title="Weekly Goal"
          current={stats.weeklyProgress.daysActive}
          total={stats.weeklyProgress.daysTotal}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          color="bg-orange-500"
        />
      </div> */}

      {/* AI Insights */}
      <div className="mb-8">
        <AIInsights insights={insights} />
      </div>

      {/* Two-column layout for remaining sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
          <BadgeGrid badges={badges} />
        </div>

        {/* Error History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Learning Opportunities</h2>
          <ErrorHistory errors={errors} />
        </div>
      </div>
    </div>
  );
}
