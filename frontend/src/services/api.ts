import {
  Message,
  ChatSession,
  DashboardStats,
  AIInsight,
  Badge,
  LearningError,
} from '@/types';
import { supabase } from '@/lib/supabase';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function getAuthHeaders() {
  const session = await supabase.auth.getSession();

  const accessToken = session.data.session?.access_token;
  if (!accessToken) {
    throw new Error('No authentication token available');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

// Create a new chat session
export const createChatSession = async (): Promise<ChatSession> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/chat-sessions`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) {
    throw new Error('Failed to create chat session');
  }
  return response.json();
};

// Fetch all chat sessions
export const getChatSessions = async (
  userId?: string
): Promise<ChatSession[]> => {
  const headers = await getAuthHeaders();
  const url = userId
    ? `${API_BASE_URL}/api/chat-sessions?user_id=${userId}`
    : `${API_BASE_URL}/api/chat-sessions`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch chat sessions');
  }
  return response.json();
};

// Update a chat session
export const updateChatSession = async (
  sessionId: string,
  updateData: { title?: string }
): Promise<void> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/chat-sessions/${sessionId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update chat session');
  }
};

// Delete a chat session
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/chat-sessions/${sessionId}`,
    {
      method: 'DELETE',
      headers,
    }
  );
  if (!response.ok) {
    throw new Error('Failed to delete chat session');
  }
};

// Fetch all messages for a session
export const getMessages = async (sessionId: string): Promise<Message[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/messages/${sessionId}`, {
    headers,
  });
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
  const session = await supabase.auth.getSession();
  const formData = new FormData();
  formData.append('session_id', sessionId);

  if (text) formData.append('message', text);
  if (audioFile) formData.append('audio', audioFile);
  if (imageFile) formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        throw new Error(
          'Too many requests. Please wait before sending more messages.'
        );
      }
      throw new Error(
        errorData.detail || `Request failed with status ${response.status}`
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
export const sendWebrtcOffer = async (
  offer: RTCSessionDescriptionInit
): Promise<any> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/webrtc/offer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: headers.Authorization,
    },
    body: JSON.stringify({
      sdp: offer.sdp,
      type: offer.type,
      webrtc_id: Math.random().toString(36).substring(7),
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to send webrtc offer');
  }
  return response.json();
};

// Dashboard API calls
export const getDashboardStats = async (
  userId: string
): Promise<DashboardStats> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/stats/${userId}`,
    {
      headers,
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};

export const getAIInsights = async (userId: string): Promise<AIInsight[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/insights/${userId}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch AI insights');
  }
  return response.json();
};

export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/badges/${userId}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch user badges');
  }
  return response.json();
};

export const getLearningErrors = async (
  userId: string
): Promise<LearningError[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/errors/${userId}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch learning errors');
  }
  return response.json();
};
