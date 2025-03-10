// 项目趋势数据
export const projectData = [
  { name: '1月', 在建: 10, 已完成: 5, 延期: 3, 趋势: 15 },
  { name: '2月', 在建: 12, 已完成: 6, 延期: 2, 趋势: 18 },
  { name: '3月', 在建: 15, 已完成: 7, 延期: 1, 趋势: 20 },
  { name: '4月', 在建: 16, 已完成: 8, 延期: 2, 趋势: 22 },
  { name: '5月', 在建: 17, 已完成: 9, 延期: 1, 趋势: 25 },
  { name: '6月', 在建: 18, 已完成: 10, 延期: 0, 趋势: 28 },
];

// 项目类型分布数据
export const projectTypes = [
  { name: '研发项目', value: 12 },
  { name: '医疗项目', value: 6 },
  { name: '技术创新', value: 8 },
  { name: '基础研究', value: 4 }
];

// 最近项目数据
export const recentProjects = [
  { id: '01', name: '高时空解析度电子显微镜关键部件研究项目', progress: 100, status: '已完结', department: '研发部', date: '2023-12-31' },
  { id: '02', name: '先进航空材料预应力工程与纳米技术研发合作项目', progress: 100, status: '已完结', department: '研发部', date: '2023-12-31' },
  { id: '03', name: '深港智慧医疗机器人开放创新平台项目', progress: 100, status: '已完结', department: '医疗部', date: '2023-12-31' },
  { id: '04', name: '大湾区生物医药创新研发中心', progress: 100, status: '已完结', department: '医疗部', date: '2023-12-31' }
];

// 最近活动数据
export const recentActivities = [
  { type: '项目完结', project: '高时空解析度电子显微镜关键部件研究项目', user: '系统', time: '已完结' },
  { type: '项目完结', project: '先进航空材料预应力工程与纳米技术研发合作项目', user: '系统', time: '已完结' },
  { type: '项目完结', project: '深港智慧医疗机器人开放创新平台项目', user: '系统', time: '已完结' },
  { type: '项目完结', project: '大湾区生物医药创新研发中心', user: '系统', time: '已完结' },
];

// 图表颜色
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// AI助手建议问题
export const initialSuggestions = [
  '如何提高研发项目的效率？',
  '医疗器械研发项目的质量控制措施有哪些？',
  '高科技项目的风险管理策略',
  '研发项目的成本控制方法',
  '如何有效管理跨部门协作项目'
];

// 项目列表数据
export const projectList = [
  { 
    id: '01', 
    name: '高时空解析度电子显微镜关键部件研究项目', 
    department: '研发部',
    progress: 100,
    documents: 15
  },
  { 
    id: '02', 
    name: '先进航空材料预应力工程与纳米技术研发合作项目', 
    department: '研发部',
    progress: 100,
    documents: 18
  },
  { 
    id: '03', 
    name: '深港智慧医疗机器人开放创新平台项目', 
    department: '医疗部',
    progress: 100,
    documents: 20
  },
  { 
    id: '04', 
    name: '大湾区生物医药创新研发中心', 
    department: '医疗部',
    progress: 100,
    documents: 16
  },
  { 
    id: '05', 
    name: '三相位法百万级像素飞行时间成像机理研究', 
    department: '研发部',
    progress: 100,
    documents: 14
  },
  { 
    id: '06', 
    name: '三相位法百万级像素飞行时间成像机理研究', 
    department: '研发部',
    progress: 100,
    documents: 12
  },
  { 
    id: '07', 
    name: '低功耗、高速、高可靠性VCSEL光芯片机理研究项目', 
    department: '研发部',
    progress: 100,
    documents: 15
  },
  { 
    id: '08', 
    name: '面向行业赋能的计算机视觉关键技术研究项目', 
    department: '研发部',
    progress: 100,
    documents: 16
  },
  { 
    id: '09', 
    name: '高可靠性氮化镓功率器件机理及其上新型工业电源架构的研究项目', 
    department: '研发部',
    progress: 100,
    documents: 18
  },
  { 
    id: '10', 
    name: '基于微纳技术的肿瘤精准诊疗技术研发与应用项目', 
    department: '医疗部',
    progress: 100,
    documents: 20
  },
  { 
    id: '11', 
    name: '香港中文大学（深圳）未来智联网络研究院项目', 
    department: '研发部',
    progress: 100,
    documents: 15
  },
  { 
    id: '12', 
    name: '基于机器学习的智能网联汽车感知、定位、仿真、协同决策核心算法及计算平台研究项目', 
    department: '研发部',
    progress: 100,
    documents: 22
  },
  { 
    id: '13', 
    name: '基于新靶点作用机理创新药关键技术及应用研究项目', 
    department: '医疗部',
    progress: 100,
    documents: 17
  },
  { 
    id: '14', 
    name: '高对比度超结构光栅面发射激光及光子集成芯片的基础研究项目', 
    department: '研发部',
    progress: 100,
    documents: 19
  },
  { 
    id: '15', 
    name: '香港应科院国际化基础研究与应用研究机构建设项目', 
    department: '研发部',
    progress: 100,
    documents: 16
  },
  { 
    id: '16', 
    name: '前沿科学与技术转化医学中心项目', 
    department: '医疗部',
    progress: 100,
    documents: 18
  },
  { 
    id: '17', 
    name: '深圳国际工业与应用数学中心国际化基础研究与应用研究机构建设项目', 
    department: '研发部',
    progress: 100,
    documents: 20
  },
  { 
    id: '18', 
    name: '高速率(112Gbs)光传输用VCSEL光芯片关键技术研发及应用项目', 
    department: '研发部',
    progress: 100,
    documents: 15
  }
];

// 初始AI消息
export const initialAIMessage = {
  id: 1, 
  sender: 'ai', 
  content: '您好！我是PMP.AI智能项目助手，可以帮您分析和管理研发项目、医疗项目等各类高科技项目。请问有什么可以帮助您的？', 
  timestamp: new Date().toISOString()
};

// 报告分析相关数据
export const analysisResults = {
  projectInfo: {
    name: "高时空解析度电子显微镜关键部件研究项目",
    manager: "待定",
    startDate: "未提供",
    endDate: "已完结",
    budget: "未提供",
    completion: 100
  },
  metrics: [
    { name: "进度完成率", value: 1.00, status: "success" },
    { name: "成本控制率", value: 1.00, status: "success" },
    { name: "质量达标率", value: 1.00, status: "success" },
    { name: "文档完整率", value: 1.00, status: "success" }
  ],
  milestones: [
    { name: "项目启动", date: "未提供", status: "completed" },
    { name: "研发阶段", date: "未提供", status: "completed" },
    { name: "测试验证", date: "未提供", status: "completed" },
    { name: "项目验收", date: "未提供", status: "completed" },
    { name: "项目结项", date: "已完结", status: "completed" }
  ],
  risks: [
    { id: "R001", description: "技术创新风险", probability: "已解决", impact: "无", response: "项目已完结" },
    { id: "R002", description: "研发进度风险", probability: "已解决", impact: "无", response: "项目已完结" },
    { id: "R003", description: "质量控制风险", probability: "已解决", impact: "无", response: "项目已完结" },
    { id: "R004", description: "成本控制风险", probability: "已解决", impact: "无", response: "项目已完结" }
  ],
  summary: [
    "项目已顺利完结",
    "各项指标均已达标",
    "文档资料完整归档",
    "可供后续项目参考借鉴"
  ]
};

// 项目类型分布数据
export const typeData = [
  { name: '研发项目', value: 12 },
  { name: '医疗项目', value: 6 },
  { name: '技术创新', value: 8 },
  { name: '基础研究', value: 4 }
];

// 资源分配数据
export const resourceData = [
  { name: '研发项目', 人力资源: 50, 资金投入: 120, 设备资源: 60 },
  { name: '医疗项目', 人力资源: 40, 资金投入: 100, 设备资源: 50 },
  { name: '技术创新', 人力资源: 30, 资金投入: 80, 设备资源: 40 },
  { name: '基础研究', 人力资源: 20, 资金投入: 60, 设备资源: 30 }
];

// 项目风险矩阵数据
export const riskMatrixData = [
  {
    id: "risk1",
    name: "技术创新不确定性",
    impact: 8,
    probability: 6,
    value: 300,
    category: "技术风险"
  },
  {
    id: "risk2",
    name: "研发人才流失",
    impact: 7,
    probability: 5,
    value: 250,
    category: "人员风险"
  },
  {
    id: "risk3",
    name: "实验结果不稳定",
    impact: 6,
    probability: 7,
    value: 280,
    category: "研发风险"
  },
  {
    id: "risk4",
    name: "设备故障",
    impact: 5,
    probability: 4,
    value: 200,
    category: "设备风险"
  }
];

// 统计卡片趋势数据
export const statCardTrends = {
  totalProjects: [
    { name: '1月', value: 18 },
    { name: '2月', value: 18 },
    { name: '3月', value: 18 },
    { name: '4月', value: 18 },
    { name: '5月', value: 18 },
    { name: '6月', value: 18 }
  ],
  completedProjects: [
    { name: '1月', value: 18 },
    { name: '2月', value: 18 },
    { name: '3月', value: 18 },
    { name: '4月', value: 18 },
    { name: '5月', value: 18 },
    { name: '6月', value: 18 }
  ],
  inProgressProjects: [
    { name: '1月', value: 0 },
    { name: '2月', value: 0 },
    { name: '3月', value: 0 },
    { name: '4月', value: 0 },
    { name: '5月', value: 0 },
    { name: '6月', value: 0 }
  ],
  riskProjects: [
    { name: '1月', value: 0 },
    { name: '2月', value: 0 },
    { name: '3月', value: 0 },
    { name: '4月', value: 0 },
    { name: '5月', value: 0 },
    { name: '6月', value: 0 }
  ]
};

// 定义AI洞察数据的类型
type Impact = 'high' | 'medium' | 'low';

interface InsightItem {
  id: string;
  title: string;
  description: string;
  impact: Impact;
  projectId: string;
  projectName: string;
  timestamp: string;
}

// AI洞察数据
export const aiInsightsData: InsightItem[] = [
  {
    id: 'insight-1',
    title: '项目完结总结',
    description: '所有项目已顺利完结，整体完成质量良好。',
    impact: 'high' as Impact,
    projectId: '01',
    projectName: '高时空解析度电子显微镜关键部件研究项目',
    timestamp: '2023-12-31T00:00:00Z',
  },
  {
    id: 'insight-2',
    title: '技术创新成果',
    description: '研发项目在技术创新方面取得显著成果。',
    impact: 'high' as Impact,
    projectId: '02',
    projectName: '先进航空材料预应力工程与纳米技术研发合作项目',
    timestamp: '2023-12-31T00:00:00Z',
  },
  {
    id: 'insight-3',
    title: '医疗项目进展',
    description: '医疗相关项目已全部完成，成果显著。',
    impact: 'high' as Impact,
    projectId: '03',
    projectName: '深港智慧医疗机器人开放创新平台项目',
    timestamp: '2023-12-31T00:00:00Z',
  }
];

// 活动数据
export const activitiesData = [
  {
    id: 'act-001',
    title: '项目完结',
    description: '高时空解析度电子显微镜关键部件研究项目已完结',
    timestamp: '2023-12-31T00:00:00Z',
    type: 'complete',
    priority: 'high',
    projectId: '01',
    projectName: '高时空解析度电子显微镜关键部件研究项目'
  },
  {
    id: 'act-002',
    title: '项目完结',
    description: '先进航空材料预应力工程项目已完结',
    timestamp: '2023-12-31T00:00:00Z',
    type: 'complete',
    priority: 'high',
    projectId: '02',
    projectName: '先进航空材料预应力工程与纳米技术研发合作项目'
  },
  {
    id: 'act-003',
    title: '项目完结',
    description: '深港智慧医疗机器人项目已完结',
    timestamp: '2023-12-31T00:00:00Z',
    type: 'complete',
    priority: 'high',
    projectId: '03',
    projectName: '深港智慧医疗机器人开放创新平台项目'
  }
];

// 模拟获取活动数据的函数
export const getMockActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return activitiesData;
};

// 模拟获取AI洞察数据的函数
export const getMockAIInsights = async (): Promise<InsightItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return aiInsightsData;
}; 