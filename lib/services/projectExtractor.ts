import axios from 'axios';
import { OCRResponse } from './ocr';

// Mistral API 配置
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'bXkslXgU1KbER1anYhwicgw6zFjkqKjM';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat';

// 项目信息接口
export interface ProjectInfo {
  projectName?: string;
  projectCode?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  projectManager?: string;
  projectOwner?: string;
  department?: string;
  status?: string;
  description?: string;
  riskPoints?: string[];
  milestones?: Array<{
    name: string;
    date: string;
    status?: string;
  }>;
  teamMembers?: string[];
  [key: string]: unknown; // 允许其他字段
}

/**
 * 从OCR结果中提取项目信息
 */
export async function extractProjectInfoFromOCR(ocrResult: OCRResponse): Promise<ProjectInfo> {
  try {
    console.log('开始从OCR结果中提取项目信息...');
    
    // 合并所有页面的Markdown内容
    const markdownContent = ocrResult.pages.map(page => page.markdown).join('\n\n');
    
    console.log(`OCR结果包含 ${ocrResult.pages.length} 页，共 ${markdownContent.length} 字符`);
    
    // 调用LLM提取项目信息
    const projectInfo = await extractInfoWithLLM(markdownContent);
    
    console.log('项目信息提取完成:', projectInfo);
    
    return projectInfo;
  } catch (error) {
    console.error('提取项目信息失败:', error);
    throw new Error(`提取项目信息失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 使用LLM从Markdown内容中提取项目信息
 */
async function extractInfoWithLLM(markdownContent: string): Promise<ProjectInfo> {
  try {
    console.log('调用LLM提取项目信息...');
    
    // 构建提示词
    const prompt = `
你是一个专业的项目管理助手，请从以下文档中提取项目相关信息。
文档内容是OCR识别的结果，可能包含一些错误或格式问题。
请尽可能准确地提取以下信息（如果文档中没有相关信息，则对应字段返回null）：

1. 项目名称 (projectName)
2. 项目编号/代码 (projectCode)
3. 开始日期 (startDate)，格式为YYYY-MM-DD
4. 结束日期 (endDate)，格式为YYYY-MM-DD
5. 预算 (budget)，数字格式
6. 实际成本 (actualCost)，数字格式
7. 项目经理 (projectManager)
8. 项目负责人 (projectOwner)
9. 所属部门 (department)
10. 项目状态 (status)
11. 项目描述 (description)
12. 风险点 (riskPoints)，数组格式
13. 里程碑 (milestones)，数组格式，每个里程碑包含名称(name)、日期(date)和状态(status)
14. 团队成员 (teamMembers)，数组格式

请以JSON格式返回结果，不要包含任何其他解释或评论。

文档内容：
${markdownContent.substring(0, 15000)} // 限制长度，避免超出token限制
`;

    // 调用Mistral API
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // 低温度，提高确定性
        response_format: { type: 'json_object' } // 请求JSON格式的响应
      },
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 解析LLM响应
    const assistantMessage = response.data.choices[0].message.content;
    console.log('LLM响应:', assistantMessage);
    
    try {
      // 尝试解析JSON
      const projectInfo = JSON.parse(assistantMessage);
      return projectInfo;
    } catch (parseError) {
      console.error('解析LLM响应失败:', parseError);
      
      // 尝试提取JSON部分
      const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || 
                        assistantMessage.match(/```\n([\s\S]*?)\n```/) ||
                        assistantMessage.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        try {
          const jsonContent = jsonMatch[1] || jsonMatch[0];
          return JSON.parse(jsonContent);
        } catch {
          throw new Error('无法解析LLM返回的JSON格式');
        }
      } else {
        throw new Error('LLM响应不包含有效的JSON数据');
      }
    }
  } catch (error) {
    console.error('LLM处理失败:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`LLM处理失败: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`LLM处理失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 将项目信息保存到数据库
 * 注意：这是一个示例函数，需要根据实际数据库实现
 */
export async function saveProjectInfoToDatabase(projectInfo: ProjectInfo): Promise<string> {
  try {
    console.log('保存项目信息到数据库:', projectInfo);
    
    // TODO: 实现数据库保存逻辑
    // 这里应该调用您的数据库服务
    
    // 模拟返回项目ID
    return `project-${Date.now()}`;
  } catch (error) {
    console.error('保存项目信息失败:', error);
    throw new Error(`保存项目信息失败: ${error instanceof Error ? error.message : String(error)}`);
  }
} 