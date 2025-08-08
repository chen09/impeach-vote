const Hashids = require('hashids')

console.log('🔍 環境変数テスト')

const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
console.log(`HASHIDS_SECRET: ${hashidsSecret}`)

const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

const testHashId = '9Xg6WpK1'
console.log(`テストHashID: ${testHashId}`)

const decoded = hashids.decode(testHashId)
console.log(`デコード結果: ${decoded}`)

if (decoded.length > 0) {
  console.log(`投票ID: ${decoded[0]}`)
  console.log('✅ デコード成功')
} else {
  console.log('❌ デコード失敗')
}
