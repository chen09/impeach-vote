import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { voteSchema } from '@/lib/validation'
import { verifyToken } from '@/lib/auth'

// 投票実行API
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = voteSchema.parse(body)

    // 投票が存在するかチェック
    const poll = await prisma.poll.findUnique({
      where: { id: validatedData.pollId },
      include: { options: true },
    })

    if (!poll) {
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
      )
    }

    if (!poll.isActive) {
      return NextResponse.json(
        { error: 'この投票は終了しています' },
        { status: 400 }
      )
    }

    // 選択肢が存在するかチェック
    const option = poll.options.find((opt: any) => opt.id === validatedData.optionId)
    if (!option) {
      return NextResponse.json(
        { error: '無効な選択肢です' },
        { status: 400 }
      )
    }

    // 既に投票済みかチェック
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_pollId: {
          userId: decoded.userId,
          pollId: validatedData.pollId,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: '既に投票済みです' },
        { status: 400 }
      )
    }

    // 投票実行
    const vote = await prisma.vote.create({
      data: {
        userId: decoded.userId,
        pollId: validatedData.pollId,
        optionId: validatedData.optionId,
      },
      include: {
        option: {
          include: {
            translations: true,
          },
        },
        poll: {
          include: {
            translations: true,
          },
        },
      },
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    console.error('投票実行エラー:', error)
    return NextResponse.json(
      { error: '投票の実行に失敗しました' },
      { status: 500 }
    )
  }
}

// 投票結果取得API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pollId = searchParams.get('pollId')

    if (!pollId) {
      return NextResponse.json(
        { error: '投票IDが必要です' },
        { status: 400 }
      )
    }

    const votes = await prisma.vote.findMany({
      where: { pollId },
      include: {
        option: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(votes)
  } catch (error) {
    console.error('投票結果取得エラー:', error)
    return NextResponse.json(
      { error: '投票結果の取得に失敗しました' },
      { status: 500 }
    )
  }
} 