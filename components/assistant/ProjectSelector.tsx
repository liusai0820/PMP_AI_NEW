"use client";

import React, { useState } from 'react';
import { projectList } from '@/lib/mockData';

interface Project {
  id: string;
  name: string;
  department: string;
  progress: number;
  documents: number;
}

interface ProjectSelectorProps {
  onProjectSelect: (project: Project | null) => void;
  selectedProject: Project | null;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ onProjectSelect, selectedProject }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = searchTerm
    ? projectList.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projectList;
  
  return (
    <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
      {showSidebar && (
        <>
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">项目知识库</h2>
            <p className="text-xs text-gray-600 mt-1">选择项目以获取相关背景信息</p>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <div className="p-2">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map(project => (
                <li 
                  key={project.id}
                  className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue-50' : ''}`}
                  onClick={() => onProjectSelect(selectedProject?.id === project.id ? null : project)}
                >
                  <div className="flex justify-between">
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span>{project.id}</span>
                        <span className="mx-1">•</span>
                        <span>{project.department}</span>
                      </div>
                      <div className="mt-1.5 flex justify-between items-center">
                        <div className="w-full max-w-28">
                          <div className="h-1.5 w-full bg-gray-200 rounded-full">
                            <div
                              className="h-1.5 rounded-full bg-blue-600"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-500">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showSidebar ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h7"} />
        </svg>
      </button>
    </div>
  );
};

export default ProjectSelector; 