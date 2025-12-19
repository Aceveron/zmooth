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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, Trophy } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample Top Users data
const initialTopUsers = [
  {
    id: "1",
    user: "Ali Hassan",
    usageTime: "7h 40m",
    dataGB: 5.2,
    sessions: 15,
    rank: 1,
    plan: "Enterprise",
    location: "Kisumu",
    avgDaily: "2h 34m",
    status: "inactive",
  },
  {
    id: "2",
    user: "John Doe",
    usageTime: "5h 20m",
    dataGB: 3.4,
    sessions: 12,
    rank: 2,
    plan: "Premium",
    location: "Nairobi",
    avgDaily: "1h 47m",
    status: "active",
  },
  {
    id: "3",
    user: "Jane Smith",
    usageTime: "3h 05m",
    dataGB: 1.9,
    sessions: 8,
    rank: 3,
    plan: "Basic",
    location: "Mombasa",
    avgDaily: "1h 02m",
    status: "active",
  },
  {
    id: "4",
    user: "Mary W.",
    usageTime: "2h 10m",
    dataGB: 1.1,
    sessions: 6,
    rank: 4,
    plan: "Basic",
    location: "Nakuru",
    avgDaily: "43m",
    status: "active",
  },
]

export default function TopUsersPage() {
  const navigate = useNavigate()
  const [topUsersState, setTopUsersState] = useState(initialTopUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(topUsersState.map((user) => user.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter users based on search query
  const filteredUsers = topUsersState.filter(
    (user) =>
      user.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single user
  const handleDeleteUser = (id: string) => {
    setDeleteUserId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    setTopUsersState((prev) => prev.filter((user) => user.id !== deleteUserId))
    setIsDeleteDialogOpen(false)
    setDeleteUserId(null)
    toast({
      title: "Success",
      description: "User record deleted successfully!",
    })
  }

  const cancelDeleteUser = () => {
    setIsDeleteDialogOpen(false)
    setDeleteUserId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select user records first",
        variant: "destructive",
      });
      return;
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true);
    } else if (bulkAction === "refresh") {
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: `${selectedUsers.length} user records refreshed successfully!`,
      });
    } else if (bulkAction === "activate") {
      setTopUsersState((prev) =>
        prev.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "active" }
            : user
        )
      );
      toast({
        title: "Success",
        description: `${selectedUsers.length} user records activated!`,
      });
      setSelectedUsers([]);
    } else if (bulkAction === "deactivate") {
      setTopUsersState((prev) =>
        prev.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "inactive" }
            : user
        )
      );
      toast({
        title: "Success",
        description: `${selectedUsers.length} user records deactivated!`,
      });
      setSelectedUsers([]);
    }
    setBulkAction("");
  }

  const confirmBulkDelete = () => {
    setTopUsersState((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected user records deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Rank", "User", "Usage Time", "Data (GB)", "Sessions", "Plan", "Location", "Avg Daily", "Status"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.rank,
          user.user,
          user.usageTime,
          user.dataGB,
          user.sessions,
          user.plan,
          user.location,
          user.avgDaily,
          user.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "top-users-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Top users report exported successfully!",
    })
  }

  const handleToggleActive = (id: string) => {
    setTopUsersState((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    );
    toast({
      title: "Success",
      description: "User status updated successfully!",
    });
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
            <CardTitle className="text-brand-green flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Users
            </CardTitle>
            <CardDescription>Ranking users by usage time, data consumption, and activity</CardDescription>
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
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected users
                    const csvContent = [
                      ["Rank", "User", "Usage Time", "Data (GB)", "Sessions", "Plan", "Location", "Avg Daily", "Status"].join(","),
                      ...topUsersState
                        .filter((user) => selectedUsers.includes(user.id))
                        .map((user) =>
                          [
                            user.rank,
                            user.user,
                            user.usageTime,
                            user.dataGB,
                            user.sessions,
                            user.plan,
                            user.location,
                            user.avgDaily,
                            user.status,
                          ].join(","),
                        ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "top-users-report.csv";
                    a.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Success",
                      description: "Selected top users exported successfully!",
                    });
                    setBulkAction("");
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedUsers.length === 0 && bulkAction !== "refresh"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative -w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search top users..."
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
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Usage Time</TableHead>
                  <TableHead>Data Used (GB)</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Avg Daily</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleCheckboxChange(user.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>
                      {user.rank === 1 ? (
                        <Badge
                          className="bg-yellow-400 text-black hover:bg-yellow-600 hover:text-black transition-colors cursor-pointer"
                        >
                          🥇 #{user.rank}
                        </Badge>
                      ) : user.rank === 2 ? (
                        <Badge
                          className="bg-gray-400 text-black hover:bg-gray-200 hover:text-black transition-colors cursor-pointer"
                        >
                          🥈 #{user.rank}
                        </Badge>
                      ) : user.rank === 3 ? (
                        <Badge
                          className="bg-amber-600 text-black hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                        >
                          🥉 #{user.rank}
                        </Badge>
                      ) : (
                        <Badge variant="outline">#{user.rank}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{user.user}</TableCell>
                    <TableCell>{user.usageTime}</TableCell>
                    <TableCell>{user.dataGB.toFixed(2)}</TableCell>
                    <TableCell>{user.sessions}</TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.avgDaily}</TableCell>
                    <TableCell>
                      {user.status === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : user.status === "inactive" ? (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          Inactive
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{user.status}</Badge>
                      )}
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
                            onClick={() => handleToggleActive(user.id)}
                          >
                            {user.status === "active" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single user
                              const csvContent = [
                                ["Rank", "User", "Usage Time", "Data (GB)", "Sessions", "Plan", "Location", "Avg Daily", "Status"].join(","),
                                [
                                  user.rank,
                                  user.user,
                                  user.usageTime,
                                  user.dataGB,
                                  user.sessions,
                                  user.plan,
                                  user.location,
                                  user.avgDaily,
                                  user.status,
                                ].join(","),
                              ].join("\n");

                              const blob = new Blob([csvContent], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "top-user-record.csv";
                              a.click();
                              URL.revokeObjectURL(url);

                              toast({
                                title: "Success",
                                description: "Top user record exported successfully!",
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteUser(user.id)}
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
              Are you sure you want to delete this user record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteUser}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteUser} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedUsers.length} selected user records? This action cannot be undone.`}
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
              {`Delete ${selectedUsers.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
