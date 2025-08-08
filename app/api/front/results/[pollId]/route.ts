import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { decodeId } from '@/lib/hashids'

// 投票結果取得API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    const { pollId } = await params
    const { searchParams } = new URL(request.url)
    const languageId = searchParams.get('languageId') || 'en'

    // hashIdをデコードしてデータベースIDを取得
    const decodedPollId = decodeId(pollId)
    if (!decodedPollId) {
      return NextResponse.json(
        { error: '無効な投票IDです' },
        { status: 400 }
      )
    }

    // 投票情報取得
    const poll = await prisma.poll.findUnique({
      where: { 
        id: decodedPollId,
        isPublic: true,
      },
      include: {
        options: {
          include: {
            translations: {
              where: {
                languageId,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
        translations: {
          where: {
            languageId,
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
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // 結果計算
    const totalVotes = poll._count.votes
    const results = poll.options.map((option: any) => ({
      id: option.id,
      text: option.translations[0]?.text || '',
      votes: option._count.votes,
      percentage: totalVotes > 0 ? Math.round((option._count.votes / totalVotes) * 100) : 0,
    }))

    return NextResponse.json({
      poll: {
        id: poll.id,
        title: poll.translations[0]?.title || '',
        description: poll.translations[0]?.description || '',
        totalVotes,
      },
      results,
    })
  } catch (error) {
    console.error('投票結果取得エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poll results' },
      { status: 500 }
    )
  }
} 