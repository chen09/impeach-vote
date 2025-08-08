const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeHashIdColumn() {
  try {
    console.log('🔧 hashId列を削除中...')
    
    // 直接SQLを実行してhashId列を削除
    await prisma.$executeRaw`ALTER TABLE polls DROP COLUMN hashId`
    
    console.log('✅ hashId列を削除しました')
    
    // 確認：pollsテーブルの構造を確認
    const tableInfo = await prisma.$queryRaw`DESCRIBE polls`
    console.log('📊 pollsテーブルの構造:')
    console.log(tableInfo)
    
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeHashIdColumn()
