"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Mic, PaperclipIcon, Send, X, StopCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useApp } from '@/contexts/AppContext';
import { MessageContent } from '@/types';
import { MessageList } from './MessageList';
import { useTimer } from '@/app/hooks/hook';

export function ChatInterface() {  
  const { messages, addMessage, isLoading, sessionId } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<{ file: File; preview: string; type: string }[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio recording states
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { duration: recordingDuration, reset: resetTimer } = useTimer(isRecording);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);
  const [isPreviewingRecording, setIsPreviewingRecording] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio context and analyzer
  const initAudioAnalyzer = async (stream: MediaStream) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 256;
    
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyzer);
    
    setAudioContext(audioCtx);
    setAnalyser(analyzer);
    
    // Start waveform visualization
    visualizeWaveform();
  };

  // Visualize waveform
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
      
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    
    draw();
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/stop recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        // Reset all recording states
        resetTimer();
        setAudioChunks([]);
        setAudioPreviewUrl(null);
        setIsPreviewingRecording(false);
  
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
  
        // Initialize audio analyzer
        await initAudioAnalyzer(stream);
  
        // Set up event handlers
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
  
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioPreviewUrl(audioUrl);
          setAudioChunks(chunks);
  
          // Clean up audio context
          if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(console.error);
          }
  
          setAudioContext(null);
          setAnalyser(null);
          setWaveformData(null);
  
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
  
        // Start recording
        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
  
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      }
    } else {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        setMediaRecorder(null);
        setIsPreviewingRecording(true);
      }
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  
    // Clean up
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(console.error);
    }
  
    // Reset all recording-related states
    setAudioPreviewUrl(null);
    setIsPreviewingRecording(false);
    setIsRecording(false);
    setMediaRecorder(null);
    setWaveformData(null);
    setAudioContext(null);
    setAnalyser(null);
    setAudioChunks([]);
  };  

  // Confirm and attach recording
  const confirmRecording = () => {
    if (!audioPreviewUrl) return;
    
    setAttachments([{
      file: new File([new Blob(audioChunks)], 'recording.wav', { type: 'audio/wav' }),
      preview: audioPreviewUrl,
      type: 'audio'
    }]);
    
    setIsPreviewingRecording(false);
    setAudioPreviewUrl(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      };
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error);
      };
    };
  }, [audioContext]);
  // Handle file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      const newAttachments = acceptedFiles.map(file => {
        const type = file.type.startsWith('image/') ? 'image' : 'pdf';
        return {
          file,
          preview: type === 'image' ? URL.createObjectURL(file) : '',
          type
        };
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    // Create message content based on attachments and text
    let content: MessageContent;

    if (attachments.length > 0) {
      // Handle attachments
      const attachment = attachments[0]; // For simplicity, we'll just use the first attachment
      
      if (attachment.type === 'image') {
        content = {
          type: 'image',
          imageFile: attachment.file,
          text: inputValue || 'Uploaded image'
        };
      } else if (attachment.type === 'audio') {
        content = {
          type: 'audio',
          audioFile: attachment.file,
          text: inputValue || ''
        };
      } else {
        content = {
          type: 'pdf',
          pdfUrl: URL.createObjectURL(attachment.file),
          pageCount: 0, 
          title: attachment.file.name
        };
      }
    } else {
      // Text-only message
      content = {
        type: 'conversation',
        text: inputValue
      };
    }

    // Add message to context   
    addMessage({
      sender: 'user',
      content,
      sessionId
    });

    // Reset state
    setInputValue('');
    setAttachments([]);
    
    // Focus input for next message
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      
      // Revoke the object URL to avoid memory leaks
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview);
      }
      
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Recording preview modal */}
      {isPreviewingRecording && audioPreviewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Recording Preview</h3>
            
            <div className="mb-4">
              <canvas 
                ref={waveformRef} 
                width="400" 
                height="100"
                className="w-full h-20 bg-gray-100 rounded"
              />
            </div>
            
            <audio controls src={audioPreviewUrl} className="w-full mb-4" />
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Duration: {formatTime(recordingDuration)}</span>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={cancelRecording}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Discard
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={confirmRecording}
                >
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                  Attach
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                {attachment.type === 'image' ? (
                  <div className="relative h-20 w-20 rounded overflow-hidden">
                    <img
                      src={attachment.preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : attachment.type === 'audio' ? (
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded w-full">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <Mic className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Recording ({formatTime(recordingDuration)})</span>
                    </div>
                    <audio controls src={attachment.preview} className="h-8" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 w-20 bg-gray-100 rounded">
                    <span className="text-xs text-gray-500">PDF</span>
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 h-6 w-6 bg-gray-800 rounded-full flex items-center justify-center text-white"
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
      <div className="border-t border-gray-200 p-4">
        <div
          className={`border ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } rounded-lg p-2`}
        >
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-between bg-red-50 p-2 rounded mb-2">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-red-700">
                  Recording: {formatTime(recordingDuration)}
                </span>
              </div>
              <canvas 
                ref={waveformRef} 
                width="200" 
                height="30"
                className="w-32 h-8 bg-white rounded"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelRecording}
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          )}
          
          <div className="flex items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none p-2 max-h-32"
                rows={1}
              />
            </div>
            
            <div className="flex space-x-2 items-center">
              {/* File attachment button */}
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isRecording}
                >
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Audio recording button */}
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className={`${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={toggleRecording}
                disabled={isPreviewingRecording}
              >
                {isRecording ? (
                  <StopCircle className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              
              {/* Send button */}
              <Button
                variant="primary"
                size="sm"
                type="button"
                disabled={(!inputValue.trim() && attachments.length === 0) || isLoading || isRecording}
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

