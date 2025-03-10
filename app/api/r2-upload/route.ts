import { NextRequest, NextResponse } from 'next/server';
import { uploadBase64ToR2 } from '@/lib/services/r2Storage';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { data, contentType, key } = body;

    if (!data || !contentType || !key) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 上传到 R2
    const fileUrl = await uploadBase64ToR2(data, key, contentType);
    
    // 返回文件 URL
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('R2 上传失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传文件失败' },
      { status: 500 }
    );
  }
} 