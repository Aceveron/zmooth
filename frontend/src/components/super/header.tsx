"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

interface SuperHeaderProps {
  toggleSidebar: () => void
}

export function SuperHeader({ toggleSidebar }: SuperHeaderProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [notifications] = useState(3)
  const [openMenu, setOpenMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="glass border-b border-brand-green/30 h-16 flex items-center px-4 sticky top-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-2 p-2 rounded text-white hover:bg-brand-green/10 text-xl">
            ☰
          </button>
          <h1 className="text-lg font-semibold hidden md:block text-brand-green">Admin++</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button className="relative p-2 rounded text-white hover:bg-brand-green/10 text-xl">
            🔔
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] text-brand-black font-bold">
                {notifications}
              </span>
            )}
          </button>

          <div className="relative">
            <button onClick={() => setOpenMenu((s) => !s)} className="rounded-full h-8 w-8 bg-brand-green text-brand-black flex items-center justify-center text-sm">
              👤
            </button>
            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#07100b] border border-brand-green/30 rounded-md shadow-lg p-2 text-white">
                <button className="w-full text-left px-2 py-2 hover:bg-brand-green/10 rounded" onClick={() => navigate('/profile')}>Profile</button>
                <hr className="my-1 border-brand-green/20" />
                <button className="w-full text-left px-2 py-2 text-red-400 hover:bg-red-500/10 rounded" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
