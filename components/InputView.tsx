import React, { useRef } from 'react';
import LiveRecorder from './LiveRecorder';
import { UploadIcon } from './Icons';

interface InputViewProps {
  onAudioReady: (blob: Blob, source: 'upload' | 'record') => void;
  onClear: () => void;
}

const InputView: React.FC<InputViewProps> = ({ onAudioReady, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onClear();
      onAudioReady(file, 'upload');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Bắt đầu</h2>
        <p className="text-slate-500 text-md mt-2">
          Tải lên tệp âm thanh hoặc ghi âm trực tiếp để bắt đầu.
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
        <button 
          onClick={handleUploadClick} 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white text-slate-700 font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <UploadIcon className="w-5 h-5" />
          <span>Tải lên từ máy tính</span>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />

        <div className="relative flex py-2 items-center w-full">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Hoặc</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <LiveRecorder onAudioReady={onAudioReady} onClear={onClear} />
      </div>
    </div>
  );
};

export default InputView;