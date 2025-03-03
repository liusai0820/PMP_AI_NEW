"use client";

import React, { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      uploadFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      uploadFile(file);
    }
  };
  
  const handleButtonClick = () => {
    if (uploadStatus === 'uploading') return;
    inputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) throw new Error('上传失败');
      
      setUploadProgress(100);
      setUploadStatus('success');
      
      // 通知父组件
      onFileUpload(file);
      
      // 延迟重置状态，让用户看到成功状态
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('上传出错:', error);
      setUploadStatus('error');
      
      // 延迟重置错误状态
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg ${
          uploadStatus === 'uploading' ? 'cursor-wait' : 'cursor-pointer'
        } ${
          uploadStatus === 'error' ? 'border-red-500 bg-red-50' :
          uploadStatus === 'success' ? 'border-green-500 bg-green-50' :
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {uploadStatus === 'uploading' ? (
          <>
            <svg className="w-12 h-12 mb-3 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <div className="w-64 h-3 bg-gray-200 rounded-full mb-2">
              <div 
                className="h-3 bg-blue-600 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-500">{uploadProgress}% 已完成</p>
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <svg className="w-12 h-12 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="mb-2 text-sm text-green-500 font-semibold">上传成功!</p>
            {selectedFile && <p className="text-xs text-gray-500">{selectedFile.name}</p>}
          </>
        ) : uploadStatus === 'error' ? (
          <>
            <svg className="w-12 h-12 mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <p className="mb-2 text-sm text-red-500 font-semibold">上传失败，请重试</p>
          </>
        ) : (
          <>
            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">点击上传</span> 或拖放文件
            </p>
            <p className="text-xs text-gray-500">支持 PDF, DOCX, XLSX 格式</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.xlsx"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUploader; 