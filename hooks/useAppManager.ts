import { useState, useCallback } from 'react';
import { useGeminiTranscription } from './useGeminiTranscription';
import { useGeminiRecap } from './useGeminiRecap';
import { ActiveView } from '../types';
import { RECAP_TEMPLATE } from '../components/RecapDisplay';
import { downloadContent } from '../utils/downloadUtils';
import { getCurrentDateFormatted } from '../utils/dateUtils';
// Removed import for useToast

export const useAppManager = () => {
  const [transcription, setTranscription] = useState('');
  const [recap, setRecap] = useState('');
  const [joditContent, setJoditContent] = useState('');
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [isLoadingRecap, setIsLoadingRecap] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Input);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // Removed const { showToast } = useToast();

  const handleError = (message: string) => {
    console.error(message); // Changed to console.error
  };

  const handleTranscriptionUpdate = useCallback((fullText: string) => {
    setTranscription(fullText);
  }, []);

  const handleRecapUpdate = useCallback((chunk: string) => {
    setRecap(prev => prev + chunk);
  }, []);
  
  const { transcribeAudio } = useGeminiTranscription({
    onTranscriptionUpdate: handleTranscriptionUpdate,
    setIsLoading: setIsLoadingTranscription,
    setError: handleError,
    onProgressUpdate: setProgressMessage,
  });

  const { generateRecap } = useGeminiRecap({
    onRecapUpdate: handleRecapUpdate,
    setIsLoading: setIsLoadingRecap,
    setError: handleError,
  });

  const handleClear = useCallback(() => {
    setTranscription('');
    setRecap('');
    setJoditContent('');
    setProgressMessage('');
    setActiveView(ActiveView.Input);
    setAudioBlob(null);
  }, []);

  const handleGenerateTranscript = useCallback(() => {
    if (audioBlob) {
      setTranscription('');
      transcribeAudio(audioBlob);
    }
  }, [audioBlob, transcribeAudio]);

  const handleGenerateRecap = useCallback(() => {
    if (audioBlob) {
      setRecap('');
      generateRecap(audioBlob);
    }
  }, [audioBlob, generateRecap]);

  const handleAudioReady = useCallback((blob: Blob, source: 'upload' | 'record') => {
    handleClear();
    setAudioBlob(blob);
    if (source === 'upload') {
      setActiveView(ActiveView.Recap);
      setRecap('');
      generateRecap(blob);
    } else {
      setActiveView(ActiveView.Transcript);
    }
  }, [handleClear, generateRecap]);

  const handleRegenerate = useCallback(() => {
    if (!audioBlob) return;

    if (activeView === ActiveView.Recap) {
        handleGenerateRecap();
    } else if (activeView === ActiveView.Transcript) {
        handleGenerateTranscript();
    }
  }, [audioBlob, activeView, handleGenerateRecap, handleGenerateTranscript]);

  const handleViewChange = (view: ActiveView) => {
    if (view === ActiveView.Editor) {
      setJoditContent(recap || RECAP_TEMPLATE.replace('[YYYY-MM-DD]', getCurrentDateFormatted()));
    }
    setActiveView(view);
  };

  const handleSaveRecap = useCallback(() => {
    setRecap(joditContent);
    console.log('Đã lưu thay đổi!'); // Changed to console.log
    setActiveView(ActiveView.Recap);
  }, [joditContent]);

  const handleDownload = useCallback((filename: string, format: 'txt' | 'pdf' | 'docx' | 'md') => {
    downloadContent({
      filename,
      format,
      activeView,
      transcription,
      recap,
      joditContent,
      setError: handleError,
    });
  }, [activeView, transcription, recap, joditContent]);

  const isLoading = isLoadingTranscription || isLoadingRecap;
  const hasAudio = !!audioBlob;
  const hasContent = !!(transcription || recap);

  return {
    transcription,
    recap,
    joditContent,
    setJoditContent,
    isLoading,
    activeView,
    hasAudio,
    hasContent,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    handleClear,
    handleAudioReady,
    handleRegenerate,
    handleViewChange,
    handleSaveRecap,
    handleDownload,
    handleGenerateRecap,
    handleGenerateTranscript,
  };
};