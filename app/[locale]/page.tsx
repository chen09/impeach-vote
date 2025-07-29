'use client'

import Link from 'next/link'

export default function LocalePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">投票系统</h1>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              登录
            </Link>
            
            <Link
              href="/register"
              className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 