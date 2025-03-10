import { PrismaClient } from '@prisma/client';
import { ocrService } from './ocr';
import { createHash } from 'crypto';
import OpenAI from 'openai';
import { Document as LangchainDocument } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { Pinecone } from '@pinecone-database/pinecone';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 初始化Pinecone客户端
let pineconeClient: Pinecone | null = null;
async function initPinecone() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
      controllerHostUrl: `https://${process.env.PINECONE_INDEX}-${process.env.PINECONE_PROJECT_ID}.svc.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`
    });
  }
  return pineconeClient;
}

export class KnowledgeService {
  /**
   * 处理并向量化文档
   * @param fileBuffer 文件缓冲区
   * @param fileName 文件名
   * @param fileType 文件类型
   * @param metadata 文档元数据
   */
  async processDocument(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    metadata: Record<string, unknown>
  ) {
    try {
      // 1. 生成文档ID
      const fileHash = createHash('md5').update(fileBuffer).digest('hex');
      const documentId = `doc_${fileHash}`;
      
      // 2. 提取文本内容
      let textContent = '';
      
      if (fileType === 'application/pdf') {
        // 检查是否为扫描型PDF
        const isScanPdf = await this.checkIfScanPdf(fileBuffer);
        
        if (isScanPdf) {
          // 使用OCR处理扫描型PDF
          console.log('检测到扫描型PDF，使用OCR处理');
          const ocrResult = await ocrService.processDocument(
            fileBuffer.toString('base64'),
            { documentUrl: '' } // 使用空字符串，因为我们直接传递了base64数据
          );
          // 使用类型断言确保OCR结果包含text属性
          textContent = (ocrResult as unknown as OCRResponse).text || '';
        } else {
          // 处理文字型PDF
          console.log('检测到文字型PDF，直接提取文本');
          textContent = await this.extractTextFromPdf(fileBuffer);
        }
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // 处理DOCX文件
        console.log('处理DOCX文件');
        textContent = await this.extractTextFromDocx(fileBuffer);
      } else {
        throw new Error('不支持的文件类型');
      }
      
      // 3. 保存文档记录到数据库
      const documentData: any = {
        id: documentId,
        name: fileName,
        type: fileType,
        content: textContent,
      };
      
      // 只有当projectId存在时才添加到数据中
      if (metadata.projectId && typeof metadata.projectId === 'string') {
        documentData.projectId = metadata.projectId;
      }
      
      const documentRecord = await prisma.document.create({
        data: documentData
      });
      
      console.log(`文档已保存到数据库，ID: ${documentRecord.id}`);
      
      // 4. 文本分块
      const chunks = await this.splitTextIntoChunks(textContent);
      console.log(`文本已分割为 ${chunks.length} 个块`);
      
      // 5. 向量化并存储
      await this.vectorizeAndStore(chunks, documentId, metadata);
      console.log('文档已向量化并存储到Pinecone');
      
      return {
        success: true,
        documentId,
        chunks: chunks.length,
      };
    } catch (error) {
      console.error('处理文档失败:', error);
      throw error;
    }
  }
  
  /**
   * 检查PDF是否为扫描型
   */
  private async checkIfScanPdf(fileBuffer: Buffer): Promise<boolean> {
    // 简单实现：提取少量文本，如果几乎没有文本则可能是扫描型
    try {
      const data = await pdfParse(fileBuffer, { max: 1 }); // 只解析第一页
      
      // 如果提取的文本很少，可能是扫描型PDF
      const textLength = data.text.trim().length;
      console.log(`PDF第一页文本长度: ${textLength}`);
      return textLength < 100;
    } catch (error) {
      console.error('检查PDF类型失败:', error);
      return true; // 出错时假设为扫描型PDF
    }
  }
  
  /**
   * 从PDF提取文本
   */
  private async extractTextFromPdf(fileBuffer: Buffer, pageLimit?: number): Promise<string> {
    const options = {
      max: pageLimit || 0, // 0表示所有页面
    };
    
    const data = await pdfParse(fileBuffer, options);
    return data.text;
  }
  
  /**
   * 从DOCX提取文本
   */
  private async extractTextFromDocx(fileBuffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }
  
  /**
   * 将文本分割成块
   */
  private async splitTextIntoChunks(text: string): Promise<LangchainDocument[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    return splitter.createDocuments([text]);
  }
  
  /**
   * 向量化文本块并存储到向量数据库
   */
  private async vectorizeAndStore(
    chunks: LangchainDocument[],
    documentId: string,
    metadata: Record<string, unknown>
  ) {
    try {
      // 初始化Pinecone
      const pinecone = await initPinecone();
      const indexName = process.env.PINECONE_INDEX || '';
      const index = pinecone.Index(indexName);
      
      // 为每个块添加元数据
      const documentsWithMetadata = chunks.map((chunk, i) => {
        return new LangchainDocument({
          pageContent: chunk.pageContent,
          metadata: {
            ...chunk.metadata,
            ...metadata,
            documentId,
            chunkIndex: i,
            content: chunk.pageContent,
          },
        });
      });
      
      // 创建嵌入并存储向量
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      console.log(`开始处理 ${documentsWithMetadata.length} 个文本块的向量化...`);
      
      // 批量处理向量
      const batchSize = 10;
      for (let i = 0; i < documentsWithMetadata.length; i += batchSize) {
        const batch = documentsWithMetadata.slice(i, i + batchSize);
        
        // 并行生成向量
        const vectors = await Promise.all(
          batch.map(async (doc) => {
            const vector = await embeddings.embedQuery(doc.pageContent);
            
            // 将元数据转换为符合Pinecone要求的格式
            const metadataForPinecone: Record<string, string | number | boolean> = {};
            Object.entries(doc.metadata).forEach(([key, value]) => {
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                metadataForPinecone[key] = value;
              } else {
                metadataForPinecone[key] = JSON.stringify(value);
              }
            });
            
            return {
              id: `${documentId}_${doc.metadata.chunkIndex}`,
              values: vector,
              metadata: metadataForPinecone,
            };
          })
        );
        
        // 批量上传向量到Pinecone
        await index.upsert(vectors);
        
        console.log(`已处理 ${i + batch.length}/${documentsWithMetadata.length} 个文本块`);
      }
      
      // 更新文档状态为已向量化
      await prisma.document.update({
        where: { id: documentId },
        data: { vectorized: true },
      });
      
      console.log(`文档 ${documentId} 的向量化处理完成`);
    } catch (error) {
      console.error('向量化处理失败:', error);
      throw error;
    }
  }
  
  /**
   * 语义搜索
   */
  async semanticSearch(
    query: string,
    projectId?: string,
    filter?: Record<string, unknown>,
    limit: number = 5
  ) {
    try {
      // 初始化Pinecone
      const pinecone = await initPinecone();
      const index = pinecone.Index(process.env.PINECONE_INDEX || '');
      
      // 创建嵌入
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      // 生成查询向量
      const queryVector = await embeddings.embedQuery(query);
      
      // 执行相似度搜索
      const searchResults = await index.query({
        vector: queryVector,
        topK: limit,
        includeMetadata: true,
        filter: filter,
      });
      
      // 将结果转换为LangchainDocument格式
      const documents = searchResults.matches.map((match) => {
        const metadata = match.metadata || {};
        return new LangchainDocument({
          pageContent: metadata.content as string || '',
          metadata: metadata as Record<string, unknown>,
        });
      });
      
      return documents;
    } catch (error) {
      console.error('语义搜索失败:', error);
      throw error;
    }
  }
  
  /**
   * 基于检索的问答
   */
  async retrievalQA(
    question: string,
    projectId?: string,
    filter?: Record<string, unknown>
  ) {
    try {
      // 1. 检索相关文档
      const relevantDocs = await this.semanticSearch(question, projectId, filter);
      
      // 2. 构建上下文
      const context = relevantDocs.map((doc: LangchainDocument) => doc.pageContent).join('\n\n');
      
      // 3. 构建提示词
      const prompt = `
你是一个项目管理助手，基于以下信息回答问题。如果无法从提供的信息中找到答案，请说明你不知道，不要编造信息。

问题: ${question}

相关信息:
${context}

请用中文回答。
`;
      
      // 4. 调用大模型生成回答
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一个专业的项目管理助手，擅长解读项目文档并提供准确的信息。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });
      
      // 5. 返回结果
      return {
        answer: completion.choices[0].message.content,
        sources: relevantDocs.map((doc: LangchainDocument) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
        })),
      };
    } catch (error) {
      console.error('问答失败:', error);
      throw error;
    }
  }
}

export const knowledgeService = new KnowledgeService(); 