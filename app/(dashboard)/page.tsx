"use client";

import React, { useEffect, useState } from 'react';
import StatCards from '@/components/dashboard/StatCards';
import ProjectTrends from '@/components/dashboard/ProjectTrends';
import ProjectTypeDistribution from '@/components/dashboard/ProjectTypeDistribution';
import RecentProjects from '@/components/dashboard/RecentProjects';
import RecentActivities from '@/components/dashboard/RecentActivities';

// 定义仪表盘数据类型
interface DashboardData {
  stats: {
    totalProjects: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
  projectTrends: {
    labels: string[];
    datasets: {
      name: string;
      data: number[];
    }[];
  };
  projectTypes: {
    type: string;
    count: number;
  }[];
  recentProjects: {
    id: number;
    name: string;
    status: string;
    progress: number;
    dueDate: string;
  }[];
  recentActivities: {
    id: number;
    user: string;
    action: string;
    project: string;
    time: string;
  }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('获取仪表盘数据失败');
        }
        
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        console.error('仪表盘数据加载错误:', err);
        setError('加载数据时出错，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="mt-2">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">上次更新: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <StatCards 
        stats={data?.stats || {
          totalProjects: 0,
          inProgress: 0,
          completed: 0,
          delayed: 0
        }} 
      />
      
      {/* 图表和表格 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 项目趋势图表 */}
        <ProjectTrends data={data?.projectTrends} />
        
        {/* 项目类型分布 */}
        <ProjectTypeDistribution data={data?.projectTypes} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 最近项目 */}
        <RecentProjects projects={data?.recentProjects || []} />
        
        {/* 最近活动 */}
        <RecentActivities activities={data?.recentActivities || []} />
      </div>
    </div>
  );
}
