async function testApi() {
  try {
    console.log('🔍 APIテストを開始します...')
    
    // 新しいhashIdでテスト
    const newHashId = '8KBq3dV6'
    const url = `http://localhost:3000/api/front/polls/${newHashId}`
    
    console.log(`📡 API呼び出し: ${url}`)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log(`📊 レスポンス: ${response.status}`)
    console.log(`📄 データ:`, JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ API呼び出し成功！')
    } else {
      console.log('❌ API呼び出し失敗')
    }
    
  } catch (error) {
    console.error('❌ エラー:', error.message)
  }
}

// 少し待ってからテスト実行
setTimeout(testApi, 3000)
