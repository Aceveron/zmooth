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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample user groups data
const initialUserGroups = [
  {
    id: "1",
    groupName: "Administrators",
    permissions: "Full Access",
    userCount: 3,
    description: "System administrators with full access",
    active: true,
  },
  {
    id: "2",
    groupName: "Premium Users",
    permissions: "Extended Access",
    userCount: 25,
    description: "Premium subscribers with extended privileges",
    active: true,
  },
  {
    id: "3",
    groupName: "Basic Users",
    permissions: "Standard Access",
    userCount: 150,
    description: "Standard users with basic access",
    active: true,
  },
  {
    id: "4",
    groupName: "Guest Users",
    permissions: "Limited Access",
    userCount: 45,
    description: "Temporary guest access",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [userGroups, setUserGroups] = useState(initialUserGroups)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editGroupId, setEditGroupId] = useState<string | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    groupName: "",
    permissions: "Standard Access",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    groupName: "",
    permissions: "Standard Access",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null)
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
    setSelectedGroups((prev) => (prev.includes(id) ? prev.filter((groupId) => groupId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(userGroups.map((group) => group.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGroup = {
      id: (userGroups.length + 1).toString(),
      groupName: formData.groupName,
      permissions: formData.permissions,
      userCount: 0,
      description: formData.description,
      active: true,
    }
    setUserGroups((prev) => [...prev, newGroup])
    setIsAddDialogOpen(false)
    setFormData({
      groupName: "",
      permissions: "Standard Access",
      description: "",
    })
    toast({
      title: "Success",
      description: "User group created successfully!",
    })
  }

  // Filter based on search query
  const filteredUserGroups = userGroups.filter(
    (group) =>
      group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.permissions.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Group - Pre-fill form with selected group data
  const handleEditClick = (group: any) => {
    setEditGroupId(group.id)
    setEditFormData({
      groupName: group.groupName,
      permissions: group.permissions,
      description: group.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserGroups((prev) =>
      prev.map((group) =>
        group.id === editGroupId
          ? {
              ...group,
              groupName: editFormData.groupName,
              permissions: editFormData.permissions,
              description: editFormData.description,
            }
          : group,
      ),
    )
    setIsEditDialogOpen(false)
    setEditGroupId(null)
    toast({
      title: "Success",
      description: "User group updated successfully!",
    })
  }

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setUserGroups((prev) => prev.map((group) => (group.id === id ? { ...group, active: !group.active } : group)))
    const group = userGroups.find((g) => g.id === id)
    toast({
      title: "Success",
      description: `User group ${group?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Group
  const handleDeleteGroup = (id: string) => {
    setDeleteGroupId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteGroup = () => {
    setUserGroups((prev) => prev.filter((group) => group.id !== deleteGroupId))
    setIsDeleteDialogOpen(false)
    setDeleteGroupId(null)
    toast({
      title: "Success",
      description: "User group deleted successfully!",
    })
  }

  const cancelDeleteGroup = () => {
    setIsDeleteDialogOpen(false)
    setDeleteGroupId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setUserGroups((prev) =>
        prev.map((group) => (selectedGroups.includes(group.id) ? { ...group, active: true } : group)),
      )
      toast({
        title: "Success",
        description: `${selectedGroups.length} user groups activated successfully!`,
      })
      setSelectedGroups([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setUserGroups((prev) =>
        prev.map((group) => (selectedGroups.includes(group.id) ? { ...group, active: false } : group)),
      )
      toast({
        title: "Success",
        description: `${selectedGroups.length} user groups deactivated successfully!`,
      })
      setSelectedGroups([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedGroups.length
    setUserGroups((prev) => prev.filter((group) => !selectedGroups.includes(group.id)))
    setSelectedGroups([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} user group${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
                  <Users className="h-5 w-5" />
                  User Groups
                </CardTitle>
                <CardDescription>Manage user groups and their permissions</CardDescription>
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
                  disabled={selectedGroups.length === 0}
                >
                  Apply
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                      <Plus className="h-4 w-4" />
                      <span>Add User Group</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-brand-green">Add New User Group</DialogTitle>
                      <DialogDescription className="text-white/80">
                        Create a new user group with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-brand-green">Group Name</Label>
                            <Input
                              id="groupName"
                              name="groupName"
                              value={formData.groupName}
                              onChange={handleInputChange}
                              className="bg-brand-darkgray text-white placeholder:text-white/70"
                              placeholder="Enter group name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="permissions" className="text-brand-green">
                              Permissions Level
                            </Label>
                            <Select
                              value={formData.permissions}
                              onValueChange={(value) => handleSelectChange("permissions", value)}
                            >
                              <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                                <SelectValue placeholder="Select permissions" />
                              </SelectTrigger>
                              <SelectContent className="glass border-brand-green/30">
                                <SelectItem value="Full Access">Full Access</SelectItem>
                                <SelectItem value="Extended Access">Extended Access</SelectItem>
                                <SelectItem value="Standard Access">Standard Access</SelectItem>
                                <SelectItem value="Limited Access">Limited Access</SelectItem>
                                <SelectItem value="Read Only">Read Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                            Create Group
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
                    <TableHead className="border-0">Group Name</TableHead>
                    <TableHead className="border-0">Permissions</TableHead>
                    <TableHead className="border-0">Users</TableHead>
                    <TableHead className="border-0">Description</TableHead>
                    <TableHead className="border-0">Status</TableHead>
                    <TableHead className="text-right border-0">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserGroups.map((group) => (
                    <TableRow key={group.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                      <TableCell className="border-0">
                        <Checkbox
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={() => handleCheckboxChange(group.id)}
                          className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        />
                      </TableCell>
                      <TableCell className="font-medium border-0">
                        {group.groupName}
                      </TableCell>
                      <TableCell className="border-0">
                        {group.permissions}
                      </TableCell>
                      <TableCell className="border-0">
                        {group.userCount}
                      </TableCell>
                      <TableCell className="border-0 max-w-[200px] truncate">{group.description}</TableCell>
                      <TableCell className="border-0">
                        {group.active ? (
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
                              onClick={() => handleEditClick(group)}
                            >
                              <Edit className="h-4 w-4 mr-2 text-white" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-white hover:bg-brand-green/10 cursor-pointer"
                              onClick={() => handleToggleActive(group.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2 text-white" />
                              {group.active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Group
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
              <DialogTitle className="text-brand-green">Edit User Group</DialogTitle>
              <DialogDescription className="text-white/80">Edit user group details and permissions</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-brand-green">Group Name</Label>
                    <Input
                      value={editFormData.groupName}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                      className="bg-brand-darkgray text-white placeholder:text-white/70"
                      placeholder="Enter group name"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-brand-green">Permissions Level</Label>
                    <Select
                      value={editFormData.permissions}
                      onValueChange={(value) => setEditFormData((prev) => ({ ...prev, permissions: value }))}
                    >
                      <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-brand-green/30">
                        <SelectItem value="Full Access">Full Access</SelectItem>
                        <SelectItem value="Extended Access">Extended Access</SelectItem>
                        <SelectItem value="Standard Access">Standard Access</SelectItem>
                        <SelectItem value="Limited Access">Limited Access</SelectItem>
                        <SelectItem value="Read Only">Read Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                Are you sure you want to delete this user group? This action cannot be undone and will affect all users
                in this group.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelDeleteGroup}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteGroup}
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
                {`Are you sure you want to delete ${selectedGroups.length} selected user group${selectedGroups.length === 1 ? "" : "s"}? This action cannot be undone and will affect all users in these groups.`}
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
                {`Delete ${selectedGroups.length} Group${selectedGroups.length === 1 ? "" : "s"}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
