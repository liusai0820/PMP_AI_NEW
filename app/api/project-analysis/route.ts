import * as mammoth from 'mammoth';

// 项目基本信息接口
interface ProjectInfo {
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
}

// 项目里程碑接口
interface ProjectMilestone {
  phase: string;               // 阶段（第一阶段/第二阶段/第三阶段）
  startDate: string;          // 阶段开始时间
  endDate: string;            // 阶段结束时间
  mainTasks: string[];        // 主要研究内容
  deliverables: string[];     // 考核指标/交付物
}

// 项目预算接口
interface ProjectBudget {
  category: string;           // 预算类别
  subCategory: string;        // 子类别
  amount: number;            // 金额
  source: 'support' | 'self'; // 资金来源（资助/自筹）
  description: string;       // 说明
}

// 项目团队成员接口
interface TeamMember {
  name: string;              // 姓名
  title: string;             // 职称
  role: string;              // 项目角色
  workload: string;          // 工作量（月/年）
  unit: string;              // 所属单位
}

// 完整项目数据接口
interface CompleteProjectData {
  basicInfo: ProjectInfo;
  milestones: ProjectMilestone[];
  budgets: ProjectBudget[];
  team: TeamMember[];
}

// 分析提示词模板
// 注意：此提示词已被CHINESE_ANALYSIS_PROMPT替代，保留作为参考
/* 
const ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析项目文档并提取关键信息。
请分析以下项目文档内容，并提取所有关键信息，组织成结构化数据。

请仔细阅读文档，尽可能提取以下信息。如果某项信息在文档中确实不存在，才填写"未提供"。
请不要轻易放弃，尝试从文档的各个部分寻找相关信息，包括标题、正文、表格等。

请从文档中提取以下信息：

1. 项目基本信息：
   - 项目名称：通常在文档标题或开头部分
   - 项目编号/合同编号：通常有特定格式，如字母+数字组合
   - 项目主管部门（甲方）：通常是政府部门或机构名称
   - 项目承担单位（乙方）：通常是执行项目的公司或机构
   - 项目核心负责人：通常有姓名和职位
   - 开始日期：查找项目开始或合同生效的日期
   - 结束日期：查找项目结束或合同到期的日期
   - 总预算：查找总金额相关信息
   - 资助金额：查找外部资助或拨款金额
   - 自筹金额：查找自筹或配套资金金额
   - 项目描述：查找项目概述、背景、目标等描述性内容
   - 项目类型：如研发项目、基础设施项目等

2. 项目里程碑：
   - 阶段（第一阶段/第二阶段/第三阶段）
   - 阶段开始时间
   - 阶段结束时间
   - 主要研究内容（数组）：每个阶段的主要任务或研究内容
   - 考核指标/交付物（数组）：每个阶段需要完成的指标或交付物

3. 项目预算：
   - 预算类别：如设备费、材料费、人员费等
   - 子类别：预算类别的细分
   - 金额：对应的金额数值
   - 资金来源（资助/自筹）：标明资金来源
   - 说明：预算项目的补充说明

4. 项目团队：
   - 姓名：团队成员姓名
   - 职称：如教授、工程师等
   - 项目角色：如项目负责人、技术负责人等
   - 工作量：如工作时间或工作比例
   - 所属单位：团队成员所属的机构或部门

请以JSON格式返回结果，格式如下：

\`\`\`json
{
  "basicInfo": {
    "name": "项目名称",
    "code": "项目编号",
    "mainDepartment": "项目主管部门",
    "executeDepartment": "项目承担单位",
    "manager": "项目核心负责人",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "totalBudget": "总预算",
    "supportBudget": "资助金额",
    "selfBudget": "自筹金额",
    "description": "项目描述",
    "type": "项目类型"
  },
  "milestones": [
    {
      "phase": "第一阶段",
      "startDate": "阶段开始时间",
      "endDate": "阶段结束时间",
      "mainTasks": ["主要任务1", "主要任务2"],
      "deliverables": ["交付物1", "交付物2"]
    }
  ],
  "budgets": [
    {
      "category": "设备费",
      "subCategory": "计算机设备",
      "amount": 10000,
      "source": "support",
      "description": "购买服务器"
    }
  ],
  "team": [
    {
      "name": "张三",
      "title": "教授",
      "role": "项目负责人",
      "workload": "12个月",
      "unit": "某大学"
    }
  ]
}
\`\`\`

如果某些信息在文档中没有明确提及，请尽量根据上下文推断，或者填写合理的默认值。
请确保返回的JSON格式正确，可以被直接解析。

以下是需要分析的文档内容：
`;
*/

// 从文件中提取文本内容
// 这个函数已经不再使用，使用document-extract API代替
// const extractTextFromFile = async (fileContent: ArrayBuffer | string, fileType: string): Promise<string> => {
//   try {
//     console.log('开始提取文本，文件类型:', fileType);
//     
//     // 检查文件内容是否为空或无效
//     if (!fileContent || (typeof fileContent === 'string' && fileContent.length < 10) || 
//         (fileContent instanceof ArrayBuffer && fileContent.byteLength < 10)) {
//       console.error('文件内容为空或过短');
//       throw new Error('文件内容为空或无效');
//     }
//     
//     // 如果是ArrayBuffer，转换为字符串
//     let textContent = '';
//     if (fileContent instanceof ArrayBuffer) {
//       try {
//         // 尝试将ArrayBuffer转换为UTF-8字符串
//         textContent = new TextDecoder('utf-8').decode(fileContent);
//       } catch (decodeError) {
//         console.error('无法将ArrayBuffer解码为UTF-8字符串:', decodeError);
//         // 如果是PDF文件，可能是二进制内容，这是正常的
//         if (fileType.includes('pdf')) {
//           console.log('PDF文件的二进制内容无法直接解码为文本，这是正常的');
//           return '这是一个PDF文件，需要使用OCR服务进行处理。请使用DocumentProcessor.processScannedDocument方法处理此文件。';
//         }
//         throw new Error('无法解码文件内容');
//       }
//     } else {
//       textContent = fileContent;
//     }
//     
//     // 检查是否是带有二进制标记的内容
//     if (typeof textContent === 'string' && textContent.startsWith('[BINARY_')) {
//       console.log('检测到二进制标记内容');
//       
//       // 提取文件类型和Base64内容
//       const endOfHeader = textContent.indexOf(']');
//       if (endOfHeader > 0) {
//         const binaryType = textContent.substring(8, endOfHeader);
//         console.log('二进制内容类型:', binaryType);
//         
//         // 对于Word文档，使用mammoth库解析
//         if (binaryType.includes('docx') || binaryType.includes('openxmlformats-officedocument.wordprocessingml.document')) {
//           console.log('使用mammoth解析Word文档');
//           
//           // 这里应该实现mammoth解析逻辑
//           // 由于在浏览器环境中使用mammoth比较复杂，这里只返回一个错误
//           throw new Error('不支持在API中直接解析Word文档，请使用DocumentProcessor.processTextDocument方法处理此文件');
//         }
//       }
//     }
//     
//     return textContent;
//   } catch (error) {
//     console.error('提取文本时出错:', error);
//     throw error;
//   }
// };

// 创建一个新的辅助函数来提取JSON
const extractJsonFromAIResponse = async (aiMessage: string, text: string): Promise<CompleteProjectData> => {
  try {
    // 清理AI响应中的特殊字符和转义字符
    let cleanMessage = aiMessage
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')  // 移除控制字符
      .replace(/\n/g, ' ')  // 将换行符替换为空格
      .replace(/\r/g, '')   // 移除回车符
      .replace(/\t/g, ' ')  // 将制表符替换为空格
      .replace(/\\(?!["\\/bfnrtu])/g, ''); // 处理无效的转义字符

    // 尝试提取 JSON 部分
    const jsonMatch = cleanMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanMessage = jsonMatch[0];
    }

    // 尝试解析 JSON
    try {
      const extractedData = JSON.parse(cleanMessage);
      console.log('成功解析JSON数据:', JSON.stringify(extractedData, null, 2));
      
      // 验证和补充数据
      const validatedData: CompleteProjectData = {
        basicInfo: {
          name: extractedData.basicInfo?.name || text.split('\n')[0] || '未命名项目',
          code: extractedData.basicInfo?.code || '未提供',
          mainDepartment: extractedData.basicInfo?.mainDepartment || text.match(/甲方[（(].+?[）)]：\s*([^\\n]+)/)?.[ 1] || '未提供',
          executeDepartment: extractedData.basicInfo?.executeDepartment || text.match(/乙方[（(].+?[）)]：\s*([^\\n]+)/)?.[ 1] || '未提供',
          manager: extractedData.basicInfo?.manager || '未提供',
          startDate: extractedData.basicInfo?.startDate || new Date().toISOString().split('T')[0],
          endDate: extractedData.basicInfo?.endDate || new Date().toISOString().split('T')[0],
          totalBudget: extractedData.basicInfo?.totalBudget || '0',
          supportBudget: extractedData.basicInfo?.supportBudget || '0',
          selfBudget: extractedData.basicInfo?.selfBudget || '0',
          description: extractedData.basicInfo?.description || text.substring(0, 500),
          type: extractedData.basicInfo?.type || '未分类'
        },
        milestones: Array.isArray(extractedData.milestones) ? extractedData.milestones : [],
        budgets: Array.isArray(extractedData.budgets) ? extractedData.budgets : [],
        team: Array.isArray(extractedData.team) ? extractedData.team : []
      };

      console.log('验证后的数据:', JSON.stringify(validatedData, null, 2));
      return validatedData;
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      
      // 从原始文本中提取基本信息
      const projectName = text.match(/[#＃]\s*([^\\n]+)/)?.[ 1] || text.split('\n')[0] || '未命名项目';
      const mainDepartment = text.match(/甲方[（(].+?[）)]：\s*([^\\n]+)/)?.[ 1] || '未提供';
      const executeDepartment = text.match(/乙方[（(].+?[）)]：\s*([^\\n]+)/)?.[ 1] || '未提供';
      
      const fallbackData: CompleteProjectData = {
        basicInfo: {
          name: projectName.replace(/[#＃]\s*/, ''),
          code: '未提供',
          mainDepartment,
          executeDepartment,
          manager: '未提供',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          totalBudget: '0',
          supportBudget: '0',
          selfBudget: '0',
          description: text.substring(0, 500),
          type: '未分类'
        },
        milestones: [],
        budgets: [],
        team: []
      };

      console.log('使用回退数据:', JSON.stringify(fallbackData, null, 2));
      return fallbackData;
    }
  } catch (error) {
    console.error('处理AI响应时出错:', error);
    throw error;
  }
};

// 使用OpenRouter API分析文本并提取项目信息
const analyzeTextWithAI = async (text: string): Promise<CompleteProjectData> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OpenRouter API密钥未配置，将使用模拟数据');
      throw new Error('OpenRouter API密钥未配置');
    }

    console.log('正在调用OpenRouter API分析文档...');
    
    // 检查文本内容是否有效
    if (!text || text.length < 100 || text.includes('不支持旧版Word文档') || text.includes('无法从文件中提取有效文本')) {
      console.error('提供给AI的文本内容无效:', text);
      throw new Error('提供给AI的文本内容无效，无法进行分析');
    }
    
    console.log('处理后的文本前200个字符:', text.substring(0, 200));
    
    // 使用更明确的中文提示词
    const CHINESE_ANALYSIS_PROMPT = `
你是一位专业的项目管理顾问，擅长分析中文项目文档并提取关键信息。
请分析以下项目文档内容，并提取所有关键信息，组织成结构化数据。

请仔细阅读文档，尽可能提取以下信息。如果某项信息在文档中确实不存在，才填写"未提供"。
请不要轻易放弃，尝试从文档的各个部分寻找相关信息，包括标题、正文、表格等。

请特别注意：这是一份中文项目文档，请认真分析所有中文内容。

请从文档中提取以下信息：

1. 项目基本信息：
   - 项目名称：通常在文档标题或开头部分，如"XXX项目"、"XXX工程"等
   - 项目编号/合同编号：通常有特定格式，如字母+数字组合，例如"HZQB-KCZYB-2020031"
   - 项目主管部门（甲方）：通常是政府部门或机构名称
   - 项目承担单位（乙方）：通常是执行项目的公司或机构
   - 项目核心负责人：通常有姓名和职位
   - 开始日期：查找项目开始或合同生效的日期
   - 结束日期：查找项目结束或合同到期的日期
   - 总预算：查找总金额相关信息
   - 资助金额：查找外部资助或拨款金额
   - 自筹金额：查找自筹或配套资金金额
   - 项目描述：查找项目概述、背景、目标等描述性内容
   - 项目类型：如研发项目、基础设施项目等

2. 项目里程碑：
   - 阶段（第一阶段/第二阶段/第三阶段）
   - 阶段开始时间
   - 阶段结束时间
   - 主要研究内容（数组）：每个阶段的主要任务或研究内容
   - 考核指标/交付物（数组）：每个阶段需要完成的指标或交付物

3. 项目预算：
   - 预算类别：如设备费、材料费、人员费等
   - 子类别：预算类别的细分
   - 金额：对应的金额数值
   - 资金来源（资助/自筹）：标明资金来源
   - 说明：预算项目的补充说明

4. 项目团队：
   - 姓名：团队成员姓名
   - 职称：如教授、工程师等
   - 项目角色：如项目负责人、技术负责人等
   - 工作量：如工作时间或工作比例
   - 所属单位：团队成员所属的机构或部门

你必须以JSON格式返回结果，格式如下：

\`\`\`json
{
  "basicInfo": {
    "name": "项目名称",
    "code": "项目编号",
    "mainDepartment": "项目主管部门",
    "executeDepartment": "项目承担单位",
    "manager": "项目核心负责人",
    "startDate": "开始日期",
    "endDate": "结束日期",
    "totalBudget": "总预算",
    "supportBudget": "资助金额",
    "selfBudget": "自筹金额",
    "description": "项目描述",
    "type": "项目类型"
  },
  "milestones": [
    {
      "phase": "第一阶段",
      "startDate": "阶段开始时间",
      "endDate": "阶段结束时间",
      "mainTasks": ["主要任务1", "主要任务2"],
      "deliverables": ["交付物1", "交付物2"]
    }
  ],
  "budgets": [
    {
      "category": "设备费",
      "subCategory": "计算机设备",
      "amount": 10000,
      "source": "support",
      "description": "购买服务器"
    }
  ],
  "team": [
    {
      "name": "张三",
      "title": "教授",
      "role": "项目负责人",
      "workload": "12个月",
      "unit": "某大学"
    }
  ]
}
\`\`\`

如果某些信息在文档中没有明确提及，请尽量根据上下文推断，或者填写合理的默认值。
请确保返回的JSON格式正确，可以被直接解析。不要在JSON外添加任何解释性文字。

以下是需要分析的文档内容：
`;
    
    // 使用中文提示词
    const prompt = CHINESE_ANALYSIS_PROMPT + text;
    
    // 构建请求体，使用更适合中文处理的模型
    const requestBody = {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `你是一位专业的项目管理顾问，擅长分析中文项目文档并提取关键信息。
请仔细分析文档内容，提取以下信息并以JSON格式返回：
1. 项目基本信息(basicInfo)：
   - 项目名称(name)：通常在文档开头或标题处
   - 项目编号(code)：可能在文档标题下方
   - 主管部门(mainDepartment)：通常以"甲方"表示
   - 承担单位(executeDepartment)：通常以"乙方"表示
   - 项目负责人(manager)：可能在文档中提到
   - 开始日期(startDate)：项目开始时间
   - 结束日期(endDate)：项目结束时间
   - 总预算(totalBudget)：项目总经费
   - 资助金额(supportBudget)：政府资助金额
   - 自筹金额(selfBudget)：企业自筹金额
   - 项目描述(description)：项目主要内容
   - 项目类型(type)：项目类别

2. 里程碑信息(milestones)：数组，每个里程碑包含：
   - 阶段名称(phase)
   - 开始时间(startDate)
   - 结束时间(endDate)
   - 主要任务(mainTasks)：数组
   - 交付物(deliverables)：数组

3. 预算信息(budgets)：数组，每项包含：
   - 类别(category)
   - 子类别(subCategory)
   - 金额(amount)
   - 来源(source)：'support'或'self'
   - 说明(description)

4. 团队成员(team)：数组，每个成员包含：
   - 姓名(name)
   - 职称(title)
   - 角色(role)
   - 工作量(workload)
   - 所属单位(unit)

请确保返回的是合法的JSON格式，所有字段名使用双引号，所有字符串值使用双引号。
如果某些信息未在文档中找到，对应字段返回空值或默认值。`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    };
    
    // 如果Claude不可用，尝试使用备用模型
    const useBackupModel = process.env.USE_BACKUP_MODEL === 'true';
    if (useBackupModel) {
      console.log('使用备用模型 Gemini');
      requestBody.model = 'anthropic/claude-3.5-sonnet';
    }
    
    console.log('API请求体构建完成，使用模型:', requestBody.model);
    
    // 将请求体转换为JSON字符串
    const requestBodyString = JSON.stringify(requestBody);
    
    try {
      // 发送请求到OpenRouter API
      console.log('开始发送请求到OpenRouter API...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'PMP.AI Project Management Platform'
        },
        body: requestBodyString
      });
      
      console.log('收到API响应，状态码:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '无法解析错误响应' }));
        console.error('OpenRouter API调用失败:', errorData);
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('OpenRouter API响应成功，开始处理数据...');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('API响应格式不正确:', data);
        throw new Error('API响应格式不正确，缺少必要字段');
      }
      
      // 从AI响应中提取JSON
      const aiMessage = data.choices[0].message.content;
      console.log('AI响应:', aiMessage.substring(0, 200) + '...');
      
      try {
        const jsonData = await extractJsonFromAIResponse(aiMessage, text);
        console.log('成功提取项目数据');
        return jsonData;
      } catch (error) {
        console.error('处理AI响应时出错:', error);
        console.error('原始AI响应:', aiMessage);
        
        // 返回基本的项目数据结构
        console.log('返回基本项目数据结构');
        return {
          basicInfo: {
            name: "扫描文档 - " + new Date().toISOString().split('T')[0],
            code: "SCAN-" + Math.floor(Math.random() * 10000),
            mainDepartment: "未能从文档中提取",
            executeDepartment: "未能从文档中提取",
            manager: "未能从文档中提取",
            startDate: "未提供",
            endDate: "未提供",
            totalBudget: "未提供",
            supportBudget: "未提供",
            selfBudget: "未提供",
            description: "无法解析文档内容。这可能是因为文档是扫描件或格式不规范。请手动填写项目信息。",
            type: "扫描文档"
          },
          milestones: [],
          budgets: [],
          team: []
        };
      }
    } catch (fetchError) {
      console.error('API请求过程中出错:', fetchError);
      throw new Error(`API请求失败: ${fetchError instanceof Error ? fetchError.message : '未知错误'}`);
    }
  } catch (error) {
    console.error('分析文本时出错:', error);
    throw error; // 向上传递错误，由调用者处理
  }
};

export async function POST(request: Request) {
  try {
    // 解析请求
    const formData = await request.formData();
    const text = formData.get('text');
    const file = formData.get('file') as File | null;
    const extractTextOnly = formData.get('extractTextOnly') === 'true';
    
    // 如果提供了文件，则从文件中提取文本
    if (file) {
      console.log(`收到文件上传: ${file.name}, 类型: ${file.type}, 大小: ${file.size} 字节`);
      
      try {
        // 从文件中提取文本
        let extractedText = '';
        
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.toLowerCase().endsWith('.docx')) {
          // 处理DOCX文件
          try {
            // 将File对象转换为ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            
            // 使用mammoth.js提取文本
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value;
            
            console.log(`从DOCX提取的文本长度: ${extractedText.length}`);
            console.log(`从DOCX提取的文本样本: ${extractedText.substring(0, 200)}`);
          } catch (docxError) {
            console.error('DOCX文本提取失败:', docxError);
            throw new Error(`DOCX文本提取失败: ${docxError instanceof Error ? docxError.message : String(docxError)}`);
          }
        } else {
          throw new Error(`不支持的文件类型: ${file.type}`);
        }
        
        // 如果只需要提取文本，则直接返回
        if (extractTextOnly) {
          return new Response(JSON.stringify({ 
            success: true,
            text: extractedText,
            textLength: extractedText.length
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // 否则，使用提取的文本进行项目分析
        const projectData = await analyzeTextWithAI(extractedText);
        
        return new Response(JSON.stringify(projectData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fileProcessError) {
        console.error('文件处理失败:', fileProcessError);
        
        // 创建回退数据
        const currentDate = new Date().toISOString().split('T')[0];
        const fallbackData = {
          basicInfo: {
            name: '文档处理失败: 文件处理失败',
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
        
        return new Response(JSON.stringify({ 
          success: false,
          error: '文件处理失败',
          details: fileProcessError instanceof Error ? fileProcessError.message : String(fileProcessError),
          fallbackData
        }), {
          status: 200, // 返回200而不是500，让前端能够处理回退数据
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // 如果没有提供文件，则检查是否提供了文本
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ 
        success: false,
        error: '请提供文本内容或上传文件' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 记录文本样本，帮助调试
    console.log('文本样本(前300字符):', text.substring(0, 300));
    
    // 分析文本
    try {
      const projectData = await analyzeTextWithAI(text);
      
      return new Response(JSON.stringify(projectData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (analysisError) {
      console.error('分析文本失败:', analysisError);
      
      // 创建回退数据
      const currentDate = new Date().toISOString().split('T')[0];
      const fallbackData = {
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
      
      return new Response(JSON.stringify({ 
        success: false,
        error: '分析文本失败',
        details: analysisError instanceof Error ? analysisError.message : String(analysisError),
        fallbackData
      }), {
        status: 200, // 返回200而不是500，让前端能够处理回退数据
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('处理请求失败:', error);
    
    // 创建回退数据
    const currentDate = new Date().toISOString().split('T')[0];
    const fallbackData = {
      basicInfo: {
        name: '文档处理失败: 请求处理失败',
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
    
    return new Response(JSON.stringify({ 
      success: false,
      error: '处理请求失败',
      details: error instanceof Error ? error.message : String(error),
      fallbackData
    }), {
      status: 200, // 返回200而不是500，让前端能够处理回退数据
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 