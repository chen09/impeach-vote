// import createMiddleware from 'next-intl/middleware'
// import { locales } from './lib/i18n'

// export default createMiddleware({
//   // サポートする言語
//   locales,
//   // デフォルト言語
//   defaultLocale: 'en',
//   // 言語をURLに含める
//   localePrefix: 'always'
// })

// export const config = {
//   // マッチするパス
//   matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
// }

// 一時的に無効化
export default function middleware() {
  return
}

export const config = {
  matcher: []
} 