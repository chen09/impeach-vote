'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Option {
  id: string
  text: string
  _count: {
    votes: number
  }
}

interface Poll {
  id: string
  title: string
  description?: string
  options: Option[]
  user: {
    name: string
  }
  _count: {
    votes: number
  }
}

export default function PollPage() {
  const params = useParams()
  const router = useRouter()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fetchPoll = useCallback(async () => {
    try {
      const response = await fetch(`/api/front/polls/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch poll')
      }
      const data = await response.json()
      setPoll(data)
    } catch {
      setError('Failed to fetch poll')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchPoll()
  }, [fetchPoll])

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/front/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: params.id,
          optionId: selectedOption,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit vote')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/en/results/${params.id}`)
      }, 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit vote'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/en/polls"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Polls
          </Link>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
          <p className="text-gray-600 mb-4">The poll you're looking for doesn't exist.</p>
          <Link
            href="/en/polls"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Polls
          </Link>
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
              <Link
                href="/en/polls"
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Polls
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Vote submitted successfully! Redirecting to results page...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{poll.title}</h2>
          {poll.description && (
            <p className="text-gray-600 mb-6">{poll.description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <span>Created by: {poll.user.name}</span>
            <span>{poll._count.votes} votes</span>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Please select an option:</h3>
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option.text}</span>
                  <span className="text-sm text-gray-500">{option._count.votes} votes</span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleVote}
              disabled={!selectedOption || submitting}
              className={`flex-1 py-3 px-6 rounded-md font-medium ${
                !selectedOption || submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Submitting...' : 'Vote'}
            </button>
            <Link
              href={`/en/results/${poll.id}`}
              className="flex-1 bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-md hover:bg-gray-200"
            >
              View Results
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 