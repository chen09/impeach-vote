const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function generateQRCodes() {
  try {
    console.log('📱 QRコード生成を開始します...')
    
    // データベース接続
    await prisma.$connect()
    console.log('✅ データベース接続成功')
    
    // すべての投票を取得
    const polls = await prisma.poll.findMany({
      include: {
        translations: {
          where: { languageId: 'en' },
        },
      },
      orderBy: { id: 'asc' },
    })
    
    console.log(`📊 ${polls.length}件の投票を取得しました`)
    
    // HTMLファイルを生成
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>投票QRコード一覧</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .qr-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .qr-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .qr-id {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        .qr-code {
            margin: 15px 0;
        }
        .qr-url {
            font-size: 12px;
            color: #888;
            word-break: break-all;
            margin-top: 10px;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .print-button:hover {
            background: #0056b3;
        }
        @media print {
            .print-button {
                display: none;
            }
            .qr-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>投票QRコード一覧</h1>
        <button class="print-button" onclick="window.print()">🖨️ 印刷</button>
        <div class="qr-grid">
            ${polls.map(poll => {
                const title = poll.translations[0]?.title || 'Untitled Poll'
                const url = `https://vote.impeach.world/poll/${poll.hashId}`
                return `
                    <div class="qr-card">
                        <div class="qr-title">${title}</div>
                        <div class="qr-id">ID: ${poll.id} | HashID: ${poll.hashId}</div>
                        <div class="qr-code" id="qr-${poll.id}"></div>
                        <div class="qr-url">${url}</div>
                    </div>
                `
            }).join('')}
        </div>
    </div>
    
    <script>
        // QRコードを生成
        ${polls.map(poll => {
            const url = `https://vote.impeach.world/poll/${poll.hashId}`
            return `
                QRCode.toCanvas(document.getElementById('qr-${poll.id}'), '${url}', {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
            `
        }).join('')}
    </script>
</body>
</html>
    `
    
    // HTMLファイルを保存
    const fs = require('fs')
    fs.writeFileSync('qr-codes.html', htmlContent)
    
    console.log('✅ QRコードHTMLファイルを生成しました: qr-codes.html')
    console.log('📱 ブラウザでqr-codes.htmlを開いてQRコードを確認してください')
    console.log('🖨️ 印刷ボタンでQRコードを印刷できます')
    
    // 投票一覧をコンソールに表示
    console.log('\n📋 投票一覧:')
    for (const poll of polls) {
        const title = poll.translations[0]?.title || 'Untitled'
        console.log(`  ${poll.id}. ${title}`)
        console.log(`     URL: https://vote.impeach.world/poll/${poll.hashId}`)
    }
    
  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateQRCodes()
