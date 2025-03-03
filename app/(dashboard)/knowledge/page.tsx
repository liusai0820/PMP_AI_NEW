"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import DocumentUploader from '@/components/knowledge/DocumentUploader';
import KnowledgeDetail from '@/components/knowledge/KnowledgeDetail';

// 知识分类选项
const KNOWLEDGE_CATEGORIES = [
  { id: 1, name: '项目管理基础', count: 24 },
  { id: 2, name: '风险管理', count: 18 },
  { id: 3, name: '质量管理', count: 15 },
  { id: 4, name: '进度管理', count: 12 },
  { id: 5, name: '成本管理', count: 10 },
  { id: 6, name: '沟通管理', count: 8 },
  { id: 7, name: '采购管理', count: 6 },
  { id: 8, name: '人力资源管理', count: 5 },
];

// 模拟知识库数据
const MOCK_ARTICLES = [
  { 
    id: 1, 
    title: '项目范围管理的最佳实践', 
    content: '项目范围管理是项目管理中最重要的领域之一...',
    category: '项目管理基础', 
    tags: ['范围管理', 'WBS', '需求分析'],
    author: '张明', 
    date: '2023-05-15',
    views: 1245,
    summary: '本文介绍了项目范围管理的关键步骤和最佳实践，包括如何定义项目范围、创建工作分解结构(WBS)、验证和控制范围等内容。',
    fileType: 'pdf',
    fileSize: 2.5 * 1024 * 1024,
  },
  { 
    id: 2, 
    title: '如何有效识别和应对项目风险', 
    content: '风险管理是项目成功的关键因素之一...',
    category: '风险管理', 
    tags: ['风险识别', '风险评估', '风险应对'],
    author: '李华', 
    date: '2023-06-22',
    views: 986,
    summary: '风险管理是项目成功的关键因素之一。本文详细介绍了风险识别、分析、应对和监控的完整流程，并提供了实用的风险登记表模板。',
    fileType: 'docx',
    fileSize: 1.8 * 1024 * 1024,
  },
  // ... 其他文章数据
];

interface SearchFilters {
  category: string;
  dateRange: string;
  author: string;
  tags: string[];
}

interface UploadedDocument {
  files: File[];
  metadata: {
    title: string;
    description: string;
    category: string;
    tags: string;
  };
  uploadedAt: string;
}

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof MOCK_ARTICLES[0] | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: '',
    dateRange: '',
    author: '',
    tags: [],
  });
  
  // 过滤文章
  const filteredArticles = MOCK_ARTICLES.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesAuthor = !searchFilters.author || article.author.includes(searchFilters.author);
    const matchesTags = searchFilters.tags.length === 0 || 
      searchFilters.tags.every(tag => article.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesAuthor && matchesTags;
  });
  
  // 处理文档上传完成
  const handleUploadComplete = (documentData: UploadedDocument) => {
    console.log('文档上传完成:', documentData);
    setShowUploader(false);
    // TODO: 调用API保存文档
  };
  
  // 处理文章删除
  const handleDeleteArticle = (id: number) => {
    console.log('删除文章:', id);
    // TODO: 调用API删除文章
    setSelectedArticle(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
            <p className="mt-2 text-gray-600">项目管理专业知识与最佳实践</p>
          </div>
          <Button
            onClick={() => setShowUploader(true)}
          >
            上传文档
          </Button>
        </div>
      </header>
      
      <div className="flex gap-6">
        {/* 左侧分类导航 */}
        <div className="w-64 flex-shrink-0">
          <Card className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">知识分类</h2>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${
                  !selectedCategory ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory('')}
              >
                全部分类
                <span className="ml-2 text-sm text-gray-500">
                  ({MOCK_ARTICLES.length})
                </span>
              </button>
              {KNOWLEDGE_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                  <span className="ml-2 text-sm text-gray-500">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* 中间文章列表 */}
        <div className="flex-1">
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="搜索知识库..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  高级搜索
                  <svg className={`ml-2 h-4 w-4 transform ${showAdvancedSearch ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
              
              {/* 高级搜索面板 */}
              {showAdvancedSearch && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      作者
                    </label>
                    <Input
                      type="text"
                      placeholder="搜索作者..."
                      value={searchFilters.author}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日期范围
                    </label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={searchFilters.dateRange}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    >
                      <option value="">全部时间</option>
                      <option value="today">今天</option>
                      <option value="week">本周</option>
                      <option value="month">本月</option>
                      <option value="year">今年</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      标签
                    </label>
                    <Input
                      type="text"
                      placeholder="输入标签，按回车添加..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          e.preventDefault();
                          setSearchFilters(prev => ({
                            ...prev,
                            tags: [...prev.tags, e.currentTarget.value]
                          }));
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    {searchFilters.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {searchFilters.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-1 text-blue-600 hover:text-blue-800"
                              onClick={() => setSearchFilters(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }))}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
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
                        <div className="mt-2 flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
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
          </Card>
        </div>
        
        {/* 右侧详情预览 */}
        <div className="w-96 flex-shrink-0">
          {selectedArticle ? (
            <div className="sticky top-6">
              <KnowledgeDetail
                item={selectedArticle}
                relatedItems={[
                  {
                    id: 3,
                    title: '项目质量保证与控制技术',
                    category: '质量管理',
                    similarity: 0.85
                  },
                  {
                    id: 4,
                    title: '敏捷项目管理方法论概述',
                    category: '项目管理基础',
                    similarity: 0.72
                  }
                ]}
                onEdit={(id) => console.log('编辑文章:', id)}
                onDelete={handleDeleteArticle}
                onBack={() => setSelectedArticle(null)}
              />
            </div>
          ) : (
            <Card className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">选择文章查看详情</h3>
              <p className="mt-1 text-sm text-gray-500">
                点击左侧文章列表中的任意文章以查看详细内容
              </p>
            </Card>
          )}
        </div>
      </div>
      
      {/* 上传文档模态框 */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <DocumentUploader
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 