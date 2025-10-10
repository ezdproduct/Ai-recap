import { useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioUtils';

interface UseGeminiTranscriptionProps {
  onTranscriptionUpdate: (fullText: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  onProgressUpdate: (message: string) => void;
}

export const useGeminiTranscription = ({ 
  onTranscriptionUpdate, 
  setIsLoading, 
  setError,
  onProgressUpdate,
}: UseGeminiTranscriptionProps) => {

  const transcribeAudio = useCallback(async (audioBlob: Blob | null) => {
    if (!audioBlob) {
      setError('No audio data provided to transcribe.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    onTranscriptionUpdate(''); // Clear previous transcription
    onProgressUpdate('Preparing audio...');

    try {
      onProgressUpdate('Converting audio for transcription...');
      const base64Data = await blobToBase64(audioBlob);
      const audioPart = {
        inlineData: { data: base64Data, mimeType: audioBlob.type || 'audio/webm' },
      };
      const textPart = { text: "Transcribe this audio recording into English. It is crucial to identify and label each speaker (e.g., Speaker 1, Speaker 2, etc.). Provide timestamps for the start of each speaker's turn. Format the output clearly, with each utterance on a new line." };

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      onProgressUpdate('Sending audio to AI...');
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
      });

      onProgressUpdate('Receiving transcription...');
      let fullTranscription = '';
      for await (const chunk of responseStream) {
        fullTranscription += chunk.text;
        onTranscriptionUpdate(fullTranscription); // Update UI in real-time
      }

    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError('An error occurred during transcription. Please try again.');
    } finally {
      setIsLoading(false);
      onProgressUpdate(''); // Clear progress message
    }
  }, [onTranscriptionUpdate, setIsLoading, setError, onProgressUpdate]);

  return { transcribeAudio };
};