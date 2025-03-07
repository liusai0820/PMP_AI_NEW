"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { OCRResponse } from '@/lib/services/ocr';
import axios from 'axios';

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function OCRUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<OCRResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [externalUrlWarning, setExternalUrlWarning] = useState<boolean>(false);
  const [usingCloudflareR2, setUsingCloudflareR2] = useState<boolean>(true);
  
  // 检查外部URL和Cloudflare R2配置
  useEffect(() => {
    const externalUrl = process.env.NEXT_PUBLIC_EXTERNAL_URL;
    
    if (!externalUrl) {
      setExternalUrlWarning(true);
    }
    
    if (externalUrl && externalUrl.includes('r2.dev')) {
      setUsingCloudflareR2(true);
    } else {
      setUsingCloudflareR2(false);
    }
  }, []);
  
  // 将文件转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // 添加进度事件
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result); // 返回完整的 data URL
        } else {
          reject(new Error('无法将文件转换为base64格式'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setResults(null);
    
    try {
      const file = acceptedFiles[0];
      
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`文件太大，最大允许 ${MAX_FILE_SIZE / (1024 * 1024)} MB，当前文件大小 ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      }
      
      setProcessingStep('正在读取文件...');
      const base64Data = await fileToBase64(file);
      
      // 根据文件类型选择处理方法
      const isImage = file.type.startsWith('image/');
      
      setProcessingStep(isImage ? '正在上传图片...' : '正在上传文档...');
      
      console.log(`处理${isImage ? '图片' : '文档'}，类型: ${file.type}, 大小: ${(file.size / 1024).toFixed(2)} KB`);
      
      // 使用API路由处理OCR
      setProcessingStep(isImage ? '正在处理图片...' : '正在处理文档...');
      const response = await axios.post('/api/ocr', {
        data: base64Data,
        isImage: isImage,
        options: {
          includeImageBase64: true
        }
      });
      
      setResults(response.data);
    } catch (err) {
      console.error('OCR处理失败:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`OCR处理失败: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
        setError(err instanceof Error ? err.message : '处理文件时发生错误');
      }
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });
  
  // 处理文件拒绝的错误信息
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="mt-2 text-sm text-red-600">
      <p><strong>{file.name}</strong> - {file.size} 字节</p>
      <ul className="list-disc pl-5">
        {errors.map(e => (
          <li key={e.code}>
            {e.code === 'file-too-large' 
              ? `文件太大，最大允许 ${MAX_FILE_SIZE / (1024 * 1024)} MB` 
              : e.message}
          </li>
        ))}
      </ul>
    </div>
  ));
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {usingCloudflareR2 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 font-medium">✅ 使用 Cloudflare R2 存储</p>
          <p className="mt-2 text-sm text-blue-600">
            您的文件将上传到 Cloudflare R2 存储桶，并通过公共 URL 提供给 Mistral API 进行处理。
            <br />
            URL: {process.env.NEXT_PUBLIC_EXTERNAL_URL || 'https://pub-0711119e9c2f45d086d1017a74c99863.r2.dev'}
          </p>
        </div>
      )}
      
      {externalUrlWarning && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 font-medium">⚠️ 外部URL未设置</p>
          <p className="mt-2 text-sm text-yellow-600">
            您需要在 <code>.env.local</code> 文件中设置 <code>NEXT_PUBLIC_EXTERNAL_URL</code> 环境变量为一个真实的、可公开访问的 HTTPS URL。
            <br />
            Mistral API 需要通过 HTTPS URL 访问您的文件，本地的 localhost URL 无法被 Mistral API 访问。
          </p>
          <p className="mt-2 text-sm text-yellow-600">
            您可以使用以下方法之一：
            <ul className="list-disc pl-5 mt-1">
              <li>使用 Cloudflare R2 存储（已配置）</li>
              <li>使用 ngrok 等工具创建临时的 HTTPS 隧道</li>
              <li>使用您拥有的域名和服务器</li>
              <li>使用其他云存储服务（如 AWS S3、Azure Blob Storage、Google Cloud Storage）</li>
            </ul>
          </p>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <div className="text-gray-600">
            {isDragActive ? (
              <p>将文件拖放到此处...</p>
            ) : (
              <p>
                拖放文件到此处，或点击选择文件
                <br />
                <span className="text-sm text-gray-500">支持 PDF 和图片文件 (最大 10MB)</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {fileRejectionItems.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          {fileRejectionItems}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">{processingStep || '正在处理文件...'}</p>
          <p className="text-sm text-gray-500">
            {uploadProgress === 100 
              ? '文件已读取，正在等待OCR处理结果...' 
              : `读取进度: ${uploadProgress}%`}
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            如果文件太大，请尝试：
            <ul className="list-disc pl-5 mt-1">
              <li>压缩文件大小</li>
              <li>将PDF转换为图片</li>
              <li>分割PDF为多个小文件</li>
            </ul>
          </p>
        </div>
      )}
      
      {results && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">识别结果</h3>
          {results.pages.map((page, index) => (
            <div key={index} className="p-4 bg-white border rounded-lg shadow-sm">
              <h4 className="font-medium mb-2">第 {page.index + 1} 页</h4>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.markdown }} />
              </div>
              {page.images && page.images.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">图片 ({page.images.length})</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {page.images.map((image) => (
                      <div key={image.id} className="border rounded p-2">
                        {image.image_base64 && (
                          <img 
                            src={`data:image/png;base64,${image.image_base64}`}
                            alt={`提取的图片 ${image.id}`}
                            className="max-w-full h-auto"
                          />
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          <p>位置: ({image.top_left_x.toFixed(2)}, {image.top_left_y.toFixed(2)}) - ({image.bottom_right_x.toFixed(2)}, {image.bottom_right_y.toFixed(2)})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {page.dimensions && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>页面尺寸: {page.dimensions.width} x {page.dimensions.height} (DPI: {page.dimensions.dpi})</p>
                </div>
              )}
            </div>
          ))}
          <div className="text-sm text-gray-500">
            <p>处理页数: {results.usage_info.pages_processed}</p>
            {results.usage_info.doc_size_bytes && (
              <p>文件大小: {Math.round(results.usage_info.doc_size_bytes / 1024)} KB</p>
            )}
            <p>使用模型: {results.model}</p>
          </div>
        </div>
      )}
    </div>
  );
} 