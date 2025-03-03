"use client";

import React, { useState } from 'react';
import ProjectMetrics from './ProjectMetrics';
import Milestones from './Milestones';
import RiskItems from './RiskItems';
import { analysisResults } from '@/lib/mockData';

interface AnalysisResultProps {
  isLoading?: boolean;
  reportId?: string;
  reportName?: string;
}

// 定义正确的类型
interface Metric {
  name: string;
  value: number;
  status: 'success' | 'warning' | 'danger' | 'normal';
}

interface Milestone {
  name: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  isLoading = false,
  reportId = '1',
  reportName = '项目报告分析'
}) => {
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null);

  // 导出为PDF功能
  const exportToPDF = async () => {
    try {
      setExportStatus('exporting');
      setExportType('pdf');
      
      // 在实际应用中，这里会使用html2pdf或类似库导出当前分析结果
      console.log(`导出PDF中... 报告ID: ${reportId}`);
      
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 创建一个简单的下载链接
      const fileName = `${reportName.replace(/\s+/g, '_')}_分析结果_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // 实际应用中，这里会生成真实的PDF文件
      // 这里只是模拟下载过程
      alert(`PDF导出成功，文件名: ${fileName}`);
      
      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
      
    } catch (error) {
      console.error('PDF导出错误:', error);
      setExportStatus('error');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
    }
  };

  // 导出为Excel功能
  const exportToExcel = async () => {
    try {
      setExportStatus('exporting');
      setExportType('excel');
      
      // 在实际应用中，这里会使用xlsx库导出数据
      console.log(`导出Excel中... 报告ID: ${reportId}`);
      
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建一个简单的下载链接
      const fileName = `${reportName.replace(/\s+/g, '_')}_分析数据_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // 实际应用中，这里会生成真实的Excel文件
      // 这里只是模拟下载过程
      alert(`Excel导出成功，文件名: ${fileName}`);
      
      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
      
    } catch (error) {
      console.error('Excel导出错误:', error);
      setExportStatus('error');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
    }
  };

  // 导出为Word文档
  const exportToWord = async () => {
    try {
      setExportStatus('exporting');
      setExportType('excel'); // 复用Excel的图标
      
      console.log(`导出Word中... 报告ID: ${reportId}`);
      
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      // 创建一个简单的下载链接
      const fileName = `${reportName.replace(/\s+/g, '_')}_分析报告_${new Date().toISOString().split('T')[0]}.docx`;
      
      // 实际应用中，这里会生成真实的Word文件
      alert(`Word导出成功，文件名: ${fileName}`);
      
      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
      
    } catch (error) {
      console.error('Word导出错误:', error);
      setExportStatus('error');
      setTimeout(() => {
        setExportStatus('idle');
        setExportType(null);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">正在分析报告，请稍候...</p>
      </div>
    );
  }
  
  // 转换数据以匹配正确的类型
  const metrics: Metric[] = analysisResults.metrics.map(metric => ({
    ...metric,
    status: metric.status as 'success' | 'warning' | 'danger' | 'normal'
  }));
  
  const milestones: Milestone[] = analysisResults.milestones.map(milestone => ({
    ...milestone,
    status: milestone.status as 'completed' | 'in-progress' | 'pending'
  }));
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">分析摘要</h3>
        </div>
        <div className="p-4">
          <ul className="list-disc pl-5 space-y-2">
            {analysisResults.summary.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectMetrics 
          projectInfo={analysisResults.projectInfo}
          metrics={metrics}
        />
        
        <Milestones 
          milestones={milestones}
        />
      </div>
      
      <RiskItems 
        risks={analysisResults.risks}
      />
      
      <div className="flex flex-wrap justify-end gap-2">
        <button 
          onClick={exportToPDF}
          disabled={exportStatus === 'exporting'}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
            exportStatus === 'exporting' && exportType === 'pdf'
              ? 'bg-red-400 text-white cursor-wait'
              : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          {exportStatus === 'exporting' && exportType === 'pdf' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              导出中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              导出PDF
            </>
          )}
        </button>
        
        <button 
          onClick={exportToExcel}
          disabled={exportStatus === 'exporting'}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
            exportStatus === 'exporting' && exportType === 'excel'
              ? 'bg-green-400 text-white cursor-wait'
              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {exportStatus === 'exporting' && exportType === 'excel' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              导出中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
              导出Excel
            </>
          )}
        </button>
        
        <button 
          onClick={exportToWord}
          disabled={exportStatus === 'exporting'}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
            exportStatus === 'exporting'
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {exportStatus === 'exporting' && exportType === 'excel' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              导出中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              导出Word
            </>
          )}
        </button>
      </div>
      
      {exportStatus === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">导出成功！文件已准备好下载。</p>
            </div>
          </div>
        </div>
      )}
      
      {exportStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">导出失败，请重试。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult; 