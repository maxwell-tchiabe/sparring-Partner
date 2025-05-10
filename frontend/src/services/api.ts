import { Message, MessageContent, TextContent, AudioContent, ChatSession } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Create a new chat session
export const createChatSession = async (): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/api/chat-sessions`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to create chat session');
  }
  return response.json();
};

// Fetch all chat sessions
export const getChatSessions = async (userId?: string): Promise<ChatSession[]> => {
  const url = userId 
    ? `${API_BASE_URL}/api/chat-sessions?user_id=${userId}`
    : `${API_BASE_URL}/api/chat-sessions`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch chat sessions');
  }
  return response.json();
};

// Update a chat session
export const updateChatSession = async (sessionId: string, updateData: { title?: string }): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/chat-sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update chat session');
  }
};

// Delete a chat session
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/chat-sessions/${sessionId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete chat session');
  }
};

// Fetch all messages for a session
export const getMessages = async (sessionId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/api/messages/${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

// Send a text message
export const sendMessage = async (
  sessionId: string,
  text: string = '',
  audioFile: File | null = null,
  imageFile: File | null = null
): Promise<Message> => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  
  if (text) formData.append('message', text);
  if (audioFile) formData.append('audio', audioFile);
  if (imageFile) formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 
        `Request failed with status ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Network request failed'
    );
  }
};

// Send an audio message
export const sendAudioMessage = async (sessionId: string, audioData: Blob): Promise<Message> => {
  const formData = new FormData();
  formData.append('file', audioData, 'audio.wav');

  const response = await fetch(`${API_BASE_URL}/upload-audio?session_id=${sessionId}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to send audio message');
  }
  return response.json();
};