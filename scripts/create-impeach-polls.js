const { PrismaClient } = require('@prisma/client')
const Hashids = require('hashids')

const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

function encodeId(id) {
  return hashids.encode(id)
}

const prisma = new PrismaClient()

async function createImpeachPolls() {
  try {
    console.log('🎯 5つのIMPEACH投票を作成中...')
    
    // データベース接続
    await prisma.$connect()
    console.log('✅ データベース接続成功')
    
    // サンプルユーザーを作成または取得
    let sampleUser = await prisma.user.findFirst({
      where: { email: 'admin@impeach.world' }
    })
    
    if (!sampleUser) {
      sampleUser = await prisma.user.create({
        data: {
          email: 'admin@impeach.world',
          name: 'Admin User',
          password: 'hashedpassword',
        },
      })
      console.log(`✅ サンプルユーザーを作成しました: ${sampleUser.id}`)
    } else {
      console.log(`✅ 既存のユーザーを使用: ${sampleUser.id}`)
    }
    
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
    
    // 5個のIMPEACH投票を作成
    const impeachPolls = [
      {
        title: 'WHO IS THE MOST CORRUPT U.S. PRESIDENT?',
        description: 'Vote for the U.S. President you believe is the most corrupt in history.',
        options: [
          'Donald Trump',
          'Joe Biden', 
          'Barack Obama',
          'George W. Bush',
          'Bill Clinton',
          'Richard Nixon',
          'Other'
        ],
        jaTitle: '最も腐敗した米国大統領は誰ですか？',
        jaDescription: '歴史上最も腐敗していると信じる米国大統領に投票してください。',
        jaOptions: [
          'ドナルド・トランプ',
          'ジョー・バイデン',
          'バラク・オバマ',
          'ジョージ・W・ブッシュ',
          'ビル・クリントン',
          'リチャード・ニクソン',
          'その他'
        ],
      },
      {
        title: 'WHO WAS THE LEAST QUALIFIED U.S. PRESIDENT?',
        description: 'Vote for the U.S. President you believe was the least qualified for the office.',
        options: [
          'Donald Trump',
          'Joe Biden',
          'Barack Obama', 
          'George W. Bush',
          'Bill Clinton',
          'Jimmy Carter',
          'Other'
        ],
        jaTitle: '最も資格のない米国大統領は誰でしたか？',
        jaDescription: '大統領職に最も適していないと信じる米国大統領に投票してください。',
        jaOptions: [
          'ドナルド・トランプ',
          'ジョー・バイデン',
          'バラク・オバマ',
          'ジョージ・W・ブッシュ',
          'ビル・クリントン',
          'ジミー・カーター',
          'その他'
        ],
      },
      {
        title: 'WHO IS THE MOST DICTATORIAL U.S. PRESIDENT?',
        description: 'Vote for the U.S. President you believe acted most like a dictator.',
        options: [
          'Donald Trump',
          'Joe Biden',
          'Barack Obama',
          'George W. Bush',
          'Franklin D. Roosevelt',
          'Abraham Lincoln',
          'Other'
        ],
        jaTitle: '最も独裁的な米国大統領は誰ですか？',
        jaDescription: '最も独裁者らしく行動したと信じる米国大統領に投票してください。',
        jaOptions: [
          'ドナルド・トランプ',
          'ジョー・バイデン',
          'バラク・オバマ',
          'ジョージ・W・ブッシュ',
          'フランクリン・D・ルーズベルト',
          'エイブラハム・リンカーン',
          'その他'
        ],
      },
      {
        title: 'WHO IS THE MOST LYING U.S. PRESIDENT?',
        description: 'Vote for the U.S. President you believe told the most lies to the American people.',
        options: [
          'Donald Trump',
          'Joe Biden',
          'Barack Obama',
          'George W. Bush',
          'Bill Clinton',
          'Richard Nixon',
          'Other'
        ],
        jaTitle: '最も嘘をついた米国大統領は誰ですか？',
        jaDescription: 'アメリカ国民に最も多くの嘘をついたと信じる米国大統領に投票してください。',
        jaOptions: [
          'ドナルド・トランプ',
          'ジョー・バイデン',
          'バラク・オバマ',
          'ジョージ・W・ブッシュ',
          'ビル・クリントン',
          'リチャード・ニクソン',
          'その他'
        ],
      },
      {
        title: 'WHO IS THE BIGGEST RUSSIAN SPY IN U.S. HISTORY?',
        description: 'Vote for the person you believe is the biggest Russian spy in U.S. history.',
        options: [
          'Donald Trump',
          'Joe Biden',
          'Hillary Clinton',
          'Barack Obama',
          'George W. Bush',
          'No one',
          'Other'
        ],
        jaTitle: '米国史上最大のロシアスパイは誰ですか？',
        jaDescription: '米国史上最大のロシアスパイだと信じる人物に投票してください。',
        jaOptions: [
          'ドナルド・トランプ',
          'ジョー・バイデン',
          'ヒラリー・クリントン',
          'バラク・オバマ',
          'ジョージ・W・ブッシュ',
          '誰もいない',
          'その他'
        ],
      },
    ]
    
    console.log('📝 5個のIMPEACH投票を作成中...')
    
    for (let i = 0; i < impeachPolls.length; i++) {
      const pollData = impeachPolls[i]
      
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
      
      // hashIdを動的に生成
      const hashId = encodeId(poll.id)
      
      console.log(`✅ 投票 ${i + 1} を作成しました: ID=${poll.id}, HashID=${hashId}`)
      console.log(`  タイトル: ${pollData.title}`)
      console.log(`  URL: https://vote.impeach.world/poll/${hashId}`)
    }
    
    // 結果を表示
    console.log('\n📋 作成されたIMPEACH投票の一覧:')
    const allPolls = await prisma.poll.findMany({
      include: {
        translations: {
          where: { languageId: enLanguage.id },
        },
      },
      orderBy: { id: 'desc' },
      take: 5,
    })
    
    for (const poll of allPolls) {
      const title = poll.translations[0]?.title || 'Untitled'
      const hashId = encodeId(poll.id)
      console.log(`\n🎯 ID: ${poll.id} -> HashID: ${hashId}`)
      console.log(`📝 タイトル: ${title}`)
      console.log(`🔗 URL: https://vote.impeach.world/poll/${hashId}`)
      console.log(`📊 結果URL: https://vote.impeach.world/results/${hashId}`)
    }
    
    console.log('\n🎯 IMPEACH投票の作成が完了しました！')
    console.log('📱 上記のURLをQRコードに変換して運営チームに提供してください。')
    
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createImpeachPolls()
