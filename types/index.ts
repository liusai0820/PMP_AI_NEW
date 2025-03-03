export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  summary?: string;
  tags: string[];
  autoTags?: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  sourceDocument?: string;
  sourceType?: string;
  fileSize?: number;
  embeddings?: boolean;
  vectorId?: string;
  relatedItems?: string[];
  views?: number;
}

export interface DocumentUploadRequest {
  file: File;
  title: string;
  category: string;
  tags: string[];
  description?: string;
}

export interface DocumentUploadResponse {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  sourceDocument: string;
  sourceType: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface VectorizeRequest {
  knowledgeId: string;
  content: string;
  chunkSize?: number;
  overlap?: number;
}

export interface VectorizeResponse {
  knowledgeId: string;
  chunks: number;
  vectorIds: string[];
  status: 'completed' | 'failed';
  message?: string;
}

export interface AutoTagRequest {
  knowledgeId: string;
  content: string;
  existingTags?: string[];
}

export interface AutoTagResponse {
  knowledgeId: string;
  suggestedTags: string[];
  suggestedCategory: string;
  suggestedSummary: string;
  confidence: number;
}

export interface SearchRequest {
  query: string;
  filter?: {
    categories?: string[];
    tags?: string[];
    dateRange?: {start: string, end: string};
    author?: string;
  };
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: KnowledgeItem[];
  total: number;
  query: string;
  timeTaken: number;
}

export interface KnowledgeChunk {
  id: string;
  knowledgeId: string;
  content: string;
  index: number;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface RAGRequest {
  query: string;
  maxResults?: number;
  threshold?: number;
}

export interface RAGResponse {
  answer: string;
  sources: {
    knowledgeId: string;
    title: string;
    content: string;
    relevance: number;
  }[];
} 