"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ReportHistory from '@/components/reports/ReportHistory';

export default function ReportHistoryPage() {
  const router = useRouter();
  
  const handleViewReport = (reportId: string) => {
    // 跳转到报告详情页面
    router.push(`/dashboard/reports/view/${reportId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">报告历史</h1>
        <p className="mt-2 text-gray-600">查看和管理您上传的所有项目报告</p>
      </header>
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => router.push('/dashboard/reports')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          上传新报告
        </button>
      </div>
      
      <ReportHistory onViewReport={handleViewReport} />
    </div>
  );
} 