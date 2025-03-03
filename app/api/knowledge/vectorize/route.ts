import { NextRequest, NextResponse } from 'next/server';
import { VectorizeRequest, VectorizeResponse, KnowledgeChunk } from '@/types';
import { splitTextIntoChunks } from '../upload/route';
import { textToVector } from '@/lib/mockKnowledgeData';

/**
 * 处理文本向量化请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json() as VectorizeRequest;
    const { knowledgeId, content, chunkSize = 1000, overlap = 200 } = body;
    
    // 验证必要字段
    if (!knowledgeId || !content) {
      return NextResponse.json(
        { error: '缺少必要字段：knowledgeId和content' },
        { status: 400 }
      );
    }
    
    // 将文本分块
    const textChunks = splitTextIntoChunks(content, chunkSize, overlap);
    
    // 为每个文本块生成向量
    const chunks: KnowledgeChunk[] = [];
    const vectorIds: string[] = [];
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunkId = `chunk_${knowledgeId}_${i}`;
      const vector = await generateEmbedding(textChunks[i]);
      
      // 创建知识块
      const chunk: KnowledgeChunk = {
        id: chunkId,
        knowledgeId,
        content: textChunks[i],
        index: i,
        vector,
        metadata: {
          position: i === 0 ? 'beginning' : i === textChunks.length - 1 ? 'end' : 'middle',
          chunkNumber: i + 1,
          totalChunks: textChunks.length
        }
      };
      
      // 存储知识块（这里只是模拟）
      chunks.push(chunk);
      vectorIds.push(chunkId);
      
      // 实际应用中，这里应该将向量存储到向量数据库
      console.log(`已处理文本块 ${i + 1}/${textChunks.length}`);
    }
    
    // 构建响应
    const response: VectorizeResponse = {
      knowledgeId,
      chunks: chunks.length,
      vectorIds,
      status: 'completed'
    };
    
    // 返回成功响应
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('向量化处理错误:', error);
    return NextResponse.json(
      { error: '向量化处理失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 生成文本嵌入向量
 * 注意：这是一个模拟实现，实际应用中应该调用OpenAI API或其他嵌入模型
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 使用模拟函数生成向量
  return textToVector(text);
  
  // 实际应用中，应该调用OpenAI API，例如：
  /*
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
  */
} 