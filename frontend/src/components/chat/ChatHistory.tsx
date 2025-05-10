import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';

export const ChatHistory = () => {
  const { chatHistory, sessionId, setSessionId } = useApp();
  const router = useRouter();

  const handleChatSelect = (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    router.push('/chat');
  };

  const formatDate = (date: Date) => {
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (!chatHistory?.length) {
    return (
      <div className="h-[calc(100vh-280px)] flex items-center justify-center text-gray-500">
        No chat history available
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-280px)] overflow-y-auto">
      <div className="space-y-2 pb-4">
        {chatHistory.map((session) => (
          <button
            key={session._id}
            onClick={() => handleChatSelect(session._id)}
            aria-label={`Select chat: ${session.title}`}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
              sessionId === session._id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'hover:bg-gray-800 rounded-md'
            }`}
          >
            <div className="font-medium truncate">{session.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(session.created_at)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
