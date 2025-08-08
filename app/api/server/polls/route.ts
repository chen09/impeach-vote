import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPollSchema } from '@/lib/validation'
import { verifyToken } from '@/lib/auth'
import { encodeId } from '@/lib/hashids'

// 投票作成API
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPollSchema.parse(body)

    // 投票作成（多言語対応）
    const poll = await prisma.poll.create({
      data: {
        isPublic: validatedData.isPublic,
        userId: decoded.userId,
        translations: {
          create: validatedData.translations.map((translation: any) => ({
            languageId: translation.languageId,
            title: translation.title,
            description: translation.description,
          })),
        },
        options: {
          create: validatedData.options.map((option: any) => ({
            translations: {
              create: option.translations.map((translation: any) => ({
                languageId: translation.languageId,
                text: translation.text,
              })),
            },
          })),
        },
      },
      include: {
        options: {
          include: {
            translations: true,
          },
        },
        translations: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 作成された投票のIDを使用してhashIdを生成
    const hashId = encodeId(Number(poll.id))
    
    // hashIdを更新
    const updatedPoll = await prisma.poll.update({
      where: { id: Number(poll.id) },
      data: { hashId },
      include: {
        options: {
          include: {
            translations: true,
          },
        },
        translations: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedPoll, { status: 201 })
  } catch (error) {
    console.error('投票作成エラー:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}

// 投票一覧取得API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isPublic = searchParams.get('isPublic')
    const languageId = searchParams.get('languageId') || 'en'

    const where: Record<string, unknown> = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }

    const polls = await prisma.poll.findMany({
      where,
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
    })

    return NextResponse.json(polls)
  } catch (error) {
    console.error('投票一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
} 