import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// 定义临时文件目录
const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
// 定义公共访问URL前缀 - 使用环境变量或默认值
// 注意：对于本地开发，我们需要一个可公开访问的URL，因为Mistral API无法访问localhost
const PUBLIC_URL_PREFIX = process.env.NEXT_PUBLIC_EXTERNAL_URL;

// 检查是否设置了外部URL
if (!PUBLIC_URL_PREFIX || PUBLIC_URL_PREFIX === 'https://your-actual-domain.com') {
  console.warn('警告: NEXT_PUBLIC_EXTERNAL_URL 未正确设置。请在 .env.local 文件中设置一个真实的、可公开访问的 HTTPS URL。');
}

/**
 * 处理 POST 请求，上传文件
 */
export async function POST(request: NextRequest) {
  try {
    // 确保临时目录存在
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true });
    }

    // 解析请求体
    const body = await request.json();
    const { data, extension, filename } = body;

    if (!data || !extension || !filename) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查是否设置了外部URL
    if (!PUBLIC_URL_PREFIX || PUBLIC_URL_PREFIX === 'https://your-actual-domain.com') {
      return NextResponse.json(
        { error: '未设置外部URL。请在 .env.local 文件中设置 NEXT_PUBLIC_EXTERNAL_URL 环境变量。' },
        { status: 500 }
      );
    }

    // 构建文件路径
    const filePath = path.join(TEMP_DIR, filename);

    // 将 base64 数据写入文件
    await writeFile(filePath, Buffer.from(data, 'base64'));

    // 返回文件 URL
    const fileUrl = `${PUBLIC_URL_PREFIX}/temp/${filename}`;
    
    console.log('生成的文件URL:', fileUrl);

    // 设置定时任务，1小时后删除文件
    setTimeout(async () => {
      try {
        const { unlink } = await import('fs/promises');
        await unlink(filePath);
        console.log(`临时文件已删除: ${filePath}`);
      } catch (err) {
        console.error(`删除临时文件失败: ${filePath}`, err);
      }
    }, 60 * 60 * 1000); // 1小时

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
} 