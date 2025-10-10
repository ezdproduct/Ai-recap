import React from 'react';
import { ActiveView } from '../types';
import { InputIcon, SummarizeIcon, TranscriptIcon, EditIcon } from './Icons';

interface ViewSwitcherProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  hasContent: boolean;
  isLoading: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  activeView,
  onViewChange,
  hasContent,
  isLoading,
}) => {
  const navButtonClasses = "px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center gap-2 group";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-slate-500 hover:bg-gray-100 hover:text-slate-700";
  const disabledClasses = "disabled:opacity-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed";

  const StepNumber: React.FC<{ number: number; isActive: boolean }> = ({ number, isActive }) => {
    const activeStepClasses = "bg-white text-blue-600";
    const inactiveStepClasses = "bg-gray-200 text-slate-600 group-hover:bg-gray-300";
    return (
      <span className={`flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full transition-colors ${isActive ? activeStepClasses : inactiveStepClasses}`}>
        {number}
      </span>
    );
  };

  // On desktop, if the active view is Input (e.g. after clearing), we highlight "Recap" as the default view.
  const isRecapActive = activeView === ActiveView.Recap || activeView === ActiveView.Input;

  return (
    <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => onViewChange(ActiveView.Recap)}
        disabled={isLoading}
        className={`${navButtonClasses} ${isRecapActive ? activeClasses : inactiveClasses} ${disabledClasses}`}
      >
        <StepNumber number={1} isActive={isRecapActive} />
        Tóm tắt
      </button>
      <button
        onClick={() => onViewChange(ActiveView.Transcript)}
        disabled={isLoading}
        className={`${navButtonClasses} ${activeView === ActiveView.Transcript ? activeClasses : inactiveClasses} ${disabledClasses}`}
      >
        <StepNumber number={2} isActive={activeView === ActiveView.Transcript} />
        Bản ghi
      </button>
      <button
        onClick={() => onViewChange(ActiveView.Editor)}
        disabled={isLoading}
        className={`${navButtonClasses} ${activeView === ActiveView.Editor ? activeClasses : inactiveClasses} ${disabledClasses}`}
      >
        <StepNumber number={3} isActive={activeView === ActiveView.Editor} />
        Chỉnh sửa
      </button>
    </div>
  );
};

export default ViewSwitcher;