import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, Bell, User, HelpCircle, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  toggleSidebar: () => void
}

export function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const navigate = useNavigate()
  const handleLogout = () => {
    navigate("/login")
  }
  const [notifications] = useState(3)

  return (
    <header className="glass border-b border-brand-green/30 h-16 flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 text-white hover:bg-brand-green/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold hidden md:block text-brand-green">Aceveronn UMS Dashboard</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-brand-green/10">
            <Bell className="h-5 w-5 text-brand-green" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] text-brand-black font-bold">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-brand-green text-brand-black">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-brand-green/30">
              <DropdownMenuLabel className="text-brand-green">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-brand-green/30" />
              <DropdownMenuItem
                className="cursor-pointer text-white hover:bg-brand-green/10"
                onClick={() => navigate("/profile")}
              >
                <User className="mr-2 h-4 w-4 text-brand-green" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-white hover:bg-brand-green/10"
                onClick={() => navigate("/admin/support/help-center")}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-brand-green" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-brand-green/30" />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 cursor-pointer hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
