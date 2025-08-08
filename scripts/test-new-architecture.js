

async function testNewArchitecture() {
  try {
    console.log('🧪 新しいアーキテクチャをテスト中...')
    console.log('')

    // 1. 投票リストAPIをテスト
    console.log('1️⃣ 投票リストAPIテスト:')
    const pollsResponse = await fetch('http://localhost:3000/api/front/polls')
    const pollsData = await pollsResponse.json()
    
    if (pollsResponse.ok && pollsData.polls && pollsData.polls.length > 0) {
      const firstPoll = pollsData.polls[0]
      console.log(`✅ 投票リスト取得成功: ${pollsData.polls.length}件`)
      console.log(`   最初の投票: ID=${firstPoll.id}, hashId="${firstPoll.hashId}"`)
      
      // 2. 個別投票APIをテスト
      console.log('')
      console.log('2️⃣ 個別投票APIテスト:')
      const pollResponse = await fetch(`http://localhost:3000/api/front/polls/${firstPoll.hashId}`)
      const pollData = await pollResponse.json()
      
      if (pollResponse.ok) {
        console.log(`✅ 個別投票取得成功: "${pollData.title}"`)
        console.log(`   ID: ${pollData.id}`)
        console.log(`   hashId: "${pollData.hashId}"`)
        console.log(`   オプション数: ${pollData.options.length}`)
      } else {
        console.log(`❌ 個別投票取得失敗: ${pollResponse.status}`)
        console.log(`   エラー: ${JSON.stringify(pollData)}`)
      }
    } else {
      console.log(`❌ 投票リスト取得失敗: ${pollsResponse.status}`)
      console.log(`   エラー: ${JSON.stringify(pollsData)}`)
    }

    // 3. 無効なhashIdをテスト
    console.log('')
    console.log('3️⃣ 無効なhashIdテスト:')
    const invalidResponse = await fetch('http://localhost:3000/api/front/polls/invalid-hash-id')
    const invalidData = await invalidResponse.json()
    
    if (invalidResponse.status === 400) {
      console.log('✅ 無効なhashIdが正しく拒否されました')
    } else {
      console.log(`❌ 無効なhashIdの処理に問題: ${invalidResponse.status}`)
    }

  } catch (error) {
    console.error('❌ テストエラー:', error.message)
  }
}

// 少し待ってからテスト実行
setTimeout(testNewArchitecture, 3000)
