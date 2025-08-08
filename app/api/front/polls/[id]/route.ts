import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { decodeId } from '@/lib/hashids'

// 公開投票詳細取得API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`🔍 API呼び出し: hashId=${id}`)
    
    // hashIdをデコードしてデータベースIDを取得
    const pollId = decodeId(id)
    console.log(`🔓 デコード結果: pollId=${pollId} (型: ${typeof pollId})`)
    
    if (!pollId) {
      console.log('❌ 無効な投票ID')
      return NextResponse.json(
        { error: '無効な投票IDです' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 データベース検索: id=${pollId}`)
    const poll = await prisma.poll.findUnique({
      where: { 
        id: pollId,
        isPublic: true,
        isActive: true,
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
        options: {
          include: {
            translations: {
              include: {
                language: true,
              },
            },
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
      console.log('❌ 投票が見つかりません')
      return NextResponse.json(
        { error: '投票が見つかりません' },
        { status: 404 }
      )
    }

    console.log('✅ 投票取得成功')
    // 英語の翻訳を取得
    const englishTranslation = poll.translations.find((t: any) => t.language.code === 'en')
    const title = englishTranslation?.title || 'Untitled Poll'
    const description = englishTranslation?.description

    // オプションの英語翻訳を取得
    const optionsWithText = poll.options.map((option: any) => {
      const englishOptionTranslation = option.translations.find((t: any) => t.language.code === 'en')
      const text = englishOptionTranslation?.text || `Option ${option.id.slice(-4)}`
      
      return {
        ...option,
        text,
      }
    })

    return NextResponse.json({
      ...poll,
      title,
      description,
      options: optionsWithText,
    })
  } catch (error) {
    console.error('投票詳細取得エラー:', error)
    return NextResponse.json(
      { error: '投票詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
} 