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
}

// 文档处理服务
export class DocumentProcessor {
  // 处理文档并提取项目信息
  async processDocument(file: File): Promise<ProjectInfo> {
    try {
      // 判断文件类型
      const fileType = this.getFileType(file);
      
      // 根据文件类型选择不同的处理方法
      switch (fileType) {
        case 'pdf-scan':
        case 'image':
          return await this.processScannedDocument(file);
        case 'pdf-text':
        case 'docx':
          return await this.processTextDocument(file);
        default:
          throw new Error(`不支持的文件类型: ${file.type}`);
      }
    } catch (error) {
      console.error('文档处理失败:', error);
      throw error;
    }
  }
  
  // 获取文件类型
  private getFileType(file: File): 'pdf-text' | 'pdf-scan' | 'docx' | 'image' | 'unknown' {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType === 'application/pdf') {
      // 注意：这里简单地假设所有PDF都是扫描型的
      // 实际应用中，需要更复杂的逻辑来区分文本型PDF和扫描型PDF
      return 'pdf-scan';
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    } else if (mimeType.startsWith('image/')) {
      return 'image';
    } else {
      return 'unknown';
    }
  }
  
  // 处理扫描型文档（PDF扫描件或图片）
  private async processScannedDocument(file: File): Promise<ProjectInfo> {
    try {
      // 将文件转换为base64
      const base64Data = await this.fileToBase64(file);
      
      // 调用OCR服务
      const ocrResult = await ocrService.processDocument(`data:${file.type};base64,${base64Data}`);
      
      // 从OCR结果中提取项目信息
      return this.extractProjectInfoFromText(ocrResult.pages.map(page => page.markdown).join('\n'));
    } catch (error) {
      console.error('扫描文档处理失败:', error);
      throw error;
    }
  }
  
  // 处理文本型文档（文本PDF或DOCX）
  private async processTextDocument(file: File): Promise<ProjectInfo> {
    // 这里应该调用大模型API来处理文本文档
    // 由于这部分需要集成其他API，这里只是一个占位实现
    
    // 模拟调用大模型API
    // 实际实现中，这里应该调用大模型API来提取项目信息
    console.log('处理文本文档:', file.name);
    
    // 返回一个模拟的项目信息
    return {
      name: '从文本文档中提取的项目名称',
      description: '这是一个从文本文档中提取的项目描述。实际应用中，这里应该包含从文档中提取的真实信息。'
    };
  }
  
  // 从文本中提取项目信息
  private extractProjectInfoFromText(text: string): ProjectInfo {
    // 这里应该实现更复杂的文本分析逻辑
    // 使用正则表达式或其他方法从文本中提取项目信息
    
    const projectInfo: ProjectInfo = {};
    
    // 提取项目名称（示例）
    const nameMatch = text.match(/项目名称[：:]\s*(.+?)(?:\n|$)/i);
    if (nameMatch && nameMatch[1]) {
      projectInfo.name = nameMatch[1].trim();
    }
    
    // 提取项目单位（示例）
    const orgMatch = text.match(/项目单位[：:]\s*(.+?)(?:\n|$)/i) || 
                     text.match(/承担单位[：:]\s*(.+?)(?:\n|$)/i);
    if (orgMatch && orgMatch[1]) {
      projectInfo.organization = orgMatch[1].trim();
    }
    
    // 提取项目描述（示例）
    const descMatch = text.match(/项目(描述|简介)[：:]\s*(.+?)(?=\n\S|$)/i);
    if (descMatch && descMatch[2]) {
      projectInfo.description = descMatch[2].trim();
    }
    
    // 提取项目经费（示例）
    const fundingMatch = text.match(/政府资助[：:]\s*(\d+(?:\.\d+)?)/i);
    if (fundingMatch && fundingMatch[1]) {
      projectInfo.governmentFunding = parseFloat(fundingMatch[1]);
    }
    
    // 提取项目负责人（示例）
    const leaderMatch = text.match(/项目负责人[：:]\s*(.+?)(?:\n|$)/i);
    if (leaderMatch && leaderMatch[1]) {
      projectInfo.projectLeader = leaderMatch[1].trim();
    }
    
    // 提取项目开始日期（示例）
    const startDateMatch = text.match(/开始日期[：:]\s*(.+?)(?:\n|$)/i);
    if (startDateMatch && startDateMatch[1]) {
      projectInfo.startDate = startDateMatch[1].trim();
    }
    
    // 提取项目结束日期（示例）
    const endDateMatch = text.match(/结束日期[：:]\s*(.+?)(?:\n|$)/i);
    if (endDateMatch && endDateMatch[1]) {
      projectInfo.endDate = endDateMatch[1].trim();
    }
    
    return projectInfo;
  }
  
  // 将文件转换为base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // 移除 data:image/jpeg;base64, 前缀
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const documentProcessor = new DocumentProcessor(); 