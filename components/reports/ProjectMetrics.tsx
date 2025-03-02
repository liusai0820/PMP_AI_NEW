"use client";

import React from 'react';

interface Metric {
  name: string;
  value: number;
  status: 'success' | 'warning' | 'danger' | 'normal';
}

interface ProjectInfo {
  name: string;
  manager: string;
  startDate: string;
  endDate: string;
  budget: string;
  completion: number;
}

interface ProjectMetricsProps {
  projectInfo: ProjectInfo;
  metrics: Metric[];
}

const ProjectMetrics: React.FC<ProjectMetricsProps> = ({ projectInfo, metrics }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">项目概览</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{projectInfo.name}</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">项目经理</p>
              <p className="font-medium">{projectInfo.manager}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">项目预算</p>
              <p className="font-medium">{projectInfo.budget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">开始日期</p>
              <p className="font-medium">{projectInfo.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">结束日期</p>
              <p className="font-medium">{projectInfo.endDate}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">完成度</span>
              <span className="text-sm font-medium text-gray-700">{projectInfo.completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${projectInfo.completion}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">关键指标</h4>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(metric.status)}`}></div>
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{metric.value.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMetrics; 