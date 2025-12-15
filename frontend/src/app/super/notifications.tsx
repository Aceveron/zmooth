"use client"

import { useNavigate } from 'react-router-dom'

export default function NotificationsCenter() {
  const router = useNavigate()

  return (
    <div className="glass border-brand-green/30 shadow-lg p-4">
      <div className="flex flex-row items-center justify-between">
        <button className="bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 hover:text-gray-900 px-3 py-2 rounded" onClick={() => router(-1)}>
          ← Back
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 text-brand-green text-center text-lg font-semibold">
            <span className="text-2xl">🔔</span>
            Notifications
          </div>
        </div>
        <div style={{ width: 48 }} />
      </div>
    </div>
  )
}

