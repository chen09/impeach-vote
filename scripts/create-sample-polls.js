const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const prisma = new PrismaClient()
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

async function createSamplePolls() {
  try {
    console.log('🎯 サンプル投票を作成中...')
    
    // データベース接続
    await prisma.$connect()
    console.log('✅ データベース接続成功')
    
    // サンプルユーザーを作成
    const sampleUser = await prisma.user.create({
      data: {
        email: 'admin@impeach.world',
        name: 'Admin User',
        password: 'hashedpassword',
      },
    })
    console.log(`✅ サンプルユーザーを作成しました: ${sampleUser.id}`)
    
    // 言語データを取得または作成
    const languages = await prisma.language.findMany()
    if (languages.length === 0) {
      console.log('🌐 言語データを作成中...')
      await prisma.language.createMany({
        data: [
          { code: 'en', name: 'English' },
          { code: 'ja', name: '日本語' },
          { code: 'zh', name: '中文' },
          { code: 'es', name: 'Español' },
          { code: 'fr', name: 'Français' },
          { code: 'de', name: 'Deutsch' },
          { code: 'it', name: 'Italiano' },
          { code: 'pt', name: 'Português' },
        ],
      })
      console.log('✅ 言語データを作成しました')
    }
    
    const enLanguage = await prisma.language.findFirst({ where: { code: 'en' } })
    const jaLanguage = await prisma.language.findFirst({ where: { code: 'ja' } })
    
    // 10個のサンプル投票を作成
    const samplePolls = [
      {
        title: 'Favorite Programming Language',
        description: 'What is your favorite programming language?',
        options: ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
        jaTitle: 'お気に入りのプログラミング言語',
        jaDescription: 'あなたのお気に入りのプログラミング言語は何ですか？',
        jaOptions: ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
      },
      {
        title: 'Best Framework for Web Development',
        description: 'Which framework do you prefer for web development?',
        options: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js'],
        jaTitle: 'Web開発に最適なフレームワーク',
        jaDescription: 'Web開発でどのフレームワークを好みますか？',
        jaOptions: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js'],
      },
      {
        title: 'Preferred Database',
        description: 'What type of database do you use most?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
        jaTitle: 'お気に入りのデータベース',
        jaDescription: '最も使用するデータベースの種類は何ですか？',
        jaOptions: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
      },
      {
        title: 'Cloud Provider Preference',
        description: 'Which cloud provider do you prefer?',
        options: ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Vercel'],
        jaTitle: 'クラウドプロバイダーの好み',
        jaDescription: 'どのクラウドプロバイダーを好みますか？',
        jaOptions: ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Vercel'],
      },
      {
        title: 'Development Environment',
        description: 'What is your primary development environment?',
        options: ['VS Code', 'IntelliJ', 'Vim', 'Sublime Text', 'Atom'],
        jaTitle: '開発環境',
        jaDescription: '主な開発環境は何ですか？',
        jaOptions: ['VS Code', 'IntelliJ', 'Vim', 'Sublime Text', 'Atom'],
      },
      {
        title: 'Operating System',
        description: 'What operating system do you use for development?',
        options: ['Windows', 'macOS', 'Linux', 'WSL', 'Docker'],
        jaTitle: 'オペレーティングシステム',
        jaDescription: '開発にどのオペレーティングシステムを使用しますか？',
        jaOptions: ['Windows', 'macOS', 'Linux', 'WSL', 'Docker'],
      },
      {
        title: 'Version Control System',
        description: 'Which version control system do you use?',
        options: ['Git', 'SVN', 'Mercurial', 'GitHub', 'GitLab'],
        jaTitle: 'バージョン管理システム',
        jaDescription: 'どのバージョン管理システムを使用しますか？',
        jaOptions: ['Git', 'SVN', 'Mercurial', 'GitHub', 'GitLab'],
      },
      {
        title: 'Testing Framework',
        description: 'What testing framework do you prefer?',
        options: ['Jest', 'Mocha', 'JUnit', 'PyTest', 'Cypress'],
        jaTitle: 'テストフレームワーク',
        jaDescription: 'どのテストフレームワークを好みますか？',
        jaOptions: ['Jest', 'Mocha', 'JUnit', 'PyTest', 'Cypress'],
      },
      {
        title: 'Deployment Method',
        description: 'How do you typically deploy your applications?',
        options: ['Docker', 'Kubernetes', 'Heroku', 'Vercel', 'AWS'],
        jaTitle: 'デプロイ方法',
        jaDescription: '通常どのようにアプリケーションをデプロイしますか？',
        jaOptions: ['Docker', 'Kubernetes', 'Heroku', 'Vercel', 'AWS'],
      },
      {
        title: 'Code Review Process',
        description: 'What is your preferred code review process?',
        options: ['Pull Request', 'Pair Programming', 'Code Walkthrough', 'Automated Review', 'Peer Review'],
        jaTitle: 'コードレビュープロセス',
        jaDescription: 'お気に入りのコードレビュープロセスは何ですか？',
        jaOptions: ['Pull Request', 'Pair Programming', 'Code Walkthrough', 'Automated Review', 'Peer Review'],
      },
    ]
    
    console.log('📝 10個のサンプル投票を作成中...')
    
    for (let i = 0; i < samplePolls.length; i++) {
      const pollData = samplePolls[i]
      
      // 投票を作成
      const poll = await prisma.poll.create({
        data: {
          isPublic: true,
          isActive: true,
          userId: sampleUser.id,
          translations: {
            create: [
              {
                languageId: enLanguage.id,
                title: pollData.title,
                description: pollData.description,
              },
              {
                languageId: jaLanguage.id,
                title: pollData.jaTitle,
                description: pollData.jaDescription,
              },
            ],
          },
          options: {
            create: pollData.options.map((option, index) => ({
              translations: {
                create: [
                  {
                    languageId: enLanguage.id,
                    text: option,
                  },
                  {
                    languageId: jaLanguage.id,
                    text: pollData.jaOptions[index],
                  },
                ],
              },
            })),
          },
        },
      })
      
      // hashIdを生成して更新
      const hashId = hashids.encode(poll.id)
      await prisma.poll.update({
        where: { id: poll.id },
        data: { hashId },
      })
      
      console.log(`✅ 投票 ${i + 1} を作成しました: ID=${poll.id}, HashID=${hashId}`)
    }
    
    // 結果を表示
    console.log('\n📋 作成された投票の一覧:')
    const allPolls = await prisma.poll.findMany({
      include: {
        translations: {
          where: { languageId: enLanguage.id },
        },
      },
      orderBy: { id: 'asc' },
    })
    
    for (const poll of allPolls) {
      const title = poll.translations[0]?.title || 'Untitled'
      console.log(`  ID: ${poll.id} -> HashID: ${poll.hashId} -> ${title}`)
      console.log(`  URL: https://vote.impeach.world/poll/${poll.hashId}`)
    }
    
    console.log('\n🎯 サンプル投票の作成が完了しました！')
    console.log('📱 上記のURLをQRコードに変換して運営チームに提供してください。')
    
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSamplePolls()
