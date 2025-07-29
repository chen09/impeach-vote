import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '投票システム',
  description: 'Next.js 15を使用した多言語対応フルスタック投票システム - 英語、中文、日本語、スペイン語対応',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
} 