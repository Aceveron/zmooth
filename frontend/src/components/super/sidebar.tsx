"use client"

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface SuperSidebarProps {
  isOpen: boolean
}

export function SuperSidebar({ isOpen }: SuperSidebarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: '🏠', label: "Dashboard", href: "/super-admin" },
    { icon: '🔔', label: "Notifications", href: "/super-admin/notifications" },
    { icon: '👥', label: "Admin List", href: "/super-admin/admin-list" },
    { icon: '📄', label: "Activity Logs", href: "/super-admin/logs" },
  ]

  return (
    <div className={`fixed left-0 top-0 bottom-0 w-64 glass border-r border-brand-green/30 z-40 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}>
          {/* Logo */}
        {/**  <div className="p-4 border-b border-brand-green/30">
            <h1 className="text-xl font-bold text-brand-green neon-text">Super Admin</h1>
          </div>  */}

          {/* Menu Items */}
          <div className="py-4 overflow-y-auto h-[calc(100vh-64px-60px)]">
            <nav className="px-2 space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center px-4 py-2.5 text-white/80 rounded-md hover:bg-brand-green/10 transition-colors group"
                >
                  <span className="h-5 w-5 mr-3 text-brand-green group-hover:text-brand-neongreen">{item.icon}</span>
                  <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-green/30">
            <button
              className="w-full text-left text-white/80 hover:text-white hover:bg-brand-green/10 px-3 py-2 rounded"
              onClick={handleLogout}
            >
              <div className="flex items-center">🔓<span className="ml-3">Logout</span></div>
            </button>
          </div>
        </div>
  )
}
