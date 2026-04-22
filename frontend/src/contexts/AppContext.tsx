'use client';
import {
  createChatSession,
  getChatSessions,
  getMessages,
  sendMessage,
} from '@/services/api';
import { ChatSession, Message, User } from '@/types';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
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
  showUpgrade: boolean;
  sessionId: string;
  chatHistory: ChatSession[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setUser: (user: User | null) => void;
  fetchMessages: (sid: string) => Promise<void>;
  startNewSession: () => Promise<string>;
  setSessionId: (id: string) => void;
  setChatHistory: (history: ChatSession[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const router = useRouter();
  const { showNotification } = useNotification();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Sync local user state with auth user
  useEffect(() => {
    if (authUser) {
      setUser(authUser as any);
    } else {
      setUser(null);
    }
  }, [authUser]);

  // Load chat history from API when auth is ready
  useEffect(() => {
    const loadChatHistory = async () => {
      if (authLoading || !authUser) return;

      try {
        const sessions = await getChatSessions();
        setChatHistory(sessions);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    // Check URL for session ID
    const pathSegments = window.location.pathname.split('/');
    const urlSessionId = pathSegments[2];

    if (urlSessionId?.trim()) {
      setSessionId(urlSessionId);
    }

    loadChatHistory();
  }, [authLoading, authUser]);


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

  // Load messages when session changes and auth is ready
  useEffect(() => {
    if (sessionId && !authLoading && authUser) {
      fetchMessages(sessionId);
    }
  }, [sessionId, authLoading, authUser]);

  const startNewSession = async () => {
    try {
      console.log('Creating new chat session...');
      const newSession = await createChatSession();

      // Update state
      setChatHistory((prev) => {
        return [...prev, newSession];
      });

      setSessionId(newSession.id);
      clearMessages();

      return newSession.id;
    } catch (error) {
      console.error('Failed to create new session:', error);
      throw error;
    }
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
          showNotification('error', 'Failed to send message.');
          if (
            error.message &&
            error.message.toLowerCase().includes('too many requests')
          ) {
            setShowUpgrade(true);
          }
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
        showUpgrade,
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
