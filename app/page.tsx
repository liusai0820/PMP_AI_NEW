"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">PMP.AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600">功能</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">关于我们</a>
              <Link href="/dashboard">
                <button className="btn btn-primary">进入仪表盘</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              智能项目管理平台
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              结合人工智能技术，提供全方位的项目管理解决方案，让您的团队更高效、更智能地完成项目。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="px-6 py-3 rounded-md bg-blue-600 text-white text-center hover:bg-blue-700">
                进入仪表盘
              </Link>
              <Link href="/dashboard/assistant" className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 text-center hover:bg-blue-50">
                咨询智能助手
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-white w-[500px] h-[350px] p-4">
              {/* 仪表盘预览 SVG */}
              <div className="w-full h-full flex flex-col">
                {/* 顶部导航 */}
                <div className="h-10 bg-blue-600 rounded-t-md flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <div className="flex-1"></div>
                  <div className="text-white text-xs font-medium">PMP.AI 仪表盘</div>
                </div>
                
                {/* 内容区域 */}
                <div className="flex-1 bg-white p-4 flex">
                  {/* 侧边栏 */}
                  <div className="w-16 bg-gray-800 rounded-md mr-4 flex flex-col items-center py-4 space-y-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* 主内容 */}
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* 标题 */}
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    {/* 统计卡片 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-md p-3 h-20">
                        <div className="h-3 bg-blue-200 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-blue-300 rounded w-10"></div>
                      </div>
                      <div className="bg-green-50 rounded-md p-3 h-20">
                        <div className="h-3 bg-green-200 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-green-300 rounded w-10"></div>
                      </div>
                      <div className="bg-purple-50 rounded-md p-3 h-20">
                        <div className="h-3 bg-purple-200 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-purple-300 rounded w-10"></div>
                      </div>
                    </div>
                    
                    {/* 图表 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-md p-3 h-32">
                        <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                        <div className="flex items-end h-16 space-x-2 pt-4">
                          <div className="bg-blue-400 w-6 h-8 rounded-t"></div>
                          <div className="bg-blue-500 w-6 h-12 rounded-t"></div>
                          <div className="bg-blue-600 w-6 h-10 rounded-t"></div>
                          <div className="bg-blue-400 w-6 h-14 rounded-t"></div>
                          <div className="bg-blue-500 w-6 h-16 rounded-t"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3 h-32">
                        <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                        <div className="flex justify-center items-center h-16 pt-4">
                          <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-r-transparent"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 表格 */}
                    <div className="bg-gray-50 rounded-md p-3 h-24">
                      <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能区域 */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心功能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">项目管理</h3>
              <p className="text-gray-600">全面的项目管理功能，包括任务分配、进度跟踪、资源管理等，让项目管理更加高效。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">数据分析</h3>
              <p className="text-gray-600">强大的数据分析工具，帮助您洞察项目趋势，做出更明智的决策。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">智能助手</h3>
              <p className="text-gray-600">AI驱动的智能助手，为您提供项目管理建议，解答问题，提高工作效率。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 关于我们 */}
      <div id="about" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">关于我们</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-6">
              PMP.AI 是一家专注于项目管理智能化的科技公司，我们致力于将人工智能技术应用于项目管理领域，
              为企业提供更高效、更智能的项目管理解决方案。
            </p>
            <p className="text-gray-600 text-lg">
              我们的团队由项目管理专家和AI技术专家组成，拥有丰富的行业经验和技术积累，
              能够为不同规模的企业提供定制化的项目管理服务。
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PMP.AI</h3>
              <p className="text-gray-400">智能项目管理平台</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <p className="text-gray-400">邮箱: contact@pmp.ai</p>
              <p className="text-gray-400">电话: 400-123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">关注我们</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© 2023 PMP.AI. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
