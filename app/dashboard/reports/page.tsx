"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/reports/FileUploader';
import AnalysisResult from '@/components/reports/AnalysisResult';

// 分析结果类型定义
interface AnalysisResultType {
  summary: string[];
  projectInfo: {
    name: string;
    status: string;
    completionRate: number;
    startDate: string;
    endDate: string;
  };
  metrics: Array<{
    name: string;
    value: number;
    status: 'success' | 'warning' | 'danger' | 'normal';
  }>;
  milestones: Array<{
    name: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
  risks: Array<{
    name: string;
    impact: string;
    mitigation: string;
  }>;
  recommendations: string[];
}

// 支持的模型列表
const AI_MODELS = [
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (最强)', description: '最强大的模型，适合复杂分析，但速度较慢' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet (推荐)', description: '平衡性能和速度，推荐大多数情况使用' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (快速)', description: '速度最快，适合简单分析或快速反馈' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'OpenAI的高级模型，强大且多功能' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI最新模型，优化了性能和速度' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', description: 'Google的高级模型，擅长结构化数据分析' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', description: 'Meta的开源大模型，性能强大' }
];

export default function ReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[1].id); // 默认使用Claude 3 Sonnet
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  
  // 重置分析状态
  const resetAnalysis = () => {
    setAnalysisStatus('idle');
    setAnalysisError(null);
    setAnalysisResult(null);
  };
  
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    resetAnalysis();
  };
  
  // 模拟分析进度
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (analysisStatus === 'analyzing') {
      const stages = [
        '准备分析...',
        '提取文件内容...',
        '处理文本数据...',
        '发送到AI模型...',
        '生成分析结果...',
        '格式化输出...',
        '完成分析'
      ];
      
      interval = setInterval(() => {
        // 这里需要实现进度条的逻辑
      }, 600);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analysisStatus]);
  
  // 监听分析进度，当达到100%时完成分析
  useEffect(() => {
    if (analysisStatus === 'analyzing' && analysisProgress >= 100) {
      // 延迟一下，让用户看到100%的进度
      const timer = setTimeout(() => {
        setAnalysisStatus('complete');
        setActiveTab('result');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [analysisProgress, analysisStatus]);
  
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('读取文件失败'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件时出错'));
      };
      
      if (file.type === 'application/pdf') {
        // PDF需要特殊处理，这里简化处理
        // 实际应用中应使用pdf.js等库
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };
  
  const startAnalysis = async () => {
    if (!uploadedFile) return;
    
    setAnalysisStatus('analyzing');
    setAnalysisError(null);
    
    try {
      // 读取文件内容
      const content = await readFileContent(uploadedFile);
      
      // 调用AI分析API
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportContent: content,
          fileType: uploadedFile.type,
          modelId: selectedModel,
          maxTokens: 4000
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '分析失败');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '分析结果无效');
      }
      
      // 保存分析结果
      setAnalysisResult(result.analysisResults);
      
      // 分析完成，进度会自动达到100%，触发状态变更
    } catch (error) {
      console.error('分析过程出错:', error);
      setAnalysisStatus('error');
      setAnalysisError(error instanceof Error ? error.message : '未知错误');
    }
  };
  
  const goToHistory = () => {
    router.push('/dashboard/report-history');
  };
  
  const getSelectedModelInfo = () => {
    return AI_MODELS.find(model => model.id === selectedModel);
  };
  
  // 在分析完成后将结果传递给AnalysisResult组件
  const renderAnalysisResult = () => {
    // 如果有分析结果，则传递给AnalysisResult组件
    // 这里我们可以在未来扩展，将实际的分析结果传递给组件
    console.log('当前分析结果:', analysisResult);
    
    return (
      <AnalysisResult 
        isLoading={analysisStatus === 'analyzing'} 
        reportId={uploadedFile ? uploadedFile.name : undefined}
        reportName={uploadedFile ? uploadedFile.name.split('.')[0] : undefined}
      />
    );
  };
  
  return (
    <div className="container mx-auto px-2 py-3">
      <header className="mb-3 flex justify-end items-center">
        <button
          onClick={goToHistory}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          查看历史报告
        </button>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              上传文件
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'result'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={!analysisResult && analysisStatus !== 'analyzing'}
            >
              分析结果
            </button>
          </nav>
        </div>
        
        <div className="p-3">
          {activeTab === 'upload' ? (
            <div>
              <div className="max-w-3xl mx-auto">
                {uploadedFile ? (
                  <div className="mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">{uploadedFile.name}</span>
                        <span className="ml-2 text-xs text-blue-600">({Math.round(uploadedFile.size / 1024)} KB)</span>
                      </div>
                      <button 
                        onClick={() => setUploadedFile(null)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        移除文件
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        选择AI模型
                      </label>
                      <div className="relative">
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        >
                          {AI_MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowModelInfo(!showModelInfo)}
                          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      {showModelInfo && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs text-gray-600">
                          {getSelectedModelInfo()?.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={startAnalysis}
                        disabled={analysisStatus === 'analyzing'}
                        className={`inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          analysisStatus === 'analyzing'
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        {analysisStatus === 'analyzing' ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            分析中...
                          </>
                        ) : (
                          '开始分析'
                        )}
                      </button>
                    </div>
                    
                    {analysisStatus === 'analyzing' && (
                      <div className="mt-4">
                        <div className="relative pt-1">
                          <div className="flex mb-1 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {analysisStage}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {analysisProgress}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200">
                            <div style={{ width: `${analysisProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {analysisStatus === 'error' && analysisError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="ml-3 text-sm text-red-700">{analysisError}</p>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={resetAnalysis}
                            className="text-sm text-red-700 font-medium hover:text-red-800"
                          >
                            重试
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {analysisStatus === 'complete' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex">
                          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="ml-3 text-sm text-green-700">分析完成！</p>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setActiveTab('result')}
                            className="text-sm text-green-700 font-medium hover:text-green-800"
                          >
                            查看结果
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-4">
                    <FileUploader onFileUpload={handleFileUpload} />
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      支持的文件格式：PDF, DOCX, PPTX, XLSX, TXT (最大 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            renderAnalysisResult()
          )}
        </div>
      </div>
    </div>
  );
} 