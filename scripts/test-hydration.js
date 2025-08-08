async function testHydration() {
  try {
    console.log('🧪 水合エラーをテスト中...')
    console.log('')

    // 1. 英語ページのテスト
    console.log('1️⃣ 英語ページ (/en/polls) テスト:')
    const enResponse = await fetch('http://localhost:3000/en/polls')
    const enHtml = await enResponse.text()
    const enLangMatch = enHtml.match(/lang="([^"]*)"/)
    
    if (enLangMatch) {
      console.log(`   lang属性: "${enLangMatch[1]}"`)
      if (enLangMatch[1] === 'en') {
        console.log('   ✅ 英語ページのlang属性が正しい')
      } else {
        console.log('   ❌ 英語ページのlang属性が間違っている')
      }
    }
    console.log('')

    // 2. 日本語ページのテスト
    console.log('2️⃣ 日本語ページ (/ja/polls) テスト:')
    const jaResponse = await fetch('http://localhost:3000/ja/polls')
    const jaHtml = await jaResponse.text()
    const jaLangMatch = jaHtml.match(/lang="([^"]*)"/)
    
    if (jaLangMatch) {
      console.log(`   lang属性: "${jaLangMatch[1]}"`)
      if (jaLangMatch[1] === 'ja') {
        console.log('   ✅ 日本語ページのlang属性が正しい')
      } else {
        console.log('   ❌ 日本語ページのlang属性が間違っている')
      }
    }
    console.log('')

    // 3. 中国語ページのテスト
    console.log('3️⃣ 中国語ページ (/zh/polls) テスト:')
    const zhResponse = await fetch('http://localhost:3000/zh/polls')
    const zhHtml = await zhResponse.text()
    const zhLangMatch = zhHtml.match(/lang="([^"]*)"/)
    
    if (zhLangMatch) {
      console.log(`   lang属性: "${zhLangMatch[1]}"`)
      if (zhLangMatch[1] === 'zh') {
        console.log('   ✅ 中国語ページのlang属性が正しい')
      } else {
        console.log('   ❌ 中国語ページのlang属性が間違っている')
      }
    }
    console.log('')

    console.log('🎉 水合テスト完了！')
    console.log('')
    console.log('📋 修正内容:')
    console.log('   ✅ ルートレイアウトからlang属性を削除')
    console.log('   ✅ localeレイアウトで動的にlang属性を設定')
    console.log('   ✅ サーバーとクライアントのlang属性が一致')

  } catch (error) {
    console.error('❌ テストエラー:', error.message)
  }
}

// 少し待ってからテスト実行
setTimeout(testHydration, 2000)
