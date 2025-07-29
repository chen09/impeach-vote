import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// 投票詳細取得API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: {
              select: {
                votes: true,
              },
            },
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
    })

    if (!poll) {
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(poll)
  } catch (error) {
    console.error('投票詳細取得エラー:', error)
    return NextResponse.json(
      { error: '投票詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 投票削除API
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { verifyToken } = await import('@/lib/auth')
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    // 投票の所有者チェック
    const poll = await prisma.poll.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!poll) {
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
      )
    }

    if (poll.userId !== decoded.userId) {
      return NextResponse.json(
        { error: '削除権限がありません' },
        { status: 403 }
      )
    }

    // 投票削除
    await prisma.poll.delete({
      where: { id },
    })

    return NextResponse.json({ message: '投票を削除しました' })
  } catch (error) {
    console.error('投票削除エラー:', error)
    return NextResponse.json(
      { error: '投票の削除に失敗しました' },
      { status: 500 }
    )
  }
} 