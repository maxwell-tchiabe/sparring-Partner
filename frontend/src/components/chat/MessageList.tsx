import React from 'react';
import { formatTime } from '@/lib/utils';
import { Message } from '@/types';
import { BrainCircuit, User, FileText, Mic } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-white/5 flex items-center justify-center mb-5 shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)]">
          <BrainCircuit className="h-8 w-8 text-cyan-500/60" />
        </div>
        <p className="text-base font-semibold text-slate-400">Start a conversation</p>
        <p className="text-sm text-slate-600 mt-1">Ask a question or upload content to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 py-4 w-full max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-end gap-3 max-w-[80%]">
            {/* Bot avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_12px_-2px_rgba(6,182,212,0.5)]">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4">
              <div className="flex space-x-1.5 items-center h-4">
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 md:gap-3 max-w-[92%] sm:max-w-[85%] md:max-w-[80%]`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mb-1">
          {isUser ? (
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shadow-lg">
              <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
            </div>
          ) : (
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)]">
              <BrainCircuit className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
          )}
        </div>

        {/* Bubble + timestamp */}
        <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={
              isUser
                ? 'bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 backdrop-blur-sm text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 md:px-4 md:py-3 shadow-[0_4px_15px_-3px_rgba(79,70,229,0.4)] border border-white/10'
                : 'bg-slate-800/60 backdrop-blur-md border border-white/10 text-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 md:px-4 md:py-3 shadow-xl'
            }
          >
            <div className="text-sm md:text-base leading-relaxed">
              {renderMessageContent(message, isUser)}
            </div>
          </div>

          {/* Timestamp */}
          <span className="text-[10px] md:text-xs text-slate-500 px-1 font-medium opacity-70">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({ audioData, audioFile, isUser }: { audioData?: string; audioFile?: File; isUser: boolean }) {
  const [url, setUrl] = React.useState<string>('');
  const [mimeType, setMimeType] = React.useState<string>('audio/wav');
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    let objectUrl = '';
    if (audioData) {
      // Heuristic to detect MIME type from base64 if possible
      const header = audioData.substring(0, 32);
      const detectedMime = audioData.startsWith('GkXfo') ? 'audio/webm' : 
                          audioData.startsWith('SUQz') ? 'audio/mpeg' : 
                          audioData.startsWith('RIFF') ? 'audio/wav' :
                          'audio/wav';
      
      console.log(`[AudioPlayer] Loading base64 audio. Header: ${header.substring(0, 10)}... Detected Mime: ${detectedMime}`);
      setMimeType(detectedMime);
      setUrl(`data:${detectedMime};base64,${audioData}`);
    } else if (audioFile) {
      objectUrl = URL.createObjectURL(audioFile);
      console.log(`[AudioPlayer] Loading File object: ${audioFile.name} (${audioFile.type}) Size: ${audioFile.size} bytes`);
      setMimeType(audioFile.type);
      setUrl(objectUrl);
    }

    return () => {
      if (objectUrl) {
        console.log(`[AudioPlayer] Revoking URL: ${objectUrl}`);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [audioData, audioFile]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    console.error(`[AudioPlayer] Error code: ${target.error?.code}. Message: ${target.error?.message}. Source: ${target.src}`);
  };

  if (!url) return null;

  return (
    <div className="w-full min-w-[200px] sm:min-w-[280px]">
      <div className={`flex items-center gap-3 p-2 rounded-xl ${isUser ? 'bg-indigo-900/30' : 'bg-slate-900/40'} border border-white/5 shadow-inner`}>
        <div className={`flex-shrink-0 p-2 rounded-lg ${isUser ? 'bg-indigo-500/20 border border-indigo-400/30' : 'bg-cyan-500/10 border border-cyan-500/20'} shadow-sm`}>
          <div className="relative">
            <Mic className={`h-4 w-4 ${isUser ? 'text-indigo-300' : 'text-cyan-400'}`} />
            <div className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${isUser ? 'bg-indigo-400' : 'bg-cyan-400'} animate-pulse`}></div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <audio 
            ref={audioRef}
            controls 
            className="h-8 w-full filter invert hue-rotate-180 opacity-90 hover:opacity-100 transition-opacity"
            onError={handleAudioError}
            onPlay={() => console.log(`[AudioPlayer] Started playing: ${url.substring(0, 50)}...`)}
          >
            <source src={url} type={mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}

function ImageMessage({ imageData, imageFile, alt }: { imageData?: string; imageFile?: File; alt?: string }) {
  const [url, setUrl] = React.useState<string>('');

  React.useEffect(() => {
    let objectUrl = '';
    if (imageData) {
      setUrl(`data:image/png;base64,${imageData}`);
    } else if (imageFile) {
      objectUrl = URL.createObjectURL(imageFile);
      setUrl(objectUrl);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageData, imageFile]);

  if (!url) {
    return <p className="text-red-400">Image data not available</p>;
  }

  return (
    <img
      src={url}
      alt={alt || 'Image'}
      className="max-w-full rounded-xl border border-white/10"
    />
  );
}

function renderMessageContent(message: Message, isUser: boolean) {
  const subtleText = isUser ? 'text-indigo-200' : 'text-slate-400';
  const linkClass = isUser
    ? 'text-cyan-300 hover:underline'
    : 'text-cyan-400 hover:underline';

  switch (message.content.type) {
    case 'conversation':
      return <p className="whitespace-pre-wrap">{message.content.text}</p>;

    case 'image': {
      return (
        <div>
          <ImageMessage 
            imageData={message.image} 
            imageFile={message.content.imageFile} 
            alt={message.content.text} 
          />
          {message.content.text && (
            <p className={`mt-2 text-sm ${subtleText}`}>{message.content.text}</p>
          )}
        </div>
      );
    }

    case 'audio':
      return (
        <>
          <AudioPlayer 
            audioData={message.audio} 
            audioFile={message.content.audioFile} 
            isUser={isUser} 
          />
          {message.content.text && (
            <p className={`text-sm ${subtleText} mt-2`}>{message.content.text}</p>
          )}
        </>
      );

    case 'pdf':
      return (
        <div className="flex flex-col">
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isUser ? 'bg-indigo-700/50' : 'bg-slate-700/50'} border border-white/5`}>
            <div className={`p-2 rounded-lg ${isUser ? 'bg-indigo-600/50' : 'bg-slate-600/50'}`}>
              <FileText className={`h-5 w-5 ${isUser ? 'text-indigo-200' : 'text-slate-300'}`} />
            </div>
            <a
              href={message.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium ${linkClass}`}
            >
              {message.content.title || 'View PDF'}
            </a>
          </div>
          {message.content.pageCount != null && (
            <p className={`mt-1.5 text-xs ${subtleText}`}>
              {message.content.pageCount} {message.content.pageCount === 1 ? 'page' : 'pages'}
            </p>
          )}
        </div>
      );

    default:
      return <p className="text-slate-500 italic text-xs">Unsupported content type</p>;
  }
}
