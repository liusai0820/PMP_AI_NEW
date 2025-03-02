"use client";

import React, { useState } from 'react';
import FileUploader from '@/components/reports/FileUploader';
import AnalysisResult from '@/components/reports/AnalysisResult';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisStatus('idle');
  };
  
  const startAnalysis = () => {
    if (!uploadedFile) return;
    
    setAnalysisStatus('analyzing');
    
    // 模拟分析过程
    setTimeout(() => {
      setAnalysisStatus('complete');
      setActiveTab('result');
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">报告分析</h1>
        <p className="mt-2 text-gray-600">上传项目报告文件，获取智能分析结果</p>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              上传文件
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'result'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${analysisStatus !== 'complete' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={analysisStatus !== 'complete'}
            >
              分析结果
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'upload' ? (
            <div className="space-y-6">
              <FileUploader onFileUpload={handleFileUpload} />
              
              {uploadedFile && (
                <div className="mt-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      删除
                    </button>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={startAnalysis}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      开始分析
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnalysisResult isLoading={analysisStatus === 'analyzing'} />
          )}
        </div>
      </div>
    </div>
  );
} 