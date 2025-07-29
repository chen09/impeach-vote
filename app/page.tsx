import { redirect } from 'next/navigation'

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          投票システム
        </h1>
        <p className="text-gray-600 mb-8">
          Next.js 15を使用した多言語対応フルスタック投票システム
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <a
            href="/en"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            English
          </a>
          <a
            href="/zh"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            中文
          </a>
          <a
            href="/ja"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700"
          >
            日本語
          </a>
          <a
            href="/es"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700"
          >
            Español
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>选择您的语言 / 言語を選択してください / Select your language</p>
        </div>
        <div className="mt-6 space-y-4">
          <a
            href="/en/polls"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            🗳️ View Polls (English)
          </a>
          <br />
          <a
            href="/poll/cmdohjfjq00021yo4ff5n4c2g"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
          >
            🎯 Test Poll Detail
          </a>
          <br />
          <a
            href="/api/polls"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            📊 API Data
          </a>
        </div>
      </div>
    </div>
  )
} 