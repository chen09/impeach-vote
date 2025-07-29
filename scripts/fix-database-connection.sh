#!/bin/bash

# データベース接続修正スクリプト
set -e

echo "🔧 データベース接続を修正します..."

# 現在のディレクトリを確認
echo "📂 現在のディレクトリ: $(pwd)"

# .env ファイルの確認
if [ ! -f .env ]; then
    echo "❌ .env ファイルが見つかりません"
    exit 1
fi

echo "📋 現在の .env ファイルの内容:"
cat .env

# バックアップを作成
echo "💾 .env ファイルのバックアップを作成します..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# データベースURLを修正
echo "🔧 データベースURLを修正します..."

# 現在のDATABASE_URLを確認
CURRENT_DB_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
echo "📊 現在のDATABASE_URL: $CURRENT_DB_URL"

# host.docker.internal を実際のデータベースサーバーアドレスに変更
if [[ $CURRENT_DB_URL == *"host.docker.internal"* ]]; then
    echo "⚠️  host.docker.internal を検出しました。修正が必要です。"
    
    # 実際のデータベースサーバーアドレスに変更
    NEW_DB_URL="mysql://impeach:alHoSITIOnce@ec2-15-222-5-31.ca-central-1.compute.amazonaws.com:3306/impeach"
    
    # .env ファイルを更新
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$NEW_DB_URL\"|" .env
    
    echo "✅ DATABASE_URL を修正しました:"
    echo "📊 新しいDATABASE_URL: $NEW_DB_URL"
else
    echo "✅ DATABASE_URL は既に正しく設定されています"
fi

# 修正後の .env ファイルを表示
echo "📋 修正後の .env ファイルの内容:"
cat .env

# データベース接続テスト
echo "🔍 データベース接続をテストします..."
if command -v nc &> /dev/null; then
    DB_HOST="ec2-15-222-5-31.ca-central-1.compute.amazonaws.com"
    DB_PORT="3306"
    
    echo "🔍 データベースホスト: $DB_HOST:$DB_PORT"
    
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
        echo "✅ データベースホストに接続可能です"
    else
        echo "❌ データベースホストに接続できません: $DB_HOST:$DB_PORT"
        echo "⚠️  ネットワーク接続を確認してください"
    fi
else
    echo "⚠️  nc コマンドが見つかりません。接続テストをスキップします。"
fi

echo "✅ データベース接続修正が完了しました！"
echo "🔄 アプリケーションを再起動してください："
echo "   docker-compose -f docker-compose.prod.yml down"
echo "   docker-compose -f docker-compose.prod.yml up -d --build" 