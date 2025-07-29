import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { voteSchema } from '@/lib/validation'

// 公開投票実行API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = voteSchema.parse(body)

    // 投票が存在するかチェック
    const poll = await prisma.poll.findUnique({
      where: { 
        id: validatedData.pollId,
        isPublic: true,
        isActive: true,
      },
      include: { options: true },
    })

    if (!poll) {
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
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

    // 匿名投票のため、ユーザーIDはnull
    // 投票実行
    const vote = await prisma.vote.create({
      data: {
        userId: null,
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