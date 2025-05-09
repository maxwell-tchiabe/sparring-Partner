import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export const ChatHistory = () => {
  const { chatHistory, sessionId, setSessionId } = useApp();
  const router = useRouter();

  const handleChatSelect = (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    router.push('/chat'); // Navigate to the chat page
  };

  return (
    <div className="h-[calc(100vh-280px)] overflow-y-auto">
      <div className="space-y-2 pb-4">
        {chatHistory.map((session) => (
          <button
            key={session.id}
            onClick={() => handleChatSelect(session.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
              sessionId === session.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'hover:bg-gray-800 rounded-md'
            }`}
          >
            <div className="font-medium truncate">{session.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
