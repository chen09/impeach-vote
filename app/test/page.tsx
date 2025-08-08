'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 APIテスト開始')
        const response = await fetch('/api/front/polls/8KBq3dV6')
        console.log('📊 レスポンス:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ APIエラー:', errorText)
          setError(`API Error: ${response.status} - ${errorText}`)
          return
        }
        
        const result = await response.json()
        console.log('✅ API成功:', result.title)
        setData(result)
      } catch (err) {
        console.error('❌ エラー:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        {data && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>
            {data.description && (
              <p className="text-gray-600 mb-4">{data.description}</p>
            )}
            
            <div className="mb-4">
              <p><strong>Poll ID:</strong> {data.id}</p>
              <p><strong>Hash ID:</strong> {data.hashId}</p>
              <p><strong>Created by:</strong> {data.user.name}</p>
              <p><strong>Total votes:</strong> {data._count.votes}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Options:</h3>
              <ul className="space-y-2">
                {data.options.map((option: any) => (
                  <li key={option.id} className="flex justify-between">
                    <span>{option.text}</span>
                    <span className="text-gray-500">{option._count.votes} votes</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
