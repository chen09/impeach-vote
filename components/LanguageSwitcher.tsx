'use client'

import Link from 'next/link'
import { languageNames } from '@/i18n'

export default function LanguageSwitcher() {
  return (
    <div className="flex gap-2">
      {Object.entries(languageNames).map(([code, name]) => (
        <Link
          key={code}
          href={`/${code}`}
          className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {name}
        </Link>
      ))}
    </div>
  )
} 