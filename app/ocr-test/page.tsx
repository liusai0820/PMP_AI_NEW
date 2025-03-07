"use client";

import React from 'react';
import OCRUploader from '@/components/OCRUploader';

export default function OCRTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">OCR 文档识别测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="prose">
            <p>本页面用于测试 OCR（光学字符识别）功能，可以上传 PDF 文档或图片进行文本识别。</p>
            
            <h3 className="text-lg font-medium mt-4">支持的文件类型</h3>
            <ul className="list-disc pl-5">
              <li>PDF 文档 (.pdf)</li>
              <li>图片文件 (.jpg, .jpeg, .png, .gif, .bmp)</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4">文件大小限制</h3>
            <p>最大支持 10MB 的文件。如果您的文件超过此限制，请尝试：</p>
            <ul className="list-disc pl-5">
              <li>压缩文件大小</li>
              <li>将 PDF 转换为图片</li>
              <li>分割 PDF 为多个小文件</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4">处理时间</h3>
            <p>处理时间取决于文件大小和复杂度：</p>
            <ul className="list-disc pl-5">
              <li>图片通常在 5-15 秒内完成</li>
              <li>PDF 文档可能需要 10-60 秒，取决于页数和内容</li>
            </ul>
          </div>
        </div>
        
        <OCRUploader />
      </div>
    </div>
  );
} 