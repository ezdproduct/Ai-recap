import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from './Icons';

interface LiveRecorderProps {
  onClear: () => void;
  onAudioReady: (blob: Blob, source: 'upload' | 'record') => void;
}

const LiveRecorder: React.FC<LiveRecorderProps> = ({ onClear, onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStopAndProcess = useCallback(() => {
    if (audioChunksRef.current.length === 0) {
      console.warn("No audio was recorded.");
      return;
    }
    
    const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
    onAudioReady(audioBlob, 'record');
    audioChunksRef.current = []; // Clear chunks for the next recording
    
  }, [onAudioReady]);


  const startRecording = useCallback(async () => {
    onClear();
    setError(null);
    setIsRecording(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const options = { mimeType: 'audio/webm' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleStopAndProcess;
      mediaRecorderRef.current.start();

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Không thể truy cập micrô. Vui lòng kiểm tra quyền và thử lại.');
      setIsRecording(false);
    }
  }, [onClear, handleStopAndProcess]);


  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop(); // This will trigger onstop and handle processing
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <button
        onClick={handleToggleRecording}
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isRecording ? (
          <>
            <StopIcon className="w-5 h-5" />
            <span>Dừng Ghi</span>
          </>
        ) : (
          <>
            <MicrophoneIcon className="w-5 h-5" />
            <span>Ghi Âm Trực Tiếp</span>
          </>
        )}
      </button>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
};

export default LiveRecorder;