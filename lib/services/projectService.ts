import prisma from '@/lib/prisma';
import { ProjectInfo } from './documentProcessor';

// 扩展 ProjectInfo 接口添加额外字段
export interface ProjectCreateInput extends ProjectInfo {
  batch?: string;
  industry?: string;
  background?: string;
  progressStatus?: string;
  managementStatus?: string;
}

interface ProjectData {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  budget?: number;
  status: string;
  [key: string]: unknown;
}

export class ProjectService {
  private projects: Map<string, ProjectData> = new Map();

  /**
   * 创建新项目
   */
  async createProject(data: ProjectCreateInput) {
    try {
      console.log('创建项目，输入数据:', JSON.stringify(data, null, 2));

      // 处理日期格式
      const startDate = data.startDate ? new Date(data.startDate) : undefined;
      const endDate = data.endDate ? new Date(data.endDate) : undefined;
      
      // 确保项目名称存在
      const projectName = data.name || data.projectName || '未命名项目';
      console.log('使用项目名称:', projectName);
      
      // 处理客户端和组织
      const clientName = (data.client || data.mainDepartment || '').toString();
      const orgName = (data.organization || data.executeDepartment || '').toString();
      
      // 验证必要字段
      if (!projectName || projectName === '未命名项目') {
        console.warn('项目名称未提供或无效');
      }
      if (!orgName || orgName === '未提供') {
        console.warn('承担单位未提供或无效');
      }
      if (!data.projectManager || data.projectManager === '未提供') {
        console.warn('项目负责人未提供或无效');
      }
      
      // 创建项目记录
      const project = await prisma.project.create({
        data: {
          name: projectName,
          batch: data.batch,
          client: clientName,
          organization: orgName,
          industry: data.industry,
          startDate,
          endDate,
          description: data.description || '',
          background: data.background,
          projectManager: data.projectManager,
          projectLeader: data.projectLeader,
          governmentFunding: data.governmentFunding,
          selfFunding: data.selfFunding,
          location: data.location,
          progress: 0, // 初始进度为0
          progressStatus: data.progressStatus || '未开始',
          managementStatus: data.managementStatus || '正常',
        },
      });
      
      console.log('项目创建成功:', JSON.stringify(project, null, 2));
      
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
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          milestones: true,
        },
      });
      
      if (!project) {
        return null;
      }
      
      return project;
    } catch (error) {
      console.error('获取项目详情失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新项目信息
   */
  async updateProject(id: string, data: Partial<ProjectCreateInput>) {
    try {
      // 处理日期格式
      const startDate = data.startDate ? new Date(data.startDate) : undefined;
      const endDate = data.endDate ? new Date(data.endDate) : undefined;
      
      // 更新项目记录
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          name: data.name,
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
          progressStatus: data.progressStatus,
          managementStatus: data.managementStatus,
        },
      });
      
      // 创建活动记录
      await prisma.activity.create({
        data: {
          title: '项目更新',
          description: `项目 "${updatedProject.name}" 已更新`,
          type: 'update',
          priority: 'low',
          projectId: updatedProject.id,
        },
      });
      
      return updatedProject;
    } catch (error) {
      console.error('更新项目失败:', error);
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
        select: { name: true }
      });
      
      if (!project) {
        throw new Error('项目不存在');
      }
      
      // 创建活动记录（在删除项目前创建）
      await prisma.activity.create({
        data: {
          title: '项目删除',
          description: `项目 "${project.name}" 已删除`,
          type: 'delete',
          priority: 'high',
          projectId: id, // 添加projectId字段
        },
      });
      
      // 删除项目相关的里程碑
      await prisma.milestone.deleteMany({
        where: { projectId: id },
      });
      
      // 删除项目
      await prisma.project.delete({
        where: { id },
      });
      
      return { success: true };
    } catch (error) {
      console.error('删除项目失败:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService(); 