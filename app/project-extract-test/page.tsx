"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { OCRResponse } from '@/lib/services/ocr';
import { ProjectInfo } from '@/lib/services/projectExtractor';

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ProjectExtractTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResponse | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  
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
    setOcrResult(null);
    setProjectInfo(null);
    
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
      
      // 使用API路由处理OCR和项目信息提取
      setProcessingStep('正在进行OCR处理和项目信息提取...');
      const response = await axios.post('/api/project-extract', {
        data: base64Data,
        isImage: isImage,
        options: {
          includeImageBase64: true
        }
      });
      
      setOcrResult(response.data.ocrResult);
      setProjectInfo(response.data.projectInfo);
    } catch (err) {
      console.error('处理失败:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`处理失败: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">项目信息提取测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="prose">
            <p>本页面用于测试从文档中提取项目信息的功能。上传项目文档（PDF或图片），系统将自动进行以下处理：</p>
            <ol className="list-decimal pl-5">
              <li>使用OCR技术识别文档中的文本内容</li>
              <li>使用大语言模型从文本中提取结构化的项目信息</li>
              <li>显示提取结果</li>
            </ol>
            
            <h3 className="text-lg font-medium mt-4">支持的文件类型</h3>
            <ul className="list-disc pl-5">
              <li>PDF 文档 (.pdf)</li>
              <li>图片文件 (.jpg, .jpeg, .png, .gif, .bmp)</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4">文件大小限制</h3>
            <p>最大支持 10MB 的文件。</p>
          </div>
        </div>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-8
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
                  拖放项目文档到此处，或点击选择文件
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
          <div className="mt-4 text-center p-6 bg-white rounded-lg shadow-md">
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
                ? '文件已读取，正在进行OCR处理和信息提取...' 
                : `读取进度: ${uploadProgress}%`}
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {projectInfo && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">提取的项目信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">基本信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">项目名称</dt>
                    <dd>{projectInfo.projectName || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">项目编号</dt>
                    <dd>{projectInfo.projectCode || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">开始日期</dt>
                    <dd>{projectInfo.startDate || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">结束日期</dt>
                    <dd>{projectInfo.endDate || '未提取到'}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">财务信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">预算</dt>
                    <dd>{projectInfo.budget ? `¥${projectInfo.budget.toLocaleString()}` : '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">实际成本</dt>
                    <dd>{projectInfo.actualCost ? `¥${projectInfo.actualCost.toLocaleString()}` : '未提取到'}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">人员信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">项目经理</dt>
                    <dd>{projectInfo.projectManager || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">项目负责人</dt>
                    <dd>{projectInfo.projectOwner || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">所属部门</dt>
                    <dd>{projectInfo.department || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">团队成员</dt>
                    <dd>
                      {projectInfo.teamMembers && projectInfo.teamMembers.length > 0 
                        ? (
                          <ul className="list-disc pl-5">
                            {projectInfo.teamMembers.map((member: string, index: number) => (
                              <li key={index}>{member}</li>
                            ))}
                          </ul>
                        ) 
                        : '未提取到'
                      }
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">状态信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">项目状态</dt>
                    <dd>{projectInfo.status || '未提取到'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">项目描述</dt>
                    <dd className="whitespace-pre-wrap">{projectInfo.description || '未提取到'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {projectInfo.riskPoints && projectInfo.riskPoints.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">风险点</h3>
                <ul className="list-disc pl-5">
                  {projectInfo.riskPoints.map((risk: string, index: number) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {projectInfo.milestones && projectInfo.milestones.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">里程碑</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projectInfo.milestones.map((milestone: {name: string; date: string; status?: string}, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{milestone.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{milestone.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{milestone.status || '未知'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {ocrResult && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">OCR 原始结果</h2>
            <div className="overflow-auto max-h-96 p-4 bg-gray-50 rounded-lg">
              <pre className="text-xs">{JSON.stringify(ocrResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 