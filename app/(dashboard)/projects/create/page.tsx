"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCreator from '@/components/projects/ProjectCreator';
import { ProjectInfo } from '@/types/project';
import { toast } from '@/components/ui/use-toast';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleProjectCreate = async (projectInfo: ProjectInfo) => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      
      // 发送项目数据到API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectInfo),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建项目失败');
      }
      
      console.log('项目创建成功:', data);
      
      // 显示成功提示
      toast({
        title: "项目创建成功",
        description: `项目 "${projectInfo.name || '未命名项目'}" 已创建`,
      });

      // 等待一段时间后跳转到项目详情页
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.id) {
        // 跳转到项目详情页
        router.push(`/projects/${data.id}`);
      } else {
        console.error('创建的项目缺少ID:', data);
        toast({
          title: "警告",
          description: "项目已创建，但无法获取项目ID，请刷新页面。",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('创建项目失败:', error);
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : '创建项目失败，请重试',
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ProjectCreator 
        onProjectCreate={handleProjectCreate}
        disabled={isCreating}
      />
    </div>
  );
} 