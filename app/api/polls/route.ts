import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // 公開投票を取得（最新順）
    const polls = await prisma.poll.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        translations: {
          include: {
            language: true,
          },
        },
        options: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ polls })
  } catch (error) {
    console.error('Failed to fetch polls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
} 