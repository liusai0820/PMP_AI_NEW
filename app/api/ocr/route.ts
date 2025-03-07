import { NextRequest, NextResponse } from 'next/server';
import { ocrService } from '@/lib/services/ocr';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { 
      data, 
      isImage = false, 
      options = {},
      documentUrl,
      imageUrl
    } = body;

    if (!data && !documentUrl && !imageUrl) {
      return NextResponse.json(
        { error: '缺少必要参数，需要提供data、documentUrl或imageUrl之一' },
        { status: 400 }
      );
    }

    console.log('OCR API 请求:', {
      isImage,
      hasData: !!data,
      hasDocumentUrl: !!documentUrl,
      hasImageUrl: !!imageUrl,
      options
    });

    // 根据文件类型选择处理方法
    const result = isImage
      ? await ocrService.processImage(data || '', { ...options, imageUrl })
      : await ocrService.processDocument(data || '', { ...options, documentUrl });

    return NextResponse.json(result);
  } catch (error) {
    console.error('OCR处理失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文件时发生错误' },
      { status: 500 }
    );
  }
} 