import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { StatCardDetail, HealthMetricDetail, RiskDetail, ResourceDetail, ProjectAnalysisDetail } from '@/lib/types';

interface DetailContentProps {
  type: 'statCard' | 'health' | 'risk' | 'resource' | 'analysis';
  data: StatCardDetail | HealthMetricDetail | RiskDetail | ResourceDetail | ProjectAnalysisDetail;
}

export function DetailContent({ type, data }: DetailContentProps) {
  const renderStatCardDetail = (data: StatCardDetail) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{data.category}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>项目编号</TableHead>
            <TableHead>项目名称</TableHead>
            <TableHead>所属部门</TableHead>
            <TableHead>进度</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.id}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.department}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="w-[100px]" />
                  <span>{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={project.status === '已完成' ? 'success' : 'warning'}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(project.updateTime).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderHealthDetail = (data: HealthMetricDetail) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{data.metric}</h3>
        <Badge variant={data.status as 'success' | 'warning' | 'error'}>
          {data.score}分
        </Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>指标名称</TableHead>
            <TableHead>得分</TableHead>
            <TableHead>权重</TableHead>
            <TableHead>影响程度</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.name}</TableCell>
              <TableCell>{detail.value}</TableCell>
              <TableCell>{detail.weight * 100}%</TableCell>
              <TableCell>{detail.impact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderRiskDetail = (data: RiskDetail) => (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.category}</p>
          </div>
          <div className="text-right">
            <Badge variant="warning">风险值: {data.value}</Badge>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">可能性</p>
            <p>{data.probability}</p>
          </div>
          <div>
            <p className="text-sm font-medium">影响程度</p>
            <p>{data.impact}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">缓解措施</p>
          <p className="mt-1">{data.mitigation}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">相关项目</p>
          <div className="mt-2 space-y-2">
            {data.relatedProjects.map(project => (
              <div key={project.id} className="flex items-center gap-2">
                <Badge variant="outline">{project.id}</Badge>
                <span>{project.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderResourceDetail = (data: ResourceDetail) => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium">总量</h4>
          <p className="mt-2 text-2xl font-bold">{data.total}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium">已分配</h4>
          <p className="mt-2 text-2xl font-bold">{data.allocated}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium">可用</h4>
          <p className="mt-2 text-2xl font-bold">{data.available}</p>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>项目编号</TableHead>
            <TableHead>项目名称</TableHead>
            <TableHead>分配量</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.id}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.allocation}</TableCell>
              <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderAnalysisDetail = (data: ProjectAnalysisDetail) => (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">{data.timeframe}</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {data.metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm font-medium">{metric.name}</p>
              <div className="flex items-center gap-2">
                <Progress value={(metric.value / metric.target) * 100} className="flex-1" />
                <span className="text-sm">{metric.value}%</span>
              </div>
              <p className="text-sm text-gray-500">
                目标: {metric.target}% | 差异: {metric.variance}%
              </p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium">趋势分析</h4>
          <div className="mt-4">
            {data.trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span>{trend.date}</span>
                <span>{trend.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium">成本分布</h4>
          <div className="mt-4">
            {data.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span>{item.category}</span>
                <div className="text-right">
                  <p>￥{item.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  switch (type) {
    case 'statCard':
      return renderStatCardDetail(data as StatCardDetail);
    case 'health':
      return renderHealthDetail(data as HealthMetricDetail);
    case 'risk':
      return renderRiskDetail(data as RiskDetail);
    case 'resource':
      return renderResourceDetail(data as ResourceDetail);
    case 'analysis':
      return renderAnalysisDetail(data as ProjectAnalysisDetail);
    default:
      return null;
  }
} 