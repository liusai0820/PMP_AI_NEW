"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import FloatingAssistant from '@/components/FloatingAssistant';

// 定义项目和风险警报的类型
interface Project {
  id: string;
  name: string;
  progress: number;
  status: string;
  department?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  projectManager?: string;
  projectLeader?: string;
  managementStatus?: string;
  progressStatus?: string;
}

interface RiskAlert {
  id: string;
  project: string;
  type: string;
  severity: string;
  date: string;
}

// 定义API返回的项目数据类型
interface ProjectData {
  id: string;
  name: string;
  progress?: number;
  progressStatus?: string;
  organization?: string;
  managementStatus?: string;
  [key: string]: string | number | boolean | undefined;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    riskProjects: number;
    progressHealth: number;
    qualityHealth: number;
    costHealth: number;
    completionRate: number;
    recentProjects: Project[];
    riskAlerts: RiskAlert[];
    projectsGrowth: number;
    completedGrowth: number;
    inProgressGrowth: number;
    riskGrowth: number;
    progressScore: number;
    qualityScore: number;
    costScore: number;
    teamScore: number;
    projectTypes: { name: string; value: number }[];
    progressTrend: { name: string; 计划进度: number; 实际进度: number }[];
  }>({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    riskProjects: 0,
    progressHealth: 78, // 默认健康度值
    qualityHealth: 85,
    costHealth: 72,
    completionRate: 0,
    recentProjects: [],
    riskAlerts: [],
    projectsGrowth: 0,
    completedGrowth: 0,
    inProgressGrowth: 0,
    riskGrowth: 0,
    progressScore: 78,
    qualityScore: 85,
    costScore: 72,
    teamScore: 80,
    projectTypes: [],
    progressTrend: []
  });

  // 从API获取真实数据
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        // API返回的是数组而不是包含success字段的对象
        const projects: ProjectData[] = Array.isArray(data) ? data : [];
        
        const completedProjects = projects.filter(p => p.progressStatus === '完成' || p.managementStatus === '已完结');
        const inProgressProjects = projects.filter(p => p.progressStatus === '进行中' || p.managementStatus === '进行中');
        const riskProjects = projects.filter(p => p.progressStatus === '延期' || p.managementStatus === '风险');
        
        // 模拟风险警报数据
        const riskAlerts: RiskAlert[] = riskProjects.map(p => ({
          id: p.id,
          project: p.name,
          type: '进度延迟',
          severity: 'high',
          date: new Date().toISOString().split('T')[0]
        }));
        
        // 计算完成率
        const completionRate = projects.length > 0 
          ? Math.round((completedProjects.length / projects.length) * 100) 
          : 0;
        
        setStats({
          totalProjects: projects.length,
          completedProjects: completedProjects.length,
          inProgressProjects: inProgressProjects.length,
          riskProjects: riskProjects.length,
          progressHealth: 78,
          qualityHealth: 85,
          costHealth: 72,
          completionRate: completionRate,
          recentProjects: inProgressProjects.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            progress: typeof p.progress === 'number' ? p.progress : 0,
            status: p.managementStatus || '正常',
            department: p.organization || '未分配'
          })),
          riskAlerts: riskAlerts.slice(0, 3),
          projectsGrowth: 5,
          completedGrowth: 8,
          inProgressGrowth: -3,
          riskGrowth: 0,
          progressScore: 78,
          qualityScore: 85,
          costScore: 72,
          teamScore: 80,
          projectTypes: [
            { name: '已完成', value: completedProjects.length },
            { name: '进行中', value: inProgressProjects.length },
            { name: '风险', value: riskProjects.length },
            { name: '未开始', value: projects.length - completedProjects.length - inProgressProjects.length - riskProjects.length }
          ],
          progressTrend: [
            { name: '1月', '计划进度': 30, '实际进度': 28 },
            { name: '2月', '计划进度': 45, '实际进度': 40 },
            { name: '3月', '计划进度': 60, '实际进度': 55 },
            { name: '4月', '计划进度': 75, '实际进度': 68 },
            { name: '5月', '计划进度': 90, '实际进度': 82 }
          ]
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">项目管理仪表盘</h2>
          <p className="text-muted-foreground">
            项目状态概览和关键指标
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/reports')}>
            生成报告
          </Button>
          <Button onClick={() => router.push('/projects/create')}>
            创建新项目
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总项目数</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.projectsGrowth > 0 ? '+' : ''}{stats.projectsGrowth}% 较上月
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成项目</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedGrowth > 0 ? '+' : ''}{stats.completedGrowth}% 较上月
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中项目</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inProgressGrowth > 0 ? '+' : ''}{stats.inProgressGrowth}% 较上月
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">风险项目</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.riskProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.riskGrowth > 0 ? '+' : ''}{stats.riskGrowth}% 较上月
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>项目完成率</CardTitle>
            <CardDescription>总体项目完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* 背景圆环 */}
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    {/* 进度圆环 */}
                    <circle
                      className="text-blue-600"
                      strokeWidth="10"
                      strokeDasharray={`${stats.completionRate * 2.51} 251.2`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold">{stats.completionRate}%</span>
                      <span className="block text-sm text-gray-500">完成率</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">已完成</div>
                  <div className="text-sm font-medium">{stats.completedProjects} 个项目</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">总项目</div>
                  <div className="text-sm font-medium">{stats.totalProjects} 个项目</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>项目绩效指标</CardTitle>
            <CardDescription>关键绩效指标分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 进度指标 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">进度达成率</span>
                  </div>
                  <span className={`text-sm font-medium ${stats.progressScore >= 80 ? 'text-green-600' : stats.progressScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.progressScore}%
                  </span>
                </div>
                <Progress value={stats.progressScore} className="h-2" />
                <p className="text-xs text-gray-500">
                  {stats.progressScore >= 80 ? '进度良好，按计划推进' : 
                   stats.progressScore >= 60 ? '进度略有延迟，需要关注' : 
                   '进度严重滞后，需要干预'}
                </p>
              </div>

              {/* 质量指标 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">质量达标率</span>
                  </div>
                  <span className={`text-sm font-medium ${stats.qualityScore >= 80 ? 'text-green-600' : stats.qualityScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.qualityScore}%
                  </span>
                </div>
                <Progress value={stats.qualityScore} className="h-2" />
                <p className="text-xs text-gray-500">
                  {stats.qualityScore >= 80 ? '质量表现优秀，符合预期' : 
                   stats.qualityScore >= 60 ? '质量尚可，有改进空间' : 
                   '质量问题较多，需要重点关注'}
                </p>
              </div>

              {/* 成本指标 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium">成本控制率</span>
                  </div>
                  <span className={`text-sm font-medium ${stats.costScore >= 80 ? 'text-green-600' : stats.costScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.costScore}%
                  </span>
                </div>
                <Progress value={stats.costScore} className="h-2" />
                <p className="text-xs text-gray-500">
                  {stats.costScore >= 80 ? '成本控制良好，在预算范围内' : 
                   stats.costScore >= 60 ? '成本略有超支，需要优化' : 
                   '成本严重超支，需要立即干预'}
                </p>
              </div>

              {/* 团队协作指标 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium">团队协作效率</span>
                  </div>
                  <span className={`text-sm font-medium ${stats.teamScore >= 80 ? 'text-green-600' : stats.teamScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.teamScore}%
                  </span>
                </div>
                <Progress value={stats.teamScore} className="h-2" />
                <p className="text-xs text-gray-500">
                  {stats.teamScore >= 80 ? '团队协作顺畅，沟通高效' : 
                   stats.teamScore >= 60 ? '团队协作一般，有待改进' : 
                   '团队协作不佳，需要加强沟通'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>项目类型分布</CardTitle>
            <CardDescription>按项目类型统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.projectTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.projectTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 个项目`, '数量']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>风险预警</CardTitle>
            <CardDescription>需要关注的项目风险</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.riskAlerts.length > 0 ? (
              <div className="space-y-4">
                {stats.riskAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                    <div className={`mt-0.5 rounded-full p-1 ${
                      alert.severity === 'high' ? 'bg-red-100' : 
                      alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <svg 
                        className={`h-4 w-4 ${
                          alert.severity === 'high' ? 'text-red-600' : 
                          alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                        }`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {alert.project}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {alert.type} - {alert.severity}风险
                      </p>
                      <p className="text-xs text-gray-500">
                        {alert.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      查看
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">
                    暂无风险预警
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card
          className="lg:col-span-4"
        >
          <CardHeader>
            <CardTitle>进行中项目</CardTitle>
            <CardDescription>当前活跃项目状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">项目名称</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">部门</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">进度</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProjects.length > 0 ? (
                    stats.recentProjects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                        <td className="py-3 px-2">{project.name}</td>
                        <td className="py-3 px-2 text-gray-600">{project.department || '未分配'}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  project.progress >= 75 ? 'bg-green-500' : 
                                  project.progress >= 40 ? 'bg-amber-500' : 
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            project.status === '正常' ? 'bg-green-100 text-green-800' : 
                            project.status === '警告' ? 'bg-yellow-100 text-yellow-800' : 
                            project.status === '风险' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                        暂无进行中的项目
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>项目进度趋势</CardTitle>
            <CardDescription>近期项目进度变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.progressTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="计划进度" fill="#8884d8" />
                  <Bar dataKey="实际进度" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 浮动助手 */}
      <FloatingAssistant />
    </div>
  );
} 