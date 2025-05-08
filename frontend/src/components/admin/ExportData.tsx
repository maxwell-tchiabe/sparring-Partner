"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Download, Check, Calendar, Users, FileText } from 'lucide-react';

export function ExportData() {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = (type: string) => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
      
      // In a real application, this would trigger a CSV download
      const dummyData = generateDummyData(type);
      downloadCSV(dummyData, `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    }, 1500);
  };
  
  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Export user progress and course data as CSV files for further analysis or record-keeping.
        </p>
        
        {exportSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-center text-green-700">
            <Check className="h-5 w-5 mr-2" />
            Export completed successfully!
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExportCard
            title="User Progress"
            description="Export detailed user progress including vocabulary stats, grammar scores, and error history."
            icon={<Users className="h-6 w-6" />}
            onExport={() => handleExport('user_progress')}
            isLoading={exporting}
          />
          
          <ExportCard
            title="Course Data"
            description="Export course information, including enrolled students and assignment details."
            icon={<FileText className="h-6 w-6" />}
            onExport={() => handleExport('course_data')}
            isLoading={exporting}
          />
          
          <ExportCard
            title="Activity Log"
            description="Export user activity logs with timestamps and session details."
            icon={<Calendar className="h-6 w-6" />}
            onExport={() => handleExport('activity_log')}
            isLoading={exporting}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface ExportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onExport: () => void;
  isLoading: boolean;
}

function ExportCard({ title, description, icon, onExport, isLoading }: ExportCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-gray-100 rounded-full mr-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>
      <Button
        onClick={onExport}
        isLoading={isLoading}
        className="w-full mt-auto"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}

// Helper functions for generating and downloading dummy data
function generateDummyData(type: string): string {
  let headers = '';
  let rows = '';
  
  switch (type) {
    case 'user_progress':
      headers = 'User ID,Name,Email,Vocabulary Learned,Vocabulary Mastered,Grammar Score,Errors Count';
      rows = [
        'user1,John Doe,john@example.com,120,85,78,12',
        'user2,Jane Smith,jane@example.com,95,60,82,8',
        'user3,Bob Johnson,bob@example.com,150,110,65,20'
      ].join('\n');
      break;
      
    case 'course_data':
      headers = 'Course ID,Title,Description,Students Count,Assignments Count';
      rows = [
        'course1,Beginner Spanish,Introduction to Spanish language,15,8',
        'course2,Intermediate French,Advance your French skills,12,10',
        'course3,Business English,English for professional settings,20,12'
      ].join('\n');
      break;
      
    case 'activity_log':
      headers = 'User ID,Activity Type,Timestamp,Duration (min),Details';
      rows = [
        'user1,Chat Session,2025-03-01T10:15:00,25,Conversation practice',
        'user2,Exercise,2025-03-02T14:30:00,15,Grammar quiz',
        'user3,Document Upload,2025-03-03T09:45:00,5,PDF analysis'
      ].join('\n');
      break;
  }
  
  return `${headers}\n${rows}`;
}

function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
