import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validation'
import { authenticateUser, generateToken } from '@/lib/auth'

// ユーザーログインAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // ユーザー認証
    const user = await authenticateUser(
      validatedData.email,
      validatedData.password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // JWTトークン生成
    const token = generateToken(user.id)

    return NextResponse.json({
      user,
      token,
    })
  } catch (error) {
    console.error('ログインエラー:', error)
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
} 