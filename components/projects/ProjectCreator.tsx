"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentProcessor, CompleteProjectData } from '@/lib/services/documentProcessor';
import { ProjectInfo } from '../../types/project';

// 将 CompleteProjectData 转换为 ProjectInfo 的工具函数
const convertToProjectInfo = (data: CompleteProjectData): ProjectInfo => {
  console.log('开始转换项目数据:', JSON.stringify(data, null, 2));

  // 检查数据完整性
  if (!data || !data.basicInfo) {
    console.error('数据格式无效:', data);
    return {
      name: '未命名项目',
      projectName: '未命名项目',
      projectCode: '未提供',
      organization: '未提供',
      client: '未提供',
      projectManager: '未提供',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      description: '无效的项目数据',
      budget: undefined,
      governmentFunding: undefined,
      selfFunding: undefined,
      milestones: [],
      teamMembers: [],
      budgets: [], // 确保包含空数组
      team: []     // 确保包含空数组
    };
  }

  // 处理日期格式
  const formatDateString = (dateStr: string): string => {
    if (!dateStr || dateStr === '未提供' || dateStr === '0') {
      return new Date().toISOString().split('T')[0];
    }
    try {
      // 尝试解析日期
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      // 如果是中文日期格式（如：2024年2月1日），尝试解析
      const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (match) {
        const [, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      // 如果无法解析，返回当前日期
      return new Date().toISOString().split('T')[0];
    } catch (error) {
      console.error('日期格式化失败:', error, dateStr);
      return new Date().toISOString().split('T')[0];
    }
  };

  // 处理金额格式
  const parseAmount = (amount: string | undefined): number | undefined => {
    if (!amount || amount === '未提供' || amount === '0') return undefined;
    try {
      // 移除"万元"等单位，并转换为数字
      const numStr = amount.replace(/[万亿元,，]/g, '');
      const num = parseFloat(numStr);
      if (isNaN(num)) {
        console.warn('金额转换失败:', amount);
        return undefined;
      }
      // 如果包含"万"，将数值转换为万元
      if (amount.includes('万')) {
        return num;
      }
      // 否则假设是元，转换为万元
      return num / 10000;
    } catch (error) {
      console.error('金额解析失败:', error, amount);
      return undefined;
    }
  };

  // 确保基本信息字段存在
  const basicInfo = {
    name: data.basicInfo.name || '未命名项目',
    code: data.basicInfo.code || '未提供',
    mainDepartment: data.basicInfo.mainDepartment || '未提供',
    executeDepartment: data.basicInfo.executeDepartment || '未提供',
    manager: data.basicInfo.manager || '未提供',
    startDate: data.basicInfo.startDate || new Date().toISOString().split('T')[0],
    endDate: data.basicInfo.endDate || new Date().toISOString().split('T')[0],
    totalBudget: data.basicInfo.totalBudget || '0',
    supportBudget: data.basicInfo.supportBudget || '0',
    selfBudget: data.basicInfo.selfBudget || '0',
    description: data.basicInfo.description || '',
    type: data.basicInfo.type || '未分类'
  };

  // 打印转换前的数据
  console.log('基本信息:', JSON.stringify(basicInfo, null, 2));

  // 确保项目名称有效
  const projectName = basicInfo.name || '未命名项目';
  console.log('设置项目名称:', projectName);

  // 处理组织和客户信息
  const organization = basicInfo.executeDepartment !== '未提供' ? basicInfo.executeDepartment : '';
  const client = basicInfo.mainDepartment !== '未提供' ? basicInfo.mainDepartment : '';
  const projectManager = basicInfo.manager !== '未提供' ? basicInfo.manager : '';

  // 处理预算信息
  const budgets = data.budgets?.map(budget => ({
    category: budget.category || '',
    subCategory: budget.subCategory || '',
    amount: parseFloat(budget.amount.toString()) || 0,
    source: budget.source || 'support',
    description: budget.description || ''
  })) || [];

  // 处理团队信息
  const team = data.team?.map(member => ({
    name: member.name || '',
    title: member.title || '',
    role: member.role || '',
    workload: member.workload || '',
    unit: member.unit || ''
  })) || [];

  const convertedData: ProjectInfo = {
    name: projectName,
    projectName: projectName,
    projectCode: basicInfo.code !== '未提供' ? basicInfo.code : '',
    organization: organization,
    client: client,
    projectManager: projectManager,
    startDate: formatDateString(basicInfo.startDate),
    endDate: formatDateString(basicInfo.endDate),
    description: basicInfo.description || '',
    budget: parseAmount(basicInfo.totalBudget),
    governmentFunding: parseAmount(basicInfo.supportBudget),
    selfFunding: parseAmount(basicInfo.selfBudget),
    milestones: data.milestones?.map(m => ({
      name: m.phase || '',
      date: formatDateString(m.startDate),
      status: `${formatDateString(m.startDate)} - ${formatDateString(m.endDate)}`
    })) || [],
    teamMembers: data.team?.map(t => 
      `${t.name || '未知'} (${t.role || '未知'}) - ${t.title || '未知'} - ${t.unit || '未知'}`
    ) || [],
    budgets: budgets,
    team: team
  };

  // 打印转换后的数据
  console.log('转换后的数据:', JSON.stringify(convertedData, null, 2));

  return convertedData;
};

interface ProjectCreatorProps {
  onProjectCreate: (projectInfo: ProjectInfo) => Promise<void>;
  disabled?: boolean;
}

export default function ProjectCreator({ onProjectCreate, disabled }: ProjectCreatorProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectInfo>({
    name: '',
    projectName: '',
    projectCode: '',
    organization: '',
    client: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    description: '',
    budget: undefined,
    governmentFunding: undefined,
    selfFunding: undefined,
    milestones: [
      {
        name: '第一阶段',
        date: '',
        status: '未开始'
      }
    ],
    teamMembers: [],
    budgets: [], // 初始化为空数组
    team: []     // 初始化为空数组
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [processingStep, setProcessingStep] = useState<'idle' | 'uploading' | 'processing' | 'extracted' | 'failed'>('idle');
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);
    setProcessingStep('uploading');
    setFileUploaded(true);
    
    try {
      const file = acceptedFiles[0];
      console.log('处理文件:', file.name, file.type);
      
      setProcessingStep('processing');
      
      // 使用文档处理服务提取项目信息
      try {
        console.log('开始处理文档...');
        const extractedInfo = await documentProcessor.processDocument(file);
        console.log('文档处理结果:', JSON.stringify(extractedInfo, null, 2));
        
        // 转换提取的信息
        console.log('开始转换项目数据...');
        const simplifiedInfo = convertToProjectInfo(extractedInfo);
        console.log('转换后的项目数据:', JSON.stringify(simplifiedInfo, null, 2));
        
        // 验证转换后的数据
        if (!simplifiedInfo.name || simplifiedInfo.name === '未命名项目') {
          console.warn('项目名称未提取成功，使用文件名作为项目名称');
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          simplifiedInfo.name = fileName;
          simplifiedInfo.projectName = fileName;
        }
        
        // 确保必填字段都有值
        const defaultDate = new Date().toISOString().split('T')[0];
        const updatedInfo = {
          ...simplifiedInfo,
          startDate: simplifiedInfo.startDate || defaultDate,
          endDate: simplifiedInfo.endDate || defaultDate,
          projectCode: simplifiedInfo.projectCode || '待定',
          organization: simplifiedInfo.organization || '',
          client: simplifiedInfo.client || '',
          projectManager: simplifiedInfo.projectManager || '',
          description: simplifiedInfo.description || '',
          milestones: simplifiedInfo.milestones || [],
          budgets: simplifiedInfo.budgets || [],
          team: simplifiedInfo.team || []
        };
        
        console.log('更新后的项目数据:', JSON.stringify(updatedInfo, null, 2));
        
        // 更新状态
        setFormData(updatedInfo);
        setProcessingStep('extracted');
        
        console.log('项目信息设置完成:', JSON.stringify(updatedInfo, null, 2));
      } catch (processError) {
        console.error('文档处理失败:', processError);
        setProcessingStep('failed');
        
        // 显示详细的错误信息
        let errorMessage = '处理文件时发生错误';
        if (processError instanceof Error) {
          errorMessage = processError.message;
        } else if (typeof processError === 'object' && processError !== null) {
          errorMessage = JSON.stringify(processError);
        }
        setError(`文档处理失败: ${errorMessage}`);
        
        // 如果有回退数据，仍然使用它
        if (processError && typeof processError === 'object' && 'fallbackData' in processError) {
          const fallbackData = (processError as { fallbackData: CompleteProjectData }).fallbackData;
          if (fallbackData && typeof fallbackData === 'object') {
            console.log('使用回退数据:', JSON.stringify(fallbackData, null, 2));
            const simplifiedInfo = convertToProjectInfo(fallbackData);
            setFormData({
              ...simplifiedInfo,
              milestones: simplifiedInfo.milestones || [],
              budgets: simplifiedInfo.budgets || [],
              team: simplifiedInfo.team || []
            });
          }
        }
      }
    } catch (err) {
      console.error('文档处理失败:', err);
      setError(err instanceof Error ? err.message : '处理文件时发生错误');
      setProcessingStep('failed');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 限制文件大小为10MB
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ProjectInfo) => {
      // 对于数字类型的字段，确保值是有效的数字
      if (['budget', 'governmentFunding', 'selfFunding'].includes(name)) {
        const numValue = value === '' ? undefined : parseFloat(value);
        return {
          ...prev,
          [name]: numValue
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // 验证表单数据
      if (!formData || Object.keys(formData).length === 0) {
        throw new Error('项目信息不能为空');
      }

      console.log('提交前的表单数据:', JSON.stringify(formData, null, 2));

      // 验证必填字段
      const requiredFields = {
        name: '项目名称',
        projectCode: '项目编号',
        organization: '承担单位',
        projectManager: '项目负责人',
        startDate: '开始日期',
        endDate: '结束日期'
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        const value = formData[field as keyof ProjectInfo];
        if (!value || value === '未提供' || value === '未设置' || value === '') {
          throw new Error(`${label}不能为空`);
        }
      }

      // 验证日期格式和逻辑
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error('日期格式无效');
        }
        if (end < start) {
          throw new Error('结束日期不能早于开始日期');
        }
      }

      // 验证金额
      const validateAmount = (amount: number | undefined, fieldName: string) => {
        if (amount !== undefined && (isNaN(amount) || amount < 0)) {
          throw new Error(`${fieldName}必须是有效的非负数`);
        }
      };

      validateAmount(formData.budget, '总预算');
      validateAmount(formData.governmentFunding, '资助金额');
      validateAmount(formData.selfFunding, '自筹金额');

      // 确保所有字段都不是 '未提供' 或 '未设置'
      const cleanedData = {
        ...formData,
        name: formData.name === '未提供' || formData.name === '未设置' ? '' : formData.name,
        projectCode: formData.projectCode === '未提供' || formData.projectCode === '未设置' ? '' : formData.projectCode,
        organization: formData.organization === '未提供' || formData.organization === '未设置' ? '' : formData.organization,
        client: formData.client === '未提供' || formData.client === '未设置' ? '' : formData.client,
        projectManager: formData.projectManager === '未提供' || formData.projectManager === '未设置' ? '' : formData.projectManager,
        description: formData.description === '未提供' || formData.description === '未设置' ? '' : formData.description,
        milestones: formData.milestones || [],
        budgets: formData.budgets || [],
        team: formData.team || []
      };

      console.log('开始创建项目，清理后的数据:', JSON.stringify(cleanedData, null, 2));
      
      await onProjectCreate(cleanedData);
    } catch (error) {
      console.error('创建项目失败:', error);
      setError(error instanceof Error ? error.message : '创建项目时发生错误');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">创建新项目</h2>
        <p className="text-gray-600 mt-1">
          上传项目文档，系统将自动提取项目信息。您也可以手动编辑提取的信息。
        </p>
      </div>
      
      <div className="space-y-6">
        {/* 文件上传区域 - 始终可见 */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              {fileUploaded ? '重新上传文档' : '拖放项目文档到此处，或点击选择文件'}
            </h3>
            <p className="text-sm text-gray-500">
              支持 PDF、DOCX 和图片文件（最大 10MB）
            </p>
          </div>
        </div>
        
        {/* 处理状态指示器 */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-700">
              {processingStep === 'uploading' ? '正在上传文档...' : '正在分析文档，提取项目信息...'}
            </p>
          </div>
        )}
        
        {/* 错误信息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">文档处理出错</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                  {processingStep === 'failed' && (
                    <p className="mt-2">您可以继续手动填写项目信息，或尝试重新上传文档。</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 提取成功提示 */}
        {processingStep === 'extracted' && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">项目信息提取成功！请检查并编辑以下信息，然后点击&quot;创建项目&quot;。</p>
          </div>
        )}
        
        {/* 项目表单 - 仅在文件上传后显示 */}
        {fileUploaded && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-3">项目基本信息</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700">
                  项目编号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectCode"
                  id="projectCode"
                  value={formData.projectCode || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  承担单位 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  value={formData.organization || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700">主管部门</label>
                <input
                  type="text"
                  name="client"
                  id="client"
                  value={formData.client || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700">
                  项目负责人 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectManager"
                  id="projectManager"
                  value={formData.projectManager || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  开始日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  结束日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">总预算（万元）</label>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  value={formData.budget || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="governmentFunding" className="block text-sm font-medium text-gray-700">资助金额（万元）</label>
                <input
                  type="number"
                  name="governmentFunding"
                  id="governmentFunding"
                  value={formData.governmentFunding || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="selfFunding" className="block text-sm font-medium text-gray-700">自筹金额（万元）</label>
                <input
                  type="number"
                  name="selfFunding"
                  id="selfFunding"
                  value={formData.selfFunding || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">项目描述</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* 里程碑信息 */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">项目里程碑</h3>
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          阶段名称
                        </label>
                        <input
                          type="text"
                          value={milestone.name}
                          onChange={(e) => {
                            const newMilestones = [...formData.milestones];
                            newMilestones[index].name = e.target.value;
                            setFormData({ ...formData, milestones: newMilestones });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          计划日期
                        </label>
                        <input
                          type="date"
                          value={milestone.date}
                          onChange={(e) => {
                            const newMilestones = [...formData.milestones];
                            newMilestones[index].date = e.target.value;
                            setFormData({ ...formData, milestones: newMilestones });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          状态
                        </label>
                        <select
                          value={milestone.status}
                          onChange={(e) => {
                            const newMilestones = [...formData.milestones];
                            newMilestones[index].status = e.target.value;
                            setFormData({ ...formData, milestones: newMilestones });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="未开始">未开始</option>
                          <option value="进行中">进行中</option>
                          <option value="已完成">已完成</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newMilestones = formData.milestones.filter((_, i) => i !== index);
                        setFormData({ ...formData, milestones: newMilestones });
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      删除此阶段
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      milestones: [
                        ...formData.milestones,
                        { name: `第${formData.milestones.length + 1}阶段`, date: '', status: '未开始' }
                      ]
                    });
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  添加里程碑
                </button>
              </div>
            </div>

            {/* 预算资金信息 */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">预算资金</h3>
              <div className="space-y-4">
                {formData.budgets.map((budget, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          预算类别
                        </label>
                        <input
                          type="text"
                          value={budget.category}
                          onChange={(e) => {
                            const newBudgets = [...formData.budgets];
                            newBudgets[index].category = e.target.value;
                            setFormData({ ...formData, budgets: newBudgets });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          金额（万元）
                        </label>
                        <input
                          type="number"
                          value={budget.amount}
                          onChange={(e) => {
                            const newBudgets = [...formData.budgets];
                            newBudgets[index].amount = parseFloat(e.target.value);
                            setFormData({ ...formData, budgets: newBudgets });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          资金来源
                        </label>
                        <select
                          value={budget.source}
                          onChange={(e) => {
                            const newBudgets = [...formData.budgets];
                            newBudgets[index].source = e.target.value as 'support' | 'self';
                            setFormData({ ...formData, budgets: newBudgets });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="support">资助</option>
                          <option value="self">自筹</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          说明
                        </label>
                        <input
                          type="text"
                          value={budget.description}
                          onChange={(e) => {
                            const newBudgets = [...formData.budgets];
                            newBudgets[index].description = e.target.value;
                            setFormData({ ...formData, budgets: newBudgets });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newBudgets = formData.budgets.filter((_, i) => i !== index);
                        setFormData({ ...formData, budgets: newBudgets });
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      删除此预算
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      budgets: [
                        ...formData.budgets,
                        { category: '', subCategory: '', amount: 0, source: 'support', description: '' }
                      ]
                    });
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  添加预算项
                </button>
              </div>
            </div>

            {/* 项目团队信息 */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">项目团队</h3>
              <div className="space-y-4">
                {formData.team.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          姓名
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const newTeam = [...formData.team];
                            newTeam[index].name = e.target.value;
                            setFormData({ ...formData, team: newTeam });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          职称
                        </label>
                        <input
                          type="text"
                          value={member.title}
                          onChange={(e) => {
                            const newTeam = [...formData.team];
                            newTeam[index].title = e.target.value;
                            setFormData({ ...formData, team: newTeam });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          项目角色
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const newTeam = [...formData.team];
                            newTeam[index].role = e.target.value;
                            setFormData({ ...formData, team: newTeam });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          工作量
                        </label>
                        <input
                          type="text"
                          value={member.workload}
                          onChange={(e) => {
                            const newTeam = [...formData.team];
                            newTeam[index].workload = e.target.value;
                            setFormData({ ...formData, team: newTeam });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          所属单位
                        </label>
                        <input
                          type="text"
                          value={member.unit}
                          onChange={(e) => {
                            const newTeam = [...formData.team];
                            newTeam[index].unit = e.target.value;
                            setFormData({ ...formData, team: newTeam });
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTeam = formData.team.filter((_, i) => i !== index);
                        setFormData({ ...formData, team: newTeam });
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      删除此成员
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      team: [
                        ...formData.team,
                        { name: '', title: '', role: '', workload: '', unit: '' }
                      ]
                    });
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  添加团队成员
                </button>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={disabled}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {disabled ? '创建中...' : '创建项目'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 