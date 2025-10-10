import React, { useMemo, useState, useEffect } from 'react';
import { ParsedLine } from '../types';
import TranscriptionLine from './TranscriptionLine';
import { TranscriptIcon, SpinnerIcon } from './Icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface TranscriptionDisplayProps {
  text: string;
  isLoading: boolean;
  onTimestampClick?: (timeInSeconds: number) => void;
  onGenerate: () => void;
  hasAudio: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ text, isLoading, onTimestampClick, onGenerate, hasAudio }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  const parsedLines = useMemo((): ParsedLine[] => {
    if (!text) return [];

    const speakerColorMap = new Map<string, string>();
    let colorIndex = 0;

    const lineRegex = /^(?:\[((?:\d{2}:){1,2}\d{2}(?:[.,]\d{1,3})?)\s*\]\s*)?([a-zA-Z0-9\s]+):\s*(.*)$/;
    
    return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
      const match = line.match(lineRegex);

      if (match) {
        const [, timestamp, speakerRaw, lineText] = match;
        const speaker = speakerRaw.trim();
        
        if (!speakerColorMap.has(speaker)) {
          speakerColorMap.set(speaker, SPEAKER_COLORS[colorIndex % SPEAKER_COLORS.length]);
          colorIndex++;
        }
        
        return {
          key: `${index}-${speaker}-${timestamp}`,
          timestamp,
          speaker,
          text: lineText.trim(),
          colorClass: speakerColorMap.get(speaker),
          seconds: parseTimestampToSeconds(timestamp),
        };
      }
      
      return {
        key: `${index}-plain`,
        text: line,
      };
    });
  }, [text]);
  
  const speakers = useMemo(() => {
    const speakerSet = new Set<string>();
    parsedLines.forEach(line => {
      if (line.speaker) {
        speakerSet.add(line.speaker);
      }
    });
    return Array.from(speakerSet);
  }, [parsedLines]);

  useEffect(() => {
    if (selectedSpeaker && !speakers.includes(selectedSpeaker)) {
      setSelectedSpeaker(null);
    }
  }, [speakers, selectedSpeaker]);

  const handleSpeakerClick = (speaker: string) => {
    setSelectedSpeaker(prev => (prev === speaker ? null : speaker));
  };

  return (
    <div className="w-full min-h-[400px] p-4 sm:p-6 text-sm relative">
      {isLoading && !text && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500">
          <DotLottieReact
            src="https://lottie.host/23f707f4-6a79-4e20-94e3-1f16ec06fdc7/RzWA5UE5rT.lottie"
            loop
            autoplay
            className="w-32 h-32"
          />
          <p className="font-semibold mt-4">Đang ghi chép âm thanh...</p>
          <p className="text-sm">Quá trình này có thể mất vài phút.</p>
        </div>
      )}
      
      {!isLoading && !text && hasAudio && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 font-sans">
          <TranscriptIcon className="w-16 h-16 text-gray-300" />
          <h3 className="text-xl font-semibold text-slate-700">Sẵn sàng để ghi chép</h3>
          <p className="text-slate-500 max-w-xs text-center">Nhấn nút bên dưới để bắt đầu quá trình chuyển đổi âm thanh thành văn bản.</p>
          <button
            onClick={onGenerate}
            className="mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/50"
          >
            Tạo Bản ghi
          </button>
        </div>
      )}
      
      {speakers.length > 0 && (
        <div className="font-sans mb-4 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-3">Người nói</h3>
          {speakers.map(speaker => (
            <button
              key={speaker}
              onClick={() => handleSpeakerClick(speaker)}
              className={`px-3 py-1 text-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 ${
                selectedSpeaker === speaker
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {speaker}
            </button>
          ))}
        </div>
      )}

      {parsedLines.length > 0 && (
        <table className="w-full border-collapse text-sm font-sans">
          <thead>
            <tr className="text-left border-b-2 border-gray-200">
              <th className="w-20 p-2 font-semibold text-slate-600">Thời gian</th>
              <th className="w-24 p-2 font-semibold text-slate-600">Người nói</th>
              <th className="p-2 font-semibold text-slate-600">Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {parsedLines.map((line) => (
              <TranscriptionLine 
                key={line.key} 
                line={line} 
                onTimestampClick={onTimestampClick}
                selectedSpeaker={selectedSpeaker}
              />
            ))}
          </tbody>
        </table>
      )}
      {isLoading && text && (
        <div className="text-center py-4">
            <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
        </div>
      )}
    </div>
  );
};

const parseTimestampToSeconds = (timestamp?: string): number | undefined => {
  if (!timestamp) return undefined;
  const cleanedTimestamp = timestamp.replace(',', '.');
  const parts = cleanedTimestamp.split(':').reverse();
  let seconds = 0;
  if (parts[0]) seconds += parseFloat(parts[0]);
  if (parts[1]) seconds += parseInt(parts[1], 10) * 60;
  if (parts[2]) seconds += parseInt(parts[2], 10) * 3600;
  return seconds;
};

const SPEAKER_COLORS = [
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-indigo-500',
];

export default TranscriptionDisplay;