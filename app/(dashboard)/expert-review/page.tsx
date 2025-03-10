"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// 定义专家接口
interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  field: string;
  category: 'academic' | 'industry' | 'investment' | 'government';
  expertise: string[];
  publications: number;
  projects: number;
  patents: number;
  avatar: string;
  matchScore: number;
  matchReason: string;
}

// 定义项目接口
interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  keywords: string[];
}

// 定义评审任务接口
interface ReviewTask {
  id: string;
  projectId: string;
  projectName: string;
  expertId: string;
  expertName: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  deadline: string;
}

// 定义匹配分数接口
interface MatchScores {
  expertId: string;
  expertName: string;
  scores: {
    name: string;
    value: number;
    fullMark: number;
  }[];
  totalScore: number;
}

export default function ExpertReviewPage() {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [reviewTasks, setReviewTasks] = useState<ReviewTask[]>([]);
  const [activeTab, setActiveTab] = useState<'match' | 'tasks'>('match');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [matchScores, setMatchScores] = useState<MatchScores[]>([]);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);

  // 获取项目列表
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/projects');
        // 模拟添加关键词
        const projectsWithKeywords = response.data.map((project: Project) => ({
          ...project,
          keywords: ['人工智能', '机器学习', '数据分析', '项目管理'].slice(0, Math.floor(Math.random() * 4) + 1)
        }));
        setProjects(projectsWithKeywords);
      } catch (error) {
        console.error('获取项目列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 获取评审任务列表
  useEffect(() => {
    const fetchReviewTasks = async () => {
      // 这里应该调用API获取评审任务列表
      // 目前使用模拟数据
      const mockTasks: ReviewTask[] = [
        {
          id: '1',
          projectId: '101',
          projectName: '智能制造数字化转型项目',
          expertId: '201',
          expertName: '张教授',
          status: 'completed',
          createdAt: '2023-12-01',
          deadline: '2023-12-15'
        },
        {
          id: '2',
          projectId: '102',
          projectName: '新能源电池研发项目',
          expertId: '202',
          expertName: '李研究员',
          status: 'pending',
          createdAt: '2024-02-15',
          deadline: '2024-03-01'
        },
        {
          id: '3',
          projectId: '103',
          projectName: '智慧城市基础设施建设',
          expertId: '203',
          expertName: '王工程师',
          status: 'accepted',
          createdAt: '2024-01-20',
          deadline: '2024-02-20'
        }
      ];
      setReviewTasks(mockTasks);
    };

    fetchReviewTasks();
  }, []);

  // 分析项目并匹配专家
  const analyzeAndMatchExperts = async () => {
    if (!selectedProject) return;
    
    setAnalyzing(true);
    setExperts([]);
    setMatchScores([]);
    
    try {
      // 实际应用中，这里应该调用后端API进行分析和匹配
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟API延迟
      
      const analysisText = `项目《${selectedProject.name}》分析结果：
      
1. 项目类型：${selectedProject.type || '研发类项目'}
2. 关键技术领域：${selectedProject.keywords?.join('、') || '人工智能、数据分析'}
3. 项目复杂度：中高
4. 所需专业知识：人工智能算法、大数据处理、行业应用

根据项目特点，系统推荐以下专业领域的专家：
- 人工智能/机器学习专家（学术界）
- 数据科学专家（学术界）
- ${selectedProject.type === '研发类' ? '研发管理专家（产业界）' : '行业应用专家（产业界）'}
- 项目管理专家（产业界）
- 技术投资顾问（投资界）
- 政策法规顾问（政府机构）`;

      setAnalysisResult(analysisText);
      
      // 模拟专家匹配结果
      const mockExperts: Expert[] = [
        {
          id: '1',
          name: '张智能',
          title: '教授/博士生导师',
          organization: '清华大学',
          field: '人工智能',
          category: 'academic',
          expertise: ['机器学习', '深度学习', '计算机视觉'],
          publications: 78,
          projects: 12,
          patents: 5,
          avatar: '/avatars/expert1.jpg',
          matchScore: 95,
          matchReason: '专攻人工智能领域，在机器学习和深度学习方面有丰富经验，曾主持多个相关项目'
        },
        {
          id: '2',
          name: '李数据',
          title: '研究员',
          organization: '中国科学院',
          field: '数据科学',
          category: 'academic',
          expertise: ['大数据分析', '数据挖掘', '统计学习'],
          publications: 45,
          projects: 8,
          patents: 3,
          avatar: '/avatars/expert2.jpg',
          matchScore: 88,
          matchReason: '数据科学专家，在大数据处理和分析方面有深入研究，对项目中的数据处理需求匹配度高'
        },
        {
          id: '3',
          name: '王工程',
          title: '高级工程师',
          organization: '华为技术有限公司',
          field: '软件工程',
          category: 'industry',
          expertise: ['系统架构', '软件开发', '项目管理'],
          publications: 12,
          projects: 20,
          patents: 8,
          avatar: '/avatars/expert3.jpg',
          matchScore: 82,
          matchReason: '拥有丰富的工程实践经验，特别是在系统架构和项目管理方面，能够提供实用的工程建议'
        },
        {
          id: '4',
          name: '赵学者',
          title: '副教授',
          organization: '北京大学',
          field: '计算机科学',
          category: 'academic',
          expertise: ['算法设计', '分布式系统', '云计算'],
          publications: 35,
          projects: 6,
          patents: 2,
          avatar: '/avatars/expert4.jpg',
          matchScore: 75,
          matchReason: '在算法设计和分布式系统方面有专长，对项目的技术实现有参考价值'
        },
        {
          id: '5',
          name: '钱专家',
          title: '首席科学家',
          organization: '百度研究院',
          field: '自然语言处理',
          category: 'industry',
          expertise: ['文本分析', '语义理解', '知识图谱'],
          publications: 60,
          projects: 15,
          patents: 10,
          avatar: '/avatars/expert5.jpg',
          matchScore: 70,
          matchReason: '自然语言处理领域专家，在文本分析和语义理解方面有深厚积累'
        },
        {
          id: '6',
          name: '孙投资',
          title: '投资总监',
          organization: '红杉资本中国',
          field: '技术投资',
          category: 'investment',
          expertise: ['风险投资', '技术评估', '市场分析'],
          publications: 5,
          projects: 30,
          patents: 0,
          avatar: '/avatars/expert6.jpg',
          matchScore: 68,
          matchReason: '专注于技术领域投资，对项目的商业价值和市场前景有独到见解'
        },
        {
          id: '7',
          name: '周顾问',
          title: '政策研究员',
          organization: '科技部高新技术发展司',
          field: '科技政策',
          category: 'government',
          expertise: ['政策法规', '知识产权', '科技项目评估'],
          publications: 15,
          projects: 25,
          patents: 0,
          avatar: '/avatars/expert7.jpg',
          matchScore: 65,
          matchReason: '熟悉科技政策和法规，对项目的合规性和政策支持有专业建议'
        }
      ];
      
      // 模拟匹配分数详情
      const mockMatchScores: MatchScores[] = [
        {
          expertId: '1',
          expertName: '张智能',
          scores: [
            { name: '专业相关度', value: 95, fullMark: 100 },
            { name: '研究经验', value: 90, fullMark: 100 },
            { name: '项目经验', value: 85, fullMark: 100 },
            { name: '学术成果', value: 92, fullMark: 100 },
            { name: '技术创新', value: 88, fullMark: 100 },
          ],
          totalScore: 95
        },
        {
          expertId: '2',
          expertName: '李数据',
          scores: [
            { name: '专业相关度', value: 90, fullMark: 100 },
            { name: '研究经验', value: 85, fullMark: 100 },
            { name: '项目经验', value: 80, fullMark: 100 },
            { name: '学术成果', value: 88, fullMark: 100 },
            { name: '技术创新', value: 82, fullMark: 100 },
          ],
          totalScore: 88
        },
        {
          expertId: '3',
          expertName: '王工程',
          scores: [
            { name: '专业相关度', value: 75, fullMark: 100 },
            { name: '研究经验', value: 70, fullMark: 100 },
            { name: '项目经验', value: 95, fullMark: 100 },
            { name: '学术成果', value: 65, fullMark: 100 },
            { name: '技术创新', value: 80, fullMark: 100 },
          ],
          totalScore: 82
        },
        {
          expertId: '4',
          expertName: '赵学者',
          scores: [
            { name: '专业相关度', value: 80, fullMark: 100 },
            { name: '研究经验', value: 75, fullMark: 100 },
            { name: '项目经验', value: 65, fullMark: 100 },
            { name: '学术成果', value: 85, fullMark: 100 },
            { name: '技术创新', value: 70, fullMark: 100 },
          ],
          totalScore: 75
        },
        {
          expertId: '5',
          expertName: '钱专家',
          scores: [
            { name: '专业相关度', value: 85, fullMark: 100 },
            { name: '研究经验', value: 80, fullMark: 100 },
            { name: '项目经验', value: 75, fullMark: 100 },
            { name: '学术成果', value: 90, fullMark: 100 },
            { name: '技术创新', value: 85, fullMark: 100 },
          ],
          totalScore: 70
        },
        {
          expertId: '6',
          expertName: '孙投资',
          scores: [
            { name: '专业相关度', value: 70, fullMark: 100 },
            { name: '研究经验', value: 60, fullMark: 100 },
            { name: '项目经验', value: 85, fullMark: 100 },
            { name: '学术成果', value: 50, fullMark: 100 },
            { name: '技术创新', value: 75, fullMark: 100 },
          ],
          totalScore: 68
        },
        {
          expertId: '7',
          expertName: '周顾问',
          scores: [
            { name: '专业相关度', value: 65, fullMark: 100 },
            { name: '研究经验', value: 70, fullMark: 100 },
            { name: '项目经验', value: 80, fullMark: 100 },
            { name: '学术成果', value: 60, fullMark: 100 },
            { name: '技术创新', value: 55, fullMark: 100 },
          ],
          totalScore: 65
        }
      ];
      
      setExperts(mockExperts);
      setMatchScores(mockMatchScores);
    } catch (error) {
      console.error('分析项目并匹配专家失败:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // 获取专家的匹配分数详情
  const getExpertMatchScores = (expertId: string) => {
    return matchScores.find(score => score.expertId === expertId);
  };

  // 创建评审任务
  const createReviewTasks = async () => {
    if (!selectedProject || selectedExperts.length === 0) return;
    
    setLoading(true);
    
    try {
      // 实际应用中，这里应该调用后端API创建评审任务
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API延迟
      
      // 模拟创建成功
      const successMessage = `已成功为项目"${selectedProject.name}"创建${selectedExperts.length}个专家评审任务`;
      
      // 显示成功提示
      setSuccessMessage(successMessage);
      setTimeout(() => setSuccessMessage(''), 5000); // 5秒后自动关闭
      
      // 重置选择
      setSelectedExperts([]);
      setActiveTab('tasks');
      
      // 刷新任务列表
      const newTasks: ReviewTask[] = selectedExperts.map((expertId, index) => {
        const expert = experts.find(e => e.id === expertId);
        const today = new Date();
        const deadline = new Date();
        deadline.setDate(today.getDate() + 14); // 设置截止日期为两周后
        
        return {
          id: `new-${index}`,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          expertId: expertId,
          expertName: expert?.name || '未知专家',
          status: 'pending' as const,
          createdAt: today.toISOString().split('T')[0],
          deadline: deadline.toISOString().split('T')[0]
        };
      });
      
      setReviewTasks([...newTasks, ...reviewTasks]);
    } catch (error) {
      console.error('创建评审任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换专家选择
  const toggleExpertSelection = (expertId: string) => {
    if (selectedExperts.includes(expertId)) {
      setSelectedExperts(selectedExperts.filter(id => id !== expertId));
    } else {
      setSelectedExperts([...selectedExperts, expertId]);
    }
  };

  // 获取状态标签样式
  const getStatusBadgeClass = (status: ReviewTask['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态中文名称
  const getStatusName = (status: ReviewTask['status']) => {
    switch (status) {
      case 'pending':
        return '待接受';
      case 'accepted':
        return '已接受';
      case 'declined':
        return '已拒绝';
      case 'completed':
        return '已完成';
      default:
        return '未知状态';
    }
  };

  // 发送提醒
  const sendReminder = async (taskId: string) => {
    setLoading(true);
    try {
      // 实际应用中，这里应该调用API发送提醒
      console.log(`发送提醒给任务ID: ${taskId}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API延迟
      alert(`已成功向专家发送评审提醒`);
    } catch (error) {
      console.error('发送提醒失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 查看评审详情
  const viewReviewDetails = (taskId: string) => {
    alert(`查看评审任务详情: ${taskId}`);
    // 实际应用中，这里应该跳转到评审详情页面或打开详情模态框
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">专家评审智能匹配系统</h1>
        <p className="mt-2 text-gray-600">基于深度学习算法和自然语言处理技术，智能分析项目内容，精准匹配跨领域专家团队</p>
      </div>

      {/* 成功提示 */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-700">{successMessage}</p>
          <button 
            onClick={() => setSuccessMessage('')}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('match')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'match'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            专家匹配
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            评审任务管理
          </button>
        </nav>
      </div>

      {/* 专家匹配标签页 */}
      {activeTab === 'match' && (
        <div>
          {/* 项目选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择项目
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProject?.id === project.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.code || `项目编号: P${project.id}`}
                  </p>
                  {project.keywords && project.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 分析按钮 */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={analyzeAndMatchExperts}
              disabled={!selectedProject || analyzing}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${
                !selectedProject || analyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在分析项目内容并匹配专家...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  分析项目内容并匹配专家
                </>
              )}
            </button>
          </div>

          {/* 分析结果 */}
          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 mb-2">项目分析结果</h3>
                <button
                  onClick={() => setShowAlgorithmModal(true)}
                  className="px-3 py-1 text-xs font-medium rounded border border-blue-500 text-blue-700 hover:bg-blue-50 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  查看匹配算法
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {analysisResult}
              </pre>
            </motion.div>
          )}

          {/* 专家列表 */}
          {experts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">匹配的专家（{experts.length}）</h3>
                <button
                  onClick={createReviewTasks}
                  disabled={selectedExperts.length === 0 || loading}
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${
                    selectedExperts.length === 0 || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      创建中...
                    </>
                  ) : (
                    <>创建评审任务 ({selectedExperts.length})</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {experts.map(expert => {
                  const expertScores = getExpertMatchScores(expert.id);
                  return (
                    <div
                      key={expert.id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedExperts.includes(expert.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="flex items-start md:w-2/3">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                              {expert.name.substring(0, 1)}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{expert.name}</h3>
                                <p className="text-sm text-gray-500">{expert.title} | {expert.organization}</p>
                                <div className="mt-1">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    expert.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                                    expert.category === 'industry' ? 'bg-green-100 text-green-800' :
                                    expert.category === 'investment' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {expert.category === 'academic' ? '学术界' :
                                    expert.category === 'industry' ? '产业界' :
                                    expert.category === 'investment' ? '投资界' : '政府机构'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-blue-600">{expert.matchScore}</span>
                                <span className="text-sm text-gray-500 ml-1">分</span>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-sm text-gray-700"><span className="font-medium">研究领域：</span>{expert.field}</p>
                              <p className="text-sm text-gray-700 mt-1"><span className="font-medium">专长：</span>{expert.expertise.join('、')}</p>
                              <p className="text-sm text-gray-700 mt-1"><span className="font-medium">学术成果：</span>发表论文 {expert.publications} 篇，参与项目 {expert.projects} 个，专利 {expert.patents} 项</p>
                              <p className="text-sm text-gray-700 mt-1"><span className="font-medium">匹配理由：</span>{expert.matchReason}</p>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => toggleExpertSelection(expert.id)}
                                className={`px-4 py-2 rounded-md font-medium text-sm ${
                                  selectedExperts.includes(expert.id)
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {selectedExperts.includes(expert.id) ? '已选择' : '选择'}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* 雷达图 */}
                        {expertScores && (
                          <div className="mt-4 md:mt-0 md:w-1/3 h-64">
                            <p className="text-sm font-medium text-gray-700 mb-2 text-center">专家匹配评分维度</p>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={expertScores.scores}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                  name={expert.name}
                                  dataKey="value"
                                  stroke="#2563EB"
                                  fill="#3B82F6"
                                  fillOpacity={0.6}
                                />
                                <Tooltip />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 评审任务管理标签页 */}
      {activeTab === 'tasks' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">评审任务列表</h3>
            <div className="flex space-x-2">
              <select
                className="block w-40 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue="all"
              >
                <option value="all">所有状态</option>
                <option value="pending">待接受</option>
                <option value="accepted">已接受</option>
                <option value="declined">已拒绝</option>
                <option value="completed">已完成</option>
              </select>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                筛选
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {reviewTasks.map(task => (
                <li key={task.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 truncate">{task.projectName}</p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                            {getStatusName(task.status)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          截止日期: {task.deadline}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          评审专家: {task.expertName}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p>
                          创建于 {task.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button 
                        onClick={() => viewReviewDetails(task.id)}
                        className="px-3 py-1 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        查看详情
                      </button>
                      {task.status === 'pending' && (
                        <button 
                          onClick={() => sendReminder(task.id)}
                          className="px-3 py-1 text-xs font-medium rounded border border-blue-500 text-blue-700 hover:bg-blue-50 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                          </svg>
                          发送提醒
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <button 
                          className="px-3 py-1 text-xs font-medium rounded border border-green-500 text-green-700 hover:bg-green-50 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          查看评审报告
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 算法模态框 */}
      {showAlgorithmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">专家匹配算法说明</h3>
              <button
                onClick={() => setShowAlgorithmModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">算法概述</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    专家匹配算法基于深度学习和自然语言处理技术，通过多维度分析项目内容和专家特征，实现精准匹配。
                    算法综合考虑专业相关度、研究经验、项目经验、学术成果和技术创新五个核心维度，为每位专家生成综合评分。
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">评分维度说明</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-gray-900">专业相关度 (权重: 30%)</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        评估专家的研究领域和专长与项目需求的匹配程度。通过语义相似度算法分析专家的研究方向、发表论文和项目经历与当前项目的相关性。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-gray-900">研究经验 (权重: 20%)</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        评估专家在相关领域的研究深度和广度。考虑专家的学术背景、研究年限、研究成果的影响力和创新性。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-gray-900">项目经验 (权重: 20%)</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        评估专家参与类似项目的经验。分析专家过往项目的规模、复杂度、角色和成果，以及与当前项目的相似度。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-gray-900">学术成果 (权重: 15%)</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        评估专家的学术影响力。考虑发表论文数量、引用次数、专利数量、学术奖项等指标，以及成果与项目领域的相关性。
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-gray-900">技术创新 (权重: 15%)</h5>
                      <p className="text-xs text-gray-500 mt-1">
                        评估专家的创新能力和前沿视野。分析专家在新技术、新方法、新理论方面的贡献，以及解决复杂问题的能力。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">算法流程</h4>
                  <div className="mt-2 bg-gray-50 p-4 rounded">
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>
                        <span className="font-medium">文本特征提取：</span>
                        <span className="text-gray-500">使用BERT模型从项目文档中提取关键特征，包括技术领域、研究方向、项目目标等。</span>
                      </li>
                      <li>
                        <span className="font-medium">专家特征向量化：</span>
                        <span className="text-gray-500">将专家的研究领域、专长、项目经历等信息转换为高维特征向量。</span>
                      </li>
                      <li>
                        <span className="font-medium">语义相似度计算：</span>
                        <span className="text-gray-500">计算项目特征向量与专家特征向量之间的余弦相似度，评估匹配程度。</span>
                      </li>
                      <li>
                        <span className="font-medium">多维度评分：</span>
                        <span className="text-gray-500">基于五个核心维度对每位专家进行评分，每个维度的评分范围为0-100分。</span>
                      </li>
                      <li>
                        <span className="font-medium">加权综合评分：</span>
                        <span className="text-gray-500">根据各维度的权重计算专家的综合评分，作为最终的匹配分数。</span>
                      </li>
                      <li>
                        <span className="font-medium">专家团队优化：</span>
                        <span className="text-gray-500">考虑专家的多样性和互补性，优化专家团队组合，确保覆盖项目所需的各个领域。</span>
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">算法优势</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-blue-900">高精度匹配</h5>
                      <p className="text-xs text-blue-700 mt-1">
                        基于深度学习的语义理解，能够准确捕捉项目与专家之间的深层次关联，匹配精度高达85%以上。
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-green-900">多维度评估</h5>
                      <p className="text-xs text-green-700 mt-1">
                        综合考虑专业相关度、研究经验、项目经验、学术成果和技术创新五个核心维度，全面评估专家能力。
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-purple-900">跨领域匹配</h5>
                      <p className="text-xs text-purple-700 mt-1">
                        能够识别跨领域的潜在关联，发现传统方法难以发现的专家资源，促进学科交叉创新。
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="text-sm font-medium text-orange-900">持续学习优化</h5>
                      <p className="text-xs text-orange-700 mt-1">
                        算法具备自我学习能力，通过评审反馈不断优化匹配模型，匹配精度随使用时间持续提升。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowAlgorithmModal(false)}
              >
                了解了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 