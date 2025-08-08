const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()

// HashIDs設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function verifyAllHashIds() {
  try {
    console.log('🔍 すべてのhashIdを検証中...')
    console.log('')

    // すべての投票を取得
    const polls = await prisma.poll.findMany({
      orderBy: { id: 'asc' }
    })

    console.log(`📊 ${polls.length}件の投票を検証します:`)
    console.log('')

    let allValid = true

    for (const poll of polls) {
      console.log(`投票ID ${poll.id}:`)
      console.log(`  保存されたhashId: "${poll.hashId}"`)
      
      // hashIdをデコード
      const decoded = hashids.decode(poll.hashId)
      console.log(`  デコード結果: ${decoded}`)
      
      // 正しいIDと一致するかチェック
      const isValid = decoded.length > 0 && decoded[0] === poll.id
      console.log(`  有効: ${isValid ? '✅' : '❌'}`)
      
      if (!isValid) {
        allValid = false
      }
      
      // 現在の設定でエンコードした結果
      const currentEncoded = hashids.encode(poll.id)
      console.log(`  現在の設定でエンコード: "${currentEncoded}"`)
      console.log(`  一致: ${poll.hashId === currentEncoded ? '✅' : '❌'}`)
      console.log('')
    }

    if (allValid) {
      console.log('🎉 すべてのhashIdが正常に動作しています！')
    } else {
      console.log('⚠️  一部のhashIdに問題があります')
    }

    // 新しい投票を作成した場合のテスト
    console.log('🧪 新しい投票IDのテスト:')
    const testIds = [1, 2, 13, 14, 15]
    testIds.forEach(id => {
      const encoded = hashids.encode(id)
      const decoded = hashids.decode(encoded)
      console.log(`  ID ${id} -> "${encoded}" -> ${decoded[0]} (${decoded[0] === id ? '✅' : '❌'})`)
    })

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAllHashIds()
