#!/bin/bash

# データベース復元スクリプト（外部データベース用）
set -e

BACKUP_DIR="./backups"

echo "🔄 データベース復元を開始します..."

# バックアップディレクトリの確認
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ バックアップディレクトリが見つかりません: $BACKUP_DIR"
    exit 1
fi

# 環境変数ファイルの確認
if [ ! -f .env ]; then
    echo "❌ .env ファイルが見つかりません。"
    exit 1
fi

# DATABASE_URL の取得
DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"')
if [ -z "$DATABASE_URL" ]; then
    echo "❌ .env ファイルに DATABASE_URL が設定されていません。"
    exit 1
fi

# PostgreSQL クライアントの確認
if ! command -v psql &> /dev/null; then
    echo "❌ psql コマンドが見つかりません。PostgreSQL クライアントをインストールしてください。"
    exit 1
fi

# 利用可能なバックアップファイルの一覧表示
echo "📋 利用可能なバックアップファイル:"
ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null || {
    echo "❌ バックアップファイルが見つかりません。"
    exit 1
}

# 最新のバックアップファイルを自動選択
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ バックアップファイルが見つかりません。"
    exit 1
fi

echo "📦 復元するバックアップファイル: $LATEST_BACKUP"

# 確認プロンプト
read -p "このバックアップファイルを復元しますか？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 復元をキャンセルしました。"
    exit 1
fi

# データベース接続のテスト
echo "🔍 データベース接続をテストしています..."
if ! psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
    echo "❌ データベースに接続できません。DATABASE_URL を確認してください。"
    exit 1
fi

# データベースの復元
echo "🔄 データベースを復元しています..."
gunzip -c "$LATEST_BACKUP" | psql "$DATABASE_URL"

echo "✅ データベースの復元が完了しました！"
echo "📁 復元されたバックアップ: $LATEST_BACKUP" 