/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker デプロイメント用の設定
  output: 'standalone',
  
  // 実験的機能
  experimental: {
    // サーバーアクションを有効化
    serverActions: {
      allowedOrigins: ['vote.impeach.supplynexus.store'],
    },
  },
  
  // 画像最適化設定
  images: {
    // 外部ドメインからの画像を許可
    domains: ['vote.impeach.supplynexus.store'],
    // 画像最適化を有効化
    unoptimized: false,
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ]
  },

  // 一時的に国際化を無効化
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 