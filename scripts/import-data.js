import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// 字段映射
const PROJECT_FIELDS = {
  name: '项目名称',
  batch: '委托批次',
  client: '委托单位',
  organization: '项目单位',
  industry: '产业领域',
  startDate: '建设开始日期',
  endDate: '建设结束日期',
  description: '项目简介',
  background: '项目背景',
  projectManager: '项目经理',
  projectLeader: '项目负责人',
  governmentFunding: '政府资助（万元）',
  selfFunding: '自筹资金（万元）',
  location: '建设地址',
  managementStatus: '管理状态',
  progressStatus: '进展状态'
};

const MILESTONE_FIELDS = {
  projectName: '项目名称',
  name: '里程碑名称',
  startDate: '节点开始日期',
  endDate: '节点结束日期',
  evaluationDate: '考核日期',
  actualEvaluationDate: '实际发起考核日期'
};

// 解析CSV文件
function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

// 将日期字符串转换为Date对象
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // 处理带时间的日期格式 (2023/1/10 0:00:00)
  if (dateStr.includes(':')) {
    const [datePart] = dateStr.split(' ');
    const [year, month, day] = datePart.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // 处理纯日期格式 (2023/1/10)
  const [year, month, day] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// 计算项目进度
function calculateProgress(project, milestones) {
  const projectMilestones = milestones.filter(
    m => m[MILESTONE_FIELDS.projectName] === project[PROJECT_FIELDS.name]
  );
  
  if (projectMilestones.length === 0) return 0;
  
  const completedMilestones = projectMilestones.filter(
    m => m[MILESTONE_FIELDS.actualEvaluationDate] && 
         m[MILESTONE_FIELDS.actualEvaluationDate].trim() !== ''
  ).length;
  
  return Math.round((completedMilestones / projectMilestones.length) * 100);
}

// 确定项目状态
function determineProjectStatus(project, progress) {
  const now = new Date();
  const endDate = parseDate(project[PROJECT_FIELDS.endDate]);
  
  if (progress === 100) return '完成';
  if (!endDate) return '进行中';
  
  // 如果结束日期已过但进度未完成
  if (endDate < now && progress < 100) return '延期';
  
  return '进行中';
}

// 导入数据
async function importData() {
  try {
    // 解析CSV文件
    const projectsData = parseCSV(path.join(__dirname, '../basicinfomation.csv'));
    const milestonesData = parseCSV(path.join(__dirname, '../milestonesData.csv'));
    
    console.log(`读取到 ${projectsData.length} 个项目和 ${milestonesData.length} 个里程碑`);
    
    // 清空现有数据
    await prisma.activity.deleteMany({});
    await prisma.milestone.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.project.deleteMany({});
    
    console.log('已清空现有数据');
    
    // 导入项目数据
    for (const projectRow of projectsData) {
      const progress = calculateProgress(projectRow, milestonesData);
      const progressStatus = determineProjectStatus(projectRow, progress);
      
      const project = await prisma.project.create({
        data: {
          name: projectRow[PROJECT_FIELDS.name],
          batch: projectRow[PROJECT_FIELDS.batch],
          client: projectRow[PROJECT_FIELDS.client],
          organization: projectRow[PROJECT_FIELDS.organization],
          industry: projectRow[PROJECT_FIELDS.industry],
          startDate: parseDate(projectRow[PROJECT_FIELDS.startDate]),
          endDate: parseDate(projectRow[PROJECT_FIELDS.endDate]),
          description: projectRow[PROJECT_FIELDS.description],
          background: projectRow[PROJECT_FIELDS.background],
          projectManager: projectRow[PROJECT_FIELDS.projectManager],
          projectLeader: projectRow[PROJECT_FIELDS.projectLeader],
          governmentFunding: projectRow[PROJECT_FIELDS.governmentFunding]
            ? parseFloat(projectRow[PROJECT_FIELDS.governmentFunding])
            : null,
          selfFunding: projectRow[PROJECT_FIELDS.selfFunding]
            ? parseFloat(projectRow[PROJECT_FIELDS.selfFunding])
            : null,
          location: projectRow[PROJECT_FIELDS.location],
          progress: progress,
          progressStatus: progressStatus,
          managementStatus: projectRow[PROJECT_FIELDS.managementStatus] || '正常',
        },
      });
      
      console.log(`已创建项目: ${project.name}`);
      
      // 为该项目导入里程碑
      const projectMilestones = milestonesData.filter(
        m => m[MILESTONE_FIELDS.projectName] === projectRow[PROJECT_FIELDS.name]
      );
      
      for (const milestoneRow of projectMilestones) {
        const milestone = await prisma.milestone.create({
          data: {
            name: milestoneRow[MILESTONE_FIELDS.name],
            startDate: parseDate(milestoneRow[MILESTONE_FIELDS.startDate]),
            endDate: parseDate(milestoneRow[MILESTONE_FIELDS.endDate]),
            evaluationDate: parseDate(milestoneRow[MILESTONE_FIELDS.evaluationDate]),
            actualEvaluationDate: parseDate(milestoneRow[MILESTONE_FIELDS.actualEvaluationDate]),
            status: milestoneRow[MILESTONE_FIELDS.actualEvaluationDate] && 
                   milestoneRow[MILESTONE_FIELDS.actualEvaluationDate].trim() !== '' 
                   ? '已完成' : '进行中',
            projectId: project.id,
          },
        });
        
        console.log(`  已创建里程碑: ${milestone.name}`);
      }
      
      // 创建项目创建活动记录
      await prisma.activity.create({
        data: {
          title: '项目创建',
          description: `项目 "${project.name}" 已创建`,
          type: 'create',
          priority: 'medium',
          projectId: project.id,
          timestamp: new Date(),
        },
      });
    }
    
    console.log('数据导入完成');
  } catch (error) {
    console.error('导入数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行导入
importData(); 