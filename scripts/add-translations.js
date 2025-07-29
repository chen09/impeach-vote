const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTranslations() {
  try {
    console.log('Adding translations to existing polls...')

    // 获取英文、中文、日语和西班牙语语言ID
    const englishLanguage = await prisma.language.findFirst({
      where: { code: 'en' },
    })
    const chineseLanguage = await prisma.language.findFirst({
      where: { code: 'zh' },
    })
    const japaneseLanguage = await prisma.language.findFirst({
      where: { code: 'ja' },
    })
    const spanishLanguage = await prisma.language.findFirst({
      where: { code: 'es' },
    })

    if (!englishLanguage) {
      console.error('English language not found!')
      return
    }
    if (!chineseLanguage) {
      console.error('Chinese language not found!')
      return
    }
    if (!japaneseLanguage) {
      console.error('Japanese language not found!')
      return
    }
    if (!spanishLanguage) {
      console.error('Spanish language not found!')
      return
    }

    console.log(`Using English language ID: ${englishLanguage.id}`)
    console.log(`Using Chinese language ID: ${chineseLanguage.id}`)
    console.log(`Using Japanese language ID: ${japaneseLanguage.id}`)
    console.log(`Using Spanish language ID: ${spanishLanguage.id}`)

    // 获取所有投票
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
        translations: true,
      },
    })

    console.log(`Found ${polls.length} polls`)

    for (const poll of polls) {
      console.log(`Processing poll: ${poll.id}`)

      // 为投票添加英文翻译
      if (poll.translations.length === 0) {
        await prisma.pollTranslation.create({
          data: {
            pollId: poll.id,
            languageId: englishLanguage.id,
            title: 'Sample Voting Poll',
            description: 'This is a sample voting poll for testing purposes.',
          },
        })
        console.log('Added English translation for poll')
      }

      // 为投票添加中文翻译
      const existingChineseTranslation = poll.translations.find(t => t.languageId === chineseLanguage.id)
      if (!existingChineseTranslation) {
        await prisma.pollTranslation.create({
          data: {
            pollId: poll.id,
            languageId: chineseLanguage.id,
            title: '示例投票',
            description: '这是一个用于测试的示例投票。',
          },
        })
        console.log('Added Chinese translation for poll')
      }

      // 为投票添加日语翻译
      const existingJapaneseTranslation = poll.translations.find(t => t.languageId === japaneseLanguage.id)
      if (!existingJapaneseTranslation) {
        await prisma.pollTranslation.create({
          data: {
            pollId: poll.id,
            languageId: japaneseLanguage.id,
            title: 'サンプル投票',
            description: 'これはテスト用のサンプル投票です。',
          },
        })
        console.log('Added Japanese translation for poll')
      }

      // 为投票添加西班牙语翻译
      const existingSpanishTranslation = poll.translations.find(t => t.languageId === spanishLanguage.id)
      if (!existingSpanishTranslation) {
        await prisma.pollTranslation.create({
          data: {
            pollId: poll.id,
            languageId: spanishLanguage.id,
            title: 'Encuesta de Votación de Muestra',
            description: 'Esta es una encuesta de votación de muestra para propósitos de prueba.',
          },
        })
        console.log('Added Spanish translation for poll')
      }

      // 为每个选项添加翻译
      for (const option of poll.options) {
        const optionTranslations = await prisma.optionTranslation.findMany({
          where: { optionId: option.id },
        })

        // 添加英文翻译
        if (optionTranslations.length === 0) {
          await prisma.optionTranslation.create({
            data: {
              optionId: option.id,
              languageId: englishLanguage.id,
              text: `Option ${option.id.slice(-4)}`,
            },
          })
          console.log(`Added English translation for option: ${option.id}`)
        }

        // 添加中文翻译
        const existingChineseOptionTranslation = optionTranslations.find(t => t.languageId === chineseLanguage.id)
        if (!existingChineseOptionTranslation) {
          await prisma.optionTranslation.create({
            data: {
              optionId: option.id,
              languageId: chineseLanguage.id,
              text: `选项 ${option.id.slice(-4)}`,
            },
          })
          console.log(`Added Chinese translation for option: ${option.id}`)
        }

        // 添加日语翻译
        const existingJapaneseOptionTranslation = optionTranslations.find(t => t.languageId === japaneseLanguage.id)
        if (!existingJapaneseOptionTranslation) {
          await prisma.optionTranslation.create({
            data: {
              optionId: option.id,
              languageId: japaneseLanguage.id,
              text: `選択肢 ${option.id.slice(-4)}`,
            },
          })
          console.log(`Added Japanese translation for option: ${option.id}`)
        }

        // 添加西班牙语翻译
        const existingSpanishOptionTranslation = optionTranslations.find(t => t.languageId === spanishLanguage.id)
        if (!existingSpanishOptionTranslation) {
          await prisma.optionTranslation.create({
            data: {
              optionId: option.id,
              languageId: spanishLanguage.id,
              text: `Opción ${option.id.slice(-4)}`,
            },
          })
          console.log(`Added Spanish translation for option: ${option.id}`)
        }
      }
    }

    console.log('Translation addition completed!')
  } catch (error) {
    console.error('Error adding translations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTranslations() 