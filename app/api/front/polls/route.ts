import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// 公開投票一覧取得API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const languageId = searchParams.get('languageId') || 'en'
    const skip = (page - 1) * limit

    const polls = await prisma.poll.findMany({
      where: {
        isPublic: true,
        isActive: true,
      },
      include: {
        options: {
          include: {
            translations: {
              where: {
                languageId,
              },
            },
          },
        },
        translations: {
          where: {
            languageId,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
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
      skip,
      take: limit,
    })

    // 総件数取得
    const total = await prisma.poll.count({
      where: {
        isPublic: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      polls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('公開投票一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
} 