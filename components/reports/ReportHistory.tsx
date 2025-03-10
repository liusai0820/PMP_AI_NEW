"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Report {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  status: 'analyzing' | 'completed' | 'error';
  model?: string;
  tags?: string[];
}

interface ReportHistoryProps {
  onViewReport?: (reportId: string) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ onViewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // 模拟报告数据
  const mockReports: Report[] = [
    {
      id: '1',
      fileName: '项目进度报告-2023Q3.pdf',
      uploadDate: '2023-10-15',
      fileSize: 1250000,
      status: 'completed',
      model: 'anthropic/claude-3-sonnet',
      tags: ['季度报告', '进度']
    },
    {
      id: '2',
      fileName: '项目风险评估.docx',
      uploadDate: '2023-10-10',
      fileSize: 850000,
      status: 'completed',
      model: 'openai/gpt-4-turbo',
      tags: ['风险', '评估']
    },
    {
      id: '3',
      fileName: '资源分配计划.xlsx',
      uploadDate: '2023-10-05',
      fileSize: 650000,
      status: 'completed',
      model: 'anthropic/claude-3-haiku',
      tags: ['资源', '计划']
    },
    {
      id: '4',
      fileName: '项目进度报告-2023Q2.pdf',
      uploadDate: '2023-07-15',
      fileSize: 1150000,
      status: 'completed',
      model: 'anthropic/claude-3-sonnet',
      tags: ['季度报告', '进度']
    },
    {
      id: '5',
      fileName: '团队绩效分析.pdf',
      uploadDate: '2023-09-20',
      fileSize: 980000,
      status: 'completed',
      model: 'openai/gpt-4o',
      tags: ['团队', '绩效']
    },
    {
      id: '6',
      fileName: '预算执行情况.xlsx',
      uploadDate: '2023-08-30',
      fileSize: 720000,
      status: 'completed',
      model: 'google/gemini-pro',
      tags: ['预算', '财务']
    },
    {
      id: '7',
      fileName: '客户反馈汇总.docx',
      uploadDate: '2023-09-05',
      fileSize: 540000,
      status: 'analyzing',
      tags: ['客户', '反馈']
    },
    {
      id: '8',
      fileName: '技术架构评审.pdf',
      uploadDate: '2023-08-15',
      fileSize: 1350000,
      status: 'error',
      tags: ['技术', '架构']
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // 在实际应用中，这里会从API获取报告列表
        // 这里使用模拟数据
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setReports(mockReports);
        setFilteredReports(mockReports);
        setError(null);
      } catch (err) {
        console.error('获取报告列表失败:', err);
        setError('获取报告列表失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [mockReports]);

  // 过滤和排序报告
  useEffect(() => {
    let result = [...reports];
    
    // 应用搜索过滤
    if (searchTerm) {
      result = result.filter(report => 
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 应用状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(report => report.status === statusFilter);
    }
    
    // 应用排序
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.fileName.localeCompare(b.fileName)
          : b.fileName.localeCompare(a.fileName);
      } else { // size
        return sortOrder === 'asc'
          ? a.fileSize - b.fileSize
          : b.fileSize - a.fileSize;
      }
    });
    
    setFilteredReports(result);
    setCurrentPage(1); // 重置到第一页
  }, [reports, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('确定要删除这份报告吗？此操作无法撤销。')) {
      return;
    }
    
    try {
      // 在实际应用中，这里会调用API删除报告
      // 这里只是更新本地状态
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));
    } catch (err) {
      console.error('删除报告失败:', err);
      alert('删除报告失败，请重试');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 计算分页
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // 分页导航
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 切换排序字段
  const handleSortChange = (field: 'date' | 'name' | 'size') => {
    if (sortBy === field) {
      toggleSortOrder();
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          重试
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">没有报告</h3>
        <p className="mt-1 text-sm text-gray-500">开始上传您的第一份报告</p>
        <div className="mt-6">
          <Link href="/dashboard/reports" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            上传报告
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="搜索报告名称或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">所有状态</option>
            <option value="analyzing">分析中</option>
            <option value="completed">已完成</option>
            <option value="error">失败</option>
          </select>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => handleSortChange('date')}
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                sortBy === 'date' ? 'text-blue-600 z-10' : 'text-gray-700'
              } hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            >
              日期
              {sortBy === 'date' && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSortChange('name')}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                sortBy === 'name' ? 'text-blue-600 z-10' : 'text-gray-700'
              } hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            >
              名称
              {sortBy === 'name' && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSortChange('size')}
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                sortBy === 'size' ? 'text-blue-600 z-10' : 'text-gray-700'
              } hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            >
              大小
              {sortBy === 'size' && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <li className="px-4 py-6 text-center text-gray-500">
              没有找到匹配的报告
            </li>
          ) : (
            currentItems.map((report) => (
              <li key={report.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {report.fileName.endsWith('.pdf') ? (
                          <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        ) : report.fileName.endsWith('.docx') ? (
                          <svg className="h-10 w-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-10 w-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => onViewReport && onViewReport(report.id)}>
                          {report.fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          上传于 {report.uploadDate} · {formatFileSize(report.fileSize)}
                          {report.model && <span className="ml-2">· 模型: {report.model.split('/')[1]}</span>}
                        </div>
                        {report.tags && report.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {report.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                onClick={() => setSearchTerm(tag)}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'analyzing' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          分析中
                        </span>
                      ) : report.status === 'completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已完成
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          分析失败
                        </span>
                      )}
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          onClick={() => onViewReport && onViewReport(report.id)}
                          className="mr-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md shadow">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              上一页
            </button>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{indexOfFirstItem + 1}</span> 到 
                <span className="font-medium"> {Math.min(indexOfLastItem, filteredReports.length)}</span> 条，
                共 <span className="font-medium">{filteredReports.length}</span> 条结果
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                    currentPage === 1 
                      ? 'text-gray-300' 
                      : 'text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  <span className="sr-only">上一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === number
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                    currentPage === totalPages 
                      ? 'text-gray-300' 
                      : 'text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  <span className="sr-only">下一页</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistory; 