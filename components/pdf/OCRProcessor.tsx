'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import cv from '@techstark/opencv-js';

// 设置PDF.js worker路径
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface OCRProcessorProps {
  file: File;
  page: number;
  onProcessingStart: () => void;
  onProcessingComplete: (result: string) => void;
}

interface OCRResult {
  pages: Array<{
    pageNumber: number;
    text: string;
    confidence: number;
    markdown: string;
  }>;
  metadata: {
    totalPages: number;
    processTime: number;
  };
}

interface ProcessingError {
  message: string;
  code: string;
  details?: unknown;
}

// 使用Worker类型，避免使用any
type TesseractWorkerType = ReturnType<typeof createWorker>;

export default function OCRProcessor({
  file,
  page,
  onProcessingStart,
  onProcessingComplete,
}: OCRProcessorProps) {
  const [status, setStatus] = useState<string>('初始化中...');
  const [progress, setProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<TesseractWorkerType | null>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 组件卸载时清理worker
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // 当文件或页码变化时，重新处理
  useEffect(() => {
    if (file && page > 0) {
      processPage();
    }
  }, [file, page]);

  // 初始化 OpenCV
  useEffect(() => {
    cv.onRuntimeInitialized = () => {
      setIsOpenCVReady(true);
      console.log('OpenCV 初始化完成');
    };
  }, []);

  // 初始化 Tesseract worker
  useEffect(() => {
    async function initWorker() {
      try {
        setStatus('正在初始化OCR引擎...');
        const worker = createWorker({
          logger: progress => {
            if (progress.status === 'recognizing text') {
              setProgress(parseInt(progress.progress.toString()) * 100);
            }
            setStatus(`${progress.status}...`);
          },
        });

        // 预加载中文识别模型
        setStatus('正在加载中文识别模型...');
        await worker.loadLanguage('chi_sim');
        await worker.initialize('chi_sim');
        
        workerRef.current = worker;
        setStatus('OCR 引擎就绪');
        console.log('Tesseract 初始化完成');
      } catch (error) {
        console.error('Tesseract 初始化失败:', error);
        setStatus('OCR 引擎初始化失败');
      }
    }

    initWorker();
  }, []);

  // 图像预处理函数
  const preprocessImage = (sourceCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement) => {
    console.log('开始图像预处理');
    try {
      // 从源 Canvas 读取图像
      const src = cv.imread(sourceCanvas);
      
      // 转换为灰度图
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      
      // 自适应阈值处理
      const binary = new cv.Mat();
      cv.adaptiveThreshold(gray, binary, 255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        11, 2);
      
      // 降噪
      const denoised = new cv.Mat();
      cv.medianBlur(binary, denoised, 3);
      
      // 显示结果
      cv.imshow(targetCanvas, denoised);
      
      // 释放内存
      src.delete();
      gray.delete();
      binary.delete();
      denoised.delete();
      
      console.log('图像预处理完成');
    } catch (error) {
      console.error('图像预处理错误:', error);
      throw error;
    }
  };

  const processPage = async () => {
    if (!workerRef.current || !isOpenCVReady) {
      alert('OCR 引擎或图像处理组件还未准备好，请稍后再试');
      return;
    }

    try {
      onProcessingStart();
      setProgress(0);
      setStatus('开始处理...');

      // 创建用于渲染的 canvas
      const renderCanvas = document.createElement('canvas');
      canvasRef.current = renderCanvas;
      
      // 创建用于预处理的 canvas
      const processCanvas = document.createElement('canvas');
      debugCanvasRef.current = processCanvas;
      document.body.appendChild(processCanvas); // 临时添加到 DOM 以便调试
      processCanvas.style.position = 'fixed';
      processCanvas.style.top = '-9999px';

      // 加载 PDF
      setStatus('加载 PDF...');
      console.log('开始加载 PDF');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const pdfPage = await pdf.getPage(page);
      console.log('PDF 页面加载完成');
      
      // 设置较高的缩放比例以提高清晰度
      const scale = 2.0;
      const viewport = pdfPage.getViewport({ scale });
      
      // 设置 canvas 尺寸
      renderCanvas.height = viewport.height;
      renderCanvas.width = viewport.width;
      processCanvas.height = viewport.height;
      processCanvas.width = viewport.width;
      
      const context = renderCanvas.getContext('2d');
      
      if (!context) {
        throw new Error('无法创建 canvas context');
      }

      // 渲染 PDF 到 canvas
      setStatus('渲染 PDF...');
      console.log('开始渲染 PDF 到 Canvas');
      await pdfPage.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      console.log('PDF 渲染完成');

      // 图像预处理
      setStatus('预处理图像...');
      preprocessImage(renderCanvas, processCanvas);

      // 执行 OCR
      setStatus('执行文字识别...');
      console.time('OCR处理时间');
      console.log('开始 OCR 识别');
      const { data: { text } } = await workerRef.current.recognize(processCanvas);
      console.timeEnd('OCR处理时间');
      console.log('OCR 识别完成');

      if (!text || text.trim().length === 0) {
        throw new Error('未能识别出文本');
      }

      console.log('识别结果预览:', text.substring(0, 100) + '...');
      onProcessingComplete(text);
    } catch (error) {
      console.error('OCR 处理错误:', error);
      alert('OCR 处理过程中发生错误: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      // 清理临时创建的元素
      if (debugCanvasRef.current && debugCanvasRef.current.parentNode) {
        debugCanvasRef.current.parentNode.removeChild(debugCanvasRef.current);
      }
      setStatus('初始化中...');
    }
  };

  const handleError = (err: unknown): ProcessingError => {
    if (err instanceof Error) {
      return {
        message: err.message,
        code: 'UNKNOWN_ERROR'
      };
    }
    return {
      message: '未知错误',
      code: 'UNKNOWN_ERROR',
      details: err
    };
  };

  return (
    <div className="space-y-4">
      <button
        onClick={processPage}
        disabled={!workerRef.current || !isOpenCVReady}
        className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg disabled:opacity-50"
      >
        {!workerRef.current || !isOpenCVReady ? '正在加载组件...' :
         isProcessing ? `${status} (${progress}%)` : '开始 OCR 处理'}
      </button>
      
      {isProcessing && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">{status}</p>
        </>
      )}

      <div className="text-sm text-gray-500">
        提示：OCR 处理可能需要一些时间，请耐心等待
      </div>
    </div>
  );
} 