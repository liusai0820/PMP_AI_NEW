"use client";

import React, { useState, useEffect } from 'react';

// 定义专家接口
interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  field: string;
  expertise: string[];
  publications: number;
  projects: number;
  patents: number;
  avatar: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

// 添加专家输入接口
interface ExpertInput extends Partial<Expert> {
  expertiseInput?: string;
}

export default function ExpertsManagementPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpert, setNewExpert] = useState<ExpertInput>({
    name: '',
    title: '',
    organization: '',
    field: '',
    expertise: [],
    email: '',
    phone: '',
    status: 'active',
    expertiseInput: ''
  });

  // 获取专家列表
  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        // 实际应用中，这里应该调用API获取专家列表
        // 目前使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API延迟
        
        const mockExperts: Expert[] = [
          {
            id: '1',
            name: '张智能',
            title: '教授/博士生导师',
            organization: '清华大学',
            field: '人工智能',
            expertise: ['机器学习', '深度学习', '计算机视觉'],
            publications: 78,
            projects: 12,
            patents: 5,
            avatar: '/avatars/expert1.jpg',
            email: 'zhang@example.com',
            phone: '13800000001',
            status: 'active'
          },
          {
            id: '2',
            name: '李数据',
            title: '研究员',
            organization: '中国科学院',
            field: '数据科学',
            expertise: ['大数据分析', '数据挖掘', '统计学习'],
            publications: 45,
            projects: 8,
            patents: 3,
            avatar: '/avatars/expert2.jpg',
            email: 'li@example.com',
            phone: '13800000002',
            status: 'active'
          },
          {
            id: '3',
            name: '王工程',
            title: '高级工程师',
            organization: '华为技术有限公司',
            field: '软件工程',
            expertise: ['系统架构', '软件开发', '项目管理'],
            publications: 12,
            projects: 20,
            patents: 8,
            avatar: '/avatars/expert3.jpg',
            email: 'wang@example.com',
            phone: '13800000003',
            status: 'active'
          },
          {
            id: '4',
            name: '赵学者',
            title: '副教授',
            organization: '北京大学',
            field: '计算机科学',
            expertise: ['算法设计', '分布式系统', '云计算'],
            publications: 35,
            projects: 6,
            patents: 2,
            avatar: '/avatars/expert4.jpg',
            email: 'zhao@example.com',
            phone: '13800000004',
            status: 'inactive'
          },
          {
            id: '5',
            name: '钱专家',
            title: '首席科学家',
            organization: '百度研究院',
            field: '自然语言处理',
            expertise: ['文本分析', '语义理解', '知识图谱'],
            publications: 60,
            projects: 15,
            patents: 10,
            avatar: '/avatars/expert5.jpg',
            email: 'qian@example.com',
            phone: '13800000005',
            status: 'active'
          }
        ];
        
        setExperts(mockExperts);
      } catch (error) {
        console.error('获取专家列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // 过滤专家列表
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesField = selectedField === 'all' || expert.field === selectedField;
    
    return matchesSearch && matchesField;
  });

  // 获取所有领域
  const allFields = Array.from(new Set(experts.map(expert => expert.field)));

  // 处理添加专家
  const handleAddExpert = async () => {
    if (!newExpert.name || !newExpert.field || !newExpert.organization) {
      alert('请填写必要信息');
      return;
    }
    
    try {
      // 实际应用中，这里应该调用API添加专家
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟API延迟
      
      const expertToAdd: Expert = {
        id: `${experts.length + 1}`,
        name: newExpert.name || '',
        title: newExpert.title || '',
        organization: newExpert.organization || '',
        field: newExpert.field || '',
        expertise: newExpert.expertise || [],
        publications: 0,
        projects: 0,
        patents: 0,
        avatar: '/avatars/default.jpg',
        email: newExpert.email || '',
        phone: newExpert.phone || '',
        status: newExpert.status as 'active' | 'inactive' || 'active'
      };
      
      setExperts([...experts, expertToAdd]);
      setShowAddModal(false);
      setNewExpert({
        name: '',
        title: '',
        organization: '',
        field: '',
        expertise: [],
        email: '',
        phone: '',
        status: 'active',
        expertiseInput: ''
      });
      
      alert('专家添加成功');
    } catch (error) {
      console.error('添加专家失败:', error);
      alert('添加专家失败');
    }
  };

  // 处理专家状态变更
  const handleStatusChange = async (expertId: string, newStatus: 'active' | 'inactive') => {
    try {
      // 实际应用中，这里应该调用API更新专家状态
      // 目前直接更新本地状态
      const updatedExperts = experts.map(expert => 
        expert.id === expertId ? { ...expert, status: newStatus } : expert
      );
      
      setExperts(updatedExperts);
    } catch (error) {
      console.error('更新专家状态失败:', error);
    }
  };

  // 处理专长输入
  const handleExpertiseInput = (value: string) => {
    if (!value.trim()) return;
    
    // 检查是否按下逗号或空格
    if (value.includes(',') || value.includes(' ')) {
      const expertises = value.split(/[,\s]+/).filter(Boolean);
      
      setNewExpert({
        ...newExpert,
        expertise: [...(newExpert.expertise || []), ...expertises]
      });
      
      return '';
    }
    
    return value;
  };

  // 移除专长标签
  const removeExpertise = (index: number) => {
    const updatedExpertise = [...(newExpert.expertise || [])];
    updatedExpertise.splice(index, 1);
    
    setNewExpert({
      ...newExpert,
      expertise: updatedExpertise
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">专家库管理</h1>
          <p className="mt-2 text-gray-600">管理系统中的专家资源</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          添加专家
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">搜索专家</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              id="search"
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="搜索专家姓名、机构或领域"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <label htmlFor="field" className="sr-only">按领域筛选</label>
          <select
            id="field"
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            <option value="all">所有领域</option>
            {allFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 专家列表 */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredExperts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              没有找到匹配的专家
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredExperts.map(expert => (
                <li key={expert.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                        {expert.name.substring(0, 1)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                              {expert.name}
                              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${expert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {expert.status === 'active' ? '活跃' : '非活跃'}
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">{expert.title} | {expert.organization}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(expert.id, expert.status === 'active' ? 'inactive' : 'active')}
                              className={`px-3 py-1 text-xs font-medium rounded border ${
                                expert.status === 'active'
                                  ? 'border-red-300 text-red-700 hover:bg-red-50'
                                  : 'border-green-300 text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {expert.status === 'active' ? '设为非活跃' : '设为活跃'}
                            </button>
                            <button className="px-3 py-1 text-xs font-medium rounded border border-blue-300 text-blue-700 hover:bg-blue-50">
                              编辑
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p className="text-sm text-gray-700"><span className="font-medium">研究领域：</span>{expert.field}</p>
                          <p className="text-sm text-gray-700"><span className="font-medium">联系方式：</span>{expert.email}</p>
                          <p className="text-sm text-gray-700"><span className="font-medium">专长：</span>{expert.expertise.join('、')}</p>
                          <p className="text-sm text-gray-700"><span className="font-medium">电话：</span>{expert.phone}</p>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-700"><span className="font-medium">学术成果：</span>发表论文 {expert.publications} 篇，参与项目 {expert.projects} 个，专利 {expert.patents} 项</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 添加专家模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">添加专家</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.name}
                    onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">职称</label>
                  <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.title}
                    onChange={(e) => setNewExpert({ ...newExpert, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">所属机构 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="organization"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.organization}
                    onChange={(e) => setNewExpert({ ...newExpert, organization: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="field" className="block text-sm font-medium text-gray-700">研究领域 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="field"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.field}
                    onChange={(e) => setNewExpert({ ...newExpert, field: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">专长（用逗号或空格分隔）</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="expertise"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="输入专长，按逗号或空格添加"
                      value={newExpert.expertiseInput || ''}
                      onChange={(e) => {
                        const result = handleExpertiseInput(e.target.value);
                        if (result !== undefined) {
                          setNewExpert({ ...newExpert, expertiseInput: result });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newExpert.expertiseInput && newExpert.expertiseInput.trim()) {
                          e.preventDefault();
                          setNewExpert({
                            ...newExpert,
                            expertise: [...(newExpert.expertise || []), newExpert.expertiseInput.trim()],
                            expertiseInput: ''
                          });
                        }
                      }}
                    />
                  </div>
                  {newExpert.expertise && newExpert.expertise.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newExpert.expertise.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {item}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                            onClick={() => removeExpertise(index)}
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.email}
                    onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">电话</label>
                  <input
                    type="text"
                    id="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.phone}
                    onChange={(e) => setNewExpert({ ...newExpert, phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">状态</label>
                  <select
                    id="status"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newExpert.status}
                    onChange={(e) => setNewExpert({ ...newExpert, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleAddExpert}
              >
                添加
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 