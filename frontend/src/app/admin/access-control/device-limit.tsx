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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample device limit data
const initialDeviceLimits = [
  {
    id: "1",
    username: "john.doe",
    email: "john.doe@example.com",
    deviceLimit: 3,
    currentDevices: 2,
    planType: "Premium",
    active: true,
  },
  {
    id: "2",
    username: "jane.smith",
    email: "jane.smith@example.com",
    deviceLimit: 5,
    currentDevices: 4,
    planType: "Business",
    active: true,
  },
  {
    id: "3",
    username: "guest.user",
    email: "guest@example.com",
    deviceLimit: 1,
    currentDevices: 1,
    planType: "Basic",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [deviceLimits, setDeviceLimits] = useState(initialDeviceLimits)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editLimitId, setEditLimitId] = useState<string | null>(null)
  const [selectedLimits, setSelectedLimits] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    deviceLimit: "3",
    planType: "Basic",
  })
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    deviceLimit: "3",
    planType: "Basic",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLimitId, setDeleteLimitId] = useState<string | null>(null)
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
    setSelectedLimits((prev) => (prev.includes(id) ? prev.filter((limitId) => limitId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedLimits([])
    } else {
      setSelectedLimits(deviceLimits.map((limit) => limit.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newLimit = {
      id: (deviceLimits.length + 1).toString(),
      username: formData.username,
      email: formData.email,
      deviceLimit: Number.parseInt(formData.deviceLimit),
      currentDevices: 0,
      planType: formData.planType,
      active: true,
    }
    setDeviceLimits((prev) => [...prev, newLimit])
    setIsAddDialogOpen(false)
    setFormData({
      username: "",
      email: "",
      deviceLimit: "3",
      planType: "Basic",
    })
    toast({
      title: "Success",
      description: "Device limit created successfully!",
    })
  }

  // Filter based on search query
  const filteredDeviceLimits = deviceLimits.filter(
    (limit) =>
      limit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      limit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      limit.planType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Limit - Pre-fill form with selected limit data
  const handleEditClick = (limit: any) => {
    setEditLimitId(limit.id)
    setEditFormData({
      username: limit.username,
      email: limit.email,
      deviceLimit: limit.deviceLimit.toString(),
      planType: limit.planType,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDeviceLimits((prev) =>
      prev.map((limit) =>
        limit.id === editLimitId
          ? {
              ...limit,
              username: editFormData.username,
              email: editFormData.email,
              deviceLimit: Number.parseInt(editFormData.deviceLimit),
              planType: editFormData.planType,
            }
          : limit,
      ),
    )
    setIsEditDialogOpen(false)
    setEditLimitId(null)
    toast({
      title: "Success",
      description: "Device limit updated successfully!",
    })
  }

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setDeviceLimits((prev) => prev.map((limit) => (limit.id === id ? { ...limit, active: !limit.active } : limit)))
    const limit = deviceLimits.find((l) => l.id === id)
    toast({
      title: "Success",
      description: `Device limit ${limit?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Limit
  const handleDeleteLimit = (id: string) => {
    setDeleteLimitId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteLimit = () => {
    setDeviceLimits((prev) => prev.filter((limit) => limit.id !== deleteLimitId))
    setIsDeleteDialogOpen(false)
    setDeleteLimitId(null)
    toast({
      title: "Success",
      description: "Device limit deleted successfully!",
    })
  }

  const cancelDeleteLimit = () => {
    setIsDeleteDialogOpen(false)
    setDeleteLimitId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setDeviceLimits((prev) =>
        prev.map((limit) => (selectedLimits.includes(limit.id) ? { ...limit, active: true } : limit)),
      )
      toast({
        title: "Success",
        description: `${selectedLimits.length} device limits activated successfully!`,
      })
      setSelectedLimits([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setDeviceLimits((prev) =>
        prev.map((limit) => (selectedLimits.includes(limit.id) ? { ...limit, active: false } : limit)),
      )
      toast({
        title: "Success",
        description: `${selectedLimits.length} device limits deactivated successfully!`,
      })
      setSelectedLimits([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedLimits.length
    setDeviceLimits((prev) => prev.filter((limit) => !selectedLimits.includes(limit.id)))
    setSelectedLimits([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} device limit${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green">Device Limits</CardTitle>
              <CardDescription>Manage maximum devices per user account</CardDescription>
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
                disabled={selectedLimits.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Device Limit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Device Limit</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Set device limits for a user account
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter username"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-brand-green">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter email"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="deviceLimit" className="text-brand-green">
                            Device Limit
                          </Label>
                          <Input
                            id="deviceLimit"
                            name="deviceLimit"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.deviceLimit}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter device limit"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="planType" className="text-brand-green">
                            Plan Type
                          </Label>
                          <Select
                            value={formData.planType}
                            onValueChange={(value) => handleSelectChange("planType", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                            </SelectContent>
                          </Select>
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
                          Create Limit
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
                  <TableHead className="border-0">Username</TableHead>
                  <TableHead className="border-0">Email</TableHead>
                  <TableHead className="border-0">Device Usage</TableHead>
                  <TableHead className="border-0">Plan Type</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeviceLimits.map((limit) => (
                  <TableRow key={limit.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedLimits.includes(limit.id)}
                        onCheckedChange={() => handleCheckboxChange(limit.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{limit.username}</TableCell>
                    <TableCell className="border-0">{limit.email}</TableCell>
                    <TableCell className="border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {limit.currentDevices}/{limit.deviceLimit}
                        </span>
                        <Badge
                          variant={
                            limit.currentDevices >= limit.deviceLimit
                              ? "destructive"
                              : limit.currentDevices >= limit.deviceLimit * 0.8
                                ? "secondary"
                                : "success"
                          }
                        >
                          {limit.currentDevices >= limit.deviceLimit
                            ? "Full"
                            : limit.currentDevices >= limit.deviceLimit * 0.8
                              ? "Near Limit"
                              : "Available"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-0">{limit.planType}</TableCell>
                      <TableCell className="border-0">
                      {limit.active ? (
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
                            onClick={() => handleEditClick(limit)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Limit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(limit.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {limit.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteLimit(limit.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Limit
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
            <DialogTitle className="text-brand-green">Edit Device Limit</DialogTitle>
            <DialogDescription className="text-white/80">Edit device limit details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Username</Label>
                  <Input
                    value={editFormData.username}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, username: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Email</Label>
                  <Input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Device Limit</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editFormData.deviceLimit}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, deviceLimit: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter device limit"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Plan Type</Label>
                  <Select
                    value={editFormData.planType}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, planType: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
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
              Are you sure you want to delete this device limit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteLimit}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteLimit}
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
              {`Are you sure you want to delete ${selectedLimits.length} selected device limit${selectedLimits.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedLimits.length} Limit${selectedLimits.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
