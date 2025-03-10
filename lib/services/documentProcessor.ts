import axios from 'axios';
import { ocrService } from './ocr';

// 定义项目信息接口
export interface ProjectInfo {
  name?: string;
  batch?: string;
  client?: string;
  organization?: string;
  industry?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  background?: string;
  projectManager?: string;
  projectLeader?: string;
  governmentFunding?: number;
  selfFunding?: number;
  location?: string;
  projectName?: string;
  projectCode?: string;
  budget?: number;
  actualCost?: number;
  projectOwner?: string;
  department?: string;
  status?: string;
  riskPoints?: string[];
  milestones?: Array<{
    name: string;
    date: string;
    status?: string;
  }>;
  teamMembers?: string[];
  [key: string]: unknown; // 使用unknown代替any
}

// 完整的项目数据接口
export interface CompleteProjectData {
  basicInfo: {
    name: string;                 // 项目名称
    code: string;                 // 项目编号/合同编号
    mainDepartment: string;       // 项目主管部门（甲方）
    executeDepartment: string;    // 项目承担单位（乙方）
    manager: string;              // 项目核心负责人
    startDate: string;           // 开始日期
    endDate: string;             // 结束日期
    totalBudget: string;         // 总预算
    supportBudget: string;       // 资助金额
    selfBudget: string;          // 自筹金额
    description: string;         // 项目描述
    type: string;                // 项目类型
  };
  milestones: Array<{
    phase: string;               // 阶段（第一阶段/第二阶段/第三阶段）
    startDate: string;          // 阶段开始时间
    endDate: string;            // 阶段结束时间
    mainTasks: string[];        // 主要研究内容
    deliverables: string[];     // 考核指标/交付物
  }>;
  budgets: Array<{
    category: string;           // 预算类别
    subCategory: string;        // 子类别
    amount: number;            // 金额
    source: 'support' | 'self'; // 资金来源（资助/自筹）
    description: string;       // 说明
  }>;
  team: Array<{
    name: string;              // 姓名
    title: string;             // 职称
    role: string;              // 项目角色
    workload: string;          // 工作量（月/年）
    unit: string;              // 所属单位
  }>;
}

// 文档处理服务
export class DocumentProcessor {
  
  async processDocument(file: File): Promise<CompleteProjectData> {
    try {
      const fileType = this.getFileType(file);
      
      console.log(`处理文档，类型: ${fileType}`);
      
      // 根据文件类型选择不同的处理方法
      let textContent: string;
      
      switch (fileType) {
        case 'pdf-scan':
        case 'image':
          // 对于扫描型文档，先进行OCR识别
          textContent = await this.processScannedDocument(file);
          break;
        case 'pdf-text':
        case 'docx':
          // 对于文本型文档，直接提取文本
          textContent = await this.processTextDocument(file);
          break;
        default:
          throw new Error('不支持的文件类型');
      }
      
      // 无论是哪种类型的文档，都通过统一的API路由进行项目信息提取
      return await this.analyzeProjectInfo(textContent);
    } catch (error) {
      console.error('文档处理失败:', error);
      throw error;
    }
  }
  
  private getFileType(file: File): 'pdf-text' | 'pdf-scan' | 'docx' | 'image' | 'unknown' {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // 检查文件类型是否为pdf-scan
      if (fileType === 'application/pdf' && file.name.includes('scan')) {
        return 'pdf-scan';
      }
      // 如果文件类型是pdf，但没有明确标记为scan，我们默认将其视为扫描型PDF
      return 'pdf-scan';
    } else if (fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp)$/.test(fileName)) {
      return 'image';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return 'docx';
    }
    
    return 'unknown';
  }
  
  private async processScannedDocument(file: File): Promise<string> {
    try {
      console.log('开始处理扫描文档:', file.name, file.type);
      
      // 将文件转换为base64
      const base64Data = await this.fileToBase64(file);
      console.log('文件已转换为base64，长度:', base64Data.length);
      
      // 使用OCR服务处理文档
      const isImage = file.type.startsWith('image/');
      console.log(`使用OCR服务处理${isImage ? '图片' : '文档'}...`);
      
      let ocrResult;
      try {
        ocrResult = isImage
          ? await ocrService.processImage(base64Data)
          : await ocrService.processDocument(base64Data);
      } catch (ocrError) {
        console.error('OCR处理失败:', ocrError);
        throw new Error(`OCR处理失败: ${ocrError instanceof Error ? ocrError.message : String(ocrError)}`);
      }
      
      if (!ocrResult || !ocrResult.pages || ocrResult.pages.length === 0) {
        console.error('OCR服务返回无效结果:', ocrResult);
        throw new Error('OCR服务返回无效结果，无法提取文本');
      }
      
      console.log(`OCR处理完成，页数: ${ocrResult.pages.length}`);
      
      // 合并所有页面的Markdown内容
      let markdownContent = '';
      
      // 处理每一页的内容
      for (let i = 0; i < ocrResult.pages.length; i++) {
        const page = ocrResult.pages[i];
        console.log(`处理第${i+1}页，内容长度: ${page.markdown.length}`);
        
        // 检查页面内容是否有效
        if (!page.markdown || page.markdown.trim().length === 0) {
          console.warn(`第${i+1}页内容为空，跳过`);
          continue;
        }
        
        // 添加页码标记，帮助分析
        markdownContent += `\n\n## 第${i+1}页\n\n${page.markdown}`;
      }
      
      // 清理Markdown内容
      markdownContent = markdownContent.trim();
      
      if (!markdownContent || markdownContent.trim().length < 100) {
        console.error('OCR提取的文本内容为空或过短:', markdownContent);
        throw new Error('OCR提取的文本内容为空或过短，无法进行分析');
      }
      
      console.log('OCR提取的文本内容长度:', markdownContent.length);
      console.log('OCR提取的文本内容示例:', markdownContent.substring(0, 200));
      
      return markdownContent;
    } catch (error) {
      console.error('扫描文档处理失败:', error);
      throw error;
    }
  }
  
  private async processTextDocument(file: File): Promise<string> {
    try {
      console.log(`处理文本文档: ${file.name}, 大小: ${file.size} 字节`);
      
      // 将文件转换为base64
      const base64Data = await this.fileToBase64(file);
      console.log('文件已转换为base64，长度:', base64Data.length);
      
      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // 调用文档提取API
      console.log('正在调用文档提取API...');
      try {
        const response = await axios.post('/api/document-extract', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000, // 增加超时时间到2分钟
        });
        
        if (response.status !== 200) {
          console.error('文档提取API返回错误:', response.status, response.data);
          throw new Error(`文档提取失败: ${response.data.error || '服务器内部错误'}`);
        }
        
        if (!response.data || !response.data.text) {
          console.error('文档提取API返回无效数据:', response.data);
          throw new Error('文档提取API返回无效数据，无法提取文本');
        }
        
        const extractedText = response.data.text;
        console.log('提取的文本内容长度:', extractedText.length);
        console.log('提取的文本内容示例:', extractedText.substring(0, 200));
        
        return extractedText;
      } catch (apiError) {
        console.error('调用文档提取API失败:', apiError);
        
        // 如果API调用失败，尝试使用备用方法
        console.log('尝试使用备用方法提取文本...');
        
        // 对于DOCX文件，我们可以直接将文件发送到项目分析API
        // 项目分析API会尝试提取文本
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extractTextOnly', 'true');
        
        try {
          const backupResponse = await axios.post('/api/project-analysis', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 180000, // 增加超时时间到3分钟
          });
          
          if (backupResponse.status !== 200 || !backupResponse.data || !backupResponse.data.text) {
            throw new Error('备用文本提取方法失败');
          }
          
          return backupResponse.data.text;
        } catch (backupError) {
          console.error('备用文本提取方法失败:', backupError);
          throw new Error(`无法从文档中提取文本: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
        }
      }
    } catch (error) {
      console.error('文本文档处理失败:', error);
      throw error;
    }
  }
  
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }
  
  /**
   * 通过API路由分析项目信息
   * 所有类型的文档最终都通过这个方法进行项目信息提取
   */
  private async analyzeProjectInfo(textContent: string): Promise<CompleteProjectData> {
    try {
      console.log('开始通过API路由分析项目信息...');
      console.log(`文本内容长度: ${textContent.length} 字符`);
      
      // 检查文本内容是否有效
      if (!textContent || textContent.length < 100) {
        console.error('文本内容为空或过短，无法进行分析');
        throw new Error('提取的文本内容为空或过短，无法进行分析');
      }

      // 预处理文本内容，移除不必要的标记
      const cleanedText = textContent
        .replace(/##\s+第\d+页/g, '\n') // 移除页码标记
        .replace(/\n{3,}/g, '\n\n')     // 规范化空行
        .trim();
      
      console.log('清理后的文本样本:', cleanedText.substring(0, 300));
      
      // 创建FormData
      const formData = new FormData();
      formData.append('text', cleanedText);
      
      // 调用项目分析API
      console.log('正在调用项目分析API...');
      try {
        const response = await axios.post('/api/project-analysis', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000, // 增加超时时间到2分钟
          validateStatus: function (status) {
            return status >= 200 && status < 500; // 不要自动抛出 500 错误
          }
        });
        
        // 添加更详细的错误处理
        if (response.status === 500) {
          console.error('项目分析API返回500错误:', response.data);
          
          // 提供回退数据
          const fallbackData = this.createFallbackData();
          console.log('使用回退数据:', fallbackData);
          
          const error = new Error(`项目分析失败: ${response.data.error || '服务器内部错误'}`);
          (error as any).fallbackData = fallbackData;
          throw error;
        }

        console.log('项目信息分析API响应状态:', response.status);
        
        if (!response.data) {
          const fallbackData = this.createFallbackData();
          const error = new Error('项目信息分析API返回空数据');
          (error as any).fallbackData = fallbackData;
          throw error;
        }

        // 验证API响应数据结构
        const validateResponse = (data: unknown): data is CompleteProjectData => {
          if (!data || typeof data !== 'object') {
            return false;
          }
          
          const d = data as Record<string, unknown>;
          return (
            'basicInfo' in d &&
            typeof d.basicInfo === 'object' &&
            d.basicInfo !== null &&
            'name' in d.basicInfo &&
            typeof (d.basicInfo as Record<string, unknown>).name === 'string' &&
            Array.isArray(d.milestones) &&
            Array.isArray(d.budgets) &&
            Array.isArray(d.team)
          );
        };

        if (!validateResponse(response.data)) {
          console.error('API返回的数据结构无效:', response.data);
          const fallbackData = this.createFallbackData();
          const error = new Error('API返回的数据结构无效');
          (error as any).fallbackData = fallbackData;
          throw error;
        }
        
        return response.data;
      } catch (apiError) {
        console.error('调用项目分析API失败:', apiError);
        
        // 如果错误中已经包含回退数据，则直接抛出
        if (apiError && typeof apiError === 'object' && 'fallbackData' in apiError) {
          throw apiError;
        }
        
        // 否则创建回退数据
        const fallbackData = this.createFallbackData();
        const error = new Error(`调用项目分析API失败: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
        (error as any).fallbackData = fallbackData;
        throw error;
      }
    } catch (error) {
      console.error('分析项目信息失败:', error);
      
      // 如果错误中已经包含回退数据，则直接抛出
      if (error && typeof error === 'object' && 'fallbackData' in error) {
        throw error;
      }
      
      // 否则创建回退数据
      const fallbackData = this.createFallbackData();
      const enhancedError = new Error(`分析项目信息失败: ${error instanceof Error ? error.message : String(error)}`);
      (enhancedError as any).fallbackData = fallbackData;
      throw enhancedError;
    }
  }
  
  // 创建回退数据，当API分析失败时使用
  private createFallbackData(): CompleteProjectData {
    const currentDate = new Date().toISOString().split('T')[0];
    return {
      basicInfo: {
        name: '文档处理失败: 项目信息分析失败',
        code: '未提供',
        mainDepartment: '未提供',
        executeDepartment: '未提供',
        manager: '未提供',
        startDate: currentDate,
        endDate: currentDate,
        totalBudget: '0',
        supportBudget: '0',
        selfBudget: '0',
        description: '文档处理失败，请手动填写项目信息或重新上传文档。',
        type: '未提供'
      },
      milestones: [],
      budgets: [],
      team: []
    };
  }
}

export const documentProcessor = new DocumentProcessor(); 