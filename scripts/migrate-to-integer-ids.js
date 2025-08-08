const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function migrateToIntegerIds() {
  try {
    console.log('🔄 データベースマイグレーションを開始します...')
    
    // 既存のデータを取得
    const existingPolls = await prisma.poll.findMany({
      include: {
        translations: true,
        options: {
          include: {
            translations: true,
          },
        },
        votes: true,
      },
    })
    
    console.log(`📊 ${existingPolls.length}件の投票データを取得しました`)
    
    // データベースをリセット
    console.log('🗑️ データベースをリセットしています...')
    await prisma.$executeRaw`DROP TABLE IF EXISTS votes`
    await prisma.$executeRaw`DROP TABLE IF EXISTS option_translations`
    await prisma.$executeRaw`DROP TABLE IF EXISTS options`
    await prisma.$executeRaw`DROP TABLE IF EXISTS poll_translations`
    await prisma.$executeRaw`DROP TABLE IF EXISTS polls`
    await prisma.$executeRaw`DROP TABLE IF EXISTS users`
    await prisma.$executeRaw`DROP TABLE IF EXISTS languages`
    
    // 新しいスキーマを適用
    console.log('🔄 新しいスキーマを適用しています...')
    await prisma.$executeRaw`CREATE TABLE languages (
      id VARCHAR(191) NOT NULL,
      code VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL,
      isActive BOOLEAN NOT NULL DEFAULT true,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id)
    )`
    
    await prisma.$executeRaw`CREATE TABLE users (
      id VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL,
      password VARCHAR(191) NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      languageId VARCHAR(191),
      PRIMARY KEY (id)
    )`
    
    await prisma.$executeRaw`CREATE TABLE polls (
      id INT NOT NULL AUTO_INCREMENT,
      hashId VARCHAR(191) NOT NULL DEFAULT '',
      isActive BOOLEAN NOT NULL DEFAULT true,
      isPublic BOOLEAN NOT NULL DEFAULT true,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY polls_hashId_key (hashId)
    )`
    
    await prisma.$executeRaw`CREATE TABLE poll_translations (
      id VARCHAR(191) NOT NULL,
      pollId INT NOT NULL,
      languageId VARCHAR(191) NOT NULL,
      title VARCHAR(191) NOT NULL,
      description TEXT,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY poll_translations_pollId_languageId_key (pollId, languageId)
    )`
    
    await prisma.$executeRaw`CREATE TABLE options (
      id VARCHAR(191) NOT NULL,
      pollId INT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    )`
    
    await prisma.$executeRaw`CREATE TABLE option_translations (
      id VARCHAR(191) NOT NULL,
      optionId VARCHAR(191) NOT NULL,
      languageId VARCHAR(191) NOT NULL,
      text VARCHAR(191) NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY option_translations_optionId_languageId_key (optionId, languageId)
    )`
    
    await prisma.$executeRaw`CREATE TABLE votes (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191),
      pollId INT NOT NULL,
      optionId VARCHAR(191) NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY votes_userId_pollId_key (userId, pollId)
    )`
    
    // 外部キー制約を追加
    await prisma.$executeRaw`ALTER TABLE users ADD CONSTRAINT users_languageId_fkey FOREIGN KEY (languageId) REFERENCES languages(id) ON DELETE SET NULL ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE polls ADD CONSTRAINT polls_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE poll_translations ADD CONSTRAINT poll_translations_languageId_fkey FOREIGN KEY (languageId) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE poll_translations ADD CONSTRAINT poll_translations_pollId_fkey FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE options ADD CONSTRAINT options_pollId_fkey FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE option_translations ADD CONSTRAINT option_translations_languageId_fkey FOREIGN KEY (languageId) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE option_translations ADD CONSTRAINT option_translations_optionId_fkey FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE votes ADD CONSTRAINT votes_optionId_fkey FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE votes ADD CONSTRAINT votes_pollId_fkey FOREIGN KEY (pollId) REFERENCES polls(id) ON DELETE CASCADE ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE votes ADD CONSTRAINT votes_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE`
    
    // インデックスを追加
    await prisma.$executeRaw`CREATE INDEX users_languageId_fkey ON users(languageId)`
    await prisma.$executeRaw`CREATE INDEX polls_userId_fkey ON polls(userId)`
    await prisma.$executeRaw`CREATE INDEX poll_translations_languageId_fkey ON poll_translations(languageId)`
    await prisma.$executeRaw`CREATE INDEX options_pollId_fkey ON options(pollId)`
    await prisma.$executeRaw`CREATE INDEX option_translations_languageId_fkey ON option_translations(languageId)`
    await prisma.$executeRaw`CREATE INDEX votes_optionId_fkey ON votes(optionId)`
    await prisma.$executeRaw`CREATE INDEX votes_pollId_fkey ON votes(pollId)`
    
    console.log('✅ データベーススキーマの更新が完了しました')
    
    // 既存のデータを新しい形式で再作成
    console.log('🔄 データを新しい形式で再作成しています...')
    
    for (let i = 0; i < existingPolls.length; i++) {
      const oldPoll = existingPolls[i]
      const newPollId = i + 1
      const hashId = hashids.encode(newPollId)
      
      console.log(`📝 投票 ${newPollId} を作成中... (元ID: ${oldPoll.id})`)
      
      // 新しい投票を作成
      const newPoll = await prisma.poll.create({
        data: {
          id: newPollId,
          hashId,
          isActive: oldPoll.isActive,
          isPublic: oldPoll.isPublic,
          createdAt: oldPoll.createdAt,
          updatedAt: oldPoll.updatedAt,
          userId: oldPoll.userId,
        },
      })
      
      // 翻訳を再作成
      for (const translation of oldPoll.translations) {
        await prisma.pollTranslation.create({
          data: {
            id: translation.id,
            pollId: newPollId,
            languageId: translation.languageId,
            title: translation.title,
            description: translation.description,
            createdAt: translation.createdAt,
            updatedAt: translation.updatedAt,
          },
        })
      }
      
      // オプションを再作成
      for (const option of oldPoll.options) {
        const newOption = await prisma.option.create({
          data: {
            id: option.id,
            pollId: newPollId,
            createdAt: option.createdAt,
          },
        })
        
        // オプション翻訳を再作成
        for (const translation of option.translations) {
          await prisma.optionTranslation.create({
            data: {
              id: translation.id,
              optionId: option.id,
              languageId: translation.languageId,
              text: translation.text,
              createdAt: translation.createdAt,
              updatedAt: translation.updatedAt,
            },
          })
        }
      }
      
      // 投票を再作成
      for (const vote of oldPoll.votes) {
        await prisma.vote.create({
          data: {
            id: vote.id,
            userId: vote.userId,
            pollId: newPollId,
            optionId: vote.optionId,
            createdAt: vote.createdAt,
          },
        })
      }
    }
    
    console.log('✅ データマイグレーションが完了しました')
    console.log('📋 新しい投票IDとハッシュID:')
    
    const newPolls = await prisma.poll.findMany({
      select: { id: true, hashId: true },
      orderBy: { id: 'asc' },
    })
    
    for (const poll of newPolls) {
      console.log(`  ID: ${poll.id} -> HashID: ${poll.hashId}`)
    }
    
  } catch (error) {
    console.error('❌ マイグレーションエラー:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateToIntegerIds()
