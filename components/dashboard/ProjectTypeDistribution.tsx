"use client";

import React from 'react';

interface ProjectTypeDistributionProps {
  data?: {
    type: string;
    count: number;
  }[];
}

const ProjectTypeDistribution: React.FC<ProjectTypeDistributionProps> = ({ data }) => {
  // 如果没有数据，显示占位图
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">项目类型分布</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  // 计算总数
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // 颜色列表
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">项目类型分布</h3>
      
      <div className="flex">
        {/* 饼图 */}
        <div className="w-1/2 relative">
          <div className="w-40 h-40 mx-auto relative">
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const previousPercentages = data
                .slice(0, index)
                .reduce((sum, prevItem) => sum + (prevItem.count / total) * 100, 0);
              
              return (
                <div 
                  key={index}
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(transparent ${previousPercentages}%, ${colors[index % colors.length]} ${previousPercentages}%, ${colors[index % colors.length]} ${previousPercentages + percentage}%, transparent ${previousPercentages + percentage}%)`
                  }}
                ></div>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-800">{total}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 图例 */}
        <div className="w-1/2">
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = ((item.count / total) * 100).toFixed(1);
              
              return (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div className="flex-1 text-sm text-gray-600">{item.type}</div>
                  <div className="text-sm font-medium text-gray-800">{item.count} ({percentage}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeDistribution; 