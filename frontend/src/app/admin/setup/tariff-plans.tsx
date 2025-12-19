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

const initialPlans = [
  {
    id: "1",
    name: "30-min",
    type: "Time-based",
    price: 5,
    duration: "30 minutes",
    bandwidth: "1 Mbps",
    deviceLimit: 1,
    status: "active",
    description: "Short duration plan for quick access",
    createdDate: "2024-01-15",
    active: true,
  },
  {
    id: "2",
    name: "Daily",
    type: "Time-based",
    price: 30,
    duration: "24 hours",
    bandwidth: "2 Mbps",
    deviceLimit: 2,
    status: "active",
    description: "Full day internet access",
    createdDate: "2024-01-10",
    active: true,
  },
  {
    id: "3",
    name: "Weekly",
    type: "Time-based",
    price: 250,
    duration: "7 days",
    bandwidth: "5 Mbps",
    deviceLimit: 3,
    status: "active",
    description: "Weekly internet package",
    createdDate: "2024-01-05",
    active: true,
  },
  {
    id: "4",
    name: "Monthly Unlimited",
    type: "Unlimited",
    price: 1000,
    duration: "30 days",
    bandwidth: "10 Mbps",
    deviceLimit: 5,
    status: "inactive",
    description: "Unlimited monthly access",
    createdDate: "2024-01-01",
    active: false,
  },
]

export default function TariffPlansPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState(initialPlans)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    type: "Time-based",
    price: "",
    duration: "",
    bandwidth: "",
    deviceLimit: "",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    type: "Time-based",
    price: "",
    duration: "",
    bandwidth: "",
    deviceLimit: "",
    description: "",
  })

  // Helper to format date/time
  function formatDateTime(date: string | Date) {
    const d = typeof date === "string" ? new Date(date) : date
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

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
    setSelectedPlans((prev) => (prev.includes(id) ? prev.filter((planId) => planId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedPlans([])
    } else {
      setSelectedPlans(plans.map((plan) => plan.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter plans based on search query
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.price.toString().includes(searchQuery.toLowerCase()) ||
      plan.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.bandwidth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const newPlan = {
      id: (plans.length + 1).toString(),
      ...formData,
      price: Number.parseFloat(formData.price),
      deviceLimit: Number.parseInt(formData.deviceLimit),
      status: "active",
      createdDate: formatDateTime(now),
      active: true, // Ensure new plan has active property
    }
    setPlans((prev) => [...prev, newPlan])
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      type: "Time-based",
      price: "",
      duration: "",
      bandwidth: "",
      deviceLimit: "",
      description: "",
    })
    toast({
      title: "Success",
      description: "Tariff plan added successfully!",
    })
  }

  // Handle edit plan
  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
    setEditFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price.toString(),
      duration: plan.duration,
      bandwidth: plan.bandwidth,
      deviceLimit: plan.deviceLimit.toString(),
      description: plan.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              ...editFormData,
              price: Number.parseFloat(editFormData.price),
              deviceLimit: Number.parseInt(editFormData.deviceLimit),
            }
          : plan,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingPlan(null)
    toast({
      title: "Success",
      description: "Tariff plan updated successfully!",
    })
  }

  // Handle delete single plan
  const handleDelete = (id: string) => {
    setDeletePlanId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlan = () => {
    setPlans((prev) => prev.filter((plan) => plan.id !== deletePlanId))
    setIsDeleteDialogOpen(false)
    setDeletePlanId(null)
    toast({
      title: "Success",
      description: "Tariff plan deleted successfully!",
    })
  }

  const cancelDeletePlan = () => {
    setIsDeleteDialogOpen(false)
    setDeletePlanId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedPlans.length === 0) {
      toast({
        title: "Error",
        description: "Please select plans first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setPlans((prev) => prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, status: "active" } : plan)))
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setPlans((prev) => prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, status: "inactive" } : plan)))
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans deactivated successfully!`,
      })
    } else if (bulkAction === "export") {
      // Only export selected plans
      const csvContent = [
        [
          "Name",
          "Type",
          "Price (KES)",
          "Duration",
          "Bandwidth",
          "Device Limit",
          "Status",
          "Created Date",
          "Description",
        ].join(","),
        ...plans
          .filter((plan) => selectedPlans.includes(plan.id))
          .map((plan) =>
            [
              plan.name,
              plan.type,
              plan.price,
              plan.duration,
              plan.bandwidth,
              plan.deviceLimit,
              plan.status,
              plan.createdDate,
              plan.description,
            ].join(","),
          ),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "tariff-plans.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Selected plans exported successfully!",
      })
      setBulkAction("")
    }
  }

  const confirmBulkDelete = () => {
    setPlans((prev) => prev.filter((plan) => !selectedPlans.includes(plan.id)))
    setSelectedPlans([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected plans deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              active: !plan.active,
              status: plan.active ? "inactive" : "active",
            }
          : plan,
      ),
    )
    const planObj = plans.find((p) => p.id === id)
    toast({
      title: "Success",
      description: `Plan ${planObj?.active ? "deactivated" : "activated"} successfully!`,
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
              <CardTitle className="text-brand-green">Tariff Plans</CardTitle>
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
                    // Only export selected plans
                    const csvContent = [
                      [
                        "Name",
                        "Type",
                        "Price (KES)",
                        "Duration",
                        "Bandwidth",
                        "Device Limit",
                        "Status",
                        "Created Date",
                        "Description",
                      ].join(","),
                      ...plans
                        .filter((plan) => selectedPlans.includes(plan.id))
                        .map((plan) =>
                          [
                            plan.name,
                            plan.type,
                            plan.price,
                            plan.duration,
                            plan.bandwidth,
                            plan.deviceLimit,
                            plan.status,
                            plan.createdDate,
                            plan.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "tariff-plans.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected plans exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedPlans.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Tariff Plan</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-brand-green">
                            Plan Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter plan name"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-brand-green">
                            Plan Type
                          </Label>
                          <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Time-based">Time-based</SelectItem>
                              <SelectItem value="Unlimited">Unlimited</SelectItem>
                              <SelectItem value="Data-based">Data-based</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                            placeholder="Enter price"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-brand-green">
                            Duration
                          </Label>
                          <Input
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="e.g., 30 minutes, 24 hours"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bandwidth" className="text-brand-green">
                            Bandwidth
                          </Label>
                          <Input
                            id="bandwidth"
                            name="bandwidth"
                            value={formData.bandwidth}
                            onChange={handleInputChange}
                            placeholder="e.g., 1 Mbps, 5 Mbps"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
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
                            placeholder="Number of devices"
                            className="bg-brand-darkgray border-brand-green/30 text-white"
                            required
                          />
                        </div>
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
                        Add Plan
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
                  <TableHead>Plan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Device Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} className="border-b border-brand-green/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={() => handleCheckboxChange(plan.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell>{plan.bandwidth}</TableCell>
                    <TableCell>{plan.deviceLimit}</TableCell>
                    <TableCell>
                      {plan.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(plan.createdDate)}</TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border-brand-green/30">
                          <DropdownMenuItem onClick={() => handleEdit(plan)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(plan.id)}
                          >
                            {plan.active ? (
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
                                  "Name",
                                  "Type",
                                  "Price (KES)",
                                  "Duration",
                                  "Bandwidth",
                                  "Device Limit",
                                  "Status",
                                  "Created Date",
                                  "Description",
                                ].join(","),
                                [
                                  plan.name,
                                  plan.type,
                                  plan.price,
                                  plan.duration,
                                  plan.bandwidth,
                                  plan.deviceLimit,
                                  plan.status,
                                  plan.createdDate,
                                  plan.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `tariff-plan-${plan.name}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Plan '${plan.name}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(plan.id)} className="text-red-500">
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
            <DialogTitle className="text-brand-green">Edit Tariff Plan</DialogTitle>
            <DialogDescription className="text-white/80">Edit plan details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-brand-green">
                    Plan Name
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
                    Plan Type
                  </Label>
                  <Select value={editFormData.type} onValueChange={(value) => handleEditSelectChange("type", value)}>
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Time-based">Time-based</SelectItem>
                      <SelectItem value="Unlimited">Unlimited</SelectItem>
                      <SelectItem value="Data-based">Data-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration" className="text-brand-green">
                    Duration
                  </Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    value={editFormData.duration}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bandwidth" className="text-brand-green">
                    Bandwidth
                  </Label>
                  <Input
                    id="edit-bandwidth"
                    name="bandwidth"
                    value={editFormData.bandwidth}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
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
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
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
              Are you sure you want to delete this tariff plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeletePlan}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeletePlan} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedPlans.length} selected plans? This action cannot be undone.`}
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
              {`Delete ${selectedPlans.length} Plans`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
