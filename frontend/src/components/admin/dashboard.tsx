import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { AdminOverview } from "@/components/admin/overview"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen hexagon-grid flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} relative z-10`}>
        {/* Header */}
        <AdminHeader toggleSidebar={toggleSidebar} />

        {/* Main Dashboard Content */}
        <main className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="glass p-1 rounded-xl border border-brand-green/30">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <AdminOverview />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
