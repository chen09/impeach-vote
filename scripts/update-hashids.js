const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()

// HashIDs設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function updateHashIds() {
  try {
    console.log('🔧 HashIDs設定:')
    console.log(`   Secret: ${hashidsSecret.substring(0, 20)}...`)
    console.log(`   Environment: ${process.env.HASHIDS_SECRET ? 'SET' : 'NOT_SET'}`)
    console.log('')

    // すべての投票を取得
    const polls = await prisma.poll.findMany({
      orderBy: { id: 'asc' }
    })

    console.log(`📊 ${polls.length}件の投票を処理します...`)
    console.log('')

    for (const poll of polls) {
      const newHashId = hashids.encode(poll.id)
      const oldHashId = poll.hashId
      
      console.log(`投票ID ${poll.id}:`)
      console.log(`  古いhashId: ${oldHashId}`)
      console.log(`  新しいhashId: ${newHashId}`)
      
      // hashIdを更新
      await prisma.poll.update({
        where: { id: poll.id },
        data: { hashId: newHashId }
      })
      
      console.log(`  ✅ 更新完了`)
      console.log('')
    }

    console.log('🎉 すべての投票のhashIdを更新しました！')

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateHashIds()
