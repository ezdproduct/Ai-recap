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
      setError('Không có dữ liệu âm thanh để ghi chép.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    onTranscriptionUpdate(''); // Clear previous transcription
    onProgressUpdate('Đang chuẩn bị âm thanh...');

    try {
      onProgressUpdate('Đang chuyển đổi âm thanh để ghi chép...');
      const base64Data = await blobToBase64(audioBlob);
      const audioPart = {
        inlineData: { data: base64Data, mimeType: audioBlob.type || 'audio/webm' },
      };
      const textPart = { text: "Chuyển đổi bản ghi âm này sang tiếng Việt. Điều quan trọng là phải xác định và gắn nhãn cho từng người nói (ví dụ: Người nói 1, Người nói 2, v.v.). Cung cấp dấu thời gian cho mỗi lượt nói của người nói. Định dạng đầu ra rõ ràng, mỗi câu nói trên một dòng mới." };

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      onProgressUpdate('Đang gửi âm thanh đến AI...');
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
      });

      onProgressUpdate('Đang nhận bản ghi...');
      let fullTranscription = '';
      for await (const chunk of responseStream) {
        fullTranscription += chunk.text;
        onTranscriptionUpdate(fullTranscription); // Update UI in real-time
      }

    } catch (err) {
      console.error('Lỗi khi ghi chép âm thanh:', err);
      setError('Đã xảy ra lỗi trong quá trình ghi chép. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      onProgressUpdate(''); // Clear progress message
    }
  }, [onTranscriptionUpdate, setIsLoading, setError, onProgressUpdate]);

  return { transcribeAudio };
};