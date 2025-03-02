"use client";

import React from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'bg-blue-100 text-blue-800';
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '延期':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">最近项目</h3>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                项目名称
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                进度
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                截止日期
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          project.status === '已完成' ? 'bg-green-500' : 
                          project.status === '延期' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.dueDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  暂无项目数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200">
        <a href="/dashboard/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          查看全部项目 &rarr;
        </a>
      </div>
    </div>
  );
};

export default RecentProjects; 