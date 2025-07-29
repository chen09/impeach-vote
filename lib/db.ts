import { PrismaClient } from '@prisma/client'

// Prismaクライアントのグローバルインスタンス
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// データベースクライアントの作成
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 開発環境でのみグローバルに保存
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 