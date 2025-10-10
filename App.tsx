import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import RecapDisplay from './components/RecapDisplay';
import InputView from './components/InputView';
import { ActiveView } from './types';
import { RegenerateIcon, DownloadIcon } from './components/Icons';
import JoditEditorView from './components/JoditEditorView';
import BottomNavBar from './components/BottomNavBar';
import DownloadModal from './components/DownloadModal';
import { useAppManager } from './hooks/useAppManager';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
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
  } = useAppManager();

  // Unified function to render the content view without styling wrappers
  const renderCurrentViewContent = () => {
    switch (activeView) {
      case ActiveView.Input:
        return <InputView onAudioReady={handleAudioReady} onClear={handleClear} />;
      case ActiveView.Recap:
        return (
          <RecapDisplay 
            recapText={recap} 
            isLoading={isLoading}
            onGenerate={handleGenerateRecap}
            hasAudio={hasAudio}
          />
        );
      case ActiveView.Transcript:
        return (
          <TranscriptionDisplay 
            text={transcription} 
            isLoading={isLoading} 
            onGenerate={handleGenerateTranscript}
            hasAudio={hasAudio}
          />
        );
      case ActiveView.Editor:
        return <JoditEditorView initialContent={joditContent} onContentChange={setJoditContent} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-50 text-slate-800 min-h-screen font-sans antialiased relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-full h-full bg-gradient-to-r from-blue-200/40 via-purple-200/30 to-gray-50/20 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-1/2 h-1/2 bg-gradient-to-l from-indigo-200/30 to-gray-50/10 blur-3xl opacity-60"></div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen p-4 gap-1">
        <div 
            className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[calc(12rem-5px)]' : 'w-[calc(3.34rem-5px)]'}`}
        >
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                activeView={activeView}
                onViewChange={handleViewChange}
                hasContent={hasContent} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
        </div>

        <div className="flex-grow h-full min-w-0">
            <div className="h-full w-full relative flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden">
                
                {activeView !== ActiveView.Input && (
                    <div className="flex-shrink-0 p-4 border-b border-gray-200/80 flex items-center justify-end">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors text-sm"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                Tải xuống
                            </button>
                            {activeView === ActiveView.Editor && (
                                <button
                                onClick={handleSaveRecap}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
                                >
                                Lưu thay đổi
                                </button>
                            )}
                            {hasContent && activeView !== ActiveView.Input && activeView !== ActiveView.Editor && (
                                <button
                                onClick={handleRegenerate}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                <RegenerateIcon className="w-4 h-4" />
                                Tạo lại
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-grow overflow-y-auto">
                    {renderCurrentViewContent()} {/* Use the unified content renderer */}
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <main className="lg:hidden relative z-10 flex flex-col h-screen">
        <div className="flex-grow overflow-y-auto p-4 pb-24">
          {/* Apply styling wrapper for mobile content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200">
            {renderCurrentViewContent()} {/* Use the unified content renderer */}
          </div>
        </div>
        <BottomNavBar 
            activeView={activeView}
            onViewChange={handleViewChange}
            isProcessing={isLoading}
        />
      </main>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
        defaultFilename="meeting-summary"
      />
    </div>
  );
}

export default App;