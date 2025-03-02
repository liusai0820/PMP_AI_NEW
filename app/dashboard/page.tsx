"use client";

import React from "react";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { projectData } from "@/lib/mockData";

// 统计卡片组件
const StatCard = ({ title, value, change, color }: { title: string; value: string; change: string; color: string }) => {
  const isPositive = !change.includes('-');
  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        <p className={`ml-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="总项目数" 
          value="183" 
          change="12%" 
          color="border-blue-500" 
        />
        <StatCard 
          title="已完成项目" 
          value="137" 
          change="8%" 
          color="border-green-500" 
        />
        <StatCard 
          title="进行中项目" 
          value="38" 
          change="5%" 
          color="border-yellow-500" 
        />
        <StatCard 
          title="存在风险项目" 
          value="8" 
          change="25%" 
          color="border-red-500" 
        />
      </div>
      
      {/* 项目趋势图和活动记录 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目趋势图 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">项目趋势</h2>
            <div className="h-64 w-full">
              {/* 这里可以集成图表库如 Recharts 或 Chart.js */}
              <div className="flex items-end h-full space-x-2 pt-4">
                {projectData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center space-x-1">
                      <div className="bg-blue-500 w-3 h-16" style={{ height: `${data.在建 * 2}px` }}></div>
                      <div className="bg-green-500 w-3 h-24" style={{ height: `${data.已完成 * 2}px` }}></div>
                      <div className="bg-red-500 w-3 h-10" style={{ height: `${data.延期 * 10}px` }}></div>
                    </div>
                    <div className="text-xs mt-2">{data.name}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                  <span className="text-xs">在建</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 mr-1"></div>
                  <span className="text-xs">已完成</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 mr-1"></div>
                  <span className="text-xs">延期</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 最近活动 */}
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
      
      {/* 新建项目按钮 */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
} 