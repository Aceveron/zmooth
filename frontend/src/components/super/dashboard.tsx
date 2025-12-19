import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuperSidebar } from "@/components/super/sidebar"
import { SuperHeader } from "@/components/super/header"
import { SuperOverview } from "@/components/super/overview"

export function SuperDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen hexagon-grid flex">
      {/* Sidebar */}
      <SuperSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} relative z-10`}>
        {/* Header */}
        <SuperHeader toggleSidebar={toggleSidebar} />

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
              <SuperOverview />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
