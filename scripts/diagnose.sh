#!/bin/bash

# 診断スクリプト
set -e

echo "🔍 投票システムの診断を開始します..."

# 環境変数の確認
echo "📋 環境変数の確認..."
if [ -f .env ]; then
    echo "✅ .env ファイルが見つかりました"
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL が設定されています"
        DATABASE_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
        echo "📊 データベースURL: ${DATABASE_URL:0:50}..."
    else
        echo "❌ DATABASE_URL が設定されていません"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        echo "✅ JWT_SECRET が設定されています"
    else
        echo "❌ JWT_SECRET が設定されていません"
    fi
else
    echo "❌ .env ファイルが見つかりません"
fi

# Docker コンテナの状態確認
echo ""
echo "🐳 Docker コンテナの状態確認..."
if command -v docker &> /dev/null; then
    echo "✅ Docker が利用可能です"
    
    # コンテナの一覧表示
    echo "📋 実行中のコンテナ:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # アプリケーションコンテナの詳細確認
    if docker ps | grep -q "impeach-vote-app"; then
        echo "✅ アプリケーションコンテナが実行中です"
        
        # コンテナのログを確認
        echo "📋 アプリケーションログ（最新20行）:"
        docker logs --tail=20 impeach-vote-app
        
        # コンテナ内の環境変数を確認
        echo "📋 コンテナ内の環境変数:"
        docker exec impeach-vote-app env | grep -E "(DATABASE_URL|JWT_SECRET|NODE_ENV)" || echo "環境変数の確認に失敗しました"
    else
        echo "❌ アプリケーションコンテナが見つかりません"
    fi
else
    echo "❌ Docker が利用できません"
fi

# ネットワーク接続の確認
echo ""
echo "🌐 ネットワーク接続の確認..."
if [ -f .env ] && grep -q "DATABASE_URL" .env; then
    DATABASE_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    echo "🔍 データベースホスト: $DB_HOST:$DB_PORT"
    
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
        echo "✅ データベースホストに接続可能です"
    else
        echo "❌ データベースホストに接続できません"
        echo "⚠️  ファイアウォール設定やネットワーク接続を確認してください"
    fi
fi

# アプリケーションのヘルスチェック
echo ""
echo "🏥 アプリケーションヘルスチェック..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ ヘルスチェックエンドポイントにアクセス可能です"
    
    # ヘルスチェックの詳細を表示
    echo "📊 ヘルスチェック詳細:"
    curl -s http://localhost/health | jq '.' 2>/dev/null || curl -s http://localhost/health
else
    echo "❌ ヘルスチェックエンドポイントにアクセスできません"
fi

# API接続テスト
echo ""
echo "🔌 API接続テスト..."
if curl -f http://localhost:3000/api/front/polls > /dev/null 2>&1; then
    echo "✅ API接続成功"
    
    # APIレスポンスの詳細を表示
    echo "📊 APIレスポンス（最初の100文字）:"
    curl -s http://localhost:3000/api/front/polls | head -c 100
    echo "..."
else
    echo "❌ API接続に失敗しました"
fi

# Nginx の状態確認
echo ""
echo "🌐 Nginx の状態確認..."
if command -v nginx &> /dev/null; then
    echo "✅ Nginx が利用可能です"
    nginx -t 2>/dev/null && echo "✅ Nginx 設定が正常です" || echo "❌ Nginx 設定に問題があります"
else
    echo "⚠️  Nginx が見つかりません（Docker で実行されている可能性があります）"
fi

# ディスク容量の確認
echo ""
echo "💾 ディスク容量の確認..."
df -h | head -1
df -h | grep -E "(/$|/app|/var)"

echo ""
echo "🔍 診断完了！"
echo "📋 問題が見つかった場合は、上記のログを確認して対処してください。" 