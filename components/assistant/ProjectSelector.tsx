"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Project {
  id: string;
  name: string;
  department: string;
  progress: number;
  documents: number;
}

interface ProjectSelectorProps {
  onProjectSelect: (project: Project | null) => void;
  selectedProject: Project | null;
}

// 模拟项目数据
const mockProjects: Project[] = [
  { id: 'proj-001', name: '高时空解析度电子显微镜关键部分研究', department: '研发部', progress: 75, documents: 12 },
  { id: 'proj-002', name: '先进航空材料预应力工程与纳米技术研发', department: '研发部', progress: 60, documents: 8 },
  { id: 'proj-003', name: '深港智慧医疗机器人开放创新平台', department: '医疗部', progress: 90, documents: 15 },
  { id: 'proj-004', name: '大湾区生物医药研发创新中心', department: '医疗部', progress: 45, documents: 7 },
  { id: 'proj-005', name: '三相位法百万级像素飞行时间成像机理研究', department: '研发部', progress: 30, documents: 5 },
  { id: 'proj-006', name: '低功耗、高速、高可靠性VCSEL光芯片机理研究', department: '研发部', progress: 85, documents: 10 },
  { id: 'proj-007', name: '香港中文大学（深圳）未来智联网络研究院', department: '研发部', progress: 50, documents: 9 },
  { id: 'proj-008', name: '面向行业赋能的计算机视觉关键技术研究', department: '研发部', progress: 70, documents: 11 },
];

export default function ProjectSelector({ onProjectSelect, selectedProject }: ProjectSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // 模拟从API获取项目列表
  useEffect(() => {
    // 在实际应用中，这里应该是API调用
    setProjects(mockProjects);
  }, []);
  
  // 过滤项目
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索项目..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-1 pr-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <Button
                key={project.id}
                variant={selectedProject?.id === project.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => onProjectSelect(project)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="flex items-center w-full">
                    <span className="font-medium text-sm truncate flex-1">
                      {project.name}
                    </span>
                    {selectedProject?.id === project.id && (
                      <CheckCircle2 className="h-4 w-4 ml-2 text-primary flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="outline" className="text-xs font-normal">
                      {project.department}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      进度: {project.progress}%
                    </span>
                  </div>
                  
                  <div className="w-full mt-1">
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              未找到匹配的项目
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 