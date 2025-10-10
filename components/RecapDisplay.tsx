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
<h2><strong>Recap Cuộc họp Cập nhật Tiến độ Dự án – [YYYY-MM-DD]</strong></h2>
<p>&nbsp;</p>
<h3><strong>Executive Summary (Tóm tắt điều hành)</strong></h3>
<p><em>Tóm tắt những điểm chính, kết quả nổi bật, vấn đề trọng tâm và các quyết định quan trọng nhất của cuộc họp. Ví dụ: Cuộc họp đã thảo luận về tiến độ dự án X, xác định các rủi ro tiềm ẩn và thống nhất các hành động tiếp theo để đảm bảo dự án đi đúng hướng.</em></p>
<p>&nbsp;</p>
<h3><strong>Quyết định / Thống nhất</strong></h3>
<ul>
    <li><em>Thống nhất triển khai giai đoạn 2 của dự án vào ngày [YYYY-MM-DD].</em></li>
    <li><em>Quyết định phân bổ thêm nguồn lực cho đội ngũ phát triển để đẩy nhanh tiến độ.</em></li>
</ul>
<p>&nbsp;</p>
<h3><strong>Action Items (Bảng công việc)</strong></h3>
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
            <td><em>Hoàn thành báo cáo phân tích thị trường</em></td>
            <td><em>Nguyễn Văn A</em></td>
            <td><em>2024-12-31</em></td>
          </tr>
    </tbody>
</table>
<p>&nbsp;</p>
<h3><strong>Risks &amp; Issues (Rủi ro &amp; Vấn đề)</strong></h3>
<ul>
    <li><strong>Vấn đề 1: Thiếu hụt nhân sự chủ chốt</strong>
        <ul>
            <li><strong>Tác động:</strong> <em>Có thể làm chậm tiến độ dự án và ảnh hưởng đến chất lượng công việc.</em></li>
            <li><strong>Giải pháp:</strong> <em>Đề xuất tuyển dụng thêm 2 lập trình viên cấp cao trong vòng 2 tuần tới.</em></em></li>
        </ul>
    </li>
</ul>
<p>&nbsp;</p>
<h3><strong>Next Meeting (Cuộc họp tiếp theo)</strong></h3>
<p><em>Thời gian: [YYYY-MM-DD] lúc [HH:MM]</em></p>
<p><em>Nội dung đề xuất: Đánh giá tiến độ tuyển dụng, cập nhật tình hình ngân sách, xem xét bản nháp kế hoạch triển khai tính năng mới.</em></p>
<p>&nbsp;</p>
<h3><strong>Appendix (Tham dự)</strong></h3>
<p><em>Nguyễn Văn A (Trưởng phòng Dự án), Trần Thị B (Trưởng nhóm Phát triển), Lê Văn C (Đại diện Marketing), Phạm Thị D (Đại diện Tài chính).</em></p>
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
          Tóm tắt Cuộc họp
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
                    <p className="font-semibold mt-4">Đang tạo bản tóm tắt...</p>
                    <p className="text-sm">Vui lòng đợi trong giây lát.</p>
                  </div>
                ) : (
                  <>
                    {hasAudio && (
                      <>
                        <SummarizeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">Sẵn sàng để tóm tắt</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 mb-6">Nhấn nút bên dưới để AI phân tích và tạo bản tóm tắt.</p>
                        <button
                          onClick={onGenerate}
                          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/50"
                        >
                          Tạo Tóm tắt
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