"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '@/components/reports/FileUploader';

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
}

// 在文件开头定义默认的项目数据结构
const defaultProjectData: CompleteProjectData = {
  basicInfo: {
    name: '',
    code: '',
    mainDepartment: '',
    executeDepartment: '',
    manager: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    supportBudget: '',
    selfBudget: '',
    description: '',
    type: ''
  },
  milestones: [],
  budgets: [],
  team: []
};

export default function NewProjectPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // 使用defaultProjectData初始化projectData
  const [projectData, setProjectData] = useState<CompleteProjectData>(defaultProjectData);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    setFile(file);
    setError(null);
    await analyzeFile(file);
  };

  // 上传并分析文件
  const analyzeFile = async (uploadedFile: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      // 读取文件内容
      const fileContent = await readFileContent(uploadedFile);
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // 模拟分析进度
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
      
      // 调用API分析文件内容
      const response = await fetch('/api/project-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileContent,
          fileType: uploadedFile.type
        }),
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('分析失败，请重试');
      }
      
      const result = await response.json();
      
      // 确保result.projectData存在
      if (!result.projectData) {
        throw new Error('API返回的数据格式不正确');
      }

      // 更新项目数据
      setProjectData(result.projectData);

      setAnalysisProgress(100);
      
      // 延迟一下，展示100%进度
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep('review');
      }, 500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // 读取文件内容
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('无法读取文件内容'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件时出错'));
      };
      
      if (file.type.includes('pdf')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // 保存项目信息
  const saveProject = async () => {
    try {
      setError(null);
      setIsSaving(true);
      
      // 验证必填字段
      if (!projectData.basicInfo.name || !projectData.basicInfo.code) {
        setError('项目名称和编号为必填项');
        setIsSaving(false);
        return;
      }
      
      // 调用API保存项目
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('保存项目失败');
      }
      
      const result = await response.json();
      
      setIsSaving(false);
      setStep('complete');
      
      // 延迟跳转到项目看板
      setTimeout(() => {
        router.push(`/dashboard/projects/${result.projectId}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存过程中出现错误');
      setIsSaving(false);
    }
  };

  // 处理表单字段变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [name]: value
      }
    }));
  };

  // 处理里程碑变更
  const handleMilestoneChange = (index: number, field: keyof ProjectMilestone, value: string | string[]) => {
    setProjectData(prev => {
      const newMilestones = [...prev.milestones];
      newMilestones[index] = {
        ...newMilestones[index],
        [field]: value
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  // 添加新的里程碑
  const addMilestone = () => {
    setProjectData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          phase: `第${prev.milestones.length + 1}阶段`,
          startDate: '',
          endDate: '',
          mainTasks: [],
          deliverables: []
        }
      ]
    }));
  };

  // 删除里程碑
  const removeMilestone = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  // 处理预算变更
  const handleBudgetChange = (index: number, field: keyof ProjectBudget, value: string | number) => {
    setProjectData(prev => {
      const newBudgets = [...prev.budgets];
      newBudgets[index] = {
        ...newBudgets[index],
        [field]: field === 'amount' ? Number(value) : value
      };
      return {
        ...prev,
        budgets: newBudgets
      };
    });
  };

  // 添加新的预算项
  const addBudget = () => {
    setProjectData(prev => ({
      ...prev,
      budgets: [
        ...prev.budgets,
        {
          category: '',
          subCategory: '',
          amount: 0,
          source: 'support',
          description: ''
        }
      ]
    }));
  };

  // 删除预算项
  const removeBudget = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      budgets: prev.budgets.filter((_, i) => i !== index)
    }));
  };

  // 处理团队成员变更
  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setProjectData(prev => {
      const newTeam = [...prev.team];
      newTeam[index] = {
        ...newTeam[index],
        [field]: value
      };
      return {
        ...prev,
        team: newTeam
      };
    });
  };

  // 添加新的团队成员
  const addTeamMember = () => {
    setProjectData(prev => ({
      ...prev,
      team: [
        ...prev.team,
        {
          name: '',
          title: '',
          role: '',
          workload: '',
          unit: ''
        }
      ]
    }));
  };

  // 删除团队成员
  const removeTeamMember = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  // 渲染上传步骤
  const renderUploadStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">上传项目文件</h2>
          <p className="text-gray-600 mb-6">
            上传项目合同或相关文档，系统将自动分析并提取关键信息，帮助您快速创建项目。
          </p>
          
          <FileUploader onFileUpload={handleFileUpload} />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {(isUploading || isAnalyzing) && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">
                {isUploading ? '正在上传文件...' : '正在分析文件...'}
              </h3>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full" 
                  style={{ width: isUploading ? '100%' : `${analysisProgress}%` }}
                ></div>
              </div>
              {isAnalyzing && (
                <p className="text-sm text-gray-500">
                  {analysisProgress}% 已完成
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/dashboard/projects" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </Link>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file || isUploading || isAnalyzing}
            onClick={() => analyzeFile(file!)}
          >
            {isUploading || isAnalyzing ? '处理中...' : '分析文件'}
          </button>
        </div>
      </div>
    );
  };

  // 渲染审核步骤
  const renderReviewStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">审核项目信息</h2>
            <div className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">AI已解析</span> · 请核对并修改
            </div>
          </div>
          
          {/* 基本信息表单 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={projectData.basicInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  项目编号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={projectData.basicInfo.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mainDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  项目主管部门（甲方）
                </label>
                <input
                  type="text"
                  id="mainDepartment"
                  name="mainDepartment"
                  value={projectData.basicInfo.mainDepartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="executeDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                  项目承担单位（乙方）
                </label>
                <input
                  type="text"
                  id="executeDepartment"
                  name="executeDepartment"
                  value={projectData.basicInfo.executeDepartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                  项目核心负责人
                </label>
                <input
                  type="text"
                  id="manager"
                  name="manager"
                  value={projectData.basicInfo.manager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  开始日期
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={projectData.basicInfo.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  结束日期
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={projectData.basicInfo.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  总预算
                </label>
                <input
                  type="text"
                  id="totalBudget"
                  name="totalBudget"
                  value={projectData.basicInfo.totalBudget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如：¥1,000,000"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="supportBudget" className="block text-sm font-medium text-gray-700 mb-1">
                资助金额
              </label>
              <input
                type="text"
                id="supportBudget"
                name="supportBudget"
                value={projectData.basicInfo.supportBudget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：¥1,000,000"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="selfBudget" className="block text-sm font-medium text-gray-700 mb-1">
                自筹金额
              </label>
              <input
                type="text"
                id="selfBudget"
                name="selfBudget"
                value={projectData.basicInfo.selfBudget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：¥1,000,000"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                项目描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={projectData.basicInfo.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                项目类型
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={projectData.basicInfo.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* 里程碑信息 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-medium">项目里程碑</h3>
              <button
                type="button"
                onClick={addMilestone}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + 添加里程碑
              </button>
            </div>
            
            {projectData.milestones.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                暂无里程碑信息，点击"添加里程碑"按钮添加
              </div>
            ) : (
              <div className="space-y-6">
                {projectData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-md relative">
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          阶段名称
                        </label>
                        <input
                          type="text"
                          value={milestone.phase}
                          onChange={(e) => handleMilestoneChange(index, 'phase', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          时间范围
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={milestone.startDate}
                            onChange={(e) => handleMilestoneChange(index, 'startDate', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                          <span>至</span>
                          <input
                            type="date"
                            value={milestone.endDate}
                            onChange={(e) => handleMilestoneChange(index, 'endDate', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        主要研究内容
                      </label>
                      <textarea
                        value={milestone.mainTasks.join('\n')}
                        onChange={(e) => handleMilestoneChange(index, 'mainTasks', e.target.value.split('\n'))}
                        rows={3}
                        className="w-full p-2 border rounded-md"
                        placeholder="每行一个研究内容"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        考核指标/交付物
                      </label>
                      <textarea
                        value={milestone.deliverables.join('\n')}
                        onChange={(e) => handleMilestoneChange(index, 'deliverables', e.target.value.split('\n'))}
                        rows={3}
                        className="w-full p-2 border rounded-md"
                        placeholder="每行一个交付物"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 预算信息 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-medium">项目预算</h3>
              <button
                type="button"
                onClick={addBudget}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + 添加预算项
              </button>
            </div>
            
            {projectData.budgets.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                暂无预算信息，点击"添加预算项"按钮添加
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预算类别</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">子类别</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资金来源</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectData.budgets.map((budget, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={budget.category}
                            onChange={(e) => handleBudgetChange(index, 'category', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={budget.subCategory}
                            onChange={(e) => handleBudgetChange(index, 'subCategory', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={budget.amount}
                            onChange={(e) => handleBudgetChange(index, 'amount', parseFloat(e.target.value))}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={budget.source}
                            onChange={(e) => handleBudgetChange(index, 'source', e.target.value as 'support' | 'self')}
                            className="w-full p-1 border rounded-md"
                          >
                            <option value="support">资助</option>
                            <option value="self">自筹</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={budget.description}
                            onChange={(e) => handleBudgetChange(index, 'description', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => removeBudget(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* 团队成员 */}
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-medium">项目团队</h3>
              <button
                type="button"
                onClick={addTeamMember}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + 添加团队成员
              </button>
            </div>
            
            {projectData.team.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                暂无团队成员信息，点击"添加团队成员"按钮添加
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职称</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目角色</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工作量</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属单位</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectData.team.map((member, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={member.title}
                            onChange={(e) => handleTeamMemberChange(index, 'title', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={member.workload}
                            onChange={(e) => handleTeamMemberChange(index, 'workload', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={member.unit}
                            onChange={(e) => handleTeamMemberChange(index, 'unit', e.target.value)}
                            className="w-full p-1 border rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep('upload')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            返回上传
          </button>
          <button
            type="button"
            onClick={saveProject}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存项目'}
          </button>
        </div>
      </div>
    );
  };

  // 渲染完成步骤
  const renderCompleteStep = () => {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">项目创建成功！</h2>
        <p className="text-gray-600 mb-8">
          您的项目"{projectData.basicInfo.name}"已成功创建，正在跳转到项目看板...
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/dashboard/projects" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            返回项目列表
          </Link>
          <Link 
            href={`/dashboard/projects/${projectData.basicInfo.code}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            查看项目详情
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">创建新项目</h1>
        
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <div className={`ml-2 text-sm font-medium ${step === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}>
                上传文件
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step === 'upload' ? 'bg-gray-200' : 'bg-blue-600'}`}></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'review' ? 'bg-blue-600 text-white' : step === 'complete' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
              <div className={`ml-2 text-sm font-medium ${step === 'review' ? 'text-blue-600' : step === 'complete' ? 'text-gray-700' : 'text-gray-500'}`}>
                审核信息
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step === 'complete' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'complete' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                3
              </div>
              <div className={`ml-2 text-sm font-medium ${step === 'complete' ? 'text-blue-600' : 'text-gray-500'}`}>
                完成
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {step === 'upload' && renderUploadStep()}
      {step === 'review' && renderReviewStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
} 