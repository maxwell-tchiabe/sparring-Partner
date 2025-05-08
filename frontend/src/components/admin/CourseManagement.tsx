"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Course } from '@/types';
import { Plus, Edit, Trash2, Users, FileText } from 'lucide-react';

interface CourseManagementProps {
  courses: Course[];
}

export function CourseManagement({ courses }: CourseManagementProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>
      
      {courses.length === 0 ? (
        <Card variant="outline">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Create your first course to start assigning lessons and tracking student progress.
            </p>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onSelect={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}
      
      {selectedCourse && (
        <CourseDetail 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  return (
    <Card 
      variant="outline" 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-gray-500 text-sm">
          <Users className="h-4 w-4 mr-1" />
          <span>{course.students.length} students</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <FileText className="h-4 w-4 mr-1" />
          <span>{course.assignments.length} assignments</span>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseDetail({ course, onClose }: { course: Course; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'students' | 'assignments'>('students');
  
  return (
    <Card variant="outline">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{course.title}</CardTitle>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-gray-600">{course.description}</p>
        </div>
        
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </button>
          </div>
        </div>
        
        {activeTab === 'students' ? (
          <div>
            {course.students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students enrolled yet.</p>
            ) : (
              <div className="space-y-2">
                {/* Student list would go here */}
                <p>Student list placeholder</p>
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Students
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {course.assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assignments created yet.</p>
            ) : (
              <div className="space-y-2">
                {/* Assignment list would go here */}
                <p>Assignment list placeholder</p>
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
