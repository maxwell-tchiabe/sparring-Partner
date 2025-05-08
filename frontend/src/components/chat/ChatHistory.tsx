import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

export const ChatHistory = () => {
  const { chatHistory, sessionId, setSessionId } = useApp();

  return (
    <div className="space-y-2">
      {chatHistory.map((session) => (
        <button
          key={session.id}
          onClick={() => setSessionId(session.id)}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            sessionId === session.id
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="font-medium truncate">{session.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
          </div>
        </button>
      ))}
    </div>
  );
};
