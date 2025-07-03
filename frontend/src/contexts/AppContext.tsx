'use client';
import {
  createChatSession,
  getChatSessions,
  getMessages,
  sendMessage,
} from '@/services/api';
import { ChatSession, Message, User } from '@/types';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AppContextType {
  user: User | null;
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
  chatHistory: ChatSession[];
  addMessage: (message: Omit<Message, '_id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setUser: (user: User | null) => void;
  fetchMessages: (sid: string) => Promise<void>;
  startNewSession: () => Promise<string>;
  setSessionId: (id: string) => void;
  setChatHistory: (history: ChatSession[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const router = useRouter();

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

    // Check URL for session ID
    const pathSegments = window.location.pathname.split('/');
    const urlSessionId = pathSegments[2];

    if (urlSessionId?.trim()) {
      setSessionId(urlSessionId);
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
      console.log('Fetched messages:', fetchedMessages);
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
      console.log('Creating new chat session...');
      const newSession = await createChatSession();
      console.log('Created chat session:', newSession);

      // Update state
      setChatHistory((prev) => {
        console.log('Updating chat history with new session');
        return [...prev, newSession];
      });

      setSessionId(newSession._id);
      console.log('Set session ID to:', newSession._id);

      clearMessages();

      return newSession._id;
    } catch (error) {
      console.error('Failed to create new session:', error);
      throw error;
    }
  };

  const addMessage = (messageData: Omit<Message, '_id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      _id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
    };

    // Add the message first so it shows up immediately in the UI
    setMessages((prev) => [...prev, newMessage]);

    // If this is a user message, send it to the API
    if (messageData.sender === 'user') {
      setIsLoading(true);

      // Get the path segments to check current route
      const pathSegments = window.location.pathname.split('/');
      const currentSessionIdFromUrl = pathSegments[2];

      // Navigate to the chat session if it's the first message or we're not in the correct session
      if (
        !currentSessionIdFromUrl ||
        currentSessionIdFromUrl !== messageData.sessionId
      ) {
        console.log('Navigating to session:', messageData.sessionId);
        router.push(`/chat/${messageData.sessionId}`);
      }

      sendMessage(
        messageData.sessionId,
        messageData.content.text || '',
        messageData.content.audioFile,
        messageData.content.imageFile
      )
        .then(async (response) => {
          setMessages((prev) => [...prev, response]);
          // Refresh chat history to update UI
          const sessions = await getChatSessions();
          setChatHistory(sessions);
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
        setChatHistory,
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
