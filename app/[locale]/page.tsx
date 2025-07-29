'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export default function HomePage() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">{t('polls.title')}</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                {t('navigation.login')}
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {t('navigation.register')}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('polls.latestPolls')}
          </h2>
          <p className="text-gray-500 mb-8">
            {t('polls.noPolls')}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              現在の言語: {locale}
            </p>
            <p className="text-sm text-gray-600">
              タイトル: {t('polls.title')}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 