'use client';
import { useTimer } from '@/app/hooks/hook';
import { Button } from '@/components/common/Button';
import { useApp } from '@/contexts/AppContext';
import { MessageContent } from '@/types';
import { Mic, PaperclipIcon, Send, StopCircle, X, BrainCircuit } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MessageList } from './MessageList';
import Link from 'next/link';

export function ChatInterface() {
  const {
    messages,
    showUpgrade,
    addMessage,
    isLoading,
    sessionId,
    startNewSession,
  } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<
    { file: File; preview: string; type: string; mimeType?: string }[]
  >([]);
  const shouldAttachRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { duration: recordingDuration, reset: resetTimer } = useTimer(isRecording);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  const initAudioAnalyzer = async (stream: MediaStream) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 256;
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyzer);
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    setAudioContext(audioCtx);
    setAnalyser(analyzer);
    
    // Add volume analysis
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    const updateVolume = () => {
      // Check if we are still analyzing (if analyser is still the same)
      if (analyzer.context.state === 'closed') return;
      
      analyzer.getByteFrequencyData(dataArray);
      let values = 0;
      for (let i = 0; i < dataArray.length; i++) {
        values += dataArray[i];
      }
      const average = values / dataArray.length;
      setVolume(average);
      requestAnimationFrame(updateVolume);
    };
    updateVolume();
    visualizeWaveform();
  };

  const visualizeWaveform = () => {
    if (!analyser || !waveformRef.current) return;
    const canvas = waveformRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      setWaveformData(dataArray);
      // Dark waveform style
      canvasCtx.fillStyle = 'rgba(15, 17, 26, 0)';
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      canvasCtx.beginPath();
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Detect the actual MIME type the browser supports for MediaRecorder
  const getSupportedMimeType = (): string => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ];
    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        resetTimer();
        setAudioChunks([]);
        setAudioPreviewUrl(null);
        shouldAttachRef.current = true;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Log track status
        stream.getAudioTracks().forEach(track => {
          console.log(`[Microphone] Track: "${track.label}" State: ${track.readyState} Muted: ${track.muted}`);
          track.onmute = () => console.warn(`[Microphone] Track muted: ${track.label}`);
          track.onunmute = () => console.log(`[Microphone] Track unmuted: ${track.label}`);
        });
        // Detect real browser MIME type (not 'audio/wav' which is never natively recorded)
        const mimeType = getSupportedMimeType();
        const recorderOptions = mimeType ? { mimeType } : {};
        const recorder = new MediaRecorder(stream, recorderOptions);
        const actualMime = recorder.mimeType || mimeType || 'audio/webm';
        // Derive a sensible file extension
        const ext = actualMime.includes('ogg') ? 'ogg' : actualMime.includes('mp4') ? 'mp4' : 'webm';
        console.log(`[MediaRecorder] Initializing with mimeType: ${actualMime}`);
        let recordingChunks: Blob[] = [];
        await initAudioAnalyzer(stream);
        recorder.ondataavailable = (e) => { 
          if (e.data.size > 0) {
            recordingChunks.push(e.data); 
            console.log(`[MediaRecorder] Chunk received: ${e.data.size} bytes. Total chunks: ${recordingChunks.length}`);
          } 
        };
        recorder.onstop = () => {
          console.log(`[MediaRecorder] Stopped. Total chunks collected: ${recordingChunks.length}`);
          if (shouldAttachRef.current && recordingChunks.length > 0) {
            const audioBlob = new Blob(recordingChunks, { type: actualMime });
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(`[MediaRecorder] Blob created. Size: ${audioBlob.size} bytes. URL: ${audioUrl}`);
              setAttachments(() => [{
                file: new File([audioBlob], `recording.${ext}`, { type: actualMime }),
                preview: audioUrl,
                type: 'audio',
                mimeType: actualMime,
              }]);
          } else {
            console.warn(`[MediaRecorder] No recording to attach. shouldAttach: ${shouldAttachRef.current}, chunks: ${recordingChunks.length}`);
          }
          if (audioContext && audioContext.state !== 'closed') audioContext.close().catch(console.error);
          setAudioContext(null);
          setAnalyser(null);
          setWaveformData(null);
          stream.getTracks().forEach((track) => track.stop());
          shouldAttachRef.current = false;
        };
        // Request data every 250ms so we always have chunks even for short recordings
        recorder.start(250);
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      }
    } else {
      if (mediaRecorder) { setIsRecording(false); mediaRecorder.stop(); }
    }
  };

  const cancelRecording = () => {
    shouldAttachRef.current = false;
    if (mediaRecorder && mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder.stop();
    }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    if (audioContext && audioContext.state !== 'closed') audioContext.close().catch(console.error);
    setIsRecording(false);
    setMediaRecorder(null);
    setWaveformData(null);
    setAudioContext(null);
    setAnalyser(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
      if (audioContext && audioContext.state !== 'closed') audioContext.close().catch(console.error);
    };
  }, [audioContext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'], 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map((file) => {
        const type = file.type.startsWith('image/') ? 'image' : 'pdf';
        return { file, preview: type === 'image' ? URL.createObjectURL(file) : '', type };
      });
      setAttachments((prev) => [...prev, ...newAttachments]);
    },
  });

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      try {
        currentSessionId = await startNewSession();
        if (!currentSessionId) return;
      } catch (error) { console.error('Error creating new session:', error); return; }
    }

    let content: MessageContent;
    if (attachments.length > 0) {
      const attachment = attachments[0];
      if (attachment.type === 'image') {
        content = { type: 'image', imageFile: attachment.file, text: inputValue || 'Uploaded image' };
      } else if (attachment.type === 'audio') {
        content = { type: 'audio', audioFile: attachment.file, text: inputValue || '' };
      } else {
        content = { type: 'pdf', pdfUrl: URL.createObjectURL(attachment.file), pageCount: 0, text: inputValue || 'Uploaded PDF' };
      }
    } else {
      content = { type: 'conversation', text: inputValue };
    }

    addMessage({ sender: 'user', content, sessionId: currentSessionId });
    setInputValue('');
    attachments.forEach(attachment => {
      if (attachment.preview && !attachment.preview.startsWith('data:')) {
        URL.revokeObjectURL(attachment.preview);
      }
    });
    setAttachments([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      if (newAttachments[index].preview) URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#05050A]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#0A0A0F]">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                {attachment.type === 'image' ? (
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/10">
                    <img src={attachment.preview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : attachment.type === 'audio' ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl min-w-[240px] sm:min-w-[320px] shadow-xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex-shrink-0 bg-cyan-500/20 border border-cyan-500/30 p-2 rounded-lg shadow-inner relative">
                        <Mic className="h-4 w-4 text-cyan-400" />
                        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      </div>
                      <span className="text-xs md:text-sm font-medium text-slate-300 truncate">Recording ({formatTime(recordingDuration)})</span>
                    </div>
                    <div className="w-full sm:flex-1">
                      <audio 
                        controls 
                        className="h-8 w-full filter invert hue-rotate-180 opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLAudioElement;
                          console.error(`[AudioPreview] Error code: ${target.error?.code}. Message: ${target.error?.message}`);
                        }}
                        onPlay={() => console.log(`[AudioPreview] Playing preview: ${attachment.preview}`)}
                      >
                        <source src={attachment.preview} type={attachment.mimeType || 'audio/webm'} />
                      </audio>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 w-20 bg-slate-800/60 border border-white/10 rounded-xl">
                    <span className="text-xs text-slate-400 font-mono">PDF</span>
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 h-6 w-6 bg-slate-700 border border-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 cursor-pointer transition-colors"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/5 p-4 bg-[#0A0A0F]">
        <div
          className={`border ${isDragActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 hover:border-white/20'
            } bg-slate-900/50 backdrop-blur-sm rounded-2xl p-3 transition-all duration-200`}
        >
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-3">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 bg-red-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-red-300 font-mono">
                  {formatTime(recordingDuration)}
                </span>
              </div>
              <canvas
                ref={waveformRef}
                width="200"
                height="30"
                className="w-32 h-8 rounded-lg"
              />
              <div className="flex-1 px-4 hidden sm:block">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-75 ${volume > 50 ? 'bg-cyan-300' : 'bg-cyan-500'}`}
                    style={{ 
                      width: `${Math.min(100, (volume / 128) * 100)}%`,
                      boxShadow: volume > 30 ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
                    }}
                  ></div>
                </div>
              </div>
              <button
                onClick={cancelRecording}
                className="ml-3 px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message EvoChat..."
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none p-2 max-h-32 bg-transparent text-slate-200 placeholder-slate-600 text-sm"
                rows={1}
              />
            </div>

            <div className="flex items-center gap-1">
              {/* File attachment */}
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button
                  type="button"
                  disabled={isRecording}
                  className="flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Attach file"
                >
                  <PaperclipIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Recording button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all cursor-pointer ${isRecording
                  ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                title={isRecording ? 'Stop recording' : 'Record audio'}
              >
                {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Send button */}
              <button
                type="button"
                disabled={(!inputValue.trim() && attachments.length === 0) || isLoading || isRecording}
                onClick={handleSendMessage}
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.7)] hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-2">
          EvoChat may produce errors. Verify important information.
        </p>
      </div>

      {/* Upgrade Banner */}
      {showUpgrade && (
        <div className="flex flex-col sm:flex-row justify-center items-center bg-gradient-to-r from-amber-950/50 to-orange-950/50 border border-amber-500/20 rounded-2xl p-4 mx-4 mb-4 gap-3 sm:gap-0 backdrop-blur-sm">
          <span className="text-amber-200 font-semibold mb-2 sm:mb-0 sm:mr-4 text-sm">
            You've reached the free limit. Go Premium for unlimited access.
          </span>
          <Link href="/upgrade" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]">
              Upgrade to Premium
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
