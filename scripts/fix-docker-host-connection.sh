#!/bin/bash

# Docker コンテナからホストマシンのデータベースに接続するための修正スクリプト
set -e

echo "🔧 Docker コンテナからホストマシンのデータベース接続を修正します..."

# 現在のディレクトリを確認
echo "📂 現在のディレクトリ: $(pwd)"

# .env ファイルの確認
if [ ! -f .env ]; then
    echo "❌ .env ファイルが見つかりません"
    exit 1
fi

# バックアップを作成
echo "💾 .env ファイルのバックアップを作成します..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# ホストマシンのIPアドレスを取得
echo "🔍 ホストマシンのIPアドレスを取得します..."
HOST_IP=$(hostname -I | awk '{print $1}')
echo "📊 ホストIP: $HOST_IP"

# 現在のDATABASE_URLを確認
CURRENT_DB_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"')
echo "📊 現在のDATABASE_URL: $CURRENT_DB_URL"

# データベースURLを修正
echo "🔧 データベースURLを修正します..."

# 複数の選択肢を提供
echo "📋 データベース接続方法を選択してください："
echo "1. ホストマシンのIPアドレスを使用 ($HOST_IP)"
echo "2. 172.17.0.1 (Docker デフォルトブリッジ)"
echo "3. ホストマシンのネットワークインターフェース"
echo "4. カスタムIPアドレスを入力"

read -p "選択してください (1-4): " choice

case $choice in
    1)
        NEW_HOST="$HOST_IP"
        ;;
    2)
        NEW_HOST="172.17.0.1"
        ;;
    3)
        echo "利用可能なネットワークインターフェース："
        ip addr show | grep "inet " | grep -v "127.0.0.1"
        read -p "IPアドレスを入力してください: " NEW_HOST
        ;;
    4)
        read -p "カスタムIPアドレスを入力してください: " NEW_HOST
        ;;
    *)
        echo "無効な選択です。デフォルトでホストIPを使用します。"
        NEW_HOST="$HOST_IP"
        ;;
esac

# 新しいDATABASE_URLを作成
NEW_DB_URL="mysql://impeach:alHoSitIOnce@$NEW_HOST:3306/impeach"

# .env ファイルを更新
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$NEW_DB_URL\"|" .env

echo "✅ DATABASE_URL を修正しました:"
echo "📊 新しいDATABASE_URL: $NEW_DB_URL"

# 修正後の .env ファイルを表示
echo "📋 修正後の .env ファイルの内容:"
cat .env

# データベース接続テスト
echo "🔍 データベース接続をテストします..."
if command -v nc &> /dev/null; then
    echo "🔍 データベースホスト: $NEW_HOST:3306"
    
    if nc -z $NEW_HOST 3306 2>/dev/null; then
        echo "✅ データベースホストに接続可能です"
    else
        echo "❌ データベースホストに接続できません: $NEW_HOST:3306"
        echo "⚠️  以下を確認してください："
        echo "   - MySQL サービスが実行中か"
        echo "   - ファイアウォール設定"
        echo "   - MySQL の bind-address 設定"
    fi
else
    echo "⚠️  nc コマンドが見つかりません。接続テストをスキップします。"
fi

# MySQL サービスの状態確認
echo "🔍 MySQL サービスの状態を確認します..."
if command -v systemctl &> /dev/null; then
    if systemctl is-active --quiet mysql; then
        echo "✅ MySQL サービスが実行中です"
    else
        echo "❌ MySQL サービスが停止しています"
        echo "🔄 MySQL サービスを起動しますか？ (y/n)"
        read -p "選択してください: " start_mysql
        if [[ $start_mysql == "y" ]]; then
            sudo systemctl start mysql
            echo "✅ MySQL サービスを起動しました"
        fi
    fi
else
    echo "⚠️  systemctl が見つかりません。MySQL サービスの確認をスキップします。"
fi

echo "✅ Docker ホスト接続修正が完了しました！"
echo "🔄 アプリケーションを再起動してください："
echo "   docker-compose -f docker-compose.prod.yml down"
echo "   docker-compose -f docker-compose.prod.yml up -d --build" 