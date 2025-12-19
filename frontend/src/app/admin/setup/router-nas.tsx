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
import { Plus, MoreVertical, Edit, Trash, Search, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to router objects
const initialRouters = [
  {
    id: "1",
    name: "Main Router",
    ipAddress: "192.168.1.1",
    macAddress: "00:11:22:33:44:55",
    nasSecret: "secret123",
    type: "MikroTik",
    status: "online",
    port: "1812",
    radiusServer: "192.168.1.10",
    description: "Main network router",
    active: true,
  },
  {
    id: "2",
    name: "Backup Router",
    ipAddress: "192.168.1.2",
    macAddress: "00:11:22:33:44:66",
    nasSecret: "backup456",
    type: "Cisco",
    status: "offline",
    port: "1812",
    radiusServer: "192.168.1.11",
    description: "Backup network router",
    active: false,
  },
  {
    id: "3",
    name: "Branch Router",
    ipAddress: "192.168.2.1",
    macAddress: "00:11:22:33:44:77",
    nasSecret: "branch789",
    type: "Ubiquiti",
    status: "online",
    port: "1813",
    radiusServer: "192.168.1.12",
    description: "Branch office router",
    active: true,
  },
]

export default function RouterNasPage() {
  const navigate = useNavigate()
  const [routers, setRouters] = useState(initialRouters)
  const [selectedRouters, setSelectedRouters] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [editingRouter, setEditingRouter] = useState<any>(null)
  const [deleteRouterId, setDeleteRouterId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    macAddress: "",
    nasSecret: "",
    type: "MikroTik",
    port: "1812",
    radiusServer: "",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    ipAddress: "",
    macAddress: "",
    nasSecret: "",
    type: "MikroTik",
    port: "1812",
    radiusServer: "",
    description: "",
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
    setSelectedRouters((prev) => (prev.includes(id) ? prev.filter((routerId) => routerId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRouters([])
    } else {
      setSelectedRouters(routers.map((router) => router.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter routers based on search query
  const filteredRouters = routers.filter(
    (router) =>
      router.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.radiusServer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRouter = {
      id: (routers.length + 1).toString(),
      ...formData,
      status: "offline",
      active: false, // Ensure new router has active property
    }
    setRouters((prev) => [...prev, newRouter])
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      ipAddress: "",
      macAddress: "",
      nasSecret: "",
      type: "MikroTik",
      port: "1812",
      radiusServer: "",
      description: "",
    })
    toast({
      title: "Success",
      description: "Router added successfully!",
    })
  }

  // Handle edit router
  const handleEdit = (router: any) => {
    setEditingRouter(router)
    setEditFormData({
      name: router.name,
      ipAddress: router.ipAddress,
      macAddress: router.macAddress,
      nasSecret: router.nasSecret,
      type: router.type,
      port: router.port,
      radiusServer: router.radiusServer,
      description: router.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRouters((prev) =>
      prev.map((router) =>
        router.id === editingRouter.id
          ? { ...router, ...editFormData, active: router.active }
          : router,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingRouter(null)
    toast({
      title: "Success",
      description: "Router updated successfully!",
    })
  }

  // Handle delete single router
  const handleDelete = (id: string) => {
    setDeleteRouterId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRouter = () => {
    setRouters((prev) => prev.filter((router) => router.id !== deleteRouterId))
    setIsDeleteDialogOpen(false)
    setDeleteRouterId(null)
    toast({
      title: "Success",
      description: "Router deleted successfully!",
    })
  }

  const cancelDeleteRouter = () => {
    setIsDeleteDialogOpen(false)
    setDeleteRouterId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedRouters.length === 0) {
      toast({
        title: "Error",
        description: "Please select routers first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setRouters((prev) =>
        prev.map((router) =>
          selectedRouters.includes(router.id)
            ? { ...router, status: "online", active: true }
            : router,
        ),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setRouters((prev) =>
        prev.map((router) =>
          selectedRouters.includes(router.id)
            ? { ...router, status: "offline", active: false }
            : router,
        ),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers deactivated successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setRouters((prev) => prev.filter((router) => !selectedRouters.includes(router.id)))
    setSelectedRouters([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected routers deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setRouters((prev) =>
      prev.map((router) =>
        router.id === id
          ? {
              ...router,
              active: !router.active,
              status: router.active ? "offline" : "online",
            }
          : router,
      ),
    )
    const routerObj = routers.find((r) => r.id === id)
    toast({
      title: "Success",
      description: `Router ${routerObj?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  return (
    <div className="-space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Router/NAS Configuration</CardTitle>
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
                    // Only export selected routers
                    const csvContent = [
                      ["Name", "IP Address", "MAC Address", "Type", "Port", "Radius Server", "Status", "Description"].join(","),
                      ...routers
                        .filter((router) => selectedRouters.includes(router.id))
                        .map((router) =>
                          [
                            router.name,
                            router.ipAddress,
                            router.macAddress,
                            router.type,
                            router.port,
                            router.radiusServer,
                            router.status,
                            router.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "router-nas.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected routers exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedRouters.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Router
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Router</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-brand-green">
                            Router Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter router name"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-brand-green">
                            Router Type
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="MikroTik">MikroTik</SelectItem>
                              <SelectItem value="Cisco">Cisco</SelectItem>
                              <SelectItem value="Ubiquiti">Ubiquiti</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ipAddress" className="text-brand-green">
                            IP Address
                          </Label>
                          <Input
                            id="ipAddress"
                            name="ipAddress"
                            value={formData.ipAddress}
                            onChange={handleInputChange}
                            placeholder="192.168.1.1"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="macAddress" className="text-brand-green">
                            MAC Address
                          </Label>
                          <Input
                            id="macAddress"
                            name="macAddress"
                            value={formData.macAddress}
                            onChange={handleInputChange}
                            placeholder="00:11:22:33:44:55"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="port" className="text-brand-green">
                            Port
                          </Label>
                          <Input
                            id="port"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            placeholder="1812"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="radiusServer" className="text-brand-green">
                            Radius Server
                          </Label>
                          <Input
                            id="radiusServer"
                            name="radiusServer"
                            value={formData.radiusServer}
                            onChange={handleInputChange}
                            placeholder="192.168.1.10"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nasSecret" className="text-brand-green">
                          NAS Secret
                        </Label>
                        <Input
                          id="nasSecret"
                          name="nasSecret"
                          type="password"
                          value={formData.nasSecret}
                          onChange={handleInputChange}
                          placeholder="Enter NAS secret"
                          className="bg-brand-darkgray border-brand-green/30 text-white"
                          required
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
                        Add Router
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
                  <TableHead>Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Radius Server</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRouters.map((router, index) => (
                  <TableRow key={router.id} className="border-b border-brand-green/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedRouters.includes(router.id)}
                        onCheckedChange={() => handleCheckboxChange(router.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{router.name}</TableCell>
                    <TableCell>{router.ipAddress}</TableCell>
                    <TableCell>{router.macAddress}</TableCell>
                    <TableCell>{router.type}</TableCell>
                    <TableCell>{router.port}</TableCell>
                    <TableCell>{router.radiusServer}</TableCell>
                    <TableCell>
                      {router.active ? (
                        <Badge variant="success">Online</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Offline</Badge>
                      )}
                    </TableCell>
                    <TableCell>{router.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border-brand-green/30">
                          <DropdownMenuItem onClick={() => handleEdit(router)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(router.id)}
                          >
                            {router.active ? (
                              <>
                                <Download className="h-4 w-4 mr-2 text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2 text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              const csvContent = [
                                ["Name", "IP Address", "MAC Address", "Type", "Port", "Radius Server", "Status", "Description"].join(","),
                                [
                                  router.name,
                                  router.ipAddress,
                                  router.macAddress,
                                  router.type,
                                  router.port,
                                  router.radiusServer,
                                  router.status,
                                  router.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `router-nas-${router.name}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Router '${router.name}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(router.id)} className="text-red-500">
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
            <DialogTitle className="text-brand-green">Edit Router</DialogTitle>
            <DialogDescription className="text-white/80">Edit router details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-brand-green">
                    Router Name
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
                  <Label htmlFor="edit-type" className="text-brand-green">
                    Router Type
                  </Label>
                  <Select value={editFormData.type} onValueChange={(value) => handleEditSelectChange("type", value)}>
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="MikroTik">MikroTik</SelectItem>
                      <SelectItem value="Cisco">Cisco</SelectItem>
                      <SelectItem value="Ubiquiti">Ubiquiti</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ipAddress" className="text-brand-green">
                    IP Address
                  </Label>
                  <Input
                    id="edit-ipAddress"
                    name="ipAddress"
                    value={editFormData.ipAddress}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-macAddress" className="text-brand-green">
                    MAC Address
                  </Label>
                  <Input
                    id="edit-macAddress"
                    name="macAddress"
                    value={editFormData.macAddress}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-port" className="text-brand-green">
                    Port
                  </Label>
                  <Input
                    id="edit-port"
                    name="port"
                    value={editFormData.port}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-radiusServer" className="text-brand-green">
                    Radius Server
                  </Label>
                  <Input
                    id="edit-radiusServer"
                    name="radiusServer"
                    value={editFormData.radiusServer}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nasSecret" className="text-brand-green">
                  NAS Secret
                </Label>
                <Input
                  id="edit-nasSecret"
                  name="nasSecret"
                  type="password"
                  value={editFormData.nasSecret}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                  required
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
              Are you sure you want to delete this router? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteRouter}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteRouter} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedRouters.length} selected routers? This action cannot be undone.`}
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
              {`Delete ${selectedRouters.length} Routers`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
