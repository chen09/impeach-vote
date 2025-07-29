'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Result {
  id: string
  text: string
  votes: number
  percentage: number
}

interface PollResult {
  poll: {
    id: string
    title: string
    description?: string
    totalVotes: number
  }
  results: Result[]
}

export default function ResultsPage() {
  const params = useParams()
  const [data, setData] = useState<PollResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch(`/api/front/results/${params.pollId}`)
      if (!response.ok) {
        throw new Error('結果の取得に失敗しました')
      }
      const resultData = await response.json()
      setData(resultData)
    } catch {
      setError('結果の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [params.pollId])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            結果が見つかりません
          </h1>
          <Link href="/" className="btn-primary">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  const { poll, results } = data
  const maxVotes = Math.max(...results.map(r => r.votes))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">投票結果</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {poll.title}
          </h2>
          {poll.description && (
            <p className="text-gray-600 mb-6">{poll.description}</p>
          )}
          
          <div className="mb-6">
            <p className="text-lg text-gray-700">
              総投票数: <span className="font-semibold">{poll.totalVotes}</span> 票
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              結果
            </h3>
            {results.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">
                    {result.text}
                  </span>
                  <span className="text-sm text-gray-600">
                    {result.votes} 票 ({result.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${result.percentage}%`,
                      opacity: result.votes === maxVotes ? 1 : 0.7,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex space-x-4">
            <Link
              href={`/poll/${poll.id}`}
              className="btn-primary"
            >
              投票する
            </Link>
            <Link
              href="/"
              className="btn-secondary"
            >
              他の投票を見る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 