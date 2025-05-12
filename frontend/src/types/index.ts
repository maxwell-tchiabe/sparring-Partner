export interface User {
  id: string;
  name: string;
  email: string;
  progress: UserProgress;
  role: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  created_at: Date;
}

export interface UserProgress {
  vocabulary: VocabularyStats;
  grammar: GrammarScore;
  errorHistory: ErrorRecord[];
  badges: Badge[];
}

export interface VocabularyStats {
  learned: number;
  mastered: number;
  needsReview: number;
}

export interface GrammarScore {
  overall: number; // 0-100
  categories: {
    [key: string]: number; // e.g., "presentPerfect": 75
  };
}

export interface ErrorRecord {
  id: string;
  timestamp: Date;
  category: string; // e.g., "grammar", "vocabulary", "pronunciation"
  detail: string;
  correction: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  icon: string;
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
