import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      server: 'ok',
    },
    details: {
      database: null as any,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
        jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
      },
    },
  }

  try {
    // データベース接続テスト
    await prisma.$connect()
    
    // 簡単なクエリを実行してデータベースが正常に動作することを確認
    const pollCount = await prisma.poll.count()
    
    health.checks.database = 'ok'
    health.details.database = {
      connected: true,
      pollCount,
      schema: 'mysql',
    }
    
    await prisma.$disconnect()
  } catch (error) {
    health.checks.database = 'error'
    health.details.database = {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    
    // データベース接続を閉じる
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('データベース切断エラー:', disconnectError)
    }
  }

  // 全体のステータスを決定
  if (health.checks.database === 'error') {
    health.status = 'error'
  }

  const statusCode = health.status === 'ok' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
} 