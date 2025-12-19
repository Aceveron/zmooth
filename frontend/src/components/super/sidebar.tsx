import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  LogOut,
  FileText,
  Bell,
} from "lucide-react"

interface SuperSidebarProps {
  isOpen: boolean
}

export function SuperSidebar({ isOpen }: SuperSidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/super" },
    { icon: Bell, label: "Notifications", href: "/super/notifications" },
    { icon: Users, label: "Admin List", href: "/super/admin-list" },
    { icon: FileText, label: "Activity Logs", href: "/super/logs" },  
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-brand-green/30 z-40 shadow-lg"
        >
          {/* Logo */}
          <div className="p-4 border-b border-brand-green/30">
            <h1 className="text-xl font-bold text-brand-green neon-text">Super</h1>
          </div>

          {/* Menu Items */}
          <div className="py-4 overflow-y-auto h-[calc(100vh-64px-60px)]">
            <nav className="px-2 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.href)}
                  className="w-full flex items-center px-4 py-2.5 text-white/80 rounded-md hover:bg-brand-green/10 transition-colors group"
                >
                  <item.icon className="h-5 w-5 mr-3 text-brand-green group-hover:text-brand-neongreen" />
                  <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-green/30">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/80 hover:text-white hover:bg-brand-green/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 text-brand-green" />
              Logout
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
