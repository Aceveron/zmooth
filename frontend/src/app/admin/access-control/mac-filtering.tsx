"use client"

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
import { useNavigate } from "react-router-dom"

// Sample MAC filtering data
const initialMacFilters = [
  {
    id: "1",
    macAddress: "00:1B:44:11:3A:B7",
    deviceName: "John's Laptop",
    action: "Allow",
    description: "Work laptop - always allowed",
    active: true,
  },
  {
    id: "2",
    macAddress: "AA:BB:CC:DD:EE:FF",
    deviceName: "Gaming Console",
    action: "Block",
    description: "Block gaming during work hours",
    active: true,
  },
  {
    id: "3",
    macAddress: "12:34:56:78:90:AB",
    deviceName: "Guest Phone",
    action: "Allow",
    description: "Temporary guest access",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [macFilters, setMacFilters] = useState(initialMacFilters)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFilterId, setEditFilterId] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    macAddress: "",
    deviceName: "",
    action: "Allow",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    macAddress: "",
    deviceName: "",
    action: "Allow",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteFilterId, setDeleteFilterId] = useState<string | null>(null)
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
    setSelectedFilters((prev) => (prev.includes(id) ? prev.filter((filterId) => filterId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedFilters([])
    } else {
      setSelectedFilters(macFilters.map((filter) => filter.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilter = {
      id: (macFilters.length + 1).toString(),
      macAddress: formData.macAddress,
      deviceName: formData.deviceName,
      action: formData.action,
      description: formData.description,
      active: true,
    }
    setMacFilters((prev) => [...prev, newFilter])
    setIsAddDialogOpen(false)
    setFormData({
      macAddress: "",
      deviceName: "",
      action: "Allow",
      description: "",
    })
    toast({
      title: "Success",
      description: "MAC filter created successfully!",
    })
  }

  // Filter based on search query
  const filteredMacFilters = macFilters.filter(
    (filter) =>
      filter.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filter.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filter.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filter.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Filter - Pre-fill form with selected filter data
  const handleEditClick = (filter: any) => {
    setEditFilterId(filter.id)
    setEditFormData({
      macAddress: filter.macAddress,
      deviceName: filter.deviceName,
      action: filter.action,
      description: filter.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMacFilters((prev) =>
      prev.map((filter) =>
        filter.id === editFilterId
          ? {
              ...filter,
              macAddress: editFormData.macAddress,
              deviceName: editFormData.deviceName,
              action: editFormData.action,
              description: editFormData.description,
            }
          : filter,
      ),
    )
    setIsEditDialogOpen(false)
    setEditFilterId(null)
    toast({
      title: "Success",
      description: "MAC filter updated successfully!",
    })
  }

  // Toggle Allow/Block action
  const handleToggleAction = (id: string) => {
    setMacFilters((prev) =>
      prev.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              action: filter.action === "Allow" ? "Block" : "Allow",
            }
          : filter,
      ),
    )
    const filter = macFilters.find((f) => f.id === id)
    toast({
      title: "Success",
      description: `MAC filter set to ${filter?.action === "Allow" ? "Block" : "Allow"} successfully!`,
    })
  }

  // Delete Filter
  const handleDeleteFilter = (id: string) => {
    setDeleteFilterId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteFilter = () => {
    setMacFilters((prev) => prev.filter((filter) => filter.id !== deleteFilterId))
    setIsDeleteDialogOpen(false)
    setDeleteFilterId(null)
    toast({
      title: "Success",
      description: "MAC filter deleted successfully!",
    })
  }

  const cancelDeleteFilter = () => {
    setIsDeleteDialogOpen(false)
    setDeleteFilterId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "allow") {
      setMacFilters((prev) =>
        prev.map((filter) => (selectedFilters.includes(filter.id) ? { ...filter, action: "Allow" } : filter)),
      )
      toast({
        title: "Success",
        description: `${selectedFilters.length} MAC filter${selectedFilters.length === 1 ? "" : "s"} set to Allow!`,
      })
      setSelectedFilters([])
      setSelectAll(false)
    } else if (bulkAction === "block") {
      setMacFilters((prev) =>
        prev.map((filter) => (selectedFilters.includes(filter.id) ? { ...filter, action: "Block" } : filter)),
      )
      toast({
        title: "Success",
        description: `${selectedFilters.length} MAC filter${selectedFilters.length === 1 ? "" : "s"} set to Block!`,
      })
      setSelectedFilters([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedFilters.length
    setMacFilters((prev) => prev.filter((filter) => !selectedFilters.includes(filter.id)))
    setSelectedFilters([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} MAC filter${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green">MAC Address Filtering</CardTitle>
              <CardDescription>Control device access based on MAC addresses</CardDescription>
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
                  <SelectItem value="allow">Allow Selected</SelectItem>
                  <SelectItem value="block">Block Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedFilters.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by MAC or Device..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add MAC Filter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New MAC Filter</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new MAC address filter to control device access
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">MAC Address</Label>
                          <Input
                            id="macAddress"
                            name="macAddress"
                            value={formData.macAddress}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="00:1B:44:11:3A:B7"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="deviceName" className="text-brand-green">
                            Device Name
                          </Label>
                          <Input
                            id="deviceName"
                            name="deviceName"
                            value={formData.deviceName}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter device name"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="action" className="text-brand-green">
                            Action
                          </Label>
                          <Select
                            value={formData.action}
                            onValueChange={(value) => handleSelectChange("action", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Allow">Allow</SelectItem>
                              <SelectItem value="Block">Block</SelectItem>
                            </SelectContent>
                          </Select>
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
                          Create Filter
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
                  <TableHead className="border-0">MAC Address</TableHead>
                  <TableHead className="border-0">Device Name</TableHead>
                  <TableHead className="border-0">Action</TableHead>
                  <TableHead className="border-0">Description</TableHead>
                  {/* Status column removed */}
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMacFilters.map((filter) => (
                  <TableRow key={filter.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedFilters.includes(filter.id)}
                        onCheckedChange={() => handleCheckboxChange(filter.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0 font-mono">{filter.macAddress}</TableCell>
                    <TableCell className="border-0">{filter.deviceName}</TableCell>
                    <TableCell className="border-0">
                      <Badge variant={filter.action === "Allow" ? "success" : "destructive"}>{filter.action}</Badge>
                    </TableCell>
                    <TableCell className="border-0">{filter.description}</TableCell>
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
                            onClick={() => handleEditClick(filter)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Filter
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleAction(filter.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {filter.action === "Allow" ? "Block" : "Allow"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteFilter(filter.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Filter
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
            <DialogTitle className="text-brand-green">Edit MAC Filter</DialogTitle>
            <DialogDescription className="text-white/80">Edit MAC filter details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">MAC Address</Label>
                  <Input
                    value={editFormData.macAddress}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, macAddress: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="00:1B:44:11:3A:B7"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Device Name</Label>
                  <Input
                    value={editFormData.deviceName}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, deviceName: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter device name"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Action</Label>
                  <Select
                    value={editFormData.action}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, action: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Allow">Allow</SelectItem>
                      <SelectItem value="Block">Block</SelectItem>
                    </SelectContent>
                  </Select>
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
              Are you sure you want to delete this MAC filter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteFilter}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteFilter}
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
              {`Are you sure you want to delete ${selectedFilters.length} selected MAC filter${selectedFilters.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedFilters.length} Filter${selectedFilters.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
