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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

// Sample Data Usage data
const initialDataUsage = [
  {
    id: "1",
    user: "John Doe",
    device: "Phone",
    location: "Nairobi",
    dataGB: 2.4,
    uploadGB: 0.8,
    downloadGB: 1.6,
    sessions: 12,
    avgPerSession: "200MB",
    peakHour: "14:00-15:00",
    status: "normal",
  },
  {
    id: "2",
    user: "Jane Smith",
    device: "Laptop",
    location: "Mombasa",
    dataGB: 4.1,
    uploadGB: 1.2,
    downloadGB: 2.9,
    sessions: 8,
    avgPerSession: "512MB",
    peakHour: "20:00-21:00",
    status: "high",
  },
  {
    id: "3",
    user: "Ali Hassan",
    device: "Tablet",
    location: "Kisumu",
    dataGB: 1.7,
    uploadGB: 0.5,
    downloadGB: 1.2,
    sessions: 15,
    avgPerSession: "113MB",
    peakHour: "18:00-19:00",
    status: "normal",
  },
  {
    id: "4",
    user: "Mary W.",
    device: "Desktop",
    location: "Nakuru",
    dataGB: 3.2,
    uploadGB: 0.9,
    downloadGB: 2.3,
    sessions: 6,
    avgPerSession: "533MB",
    peakHour: "16:00-17:00",
    status: "high",
  },
]

export default function DataUsagePage() {
  const navigate = useNavigate()
  const [dataUsageState, setDataUsageState] = useState(initialDataUsage)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null)
  const [showGraph, setShowGraph] = useState(false)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedRecords((prev) => (prev.includes(id) ? prev.filter((recordId) => recordId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(dataUsageState.map((record) => record.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter records based on search query
  const filteredRecords = dataUsageState.filter(
    (record) =>
      record.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single record
  const handleDeleteRecord = (id: string) => {
    setDeleteRecordId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRecord = () => {
    setDataUsageState((prev) => prev.filter((record) => record.id !== deleteRecordId))
    setIsDeleteDialogOpen(false)
    setDeleteRecordId(null)
    toast({
      title: "Success",
      description: "Data usage record deleted successfully!",
    })
  }

  const cancelDeleteRecord = () => {
    setIsDeleteDialogOpen(false)
    setDeleteRecordId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedRecords.length === 0) {
      toast({
        title: "Error",
        description: "Please select records first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "refresh") {
      setSelectedRecords([])
      toast({
        title: "Success",
        description: `${selectedRecords.length} records refreshed successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setDataUsageState((prev) => prev.filter((record) => !selectedRecords.includes(record.id)))
    setSelectedRecords([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected records deleted successfully!",
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
        "Device",
        "Location",
        "Data (GB)",
        "Upload (GB)",
        "Download (GB)",
        "Sessions",
        "Avg/Session",
        "Peak Hour",
        "Status",
      ].join(","),
      ...filteredRecords.map((record) =>
        [
          record.user,
          record.device,
          record.location,
          record.dataGB,
          record.uploadGB,
          record.downloadGB,
          record.sessions,
          record.avgPerSession,
          record.peakHour,
          record.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data-usage-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Data usage report exported successfully!",
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
                  <BarChart3 className="h-5 w-5 text-brand-green" />
                  Data Usage Reports
                </CardTitle>
              </div>
              <CardDescription>Monitor bandwidth consumption by users, devices, and locations</CardDescription>
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
                    // Only export selected records
                    const csvContent = [
                      [
                        "User",
                        "Device",
                        "Location",
                        "Data (GB)",
                        "Upload (GB)",
                        "Download (GB)",
                        "Sessions",
                        "Avg/Session",
                        "Peak Hour",
                        "Status",
                      ].join(","),
                      ...dataUsageState
                        .filter((record) => selectedRecords.includes(record.id))
                        .map((record) =>
                          [
                            record.user,
                            record.device,
                            record.location,
                            record.dataGB,
                            record.uploadGB,
                            record.downloadGB,
                            record.sessions,
                            record.avgPerSession,
                            record.peakHour,
                            record.status,
                          ].join(","),
                        ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "data-usage-report.csv";
                    a.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Success",
                      description: "Selected data usage records exported successfully!",
                    });
                    setBulkAction("");
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedRecords.length === 0 && bulkAction !== "refresh"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search data usage..."
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
                  dataGB: { label: "Data Used (GB)", color: "hsl(var(--chart-3))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredRecords}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" label={{ value: "User", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Data Used (GB)", angle: -90, position: "insideLeft" }} />
                    <Legend verticalAlign="top" height={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="dataGB" fill="var(--color-dataGB)" />
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
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Data Used (GB)</TableHead>
                  <TableHead>Upload (GB)</TableHead>
                  <TableHead>Download (GB)</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Avg/Session</TableHead>
                  <TableHead>Peak Hour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={record.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={() => handleCheckboxChange(record.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{record.user}</TableCell>
                    <TableCell>{record.device}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.dataGB.toFixed(2)}</TableCell>
                    <TableCell>{record.uploadGB.toFixed(2)}</TableCell>
                    <TableCell>{record.downloadGB.toFixed(2)}</TableCell>
                    <TableCell>{record.sessions}</TableCell>
                    <TableCell>{record.avgPerSession}</TableCell>
                    <TableCell>{record.peakHour}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === "high" ? "destructive" : "success"} className="capitalize">
                        {record.status}
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
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer">
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            Refresh Data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single data usage record
                              const csvContent = [
                                [
                                  "User",
                                  "Device",
                                  "Location",
                                  "Data (GB)",
                                  "Upload (GB)",
                                  "Download (GB)",
                                  "Sessions",
                                  "Avg/Session",
                                  "Peak Hour",
                                  "Status",
                                ].join(","),
                                [
                                  record.user,
                                  record.device,
                                  record.location,
                                  record.dataGB,
                                  record.uploadGB,
                                  record.downloadGB,
                                  record.sessions,
                                  record.avgPerSession,
                                  record.peakHour,
                                  record.status,
                                ].join(","),
                              ].join("\n");

                              const blob = new Blob([csvContent], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "data-usage-record.csv";
                              a.click();
                              URL.revokeObjectURL(url);

                              toast({
                                title: "Success",
                                description: "Data usage record exported successfully!",
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteRecord(record.id)}
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
              Are you sure you want to delete this data usage record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteRecord}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteRecord} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedRecords.length} selected records? This action cannot be undone.`}
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
              {`Delete ${selectedRecords.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
