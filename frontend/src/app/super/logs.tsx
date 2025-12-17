"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Download, Filter } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  const [logs] = useState(initialLogs)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

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

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "ERROR":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button
              variant="ghost"
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Activity Logs</CardTitle>
              <CardDescription>Monitor system activities and user actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[120px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Plan Management">Plan Management</SelectItem>
                  <SelectItem value="User Management">User Management</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-neongreen bg-transparent"
                onClick={handleClearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Button
                className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen"
                onClick={handleExportLogs}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <div className="rounded-md border border-brand-green/30">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px] border-0">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="border-0">Timestamp</TableHead>
                  <TableHead className="border-0">Level</TableHead>
                  <TableHead className="border-0">Action</TableHead>
                  <TableHead className="border-0">Actor</TableHead>
                  <TableHead className="border-0">Details</TableHead>
                  <TableHead className="border-0">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={() => handleCheckboxChange(log.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm border-0">{log.timestamp}</TableCell>
                    <TableCell className="border-0">
                      <Badge
                        variant={getLevelBadgeVariant(log.level)}
                        className={
                          log.level === "WARN"
                            ? "bg-yellow-400 text-yellow-900 border-yellow-400 hover:bg-yellow-500"
                            : log.level === "INFO"
                            ? "bg-green-700 text-white border-green-700 hover:bg-green-800"
                            : ""
                        }
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium border-0">{log.action}</TableCell>
                    <TableCell className="border-0">{log.actor}</TableCell>
                    <TableCell className="border-0 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </TableCell>
                    <TableCell className="border-0">
                      <Badge variant="outline" className="border-brand-green/40">
                        {log.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell className="text-center text-white/60 py-8" colSpan={7}>
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-white/60">
            Showing {filteredLogs.length} of {logs.length} log entries
            {selectedLogs.length > 0 && ` • ${selectedLogs.length} selected`}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActivityLogs
