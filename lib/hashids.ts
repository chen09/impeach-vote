import Hashids from 'hashids'

// 環境変数からシークレットキーを取得、デフォルト値を設定
const hashidsSecret = process.env.HASHIDS_SECRET || 'impeach-vote-secret-key'

console.log('🔧 HashIDs設定:', { 
  secret: hashidsSecret ? hashidsSecret.substring(0, 10) + '...' : 'NOT_SET',
  envVar: process.env.HASHIDS_SECRET ? 'SET' : 'NOT_SET'
})

// Hashidsインスタンスの作成（環境変数のシークレットキーを使用）
const hashids = new Hashids(hashidsSecret, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

/**
 * データベースIDをハッシュIDに変換
 * @param id データベースの数値ID
 * @returns ハッシュID文字列
 */
export function encodeId(id: number): string {
  return hashids.encode(id)
}

/**
 * ハッシュIDをデータベースIDに変換
 * @param hashId ハッシュID文字列
 * @returns データベースの数値ID、無効な場合はnull
 */
export function decodeId(hashId: string): number | null {
  const decoded = hashids.decode(hashId)
  return decoded.length > 0 ? decoded[0] as number : null
}

/**
 * ハッシュIDが有効かどうかをチェック
 * @param hashId ハッシュID文字列
 * @returns 有効な場合はtrue
 */
export function isValidHashId(hashId: string): boolean {
  return decodeId(hashId) !== null
}
