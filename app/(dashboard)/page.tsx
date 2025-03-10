"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    riskProjects: 0,
    progressHealth: 0,
    qualityHealth: 0,
    costHealth: 0
  });

  // 模拟从API获取数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      setStats({
        totalProjects: 20,
        completedProjects: 8,
        inProgressProjects: 12,
        riskProjects: 2,
        progressHealth: 78,
        qualityHealth: 85,
        costHealth: 72
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">项目管理仪表盘</h1>
          <p className="mt-1 text-gray-600">项目状态概览和关键指标</p>
        </div>
        <Link 
          href="/projects/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all duration-200 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          创建新项目
        </Link>
      </div>

      {/* 快速访问区域 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">快速访问</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/projects" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">项目档案</h3>
                  <p className="text-gray-500 text-sm">查看和管理所有项目</p>
                </div>
              </div>
            </motion.div>
          </Link>
          
          <Link href="/knowledge" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition-colors duration-200">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">知识库管理</h3>
                  <p className="text-gray-500 text-sm">管理项目文档和知识</p>
                </div>
              </div>
            </motion.div>
          </Link>
          
          <Link href="/assistant" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">智能助手</h3>
                  <p className="text-gray-500 text-sm">获取AI支持和建议</p>
                </div>
              </div>
            </motion.div>
          </Link>
          
          <Link href="/expert-review" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-lg mr-4 group-hover:bg-amber-200 transition-colors duration-200">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">专家评审</h3>
                  <p className="text-gray-500 text-sm">项目专家评审和反馈</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* 项目统计 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">项目统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-800 font-medium">总项目数</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-2">{stats.totalProjects}</h3>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-800 font-medium">已完成项目</p>
                <h3 className="text-3xl font-bold text-green-900 mt-2">{stats.completedProjects}</h3>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 border border-amber-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-800 font-medium">进行中项目</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-2">{stats.inProgressProjects}</h3>
              </div>
              <div className="bg-amber-200 p-3 rounded-lg">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-6 border border-red-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-800 font-medium">风险项目</p>
                <h3 className="text-3xl font-bold text-red-900 mt-2">{stats.riskProjects}</h3>
              </div>
              <div className="bg-red-200 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 系统状态 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">系统状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">AI服务和知识库状态</h3>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700">AI服务状态</span>
              <span className="ml-auto text-green-600 font-medium">正常</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700">知识文档数量</span>
              <span className="ml-auto text-gray-800 font-medium">156</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700">问题数据库状态</span>
              <span className="ml-auto text-green-600 font-medium">正常</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 col-span-2"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">项目健康度</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">进度健康度</span>
                  <span className={`font-medium ${stats.progressHealth >= 80 ? 'text-green-600' : stats.progressHealth >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.progressHealth}分
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stats.progressHealth >= 80 ? 'bg-green-500' : stats.progressHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${stats.progressHealth}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">质量健康度</span>
                  <span className={`font-medium ${stats.qualityHealth >= 80 ? 'text-green-600' : stats.qualityHealth >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.qualityHealth}分
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stats.qualityHealth >= 80 ? 'bg-green-500' : stats.qualityHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${stats.qualityHealth}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">成本健康度</span>
                  <span className={`font-medium ${stats.costHealth >= 80 ? 'text-green-600' : stats.costHealth >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.costHealth}分
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stats.costHealth >= 80 ? 'bg-green-500' : stats.costHealth >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${stats.costHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <span className="text-sm text-gray-500">最近更新时间: 2025-03-08</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
