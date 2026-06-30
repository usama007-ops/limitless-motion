'use client'
import { useState } from 'react'

const gradients = [
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-700',
  'from-rose-400 to-pink-600',
  'from-blue-400 to-indigo-600',
  'from-cyan-400 to-blue-600',
  'from-lime-400 to-green-600',
  'from-fuchsia-400 to-pink-700',
]

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

function getInitials(name) {
  return (name || '?')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}

export default function MealImage({ src, alt, name }) {
  const [error, setError] = useState(false)

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt || name || 'Meal'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(name)} flex items-center justify-center`}>
      <span className="text-white/80 text-3xl font-bold drop-shadow-lg select-none">
        {getInitials(name)}
      </span>
    </div>
  )
}
