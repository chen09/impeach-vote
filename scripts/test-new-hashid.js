const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()

// HashIDs設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function testNewHashId() {
  try {
    console.log('🔧 HashIDs設定:')
    console.log(`   Secret: ${hashidsSecret.substring(0, 20)}...`)
    console.log('')

    // 新しいhashIdをテスト
    const newHashId = '8KBq3dV6'
    const decoded = hashids.decode(newHashId)
    
    console.log(`🔍 新しいhashId: ${newHashId}`)
    console.log(`   Decoded: ${decoded}`)
    console.log(`   Length: ${decoded.length}`)
    console.log(`   Valid: ${decoded.length > 0}`)
    
    if (decoded.length > 0) {
      const pollId = decoded[0]
      console.log(`   Poll ID: ${pollId}`)
      
      // データベースから投票を取得
      const poll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: {
          translations: true,
          options: true,
        },
      })
      
      if (poll) {
        console.log('✅ 投票が見つかりました:')
        console.log(`  ID: ${poll.id}`)
        console.log(`  HashID: ${poll.hashId}`)
        console.log(`  isPublic: ${poll.isPublic}`)
        console.log(`  isActive: ${poll.isActive}`)
        console.log(`  翻訳数: ${poll.translations.length}`)
        console.log(`  オプション数: ${poll.options.length}`)
      } else {
        console.log('❌ 投票が見つかりません')
      }
    }
    
    console.log('')
    
    // 投票ID 12の情報を確認
    const poll12 = await prisma.poll.findUnique({
      where: { id: 12 },
      include: {
        translations: true,
        options: true,
      },
    })
    
    if (poll12) {
      console.log('📊 投票ID 12の情報:')
      console.log(`  ID: ${poll12.id}`)
      console.log(`  HashID: ${poll12.hashId}`)
      console.log(`  isPublic: ${poll12.isPublic}`)
      console.log(`  isActive: ${poll12.isActive}`)
      console.log(`  翻訳数: ${poll12.translations.length}`)
      console.log(`  オプション数: ${poll12.options.length}`)
    }

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNewHashId()
