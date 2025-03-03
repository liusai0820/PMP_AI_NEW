import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { DocumentUploadResponse } from '@/types';

// 模拟文件存储路径
const STORAGE_PATH = '/documents/';

/**
 * 处理文档上传请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析multipart/form-data请求
    const formData = await request.formData();
    
    // 获取文件和元数据
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string || '').split(',').filter(Boolean);
    const description = formData.get('description') as string;
    
    // 验证必要字段
    if (!file || !title) {
      return NextResponse.json(
        { error: '缺少必要字段：文件和标题' },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      );
    }
    
    // 生成唯一ID
    const id = uuidv4();
    
    // 获取文件扩展名
    const fileExtension = file.name.split('.').pop() || '';
    const sourceType = fileExtension.toLowerCase();
    
    // 模拟文件存储
    // 实际应用中，这里应该将文件保存到文件系统或云存储
    const filePath = `${STORAGE_PATH}${id}.${fileExtension}`;
    
    // 模拟文本提取
    // 实际应用中，这里应该根据文件类型调用不同的库提取文本
    const extractedText = await extractTextFromFile(file);
    
    // 将提取的文本分块，为后续向量化做准备
    const textChunks = splitTextIntoChunks(extractedText);
    console.log(`文档已分割为 ${textChunks.length} 个文本块`);
    
    // 构建响应
    const response: DocumentUploadResponse = {
      id,
      title,
      category,
      tags,
      summary: description || extractedText.substring(0, 200) + '...',
      sourceDocument: filePath,
      sourceType,
      fileSize: file.size,
      status: 'completed',
    };
    
    // 返回成功响应
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('文档上传处理错误:', error);
    return NextResponse.json(
      { error: '文档上传处理失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 从文件中提取文本
 * 注意：这是一个模拟实现，实际应用中应该根据文件类型使用不同的库
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // 获取文件类型
  const fileType = file.type;
  
  // 读取文件内容
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // 根据文件类型提取文本
  // 实际应用中，应该使用专门的库处理不同类型的文件
  switch (fileType) {
    case 'application/pdf':
      // 使用pdf-parse或pdf.js提取文本
      // 这里只是模拟
      return `[PDF内容提取] ${file.name} - 这是从PDF文件中提取的文本内容示例。`;
      
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      // 使用mammoth.js提取文本
      // 这里只是模拟
      return `[Word内容提取] ${file.name} - 这是从Word文档中提取的文本内容示例。`;
      
    case 'text/plain':
      // 直接读取文本文件
      return new TextDecoder().decode(buffer);
      
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.ms-excel':
      // 使用xlsx库提取文本
      // 这里只是模拟
      return `[Excel内容提取] ${file.name} - 这是从Excel文件中提取的文本内容示例。`;
      
    default:
      return `无法提取内容：不支持的文件类型 ${fileType}`;
  }
}

/**
 * 将文本分块
 * 注意：这是一个简单的实现，实际应用中可能需要更复杂的分块策略
 */
export function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    // 计算当前块的结束位置
    let endIndex = startIndex + chunkSize;
    
    // 如果不是最后一块，尝试在句子或段落边界处分割
    if (endIndex < text.length) {
      // 在结束位置附近寻找句号、问号、感叹号或换行符
      const boundaryChars = ['.', '?', '!', '\n', '\r\n', '。', '？', '！'];
      let boundaryIndex = -1;
      
      // 在结束位置前后100个字符内寻找边界
      for (let i = endIndex; i > endIndex - 100 && i > startIndex; i--) {
        if (boundaryChars.includes(text[i])) {
          boundaryIndex = i + 1; // 包含边界字符
          break;
        }
      }
      
      // 如果找到了合适的边界，使用它作为结束位置
      if (boundaryIndex > startIndex) {
        endIndex = boundaryIndex;
      }
    }
    
    // 添加当前块
    chunks.push(text.substring(startIndex, endIndex));
    
    // 更新下一块的起始位置，考虑重叠
    startIndex = endIndex - overlap;
    
    // 确保起始位置不会倒退
    if (startIndex <= 0 || startIndex >= text.length) {
      break;
    }
  }
  
  return chunks;
} 