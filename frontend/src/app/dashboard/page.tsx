import React from 'react';
import { Book, MessageCircle, Award, TrendingUp } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { BadgeGrid } from '@/components/dashboard/BadgeGrid';
import { ErrorHistory } from '@/components/dashboard/ErrorHistory';
import { AIInsights } from '@/components/dashboard/AIInsights';

// Mock data for demonstration
const mockBadges = [
  {
    id: '1',
    name: 'Vocabulary Master',
    description: 'Learned 100 new words',
    earnedAt: new Date('2025-02-15'),
    icon: '📚'
  },
  {
    id: '2',
    name: 'Conversation Pro',
    description: 'Completed 10 conversation sessions',
    earnedAt: new Date('2025-02-20'),
    icon: '💬'
  },
  {
    id: '3',
    name: 'Grammar Guru',
    description: 'Achieved 90% accuracy in grammar exercises',
    earnedAt: new Date('2025-02-25'),
    icon: '🏆'
  },
  {
    id: '4',
    name: 'Consistent Learner',
    description: 'Practiced for 7 days in a row',
    earnedAt: new Date('2025-03-01'),
    icon: '🔥'
  }
];

const mockErrors = [
  {
    id: '1',
    timestamp: new Date('2025-03-01'),
    category: 'grammar',
    detail: 'I have went to the store yesterday.',
    correction: 'I went to the store yesterday.'
  },
  {
    id: '2',
    timestamp: new Date('2025-03-02'),
    category: 'vocabulary',
    detail: 'The food was very delicious.',
    correction: 'The food was delicious. (Avoid redundant intensifiers)'
  },
  {
    id: '3',
    timestamp: new Date('2025-03-03'),
    category: 'grammar',
    detail: 'If I would have known, I would have told you.',
    correction: 'If I had known, I would have told you.'
  }
];

const mockInsights = [
  {
    id: '1',
    type: 'improvement',
    content: 'Your pronunciation has improved by 20% in the past month.'
  },
  {
    id: '2',
    type: 'suggestion',
    content: 'You seem to struggle with present perfect tense. Would you like to practice it?'
  },
  {
    id: '3',
    type: 'warning',
    content: 'You consistently confuse "their", "there", and "they\'re". Let\'s focus on this.'
  }
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Your Learning Dashboard</h1>
        <p className="text-gray-600">Track your progress and see personalized insights</p>
      </header>
      
      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressCard
          title="Vocabulary"
          current={120}
          total={500}
          icon={<Book className="h-5 w-5 text-white" />}
          color="bg-blue-500"
        />
        <ProgressCard
          title="Conversations"
          current={8}
          total={20}
          icon={<MessageCircle className="h-5 w-5 text-white" />}
          color="bg-green-500"
        />
        <ProgressCard
          title="Grammar Score"
          current={75}
          total={100}
          icon={<Award className="h-5 w-5 text-white" />}
          color="bg-purple-500"
        />
        <ProgressCard
          title="Weekly Goal"
          current={4}
          total={7}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          color="bg-orange-500"
        />
      </div>
      
      {/* AI Insights */}
      <div className="mb-8">
        <AIInsights insights={mockInsights} />
      </div>
      
      {/* Two-column layout for remaining sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
          <BadgeGrid badges={mockBadges} />
        </div>
        
        {/* Error History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Learning Opportunities</h2>
          <ErrorHistory errors={mockErrors} />
        </div>
      </div>
    </div>
  );
}
