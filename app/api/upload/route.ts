import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { uploadBase64ToR2 } from '@/lib/services/r2Storage';
import { v4 as uuidv4 } from 'uuid';

// 定义临时文件目录
const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
// 定义公共访问URL前缀 - 使用环境变量或默认值
// 注意：对于本地开发，我们需要一个可公开访问的URL，因为Mistral API无法访问localhost
const PUBLIC_URL_PREFIX = process.env.NEXT_PUBLIC_EXTERNAL_URL;

// 检查是否设置了外部URL
if (!PUBLIC_URL_PREFIX) {
  console.warn('警告: NEXT_PUBLIC_EXTERNAL_URL 未设置。请在 .env.local 文件中设置一个真实的、可公开访问的 HTTPS URL。');
}

/**
 * 处理 POST 请求，上传文件
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { data, extension, filename } = body;

    if (!data || !extension) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查是否设置了外部URL
    if (!PUBLIC_URL_PREFIX) {
      return NextResponse.json(
        { error: '未设置外部URL。请在 .env.local 文件中设置 NEXT_PUBLIC_EXTERNAL_URL 环境变量。' },
        { status: 500 }
      );
    }

    // 生成唯一文件名
    const uniqueFilename = filename || `${uuidv4()}.${extension}`;
    
    // 确定内容类型
    let contentType = 'application/octet-stream';
    if (extension === 'pdf') {
      contentType = 'application/pdf';
    } else if (['jpg', 'jpeg'].includes(extension)) {
      contentType = 'image/jpeg';
    } else if (extension === 'png') {
      contentType = 'image/png';
    } else if (extension === 'gif') {
      contentType = 'image/gif';
    }

    try {
      // 尝试上传到 Cloudflare R2
      const fileUrl = await uploadBase64ToR2(data, `temp/${uniqueFilename}`, contentType);
      console.log('文件已上传到 Cloudflare R2，URL:', fileUrl);
      
      return NextResponse.json({ url: fileUrl });
    } catch (r2Error) {
      console.error('上传到 Cloudflare R2 失败，回退到本地存储:', r2Error);
      
      // 确保临时目录存在
      if (!existsSync(TEMP_DIR)) {
        await mkdir(TEMP_DIR, { recursive: true });
      }

      // 构建文件路径
      const filePath = path.join(TEMP_DIR, uniqueFilename);

      // 将 base64 数据写入文件
      await writeFile(filePath, Buffer.from(data, 'base64'));

      // 返回文件 URL
      const fileUrl = `${PUBLIC_URL_PREFIX}/temp/${uniqueFilename}`;
      
      console.log('文件已上传到本地存储，URL:', fileUrl);

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
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
} 