// 项目趋势数据
export const projectData = [
  { name: '1月', 在建: 40, 已完成: 24, 延期: 10, 趋势: 65 },
  { name: '2月', 在建: 30, 已完成: 28, 延期: 8, 趋势: 59 },
  { name: '3月', 在建: 20, 已完成: 38, 延期: 5, 趋势: 48 },
  { name: '4月', 在建: 27, 已完成: 40, 延期: 7, 趋势: 42 },
  { name: '5月', 在建: 18, 已完成: 48, 延期: 6, 趋势: 38 },
  { name: '6月', 在建: 23, 已完成: 50, 延期: 4, 趋势: 43 },
];

// 项目类型分布数据
export const projectTypes = [
  { name: '科技创新', value: 400 },
  { name: '基础设施', value: 300 },
  { name: '产业升级', value: 200 },
  { name: '环境保护', value: 100 },
];

// 最近项目数据
export const recentProjects = [
  { id: 'P2023001', name: '城市智能交通系统升级', progress: 75, status: '在建', department: '交通局', date: '2023-03-15' },
  { id: 'P2023042', name: '医疗大数据分析平台', progress: 90, status: '在建', department: '卫健委', date: '2023-05-21' },
  { id: 'P2023013', name: '智慧园区建设工程', progress: 60, status: '在建', department: '科技局', date: '2023-02-10' },
  { id: 'P2023057', name: '农业物联网示范基地', progress: 95, status: '即将完成', department: '农业局', date: '2023-04-18' },
];

// 最近活动数据
export const recentActivities = [
  { type: '上传报告', project: '医疗大数据分析平台', user: '张明', time: '10分钟前' },
  { type: '提问解答', project: '智慧园区建设工程', user: '李华', time: '30分钟前' },
  { type: '专家推荐', project: '城市智能交通系统升级', user: '系统', time: '1小时前' },
  { type: '生成报告', project: '农业物联网示范基地', user: '王强', time: '2小时前' },
];

// 图表颜色
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// AI助手建议问题
export const initialSuggestions = [
  '风险管理的最佳实践是什么？',
  '如何处理项目进度延期问题？',
  '一般项目验收的关键指标有哪些？',
  '智慧城市项目的常见挑战',
  '项目中常见的质量问题及解决方案'
];

// 项目列表数据
export const projectList = [
  { 
    id: 'P2023001', 
    name: '城市智能交通系统升级', 
    department: '交通局',
    progress: 75,
    documents: 12
  },
  { 
    id: 'P2023042', 
    name: '医疗大数据分析平台', 
    department: '卫健委',
    progress: 90,
    documents: 18
  },
  { 
    id: 'P2023013', 
    name: '智慧园区建设工程', 
    department: '科技局',
    progress: 60,
    documents: 9
  },
  { 
    id: 'P2023057', 
    name: '农业物联网示范基地', 
    department: '农业局',
    progress: 95,
    documents: 15
  }
];

// 初始AI消息
export const initialAIMessage = {
  id: 1, 
  sender: 'ai', 
  content: '您好！我是PMP.AI智能项目助手，可以帮您回答关于项目的各类问题，提供专业知识支持。请问有什么可以帮助您的？', 
  timestamp: new Date().toISOString()
};

// 报告分析相关数据
export const analysisResults = {
  projectInfo: {
    name: "智慧城市交通管理系统",
    manager: "张明",
    startDate: "2023-01-15",
    endDate: "2023-12-31",
    budget: "¥2,500,000",
    completion: 68
  },
  metrics: [
    { name: "进度表现指数", value: 0.92, status: "warning" },
    { name: "成本表现指数", value: 1.05, status: "success" },
    { name: "范围完成率", value: 0.75, status: "normal" },
    { name: "质量合格率", value: 0.98, status: "success" }
  ],
  milestones: [
    { name: "需求分析", date: "2023-02-28", status: "completed" },
    { name: "系统设计", date: "2023-04-30", status: "completed" },
    { name: "开发阶段", date: "2023-09-30", status: "in-progress" },
    { name: "测试验收", date: "2023-11-30", status: "pending" },
    { name: "系统上线", date: "2023-12-31", status: "pending" }
  ],
  risks: [
    { id: "R001", description: "关键技术人员流失", probability: "中", impact: "高", response: "建立知识共享机制，提前培训备用人员" },
    { id: "R002", description: "第三方接口变更", probability: "高", impact: "中", response: "设计适配层，减少直接依赖" },
    { id: "R003", description: "用户需求变更频繁", probability: "高", impact: "高", response: "采用敏捷开发方法，增加用户参与度" },
    { id: "R004", description: "系统性能不达标", probability: "低", impact: "高", response: "提前进行性能测试，预留优化时间" }
  ],
  summary: [
    "项目总体进展符合预期，但存在一定进度风险",
    "成本控制良好，预算使用合理",
    "主要风险点在于用户需求变更和第三方接口稳定性",
    "建议加强与用户的沟通，提前进行系统性能测试"
  ]
};

// 模拟数据

// 项目类型分布数据
export const typeData = [
  { name: '基础设施', value: 35 },
  { name: '软件开发', value: 45 },
  { name: '研发项目', value: 25 },
  { name: '市场推广', value: 15 },
  { name: '内部改进', value: 20 },
];

// 资源分配数据
export const resourceData = [
  { name: '基础设施', 人力资源: 30, 资金投入: 120, 设备资源: 45 },
  { name: '软件开发', 人力资源: 50, 资金投入: 80, 设备资源: 20 },
  { name: '研发项目', 人力资源: 35, 资金投入: 100, 设备资源: 30 },
  { name: '市场推广', 人力资源: 20, 资金投入: 60, 设备资源: 10 },
  { name: '内部改进', 人力资源: 25, 资金投入: 40, 设备资源: 15 },
];

// 项目风险矩阵数据
export const riskMatrixData = [
  {
    id: "risk1",
    name: "技术方案不成熟",
    impact: 8,
    probability: 6,
    value: 300,
    category: "技术风险"
  },
  {
    id: "risk2",
    name: "关键人员流失",
    impact: 9,
    probability: 4,
    value: 250,
    category: "人员风险"
  },
  {
    id: "risk3",
    name: "需求频繁变更",
    impact: 7,
    probability: 8,
    value: 280,
    category: "需求风险"
  },
  {
    id: "risk4",
    name: "预算超支",
    impact: 6,
    probability: 5,
    value: 200,
    category: "财务风险"
  },
  {
    id: "risk5",
    name: "第三方依赖延期",
    impact: 7,
    probability: 7,
    value: 240,
    category: "外部风险"
  },
  {
    id: "risk6",
    name: "质量标准未达成",
    impact: 8,
    probability: 5,
    value: 220,
    category: "质量风险"
  },
  {
    id: "risk7",
    name: "沟通不畅",
    impact: 5,
    probability: 6,
    value: 180,
    category: "管理风险"
  },
  {
    id: "risk8",
    name: "进度延迟",
    impact: 7,
    probability: 6,
    value: 210,
    category: "进度风险"
  },
  {
    id: "risk9",
    name: "范围蔓延",
    impact: 6,
    probability: 7,
    value: 230,
    category: "范围风险"
  },
  {
    id: "risk10",
    name: "合规问题",
    impact: 9,
    probability: 3,
    value: 190,
    category: "法律风险"
  }
];

// 统计卡片趋势数据
export const statCardTrends = {
  totalProjects: [
    { name: '1月', value: 150 },
    { name: '2月', value: 155 },
    { name: '3月', value: 160 },
    { name: '4月', value: 165 },
    { name: '5月', value: 170 },
    { name: '6月', value: 183 }
  ],
  completedProjects: [
    { name: '1月', value: 110 },
    { name: '2月', value: 115 },
    { name: '3月', value: 120 },
    { name: '4月', value: 125 },
    { name: '5月', value: 130 },
    { name: '6月', value: 137 }
  ],
  inProgressProjects: [
    { name: '1月', value: 40 },
    { name: '2月', value: 42 },
    { name: '3月', value: 45 },
    { name: '4月', value: 43 },
    { name: '5月', value: 40 },
    { name: '6月', value: 38 }
  ],
  riskProjects: [
    { name: '1月', value: 5 },
    { name: '2月', value: 6 },
    { name: '3月', value: 7 },
    { name: '4月', value: 6 },
    { name: '5月', value: 7 },
    { name: '6月', value: 8 }
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
    title: '项目进度延迟风险',
    description: '智慧城市项目的关键里程碑已延迟2周，可能影响整体交付时间。',
    impact: 'high',
    projectId: 'proj-001',
    projectName: '智慧城市基础设施建设',
    timestamp: '2023-06-15T09:30:00Z',
  },
  {
    id: 'insight-2',
    title: '资源分配不均',
    description: '研发团队资源过度集中在单个项目，可能导致其他项目进度受阻。',
    impact: 'medium',
    projectId: 'proj-003',
    projectName: '企业数据中台建设',
    timestamp: '2023-06-14T14:45:00Z',
  },
  {
    id: 'insight-3',
    title: '预算超支预警',
    description: '移动应用开发项目已使用75%预算，但仅完成60%工作量，存在超支风险。',
    impact: 'medium',
    projectId: 'proj-007',
    projectName: '移动应用开发与升级',
    timestamp: '2023-06-13T11:20:00Z',
  },
  {
    id: 'insight-4',
    title: '质量指标异常',
    description: '最近代码提交的测试覆盖率下降15%，建议增加单元测试。',
    impact: 'low',
    projectId: 'proj-005',
    projectName: '客户关系管理系统升级',
    timestamp: '2023-06-12T16:10:00Z',
  },
];

// 活动数据
export const activitiesData = [
  {
    id: 'act-001',
    title: '创建了新项目',
    description: '张经理创建了新项目"智能客服系统开发"',
    timestamp: '2023-06-15T10:30:00Z',
    type: 'create',
    priority: 'medium',
    projectId: 'proj-009',
    projectName: '智能客服系统开发',
  },
  {
    id: 'act-002',
    title: '更新了项目进度',
    description: '李工程师将"数据中台建设"项目进度更新为75%',
    timestamp: '2023-06-15T09:15:00Z',
    type: 'update',
    priority: 'low',
    projectId: 'proj-003',
    projectName: '企业数据中台建设',
  },
  {
    id: 'act-003',
    title: '分配了新任务',
    description: '王项目经理向赵开发分配了"前端界面优化"任务',
    timestamp: '2023-06-14T16:45:00Z',
    type: 'assign',
    priority: 'high',
    projectId: 'proj-007',
    projectName: '移动应用开发与升级',
  },
  {
    id: 'act-004',
    title: '完成了里程碑',
    description: '团队完成了"基础架构搭建"里程碑',
    timestamp: '2023-06-14T14:20:00Z',
    type: 'complete',
    priority: 'medium',
    projectId: 'proj-005',
    projectName: '客户关系管理系统升级',
  },
  {
    id: 'act-005',
    title: '添加了评论',
    description: '张经理对"接口文档"添加了评论',
    timestamp: '2023-06-13T11:30:00Z',
    type: 'comment',
    priority: 'low',
    projectId: 'proj-007',
    projectName: '移动应用开发与升级',
  },
  {
    id: 'act-006',
    title: '更新了风险状态',
    description: '系统自动将"服务器迁移延迟"风险级别提升为高',
    timestamp: '2023-06-12T09:10:00Z',
    type: 'update',
    priority: 'high',
    projectId: 'proj-001',
    projectName: '智慧城市基础设施建设',
  },
];

// 模拟获取活动数据的函数
export const getMockActivities = async () => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  return activitiesData;
};

// 模拟获取AI洞察数据的函数
export const getMockAIInsights = async (): Promise<InsightItem[]> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  return aiInsightsData;
}; 