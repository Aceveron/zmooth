"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'
import {ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Sample Failed Logins data
const initialFailedLogins = [
  {
    id: "1",
    date: "2025-08-01",
    attempts: 5,
    topUser: "unknown-1",
    ipAddress: "192.168.1.100",
    location: "Nairobi",
    reason: "Invalid Password",
    timeRange: "14:00-15:00",
    severity: "medium",
    blocked: false,
  },
  {
    id: "2",
    date: "2025-08-02",
    attempts: 2,
    topUser: "unknown-2",
    ipAddress: "192.168.1.101",
    location: "Mombasa",
    reason: "User Not Found",
    timeRange: "09:30-10:00",
    severity: "low",
    blocked: false,
  },
  {
    id: "3",
    date: "2025-08-03",
    attempts: 7,
    topUser: "john",
    ipAddress: "192.168.1.102",
    location: "Kisumu",
    reason: "Account Locked",
    timeRange: "16:00-17:00",
    severity: "high",
    blocked: true,
  },
  {
    id: "4",
    date: "2025-08-04",
    attempts: 3,
    topUser: "ali",
    ipAddress: "192.168.1.103",
    location: "Nakuru",
    reason: "Invalid Password",
    timeRange: "11:00-12:00",
    severity: "medium",
    blocked: false,
  },
  {
    id: "5",
    date: "2025-08-05",
    attempts: 12,
    topUser: "hacker123",
    ipAddress: "192.168.1.104",
    location: "Unknown",
    reason: "Brute Force",
    timeRange: "02:00-03:00",
    severity: "critical",
    blocked: true,
  },
]

export default function FailedLoginsPage() {
  const navigate = useNavigate()
  const [failedLoginsState, setFailedLoginsState] = useState(initialFailedLogins)
  const [selectedLogins, setSelectedLogins] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLoginId, setDeleteLoginId] = useState<string | null>(null)
  const [showGraph, setShowGraph] = useState(false)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedLogins((prev) => (prev.includes(id) ? prev.filter((loginId) => loginId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedLogins([])
    } else {
      setSelectedLogins(failedLoginsState.map((login) => login.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter logins based on search query
  const filteredLogins = failedLoginsState.filter(
    (login) =>
      login.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      login.topUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      login.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      login.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      login.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single login
  const handleDeleteLogin = (id: string) => {
    setDeleteLoginId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteLogin = () => {
    setFailedLoginsState((prev) => prev.filter((login) => login.id !== deleteLoginId))
    setIsDeleteDialogOpen(false)
    setDeleteLoginId(null)
    toast({
      title: "Success",
      description: "Failed login record deleted successfully!",
    })
  }

  const cancelDeleteLogin = () => {
    setIsDeleteDialogOpen(false)
    setDeleteLoginId(null)
  }

    // Toggle blocked state for a single login
  const handleToggleBlocked = (id: string) => {
    setFailedLoginsState((prev: typeof failedLoginsState) =>
      prev.map((login: typeof failedLoginsState[0]) =>
        login.id === id
          ? { ...login, blocked: !login.blocked }
          : login
      )
    )
    toast({
      title: "Success",
      description: "Blocked state updated successfully!",
    })
  }


  // Toggle severity between 'critical' and 'medium' for demonstration
  const handleToggleSeverity = (id: string) => {
    setFailedLoginsState((prev: typeof failedLoginsState) =>
      prev.map((login: typeof failedLoginsState[0]) =>
        login.id === id
          ? {
              ...login,
              severity: login.severity === "critical" ? "medium" : "critical",
            }
          : login
      )
    )
    toast({
      title: "Success",
      description: "Severity updated successfully!",
    })
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedLogins.length === 0) {
      toast({
        title: "Error",
        description: "Please select failed login records first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "block") {
      setFailedLoginsState((prev) =>
        prev.map((login) => (selectedLogins.includes(login.id) ? { ...login, blocked: true } : login)),
      )
      setSelectedLogins([])
      toast({
        title: "Success",
        description: `${selectedLogins.length} IP addresses blocked successfully!`,
      })
    } else if (bulkAction === "unblock") {
      setFailedLoginsState((prev) =>
        prev.map((login) => (selectedLogins.includes(login.id) ? { ...login, blocked: false } : login)),
      )
      setSelectedLogins([])
      toast({
        title: "Success",
        description: `${selectedLogins.length} IP addresses unblocked successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setFailedLoginsState((prev) => prev.filter((login) => !selectedLogins.includes(login.id)))
    setSelectedLogins([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected failed login records deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Date",
        "Failed Attempts",
        "Most Frequent Username",
        "IP Address",
        "Location",
        "Reason",
        "Time Range",
        "Severity",
        "Blocked",
      ].join(","),
      ...filteredLogins.map((login) =>
        [
          login.date,
          login.attempts,
          login.topUser,
          login.ipAddress,
          login.location,
          login.reason,
          login.timeRange,
          login.severity,
          login.blocked ? "Yes" : "No",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "failed-logins-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Failed logins report exported successfully!",
    })
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <CardTitle className="text-brand-green flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                    Failed Logins or Access Attempts
                </CardTitle>
              </div>
              <CardDescription>Monitor and analyze failed authentication attempts and security threats</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="block">Block IP Addresses</SelectItem>
                  <SelectItem value="unblock">Unblock IP Addresses</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected failed logins
                    const csvContent = [
                      [
                        "Date",
                        "Failed Attempts",
                        "Most Frequent Username",
                        "IP Address",
                        "Location",
                        "Reason",
                        "Time Range",
                        "Severity",
                        "Blocked",
                      ].join(","),
                      ...failedLoginsState
                        .filter((login) => selectedLogins.includes(login.id))
                        .map((login) =>
                          [
                            login.date,
                            login.attempts,
                            login.topUser,
                            login.ipAddress,
                            login.location,
                            login.reason,
                            login.timeRange,
                            login.severity,
                            login.blocked ? "Yes" : "No",
                          ].join(","),
                        ),
                    ].join("\n")

                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "failed-logins-report.csv"
                    a.click()
                    URL.revokeObjectURL(url)

                    toast({
                      title: "Success",
                      description: "Selected failed logins exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedLogins.length === 0 && bulkAction !== "block" && bulkAction !== "unblock"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search failed logins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Button variant="outline" onClick={() => setShowGraph((s) => !s)}>
                {showGraph ? "Hide Graph" : "Show Graph"}
              </Button>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>

          {showGraph && (
            <div className="mb-6">
              <ChartContainer
                className="h-[320px] w-full"
                config={{
                  attempts: { label: "Failed Attempts", color: "hsl(var(--chart-4))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredLogins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#888', fontSize: 14 }} />
                    <YAxis label={{ value: 'Failed Attempts', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 14 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="attempts" fill="var(--color-attempts)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

          <div className="rounded-md border border-brand-green/30 overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Failed Attempts</TableHead>
                  <TableHead>Most Frequent Username</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Time Range</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Blocked</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogins.map((login, index) => (
                  <TableRow key={login.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedLogins.includes(login.id)}
                        onCheckedChange={() => handleCheckboxChange(login.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{login.date}</TableCell>
                    <TableCell>
                      <Badge variant={login.attempts > 5 ? "destructive" : "secondary"}>{login.attempts}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{login.topUser}</TableCell>
                    <TableCell className="font-mono text-xs">{login.ipAddress}</TableCell>
                    <TableCell>{login.location}</TableCell>
                    <TableCell>{login.reason}</TableCell>
                    <TableCell>{login.timeRange}</TableCell>
                    <TableCell>{getSeverityBadge(login.severity)}</TableCell>
                    <TableCell>
                      <Badge variant={login.blocked ? "destructive" : "success"}>
                        {login.blocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-brand-green" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-brand-green/30">
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer">
                            <Eye className="h-4 w-4 mr-2 text-white" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer" onClick={() => handleToggleBlocked(login.id)}>
                            {login.blocked ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Block
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer" onClick={() => handleToggleSeverity(login.id)}>
                            {login.severity === "critical" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Deactivate Severity
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Activate Severity
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single failed login
                              const csvContent = [
                                [
                                  "Date",
                                  "Failed Attempts",
                                  "Most Frequent Username",
                                  "IP Address",
                                  "Location",
                                  "Reason",
                                  "Time Range",
                                  "Severity",
                                  "Blocked",
                                ].join(","),
                                [
                                  login.date,
                                  login.attempts,
                                  login.topUser,
                                  login.ipAddress,
                                  login.location,
                                  login.reason,
                                  login.timeRange,
                                  login.severity,
                                  login.blocked ? "Yes" : "No",
                                ].join(","),
                              ].join("\n")

                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = "failed-login.csv"
                              a.click()
                              URL.revokeObjectURL(url)

                              toast({
                                title: "Success",
                                description: "Failed login exported successfully!",
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteLogin(login.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass border-red-600/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this failed login record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteLogin}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteLogin} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent className="glass border-red-600/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Bulk Delete</DialogTitle>
            <DialogDescription className="text-white/80">
              {`Are you sure you want to delete ${selectedLogins.length} selected failed login records? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              {`Delete ${selectedLogins.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
