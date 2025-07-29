import { NextRequest, NextResponse } from 'next/server'
import { createUserSchema } from '@/lib/validation'
import { createUser, generateToken } from '@/lib/auth'

// ユーザー登録API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // ユーザー作成
    const user = await createUser(
      validatedData.email,
      validatedData.name,
      validatedData.password
    )

    // JWTトークン生成
    const token = generateToken(user.id)

    return NextResponse.json({
      user,
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('ユーザー登録エラー:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'このメールアドレスは既に使用されています' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
} 