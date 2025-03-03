"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("仪表盘");
  
  useEffect(() => {
    // 根据路径设置页面标题
    if (pathname === "/dashboard") setPageTitle("项目分析仪表盘");
    else if (pathname === "/dashboard/reports") setPageTitle("报告管理");
    else if (pathname === "/dashboard/projects") setPageTitle("项目档案");
    else if (pathname === "/dashboard/knowledge") setPageTitle("知识库");
    else if (pathname === "/dashboard/assistant") setPageTitle("智能助手");
    else if (pathname === "/dashboard/settings") setPageTitle("系统设置");
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">PMP.AI</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link href="/dashboard" className={`flex items-center px-4 py-3 ${pathname === "/dashboard" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                项目分析
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reports" className={`flex items-center px-4 py-3 ${pathname === "/dashboard/reports" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                报告管理
              </Link>
            </li>
            <li>
              <Link href="/dashboard/projects" className={`flex items-center px-4 py-3 ${pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                项目档案
              </Link>
            </li>
            <li>
              <Link href="/dashboard/knowledge" className={`flex items-center px-4 py-3 ${pathname === "/dashboard/knowledge" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                知识库
              </Link>
            </li>
            <li>
              <Link href="/dashboard/assistant" className={`flex items-center px-4 py-3 ${pathname === "/dashboard/assistant" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                智能助手
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className={`flex items-center px-4 py-3 ${pathname === "/dashboard/settings" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                系统设置
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <h1 className="text-xl font-bold">{pageTitle}</h1>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                新建项目
              </Link>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium">用户</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 