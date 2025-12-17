"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample User Activity data
const initialActivities = [
  {
    id: "1",
    user: "John Doe",
    sessions: 12,
    totalDuration: "5h 20m",
    bandwidthGB: 3.4,
    lastLogin: "2025-08-15 14:30",
    status: "active",
    location: "Nairobi",
    device: "Mobile",
    avgSessionTime: "26m",
  },
  {
    id: "2",
    user: "Jane Smith",
    sessions: 8,
    totalDuration: "3h 05m",
    bandwidthGB: 1.9,
    lastLogin: "2025-08-15 12:15",
    status: "active",
    location: "Mombasa",
    device: "Laptop",
    avgSessionTime: "23m",
  },
  {
    id: "3",
    user: "Ali Hassan",
    sessions: 15,
    totalDuration: "7h 40m",
    bandwidthGB: 5.2,
    lastLogin: "2025-08-15 16:45",
    status: "inactive",
    location: "Kisumu",
    device: "Desktop",
    avgSessionTime: "31m",
  },
  {
    id: "4",
    user: "Mary W.",
    sessions: 6,
    totalDuration: "2h 10m",
    bandwidthGB: 1.1,
    lastLogin: "2025-08-14 18:20",
    status: "active",
    location: "Nakuru",
    device: "Tablet",
    avgSessionTime: "22m",
  },
]

function UserActivityPage() {
  const navigate = useNavigate()
  const [activitiesState, setActivitiesState] = useState(initialActivities)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((activityId) => activityId !== id) : [...prev, id],
    )
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedActivities([])
    } else {
      setSelectedActivities(activitiesState.map((activity) => activity.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter activities based on search query
  const filteredActivities = activitiesState.filter(
    (activity) =>
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single activity
  const handleDeleteActivity = (id: string) => {
    setDeleteActivityId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteActivity = () => {
    setActivitiesState((prev) => prev.filter((activity) => activity.id !== deleteActivityId))
    setIsDeleteDialogOpen(false)
    setDeleteActivityId(null)
    toast({
      title: "Success",
      description: "Activity record deleted successfully!",
    })
  }

  const cancelDeleteActivity = () => {
    setIsDeleteDialogOpen(false)
    setDeleteActivityId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedActivities.length === 0) {
      toast({
        title: "Error",
        description: "Please select activity records first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "refresh") {
      // Simulate refresh action
      setSelectedActivities([])
      toast({
        title: "Success",
        description: `${selectedActivities.length} activity records refreshed successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setActivitiesState((prev) => prev.filter((activity) => !selectedActivities.includes(activity.id)))
    setSelectedActivities([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected activity records deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["User", "Sessions", "Total Duration", "Bandwidth (GB)", "Last Login", "Status", "Location", "Device"].join(","),
      ...filteredActivities.map((activity) =>
        [
          activity.user,
          activity.sessions,
          activity.totalDuration,
          activity.bandwidthGB,
          activity.lastLogin,
          activity.status,
          activity.location,
          activity.device,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user-activity-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "User activity report exported successfully!",
    })
  }

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
            <CardTitle className="text-brand-green">User Activity Reports</CardTitle>
            <CardDescription>Monitor user sessions, duration, and bandwidth usage</CardDescription>
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
                    // Only export selected activities
                    const csvContent = [
                      ["User", "Sessions", "Total Duration", "Bandwidth (GB)", "Last Login", "Status", "Location", "Device"].join(","),
                      ...activitiesState
                        .filter((activity) => selectedActivities.includes(activity.id))
                        .map((activity) =>
                          [
                            activity.user,
                            activity.sessions,
                            activity.totalDuration,
                            activity.bandwidthGB,
                            activity.lastLogin,
                            activity.status,
                            activity.location,
                            activity.device,
                          ].join(","),
                        ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "user-activity-report.csv";
                    a.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Success",
                      description: "Selected user activity records exported successfully!",
                    });
                    setBulkAction("");
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedActivities.length === 0 && bulkAction !== "refresh"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative -w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
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
                  <TableHead>Sessions</TableHead>
                  <TableHead>Total Duration</TableHead>
                  <TableHead>Bandwidth (GB)</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Avg Session</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity, index) => (
                  <TableRow key={activity.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => handleCheckboxChange(activity.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.sessions}</TableCell>
                    <TableCell>{activity.totalDuration}</TableCell>
                    <TableCell>{activity.bandwidthGB.toFixed(2)}</TableCell>
                    <TableCell>{activity.lastLogin}</TableCell>
                    <TableCell>
                      {activity.status === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>{activity.device}</TableCell>
                    <TableCell>{activity.avgSessionTime}</TableCell>
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
                              // Export single activity
                              const csvContent = [
                                ["User", "Sessions", "Total Duration", "Bandwidth (GB)", "Last Login", "Status", "Location", "Device"].join(","),
                                [
                                  activity.user,
                                  activity.sessions,
                                  activity.totalDuration,
                                  activity.bandwidthGB,
                                  activity.lastLogin,
                                  activity.status,
                                  activity.location,
                                  activity.device,
                                ].join(","),
                              ].join("\n");

                              const blob = new Blob([csvContent], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "user-activity-record.csv";
                              a.click();
                              URL.revokeObjectURL(url);

                              toast({
                                title: "Success",
                                description: "User activity record exported successfully!",
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteActivity(activity.id)}
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
              Are you sure you want to delete this activity record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteActivity}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteActivity} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedActivities.length} selected activity records? This action cannot be undone.`}
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
              {`Delete ${selectedActivities.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserActivityPage