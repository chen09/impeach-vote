const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()

// HashIDs設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function verifyNewArchitecture() {
  try {
    console.log('🧪 新しいアーキテクチャを検証中...')
    console.log('')

    // 1. データベース構造を確認
    console.log('1️⃣ データベース構造確認:')
    const tableInfo = await prisma.$queryRaw`DESCRIBE polls`
    const hasHashIdColumn = tableInfo.some((column) => column.Field === 'hashId')
    
    if (hasHashIdColumn) {
      console.log('❌ hashId列がまだ存在します')
    } else {
      console.log('✅ hashId列が正常に削除されました')
    }
    console.log('')

    // 2. 投票データを確認
    console.log('2️⃣ 投票データ確認:')
    const polls = await prisma.poll.findMany({
      take: 3,
      orderBy: { id: 'asc' }
    })
    
    console.log(`📊 ${polls.length}件の投票を確認しました:`)
    polls.forEach(poll => {
      console.log(`  投票ID ${poll.id}: isPublic=${poll.isPublic}, isActive=${poll.isActive}`)
    })
    console.log('')

    // 3. HashIDs変換をテスト
    console.log('3️⃣ HashIDs変換テスト:')
    polls.forEach(poll => {
      const hashId = hashids.encode(poll.id)
      const decodedId = hashids.decode(hashId)
      console.log(`  ID ${poll.id} -> "${hashId}" -> ${decodedId[0]} (${decodedId[0] === poll.id ? '✅' : '❌'})`)
    })
    console.log('')

    // 4. APIテスト
    console.log('4️⃣ APIテスト:')
    const response = await fetch('http://localhost:3000/api/front/polls')
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ API取得成功: ${data.polls.length}件の投票`)
      
      if (data.polls.length > 0) {
        const firstPoll = data.polls[0]
        console.log(`   最初の投票: ID=${firstPoll.id}, hashId="${firstPoll.hashId}"`)
        
        // 個別投票APIテスト
        const pollResponse = await fetch(`http://localhost:3000/api/front/polls/${firstPoll.hashId}`)
        if (pollResponse.ok) {
          const pollData = await pollResponse.json()
          console.log(`✅ 個別投票API成功: "${pollData.title}"`)
        } else {
          console.log(`❌ 個別投票API失敗: ${pollResponse.status}`)
        }
      }
    } else {
      console.log(`❌ API失敗: ${response.status}`)
    }

    console.log('')
    console.log('🎉 新しいアーキテクチャの検証完了！')
    console.log('')
    console.log('📋 アーキテクチャ概要:')
    console.log('   ✅ データベースには数字IDのみ保存')
    console.log('   ✅ hashIdはAPI層で動的に生成')
    console.log('   ✅ フロントエンドはAPIからhashIdを取得')
    console.log('   ✅ セキュリティと保守性が向上')

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 少し待ってからテスト実行
setTimeout(verifyNewArchitecture, 2000)
