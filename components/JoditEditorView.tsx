import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

interface JoditEditorViewProps {
  initialContent: string;
  onContentChange: (newContent: string) => void;
}

const JoditEditorView: React.FC<JoditEditorViewProps> = ({ initialContent, onContentChange }) => {
  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: 'Bắt đầu soạn thảo...',
    height: '100%',
    language: 'vi', // Thêm cấu hình ngôn ngữ tiếng Việt
    buttons: [
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', '|',
        'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'table', 'link', '|',
        'align', 'undo', 'redo',
    ],
    statusbar: false, // Ẩn thanh trạng thái
  };

  return (
    <div className="w-full h-full">
        <JoditEditor
            ref={editor}
            value={initialContent}
            config={config}
            onBlur={newContent => onContentChange(newContent)}
        />
    </div>
  );
};

export default JoditEditorView;