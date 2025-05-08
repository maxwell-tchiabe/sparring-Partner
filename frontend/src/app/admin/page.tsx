import React from 'react';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { ExportData } from '@/components/admin/ExportData';

// Mock data for demonstration
const mockCourses = [
  {
    id: '1',
    title: 'Beginner Spanish',
    description: 'Introduction to Spanish language basics including vocabulary, grammar, and simple conversations.',
    students: ['user1', 'user2', 'user3'],
    assignments: [
      {
        id: 'a1',
        title: 'Basic Greetings',
        description: 'Practice common Spanish greetings and introductions.',
        dueDate: new Date('2025-03-15'),
        submissions: []
      },
      {
        id: 'a2',
        title: 'Present Tense Verbs',
        description: 'Complete exercises using regular verbs in present tense.',
        dueDate: new Date('2025-03-22'),
        submissions: []
      }
    ]
  },
  {
    id: '2',
    title: 'Intermediate French',
    description: 'Advance your French skills with complex grammar, expanded vocabulary, and cultural insights.',
    students: ['user4', 'user5'],
    assignments: [
      {
        id: 'a3',
        title: 'Past Tense Narrative',
        description: 'Write a short story using past tense verbs.',
        dueDate: new Date('2025-03-18'),
        submissions: []
      }
    ]
  }
];

export default function AdminPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage courses, students, and export data</p>
      </header>
      
      <div className="space-y-10">
        {/* Course Management Section */}
        <section>
          <CourseManagement courses={mockCourses} />
        </section>
        
        {/* Export Data Section */}
        <section>
          <ExportData />
        </section>
      </div>
    </div>
  );
}
