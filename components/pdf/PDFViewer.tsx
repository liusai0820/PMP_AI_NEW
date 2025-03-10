'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 设置 PDF.js worker 路径
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PDFViewer({ file, currentPage, onPageChange }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const fileUrl = URL.createObjectURL(file);
    setUrl(fileUrl);
    return () => URL.revokeObjectURL(fileUrl);
  }, [file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer border rounded-lg p-4">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
      >
        <Page
          pageNumber={currentPage}
          className="max-w-full h-auto"
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-violet-50 text-violet-700 rounded-lg disabled:opacity-50"
        >
          上一页
        </button>
        
        <span className="text-sm text-gray-600">
          第 {currentPage} 页，共 {numPages} 页
        </span>
        
        <button
          onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="px-4 py-2 bg-violet-50 text-violet-700 rounded-lg disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
} 