// 统计卡片下钻数据接口
export interface StatCardDetail {
  category: string;
  projects: Array<{
    id: string;
    name: string;
    department: string;
    progress: number;
    status: string;
    updateTime: string;
  }>;
}

// 项目健康度详情接口
export interface HealthMetricDetail {
  metric: string;
  score: number;
  status: 'success' | 'warning' | 'error';
  details: Array<{
    name: string;
    value: number;
    weight: number;
    impact: string;
  }>;
}

// 风险详情接口
export interface RiskDetail {
  id: string;
  name: string;
  category: string;
  probability: number;
  impact: number;
  value: number;
  mitigation: string;
  owner: string;
  status: string;
  updateTime: string;
  relatedProjects: Array<{
    id: string;
    name: string;
  }>;
}

// 资源分配详情接口
export interface ResourceDetail {
  category: string;
  total: number;
  allocated: number;
  available: number;
  projects: Array<{
    id: string;
    name: string;
    allocation: number;
    startDate: string;
    endDate: string;
  }>;
}

// 项目分析详情接口
export interface ProjectAnalysisDetail {
  timeframe: string;
  metrics: Array<{
    name: string;
    value: number;
    target: number;
    variance: number;
  }>;
  trends: Array<{
    date: string;
    value: number;
  }>;
  breakdown: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;
}

// AI洞察数据类型
export type Impact = 'high' | 'medium' | 'low';

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  impact: Impact;
  projectId: string;
  projectName: string;
  timestamp: string;
} 