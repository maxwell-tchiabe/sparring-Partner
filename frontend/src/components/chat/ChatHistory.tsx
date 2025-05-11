import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { updateChatSession, deleteChatSession } from '@/services/api';

export const ChatHistory = () => {
  const { chatHistory, sessionId, setSessionId } = useApp();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleChatSelect = (selectedSessionId: string) => {
    if (editingId) return; // Prevent navigation while editing
    setSessionId(selectedSessionId);
    router.push(`/chat/${selectedSessionId}`);
  };

  const startEditing = (session: { _id: string; title: string }) => {
    setEditingId(session._id);
    setEditTitle(session.title);
    setOpenMenuId(null);
  };

  const saveEdit = async (sessionId: string) => {
    try {
      await updateChatSession(sessionId, { title: editTitle });
      // Update local state will happen through API effect
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await deleteChatSession(sessionId);
      // Update local state will happen through API effect
      if (sessionId === window.location.pathname.split('/').pop()) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
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
    <div className="h-[calc(100vh-280px)] overflow-y-auto">      <div className="space-y-2 pb-4">
        {chatHistory.map((session) => (
          <div
            key={session._id}
            className={`group relative p-3 rounded-lg transition-all duration-200 ${
              sessionId === session._id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'hover:bg-gray-800'
            }`}
          >
            <button
              onClick={() => handleChatSelect(session._id)}
              className="w-full text-left"
              aria-label={`Select chat: ${session.title}`}
            >
              {editingId === session._id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-transparent border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveEdit(session._id);
                    }}
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEdit();
                    }}
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="font-medium truncate">{session.title}</div>
                  <div className={`text-sm ${
                    sessionId === session._id ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatDate(session.created_at)}
                  </div>
                </>
              )}
            </button>

            {!editingId && (
              <div className={`absolute right-2 top-3 ${
                openMenuId === session._id ? 'visible' : 'invisible group-hover:visible'
              }`}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(session);
                    }}
                    className={`p-1.5 rounded-full hover:bg-${sessionId === session._id ? 'blue-700' : 'gray-700'}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(session._id);
                    }}
                    className={`p-1.5 rounded-full hover:bg-${sessionId === session._id ? 'blue-700' : 'gray-700'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
