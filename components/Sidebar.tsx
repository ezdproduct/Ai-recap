import React, { useState, useEffect, useRef } from 'react';
import { InputIcon, SummarizeIcon, TranscriptIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { ActiveView } from '../types';
import NavItem from './NavItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  hasContent: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, activeView, onViewChange, hasContent, onToggle }) => {
  return (
    <aside className={`w-full h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 flex flex-col p-4`}>
      <div className="flex-shrink-0">
        <nav className="flex flex-col gap-1">
          <NavItem
            icon={<InputIcon />}
            label="Nhập dữ liệu"
            isActive={activeView === ActiveView.Input}
            onClick={() => onViewChange(ActiveView.Input)}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            icon={<SummarizeIcon />}
            label="Tạo tóm tắt"
            isActive={activeView === ActiveView.Recap}
            onClick={() => onViewChange(ActiveView.Recap)}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            icon={<TranscriptIcon />}
            label="AI Transcript"
            isActive={activeView === ActiveView.Transcript}
            onClick={() => onViewChange(ActiveView.Transcript)}
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            icon={<EditIcon />}
            label="Sửa nội dung"
            isActive={activeView === ActiveView.Editor}
            onClick={() => onViewChange(ActiveView.Editor)}
            isSidebarOpen={isSidebarOpen}
          />
        </nav>
      </div>
      <div className="flex-grow"></div>
      <div className="pt-2">
        {isSidebarOpen && (
          <>
            <div className="mb-4 px-4">
              <img src="/assets/images/Logo CRED.png" alt="CRED Logo" className="w-full h-auto max-h-24 object-contain" />
            </div>
            <div className="px-4 text-xs text-slate-500 space-y-1 mb-4">
              <p className="font-semibold text-slate-700">Thông tin liên hệ:</p>
              <p>034 969 8727</p>
              <p>www.cred-edu.vn.com</p>
              <p>office@cred-edu.vn</p>
              <p>124 Điện Biên Phủ, P. Tân Định, TP. Hồ Chí Minh</p>
            </div>
          </>
        )}
        <NavItem
          icon={isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          label={isSidebarOpen ? "Thu gọn" : "Mở rộng"}
          isActive={false}
          onClick={onToggle}
          isSidebarOpen={isSidebarOpen}
          disableHoverBackground={true}
          disableLabelAnimation={true}
        />
      </div>
    </aside>
  );
};

export default Sidebar;