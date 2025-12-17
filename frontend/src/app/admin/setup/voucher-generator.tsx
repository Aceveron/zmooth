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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Trash, Edit, Plus, Search, Download, Ticket, Clock, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to voucherimport { useNavigate } from 'react-router-dom'
const initialVoucherTypes = [
  {
    id: "1",
    type: "30-min",
    price: "50",
    bandwidth: "10 Mbps",
    deviceLimit: "1",
    duration: "30 minutes",
    status: "active",
    usageCount: "245",
    createdDate: "2024-01-15",
    description: "Quick access voucher for 30 minutes",
    active: true,
  },
  {
    id: "2",
    type: "Daily",
    price: "200",
    bandwidth: "20 Mbps",
    deviceLimit: "2",
    duration: "24 hours",
    status: "active",
    usageCount: "189",
    createdDate: "2024-01-10",
    description: "Full day internet access",
    active: true,
  },
  {
    id: "3",
    type: "Weekly",
    price: "1000",
    bandwidth: "50 Mbps",
    deviceLimit: "3",
    duration: "7 days",
    status: "active",
    usageCount: "67",
    createdDate: "2024-01-05",
    description: "Weekly unlimited access",
    active: true,
  },
  {
    id: "4",
    type: "Monthly",
    price: "3500",
    bandwidth: "100 Mbps",
    deviceLimit: "5",
    duration: "30 days",
    status: "inactive",
    usageCount: "23",
    createdDate: "2024-01-01",
    description: "Monthly premium package",
    active: false,
  },
]

const voucherDurations = [
  { id: "30 minutes", name: "30 Minutes" },
  { id: "1 hour", name: "1 Hour" },
  { id: "2 hours", name: "2 Hours" },
  { id: "6 hours", name: "6 Hours" },
  { id: "12 hours", name: "12 Hours" },
  { id: "24 hours", name: "24 Hours" },
  { id: "7 days", name: "7 Days" },
  { id: "30 days", name: "30 Days" },
]

const bandwidthOptions = [
  { id: "5 Mbps", name: "5 Mbps" },
  { id: "10 Mbps", name: "10 Mbps" },
  { id: "20 Mbps", name: "20 Mbps" },
  { id: "50 Mbps", name: "50 Mbps" },
  { id: "100 Mbps", name: "100 Mbps" },
  { id: "Unlimited", name: "Unlimited" },
]

export default function VoucherGeneratorPage() {
  const navigate = useNavigate()
  const [voucherTypes, setVoucherTypes] = useState(initialVoucherTypes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingVoucher, setEditingVoucher] = useState<any>(null)
  const [formData, setFormData] = useState({
    type: "",
    price: "",
    bandwidth: "10 Mbps",
    deviceLimit: "1",
    duration: "30 minutes",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    type: "",
    price: "",
    bandwidth: "10 Mbps",
    deviceLimit: "1",
    duration: "30 minutes",
    description: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteVoucherId, setDeleteVoucherId] = useState<string | null>(null)

  // Helper to format date/time
  function formatDateTime(date: string | Date) {
    const d = typeof date === "string" ? new Date(date) : date
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedVouchers((prev) => (prev.includes(id) ? prev.filter((voucherId) => voucherId !== id) : [...prev, id]))
  }

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedVouchers([])
    } else {
      setSelectedVouchers(voucherTypes.map((voucher) => voucher.id))
    }
    setSelectAll(!selectAll)
  }

  const filteredVoucherTypes = voucherTypes.filter(
    (voucher) =>
      voucher.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.bandwidth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.price.includes(searchQuery),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const newVoucher = {
      id: (voucherTypes.length + 1).toString(),
      type: formData.type,
      price: formData.price,
      bandwidth: formData.bandwidth,
      deviceLimit: formData.deviceLimit,
      duration: formData.duration,
      status: "active",
      usageCount: "0",
      createdDate: formatDateTime(now),
      description: formData.description,
      active: true, // Ensure new voucher has active property
    }
    setVoucherTypes((prev) => [...prev, newVoucher])
    setIsAddDialogOpen(false)
    setFormData({
      type: "",
      price: "",
      bandwidth: "10 Mbps",
      deviceLimit: "1",
      duration: "30 minutes",
      description: "",
    })
    toast({
      title: "Success",
      description: "Voucher type added successfully!",
    })
  }

  const handleEditVoucher = (voucher: any) => {
    setEditingVoucher(voucher)
    setEditFormData({
      type: voucher.type,
      price: voucher.price,
      bandwidth: voucher.bandwidth,
      deviceLimit: voucher.deviceLimit,
      duration: voucher.duration,
      description: voucher.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setVoucherTypes((prev) =>
      prev.map((voucher) =>
        voucher.id === editingVoucher.id
          ? {
              ...voucher,
              type: editFormData.type,
              price: editFormData.price,
              bandwidth: editFormData.bandwidth,
              deviceLimit: editFormData.deviceLimit,
              duration: editFormData.duration,
              description: editFormData.description,
            }
          : voucher,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingVoucher(null)
    toast({
      title: "Success",
      description: "Voucher type updated successfully!",
    })
  }

  const handleDeleteVoucher = (id: string) => {
    setDeleteVoucherId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteVoucher = () => {
    setVoucherTypes((prev) => prev.filter((voucher) => voucher.id !== deleteVoucherId))
    setIsDeleteDialogOpen(false)
    setDeleteVoucherId(null)
    toast({
      title: "Success",
      description: "Voucher type deleted successfully!",
    })
  }

  const handleBulkAction = () => {
    if (selectedVouchers.length === 0) {
      toast({
        title: "Error",
        description: "Please select voucher types first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setVoucherTypes((prev) =>
        prev.map((voucher) => (selectedVouchers.includes(voucher.id) ? { ...voucher, status: "active" } : voucher)),
      )
      setSelectedVouchers([])
      toast({
        title: "Success",
        description: `${selectedVouchers.length} voucher types activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setVoucherTypes((prev) =>
        prev.map((voucher) => (selectedVouchers.includes(voucher.id) ? { ...voucher, status: "inactive" } : voucher)),
      )
      setSelectedVouchers([])
      toast({
        title: "Success",
        description: `${selectedVouchers.length} voucher types deactivated successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setVoucherTypes((prev) => prev.filter((voucher) => !selectedVouchers.includes(voucher.id)))
    setSelectedVouchers([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected voucher types deleted successfully!",
    })
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setVoucherTypes((prev) =>
      prev.map((voucher) =>
        voucher.id === id
          ? {
              ...voucher,
              active: !voucher.active,
              status: voucher.active ? "inactive" : "active",
            }
          : voucher,
      ),
    )
    const voucherObj = voucherTypes.find((v) => v.id === id)
    toast({
      title: "Success",
      description: `Voucher type ${voucherObj?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  const handleExport = () => {
    const csvContent = [
      [
        "Type",
        "Price (KES)",
        "Bandwidth",
        "Device Limit",
        "Duration",
        "Status",
        "Usage Count",
        "Created Date",
        "Description",
      ].join(","),
      ...filteredVoucherTypes.map((voucher) =>
        [
          voucher.type,
          voucher.price,
          voucher.bandwidth,
          voucher.deviceLimit,
          voucher.duration,
          voucher.status,
          voucher.usageCount,
          voucher.createdDate,
          voucher.description,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "voucher-types.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Voucher types exported successfully!",
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
              <CardTitle className="text-brand-green">Voucher Generator</CardTitle>
              <CardDescription>Manage voucher types and pricing configurations</CardDescription>
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
                    // Only export selected vouchers
                    const csvContent = [
                      [
                        "Type",
                        "Price (KES)",
                        "Bandwidth",
                        "Device Limit",
                        "Duration",
                        "Status",
                        "Usage Count",
                        "Created Date",
                        "Description",
                      ].join(","),
                      ...voucherTypes
                        .filter((voucher) => selectedVouchers.includes(voucher.id))
                        .map((voucher) =>
                          [
                            voucher.type,
                            voucher.price,
                            voucher.bandwidth,
                            voucher.deviceLimit,
                            voucher.duration,
                            voucher.status,
                            voucher.usageCount,
                            voucher.createdDate,
                            voucher.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "voucher-types.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected voucher types exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedVouchers.length === 0}
              >
                Apply
              </Button>
            </div>
              <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search voucher types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleExport}
                disabled={voucherTypes.length === 0}
              >
                Export All
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Voucher Type</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add Voucher Type</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new voucher type with pricing and access configuration
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-brand-green">
                            Voucher Type
                          </Label>
                          <Input
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            placeholder="e.g., 30-min, Daily, Weekly"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-brand-green">
                            Price (KES)
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="50"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bandwidth" className="text-brand-green">
                            Bandwidth Limit
                          </Label>
                          <Select
                            value={formData.bandwidth}
                            onValueChange={(value) => handleSelectChange("bandwidth", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select bandwidth" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              {bandwidthOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deviceLimit" className="text-brand-green">
                            Device Limit
                          </Label>
                          <Input
                            id="deviceLimit"
                            name="deviceLimit"
                            type="number"
                            value={formData.deviceLimit}
                            onChange={handleInputChange}
                            placeholder="1"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-brand-green">
                          Duration
                        </Label>
                        <Select
                          value={formData.duration}
                          onValueChange={(value) => handleSelectChange("duration", value)}
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {voucherDurations.map((duration) => (
                              <SelectItem key={duration.id} value={duration.id}>
                                {duration.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
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
                        Add Voucher Type
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
                  <TableHead>Type</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Device Limit</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoucherTypes.map((voucher, index) => (
                  <TableRow key={voucher.id} className="border-b border-brand-green/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedVouchers.includes(voucher.id)}
                        onCheckedChange={() => handleCheckboxChange(voucher.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-brand-green" />
                        {voucher.type}
                      </div>
                    </TableCell>
                    <TableCell>KES {voucher.price}</TableCell>
                    <TableCell>{voucher.bandwidth}</TableCell>
                    <TableCell>{voucher.deviceLimit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-green" />
                        {voucher.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      {voucher.active ? (
                        <Badge variant="success" className="capitalize">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer capitalize">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{voucher.usageCount}</TableCell>
                    <TableCell>{formatDateTime(voucher.createdDate)}</TableCell>
                    <TableCell>{voucher.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-brand-green" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-brand-green/30">
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleEditVoucher(voucher)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Voucher Type
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(voucher.id)}
                          >
                            {voucher.active ? (
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
                                [
                                  "Type",
                                  "Price (KES)",
                                  "Bandwidth",
                                  "Device Limit",
                                  "Duration",
                                  "Status",
                                  "Usage Count",
                                  "Created Date",
                                  "Description",
                                ].join(","),
                                [
                                  voucher.type,
                                  voucher.price,
                                  voucher.bandwidth,
                                  voucher.deviceLimit,
                                  voucher.duration,
                                  voucher.status,
                                  voucher.usageCount,
                                  voucher.createdDate,
                                  voucher.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `voucher-type-${voucher.type}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Voucher type '${voucher.type}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-brand-green/30" />
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Voucher Type
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
            <DialogTitle className="text-brand-green">Edit Voucher Type</DialogTitle>
            <DialogDescription className="text-white/80">Update voucher type configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-brand-green">
                    Voucher Type
                  </Label>
                  <Input
                    id="edit-type"
                    name="type"
                    value={editFormData.type}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-brand-green">
                    Price (KES)
                  </Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bandwidth" className="text-brand-green">
                    Bandwidth Limit
                  </Label>
                  <Select
                    value={editFormData.bandwidth}
                    onValueChange={(value) => handleEditSelectChange("bandwidth", value)}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      {bandwidthOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deviceLimit" className="text-brand-green">
                    Device Limit
                  </Label>
                  <Input
                    id="edit-deviceLimit"
                    name="deviceLimit"
                    type="number"
                    value={editFormData.deviceLimit}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration" className="text-brand-green">
                  Duration
                </Label>
                <Select
                  value={editFormData.duration}
                  onValueChange={(value) => handleEditSelectChange("duration", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {voucherDurations.map((duration) => (
                      <SelectItem key={duration.id} value={duration.id}>
                        {duration.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
            </div>
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
                Update Voucher Type
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
              Are you sure you want to delete this voucher type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteVoucher} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedVouchers.length} selected voucher types? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              {`Delete ${selectedVouchers.length} Voucher Types`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
