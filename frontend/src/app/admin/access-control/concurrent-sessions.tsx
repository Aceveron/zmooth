import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search, Monitor } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample concurrent sessions data
const initialConcurrentSessions = [
  {
    id: "1",
    ruleName: "Single Device Policy",
    userGroup: "Basic Users",
    maxSessions: 1,
    action: "Terminate Oldest",
    currentSessions: 150,
    description: "Allow only one active session per user",
    active: true,
  },
  {
    id: "2",
    ruleName: "Multi-Device Premium",
    userGroup: "Premium Users",
    maxSessions: 3,
    action: "Allow All",
    currentSessions: 75,
    description: "Premium users can have multiple sessions",
    active: true,
  },
  {
    id: "3",
    ruleName: "Admin Unlimited",
    userGroup: "Administrators",
    maxSessions: 0,
    action: "Allow All",
    currentSessions: 12,
    description: "Unlimited sessions for administrators",
    active: true,
  },
  {
    id: "4",
    ruleName: "Guest Restriction",
    userGroup: "Guest Users",
    maxSessions: 1,
    action: "Block New",
    currentSessions: 25,
    description: "Strict single session for guests",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [concurrentSessions, setConcurrentSessions] = useState(initialConcurrentSessions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editSessionId, setEditSessionId] = useState<string | null>(null)
  const [selectedSessions, setSelectedSessions] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    ruleName: "",
    userGroup: "Basic Users",
    maxSessions: "1",
    action: "Terminate Oldest",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    ruleName: "",
    userGroup: "Basic Users",
    maxSessions: "1",
    action: "Terminate Oldest",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedSessions((prev) => (prev.includes(id) ? prev.filter((sessionId) => sessionId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedSessions([])
    } else {
      setSelectedSessions(concurrentSessions.map((session) => session.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSession = {
      id: (concurrentSessions.length + 1).toString(),
      ruleName: formData.ruleName,
      userGroup: formData.userGroup,
      maxSessions: Number.parseInt(formData.maxSessions),
      action: formData.action,
      currentSessions: 0,
      description: formData.description,
      active: true,
    }
    setConcurrentSessions((prev) => [...prev, newSession])
    setIsAddDialogOpen(false)
    setFormData({
      ruleName: "",
      userGroup: "Basic Users",
      maxSessions: "1",
      action: "Terminate Oldest",
      description: "",
    })
    toast({
      title: "Success",
      description: "Concurrent session rule created successfully!",
    })
  }

  // Filter based on search query
  const filteredConcurrentSessions = concurrentSessions.filter(
    (session) =>
      session.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Session - Pre-fill form with selected session data
  const handleEditClick = (session: any) => {
    setEditSessionId(session.id)
    setEditFormData({
      ruleName: session.ruleName,
      userGroup: session.userGroup,
      maxSessions: session.maxSessions.toString(),
      action: session.action,
      description: session.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConcurrentSessions((prev) =>
      prev.map((session) =>
        session.id === editSessionId
          ? {
              ...session,
              ruleName: editFormData.ruleName,
              userGroup: editFormData.userGroup,
              maxSessions: Number.parseInt(editFormData.maxSessions),
              action: editFormData.action,
              description: editFormData.description,
            }
          : session,
      ),
    )
    setIsEditDialogOpen(false)
    setEditSessionId(null)
    toast({
      title: "Success",
      description: "Concurrent session rule updated successfully!",
    })
  }

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setConcurrentSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, active: !session.active } : session)),
    )
    const session = concurrentSessions.find((s) => s.id === id)
    toast({
      title: "Success",
      description: `Concurrent session rule ${session?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Session
  const handleDeleteSession = (id: string) => {
    setDeleteSessionId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSession = () => {
    setConcurrentSessions((prev) => prev.filter((session) => session.id !== deleteSessionId))
    setIsDeleteDialogOpen(false)
    setDeleteSessionId(null)
    toast({
      title: "Success",
      description: "Concurrent session rule deleted successfully!",
    })
  }

  const cancelDeleteSession = () => {
    setIsDeleteDialogOpen(false)
    setDeleteSessionId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setConcurrentSessions((prev) =>
        prev.map((session) => (selectedSessions.includes(session.id) ? { ...session, active: true } : session)),
      )
      toast({
        title: "Success",
        description: `${selectedSessions.length} concurrent session rules activated successfully!`,
      })
      setSelectedSessions([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setConcurrentSessions((prev) =>
        prev.map((session) => (selectedSessions.includes(session.id) ? { ...session, active: false } : session)),
      )
      toast({
        title: "Success",
        description: `${selectedSessions.length} concurrent session rules deactivated successfully!`,
      })
      setSelectedSessions([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedSessions.length
    setConcurrentSessions((prev) => prev.filter((session) => !selectedSessions.includes(session.id)))
    setSelectedSessions([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} concurrent session rule${deletedCount === 1 ? "" : "s"} deleted successfully!`,
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
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
              <CardTitle className="text-brand-green flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Concurrent Sessions
              </CardTitle>
              <CardDescription>Manage simultaneous user session policies</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedSessions.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search session rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Session Rule</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Session Rule</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new concurrent session policy
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Rule Name</Label>
                          <Input
                            id="ruleName"
                            name="ruleName"
                            value={formData.ruleName}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter rule name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="userGroup" className="text-brand-green">
                            User Group
                          </Label>
                          <Select
                            value={formData.userGroup}
                            onValueChange={(value) => handleSelectChange("userGroup", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select user group" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Basic Users">Basic Users</SelectItem>
                              <SelectItem value="Premium Users">Premium Users</SelectItem>
                              <SelectItem value="Business Users">Business Users</SelectItem>
                              <SelectItem value="Administrators">Administrators</SelectItem>
                              <SelectItem value="Guest Users">Guest Users</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maxSessions" className="text-brand-green">
                            Max Sessions (0 = Unlimited)
                          </Label>
                          <Input
                            id="maxSessions"
                            name="maxSessions"
                            type="number"
                            min="0"
                            max="10"
                            value={formData.maxSessions}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter max sessions"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="action" className="text-brand-green">
                            Action on Limit
                          </Label>
                          <Select
                            value={formData.action}
                            onValueChange={(value) => handleSelectChange("action", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Terminate Oldest">Terminate Oldest</SelectItem>
                              <SelectItem value="Block New">Block New Session</SelectItem>
                              <SelectItem value="Allow All">Allow All</SelectItem>
                              <SelectItem value="Ask User">Ask User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-brand-green">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter description"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Create Rule
                        </Button>
                      </DialogFooter>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                  <TableHead className="border-0">Rule Name</TableHead>
                  <TableHead className="border-0">User Group</TableHead>
                  <TableHead className="border-0">Max Sessions</TableHead>
                  <TableHead className="border-0">Action</TableHead>
                  <TableHead className="border-0">Current</TableHead>
                  <TableHead className="border-0">Description</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConcurrentSessions.map((session) => (
                  <TableRow key={session.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onCheckedChange={() => handleCheckboxChange(session.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{session.ruleName}</TableCell>
                    <TableCell className="border-0">{session.userGroup}</TableCell>
                    <TableCell className="border-0">
                      {session.maxSessions === 0 ? "Unlimited" : session.maxSessions}
                    </TableCell>
                    <TableCell className="border-0">
                      {session.action}
                    </TableCell>
                      <TableCell className="border-0">
                        {session.currentSessions}
                      </TableCell>
                    <TableCell className="border-0 max-w-[200px] truncate">{session.description}</TableCell>
                    <TableCell className="border-0">
                      {session.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right border-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-brand-green" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-brand-green/30">
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleEditClick(session)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(session.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {session.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Rule
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Session Rule</DialogTitle>
            <DialogDescription className="text-white/80">Edit concurrent session rule details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Rule Name</Label>
                  <Input
                    value={editFormData.ruleName}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, ruleName: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter rule name"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">User Group</Label>
                  <Select
                    value={editFormData.userGroup}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, userGroup: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Basic Users">Basic Users</SelectItem>
                      <SelectItem value="Premium Users">Premium Users</SelectItem>
                      <SelectItem value="Business Users">Business Users</SelectItem>
                      <SelectItem value="Administrators">Administrators</SelectItem>
                      <SelectItem value="Guest Users">Guest Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Max Sessions (0 = Unlimited)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={editFormData.maxSessions}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, maxSessions: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter max sessions"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Action on Limit</Label>
                  <Select
                    value={editFormData.action}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, action: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Terminate Oldest">Terminate Oldest</SelectItem>
                      <SelectItem value="Block New">Block New Session</SelectItem>
                      <SelectItem value="Allow All">Allow All</SelectItem>
                      <SelectItem value="Ask User">Ask User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-brand-green">Description</Label>
                <Input
                  value={editFormData.description}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-brand-darkgray text-white placeholder:text-white/70"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="mt-6" />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass border-red-600/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this concurrent session rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteSession}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteSession}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:text-white"
            >
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
              {`Are you sure you want to delete ${selectedSessions.length} selected concurrent session rule${selectedSessions.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedSessions.length} Rule${selectedSessions.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
