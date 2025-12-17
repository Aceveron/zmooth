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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample Sessioimport { useNavigate } from 'react-router-dom'
const initialSessionLogs = [
  {
    id: "1",
    user: "John Doe",
    mac: "AA:BB:CC:11:22:33",
    ip: "192.168.1.10",
    ap: "AP-01",
    login: "2025-08-10 10:10",
    logout: "2025-08-10 11:00",
    duration: "50m",
    dataUsed: "245MB",
    status: "OK",
    location: "Nairobi",
    device: "Mobile",
  },
  {
    id: "2",
    user: "Jane Smith",
    mac: "AA:BB:CC:44:55:66",
    ip: "192.168.1.11",
    ap: "AP-02",
    login: "2025-08-10 09:00",
    logout: "2025-08-10 09:45",
    duration: "45m",
    dataUsed: "180MB",
    status: "OK",
    location: "Mombasa",
    device: "Laptop",
  },
  {
    id: "3",
    user: "Ali Hassan",
    mac: "AA:BB:CC:77:88:99",
    ip: "192.168.1.12",
    ap: "AP-03",
    login: "2025-08-10 08:00",
    logout: "2025-08-10 08:20",
    duration: "20m",
    dataUsed: "95MB",
    status: "Failed",
    location: "Kisumu",
    device: "Desktop",
  },
  {
    id: "4",
    user: "Mary W.",
    mac: "AA:BB:CC:99:11:44",
    ip: "192.168.1.13",
    ap: "AP-01",
    login: "2025-08-10 14:30",
    logout: "2025-08-10 15:15",
    duration: "45m",
    dataUsed: "320MB",
    status: "OK",
    location: "Nakuru",
    device: "Tablet",
  },
]

export default function SessionLogsPage() {
  const navigate = useNavigate()
  const [sessionLogsState, setSessionLogsState] = useState(initialSessionLogs)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedLogs((prev) => (prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(sessionLogsState.map((log) => log.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter logs based on search query
  const filteredLogs = sessionLogsState.filter(
    (log) =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single log
  const handleDeleteLog = (id: string) => {
    setDeleteLogId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteLog = () => {
    setSessionLogsState((prev) => prev.filter((log) => log.id !== deleteLogId))
    setIsDeleteDialogOpen(false)
    setDeleteLogId(null)
    toast({
      title: "Success",
      description: "Session log deleted successfully!",
    })
  }

  const cancelDeleteLog = () => {
    setIsDeleteDialogOpen(false)
    setDeleteLogId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedLogs.length === 0) {
      toast({
        title: "Error",
        description: "Please select session logs first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "refresh") {
      setSelectedLogs([])
      toast({
        title: "Success",
        description: `${selectedLogs.length} session logs refreshed successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setSessionLogsState((prev) => prev.filter((log) => !selectedLogs.includes(log.id)))
    setSelectedLogs([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected session logs deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "User",
        "MAC",
        "IP",
        "Access Point",
        "Login",
        "Logout",
        "Duration",
        "Data Used",
        "Status",
        "Location",
        "Device",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          log.user,
          log.mac,
          log.ip,
          log.ap,
          log.login,
          log.logout,
          log.duration,
          log.dataUsed,
          log.status,
          log.location,
          log.device,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "session-logs-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Session logs exported successfully!",
    })
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
                  <Clock className="h-5 w-5 text-brand-green" />
                  Session Logs
                </CardTitle>
              </div>
              <CardDescription>
                Monitor user session activities, login/logout times, and connection details
              </CardDescription>
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
                  <SelectItem value="refresh">Refresh Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected logs
                    const csvContent = [
                      [
                        "User",
                        "MAC",
                        "IP",
                        "Access Point",
                        "Login",
                        "Logout",
                        "Duration",
                        "Data Used",
                        "Status",
                        "Location",
                        "Device",
                      ].join(","),
                      ...sessionLogsState
                        .filter((log) => selectedLogs.includes(log.id))
                        .map((log) =>
                          [
                            log.user,
                            log.mac,
                            log.ip,
                            log.ap,
                            log.login,
                            log.logout,
                            log.duration,
                            log.dataUsed,
                            log.status,
                            log.location,
                            log.device,
                          ].join(","),
                        ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "session-logs-report.csv";
                    a.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Success",
                      description: "Selected session logs exported successfully!",
                    });
                    setBulkAction("");
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedLogs.length === 0 && bulkAction !== "refresh"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search session logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>

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
                  <TableHead>User</TableHead>
                  <TableHead>MAC</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Access Point</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Logout</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Data Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log, index) => (
                  <TableRow key={log.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={() => handleCheckboxChange(log.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell className="font-mono text-xs">{log.mac}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>{log.ap}</TableCell>
                    <TableCell>{log.login}</TableCell>
                    <TableCell>{log.logout}</TableCell>
                    <TableCell>{log.duration}</TableCell>
                    <TableCell>{log.dataUsed}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "OK" ? "success" : "destructive"} className="capitalize">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.location}</TableCell>
                    <TableCell>{log.device}</TableCell>
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
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer">
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            Refresh Data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single session log
                              const csvContent = [
                                [
                                  "User",
                                  "MAC",
                                  "IP",
                                  "Access Point",
                                  "Login",
                                  "Logout",
                                  "Duration",
                                  "Data Used",
                                  "Status",
                                  "Location",
                                  "Device",
                                ].join(","),
                                [
                                  log.user,
                                  log.mac,
                                  log.ip,
                                  log.ap,
                                  log.login,
                                  log.logout,
                                  log.duration,
                                  log.dataUsed,
                                  log.status,
                                  log.location,
                                  log.device,
                                ].join(","),
                              ].join("\n");

                              const blob = new Blob([csvContent], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "session-log.csv";
                              a.click();
                              URL.revokeObjectURL(url);

                              toast({
                                title: "Success",
                                description: "Session log exported successfully!",
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Log
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteLog(log.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Log
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
              Are you sure you want to delete this session log? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteLog}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteLog} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedLogs.length} selected session logs? This action cannot be undone.`}
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
              {`Delete ${selectedLogs.length} Logs`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
