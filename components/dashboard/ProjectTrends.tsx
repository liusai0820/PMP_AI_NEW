"use client";

import React from 'react';

interface ProjectTrendsProps {
  data?: {
    labels: string[];
    datasets: {
      name: string;
      data: number[];
    }[];
  };
}

const ProjectTrends: React.FC<ProjectTrendsProps> = ({ data }) => {
  // 如果没有数据，显示占位图
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">项目趋势</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data)) * 1.2;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">项目趋势</h3>
      <div className="h-64 relative">
        {/* Y轴 */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.round(maxValue)}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* 图表区域 */}
        <div className="absolute left-10 right-0 top-0 bottom-0">
          <div className="h-full flex items-end">
            {data.labels.map((label, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full h-48 flex items-end justify-center space-x-1">
                  {data.datasets.map((dataset, datasetIndex) => {
                    const height = (dataset.data[index] / maxValue) * 100;
                    return (
                      <div
                        key={datasetIndex}
                        className={`w-4 rounded-t ${datasetIndex === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
          
          {/* 网格线 */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
        </div>
      </div>
      
      {/* 图例 */}
      <div className="mt-4 flex justify-center space-x-6">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'} mr-2`}></div>
            <span className="text-sm text-gray-600">{dataset.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTrends; 