#!/bin/bash

# 前后端分离デプロイスクリプト
set -e

echo "🚀 前后端分离投票システムのデプロイを開始します..."

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

# データベースURLの形式を確認
DATABASE_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
echo "📊 データベースURL: ${DATABASE_URL:0:50}..."

# データベース接続テスト
echo "🔍 データベース接続をテストしています..."
if command -v mysql &> /dev/null; then
    # MySQLクライアントが利用可能な場合
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    echo "🔍 データベースホスト: $DB_HOST:$DB_PORT"
    echo "🔍 データベース名: $DB_NAME"
    
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
        echo "✅ データベースホストに接続可能"
    else
        echo "❌ データベースホストに接続できません: $DB_HOST:$DB_PORT"
        echo "⚠️  ネットワーク接続を確認してください"
    fi
else
    echo "⚠️  MySQLクライアントが見つかりません。接続テストをスキップします。"
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

# 既存のコンテナを停止
echo "🧹 既存のコンテナを停止します..."
docker-compose -f docker-compose.yml down --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.frontend-backend.yml down --remove-orphans 2>/dev/null || true

# 前后端分离設定を使用
echo "🔧 前后端分离設定を使用します..."

# イメージのビルド
echo "🔨 Docker イメージをビルドします..."
docker-compose -f docker-compose.frontend-backend.yml build --no-cache

# アプリケーションの起動
echo "🚀 アプリケーションを起動します..."
docker-compose -f docker-compose.frontend-backend.yml up -d

# ヘルスチェック
echo "🏥 ヘルスチェックを実行します..."
sleep 30

# 詳細なヘルスチェック
echo "🔍 詳細なヘルスチェックを実行中..."

# コンテナの状態確認
if docker-compose -f docker-compose.frontend-backend.yml ps | grep -q "Up"; then
    echo "✅ コンテナが正常に起動しています"
else
    echo "❌ コンテナの起動に失敗しました"
    docker-compose -f docker-compose.frontend-backend.yml logs
    exit 1
fi

# フロントエンドのヘルスチェック
echo "🔍 フロントエンドのヘルスチェック..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ フロントエンドヘルスチェック成功"
else
    echo "❌ フロントエンドヘルスチェックに失敗しました"
fi

# バックエンドのヘルスチェック
echo "🔍 バックエンドのヘルスチェック..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ バックエンドヘルスチェック成功"
else
    echo "❌ バックエンドヘルスチェックに失敗しました"
fi

# Nginx のヘルスチェック
echo "🔍 Nginx のヘルスチェック..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx ヘルスチェック成功"
    
    # ヘルスチェックの詳細を表示
    echo "📊 ヘルスチェック詳細:"
    curl -s http://localhost/health | jq '.' 2>/dev/null || curl -s http://localhost/health
else
    echo "❌ Nginx ヘルスチェックに失敗しました"
    echo "📋 コンテナログを確認してください："
    docker-compose -f docker-compose.frontend-backend.yml logs --tail=50
    exit 1
fi

# API接続テスト
echo "🔍 API接続をテストしています..."
if curl -f http://localhost/api/front/polls > /dev/null 2>&1; then
    echo "✅ API接続成功"
    
    # APIレスポンスの詳細を表示
    echo "📊 APIレスポンス（最初の100文字）:"
    curl -s http://localhost/api/front/polls | head -c 100
    echo "..."
    
    # レスポンスヘッダーを確認
    echo "📊 APIレスポンスヘッダー:"
    curl -I http://localhost/api/front/polls 2>/dev/null | grep -E "(X-Backend-Server|X-API-Cache)" || echo "カスタムヘッダーが見つかりません"
else
    echo "❌ API接続に失敗しました"
fi

# フロントエンド接続テスト
echo "🔍 フロントエンド接続をテストしています..."
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ フロントエンド接続成功"
    
    # レスポンスヘッダーを確認
    echo "📊 フロントエンドレスポンスヘッダー:"
    curl -I http://localhost/ 2>/dev/null | grep -E "(X-Frontend-Server|X-SSR-Cache)" || echo "カスタムヘッダーが見つかりません"
else
    echo "❌ フロントエンド接続に失敗しました"
fi

echo "✅ 前后端分离デプロイが完了しました！"
echo "🌐 アプリケーションは https://vote.impeach.supplynexus.store で利用可能です"
echo "🔧 フロントエンド: http://localhost:3000"
echo "🔧 バックエンド: http://localhost:3001"

echo "📊 ログを表示します："
docker-compose -f docker-compose.frontend-backend.yml logs --tail=20 