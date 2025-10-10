import React from 'react';
import { SummarizeIcon } from './Icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { getCurrentDateFormatted } from '../utils/dateUtils'; // Import the new utility

interface RecapDisplayProps {
  recapText: string;
  isLoading: boolean;
  onGenerate: () => void;
  hasAudio: boolean;
}

export const RECAP_TEMPLATE = `
<h2><strong>Project Progress Meeting Recap – [YYYY-MM-DD]</strong></h2>
<p>&nbsp;</p>
<h3><strong>Executive Summary</strong></h3>
<p><em>Summarize the key points, notable outcomes, central issues, and most important decisions of the meeting. Example: The meeting discussed the progress of project X, identified potential risks, and agreed on next steps to ensure the project stays on track.</em></p>
<p>&nbsp;</p>
<h3><strong>Decisions / Agreements</strong></h3>
<ul>
    <li><em>Agreed to launch Phase 2 of the project on [YYYY-MM-DD].</em></li>
    <li><em>Decided to allocate additional resources to the development team to accelerate progress.</em></li>
</ul>
<p>&nbsp;</p>
<h3><strong>Action Items</strong></h3>
<table>
    <thead>
        <tr>
            <th>Task</th>
            <th>Owner</th>
            <th>Deadline (YYYY-MM-DD)</th>
            <th>Priority</th>
            <th>Dependency</th>
            <th>Notes</th>
            <th>Source (mm:ss)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><em>Complete market analysis report</em></td>
            <td><em>John Doe</em></td>
            <td><em>2024-12-31</em></td>
            <td><em>High</em></td>
            <td><em>N/A</em></td>
            <td><em>Requires data from Q3</em></td>
            <td><em>05:30</em></td>
        </tr>
    </tbody>
</table>
<p>&nbsp;</p>
<h3><strong>Risks &amp; Issues</strong></h3>
<ul>
    <li><strong>Issue 1: Key personnel shortage</strong>
        <ul>
            <li><strong>Impact:</strong> <em>May delay project progress and affect work quality.</em></li>
            <li><strong>Resolution:</strong> <em>Propose hiring 2 senior developers within the next 2 weeks.</em></em></li>
        </ul>
    </li>
</ul>
<p>&nbsp;</p>
<h3><strong>Next Meeting</strong></h3>
<p><em>Time: [YYYY-MM-DD] at [HH:MM] or [TBD]</em></p>
<p><em>Proposed Agenda: Review recruitment progress, budget update, new feature implementation plan draft review.</em></p>
<p>&nbsp;</p>
<h3><strong>Appendix (Attendees)</strong></h3>
<p><em>John Doe (Project Manager), Jane Smith (Development Lead), Peter Jones (Marketing Rep), Sarah Lee (Finance Rep).</em></p>
`;

const RecapSkeleton: React.FC = () => {
  const formattedTemplate = RECAP_TEMPLATE.replace('[YYYY-MM-DD]', getCurrentDateFormatted());
  return (
    <div 
      className="text-left w-full prose prose-p:text-slate-500 prose-headings:text-slate-700 prose-strong:text-slate-600 text-slate-500 min-h-[340px]"
      dangerouslySetInnerHTML={{ __html: formattedTemplate }}
    />
  );
};


const RecapDisplay: React.FC<RecapDisplayProps> = ({ recapText, isLoading, onGenerate, hasAudio }) => {
  
  return (
    <div className="w-full min-h-[400px] p-4 sm:p-6 font-sans text-base">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Tóm tắt cuộc họp
        </h2>
      </div>

      {/* Content Area */}
      <div className="w-full pt-6 relative">
        {recapText ? (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: recapText }}
          />
        ) : (
          <>
            <div className={isLoading ? "animate-pulse" : ""}>
              <RecapSkeleton />
            </div>
            {/* Overlay for initial state or loading */}
            {isLoading || hasAudio ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500 bg-white/80 backdrop-blur-sm rounded-lg">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    <DotLottieReact
                      src="https://lottie.host/9603fabf-66b5-40c6-a26f-37885fd63509/Gy8LyCzQQd.lottie"
                      loop
                      autoplay
                      className="w-32 h-32"
                    />
                    <p className="font-semibold mt-4">Đang tạo tóm tắt...</p>
                    <p className="text-sm">Vui lòng đợi một lát.</p>
                  </div>
                ) : (
                  <>
                    {hasAudio && (
                      <>
                        <SummarizeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">Sẵn sàng tóm tắt</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 mb-6">Nhấn nút bên dưới để AI phân tích và tạo bản tóm tắt.</p>
                        <button
                          onClick={onGenerate}
                          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/50"
                        >
                          Tạo tóm tắt
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              // No audio, no loading, just show the skeleton without overlay
              null
            )}
          </>
        )}
        {isLoading && recapText && <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse"></span>}
      </div>
    </div>
  );
};

export default RecapDisplay;