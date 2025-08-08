'use client'

import { useState, useEffect } from 'react'

interface Poll {
  id: number
  hashId: string
  title: string
  description?: string
  user: { name: string }
  _count: { votes: number }
}

export default function QRCodesPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPolls() {
      try {
        const response = await fetch('/api/front/polls')
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        const data = await response.json()
        setPolls(data.polls)
      } catch (error) {
        setError('Failed to fetch polls')
        console.error('Error fetching polls:', error)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
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
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
              IMPEACH Voting Polls
            </h1>
            <p className="text-xl opacity-90">
              Scan QR codes to vote or view results
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {polls.map((poll, index) => (
            <div key={poll.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              {/* Poll Number */}
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {index + 1}
              </div>

              {/* Poll Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {poll.title}
              </h2>

              {/* Poll URL */}
              <div className="bg-gray-50 p-3 rounded-lg mb-6 font-mono text-sm text-gray-600 break-all border-l-4 border-red-600">
                https://vote.impeach.world/poll/{poll.hashId}
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://vote.impeach.world/poll/${poll.hashId}`}
                  alt={`QR Code for ${poll.title}`}
                  className="border-2 border-gray-200 rounded-lg p-2 bg-white mx-auto"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <a
                  href={`https://vote.impeach.world/poll/${poll.hashId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-bold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  VOTE NOW
                </a>
                <a
                  href={`https://vote.impeach.world/results/${poll.hashId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-bold text-center hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  RESULTS
                </a>
              </div>

              {/* Vote Count */}
              <div className="mt-4 text-center text-sm text-gray-500">
                {poll._count.votes} votes
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            IMPEACH Voting System
          </h3>
          <p className="text-gray-600 mb-2">All polls are live and ready for voting</p>
          <p className="text-gray-600 mb-2">Scan QR codes with your phone camera to vote instantly</p>
          <p className="text-gray-600">Results update in real-time</p>
        </div>
      </main>
    </div>
  )
}
