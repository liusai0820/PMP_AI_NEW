"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { projectsWithProgress } from '@/lib/realData';

// 定义项目和里程碑类型
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

interface Project {
  id: string;
  basicInfo: {
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
  };
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
  progress: number;
}

// 修复类型定义中的any
interface LegacyProject {
  id: string;
  name: string;
  batch?: string;
  client?: string;
  organization?: string;
  industry?: string;
  startDate?: string;
  endDate?: string;
  progressStatus?: string;
  managementStatus?: string;
  projectManager?: string;
  projectLeader?: string;
  governmentFunding?: number;
  selfFunding?: number;
  description?: string;
  progress?: number;
  milestones?: Array<{
    name: string;
    startDate: string;
    endDate: string;
    evaluationDate?: string;
    actualEvaluationDate?: string;
  }>;
}

interface ApiMilestone {
  id?: string;
  name?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: string;
  projectId?: string;
}

// 修复里程碑状态组件
const MilestoneStatus = ({ milestone }: { milestone: ProjectMilestone }) => {
  const today = new Date();
  const endDate = new Date(milestone.endDate || new Date().toISOString());
  const isCompleted = endDate < today;
  const statusColor = isCompleted ? 'bg-green-500' : 'bg-gray-300';
  
  // 确保mainTasks和deliverables字段存在，如果不存在则提供默认空数组
  const mainTasks = milestone.mainTasks || [];
  const deliverables = milestone.deliverables || [];
  
  // 格式化日期，只保留年月日
  const formatDate = (dateString: string) => {
    if (!dateString) return '未设置';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // 只保留YYYY-MM-DD部分
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className="flex items-center mb-4">
      <div className={`w-4 h-4 rounded-full ${statusColor} mr-2`}></div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">{milestone.phase || '未命名阶段'}</h4>
          <span className="text-xs text-gray-500">
            {isCompleted ? '已完成' : '进行中'}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>计划: {formatDate(milestone.startDate)} 至 {formatDate(milestone.endDate)}</span>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-700">
            <span className="font-medium">主要任务:</span> {mainTasks.length > 0 ? mainTasks.join(', ') : '未指定'}
          </p>
          <p className="text-xs text-gray-700">
            <span className="font-medium">交付物:</span> {deliverables.length > 0 ? deliverables.join(', ') : '未指定'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'milestones', 'budgets', 'team'
  
  useEffect(() => {
    // 获取项目详情
    const fetchProject = async () => {
      try {
        setLoading(true);
        
        // 从API获取项目数据
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Project not found:', projectId);
            setProject(null);
            return;
          }
          throw new Error(`获取项目详情失败: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Found project:', data);
        
        // 将API返回的数据转换为页面需要的格式
        const convertedProject: Project = {
          id: data.id,
          basicInfo: {
            name: data.name || '未命名项目',
            code: data.projectCode || data.batch || '',
            mainDepartment: data.client || '',
            executeDepartment: data.organization || '',
            manager: data.projectManager || '',
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
            totalBudget: ((data.governmentFunding || 0) + (data.selfFunding || 0)).toString(),
            supportBudget: (data.governmentFunding || 0).toString(),
            selfBudget: (data.selfFunding || 0).toString(),
            description: data.description || '',
            type: data.industry || '',
          },
          milestones: data.milestones ? data.milestones.map((m: ApiMilestone) => ({
            phase: m.name || '',
            startDate: m.startDate ? new Date(m.startDate as string).toISOString().split('T')[0] : '',
            endDate: m.endDate ? new Date(m.endDate as string).toISOString().split('T')[0] : '',
            mainTasks: ['未指定'], // 确保始终有一个默认值
            deliverables: ['未指定'], // 确保始终有一个默认值
          })) : [],
          budgets: [],
          team: [],
          progress: data.progress || 0,
        };
        
        setProject(convertedProject);
      } catch (err) {
        console.error("获取项目详情失败:", err);
        setProject(null);
        
        // 如果API调用失败，尝试从静态数据中获取（作为备份）
        try {
          const foundProject = projectsWithProgress.find(p => p.id === projectId) as LegacyProject;
          if (foundProject) {
            console.log('Found project in static data:', foundProject);
            // 转换为新的数据结构
            const convertedProject: Project = {
              id: foundProject.id,
              basicInfo: {
                name: foundProject.name || '未命名项目',
                code: foundProject.batch || '',
                mainDepartment: foundProject.client || '',
                executeDepartment: foundProject.organization || '',
                manager: foundProject.projectManager || '',
                startDate: foundProject.startDate || '',
                endDate: foundProject.endDate || '',
                totalBudget: ((foundProject.governmentFunding || 0) + (foundProject.selfFunding || 0)).toString(),
                supportBudget: (foundProject.governmentFunding || 0).toString(),
                selfBudget: (foundProject.selfFunding || 0).toString(),
                description: foundProject.description || '',
                type: foundProject.industry || '',
              },
              milestones: foundProject.milestones ? foundProject.milestones.map((m) => ({
                phase: m.name || '',
                startDate: m.startDate || '',
                endDate: m.endDate || '',
                mainTasks: ['未指定'], // 确保始终有一个默认值
                deliverables: ['未指定'], // 确保始终有一个默认值
              })) : [],
              budgets: [],
              team: [],
              progress: foundProject.progress || 0,
            };
            setProject(convertedProject);
          }
        } catch (fallbackError) {
          console.error("从静态数据获取项目失败:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">项目未找到</h2>
          <p className="text-gray-500 mb-4">无法找到ID为 {projectId} 的项目</p>
          <Link href="/projects" className="text-blue-600 hover:text-blue-800">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 项目标题和基本信息 */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{project?.basicInfo?.name || '未命名项目'}</h1>
          <div className="flex space-x-2">
            <Link 
              href={`/projects/${projectId}/edit`}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              编辑项目
            </Link>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">进度: {project?.progress || 0}%</span>
          <span className="mr-4">项目单位: {project?.basicInfo?.executeDepartment || '未设置'}</span>
          <span>项目编号: {project?.basicInfo?.code || '未设置'}</span>
        </div>
      </div>
      
      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('info')}
          >
            基本信息
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'milestones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('milestones')}
          >
            里程碑
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'budgets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('budgets')}
          >
            预算资金
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('team')}
          >
            项目团队
          </button>
        </nav>
      </div>
      
      {/* 标签页内容 */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* 基本信息 */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">项目基本信息</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">项目名称</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.name || '未设置'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">项目编号</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.code || '未设置'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">项目类型</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.type || '未设置'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">主管部门</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.mainDepartment || '未设置'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">承担单位</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.executeDepartment || '未设置'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">项目周期</div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {project?.basicInfo?.startDate ? project.basicInfo.startDate.split(' ')[0] : '未设置'} 至 
                    {project?.basicInfo?.endDate ? project.basicInfo.endDate.split(' ')[0] : '未设置'}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">项目负责人</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.manager || '未指定'}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">资金信息</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">总预算</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.totalBudget || '0'} 万元</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">资助金额</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.supportBudget || '0'} 万元</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-gray-500">自筹金额</div>
                  <div className="col-span-2 text-sm text-gray-900">{project?.basicInfo?.selfBudget || '0'} 万元</div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">项目描述</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{project?.basicInfo?.description || '暂无描述'}</p>
            </div>
          </div>
        )}
        
        {/* 里程碑 */}
        {activeTab === 'milestones' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">项目里程碑</h3>
            {project?.milestones && project.milestones.length > 0 ? (
              <div className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <MilestoneStatus key={index} milestone={milestone} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">暂无里程碑信息</p>
            )}
          </div>
        )}
        
        {/* 预算资金 */}
        {activeTab === 'budgets' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">预算资金</h3>
            {project?.budgets && project.budgets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">子类别</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额(万元)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资金来源</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.budgets.map((budget, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.subCategory}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.source === 'support' ? '资助' : '自筹'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.description}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总计</td>
                      <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                        {project.budgets.reduce((sum, budget) => sum + budget.amount, 0)} 万元
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">暂无预算资金信息</p>
            )}
          </div>
        )}
        
        {/* 项目团队 */}
        {activeTab === 'team' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">项目团队</h3>
            {project?.team && project.team.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职称</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目角色</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工作量</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属单位</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.team.map((member, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.workload}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">暂无团队成员信息</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 