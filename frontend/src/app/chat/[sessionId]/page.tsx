import React from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface ChatSessionPageProps {
  params: {
    sessionId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ChatSessionPage({
  params,
  searchParams,
}: ChatSessionPageProps) {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <h1 className="text-xl font-semibold">Sparring Partner Chat</h1>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
