"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Message, ChatSession } from '@/types';
import { sendMessage, getMessages, createChatSession, getChatSessions } from '@/services/api';

interface AppContextType {
  user: User | null;
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
  chatHistory: ChatSession[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setUser: (user: User | null) => void;
  fetchMessages: (sid: string) => Promise<void>;
  startNewSession: () => Promise<void>;
  setSessionId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  // Load chat history from API on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const sessions = await getChatSessions();
        setChatHistory(sessions);
        console.log('Chat history loaded:', sessions);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }

    loadChatHistory();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const fetchMessages = async (sid: string) => {
    try {
      setIsLoading(true);
      const fetchedMessages = await getMessages(sid);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages when session changes
  useEffect(() => {
    if (sessionId) {
      console.log('Fetching messages for session:', sessionId);
      fetchMessages(sessionId);
    }
  }, [sessionId]);

  const startNewSession = async () => {
    try {
      const newSession = await createChatSession();
      setChatHistory(prev => [...prev, newSession]);
      setSessionId(newSession._id);
      clearMessages();
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // If this is a user message, send it to the API
    if (messageData.sender === 'user') {
      setIsLoading(true);
      
      sendMessage(messageData.sessionId, messageData.content.text || '', messageData.content.audioFile, messageData.content.imageFile)
        .then((response) => {
          setMessages((prev) => [...prev, response]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
          setIsLoading(false);
        });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        messages,
        isLoading,
        sessionId,
        chatHistory,
        addMessage,
        clearMessages,
        setUser,
        fetchMessages,
        startNewSession,
        setSessionId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
