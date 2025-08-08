const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()

// HashIDs設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function debugHashIds() {
  try {
    console.log('🔧 HashIDs設定:')
    console.log(`   Secret: ${hashidsSecret.substring(0, 20)}...`)
    console.log(`   Environment: ${process.env.HASHIDS_SECRET ? 'SET' : 'NOT_SET'}`)
    console.log('')

    // データベースから投票を取得
    const polls = await prisma.poll.findMany({
      take: 5,
      orderBy: { id: 'asc' }
    })

    console.log('📊 データベースの投票:')
    polls.forEach(poll => {
      const encodedId = hashids.encode(poll.id)
      const decodedId = hashids.decode(encodedId)
      
      console.log(`   ID: ${poll.id} -> Encoded: ${encodedId} -> Decoded: ${decodedId[0]}`)
    })
    console.log('')

    // 問題のhashIdをテスト
    const problemHashId = '9Xg6WpK1'
    const decodedProblem = hashids.decode(problemHashId)
    console.log(`🔍 問題のhashId: ${problemHashId}`)
    console.log(`   Decoded: ${decodedProblem}`)
    console.log(`   Length: ${decodedProblem.length}`)
    console.log(`   Valid: ${decodedProblem.length > 0}`)
    console.log('')

    // すべての投票IDをエンコードして、問題のhashIdと一致するものがあるかチェック
    console.log('🔍 全投票IDのエンコード結果:')
    polls.forEach(poll => {
      const encoded = hashids.encode(poll.id)
      const matches = encoded === problemHashId
      console.log(`   ${poll.id} -> ${encoded} ${matches ? '✅ MATCH!' : ''}`)
    })

  } catch (error) {
    console.error('エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugHashIds()
