const crypto = require('crypto')

function generateHashidsSecret() {
  // 32バイトのランダムな文字列を生成
  const secret = crypto.randomBytes(32).toString('base64')
  
  console.log('🔐 HashIDsシークレットキーを生成しました:')
  console.log('')
  console.log('HASHIDS_SECRET=' + secret)
  console.log('')
  console.log('📝 使用方法:')
  console.log('1. 上記の値を.envファイルに追加してください')
  console.log('2. 本番環境では必ず環境変数で設定してください')
  console.log('3. 既存の投票がある場合は、新しいキーで再生成が必要です')
  console.log('')
  console.log('⚠️  注意: シークレットキーを変更すると、既存のhashIdが無効になります')
}

generateHashidsSecret()
