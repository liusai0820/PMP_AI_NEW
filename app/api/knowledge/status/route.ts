import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pinecone } from '@pinecone-database/pinecone';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 初始化Pinecone客户端
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
      // Pinecone 控制器 URL 格式：https://<index-name>-<project-id>.svc.<environment>.pinecone.io
      controllerHostUrl: `https://${process.env.PINECONE_INDEX}-${process.env.PINECONE_PROJECT_ID}.svc.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`
    });
    
    // 获取索引信息
    const indexName = process.env.PINECONE_INDEX || '';
    const index = pinecone.Index(indexName);
    const indexStats = await index.describeIndexStats();
    
    // 从数据库获取文档信息
    const documentsCount = await prisma.document.count();
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        projectId: true,
        vectorized: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      vectorDatabase: {
        indexName: indexName,
        vectorCount: indexStats.totalVectorCount,
        namespaces: indexStats.namespaces,
        dimensions: 1536
      },
      documents: {
        total: documentsCount,
        recent: documents
      }
    });
  } catch (error) {
    console.error('获取知识库状态失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取知识库状态失败',
        message: '无法连接到向量数据库或数据库，请检查配置和环境变量：PINECONE_API_KEY, PINECONE_PROJECT_ID, PINECONE_INDEX'
      },
      { status: 500 }
    );
  }
} 