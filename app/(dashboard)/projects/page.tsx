"use client";

import React, { useState, useEffect } from 'react';
import { projectList } from '@/lib/mockData';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  organization?: string; // 项目单位
  progress: number;
  startDate?: string | Date;
  endDate?: string | Date;
  projectManager?: string;
  client?: string;
  description?: string;
  batch?: string;
  industry?: string;
  progressStatus?: string;
  managementStatus?: string;
}

interface ApiProject {
  id: string;
  name?: string;
  organization?: string;
  progress?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  projectManager?: string;
  client?: string;
  description?: string;
  batch?: string;
  industry?: string;
  progressStatus?: string;
  managementStatus?: string;
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Project>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // 获取项目数据
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 从API获取项目数据
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('获取项目列表失败');
        }
        
        const data = await response.json();
        console.log('获取到的项目数据:', data);
        
        // 如果API返回的数据为空，使用模拟数据
        if (!data || data.length === 0) {
          console.log('API返回的数据为空，使用模拟数据');
          setProjects(projectList);
        } else {
          // 确保数据格式正确
          const formattedProjects = data.map((project: ApiProject) => ({
            id: project.id,
            name: project.name || '未命名项目',
            organization: project.organization || '未设置',
            progress: project.progress || 0,
            startDate: project.startDate,
            endDate: project.endDate,
            projectManager: project.projectManager,
            client: project.client,
            description: project.description,
            batch: project.batch,
            industry: project.industry,
            progressStatus: project.progressStatus,
            managementStatus: project.managementStatus
          }));
          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error('获取项目列表失败:', err);
        
        // 如果API调用失败，使用模拟数据
        setProjects(projectList);
      }
    };
    
    fetchProjects();
  }, []);
  
  // 格式化日期
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '未设置';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };
  
  // 过滤项目
  const filteredProjects = searchTerm
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.organization && project.organization.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : projects;
  
  // 排序项目
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (fieldA === undefined && fieldB === undefined) return 0;
    if (fieldA === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (fieldB === undefined) return sortDirection === 'asc' ? -1 : 1;
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // 处理排序
  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // 获取排序图标
  const getSortIcon = (field: keyof Project) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">项目档案</h1>
            <p className="mt-2 text-gray-600">管理和查看所有项目信息</p>
          </div>
          <Link href="/projects/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            新建项目
          </Link>
        </div>
      </header>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="w-full sm:w-64 mb-4 sm:mb-0">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索项目..."
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
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                筛选
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                导出
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  序号
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    项目名称
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('organization')}
                >
                  <div className="flex items-center">
                    项目单位
                    {getSortIcon('organization')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center">
                    进度
                    {getSortIcon('progress')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  项目起止时间
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProjects.map((project, index) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/projects/${project.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.organization || '未设置'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full max-w-xs">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              project.progress < 30 ? 'bg-red-500' : 
                              project.progress < 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(project.startDate)} 至 {formatDate(project.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900 mr-3">查看</Link>
                    <Link href={`/projects/${project.id}/edit`} className="text-gray-600 hover:text-gray-900">编辑</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedProjects.length === 0 && (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到项目</h3>
            <p className="mt-1 text-sm text-gray-500">请尝试调整搜索条件或创建新项目。</p>
            <div className="mt-6">
              <Link href="/projects/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                创建新项目
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 