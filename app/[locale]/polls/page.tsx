'use client'

import { useState, useEffect } from 'react'

interface Poll {
  id: number
  hashId: string
  title: string
  description?: string
  user: {
    name: string
  }
  _count: {
    votes: number
  }
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPolls() {
      try {
        console.log('🔍 APIから投票データを取得中...')
        
        const response = await fetch('/api/front/polls')
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        
        const data = await response.json()
        console.log(`📊 ${data.polls.length}件の投票を取得しました`)
        setPolls(data.polls)
      } catch (error) {
        console.error('❌ API取得エラー:', error)
        setError('Failed to fetch polls')
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading polls...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Voting System</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Latest Polls
          </h2>
          <a
            href="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Poll
          </a>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No polls available</p>
            <p className="text-sm text-gray-400 mt-2">
              No polls found
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
                  {poll.title}
                </h3>
                {poll.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {poll.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Created by: {poll.user.name}</span>
                  <span>{poll._count.votes} votes</span>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`/poll/${poll.hashId}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Vote Now
                  </a>
                  <a
                    href={`/results/${poll.hashId}`}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200"
                  >
                    View Results
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