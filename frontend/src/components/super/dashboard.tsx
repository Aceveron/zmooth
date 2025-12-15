"use client"

import { useState } from "react"
import { SuperSidebar } from "./sidebar"
import { SuperHeader } from "./header"
import { SuperOverview } from "./overview"

export function SuperDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <SuperSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} relative z-10`}>
        {/* Header */}
        <SuperHeader toggleSidebar={toggleSidebar} />

        {/* Main Dashboard Content */}
        <main className="pt-16 p-4 md:p-6">
          <div className="space-y-4">
            <SuperOverview />
          </div>
        </main>
      </div>
    </div>
  )
}
