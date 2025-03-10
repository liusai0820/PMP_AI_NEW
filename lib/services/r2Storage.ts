'use server';

import { S3Client, DeleteObjectCommand, ObjectCannedACL, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Cloudflare R2 配置
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'default-bucket';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-0711119e9c2f45d086d1017a74c99863.r2.dev';

// 检查配置
const isR2Configured = !!R2_ACCOUNT_ID && !!R2_ACCESS_KEY_ID && !!R2_SECRET_ACCESS_KEY;

if (!isR2Configured) {
  console.warn('警告: Cloudflare R2 配置不完整，将使用本地存储作为备选方案');
} else {
  console.log('Cloudflare R2 配置已完成，使用以下配置:');
  console.log(`- 账户ID: ${R2_ACCOUNT_ID}`);
  console.log(`- 存储桶: ${R2_BUCKET_NAME}`);
  console.log(`- 公共URL: ${R2_PUBLIC_URL}`);
}

// 创建 S3 客户端
const s3Client = isR2Configured ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
}) : null;

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  publicRead?: boolean;
}

/**
 * 将 Buffer 上传到 Cloudflare R2
 */
export async function uploadBufferToR2(
  buffer: Buffer,
  key: string,
  options: UploadOptions = {}
): Promise<string> {
  try {
    // 检查配置
    if (!isR2Configured || !s3Client) {
      throw new Error('Cloudflare R2 配置不完整');
    }

    // 设置上传参数
    const params: PutObjectCommandInput = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: options.contentType,
      Metadata: options.metadata,
    };
    
    // 如果需要公开访问，添加ACL
    if (options.publicRead) {
      params.ACL = 'public-read' as ObjectCannedACL;
    }

    // 上传文件
    const upload = new Upload({
      client: s3Client,
      params,
    });

    await upload.done();
    
    // 返回公共 URL
    const fileUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log(`文件已上传到 Cloudflare R2，URL: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error('上传到 Cloudflare R2 失败:', error);
    throw new Error(`上传到 Cloudflare R2 失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 将 base64 数据上传到 Cloudflare R2
 */
export async function uploadBase64ToR2(
  base64Data: string,
  key: string,
  contentType: string
): Promise<string> {
  try {
    // 确保 base64 数据不包含前缀
    const cleanBase64 = base64Data.startsWith('data:') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    // 转换为 Buffer
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    // 上传到 R2
    return await uploadBufferToR2(buffer, key, {
      contentType,
      publicRead: true,
    });
  } catch (error) {
    console.error('上传 base64 数据到 Cloudflare R2 失败:', error);
    throw new Error(`上传 base64 数据到 Cloudflare R2 失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从 Cloudflare R2 删除文件
 */
export async function deleteFileFromR2(key: string): Promise<void> {
  try {
    // 检查配置
    if (!isR2Configured || !s3Client) {
      throw new Error('Cloudflare R2 配置不完整');
    }

    // 删除文件
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    
    await s3Client.send(deleteCommand);
    console.log(`文件已从 Cloudflare R2 删除: ${key}`);
  } catch (error) {
    console.error('从 Cloudflare R2 删除文件失败:', error);
    throw new Error(`从 Cloudflare R2 删除文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }
} 