'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { languageNames } from '@/i18n'

export default function LanguageSwitcher() {
  const locale = useLocale()

  return (
    <div className="flex gap-2">
      {Object.entries(languageNames).map(([code, name]) => (
        <Link
          key={code}
          href={`/${code}`}
          className={`px-3 py-1 rounded text-sm ${
            locale === code
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {name}
        </Link>
      ))}
    </div>
  )
} 