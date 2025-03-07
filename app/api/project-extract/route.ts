import { NextRequest, NextResponse } from 'next/server';
import { ocrService } from '@/lib/services/ocr';
import { extractProjectInfoFromOCR } from '@/lib/services/projectExtractor';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { data, isImage = false, options = {} } = body;

    if (!data) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    console.log('项目提取API请求:', {
      isImage,
      dataLength: data.length,
      options
    });

    // 第一步：OCR处理
    console.log('开始OCR处理...');
    const ocrResult = isImage
      ? await ocrService.processImage(data, options)
      : await ocrService.processDocument(data, options);
    
    console.log('OCR处理完成，页数:', ocrResult.pages.length);

    // 第二步：提取项目信息
    console.log('开始提取项目信息...');
    const projectInfo = await extractProjectInfoFromOCR(ocrResult);
    
    // 返回结果
    return NextResponse.json({
      ocrResult,
      projectInfo
    });
  } catch (error) {
    console.error('项目提取失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文件时发生错误' },
      { status: 500 }
    );
  }
} 