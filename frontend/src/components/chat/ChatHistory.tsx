import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDistanceToNow, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { updateChatSession, deleteChatSession } from '@/services/api';

export const ChatHistory = () => {
  const { chatHistory, sessionId, setSessionId, setChatHistory, clearMessages } = useApp();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; sessionId: string | null }>({
    isOpen: false,
    sessionId: null
  });

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
  const { showNotification } = useNotification();

  const saveEdit = async (sessionId: string) => {
    try {
      if (!editTitle.trim()) {
        showNotification('error', 'Chat title cannot be empty');
        return;
      }

      await updateChatSession(sessionId, { title: editTitle });
      
      // Update local state immediately
      const updatedHistory = chatHistory.map(chat => 
        chat._id === sessionId ? { ...chat, title: editTitle } : chat
      );
      setChatHistory(updatedHistory);
      setEditingId(null);
      
      showNotification('success', 'Chat title updated successfully');
    } catch (error) {
      console.error('Failed to update chat title:', error);
      showNotification('error', 'Failed to update chat title. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };
  const handleDeleteClick = (sessionId: string) => {
    setDeleteModalState({ isOpen: true, sessionId });
  };

  const handleDeleteConfirm = async () => {
    const sessionId = deleteModalState.sessionId;
    if (!sessionId) return;
    
    try {
      await deleteChatSession(sessionId);
      // Update local state immediately
      const updatedHistory = chatHistory.filter(chat => chat._id !== sessionId);
      setChatHistory(updatedHistory);
      if (sessionId === window.location.pathname.split('/').pop()) {
        clearMessages(); // Clear messages before navigation
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setDeleteModalState({ isOpen: false, sessionId: null });
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
     <div className="h-[calc(100vh-280px)] overflow-y-auto">
      <div className="space-y-2 pb-4">
        {chatHistory.map((session) => (
          <div
            key={session._id}
            onClick={() => !editingId && handleChatSelect(session._id)}
            className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              sessionId === session._id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'hover:bg-gray-800'
            }`}
          >
            {editingId === session._id ? (  <div className="flex flex-col gap-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-transparent border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveEdit(session._id);
                    }}
                    className="px-3 py-1 hover:bg-blue-700 rounded"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEdit();
                    }}
                    className="px-3 py-1 hover:bg-blue-700 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{session.title}</div>
                  <div className={`text-sm truncate ${
                    sessionId === session._id ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatDate(session.created_at)}
                  </div>
                </div>

                <div className={`flex-shrink-0 ${
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
                    <button                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(session._id);
                      }}
                      className={`p-1.5 rounded-full hover:bg-${sessionId === session._id ? 'blue-700' : 'gray-700'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, sessionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Chat"
        description="Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
