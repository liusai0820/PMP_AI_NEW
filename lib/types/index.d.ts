// 为没有类型定义的模块创建声明
declare module 'pdf-parse';
declare module 'mammoth';

// OCR服务响应类型
interface OCRResponse {
  text: string;
  confidence?: number;
  pages?: number;
  [key: string]: unknown;
}

// 向量数据库相关类型
interface PineconeMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, unknown>;
}

interface PineconeQueryResponse {
  matches: PineconeMatch[];
  namespace?: string;
}

// 扩展Pinecone类型
declare module '@pinecone-database/pinecone' {
  interface QueryOptions {
    vector: number[];
    topK: number;
    includeMetadata?: boolean;
    includeValues?: boolean;
    namespace?: string;
    filter?: Record<string, unknown>;
  }
} 