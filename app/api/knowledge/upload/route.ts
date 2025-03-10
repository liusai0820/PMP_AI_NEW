import { NextRequest, NextResponse } from 'next/server';
import { knowledgeService } from '@/lib/services/knowledgeService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 获取文件
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: '未提供文件' },
        { status: 400 }
      );
    }
    
    // 获取元数据
    const projectId = formData.get('projectId') as string;
    const documentType = formData.get('documentType') as string;
    const documentDate = formData.get('documentDate') as string;
    const description = formData.get('description') as string;
    
    if (!projectId) {
      return NextResponse.json(
        { error: '缺少必要字段：projectId' },
        { status: 400 }
      );
    }
    
    // 构建元数据
    const metadata = {
      projectId,
      documentType: documentType || '未分类',
      documentDate: documentDate || new Date().toISOString().split('T')[0],
      description: description || '',
      uploadedAt: new Date().toISOString(),
    };
    
    // 将文件转换为Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // 处理文档
    const result = await knowledgeService.processDocument(
      fileBuffer,
      file.name,
      file.type,
      metadata
    );
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      chunks: result.chunks,
      fileName: file.name,
      fileSize: file.size,
      metadata
    });
    
  } catch (error) {
    console.error('文档上传处理错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文档上传时发生错误' },
      { status: 500 }
    );
  }
}

// 设置较大的请求体大小限制，以支持大文件上传
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}; 