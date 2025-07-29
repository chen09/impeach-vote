#!/bin/bash

# SSL 証明書設定スクリプト
set -e

echo "🔐 SSL 証明書の設定を開始します..."

# SSL ディレクトリの作成
mkdir -p ssl

# 自己署名証明書の作成
echo "📜 自己署名証明書を作成します..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Impeach Vote/CN=vote.impeach.supplynexus.store"

# 証明書の権限設定
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

echo "✅ SSL 証明書が正常に作成されました！"
echo "📁 証明書ファイル:"
echo "   - ssl/cert.pem (証明書)"
echo "   - ssl/key.pem (秘密鍵)"

# 証明書情報の表示
echo ""
echo "📋 証明書情報:"
openssl x509 -in ssl/cert.pem -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)"

echo ""
echo "⚠️  注意: これは自己署名証明書です。本番環境では Let's Encrypt などの正式な証明書を使用することを推奨します。" 