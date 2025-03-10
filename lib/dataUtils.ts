import { projectsWithProgress } from './realData';
import { projectList } from './mockData';

// 将真实项目数据转换为项目列表格式
export function getRealProjectList() {
  return projectsWithProgress.map(project => ({
    id: project.id,
    name: project.name,
    department: project.industry,
    progress: project.progress,
    documents: Math.floor(Math.random() * 10) + 10 // 模拟文档数量
  }));
}

// 获取项目列表数据（可以选择使用真实数据或模拟数据）
export function getProjectList(useRealData = true) {
  return useRealData ? getRealProjectList() : projectList;
}

// 获取最近项目数据
export function getRecentProjects(useRealData = true) {
  const projects = useRealData ? getRealProjectList() : projectList;
  return projects.slice(0, 4).map(p => ({
    id: p.id,
    name: p.name,
    progress: p.progress,
    status: p.progress === 100 ? '已完结' : '进行中',
    department: p.department,
    date: new Date().toISOString().split('T')[0]
  }));
}

// 获取最近活动数据
export function getRecentActivities(useRealData = true) {
  const projects = useRealData ? getRealProjectList() : projectList;
  return projects.slice(0, 4).map(p => ({
    type: p.progress === 100 ? '项目完结' : '项目更新',
    project: p.name,
    user: '系统',
    time: p.progress === 100 ? '已完结' : '进行中'
  }));
}

// 获取项目类型分布数据
export function getProjectTypes(useRealData = true) {
  if (!useRealData) {
    return [
      { name: '研发项目', value: 12 },
      { name: '医疗项目', value: 6 },
      { name: '技术创新', value: 8 },
      { name: '基础研究', value: 4 }
    ];
  }
  
  // 使用真实数据按产业领域分组
  const industryGroups: Record<string, number> = {};
  projectsWithProgress.forEach(project => {
    if (industryGroups[project.industry]) {
      industryGroups[project.industry]++;
    } else {
      industryGroups[project.industry] = 1;
    }
  });
  
  return Object.entries(industryGroups).map(([name, value]) => ({
    name,
    value
  }));
}

// 获取项目趋势数据
export function getProjectTrends(useRealData = true) {
  if (!useRealData) {
    return [
      { name: '1月', 在建: 10, 已完成: 5, 延期: 3, 趋势: 15 },
      { name: '2月', 在建: 12, 已完成: 6, 延期: 2, 趋势: 18 },
      { name: '3月', 在建: 15, 已完成: 7, 延期: 1, 趋势: 20 },
      { name: '4月', 在建: 16, 已完成: 8, 延期: 2, 趋势: 22 },
      { name: '5月', 在建: 17, 已完成: 9, 延期: 1, 趋势: 25 },
      { name: '6月', 在建: 18, 已完成: 10, 延期: 0, 趋势: 28 },
    ];
  }
  
  // 使用真实数据生成趋势
  // 这里简化处理，按月份统计项目状态
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  return months.map(name => {
    const inProgress = projectsWithProgress.filter(p => p.progress > 0 && p.progress < 100).length;
    const completed = projectsWithProgress.filter(p => p.progress === 100).length;
    const delayed = projectsWithProgress.filter(p => {
      const now = new Date();
      const endDate = new Date(p.endDate);
      return p.progress < 100 && endDate < now;
    }).length;
    
    return {
      name,
      在建: inProgress,
      已完成: completed,
      延期: delayed,
      趋势: inProgress + completed
    };
  });
} 