import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取所有活动
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 10, // 只返回最近10条活动
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json(
      { error: '获取活动列表失败' },
      { status: 500 }
    );
  }
} 