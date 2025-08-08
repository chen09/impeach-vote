const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabaseHashIds() {
  try {
    console.log('🔍 データベースのhashIdを確認中...')
    console.log('')

    // すべての投票を取得
    const polls = await prisma.poll.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        hashId: true,
        isPublic: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log(`📊 ${polls.length}件の投票を確認しました:`)
    console.log('')

    polls.forEach(poll => {
      console.log(`投票ID ${poll.id}:`)
      console.log(`  hashId: "${poll.hashId}"`)
      console.log(`  isPublic: ${poll.isPublic}`)
      console.log(`  isActive: ${poll.isActive}`)
      console.log(`  createdAt: ${poll.createdAt}`)
      console.log(`  updatedAt: ${poll.updatedAt}`)
      console.log('')
    })

    // 空のhashIdがあるかチェック
    const emptyHashIds = polls.filter(poll => !poll.hashId || poll.hashId === '')
    if (emptyHashIds.length > 0) {
      console.log(`⚠️  空のhashIdがある投票: ${emptyHashIds.length}件`)
      emptyHashIds.forEach(poll => {
        console.log(`  - 投票ID ${poll.id}`)
      })
      console.log('')
    }

    // 重複するhashIdがあるかチェック
    const hashIdCounts = {}
    polls.forEach(poll => {
      if (poll.hashId) {
        hashIdCounts[poll.hashId] = (hashIdCounts[poll.hashId] || 0) + 1
      }
    })

    const duplicates = Object.entries(hashIdCounts).filter(([hashId, count]) => count > 1)
    if (duplicates.length > 0) {
      console.log(`⚠️  重複するhashId: ${duplicates.length}件`)
      duplicates.forEach(([hashId, count]) => {
        console.log(`  - "${hashId}": ${count}回`)
      })
      console.log('')
    }

    console.log('✅ データベース確認完了')

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseHashIds()
