'use client'

import { useState, useEffect } from 'react'

interface Poll {
  id: number
  hashId: string
  title: string
  description?: string
  _count: { votes: number }
}

// 这次活动的5个特定投票
const EVENT_POLLS = [
  {
    hashId: 'qn4mE412',
    title: 'WHO IS THE MOST CORRUPT U.S. PRESIDENT?',
    description: 'Vote for the U.S. President you believe is the most corrupt in history.'
  },
  {
    hashId: 'pvBGAdJz',
    title: 'WHO WAS THE LEAST QUALIFIED U.S. PRESIDENT?',
    description: 'Vote for the U.S. President you believe was the least qualified for the office.'
  },
  {
    hashId: 'kzd0Xdl3',
    title: 'WHO IS THE MOST DICTATORIAL U.S. PRESIDENT?',
    description: 'Vote for the U.S. President you believe acted most like a dictator.'
  },
  {
    hashId: 'ZGB9qBK1',
    title: 'WHO IS THE MOST LYING U.S. PRESIDENT?',
    description: 'Vote for the U.S. President you believe told the most lies to the American people.'
  },
  {
    hashId: '9M4Ym48o',
    title: 'WHO IS THE BIGGEST RUSSIAN SPY IN U.S. HISTORY?',
    description: 'Vote for the person you believe is the biggest Russian spy in U.S. history.'
  }
]

export default function Event2024Page() {
  const [pollData, setPollData] = useState<{ [key: string]: Poll }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPollData() {
      try {
        // 获取所有投票数据
        const response = await fetch('/api/front/polls')
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        const data = await response.json()
        
        // 创建hashId到投票数据的映射
        const pollMap: { [key: string]: Poll } = {}
        data.polls.forEach((poll: Poll) => {
          pollMap[poll.hashId] = poll
        })
        
        setPollData(pollMap)
      } catch (error) {
        console.error('Error fetching poll data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPollData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event polls...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">
              IMPEACH 2024
            </h1>
            <p className="text-2xl opacity-90 mb-2">
              Presidential Accountability Polls
            </p>
            <p className="text-lg opacity-75">
              Scan QR codes to vote • Results update in real-time
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENT_POLLS.map((poll, index) => {
            const pollInfo = pollData[poll.hashId]
            const voteCount = pollInfo?._count?.votes || 0
            
            return (
              <div key={poll.hashId} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                {/* Poll Number */}
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">
                  {index + 1}
                </div>

                {/* Poll Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {poll.title}
                </h2>

                {/* Poll Description */}
                {poll.description && (
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {poll.description}
                  </p>
                )}

                {/* Poll URL */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 font-mono text-sm text-gray-600 break-all border-l-4 border-red-600">
                  https://vote.impeach.world/poll/{poll.hashId}
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://vote.impeach.world/poll/${poll.hashId}`}
                    alt={`QR Code for ${poll.title}`}
                    className="border-2 border-gray-200 rounded-xl p-3 bg-white mx-auto shadow-lg"
                  />
                </div>

                {/* Vote Count */}
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-red-600">{voteCount}</div>
                  <div className="text-sm text-gray-500">votes</div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <a
                    href={`https://vote.impeach.world/poll/${poll.hashId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg"
                  >
                    VOTE NOW
                  </a>
                  <a
                    href={`https://vote.impeach.world/results/${poll.hashId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg"
                  >
                    RESULTS
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            IMPEACH Voting System 2024
          </h3>
          <p className="text-gray-600 mb-2 text-lg">All polls are live and ready for voting</p>
          <p className="text-gray-600 mb-2">Scan QR codes with your phone camera to vote instantly</p>
          <p className="text-gray-600 mb-4">Results update in real-time</p>
          <div className="flex justify-center gap-4 mt-6">
            <a
              href="https://vote.impeach.world"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Visit Main Site
            </a>
            <a
              href="https://vote.impeach.world/qr-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              All Polls
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
