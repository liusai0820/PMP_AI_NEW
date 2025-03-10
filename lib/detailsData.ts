import { projectList } from './mockData';
import type { StatCardDetail, HealthMetricDetail, RiskDetail, ResourceDetail, ProjectAnalysisDetail } from './types';

// 统计卡片详情数据
export const statCardDetails: Record<string, StatCardDetail> = {
  totalProjects: {
    category: '总项目数',
    projects: projectList.map(p => ({
      ...p,
      status: p.progress === 100 ? '已完成' : '进行中',
      updateTime: '2023-12-31T00:00:00Z'
    }))
  },
  completedProjects: {
    category: '已完成项目',
    projects: projectList
      .filter(p => p.progress === 100)
      .map(p => ({
        ...p,
        status: '已完成',
        updateTime: '2023-12-31T00:00:00Z'
      }))
  },
  inProgressProjects: {
    category: '进行中项目',
    projects: projectList
      .filter(p => p.progress < 100 && p.progress > 0)
      .map(p => ({
        ...p,
        status: '进行中',
        updateTime: '2023-12-31T00:00:00Z'
      }))
  },
  riskProjects: {
    category: '风险项目',
    projects: projectList
      .filter(p => p.progress < 60)
      .map(p => ({
        ...p,
        status: '风险',
        updateTime: '2023-12-31T00:00:00Z'
      }))
  }
};

// 项目健康度详情数据
export const healthMetricsDetails: Record<string, HealthMetricDetail> = {
  progress: {
    metric: '进度',
    score: 78,
    status: 'warning',
    details: [
      { name: '里程碑完成率', value: 85, weight: 0.4, impact: '重要' },
      { name: '任务完成率', value: 75, weight: 0.3, impact: '中等' },
      { name: '文档更新率', value: 70, weight: 0.3, impact: '中等' }
    ]
  },
  quality: {
    metric: '质量',
    score: 85,
    status: 'success',
    details: [
      { name: '代码质量', value: 90, weight: 0.4, impact: '重要' },
      { name: '测试覆盖率', value: 85, weight: 0.3, impact: '中等' },
      { name: '缺陷修复率', value: 80, weight: 0.3, impact: '中等' }
    ]
  },
  cost: {
    metric: '成本',
    score: 72,
    status: 'warning',
    details: [
      { name: '预算执行率', value: 75, weight: 0.4, impact: '重要' },
      { name: '资源利用率', value: 70, weight: 0.3, impact: '中等' },
      { name: '成本偏差率', value: 68, weight: 0.3, impact: '中等' }
    ]
  }
};

// 风险详情数据
export const riskDetails: Record<string, RiskDetail> = {
  "risk1": {
    id: "risk1",
    name: "技术创新不确定性",
    category: "技术风险",
    probability: 6,
    impact: 8,
    value: 300,
    mitigation: "增加技术预研和验证环节，建立技术备选方案",
    owner: "技术负责人",
    status: "监控中",
    updateTime: "2023-12-31T00:00:00Z",
    relatedProjects: [
      { id: "01", name: "高时空解析度电子显微镜关键部件研究项目" },
      { id: "07", name: "低功耗、高速、高可靠性VCSEL光芯片机理研究项目" }
    ]
  },
  "risk2": {
    id: "risk2",
    name: "研发人才流失",
    category: "人员风险",
    probability: 5,
    impact: 7,
    value: 250,
    mitigation: "优化人才激励机制，建立知识管理体系",
    owner: "人力资源负责人",
    status: "监控中",
    updateTime: "2023-12-31T00:00:00Z",
    relatedProjects: [
      { id: "02", name: "先进航空材料预应力工程与纳米技术研发合作项目" },
      { id: "08", name: "面向行业赋能的计算机视觉关键技术研究项目" }
    ]
  }
};

// 资源分配详情数据
export const resourceDetails: Record<string, ResourceDetail> = {
  humanResource: {
    category: '人力资源',
    total: 100,
    allocated: 85,
    available: 15,
    projects: projectList.map(p => ({
      id: p.id,
      name: p.name,
      allocation: Math.floor(Math.random() * 20) + 10, // 模拟分配10-30人
      startDate: "2023-01-01",
      endDate: "2023-12-31"
    }))
  },
  equipment: {
    category: '设备资源',
    total: 200,
    allocated: 160,
    available: 40,
    projects: projectList.map(p => ({
      id: p.id,
      name: p.name,
      allocation: Math.floor(Math.random() * 30) + 20, // 模拟分配20-50设备
      startDate: "2023-01-01",
      endDate: "2023-12-31"
    }))
  }
};

// 项目分析详情数据
export const projectAnalysisDetails: Record<string, ProjectAnalysisDetail> = {
  "2023-Q4": {
    timeframe: "2023年第四季度",
    metrics: [
      { name: "进度完成率", value: 95, target: 100, variance: -5 },
      { name: "预算执行率", value: 92, target: 100, variance: -8 },
      { name: "质量达标率", value: 98, target: 100, variance: -2 }
    ],
    trends: [
      { date: "2023-10", value: 85 },
      { date: "2023-11", value: 90 },
      { date: "2023-12", value: 95 }
    ],
    breakdown: [
      { category: "研发投入", value: 500000, percentage: 45 },
      { category: "设备采购", value: 300000, percentage: 27 },
      { category: "人员成本", value: 200000, percentage: 18 }
    ]
  }
}; 