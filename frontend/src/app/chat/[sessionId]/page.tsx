import React from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EvoChat — Session',
};

export default function ChatSessionPage() {
  return (
    <div className="flex flex-col h-screen bg-[#05050A]">
      <header className="bg-[#0A0A0F]/80 backdrop-blur-lg border-b border-white/5 py-3 px-6 flex items-center flex-shrink-0">
        <img
          src="/evochat_logo.png"
          alt="EvoChat Logo"
          className="h-8 w-8 mr-3 object-contain rounded-md shadow-[0_0_12px_-2px_rgba(6,182,212,0.5)]"
        />
        <h1 className="text-lg font-bold text-white tracking-tight">EvoChat</h1>
        <span className="ml-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Online
        </span>
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
