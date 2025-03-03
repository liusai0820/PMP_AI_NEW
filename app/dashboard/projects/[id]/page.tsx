"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 项目基本信息接口
interface ProjectInfo {
  name: string;                 // 项目名称
  code: string;                 // 项目编号/合同编号
  mainDepartment: string;       // 项目主管部门（甲方）
  executeDepartment: string;    // 项目承担单位（乙方）
  manager: string;              // 项目核心负责人
  startDate: string;           // 开始日期
  endDate: string;             // 结束日期
  totalBudget: string;         // 总预算
  supportBudget: string;       // 资助金额
  selfBudget: string;          // 自筹金额
  description: string;         // 项目描述
  type: string;                // 项目类型
}

// 项目里程碑接口
interface ProjectMilestone {
  phase: string;               // 阶段（第一阶段/第二阶段/第三阶段）
  startDate: string;          // 阶段开始时间
  endDate: string;            // 阶段结束时间
  mainTasks: string[];        // 主要研究内容
  deliverables: string[];     // 考核指标/交付物
}

// 项目预算接口
interface ProjectBudget {
  category: string;           // 预算类别
  subCategory: string;        // 子类别
  amount: number;            // 金额
  source: 'support' | 'self'; // 资金来源（资助/自筹）
  description: string;       // 说明
}

// 项目团队成员接口
interface TeamMember {
  name: string;              // 姓名
  title: string;             // 职称
  role: string;              // 项目角色
  workload: string;          // 工作量（月/年）
  unit: string;              // 所属单位
}

// 完整的项目数据接口
interface CompleteProjectData {
  basicInfo: ProjectInfo;
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
  id?: string;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<CompleteProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'budget' | 'team'>('overview');
  
  // 添加引用以便滚动到特定部分
  const overviewRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  // 处理滚动到特定部分
  const scrollToSection = (section: 'overview' | 'milestones' | 'budget' | 'team') => {
    setActiveTab(section);
    
    // 根据选择的选项卡滚动到相应部分
    switch(section) {
      case 'overview':
        overviewRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'milestones':
        milestonesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'budget':
        budgetRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'team':
        teamRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  // 监听滚动事件，更新活动选项卡
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // 添加一些偏移量以提高准确性
      
      // 获取各部分的位置
      const milestonesPosition = milestonesRef.current?.offsetTop || 0;
      const budgetPosition = budgetRef.current?.offsetTop || 0;
      const teamPosition = teamRef.current?.offsetTop || 0;
      
      // 根据滚动位置更新活动选项卡
      if (teamPosition <= scrollPosition) {
        setActiveTab('team');
      } else if (budgetPosition <= scrollPosition) {
        setActiveTab('budget');
      } else if (milestonesPosition <= scrollPosition) {
        setActiveTab('milestones');
      } else {
        setActiveTab('overview');
      }
    };
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 从API获取项目数据
        const response = await fetch(`/api/projects?id=${params.id}`);
        
        if (!response.ok) {
          throw new Error(`获取项目数据失败: ${response.status}`);
        }
        
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('获取项目数据出错:', err);
        setError(err instanceof Error ? err.message : '获取项目数据时出现未知错误');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">加载项目数据时出错</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/projects')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                返回项目列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">未找到项目</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>找不到ID为 {params.id} 的项目信息。</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/projects')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                返回项目列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.basicInfo.name}</h1>
          <p className="text-sm text-gray-500">项目编号: {project.basicInfo.code}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/projects/${params.id}/edit`}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            编辑项目
          </Link>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回列表
          </Link>
        </div>
      </div>

      {/* 标签页导航 - 固定在顶部 */}
      <div className="border-b border-gray-200 mb-4 sticky top-0 bg-white z-10 py-1">
        <nav className="-mb-px flex space-x-6">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => scrollToSection('overview')}
          >
            项目概览
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'milestones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => scrollToSection('milestones')}
          >
            里程碑
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'budget'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => scrollToSection('budget')}
          >
            预算
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => scrollToSection('team')}
          >
            团队
          </button>
        </nav>
      </div>

      {/* 内容区域 - 所有内容都显示，不再使用条件渲染 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden space-y-8">
        {/* 项目概览部分 */}
        <div ref={overviewRef} id="overview" className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目名称</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目编号</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目主管部门</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.mainDepartment}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目承担单位</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.executeDepartment}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目负责人</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.manager}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">项目类型</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.type || '未分类'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">开始日期</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.startDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">结束日期</h3>
              <p className="mt-1 text-sm text-gray-900">{project.basicInfo.endDate}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">项目预算</h3>
              <div className="mt-1 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-500">总预算</span>
                  <p className="text-sm font-medium text-gray-900">{project.basicInfo.totalBudget}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">资助金额</span>
                  <p className="text-sm font-medium text-gray-900">{project.basicInfo.supportBudget}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">自筹金额</span>
                  <p className="text-sm font-medium text-gray-900">{project.basicInfo.selfBudget}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">项目描述</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{project.basicInfo.description}</p>
            </div>
          </div>
        </div>

        {/* 里程碑部分 */}
        <div ref={milestonesRef} id="milestones" className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">项目里程碑</h2>
          </div>
          
          {project.milestones.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无里程碑</h3>
              <p className="mt-1 text-sm text-gray-500">该项目尚未设置里程碑。</p>
            </div>
          ) : (
            <div className="space-y-6">
              {project.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-md font-medium text-gray-900">{milestone.phase}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {milestone.startDate} - {milestone.endDate}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">主要任务</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                        {milestone.mainTasks.map((task, taskIndex) => (
                          <li key={taskIndex}>{task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">交付物</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                        {milestone.deliverables.map((deliverable, deliverableIndex) => (
                          <li key={deliverableIndex}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 预算部分 */}
        <div ref={budgetRef} id="budget" className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">项目预算</h2>
          </div>
          
          {project.budgets.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无预算信息</h3>
              <p className="mt-1 text-sm text-gray-500">该项目尚未设置详细预算。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预算类别</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">子类别</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资金来源</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {project.budgets.map((budget, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{budget.category}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{budget.subCategory}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{budget.amount.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          budget.source === 'support' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {budget.source === 'support' ? '资助' : '自筹'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">{budget.description}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-sm font-medium text-gray-900">总计</td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">
                      {project.budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* 团队部分 */}
        <div ref={teamRef} id="team" className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">项目团队</h2>
          </div>
          
          {project.team.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无团队成员</h3>
              <p className="mt-1 text-sm text-gray-500">该项目尚未添加团队成员。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.team.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 font-medium">{member.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.title}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">项目角色</span>
                        <p className="font-medium text-gray-900">{member.role}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">工作量</span>
                        <p className="font-medium text-gray-900">{member.workload}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">所属单位</span>
                        <p className="font-medium text-gray-900">{member.unit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 