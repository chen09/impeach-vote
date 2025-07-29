#!/bin/bash

# データベースバックアップスクリプト（外部データベース用）
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="impeach_vote_backup_${DATE}.sql"

echo "💾 データベースバックアップを開始します..."

# バックアップディレクトリの作成
mkdir -p $BACKUP_DIR

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
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump コマンドが見つかりません。PostgreSQL クライアントをインストールしてください。"
    exit 1
fi

# データベース接続のテスト
echo "🔍 データベース接続をテストしています..."
if ! pg_dump --version &> /dev/null; then
    echo "❌ pg_dump が正常に動作しません。"
    exit 1
fi

# バックアップの実行
echo "📦 データベースをバックアップしています..."
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"

# バックアップファイルの圧縮
echo "🗜️  バックアップファイルを圧縮しています..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "✅ バックアップが完了しました！"
echo "📁 バックアップファイル: $BACKUP_DIR/${BACKUP_FILE}.gz"

# 古いバックアップファイルの削除（30日以上古いもの）
echo "🧹 古いバックアップファイルを削除しています..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "📊 バックアップ統計:"
echo "   現在のバックアップファイル数: $(ls -1 $BACKUP_DIR/*.sql.gz 2>/dev/null | wc -l)"
echo "   バックアップディレクトリサイズ: $(du -sh $BACKUP_DIR | cut -f1)" 