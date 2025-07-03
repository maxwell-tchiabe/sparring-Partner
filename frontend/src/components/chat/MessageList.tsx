'use client';

import { Card } from '@/components/common/Card';
import { formatTime } from '@/lib/utils';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Bot className="h-12 w-12 mb-3" />
        <p className="text-lg font-medium">Start a conversation</p>
        <p className="text-sm">Ask a question or upload content to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex flex-row max-w-[80%]">
            <div className="flex-shrink-0 mr-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <Card variant="outline" className="bg-white">
              <div className="p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {isUser ? (
              <User className="h-5 w-5 text-gray-600" />
            ) : (
              <Bot className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </div>

        {/* Message content */}
        <div>
          <Card
            variant="outline"
            className={`${isUser ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}
          >
            <div className="p-3">{renderMessageContent(message)}</div>
          </Card>
          <div
            className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMessageContent(message: Message) {
  switch (message.content.type) {
    case 'conversation':
      return <p className="whitespace-pre-wrap">{message.content.text}</p>;

    case 'image':
      // Handle both upload preview and server-processed image
      const imageUrl = message.image
        ? `data:image/png;base64,${message.image}`
        : message.content.imageFile
          ? URL.createObjectURL(message.content.imageFile)
          : null;

      if (!imageUrl) {
        return <p className="text-red-500">Image data not available</p>;
      }

      return (
        <div>
          <img
            src={imageUrl}
            alt={message.content.text || 'Image'}
            className="max-w-full rounded-md"
          />
          {message.content.text && (
            <p className="mt-2 text-sm text-gray-600">{message.content.text}</p>
          )}
        </div>
      );

    case 'audio':
      return (
        <div className="space-y-2">
          <div className="bg-gray-100 p-3 rounded-md w-full">
            <audio controls className="h-8">
              <source
                src={
                  message.audio
                    ? `data:audio/wav;base64,${message.audio}`
                    : URL.createObjectURL(message.content.audioFile)
                }
              />
              Your browser does not support the audio element.
            </audio>
          </div>
          {message.content.text && (
            <p className="mt-2 text-sm text-gray-600">{message.content.text}</p>
          )}
        </div>
      );

    case 'pdf':
      return (
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center w-full">
            <a
              href={message.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              <span className="mr-2">📄</span>
              {message.content.title || 'View PDF'}
            </a>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {message.content.pageCount}{' '}
            {message.content.pageCount === 1 ? 'page' : 'pages'}
          </p>
        </div>
      );

    default:
      return <p>Unsupported content type</p>;
  }
}
