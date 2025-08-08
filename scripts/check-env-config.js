const fs = require('fs')
const path = require('path')

// 環境変数を手動で読み込み
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env')
  const envLocalPath = path.join(__dirname, '..', '.env.local')
  
  console.log('🔍 環境変数ファイルを確認中...')
  console.log('')

  // .envファイルを確認
  if (fs.existsSync(envPath)) {
    console.log('📁 .envファイルが見つかりました:')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        if (key && value) {
          console.log(`   ${key}=${value.substring(0, 20)}...`)
        }
      }
    })
  } else {
    console.log('❌ .envファイルが見つかりません')
  }
  console.log('')

  // .env.localファイルを確認
  if (fs.existsSync(envLocalPath)) {
    console.log('📁 .env.localファイルが見つかりました:')
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf8')
    const lines = envLocalContent.split('\n')
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        if (key && value) {
          console.log(`   ${key}=${value.substring(0, 20)}...`)
        }
      }
    })
  } else {
    console.log('❌ .env.localファイルが見つかりません')
  }
  console.log('')

  // 現在の環境変数を確認
  console.log('🔍 現在の環境変数:')
  console.log(`   HASHIDS_SECRET: ${process.env.HASHIDS_SECRET ? process.env.HASHIDS_SECRET.substring(0, 20) + '...' : 'NOT_SET'}`)
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT_SET'}`)
  console.log('')

  // .envファイルから手動で環境変数を読み込み
  console.log('📝 .envファイルから手動で読み込み:')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^"|"$/g, '')
      }
    }
  })
  
  console.log(`   HASHIDS_SECRET: ${envVars.HASHIDS_SECRET ? envVars.HASHIDS_SECRET.substring(0, 30) + '...' : 'NOT_FOUND'}`)
  console.log(`   DATABASE_URL: ${envVars.DATABASE_URL ? envVars.DATABASE_URL.substring(0, 30) + '...' : 'NOT_FOUND'}`)
  console.log('')

  return envVars
}

loadEnvFile()
