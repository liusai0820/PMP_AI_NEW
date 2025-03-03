"use client";

import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';

// 支持的文件类型
const ACCEPTED_FILE_TYPES = [
  'application/pdf',                                                     // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword',                                                  // DOC
  'text/plain',                                                          // TXT
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',   // XLSX
  'application/vnd.ms-excel',                                            // XLS
];

// 文件类型图标映射
const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'application/pdf': (
    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (
    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  'text/plain': (
    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm1 2h8v8H6V6z" clipRule="evenodd" />
    </svg>
  ),
};

// 默认图标
const DEFAULT_ICON = (
  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
  </svg>
);

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 知识分类选项
const KNOWLEDGE_CATEGORIES = [
  { id: 1, name: '项目管理基础' },
  { id: 2, name: '风险管理' },
  { id: 3, name: '质量管理' },
  { id: 4, name: '进度管理' },
  { id: 5, name: '成本管理' },
  { id: 6, name: '沟通管理' },
  { id: 7, name: '采购管理' },
  { id: 8, name: '人力资源管理' },
];

interface DocumentMetadata {
  title: string;
  description: string;
  category: string;
  tags: string;
}

interface UploadedDocument {
  files: File[];
  metadata: DocumentMetadata;
  uploadedAt: string;
}

interface DocumentUploaderProps {
  onUploadComplete?: (documentData: UploadedDocument) => void;
  onCancel?: () => void;
}

export default function DocumentUploader({ onUploadComplete, onCancel }: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理拖拽事件
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // 处理文件放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // 处理文件验证和添加
  const handleFiles = (fileList: FileList) => {
    const newFiles: File[] = [];
    let hasError = false;
    
    Array.from(fileList).forEach(file => {
      // 验证文件类型
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setUploadError(`不支持的文件类型: ${file.name}`);
        hasError = true;
        return;
      }
      
      // 验证文件大小 (限制为20MB)
      if (file.size > 20 * 1024 * 1024) {
        setUploadError(`文件过大: ${file.name} (最大20MB)`);
        hasError = true;
        return;
      }
      
      newFiles.push(file);
    });
    
    if (!hasError) {
      setUploadError(null);
      setFiles(prev => [...prev, ...newFiles]);
      
      // 如果是第一个文件，自动设置标题
      if (files.length === 0 && newFiles.length > 0) {
        // 移除文件扩展名作为标题
        const fileName = newFiles[0].name.replace(/\.[^/.]+$/, "");
        setMetadata(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  // 移除文件
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 处理元数据变更
  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  // 模拟上传过程
  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('请选择至少一个文件上传');
      return;
    }
    
    if (!metadata.title.trim()) {
      setUploadError('请输入文档标题');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // 模拟上传延迟
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // 模拟上传完成后的处理
      setTimeout(() => {
        setIsUploading(false);
        
        if (onUploadComplete) {
          onUploadComplete({
            files,
            metadata,
            uploadedAt: new Date().toISOString(),
          });
        }
      }, 500);
    }, 3000);
  };

  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    return FILE_TYPE_ICONS[fileType] || DEFAULT_ICON;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">上传文档到知识库</h2>
        
        {/* 拖放区域 */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : files.length > 0 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={ACCEPTED_FILE_TYPES.join(',')}
          />
          
          <div className="text-center">
            {files.length === 0 ? (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  拖放文件到此处，或者{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 focus:outline-none"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    浏览文件
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  支持 PDF, DOCX, TXT, XLSX 等格式，最大20MB
                </p>
              </>
            ) : (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => removeFile(index)}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  添加更多文件
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 错误提示 */}
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {uploadError}
            </div>
          </div>
        )}
        
        {/* 元数据表单 */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="title">文档标题 *</Label>
            <Input
              id="title"
              name="title"
              value={metadata.title}
              onChange={handleMetadataChange}
              placeholder="输入文档标题"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">文档描述</Label>
            <textarea
              id="description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
              placeholder="输入文档描述"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="category">知识分类</Label>
            <select
              id="category"
              name="category"
              value={metadata.category}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">选择分类</option>
              {KNOWLEDGE_CATEGORIES.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="tags">标签</Label>
            <Input
              id="tags"
              name="tags"
              value={metadata.tags}
              onChange={handleMetadataChange}
              placeholder="输入标签，用逗号分隔"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500">
              多个标签请用逗号分隔，例如：PMP,敏捷,风险管理
            </p>
          </div>
        </div>
        
        {/* 上传进度 */}
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>上传进度</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
          >
            取消
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? '上传中...' : '上传文档'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 