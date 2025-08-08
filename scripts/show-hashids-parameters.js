const Hashids = require('hashids')
const fs = require('fs')
const path = require('path')

// 環境変数を手動で読み込み
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env')
  const envVars = {}
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        if (key && value) {
          envVars[key.trim()] = value.trim().replace(/^"|"$/g, '')
        }
      }
    })
  }
  
  return envVars
}

function showHashIdsParameters() {
  console.log('🔧 HashIDsパラメータ設定詳細:')
  console.log('')

  // 環境変数を読み込み
  const envVars = loadEnvFile()
  const hashidsSecret = envVars.HASHIDS_SECRET || process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'

  // 現在の設定
  const currentMinLength = 8
  const currentAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  
  console.log('1️⃣ 現在の設定:')
  console.log(`   📏 Minimum Length: ${currentMinLength}`)
  console.log(`   🔤 Alphabet: ${currentAlphabet}`)
  console.log(`   📊 Alphabet Length: ${currentAlphabet.length}文字`)
  console.log('')

  // HashIDsインスタンスを作成
  const hashids = new Hashids(hashidsSecret, currentMinLength, currentAlphabet)
  
  console.log('2️⃣ 設定の詳細説明:')
  console.log('')
  console.log('📏 Minimum Length (最小長度):')
  console.log(`   - 現在の値: ${currentMinLength}`)
  console.log(`   - 意味: 生成されるhashIdの最小文字数`)
  console.log(`   - 効果: 短いIDでも最低${currentMinLength}文字のhashIdが生成される`)
  console.log(`   - 例: ID 1 -> "${hashids.encode(1)}" (${hashids.encode(1).length}文字)`)
  console.log('')

  console.log('🔤 Alphabet (文字セット):')
  console.log(`   - 現在の値: ${currentAlphabet}`)
  console.log(`   - 文字数: ${currentAlphabet.length}文字`)
  console.log(`   - 構成: 小文字26文字 + 大文字26文字 + 数字10文字`)
  console.log(`   - 文字の種類: 英数字のみ`)
  console.log('')

  console.log('3️⃣ 設定の影響:')
  console.log('')
  
  // テスト変換
  const testIds = [1, 2, 3, 10, 100, 1000]
  console.log('変換例:')
  testIds.forEach(id => {
    const encoded = hashids.encode(id)
    console.log(`   ID ${id} -> "${encoded}" (${encoded.length}文字)`)
  })
  console.log('')

  console.log('4️⃣ 設定の変更方法:')
  console.log('')
  console.log('📏 Minimum Lengthを変更する場合:')
  console.log('   lib/hashids.ts の第2引数を変更')
  console.log('   const hashids = new Hashids(secret, 10, alphabet) // 8 -> 10')
  console.log('')
  
  console.log('🔤 Alphabetを変更する場合:')
  console.log('   lib/hashids.ts の第3引数を変更')
  console.log('   const hashids = new Hashids(secret, minLength, "新しい文字セット")')
  console.log('')

  console.log('5️⃣ 異なる設定の例:')
  console.log('')
  
  // 異なる設定でのテスト
  const testConfigs = [
    { name: '短いhashId', minLength: 4, alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789' },
    { name: '長いhashId', minLength: 12, alphabet: currentAlphabet },
    { name: '数字と大文字', minLength: 8, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
    { name: '小文字と数字', minLength: 8, alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789' }
  ]
  
  testConfigs.forEach(config => {
    const testHashids = new Hashids(hashidsSecret, config.minLength, config.alphabet)
    const testEncoded = testHashids.encode(123)
    console.log(`   ${config.name}:`)
    console.log(`     MinLength: ${config.minLength}, Alphabet: ${config.alphabet.substring(0, 20)}...`)
    console.log(`     例: 123 -> "${testEncoded}" (${testEncoded.length}文字)`)
    console.log('')
  })

  console.log('6️⃣ 現在の設定の利点:')
  console.log('   ✅ 8文字の最小長度で十分なセキュリティ')
  console.log('   ✅ 62文字の文字セットで多様性を確保')
  console.log('   ✅ 英数字のみでURLフレンドリー')
  console.log('   ✅ 読みやすく、タイプしやすい')
  console.log('')

  console.log('✅ HashIDsパラメータ設定確認完了')
}

showHashIdsParameters()
