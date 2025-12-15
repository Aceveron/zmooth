"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
const Search = ({ className }: { className?: string }) => <span className={className}>🔎</span>
// local toast fallback
const toast = (opts: { title?: string; description?: string }) => {
  console.log("TOAST:", opts.title, opts.description)
}

// Sample activity logs data
const initialLogs = [
  {
    id: "1",
    timestamp: "2025-01-25 14:30:15",
    level: "INFO",
    action: "Admin Login",
    actor: "admin@zmooth.com",
    details: "Successful login from IP 192.168.1.100",
    category: "Authentication",
  },
  {
    id: "2",
    timestamp: "2025-01-25 14:25:42",
    level: "WARN",
    action: "Failed Login Attempt",
    actor: "unknown@example.com",
    details: "Failed login attempt from IP 203.0.113.45",
    category: "Security",
  },
  {
    id: "3",
    timestamp: "2025-01-25 14:20:18",
    level: "INFO",
    action: "Plan Created",
    actor: "admin@zmooth.com",
    details: "Created new hotspot plan: Daily Unlimited",
    category: "Plan Management",
  },
  {
    id: "4",
    timestamp: "2025-01-25 14:15:33",
    level: "ERROR",
    action: "System Error",
    actor: "system",
    details: "Database connection timeout",
    category: "System",
  },
  {
    id: "5",
    timestamp: "2025-01-25 14:10:07",
    level: "INFO",
    action: "User Registration",
    actor: "user@example.com",
    details: "New user registered successfully",
    category: "User Management",
  },
]

function ActivityLogs() {
  const router = useNavigate()
  const [logs] = useState(initialLogs)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelOpen, setLevelOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  useEffect(() => {
    const onDocClick = () => {
      setLevelOpen(false)
      setCategoryOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedLogs((prev) => (prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(filteredLogs.map((log) => log.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter logs based on search query and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter

    return matchesSearch && matchesLevel && matchesCategory
  })

  // Export logs
  const handleExportLogs = () => {
    const selectedData = selectedLogs.length > 0 ? logs.filter((log) => selectedLogs.includes(log.id)) : filteredLogs

    const csvContent = [
      "Timestamp,Level,Action,Actor,Details,Category",
      ...selectedData.map(
        (log) => `"${log.timestamp}","${log.level}","${log.action}","${log.actor}","${log.details}","${log.category}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: `Exported ${selectedData.length} log entries`,
    })
  }

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setLevelFilter("all")
    setCategoryFilter("all")
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    })
  }

  

  return (
    <div className="py-6 px-8 text-white">
      <div className="w-full mx-auto">
        <div className="mb-6 flex items-center">
          <button onClick={() => router(-1)} className="px-3 py-2 rounded bg-white text-black">← Back</button>
          <div className="flex-1 text-center">
            <h2 className="text-4xl font-extrabold text-green-400 drop-shadow-lg">Activity Logs</h2>
            <p className="text-sm text-gray-300">Monitor system activities and user actions</p>
          </div>
        </div>

          <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={(e) => { e.stopPropagation(); setCategoryOpen(false); setLevelOpen((s) => !s) }} className="p-2 bg-[#050705] border border-green-700 rounded text-white min-w-[120px] flex items-center justify-between">
                <span>{levelFilter === 'all' ? 'All Levels' : levelFilter}</span>
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {levelOpen && (
                <div className="absolute mt-2 w-40 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg z-30">
                  <button type="button" onClick={() => { setLevelFilter('all'); setLevelOpen(false) }} className={`block w-full text-left px-4 py-2 ${levelFilter === 'all' ? 'bg-lime-400 text-black' : 'text-white'}`}>All Levels</button>
                  <button type="button" onClick={() => { setLevelFilter('INFO'); setLevelOpen(false) }} className={`block w-full text-left px-4 py-2 ${levelFilter === 'INFO' ? 'bg-lime-400 text-black' : 'text-white'}`}>INFO</button>
                  <button type="button" onClick={() => { setLevelFilter('WARN'); setLevelOpen(false) }} className={`block w-full text-left px-4 py-2 ${levelFilter === 'WARN' ? 'bg-lime-400 text-black' : 'text-white'}`}>WARN</button>
                  <button type="button" onClick={() => { setLevelFilter('ERROR'); setLevelOpen(false) }} className={`block w-full text-left px-4 py-2 ${levelFilter === 'ERROR' ? 'bg-lime-400 text-black' : 'text-white'}`}>ERROR</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button type="button" onClick={(e) => { e.stopPropagation(); setLevelOpen(false); setCategoryOpen((s) => !s) }} className="p-2 bg-[#050705] border border-green-700 rounded text-white min-w-[160px] flex items-center justify-between">
                <span>{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {categoryOpen && (
                <div className="absolute mt-2 w-56 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg z-30">
                  <button type="button" onClick={() => { setCategoryFilter('all'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'all' ? 'bg-lime-400 text-black' : 'text-white'}`}>All Categories</button>
                  <button type="button" onClick={() => { setCategoryFilter('Authentication'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'Authentication' ? 'bg-lime-400 text-black' : 'text-white'}`}>Authentication</button>
                  <button type="button" onClick={() => { setCategoryFilter('Security'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'Security' ? 'bg-lime-400 text-black' : 'text-white'}`}>Security</button>
                  <button type="button" onClick={() => { setCategoryFilter('Plan Management'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'Plan Management' ? 'bg-lime-400 text-black' : 'text-white'}`}>Plan Management</button>
                  <button type="button" onClick={() => { setCategoryFilter('User Management'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'User Management' ? 'bg-lime-400 text-black' : 'text-white'}`}>User Management</button>
                  <button type="button" onClick={() => { setCategoryFilter('System'); setCategoryOpen(false) }} className={`block w-full text-left px-4 py-2 ${categoryFilter === 'System' ? 'bg-lime-400 text-black' : 'text-white'}`}>System</button>
                </div>
              )}
            </div>

            <button onClick={handleClearFilters} className="px-3 py-2 border border-green-700 text-green-300 rounded">Clear</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 bg-[#07100b] border border-green-700 rounded text-white"
              />
            </div>
            <button className="px-4 py-2 bg-green-500 text-black rounded" onClick={handleExportLogs}>⬇️ Export</button>
          </div>
        </div>

        <div className="bg-[#050705] border border-green-700 rounded-xl p-4 overflow-hidden h-90">
          <div className="overflow-auto">
            <table className="overflow-auto w-full text-left table-fixed">
              <thead>
                <tr className="text-sm text-gray-300 border-b border-green-700">
                  <th className="w-12 py-3 pl-3 align-middle">
                    <input type="checkbox" checked={selectAll} onChange={() => handleSelectAllChange()} className="w-4 h-4 border-green-600" />
                  </th>
                  <th className="py-3 align-middle">Timestamp</th>
                  <th className="align-middle">Level</th>
                  <th className="align-middle">Action</th>
                  <th className="align-middle">Actor</th>
                  <th className="align-middle">Details</th>
                  <th className="align-middle">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="h-16 border-b border-green-700 hover:bg-black/20">
                    <td className="py-3 pl-3 align-middle">
                      <input type="checkbox" checked={selectedLogs.includes(log.id)} onChange={() => handleCheckboxChange(log.id)} className="w-4 h-4 border-green-600" />
                    </td>
                    <td className="py-3 align-middle font-mono text-sm">{log.timestamp}</td>
                    <td className="align-middle">
                      <span className={
                        log.level === "WARN"
                          ? "bg-yellow-400 text-yellow-900 px-2 py-1 rounded"
                          : log.level === "INFO"
                          ? "bg-green-700 text-white px-2 py-1 rounded"
                          : log.level === "ERROR"
                          ? "bg-red-600 text-white px-2 py-1 rounded"
                          : "px-2 py-1"
                      }>{log.level}</span>
                    </td>
                    <td className="py-3 align-middle font-medium">{log.action}</td>
                    <td className="align-middle">{log.actor}</td>
                    <td className="align-middle max-w-xs truncate" title={log.details}>{log.details}</td>
                    <td className="align-middle">
                      <span className="inline-block text-sm px-3 py-1 rounded-full border border-green-700 text-white bg-[#071014]">{log.category}</span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-white/60">No activity logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogs
