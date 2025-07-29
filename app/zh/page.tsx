'use client'

import { useState, useEffect } from 'react'

interface Poll {
  id: string
  translations: Array<{
    title: string
    description?: string
    language: {
      code: string
    }
  }>
  user: {
    name: string
  }
  options: Array<{
    id: string
    translations: Array<{
      text: string
      language: {
        code: string
      }
    }>
  }>
  _count: {
    votes: number
  }
  createdAt: string
}

export default function ChinesePage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls')
      if (!response.ok) {
        throw new Error('获取投票失败')
      }
      const data = await response.json()
      setPolls(data.polls)
    } catch (error) {
      console.error('获取投票错误:', error)
      setError('获取投票失败')
    } finally {
      setLoading(false)
    }
  }

  const getPollTitle = (poll: Poll) => {
    // 优先显示中文翻译，如果没有则显示英文
    const chineseTranslation = poll.translations.find(t => t.language.code === 'zh')
    const englishTranslation = poll.translations.find(t => t.language.code === 'en')
    return chineseTranslation?.title || englishTranslation?.title || '未命名投票'
  }

  const getPollDescription = (poll: Poll) => {
    // 优先显示中文翻译，如果没有则显示英文
    const chineseTranslation = poll.translations.find(t => t.language.code === 'zh')
    const englishTranslation = poll.translations.find(t => t.language.code === 'en')
    return chineseTranslation?.description || englishTranslation?.description
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">投票系统</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                登录
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                注册
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            最新投票
          </h2>
          <a
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            创建新投票
          </a>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无投票</p>
            <p className="text-sm text-gray-400 mt-2">
              数据库连接: {error ? '失败' : '成功'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getPollTitle(poll)}
                </h3>
                {getPollDescription(poll) && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {getPollDescription(poll)}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>创建者: {poll.user.name}</span>
                  <span>{poll._count.votes} 票</span>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`/poll/${poll.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    立即投票
                  </a>
                  <a
                    href={`/results/${poll.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200"
                  >
                    查看结果
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 