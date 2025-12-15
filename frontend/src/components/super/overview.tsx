"use client"

export function SuperOverview() {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg glass shadow-lg relative overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,140,0.12)] bg-[#2a6939ff]/40 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm font-medium text-brand-green text-green-300">Total Admins</div>
              <div className="text-2xl font-bold text-white">7</div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center">👥</div>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-green-500 mr-1">60%</span>
            from last week
          </div>
        </div>

        <div className="p-4 rounded-lg glass shadow-lg relative overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,140,0.12)] bg-[#2a6939ff]/40 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm font-medium text-brand-green text-green-300">Active Sessions</div>
              <div className="text-2xl font-bold text-white">10</div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center">📶</div>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-green-500 mr-1">5%</span>
            from last month
          </div>
        </div>

        <div className="p-4 rounded-lg glass shadow-lg relative overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,140,0.12)] bg-[#2a6939ff]/40 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm font-medium text-brand-green text-green-300">Revenue (Today)</div>
              <div className="text-2xl font-bold text-white">KES 4</div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center">💳</div>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-red-500 mr-1">0.3%</span>
            from yesterday
          </div>
        </div>

        <div className="p-4 rounded-lg glass shadow-lg relative overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,140,0.12)] bg-[#2a6939ff]/40 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm font-medium text-brand-green text-green-300">Revenue (Month)</div>
              <div className="text-2xl font-bold text-white">KES 200</div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center">💳</div>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-green-500 mr-1">1%</span>
            from last month
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-lg glass border shadow-lg h-[28.5rem] bg-black/40 backdrop-blur-sm border-green-500/40 hover:shadow-[0_18px_50px_rgba(0,255,140,0.12)]">
          <div className="text-brand-green text-xl font-bold mb-1 text-green-300">Revenue Overview</div>
          <div className="text-sm text-gray-400 mb-4">Daily revenue for the past 30 days</div>
          <div className="h-[22rem] w-full flex items-center justify-center text-gray-400 border border-green-500/40 rounded-md p-6 bg-black/20">
            <div className="text-center w-full text-gray-300">
              <div className="mb-2 text-brand-green">📊</div>
              Revenue chart will be displayed here
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg glass border shadow-lg h-[28.5rem] bg-black/40 backdrop-blur-sm border-green-500/40 hover:shadow-[0_18px_50px_rgba(0,255,140,0.12)]">
          <div className="text-brand-green text-xl font-bold mb-1 text-green-300">Admins Activity</div>
          <div className="text-sm text-gray-400 mb-4">Active Admins over time</div>
          <div className="h-[22rem] w-full flex items-center justify-center text-gray-400 border border-green-500/40 rounded-md p-6 bg-black/20">
            <div className="text-center w-full text-gray-300">
              <div className="mb-2 text-brand-green">👥</div>
              Admins activity chart will be displayed here
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 rounded-lg glass border border-brand-green/30 shadow-lg bg-black/40 backdrop-blur-sm border-green-500/40">
        <div className="text-brand-green text-xl font-bold text-green-300">Recent Activity</div>
        <div className="text-sm text-gray-400">Latest system events and admin actions</div>
        <div className="space-y-4 mt-4">
          <div className="border-b border-green-500/40 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">Admin john@zmooth.local updated bandwidth policy</p>
              </div>
              <span className="text-sm text-gray-400 px-2 py-1">33 minutes ago</span>
            </div>
          </div>
          <div className="border-b border-green-500/40 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">root@zmooth.local created user operator@zmooth.local</p>
              </div>
              <span className="text-sm text-gray-400 px-2 py-1">6 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
