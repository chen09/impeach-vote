const Hashids = require('hashids')

// HashIDs設定を表示
function showHashIdsConfig() {
  console.log('🔧 HashIDs設定情報:')
  console.log('')

  // 1. 環境変数
  console.log('1️⃣ 環境変数:')
  const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'
  console.log(`   HASHIDS_SECRET: ${hashidsSecret ? hashidsSecret.substring(0, 20) + '...' : 'NOT_SET'}`)
  console.log(`   環境変数設定: ${process.env.HASHIDS_SECRET ? 'SET' : 'NOT_SET'}`)
  console.log('')

  // 2. HashIDsインスタンス設定
  console.log('2️⃣ HashIDsインスタンス設定:')
  const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  console.log(`   シークレット: ${hashidsSecret.substring(0, 20)}...`)
  console.log(`   最小長度: 8`)
  console.log(`   文字セット: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`)
  console.log(`   文字セット長度: ${'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.length}`)
  console.log('')

  // 3. テスト変換
  console.log('3️⃣ 変換テスト:')
  const testIds = [1, 2, 3, 10, 100, 1000]
  testIds.forEach(id => {
    const encoded = hashids.encode(id)
    const decoded = hashids.decode(encoded)
    console.log(`   ID ${id} -> "${encoded}" -> ${decoded[0]} (${decoded[0] === id ? '✅' : '❌'})`)
  })
  console.log('')

  // 4. 設定ファイルの場所
  console.log('4️⃣ 設定ファイルの場所:')
  console.log('   📁 lib/hashids.ts - HashIDs設定ファイル')
  console.log('   📁 .env - 環境変数ファイル')
  console.log('   📁 env.example - 環境変数テンプレート')
  console.log('')

  // 5. 現在の設定の詳細
  console.log('5️⃣ 現在の設定詳細:')
  console.log(`   🔑 シークレットキー: ${hashidsSecret.substring(0, 30)}...`)
  console.log(`   📏 最小長度: 8文字`)
  console.log(`   🔤 文字セット: 英数字 (大文字小文字 + 数字)`)
  console.log(`   🌐 使用場所: API層での動的生成`)
  console.log(`   💾 データベース: 数字IDのみ保存`)
  console.log('')

  console.log('✅ HashIDs設定確認完了')
}

showHashIdsConfig()
