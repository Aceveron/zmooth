"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Edit, Trash, Search, Download, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to zones
const initialZones = [
  {
    id: "1",
    name: "Campus A",
    location: "Nairobi",
    ipRange: "192.168.1.0/24",
    gateway: "192.168.1.1",
    dnsServer: "8.8.8.8",
    type: "Campus",
    status: "active",
    deviceCount: 150,
    description: "Main campus network zone",
    active: true,
  },
  {
    id: "2",
    name: "Mall West",
    location: "Mombasa",
    ipRange: "192.168.2.0/24",
    gateway: "192.168.2.1",
    dnsServer: "8.8.4.4",
    type: "Commercial",
    status: "active",
    deviceCount: 89,
    description: "Shopping mall network zone",
    active: true,
  },
  {
    id: "3",
    name: "Residential Block",
    location: "Kisumu",
    ipRange: "192.168.3.0/24",
    gateway: "192.168.3.1",
    dnsServer: "1.1.1.1",
    type: "Residential",
    status: "inactive",
    deviceCount: 45,
    description: "Residential area network zone",
    active: false,
  },
]

export default function NetworkZonesPage() {
  const navigate = useNavigate()
  const [zones, setZones] = useState(initialZones)
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<any>(null)
  const [deleteZoneId, setDeleteZoneId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    ipRange: "",
    gateway: "",
    dnsServer: "",
    type: "Campus",
    description: "",
    deviceCount: 0,
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    ipRange: "",
    gateway: "",
    dnsServer: "",
    type: "Campus",
    description: "",
    deviceCount: 0,
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedZones((prev) => (prev.includes(id) ? prev.filter((zoneId) => zoneId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedZones([])
    } else {
      setSelectedZones(zones.map((zone) => zone.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter zones based on search query
  const filteredZones = zones.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.ipRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.gateway.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newZone = {
      id: (zones.length + 1).toString(),
      ...formData,
      status: "inactive",
      active: false, // Ensure new zone has active property
    }
    setZones((prev) => [...prev, newZone])
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      location: "",
      ipRange: "",
      gateway: "",
      dnsServer: "",
      type: "Campus",
      description: "",
      deviceCount: 0,
    })
    toast({
      title: "Success",
      description: "Network zone added successfully!",
    })
  }

  // Handle edit zone
  const handleEdit = (zone: any) => {
    setEditingZone(zone)
    setEditFormData({
      name: zone.name,
      location: zone.location,
      ipRange: zone.ipRange,
      gateway: zone.gateway,
      dnsServer: zone.dnsServer,
      type: zone.type,
      description: zone.description,
      deviceCount: zone.deviceCount,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setZones((prev) => prev.map((zone) => (zone.id === editingZone.id ? { ...zone, ...editFormData } : zone)))
    setIsEditDialogOpen(false)
    setEditingZone(null)
    toast({
      title: "Success",
      description: "Network zone updated successfully!",
    })
  }

  // Handle delete single zone
  const handleDelete = (id: string) => {
    setDeleteZoneId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteZone = () => {
    setZones((prev) => prev.filter((zone) => zone.id !== deleteZoneId))
    setIsDeleteDialogOpen(false)
    setDeleteZoneId(null)
    toast({
      title: "Success",
      description: "Network zone deleted successfully!",
    })
  }

  const cancelDeleteZone = () => {
    setIsDeleteDialogOpen(false)
    setDeleteZoneId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedZones.length === 0) {
      toast({
        title: "Error",
        description: "Please select zones first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setZones((prev) => prev.map((zone) => (selectedZones.includes(zone.id) ? { ...zone, status: "active" } : zone)))
      setSelectedZones([])
      toast({
        title: "Success",
        description: `${selectedZones.length} zones activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setZones((prev) => prev.map((zone) => (selectedZones.includes(zone.id) ? { ...zone, status: "inactive" } : zone)))
      setSelectedZones([])
      toast({
        title: "Success",
        description: `${selectedZones.length} zones deactivated successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setZones((prev) => prev.filter((zone) => !selectedZones.includes(zone.id)))
    setSelectedZones([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected zones deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setZones((prev) =>
      prev.map((zone) =>
        zone.id === id
          ? {
              ...zone,
              active: !zone.active,
              status: zone.active ? "inactive" : "active",
            }
          : zone,
      ),
    )
    const zoneObj = zones.find((z) => z.id === id)
    toast({
      title: "Success",
      description: `Zone ${zoneObj?.active ? "deactivated" : "activated"} successfully!`,
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
            <CardTitle className="text-brand-green">Network Zones Configuration</CardTitle>
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
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected zones
                    const csvContent = [
                      ["Name", "Location", "IP Range", "Gateway", "DNS Server", "Type", "Status", "Device Count", "Description"].join(","),
                      ...zones
                        .filter((zone) => selectedZones.includes(zone.id))
                        .map((zone) =>
                          [
                            zone.name,
                            zone.location,
                            zone.ipRange,
                            zone.gateway,
                            zone.dnsServer,
                            zone.type,
                            zone.status,
                            zone.deviceCount,
                            zone.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "network-zones.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected zones exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedZones.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search zones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Zone
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Network Zone</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-brand-green">
                            Zone Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter zone name"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-brand-green">
                            Location
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Nairobi, Mombasa"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ipRange" className="text-brand-green">
                            IP Range
                          </Label>
                          <Input
                            id="ipRange"
                            name="ipRange"
                            value={formData.ipRange}
                            onChange={handleInputChange}
                            placeholder="192.168.1.0/24"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gateway" className="text-brand-green">
                            Gateway
                          </Label>
                          <Input
                            id="gateway"
                            name="gateway"
                            value={formData.gateway}
                            onChange={handleInputChange}
                            placeholder="192.168.1.1"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dnsServer" className="text-brand-green">
                            DNS Server
                          </Label>
                          <Input
                            id="dnsServer"
                            name="dnsServer"
                            value={formData.dnsServer}
                            onChange={handleInputChange}
                            placeholder="8.8.8.8"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-brand-green">
                            Zone Type
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Campus">Campus</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Residential">Residential</SelectItem>
                              <SelectItem value="Industrial">Industrial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deviceCount" className="text-brand-green">
                          Device Count
                        </Label>
                        <Input
                          id="deviceCount"
                          name="deviceCount"
                          type="number"
                          value={formData.deviceCount ?? ""}
                          onChange={handleInputChange}
                          placeholder="Number of devices"
                          className="bg-brand-darkgray border-brand-green/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-brand-green">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter description"
                          className="bg-brand-darkgray border-brand-green/30 text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={false}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Zone
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border border-brand-green/30 overflow-x-auto">
            <Table className="min-w-full text-sm border-collapse">
              <TableHeader>
                <TableRow className="border-b border-brand-green/40">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Zone Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Range</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>DNS Server</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZones.map((zone, index) => (
                  <TableRow key={zone.id} className="border-b border-brand-green/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedZones.includes(zone.id)}
                        onCheckedChange={() => handleCheckboxChange(zone.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>{zone.location}</TableCell>
                    <TableCell>{zone.ipRange}</TableCell>
                    <TableCell>{zone.gateway}</TableCell>
                    <TableCell>{zone.dnsServer}</TableCell>
                    <TableCell>{zone.type}</TableCell>
                    <TableCell>
                      {zone.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{zone.deviceCount}</TableCell>
                    <TableCell>{zone.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border-brand-green/30">
                          <DropdownMenuItem onClick={() => handleEdit(zone)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(zone.id)}
                          >
                            {zone.active ? (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-2 text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-2 text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              const csvContent = [
                                ["Name", "Location", "IP Range", "Gateway", "DNS Server", "Type", "Status", "Device Count", "Description"].join(","),
                                [
                                  zone.name,
                                  zone.location,
                                  zone.ipRange,
                                  zone.gateway,
                                  zone.dnsServer,
                                  zone.type,
                                  zone.status,
                                  zone.deviceCount,
                                  zone.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `network-zone-${zone.name}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Zone '${zone.name}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(zone.id)} className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
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
        <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Network Zone</DialogTitle>
            <DialogDescription className="text-white/80">Edit zone details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-brand-green">
                    Zone Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location" className="text-brand-green">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ipRange" className="text-brand-green">
                    IP Range
                  </Label>
                  <Input
                    id="edit-ipRange"
                    name="ipRange"
                    value={editFormData.ipRange}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gateway" className="text-brand-green">
                    Gateway
                  </Label>
                  <Input
                    id="edit-gateway"
                    name="gateway"
                    value={editFormData.gateway}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dnsServer" className="text-brand-green">
                    DNS Server
                  </Label>
                  <Input
                    id="edit-dnsServer"
                    name="dnsServer"
                    value={editFormData.dnsServer}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-brand-green">
                    Zone Type
                  </Label>
                  <Select value={editFormData.type} onValueChange={(value) => handleEditSelectChange("type", value)}>
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Campus">Campus</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deviceCount" className="text-brand-green">
                  Device Count
                </Label>
                <Input
                  id="edit-deviceCount"
                  name="deviceCount"
                  type="number"
                  value={editFormData.deviceCount ?? ""}
                  onChange={handleEditInputChange}
                  placeholder="Number of devices"
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-brand-green">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={false}
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
              Are you sure you want to delete this network zone? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteZone}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteZone} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedZones.length} selected zones? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              {`Delete ${selectedZones.length} Zones`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
