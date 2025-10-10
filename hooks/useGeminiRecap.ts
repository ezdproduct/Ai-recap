import { useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioUtils';

interface UseGeminiRecapProps {
  onRecapUpdate: (chunk: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGeminiRecap = ({
  onRecapUpdate,
  setIsLoading,
  setError,
}: UseGeminiRecapProps) => {
  const generateRecap = useCallback(async (audioBlob: Blob | null) => {
    if (!audioBlob) {
      setError('Không có dữ liệu âm thanh được cung cấp để tóm tắt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const base64Data = await blobToBase64(audioBlob);
      const audioPart = {
        inlineData: { data: base64Data, mimeType: audioBlob.type || 'audio/webm' },
      };

      const promptPart = {
        text: `
**Role:**
Bạn là một **Chuyên viên phân tích cuộc họp/PMO** chuyên nghiệp với kinh nghiệm sâu rộng trong việc ghi biên bản và tóm tắt các cuộc họp đa ngôn ngữ. Bạn thành thạo trong việc chuyển đổi giọng nói thành văn bản, phân tách người nói và trích xuất các quyết định cũng như các mục hành động.

**Objective:**
Tạo một **Bản tóm tắt cuộc họp** rõ ràng, chính xác và có thể hành động bằng tiếng Việt, trong **1–2 trang (~800–1200 từ)**, đảm bảo:
*   100% **quyết định** và **nhiệm vụ đã thống nhất** được ghi lại.
*   **Mục hành động** bao gồm: *Nhiệm vụ, Người chịu trách nhiệm, Hạn chót (YYYY-MM-DD), Mức độ ưu tiên, Phụ thuộc, và Dấu thời gian nguồn*.
*   Tóm tắt điều hành cho phép những người vắng mặt nắm bắt các điểm chính trong **≤ 60 giây**.

**Context:**
Đầu vào là một **tệp âm thanh cuộc họp** (ngôn ngữ có thể là tiếng Việt, tiếng Anh hoặc hỗn hợp). Nó có thể liên quan đến nhiều người nói và chất lượng âm thanh khác nhau. Bản tóm tắt dành cho nhóm dự án và lãnh đạo; nó phải trung lập, bảo mật và không được suy luận ngoài những gì đã nghe. Ngôn ngữ đầu ra phải là tiếng Việt.

**Step-by-Step Instructions:**
1.  **Chuyển đổi & Phân tách người nói:** Xử lý âm thanh thành văn bản với **dấu thời gian** cho mỗi lời nói và **xác định người nói** (Người nói A, Người nói B, hoặc theo tên nếu được nêu rõ). Đánh dấu các phần khó nghe là **[không nghe rõ mm:ss]** hoặc **[không rõ mm:ss]**.
2.  **Xác định cấu trúc:** Suy luận **Chương trình nghị sự** của cuộc họp nếu không được nêu rõ. Liệt kê **Người tham gia & vai trò của họ** nếu được đề cập.
3.  **Trích xuất quyết định:** Tách tất cả các quyết định đã được hoàn thiện. Đối với mỗi quyết định, ghi lại quyết định, ai đã đồng ý (nếu được chỉ định) và **dấu thời gian** nguồn.
4.  **Trích xuất mục hành động:** Xác định tất cả các nhiệm vụ đã cam kết. Đối với mỗi nhiệm vụ, trích xuất **mô tả Nhiệm vụ, Người chịu trách nhiệm, Hạn chót (YYYY-MM-DD), Mức độ ưu tiên (Cao/Trung bình/Thấp), Các phụ thuộc, bất kỳ Ghi chú liên quan nào, và Dấu thời gian nguồn (mm:ss)**. Nếu Người chịu trách nhiệm hoặc Hạn chót không được đề cập, hãy sử dụng **[Chưa xác định]**.
5.  **Xác định rủi ro & vấn đề:** Ghi lại bất kỳ rủi ro, vấn đề hoặc trở ngại nào được đề cập, cùng với bất kỳ chiến lược giảm thiểu nào được đề xuất.
6.  **Soạn thảo Tóm tắt điều hành:** Viết một bản tóm tắt ngắn gọn (5-8 gạch đầu dòng hoặc một đoạn văn ngắn, dưới 120 từ) bao gồm bối cảnh cuộc họp, 3-5 kết luận chính và 3 hành động ưu tiên hàng đầu.
7.  **Tập hợp bản tóm tắt:** Điền vào mẫu HTML bên dưới bằng cách sử dụng thông tin đã trích xuất. Đảm bảo tất cả nội dung là trung lập, ngắn gọn và trực tiếp từ âm thanh. Không thêm ý kiến ​​của riêng bạn hoặc suy đoán.

**Output Format:**
Bạn PHẢI tạo đầu ra dưới dạng một khối HTML duy nhất. Nghiêm túc tuân thủ cấu trúc HTML, tiêu đề và định dạng được cung cấp bên dưới. KHÔNG bao gồm bất kỳ dấu phân cách khối mã Markdown nào như \`\`\`html hoặc \`\`\` trong đầu ra. Sử dụng thông tin được trích xuất từ âm thanh theo các hướng dẫn trên để điền vào các phần tương ứng của mẫu HTML này.

---
<h2><strong>Tóm tắt cuộc họp tiến độ dự án – [Sử dụng ngày hiện tại theo định dạng YYYY-MM-DD]</strong></h2>
<p>&nbsp;</p>
<h3><strong>Tóm tắt điều hành</strong></h3>
<p><em>(Viết bản tóm tắt ngắn gọn tại đây, theo hướng dẫn số 6. Nó sẽ giúp người đọc hiểu các kết quả chính trong vòng chưa đầy 60 giây.)</em></p>
<p>&nbsp;</p>
<h3><strong>Quyết định / Thỏa thuận</strong></h3>
<ul>
    <li><em>(Liệt kê các quyết định hoặc thỏa thuận chính đã được hoàn thiện trong cuộc họp. Sử dụng dấu đầu dòng '•'. Ví dụ: "Hoàn thiện Phương án A cho trang đích, thử nghiệm A/B sẽ bắt đầu vào 2025-09-22 (02:14).")</em></li>
</ul>
<p>&nbsp;</p>
<h3><strong>Mục hành động</strong></h3>
<table>
    <thead>
        <tr>
            <th>Nhiệm vụ</th>
            <th>Người chịu trách nhiệm</th>
            <th>Hạn chót (YYYY-MM-DD)</th>
            <th>Mức độ ưu tiên</th>
            <th>Phụ thuộc</th>
            <th>Ghi chú</th>
            <th>Nguồn (mm:ss)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><em>(Tên nhiệm vụ 1)</em></td>
            <td><em>(Người chịu trách nhiệm 1 hoặc [Chưa xác định])</em></td>
            <td><em>(Hạn chót 1 hoặc [Chưa xác định])</em></td>
            <td><em>(Mức độ ưu tiên 1)</em></td>
            <td><em>(Phụ thuộc 1)</em></td>
            <td><em>(Ghi chú 1)</em></td>
            <td><em>(Dấu thời gian nguồn 1)</em></td>
        </tr>
        <tr>
            <td><em>(Tên nhiệm vụ 2)</em></td>
            <td><em>(Người chịu trách nhiệm 2 hoặc [Chưa xác định])</em></td>
            <td><em>(Hạn chót 2 hoặc [Chưa xác định])</em></td>
            <td><em>(Mức độ ưu tiên 2)</em></td>
            <td><em>(Phụ thuộc 2)</em></td>
            <td><em>(Ghi chú 2)</em></td>
            <td><em>(Dấu thời gian nguồn 2)</em></td>
        </tr>
    </tbody>
</table>
<p>&nbsp;</p>
<h3><strong>Rủi ro &amp; Vấn đề</strong></h3>
<ul>
    <li><strong>Vấn đề 1:</strong> <em>(Tên vấn đề 1)</em>
        <ul>
            <li><strong>Tác động:</strong> <em>(Mô tả tác động của rủi ro/vấn đề đối với dự án.)</em></li>
            <li><strong>Giải pháp:</strong> <em>(Nêu các bước giải quyết hoặc hành động tiếp theo được đề xuất.)</em></li>
        </ul>
    </li>
</ul>
<p>&nbsp;</p>
<h3><strong>Cuộc họp tiếp theo</strong></h3>
<p><em>Thời gian: (YYYY-MM-DD) lúc (HH:MM) hoặc [Chưa xác định]</em></p>
<p><em>Chương trình nghị sự đề xuất: (Liệt kê các mục chương trình nghị sự được đề xuất.)</em></p>
<p>&nbsp;</p>
<h3><strong>Phụ lục (Người tham dự)</strong></h3>
<p><em>(Liệt kê tên và vai trò của những người tham dự cuộc họp nếu được xác định.)</em></p>
---

**MANDATORY CONSTRAINTS:**
1.  **Language:** The final output content MUST be 100% professional, clear, and coherent **Vietnamese**.
2.  **Formatting:** Strictly adhere to the HTML structure, titles, and formatting provided below. Do NOT add, remove, or change titles.
3.  **Accuracy & Neutrality:** Only record information present in the meeting. Use **'[Chưa xác định]'** or **'[Không được đề cập]'** for missing information. Do not speculate.
4.  **Confidentiality:** Do not insert any external data or information not present in the audio.
5.  **Length:** Keep the entire recap concise (under 1200 words) and the Executive Summary under 120 words.

Below is the audio recording of the meeting:`
      };

      const contents = { parts: [promptPart, audioPart] };

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      for await (const chunk of responseStream) {
        onRecapUpdate(chunk.text);
      }

    } catch (err) {
      console.error('Lỗi khi tạo bản tóm tắt từ âm thanh:', err);
      setError('Đã xảy ra lỗi trong quá trình tạo bản tóm tắt. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [onRecapUpdate, setIsLoading, setError]);

  return { generateRecap };
};