'use client';

import { ChangeEvent } from 'react';

interface OCRResultEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function OCRResultEditor({ content, onChange }: OCRResultEditorProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        OCR 结果编辑
      </label>
      <textarea
        value={content}
        onChange={handleChange}
        rows={10}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        placeholder="OCR 识别结果将在这里显示..."
      />
      <p className="text-sm text-gray-500">
        您可以直接编辑识别结果以修正任何错误
      </p>
    </div>
  );
} 