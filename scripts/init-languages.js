const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initLanguages() {
  try {
    console.log('言語データを初期化中...')

    const languages = [
      { code: 'en', name: 'English' },
      { code: 'zh', name: '中文' },
      { code: 'ja', name: '日本語' },
      { code: 'es', name: 'Español' },
      { code: 'pt', name: 'Português' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' },
      { code: 'it', name: 'Italiano' },
    ]

    for (const lang of languages) {
      await prisma.language.upsert({
        where: { code: lang.code },
        update: {},
        create: {
          code: lang.code,
          name: lang.name,
          isActive: true,
        },
      })
      console.log(`言語 ${lang.name} (${lang.code}) を初期化しました`)
    }

    console.log('言語データの初期化が完了しました')
  } catch (error) {
    console.error('言語データの初期化エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initLanguages() 