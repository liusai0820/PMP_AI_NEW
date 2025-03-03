import { NextRequest, NextResponse } from 'next/server';
import { SearchRequest, SearchResponse, KnowledgeItem } from '@/types';
import { textToVector, calculateCosineSimilarity, mockKnowledgeItems } from '@/lib/mockKnowledgeData';

/**
 * 处理知识库搜索请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json() as SearchRequest;
    const { 
      query, 
      filter = {}, 
      limit = 10, 
      offset = 0 
    } = body;
    
    // 验证必要字段
    if (!query) {
      return NextResponse.json(
        { error: '缺少必要字段：query' },
        { status: 400 }
      );
    }
    
    // 记录开始时间，用于计算搜索耗时
    const startTime = Date.now();
    
    // 将查询转换为向量
    const queryVector = textToVector(query);
    
    // 执行向量相似度搜索
    const searchResults = await performVectorSearch(queryVector, query, filter, limit, offset);
    
    // 计算搜索耗时
    const timeTaken = (Date.now() - startTime) / 1000;
    
    // 构建响应
    const response: SearchResponse = {
      results: searchResults,
      total: searchResults.length,
      query,
      timeTaken
    };
    
    // 返回成功响应
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('知识库搜索错误:', error);
    return NextResponse.json(
      { error: '知识库搜索失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 执行向量相似度搜索
 * 注意：这是一个模拟实现，实际应用中应该查询向量数据库
 */
async function performVectorSearch(
  queryVector: number[], 
  queryText: string,
  filter: SearchRequest['filter'] = {},
  limit: number = 10,
  offset: number = 0
): Promise<KnowledgeItem[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 获取所有知识条目
  let items = [...mockKnowledgeItems];
  
  // 应用过滤条件
  if (filter.categories && filter.categories.length > 0) {
    items = items.filter(item => filter.categories?.includes(item.category));
  }
  
  if (filter.tags && filter.tags.length > 0) {
    items = items.filter(item => 
      filter.tags?.some(filterTag => item.tags.includes(filterTag))
    );
  }
  
  if (filter.dateRange) {
    const { start, end } = filter.dateRange;
    if (start) {
      const startDate = new Date(start);
      items = items.filter(item => new Date(item.createdAt) >= startDate);
    }
    if (end) {
      const endDate = new Date(end);
      items = items.filter(item => new Date(item.createdAt) <= endDate);
    }
  }
  
  if (filter.author) {
    items = items.filter(item => item.author.includes(filter.author || ''));
  }
  
  // 计算相似度并创建带分数的项目
  interface ScoredItem extends KnowledgeItem {
    score: number;
  }
  
  const scoredItems: ScoredItem[] = items.map(item => {
    // 获取向量（在实际应用中，这些向量应该从向量数据库中检索）
    const vector = textToVector(item.title + ' ' + (item.summary || ''));
    
    // 计算余弦相似度
    const similarity = calculateCosineSimilarity(queryVector, vector);
    
    // 关键词匹配加权
    const titleMatch = item.title.toLowerCase().includes(queryText.toLowerCase()) ? 0.2 : 0;
    const summaryMatch = item.summary?.toLowerCase().includes(queryText.toLowerCase()) ? 0.1 : 0;
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(queryText.toLowerCase())) ? 0.1 : 0;
    
    // 最终分数 = 向量相似度 + 关键词匹配加权
    const score = similarity + titleMatch + summaryMatch + tagMatch;
    
    // 返回带有分数属性的项目
    return { ...item, score };
  });
  
  // 按相似度分数排序
  scoredItems.sort((a, b) => b.score - a.score);
  
  // 应用分页
  const paginatedItems = scoredItems.slice(offset, offset + limit);
  
  // 移除分数属性并返回结果
  return paginatedItems.map(({ score, ...item }) => item);
}

/**
 * 处理GET请求，支持URL查询参数
 */
export async function GET(request: NextRequest) {
  // 从URL获取查询参数
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const categories = searchParams.getAll('category');
  const tags = searchParams.getAll('tag');
  const author = searchParams.get('author') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  
  // 构建搜索请求
  const searchRequest: SearchRequest = {
    query,
    filter: {
      categories: categories.length > 0 ? categories : undefined,
      tags: tags.length > 0 ? tags : undefined,
      author
    },
    limit,
    offset
  };
  
  // 复用POST处理逻辑
  const response = await POST(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(searchRequest)
    })
  );
  
  return response;
} 