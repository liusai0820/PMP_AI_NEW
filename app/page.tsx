"use client";

import React from 'react';
import Link from 'next/link';
import FloatingAssistant from '@/components/FloatingAssistant';

export default function Home() {
  // 检查环境变量
  const envCheck = {
    MISTRAL_API_KEY_EXISTS: !!process.env.MISTRAL_API_KEY,
    MISTRAL_API_KEY_LENGTH: process.env.MISTRAL_API_KEY?.length,
    ENV_KEYS: Object.keys(process.env).filter(key => key.includes('API_KEY'))
  };
  
  console.log('主页环境变量检查：', envCheck);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 relative">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Link
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/"
          >
            PMP.AI
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6">智能项目管理平台</h1>
          <p className="text-lg mb-8">
            结合人工智能技术，提供全方位的项目管理解决方案，让您的团队更高效、更智能地完成项目。
          </p>
          
          <div className="flex gap-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              进入仪表盘
            </Link>
            <Link 
              href="/assistant" 
              className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium"
            >
              咨询智能助手
            </Link>
          </div>
        </div>
        
        <div className="flex-1 mt-8 md:mt-0">
          {/* 使用效果图替代真实数据 */}
          <div className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2">PMP.AI 仪表盘</span>
            </div>
            
            <div className="bg-gray-100 p-4">
              <div className="flex flex-wrap -mx-2">
                {/* 项目统计卡片 */}
                <div className="w-1/2 px-2 mb-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">总项目数</div>
                        <div className="text-2xl font-bold">183</div>
                      </div>
                      <div className="text-green-500 text-xs">↑ 12%</div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 px-2 mb-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">已完成项目</div>
                        <div className="text-2xl font-bold">137</div>
                      </div>
                      <div className="text-green-500 text-xs">↑ 8%</div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 px-2 mb-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">进行中项目</div>
                        <div className="text-2xl font-bold">38</div>
                      </div>
                      <div className="text-red-500 text-xs">↓ 5%</div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 px-2 mb-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">风险项目</div>
                        <div className="text-2xl font-bold">8</div>
                      </div>
                      <div className="text-green-500 text-xs">↑ 25%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 项目健康度 */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">项目健康度</h3>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-1/3 px-2">
                    <div className="bg-white p-3 rounded-md shadow text-center">
                      <div className="text-sm text-gray-500">进度健康度</div>
                      <div className="text-xl font-bold text-yellow-500">78分</div>
                    </div>
                  </div>
                  <div className="w-1/3 px-2">
                    <div className="bg-white p-3 rounded-md shadow text-center">
                      <div className="text-sm text-gray-500">质量健康度</div>
                      <div className="text-xl font-bold text-green-500">85分</div>
                    </div>
                  </div>
                  <div className="w-1/3 px-2">
                    <div className="bg-white p-3 rounded-md shadow text-center">
                      <div className="text-sm text-gray-500">成本健康度</div>
                      <div className="text-xl font-bold text-yellow-500">72分</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">项目管理</h2>
          <p className="text-gray-600">全面的项目管理功能，包括任务分配、进度跟踪、资源管理等，让项目管理更加高效。</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">数据分析</h2>
          <p className="text-gray-600">强大的数据分析工具，帮助您洞察项目趋势，做出更明智的决策。</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">智能助手</h2>
          <p className="text-gray-600">AI驱动的智能助手，为您提供项目管理建议，解答问题，提高工作效率。</p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">关于我们</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          我们致力于为企业提供最先进的项目管理解决方案，通过人工智能技术提升项目管理效率和成功率。
        </p>
      </div>
      
      {/* 浮动助手 */}
      <FloatingAssistant />
    </main>
  );
}
