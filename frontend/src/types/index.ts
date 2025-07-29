export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  created_at: Date;
}

export interface DashboardStats {
  vocabulary: {
    learned: number;
    total: number;
  };
  conversations: {
    completed: number;
    total: number;
  };
  grammarScore: {
    current: number;
    total: number;
  };
  weeklyProgress: {
    daysActive: number;
    daysTotal: number;
  };
}

export interface AIInsight {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning';
  content: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

export interface LearningError {
  id: string;
  timestamp: Date;
  category: string;
  detail: string;
  correction: string;
}

export interface Message {
  _id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  content: MessageContent;
  timestamp: Date;
  audio?: string;
  image?: string;
  pdf?: string;
}

export type MessageContent =
  | TextContent
  | AudioContent
  | ImageContent
  | PDFContent;

export interface TextContent {
  type: 'conversation';
  text: string;
  audioFile?: File;
  imageFile?: File;
  pdfUrl?: string;
}

export interface AudioContent {
  type: 'audio';
  audioFile: File;
  text?: string;
  imageFile?: File;
}

export interface ImageContent {
  type: 'image';
  imageFile: File;
  text?: string;
  audioFile?: File;
}

export interface PDFContent {
  type: 'pdf';
  pdfUrl: string;
  pageCount: number;
  title?: string;
  text?: string;
  imageFile?: File;
  audioFile?: File;
}

export interface ErrorRecord {
  id: string;
  category: string;
  detail: string;
  correction: string;
  timestamp: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  students: string[]; // User IDs
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  submissions: Submission[];
}

export interface Submission {
  userId: string;
  submittedAt: Date;
  content: string;
  feedback?: string;
  score?: number;
}
