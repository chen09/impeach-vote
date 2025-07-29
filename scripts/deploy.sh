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

# 実際のデプロイフロー
echo "🔄 実際のデプロイフローを実行します..."

# Git pull
echo "📥 Git pull を実行します..."
git pull

# Docker Compose の停止
echo "🧹 既存のコンテナを停止します..."
docker-compose -f docker-compose.prod.yml down

# Docker システムのクリーンアップ
echo "🧹 Docker システムをクリーンアップします..."
docker system prune -f

# アプリケーションのビルドと起動
echo "🔨 Docker イメージをビルドして起動します..."
docker-compose -f docker-compose.prod.yml up -d --build

# ヘルスチェック
echo "🏥 ヘルスチェックを実行します..."
sleep 30

# 詳細なヘルスチェック
echo "🔍 詳細なヘルスチェックを実行中..."

# コンテナの状態確認
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ コンテナが正常に起動しています"
else
    echo "❌ コンテナの起動に失敗しました"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# アプリケーションのヘルスチェック（ポート3000）
echo "🔍 アプリケーションのヘルスチェック..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ アプリケーションヘルスチェック成功"
    
    # ヘルスチェックの詳細を表示
    echo "📊 ヘルスチェック詳細:"
    curl -s http://localhost:3000/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/health
else
    echo "❌ アプリケーションヘルスチェックに失敗しました"
    echo "📋 コンテナログを確認してください："
    docker-compose -f docker-compose.prod.yml logs --tail=50
    exit 1
fi

# API接続テスト
echo "🔍 API接続をテストしています..."
if curl -f http://localhost:3000/api/front/polls > /dev/null 2>&1; then
    echo "✅ API接続成功"
    
    # APIレスポンスの詳細を表示
    echo "📊 APIレスポンス（最初の100文字）:"
    curl -s http://localhost:3000/api/front/polls | head -c 100
    echo "..."
else
    echo "❌ API接続に失敗しました"
fi

# Nginx の状態確認（独立したNginx）
echo "🔍 Nginx の状態確認..."
if command -v nginx &> /dev/null; then
    echo "✅ Nginx が利用可能です"
    nginx -t 2>/dev/null && echo "✅ Nginx 設定が正常です" || echo "❌ Nginx 設定に問題があります"
    
    # Nginx プロセスの確認
    if pgrep nginx > /dev/null; then
        echo "✅ Nginx プロセスが実行中です"
    else
        echo "❌ Nginx プロセスが見つかりません"
    fi
else
    echo "⚠️  Nginx が見つかりません"
fi

echo "✅ デプロイが完了しました！"
echo "🌐 アプリケーションは https://vote.impeach.supplynexus.store で利用可能です"
echo "🔧 アプリケーション: http://localhost:3000"

echo "📊 ログを表示します："
docker-compose -f docker-compose.prod.yml logs --tail=20 