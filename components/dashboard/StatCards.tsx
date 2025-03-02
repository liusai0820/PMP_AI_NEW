"use client";

import React from 'react';

interface StatsProps {
  stats: {
    totalProjects: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
}

const StatCards: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">总项目数</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{stats.totalProjects}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">进行中</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{stats.inProgress}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">已完成</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{stats.completed}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">延期</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{stats.delayed}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards; 