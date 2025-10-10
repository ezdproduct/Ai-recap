import React from 'react';
import { ParsedLine } from '../types';

interface TranscriptionLineProps {
  line: ParsedLine;
  onTimestampClick?: (timeInSeconds: number) => void;
  selectedSpeaker?: string | null;
}

const TranscriptionLine: React.FC<TranscriptionLineProps> = ({ line, onTimestampClick, selectedSpeaker }) => {
  const isDimmed = selectedSpeaker && line.speaker !== selectedSpeaker;
  const rowClasses = `transition-opacity duration-300 border-b border-gray-100 hover:bg-gray-50 ${isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`;

  // Handle lines that are just plain text (e.g., paragraphs without a speaker)
  if (!line.speaker) {
    return (
      <tr className={rowClasses}>
        <td colSpan={3} className="p-1 text-slate-600 italic">
          {line.text}
        </td>
      </tr>
    );
  }

  return (
    <tr className={rowClasses}>
      <td className="w-20 p-1 align-top">
        {line.timestamp && onTimestampClick && line.seconds !== undefined ? (
          <button
            onClick={() => onTimestampClick(line.seconds!)}
            className="font-mono text-gray-500 hover:text-blue-500 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
            title={`Jump to ${line.timestamp}`}
          >
            {line.timestamp}
          </button>
        ) : (
          <span className="font-mono text-gray-500">{line.timestamp || '---'}</span>
        )}
      </td>
      <td className="w-24 p-1 align-top">
        <span className={`${line.colorClass} font-bold`}>{line.speaker}</span>
      </td>
      <td className="p-1 align-top text-slate-700 whitespace-pre-wrap">
        {line.text}
      </td>
    </tr>
  );
};

export default React.memo(TranscriptionLine);