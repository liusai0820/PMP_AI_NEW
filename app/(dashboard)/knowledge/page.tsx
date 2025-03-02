"use client";

import React, { useState } from 'react';

// 模拟知识库数据
const knowledgeCategories = [
  { id: 1, name: '项目管理基础', count: 24 },
  { id: 2, name: '风险管理', count: 18 },
  { id: 3, name: '质量管理', count: 15 },
  { id: 4, name: '进度管理', count: 12 },
  { id: 5, name: '成本管理', count: 10 },
  { id: 6, name: '沟通管理', count: 8 },
  { id: 7, name: '采购管理', count: 6 },
  { id: 8, name: '人力资源管理', count: 5 },
];

const knowledgeArticles = [
  { 
    id: 1, 
    title: '项目范围管理的最佳实践', 
    category: '项目管理基础', 
    author: '张明', 
    date: '2023-05-15',
    views: 1245,
    summary: '本文介绍了项目范围管理的关键步骤和最佳实践，包括如何定义项目范围、创建工作分解结构(WBS)、验证和控制范围等内容。'
  },
  { 
    id: 2, 
    title: '如何有效识别和应对项目风险', 
    category: '风险管理', 
    author: '李华', 
    date: '2023-06-22',
    views: 986,
    summary: '风险管理是项目成功的关键因素之一。本文详细介绍了风险识别、分析、应对和监控的完整流程，并提供了实用的风险登记表模板。'
  },
  { 
    id: 3, 
    title: '项目质量保证与控制技术', 
    category: '质量管理', 
    author: '王强', 
    date: '2023-04-10',
    views: 754,
    summary: '本文探讨了项目质量管理的核心概念，包括质量规划、质量保证和质量控制。文章还介绍了几种常用的质量管理工具，如因果图、控制图和帕累托分析等。'
  },
  { 
    id: 4, 
    title: '敏捷项目管理方法论概述', 
    category: '项目管理基础', 
    author: '赵燕', 
    date: '2023-07-05',
    views: 1102,
    summary: '本文介绍了敏捷项目管理的基本原则和实践，包括Scrum、看板和极限编程等方法论。文章还对比了传统瀑布式方法与敏捷方法的异同。'
  },
  { 
    id: 5, 
    title: '项目成本估算与预算编制指南', 
    category: '成本管理', 
    author: '陈明', 
    date: '2023-03-18',
    views: 876,
    summary: '准确的成本估算是项目成功的基础。本文详细介绍了自下而上估算、类比估算和参数估算等技术，以及如何编制和管理项目预算。'
  },
];

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // 过滤文章
  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      article.category === knowledgeCategories.find(c => c.id === selectedCategory)?.name;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
            <p className="mt-2 text-gray-600">项目管理专业知识与最佳实践</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            添加文章
          </button>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧分类 */}
        <div className="lg:w-1/4">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">知识分类</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory === null ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    全部分类
                    <span className="ml-2 text-sm text-gray-500">
                      ({knowledgeArticles.length})
                    </span>
                  </button>
                </li>
                {knowledgeCategories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                      <span className="ml-2 text-sm text-gray-500">
                        ({category.count})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 右侧内容 */}
        <div className="lg:w-3/4">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索知识库..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {article.category}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{article.author}</span>
                          <span className="mx-2">•</span>
                          <span>{article.date}</span>
                          <span className="mx-2">•</span>
                          <span>{article.views} 次阅读</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          查看
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          编辑
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      {article.summary}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">未找到文章</h3>
                  <p className="mt-1 text-sm text-gray-500">尝试使用其他搜索条件或选择不同的分类。</p>
                </div>
              )}
            </div>
            
            {filteredArticles.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    上一页
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredArticles.length}</span> 条，共 <span className="font-medium">{filteredArticles.length}</span> 条结果
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">上一页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">下一页</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 