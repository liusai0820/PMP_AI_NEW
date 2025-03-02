// 项目趋势数据
export const projectData = [
  { name: '1月', 在建: 40, 已完成: 24, 延期: 5 },
  { name: '2月', 在建: 30, 已完成: 13, 延期: 3 },
  { name: '3月', 在建: 20, 已完成: 28, 延期: 2 },
  { name: '4月', 在建: 27, 已完成: 39, 延期: 0 },
  { name: '5月', 在建: 18, 已完成: 48, 延期: 1 },
  { name: '6月', 在建: 23, 已完成: 38, 延期: 4 },
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

// 模拟活动数据
export async function getMockActivities() {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      title: '创建了新项目',
      description: '项目管理系统升级',
      timestamp: '2023-10-15 14:30',
      type: 'create'
    },
    {
      id: '2',
      title: '更新了任务状态',
      description: '前端开发任务已完成',
      timestamp: '2023-10-14 10:15',
      type: 'update'
    },
    {
      id: '3',
      title: '添加了新成员',
      description: '张三加入了开发团队',
      timestamp: '2023-10-13 09:45',
      type: 'member'
    },
    {
      id: '4',
      title: '设置了项目截止日期',
      description: '项目计划于2023年12月完成',
      timestamp: '2023-10-12 16:20',
      type: 'deadline'
    }
  ];
}

// 其他模拟数据函数可以在这里添加 