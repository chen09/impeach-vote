const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function testDatabase() {
  try {
    console.log('🧪 データベーステストを開始します...')
    
    // データベース接続テスト
    await prisma.$connect()
    console.log('✅ データベース接続成功')
    
    // 投票テーブルの構造を確認
    const polls = await prisma.poll.findMany()
    console.log(`📊 投票数: ${polls.length}`)
    
    if (polls.length > 0) {
      console.log('📋 既存の投票:')
      for (const poll of polls) {
        console.log(`  ID: ${poll.id} (型: ${typeof poll.id}), HashID: ${poll.hashId}`)
      }
    }
    
    // テストユーザーを作成
    console.log('👤 テストユーザーを作成中...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      },
    })
    console.log(`✅ テストユーザーを作成しました: ${testUser.id}`)
    
    // 新しい投票を作成してテスト
    console.log('🔄 新しい投票を作成中...')
    const newPoll = await prisma.poll.create({
      data: {
        isPublic: true,
        isActive: true,
        userId: testUser.id,
      },
    })
    
    console.log(`✅ 新しい投票を作成しました: ID=${newPoll.id}, HashID=${newPoll.hashId}`)
    
    // hashIdを生成して更新
    const hashId = hashids.encode(newPoll.id)
    console.log(`🔐 生成されたHashID: ${hashId}`)
    
    const updatedPoll = await prisma.poll.update({
      where: { id: newPoll.id },
      data: { hashId },
    })
    
    console.log(`✅ HashIDを更新しました: ${updatedPoll.hashId}`)
    
    // デコードテスト
    const decodedId = hashids.decode(hashId)
    console.log(`🔍 デコード結果: ${decodedId}`)
    
    // テストデータを削除
    await prisma.poll.delete({
      where: { id: newPoll.id },
    })
    await prisma.user.delete({
      where: { id: testUser.id },
    })
    console.log('🗑️ テストデータを削除しました')
    
  } catch (error) {
    console.error('❌ テストエラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
