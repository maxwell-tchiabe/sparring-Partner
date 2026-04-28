'use client';

import { Modal } from '@/components/common/Modal';
import { useApp } from '@/contexts/AppContext';
import { useNotification } from '@/contexts/NotificationContext';
import { deleteChatSession, updateChatSession } from '@/services/api';
import { formatDistanceToNow, isValid } from 'date-fns';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ChatHistory = ({ onChatSelect }: { onChatSelect?: () => void }) => {
  const {
    chatHistory,
    sessionId,
    setSessionId,
    setChatHistory,
    clearMessages,
  } = useApp();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    sessionId: string | null;
  }>({ isOpen: false, sessionId: null });

  const handleChatSelect = (selectedSessionId: string) => {
    if (editingId) return;
    setSessionId(selectedSessionId);
    router.push(`/chat/${selectedSessionId}`);
    if (onChatSelect) onChatSelect();
  };

  const startEditing = (session: { id: string; title: string }) => {
    setEditingId(session.id);
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
      const updatedHistory = chatHistory.map((chat) =>
        chat.id === sessionId ? { ...chat, title: editTitle } : chat
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
    setEditTitle('');
  };

  const handleDeleteClick = (sessionId: string) => {
    setDeleteModalState({ isOpen: true, sessionId });
  };

  const handleDeleteConfirm = async () => {
    const targetId = deleteModalState.sessionId;
    if (!targetId) return;
    try {
      await deleteChatSession(targetId);
      const updatedHistory = chatHistory.filter((chat) => chat.id !== targetId);
      setChatHistory(updatedHistory);
      if (targetId === window.location.pathname.split('/').pop() || targetId === sessionId) {
        clearMessages();
        setSessionId('');
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setDeleteModalState({ isOpen: false, sessionId: null });
    }
  };

  const formatDate = (date: string | Date) => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      if (!isValid(parsedDate)) return 'Invalid date';
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!chatHistory?.length) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <p className="text-xs text-slate-600 text-center px-4">No sessions yet.<br/>Start a new chat above.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 mb-2">
        Recent Sessions
      </p>
      <div className="space-y-0.5">
        {chatHistory.map((session) => {
          const isActive = sessionId === session.id;
          return (
            <div
              key={session.id}
              onClick={() => !editingId && handleChatSelect(session.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-600/5 border border-cyan-500/20 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              }`}
            >
              {editingId === session.id ? (
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); saveEdit(session.id); }}
                      className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-cyan-400 cursor-pointer transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                      className="p-1.5 rounded-lg hover:bg-pink-500/10 text-pink-400 cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{session.title}</div>
                    <div className={`text-xs truncate mt-0.5 ${isActive ? 'text-cyan-400/70' : 'text-slate-600'}`}>
                      {formatDate(session.created_at)}
                    </div>
                  </div>

                  <div className={`flex-shrink-0 flex items-center ml-1 ${openMenuId === session.id ? 'visible' : 'visible md:invisible md:group-hover:visible'}`}>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEditing(session); }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(session.id); }}
                        className="p-1.5 rounded-lg hover:bg-pink-500/10 text-slate-500 hover:text-pink-400 cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, sessionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone and all messages will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
