"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProjectInfo {
  name: string;
  code: string;
  department: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: string;
  description: string;
  objectives: string[];
  stakeholders: string[];
}

export default function NewProjectPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    code: '',
    department: '',
    manager: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
    objectives: [],
    stakeholders: []
  });
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');
  const [error, setError] = useState<string | null>(null);

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  // 处理拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  // 上传并分析文件
  const analyzeFile = async () => {
    if (!file) {
      setError('请先上传项目文件');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // 读取文件内容
      const fileContent = await readFileContent(file);
      
      // 模拟上传进度
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // 模拟分析进度
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
      
      // 调用API分析文件内容
      const response = await fetch('/api/project-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent,
          fileType: file.type
        }),
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('分析失败，请重试');
      }
      
      const result = await response.json();
      setProjectInfo(result.projectInfo);
      setAnalysisProgress(100);
      
      // 延迟一下，展示100%进度
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep('review');
      }, 500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // 读取文件内容
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('无法读取文件内容'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件时出错'));
      };
      
      if (file.type.includes('pdf')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // 保存项目信息
  const saveProject = async () => {
    try {
      setError(null);
      
      // 验证必填字段
      if (!projectInfo.name || !projectInfo.code) {
        setError('项目名称和编号为必填项');
        return;
      }
      
      // 调用API保存项目
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectInfo),
      });
      
      if (!response.ok) {
        throw new Error('保存失败，请重试');
      }
      
      // 保存成功，进入完成步骤
      setStep('complete');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存过程中出现错误');
    }
  };

  // 处理表单字段变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理目标和干系人变更（数组类型）
  const handleArrayChange = (field: 'objectives' | 'stakeholders', index: number, value: string) => {
    setProjectInfo(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // 添加新的目标或干系人
  const addArrayItem = (field: 'objectives' | 'stakeholders') => {
    setProjectInfo(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // 删除目标或干系人
  const removeArrayItem = (field: 'objectives' | 'stakeholders', index: number) => {
    setProjectInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <div className="flex items-center">
          <Link href="/dashboard/projects" className="mr-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">创建新项目</h1>
        </div>
      </header>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* 步骤指示器 */}
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'upload' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">上传文件</span>
            </div>
            <div className={`w-12 h-1 mx-2 ${step === 'upload' ? 'bg-gray-200' : 'bg-blue-500'}`}></div>
            <div className={`flex items-center ${step === 'review' ? 'text-blue-600' : (step === 'complete' ? 'text-gray-500' : 'text-gray-400')}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'review' ? 'bg-blue-100 text-blue-600' : (step === 'complete' ? 'bg-gray-100' : 'bg-gray-100')}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">审核信息</span>
            </div>
            <div className={`w-12 h-1 mx-2 ${step === 'complete' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step === 'complete' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'complete' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">完成</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 步骤1: 上传文件 */}
          {step === 'upload' && (
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  上传项目相关文件（如合同、立项书等），系统将自动提取关键信息。支持的文件格式：PDF、Word、TXT。
                </p>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {!file ? (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-sm text-gray-600 mb-2">拖放文件到这里，或点击上传</p>
                      <p className="text-xs text-gray-500">最大文件大小: 10MB</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-800 font-medium mb-1">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  )}
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {(isUploading || isAnalyzing) && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {isUploading ? '上传中...' : '分析中...'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: isUploading ? '100%' : `${analysisProgress}%` }}
                    ></div>
                  </div>
                  {isAnalyzing && (
                    <p className="text-xs text-gray-500 mt-1">
                      正在提取项目信息，请稍候...{analysisProgress}%
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                  onClick={() => router.push('/dashboard/projects')}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={analyzeFile}
                  disabled={!file || isUploading || isAnalyzing}
                >
                  {isUploading || isAnalyzing ? '处理中...' : '分析文件'}
                </button>
              </div>
            </div>
          )}
          
          {/* 步骤2: 审核信息 */}
          {step === 'review' && (
            <div>
              <p className="text-sm text-gray-600 mb-6">
                系统已从文件中提取以下信息，请审核并补充完善。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    项目名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={projectInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    项目编号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={projectInfo.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    所属部门
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={projectInfo.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                    项目经理
                  </label>
                  <input
                    type="text"
                    id="manager"
                    name="manager"
                    value={projectInfo.manager}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={projectInfo.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={projectInfo.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    预算
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={projectInfo.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：¥1,000,000"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={projectInfo.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目目标
                </label>
                {projectInfo.objectives.map((objective, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('objectives', index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  添加目标
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目干系人
                </label>
                {projectInfo.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={stakeholder}
                      onChange={(e) => handleArrayChange('stakeholders', index, e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('stakeholders', index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('stakeholders')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  添加干系人
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                  onClick={() => setStep('upload')}
                >
                  返回
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={saveProject}
                >
                  保存项目
                </button>
              </div>
            </div>
          )}
          
          {/* 步骤3: 完成 */}
          {step === 'complete' && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-2">项目创建成功！</h2>
              <p className="text-gray-600 mb-6">
                您已成功创建项目"{projectInfo.name}"。现在您可以开始管理项目了。
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => router.push('/dashboard/projects')}
                >
                  返回项目列表
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => router.push(`/dashboard/projects/${projectInfo.code}`)}
                >
                  查看项目详情
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 