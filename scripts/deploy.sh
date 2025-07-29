#!/bin/bash

# デプロイスクリプト
set -e

echo "🚀 投票システムのデプロイを開始します..."

# 環境変数ファイルの確認
if [ ! -f .env ]; then
    echo "❌ .env ファイルが見つかりません。env.example をコピーして設定してください。"
    exit 1
fi

# データベース接続の確認
echo "🔍 データベース接続を確認しています..."
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ .env ファイルに DATABASE_URL が設定されていません。"
    exit 1
fi

# SSL 証明書の確認
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo "⚠️  SSL 証明書が見つかりません。自己署名証明書を作成します..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Impeach Vote/CN=vote.impeach.supplynexus.store"
fi

# Docker Compose の停止とクリーンアップ
echo "🧹 既存のコンテナを停止します..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# イメージのビルド
echo "🔨 Docker イメージをビルドします..."
docker-compose -f docker-compose.prod.yml build --no-cache

# アプリケーションの起動
echo "🚀 アプリケーションを起動します..."
docker-compose -f docker-compose.prod.yml up -d

# ヘルスチェック
echo "🏥 ヘルスチェックを実行します..."
sleep 30

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ デプロイが完了しました！"
    echo "🌐 アプリケーションは https://vote.impeach.supplynexus.store で利用可能です"
else
    echo "❌ ヘルスチェックに失敗しました。ログを確認してください："
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo "📊 ログを表示します："
docker-compose -f docker-compose.prod.yml logs --tail=50 