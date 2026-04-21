'use client';

import React, { useEffect, useState } from 'react';
import { Book, MessageCircle, Award, TrendingUp, Loader2, Sparkles } from 'lucide-react';
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
import { supabase } from '@/lib/supabase';
import type { DashboardStats, AIInsight, Badge, LearningError } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [errors, setErrors] = useState<LearningError[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, insightsData, badgesData, errorsData] =
          await Promise.all([
            getDashboardStats(userId),
            getAIInsights(userId),
            getUserBadges(userId),
            getLearningErrors(userId),
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

    fetchDashboardData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-semibold">Please sign in to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 bg-[#05050A] min-h-screen">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Personal Dashboard</span>
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Your Progress
          </h1>
          <p className="text-lg text-slate-500 mt-3 font-medium max-w-2xl leading-relaxed">
            Track your language learning journey, visualize your achievements, and master new skills with AI-driven insights.
          </p>
        </div>
      </header>

      {/* Progress Cards Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Vital Stats</h2>
        </div>
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProgressCard
              title="Vocabulary"
              current={stats.vocabulary.learned}
              total={stats.vocabulary.total}
              icon={<Book className="h-5 w-5" />}
              color="bg-blue-500 shadow-blue-500/20"
            />
            <ProgressCard
              title="Conversations"
              current={stats.conversations.completed}
              total={stats.conversations.total}
              icon={<MessageCircle className="h-5 w-5" />}
              color="bg-emerald-500 shadow-emerald-500/20"
            />
            <ProgressCard
              title="Grammar Score"
              current={stats.grammarScore.current}
              total={stats.grammarScore.total}
              icon={<Award className="h-5 w-5" />}
              color="bg-purple-500 shadow-purple-500/20"
            />
            <ProgressCard
              title="Weekly Activity"
              current={stats.weeklyProgress.daysActive}
              total={stats.weeklyProgress.daysTotal}
              icon={<TrendingUp className="h-5 w-5" />}
              color="bg-orange-500 shadow-orange-500/20"
            />
          </div>
        )}
      </section>

      {/* AI Insights Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">AI Training Insights</h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
        </div>
        <AIInsights insights={insights} />
      </section>

      {/* Two-column layout for Achievements and Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Badges */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Award className="text-amber-400 w-5 h-5" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Your Achievements</h2>
          </div>
          <BadgeGrid badges={badges} />
        </section>

        {/* Error History */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Book className="text-rose-400 w-5 h-5" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Learning Focus</h2>
          </div>
          <ErrorHistory errors={errors} />
        </section>
      </div>
    </div>
  );
}
