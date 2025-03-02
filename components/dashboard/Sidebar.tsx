"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900 text-white flex flex-col h-screen`}>
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>PMP.AI</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-gray-700"
        >
          {sidebarOpen ? '«' : '»'}
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        <Link href="/dashboard" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard') ? 'bg-blue-700' : 'hover:bg-gray-700'} text-white cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>仪表盘</span>
        </Link>
        
        <Link href="/dashboard/reports" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard/reports') ? 'bg-blue-700' : 'hover:bg-gray-700'} cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>报告管理</span>
        </Link>
        
        <Link href="/dashboard/projects" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard/projects') ? 'bg-blue-700' : 'hover:bg-gray-700'} cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>项目档案</span>
        </Link>
        
        <Link href="/dashboard/knowledge" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard/knowledge') ? 'bg-blue-700' : 'hover:bg-gray-700'} cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>知识库</span>
        </Link>
        
        <Link href="/dashboard/assistant" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard/assistant') ? 'bg-blue-700' : 'hover:bg-gray-700'} cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>智能助手</span>
        </Link>
        
        <Link href="/dashboard/settings" 
          className={`px-4 py-3 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} ${isActive('/dashboard/settings') ? 'bg-blue-700' : 'hover:bg-gray-700'} cursor-pointer`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
          <span className={`ml-4 ${!sidebarOpen && 'hidden'}`}>系统设置</span>
        </Link>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-medium">管</span>
          </div>
          <div className={`ml-4 ${!sidebarOpen && 'hidden'}`}>
            <p className="text-sm font-medium">管理员</p>
            <p className="text-xs text-gray-400">admin@pmp.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 