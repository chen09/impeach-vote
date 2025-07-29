import { prisma } from '@/lib/db'

async function getPolls() {
  try {
    const polls = await prisma.poll.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        translations: {
          include: {
            language: true,
          },
        },
        options: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return polls
  } catch (error) {
    console.error('Failed to fetch polls:', error)
    return []
  }
}

export default async function PollsPage() {
  const polls = await getPolls()

  const getPollTitle = (poll: any) => {
    const englishTranslation = poll.translations.find((t: any) => t.language.code === 'en')
    return englishTranslation?.title || 'Untitled Poll'
  }

  const getPollDescription = (poll: any) => {
    const englishTranslation = poll.translations.find((t: any) => t.language.code === 'en')
    return englishTranslation?.description
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
              Database connection: Failed
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll: any) => (
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
                  <span>Created by: {poll.user.name}</span>
                  <span>{poll._count.votes} votes</span>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`/poll/${poll.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Vote Now
                  </a>
                  <a
                    href={`/results/${poll.id}`}
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