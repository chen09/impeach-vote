const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔍 データベース接続をテスト中...')
    
    // データベース接続テスト
    await prisma.$connect()
    console.log('✅ データベース接続成功')
    
    // 投票数を確認
    const pollCount = await prisma.poll.count()
    console.log(`📊 投票数: ${pollCount}`)
    
    if (pollCount > 0) {
      // 最初の投票を取得
      const firstPoll = await prisma.poll.findFirst({
        include: {
          user: {
            select: {
              name: true
            }
          },
          translations: {
            include: {
              language: true
            }
          },
          options: {
            include: {
              translations: true
            }
          },
          _count: {
            select: {
              votes: true
            }
          }
        }
      })
      
      console.log('📋 最初の投票:')
      console.log(`  ID: ${firstPoll.id}`)
      console.log(`  isPublic: ${firstPoll.isPublic}`)
      console.log(`  isActive: ${firstPoll.isActive}`)
      console.log(`  ユーザー: ${firstPoll.user.name}`)
      console.log(`  翻訳数: ${firstPoll.translations.length}`)
      console.log(`  オプション数: ${firstPoll.options.length}`)
      console.log(`  投票数: ${firstPoll._count.votes}`)
    }
    
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()
