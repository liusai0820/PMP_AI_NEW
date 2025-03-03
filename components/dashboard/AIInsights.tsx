"use client";

import React from 'react';
import Link from 'next/link';

interface InsightItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  projectId: string;
  projectName: string;
  timestamp: string;
}

interface AIInsightsProps {
  insights: InsightItem[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  // 获取影响程度对应的样式
  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取影响程度对应的文本
  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-lg font-semibold">AI洞察与预测</h2>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          AI驱动
        </span>
      </div>
      
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>暂无AI洞察</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="mt-2 flex items-center text-xs">
                      <span className="text-gray-500 mr-2">相关项目:</span>
                      <Link href={`/dashboard/projects/${insight.projectId}`} className="text-blue-600 hover:underline">
                        {insight.projectName}
                      </Link>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getImpactStyle(insight.impact)}`}>
                  {getImpactText(insight.impact)}风险
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">{insight.timestamp}</span>
                <Link href={`/dashboard/insights/${insight.id}`} className="text-xs text-blue-600 hover:underline">
                  查看详情 →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/dashboard/insights" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          查看所有AI分析
          <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default AIInsights; 