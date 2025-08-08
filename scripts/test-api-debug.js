const Hashids = require('hashids')

function testDecodeId() {
  console.log('🔍 APIデバッグテスト')
  
  const hashids = new Hashids('impeach-vote-secret-key', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  
  const testHashId = '9Xg6WpK1'
  console.log(`テストHashID: ${testHashId}`)
  
  const decoded = hashids.decode(testHashId)
  console.log(`デコード結果: ${decoded}`)
  
  if (decoded.length > 0) {
    const result = decoded[0]
    console.log(`投票ID: ${result} (型: ${typeof result})`)
    console.log('✅ デコード成功')
  } else {
    console.log('❌ デコード失敗')
  }
}

testDecodeId()
