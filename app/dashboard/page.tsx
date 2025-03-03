"use client";

import React from "react";
import { 
  ProjectAnalysisCharts,
  EnhancedStatCard,
  ProjectMonitor
} from "@/components/dashboard";
import AIInsights from "@/components/dashboard/AIInsights";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { 
  projectData, 
  typeData, 
  resourceData, 
  riskMatrixData, 
  statCardTrends,
  aiInsightsData,
  getMockAIInsights
} from "@/lib/mockData";
import { useEffect, useState } from "react";

// 使用从mockData导入的InsightItem类型
type InsightItem = {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  projectId: string;
  projectName: string;
  timestamp: string;
};

export default function Dashboard() {
  const [insights, setInsights] = useState<InsightItem[]>(aiInsightsData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMockAIInsights();
        setInsights(data);
      } catch (error) {
        console.error("获取AI洞察数据失败:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-2 py-3">
      {/* 筛选器区域 */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-3">
        <div className="flex items-center space-x-2">
          <select className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">所有项目</option>
            <option value="active">进行中项目</option>
            <option value="completed">已完成项目</option>
          </select>
          <select className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="month6">近6个月</option>
            <option value="month3">近3个月</option>
            <option value="month1">近1个月</option>
          </select>
        </div>
      </div>
      
      {/* 统计卡片区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <EnhancedStatCard 
          title="总项目数" 
          value="183" 
          change="12%" 
          changePercent={12}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          trendData={statCardTrends.totalProjects}
          gradientFrom="#3b82f6"
          gradientTo="#1e40af"
        />
        <EnhancedStatCard 
          title="已完成项目" 
          value="137" 
          change="8%" 
          changePercent={8}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          trendData={statCardTrends.completedProjects}
          gradientFrom="#10b981"
          gradientTo="#047857"
        />
        <EnhancedStatCard 
          title="进行中项目" 
          value="38" 
          change="-5%" 
          changePercent={-5}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trendData={statCardTrends.inProgressProjects}
          gradientFrom="#f59e0b"
          gradientTo="#b45309"
        />
        <EnhancedStatCard 
          title="存在风险项目" 
          value="8" 
          change="25%" 
          changePercent={25}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          trendData={statCardTrends.riskProjects}
          gradientFrom="#ef4444"
          gradientTo="#b91c1c"
        />
      </div>
      
      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* 左侧区域 - 项目分析与监控图表 */}
        <div className="lg:col-span-3 space-y-3">
          {/* 项目监控大盘 */}
          <ProjectMonitor 
            healthScore={78} 
            riskMatrix={riskMatrixData}
          />
          
          {/* 多维度项目分析图表 */}
          <ProjectAnalysisCharts 
            trendData={projectData}
            typeData={typeData}
            resourceData={resourceData}
          />
        </div>
        
        {/* 右侧区域 - AI洞察与活动记录 */}
        <div className="lg:col-span-1 space-y-3">
          {/* AI洞察与预测区 */}
          <AIInsights insights={insights} />
          
          {/* 活动与任务整合区 */}
          <RecentActivities />
        </div>
      </div>
      
      {/* 新建项目按钮 */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}