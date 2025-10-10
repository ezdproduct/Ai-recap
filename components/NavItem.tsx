import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isSidebarOpen: boolean;
  disabled?: boolean;
  disableHoverBackground?: boolean;
  disableLabelAnimation?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isSidebarOpen, disabled, disableHoverBackground, disableLabelAnimation }) => {
  const baseClasses = "flex items-center rounded-lg w-full transition-colors"; 
  
  // Changed hover:text-slate-800 to hover:text-blue-400
  const inactiveHoverClasses = disableHoverBackground ? "hover:bg-transparent" : "hover:bg-transparent hover:text-blue-400";
  
  const activeClasses = "text-blue-600";
  const inactiveClasses = `text-slate-600 ${inactiveHoverClasses}`;
  const disabledClasses = "opacity-50 cursor-not-allowed hover:bg-transparent";

  const labelAnimationClasses = disableLabelAnimation ? '' : 'transition-all duration-300 ease-in-out';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabled ? disabledClasses : ''} ${isSidebarOpen ? 'py-3 text-left gap-2' : 'py-3 justify-center'}`} 
      title={isSidebarOpen ? '' : label}
    >
      <span className="flex-shrink-0 w-6 h-6">{icon}</span>
      <span 
        className={`font-semibold whitespace-nowrap overflow-hidden ${labelAnimationClasses} ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}
      >
        {label}
      </span>
    </button>
  );
};

export default NavItem;