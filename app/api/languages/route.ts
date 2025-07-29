import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// 言語一覧取得API
export async function GET(request: NextRequest) {
  try {
    const languages = await prisma.language.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(languages)
  } catch (error) {
    console.error('言語一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}

// 言語初期化API（開発用）
export async function POST(request: NextRequest) {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' },
      { code: 'ja', name: '日本語' },
      { code: 'es', name: 'Español' },
      { code: 'pt', name: 'Português' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' },
      { code: 'it', name: 'Italiano' },
    ]

    const createdLanguages = await Promise.all(
      languages.map(async (lang) => {
        return await prisma.language.upsert({
          where: { code: lang.code },
          update: {},
          create: {
            code: lang.code,
            name: lang.name,
            isActive: true,
          },
        })
      })
    )

    return NextResponse.json(createdLanguages, { status: 201 })
  } catch (error) {
    console.error('言語初期化エラー:', error)
    return NextResponse.json(
      { error: 'Failed to initialize languages' },
      { status: 500 }
    )
  }
} 