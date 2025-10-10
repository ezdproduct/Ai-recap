import React from 'react';
import { ActiveView } from '../types';
import { InputIcon, TranscriptIcon, SummarizeIcon, EditIcon } from './Icons';

interface BottomNavBarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isProcessing: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => {
  const activeClasses = 'text-blue-500';
  const inactiveClasses = 'text-slate-500 hover:text-slate-800';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="w-7 h-7">{icon}</div>
      <span className="text-xs font-medium mt-1">{label}</span>
      {isActive && (
        <div className="absolute bottom-0 h-1 w-8 bg-blue-500 rounded-full"></div>
      )}
    </button>
  );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onViewChange, isProcessing }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-gray-200 flex items-center justify-around z-50">
      <NavItem
        icon={<InputIcon />}
        label="Đầu vào"
        isActive={activeView === ActiveView.Input}
        onClick={() => onViewChange(ActiveView.Input)}
        disabled={isProcessing}
      />
      <NavItem
        icon={<SummarizeIcon />}
        label="Tóm tắt"
        isActive={activeView === ActiveView.Recap}
        onClick={() => onViewChange(ActiveView.Recap)}
        disabled={false}
      />
      <NavItem
        icon={<TranscriptIcon />}
        label="Bản ghi"
        isActive={activeView === ActiveView.Transcript}
        onClick={() => onViewChange(ActiveView.Transcript)}
        disabled={false}
      />
      <NavItem
        icon={<EditIcon />}
        label="Biên tập"
        isActive={activeView === ActiveView.Editor}
        onClick={() => onViewChange(ActiveView.Editor)}
        disabled={isProcessing}
      />
    </nav>
  );
};

export default BottomNavBar;