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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample plans data
const initialPlans = [
  {
    id: "1",
    name: "Mwananchi Ji Enjoy Unlimited",
    type: "30 Min",
    price: "5",
    devices: 1,
    bandwidth: "2 Mbps",
    dataLimit: "",
    timeLimit: "",
    active: true,
  },
  {
    id: "2",
    name: "Unlimited 1 Hour",
    type: "Hourly",
    price: "10",
    devices: 1,
    bandwidth: "5 Mbps",
    dataLimit: "",
    timeLimit: "",
    active: true,
  },
  {
    id: "3",
    name: "Daily Unlimited",
    type: "Daily",
    price: "30",
    devices: 2,
    bandwidth: "3 Mbps",
    dataLimit: "",
    timeLimit: "",
    active: true,
  },
  {
    id: "4",
    name: "5GB Two Days",
    type: "Daily",
    price: "40",
    devices: 1,
    bandwidth: "5 Mbps",
    dataLimit: "",
    timeLimit: "",
    active: true,
  },
  {
    id: "5",
    name: "Unlimited Weekly",
    type: "Weekly",
    price: "150",
    devices: 1,
    bandwidth: "3 Mbps",
    dataLimit: "",
    timeLimit: "",
    active: true,
  },
]

function HotspotPlans() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState(initialPlans)
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editPlanId, setEditPlanId] = useState<string | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    planName: "",
    planType: "hourly",
    price: "",
    devices: "1",
    bandwidth: "",
    dataLimit: "",
    timeLimit: "",
  })
  const [editFormData, setEditFormData] = useState({
    planName: "",
    planType: "hourly",
    price: "",
    devices: "1",
    bandwidth: "",
    dataLimit: "",
    timeLimit: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPlan = {
      id: (plans.length + 1).toString(),
      name: formData.planName,
      type: formData.planType,
      price: formData.price,
      devices: Number(formData.devices),
      bandwidth: formData.bandwidth,
      dataLimit: formData.dataLimit,
      timeLimit: formData.timeLimit,
      active: true,
    }
    setPlans((prev) => [...prev, newPlan])
    setIsAddPlanDialogOpen(false)
    setFormData({
      planName: "",
      planType: "hourly",
      price: "",
      devices: "1",
      bandwidth: "",
      dataLimit: "",
      timeLimit: "",
    })
    toast({
      title: "Success",
      description: "Plan created successfully!",
    })
  }

  // Filter plans based on search query (by name or type)
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Plan - Pre-fill form with selected plan data
  const handleEditClick = (plan: any) => {
    setEditPlanId(plan.id)
    setEditFormData({
      planName: plan.name,
      planType: plan.type.toLowerCase(),
      price: plan.price.toString(),
      devices: plan.devices.toString(),
      bandwidth: plan.bandwidth,
      dataLimit: plan.dataLimit || "",
      timeLimit: plan.timeLimit || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === editPlanId
          ? {
              ...plan,
              name: editFormData.planName,
              type: editFormData.planType,
              price: editFormData.price,
              devices: Number(editFormData.devices),
              bandwidth: editFormData.bandwidth,
              dataLimit: editFormData.dataLimit,
              timeLimit: editFormData.timeLimit,
            }
          : plan,
      ),
    )
    setIsEditDialogOpen(false)
    setEditPlanId(null)
    toast({
      title: "Success",
      description: "Plan updated successfully!",
    })
  }

  // Deactivate/Activate Plan
  const handleToggleActive = (id: string) => {
    setPlans((prev) => prev.map((plan) => (plan.id === id ? { ...plan, active: !plan.active } : plan)))
    const plan = plans.find((p) => p.id === id)
    toast({
      title: "Success",
      description: `Plan ${plan?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Plan
  const handleDeletePlan = (id: string) => {
    setDeletePlanId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlan = () => {
    setPlans((prev) => prev.filter((plan) => plan.id !== deletePlanId))
    setIsDeleteDialogOpen(false)
    setDeletePlanId(null)
    toast({
      title: "Success",
      description: "Plan deleted successfully!",
    })
  }

  const cancelDeletePlan = () => {
    setIsDeleteDialogOpen(false)
    setDeletePlanId(null)
  }

  // --- Bulk Action Handler ---
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setPlans((prev) => prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, active: true } : plan)))
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans activated successfully!`,
      })
      setSelectedPlans([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setPlans((prev) => prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, active: false } : plan)))
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans deactivated successfully!`,
      })
      setSelectedPlans([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedPlans.length
    setPlans((prev) => prev.filter((plan) => !selectedPlans.includes(plan.id)))
    setSelectedPlans([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} plan${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Hotspot Plans</CardTitle>
              <CardDescription>Manage available plans for hotspot clients</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
              {/* --- Bulk Action Select --- */}
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
                disabled={selectedPlans.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Plan Name or ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Hotspot Plan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Hotspot Plan</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new plan for hotspot clients
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Plan Name</Label>
                          <Input
                            id="planName"
                            name="planName"
                            value={formData.planName}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter plan name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="planType" className="text-brand-green">
                            Plan Type
                          </Label>
                          <Input
                            id="planType"
                            name="planType"
                            type="text"
                            value={formData.planType}
                            onChange={(e) => handleSelectChange("planType", e.target.value)}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter plan type"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price" className="text-brand-green">
                            Price (KES)
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter price"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="devices" className="text-brand-green">
                            Devices
                          </Label>
                          <Input
                            id="devices"
                            name="devices"
                            type="number"
                            value={formData.devices}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter number of devices"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bandwidth" className="text-brand-green">
                            Bandwidth
                          </Label>
                          <Input
                            id="bandwidth"
                            name="bandwidth"
                            value={formData.bandwidth}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter bandwidth"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="dataLimit" className="text-brand-green">
                            Data Limit
                          </Label>
                          <Input
                            id="dataLimit"
                            name="dataLimit"
                            value={formData.dataLimit}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter data limit"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timeLimit" className="text-brand-green">
                            Time Limit
                          </Label>
                          <Input
                            id="timeLimit"
                            name="timeLimit"
                            value={formData.timeLimit}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter time limit"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddPlanDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                          disabled={false}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Create Plan
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
                  <TableHead className="border-0">Plan Name</TableHead>
                  <TableHead className="border-0">Plan Type</TableHead>
                  <TableHead className="border-0">Price (KES)</TableHead>
                  <TableHead className="border-0">Devices</TableHead>
                  <TableHead className="border-0">Bandwidth</TableHead>
                  <TableHead className="border-0">Data Limit</TableHead>
                  <TableHead className="border-0">Time Limit</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={() => handleCheckboxChange(plan.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{plan.name}</TableCell>
                    <TableCell className="border-0">{plan.type}</TableCell>
                    <TableCell className="border-0">KES {plan.price}</TableCell>
                    <TableCell className="border-0">{plan.devices}</TableCell>
                    <TableCell className="border-0">{plan.bandwidth}</TableCell>
                    <TableCell className="border-0">{plan.dataLimit || "-"}</TableCell>
                    <TableCell className="border-0">{plan.timeLimit || "-"}</TableCell>
                    <TableCell className="border-0">
                      {plan.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
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
                            onClick={() => handleEditClick(plan)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(plan.id)}
                          >
                            {plan.active ? (
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
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Plan
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

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Hotspot Plan</DialogTitle>
            <DialogDescription className="text-white/80">Edit plan details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Plan Name</Label>
                  <Input
                    id="edit-planName"
                    name="planName"
                    value={editFormData.planName}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, planName: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter plan name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-planType" className="text-brand-green">
                    Plan Type
                  </Label>
                  <Input
                    id="edit-planType"
                    name="planType"
                    type="text"
                    value={editFormData.planType}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, planType: e.target.value }))}
                    placeholder="Enter plan type"
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price" className="text-brand-green">
                    Price (KES)
                  </Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-devices" className="text-brand-green">
                    Devices
                  </Label>
                  <Input
                    id="edit-devices"
                    name="devices"
                    type="number"
                    value={editFormData.devices}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, devices: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter number of devices"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-bandwidth" className="text-brand-green">
                    Bandwidth
                  </Label>
                  <Input
                    id="edit-bandwidth"
                    name="bandwidth"
                    value={editFormData.bandwidth}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, bandwidth: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter bandwidth"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dataLimit" className="text-brand-green">
                    Data Limit
                  </Label>
                  <Input
                    id="edit-dataLimit"
                    name="dataLimit"
                    value={editFormData.dataLimit}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, dataLimit: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter data limit"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-timeLimit" className="text-brand-green">
                    
                    Time Limit
                  </Label>
                  <Input
                    id="edit-timeLimit"
                    name="timeLimit"
                    value={editFormData.timeLimit}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, timeLimit: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter time limit"
                  />
                </div>
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
              Are you sure you want to delete this plan? This action cannot be undone.
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
            <Button
              onClick={confirmDeletePlan}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:text-white"
              disabled={false}
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
              {`Are you sure you want to delete ${selectedPlans.length} selected plan${selectedPlans.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedPlans.length} Plan${selectedPlans.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HotspotPlans
