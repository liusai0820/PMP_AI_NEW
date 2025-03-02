"use client";

import React from 'react';
import ProjectMetrics from './ProjectMetrics';
import Milestones from './Milestones';
import RiskItems from './RiskItems';
import { analysisResults } from '@/lib/mockData';

interface AnalysisResultProps {
  isLoading?: boolean;
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

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isLoading = false }) => {
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
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          导出分析报告
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult; 