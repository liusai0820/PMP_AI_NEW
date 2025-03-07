import prisma from '@/lib/prisma';
import { ProjectInfo } from './documentProcessor';

export interface ProjectCreateInput extends ProjectInfo {
  // 可以添加额外的字段
}

export class ProjectService {
  /**
   * 创建新项目
   */
  async createProject(data: ProjectCreateInput) {
    try {
      // 处理日期格式
      const startDate = data.startDate ? new Date(data.startDate) : undefined;
      const endDate = data.endDate ? new Date(data.endDate) : undefined;
      
      // 创建项目记录
      const project = await prisma.project.create({
        data: {
          name: data.name || '未命名项目',
          batch: data.batch,
          client: data.client,
          organization: data.organization,
          industry: data.industry,
          startDate,
          endDate,
          description: data.description,
          background: data.background,
          projectManager: data.projectManager,
          projectLeader: data.projectLeader,
          governmentFunding: data.governmentFunding,
          selfFunding: data.selfFunding,
          location: data.location,
          progress: 0, // 初始进度为0
          progressStatus: '未开始',
          managementStatus: '正常',
        },
      });
      
      // 创建活动记录
      await prisma.activity.create({
        data: {
          title: '项目创建',
          description: `项目 "${project.name}" 已创建`,
          type: 'create',
          priority: 'medium',
          projectId: project.id,
        },
      });
      
      return project;
    } catch (error) {
      console.error('创建项目失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取所有项目
   */
  async getAllProjects() {
    try {
      return await prisma.project.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('获取项目列表失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取单个项目详情
   */
  async getProjectById(id: string) {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: {
          milestones: true,
          documents: true,
        },
      });
    } catch (error) {
      console.error(`获取项目(ID: ${id})失败:`, error);
      throw error;
    }
  }
  
  /**
   * 更新项目信息
   */
  async updateProject(id: string, data: Partial<ProjectCreateInput>) {
    try {
      // 处理日期格式
      const updateData: any = { ...data };
      if (data.startDate) updateData.startDate = new Date(data.startDate);
      if (data.endDate) updateData.endDate = new Date(data.endDate);
      
      // 更新项目
      const project = await prisma.project.update({
        where: { id },
        data: updateData,
      });
      
      // 创建活动记录
      await prisma.activity.create({
        data: {
          title: '项目更新',
          description: `项目 "${project.name}" 信息已更新`,
          type: 'update',
          priority: 'low',
          projectId: project.id,
        },
      });
      
      return project;
    } catch (error) {
      console.error(`更新项目(ID: ${id})失败:`, error);
      throw error;
    }
  }
  
  /**
   * 删除项目
   */
  async deleteProject(id: string) {
    try {
      // 获取项目名称用于活动记录
      const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true },
      });
      
      if (!project) {
        throw new Error(`项目不存在(ID: ${id})`);
      }
      
      // 删除项目（级联删除相关记录）
      await prisma.project.delete({
        where: { id },
      });
      
      return { success: true, message: `项目 "${project.name}" 已删除` };
    } catch (error) {
      console.error(`删除项目(ID: ${id})失败:`, error);
      throw error;
    }
  }
}

export const projectService = new ProjectService(); 