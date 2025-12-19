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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample PPPoE Plans data
const initialPlans = [
  {
    id: "1",
    name: "Basic PPPoE",
    stationName: "Station A",
    planType: "PPPoE",
    planCode: "PPPOE-BASIC",
    methodType: "Prepaid",
    duration: "30 Days",
    price: "KES 1000",
    speed: "5M/5M",
    syncPlan: true,
    stationId: "1",
    priceAmount: "1000",
    expiration: "30",
    expirationType: "day",
    speedLimit: "5M/5M",
  },
  {
    id: "2",
    name: "Premium Static",
    stationName: "Station B",
    planType: "Static",
    planCode: "STATIC-PREM",
    methodType: "Postpaid",
    duration: "30 Days",
    price: "KES 2500",
    speed: "10M/10M",
    syncPlan: true,
    stationId: "2",
    priceAmount: "2500",
    expiration: "30",
    expirationType: "day",
    speedLimit: "10M/10M",
  },
  {
    id: "3",
    name: "Enterprise PPPoE",
    stationName: "Station A",
    planType: "PPPoE",
    planCode: "PPPOE-ENT",
    methodType: "Prepaid",
    duration: "30 Days",
    price: "KES 5000",
    speed: "20M/20M",
    syncPlan: false,
    stationId: "1",
    priceAmount: "5000",
    expiration: "30",
    expirationType: "day",
    speedLimit: "20M/20M",
  },
]

// Sample stations
const stations = [
  { id: "1", name: "Station A" },
  { id: "2", name: "Station B" },
  { id: "3", name: "Station C" },
]

function PPPoEPlans() {
  const navigate = useNavigate()
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    planType: "pppoe",
    stationId: "",
    price: "",
    expiration: "1",
    expirationType: "month",
    speedLimit: "",
    planName: "",
  })
  const [editFormData, setEditFormData] = useState({
    planType: "pppoe",
    stationId: "",
    price: "",
    expiration: "1",
    expirationType: "month",
    speedLimit: "",
    planName: "",
  })
  const [pppoePlansState, setPppoePlansState] = useState(initialPlans)
  const [bulkAction, setBulkAction] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

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
      setSelectedPlans(pppoePlansState.map((plan) => plan.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter plans based on search query
  const filteredPlans = pppoePlansState.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPlan = {
      id: (pppoePlansState.length + 1).toString(),
      name: formData.planName,
      stationName: stations.find((s) => s.id === formData.stationId)?.name || "",
      planType: formData.planType === "pppoe" ? "PPPoE" : "Static",
      planCode: `${formData.planType.toUpperCase()}-${Date.now()}`,
      methodType: "Prepaid",
      duration: `${formData.expiration} ${formData.expirationType}${formData.expiration !== "1" ? "s" : ""}`,
      price: `KES ${formData.price}`,
      speed: formData.speedLimit,
      syncPlan: true,
      stationId: formData.stationId,
      priceAmount: formData.price,
      expiration: formData.expiration,
      expirationType: formData.expirationType,
      speedLimit: formData.speedLimit,
    }
    setPppoePlansState((prev) => [...prev, newPlan])
    setIsAddPlanDialogOpen(false)
    setFormData({
      planType: "pppoe",
      stationId: "",
      price: "",
      expiration: "1",
      expirationType: "month",
      speedLimit: "",
      planName: "",
    })
    toast({
      title: "Success",
      description: "Plan created successfully!",
    })
  }

  // Handle edit plan
  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan)
    setEditFormData({
      planType: plan.planType.toLowerCase(),
      stationId: plan.stationId,
      price: plan.priceAmount,
      expiration: plan.expiration,
      expirationType: plan.expirationType,
      speedLimit: plan.speedLimit,
      planName: plan.name,
    })
    setIsEditPlanDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPppoePlansState((prev) =>
      prev.map((plan) =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              name: editFormData.planName,
              stationName: stations.find((s) => s.id === editFormData.stationId)?.name || plan.stationName,
              planType: editFormData.planType === "pppoe" ? "PPPoE" : "Static",
              duration: `${editFormData.expiration} ${editFormData.expirationType}${editFormData.expiration !== "1" ? "s" : ""}`,
              price: `KES ${editFormData.price}`,
              speed: editFormData.speedLimit,
              stationId: editFormData.stationId,
              priceAmount: editFormData.price,
              expiration: editFormData.expiration,
              expirationType: editFormData.expirationType,
              speedLimit: editFormData.speedLimit,
            }
          : plan,
      ),
    )
    setIsEditPlanDialogOpen(false)
    setEditingPlan(null)
    toast({
      title: "Success",
      description: "Plan updated successfully!",
    })
  }

  // Handle sync toggle
  const handleToggleSync = (id: string) => {
    setPppoePlansState((prev) => prev.map((plan) => (plan.id === id ? { ...plan, syncPlan: !plan.syncPlan } : plan)))
    const plan = pppoePlansState.find((p) => p.id === id)
    toast({
      title: "Success",
      description: `Plan ${plan?.syncPlan ? "unsynced" : "synced"} successfully!`,
    })
  }

  // Handle delete single plan
  const handleDeletePlan = (id: string) => {
    setDeletePlanId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlan = () => {
    setPppoePlansState((prev) => prev.filter((plan) => plan.id !== deletePlanId))
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
    } else if (bulkAction === "sync") {
      setPppoePlansState((prev) =>
        prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, syncPlan: true } : plan)),
      )
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans synced successfully!`,
      })
    } else if (bulkAction === "unsync") {
      setPppoePlansState((prev) =>
        prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, syncPlan: false } : plan)),
      )
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans unsynced successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setPppoePlansState((prev) => prev.filter((plan) => !selectedPlans.includes(plan.id)))
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

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Plan Name", "Station", "Type", "Code", "Method", "Duration", "Price", "Speed", "Sync"].join(","),
      ...filteredPlans.map((plan) =>
        [
          plan.name,
          plan.stationName,
          plan.planType,
          plan.planCode,
          plan.methodType,
          plan.duration,
          plan.price,
          plan.speed,
          plan.syncPlan ? "Yes" : "No",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pppoe-plans.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Plans exported successfully!",
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
              <CardTitle className="text-brand-green">PPPoE / Static Plans</CardTitle>
              <CardDescription>Manage plans for PPPoE and Static IP connections</CardDescription>
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
                  <SelectItem value="sync">Sync Selected</SelectItem>
                  <SelectItem value="unsync">Unsync Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    handleExport();
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedPlans.length === 0 && bulkAction !== "export"}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-[150px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-[150px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add New PPPoE / Static Plan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Network Plan</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new plan for PPPoE or Static IP connections
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="planName" className="text-brand-green">
                          Plan Name
                        </Label>
                        <Input
                          id="planName"
                          name="planName"
                          value={formData.planName}
                          onChange={handleInputChange}
                          placeholder="Enter plan name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="planType" className="text-brand-green">
                          Select Plan Type
                        </Label>
                        <Select value={formData.planType} onValueChange={(value) => handleSelectChange("planType", value)}>
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select plan type" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            <SelectItem value="pppoe">PPPoE</SelectItem>
                            <SelectItem value="static">Static IP</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-white/60">Choose whether this plan is for PPPoE or Static IP.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stationId" className="text-brand-green">
                          Choose Station
                        </Label>
                        <Select
                          value={formData.stationId}
                          onValueChange={(value) => handleSelectChange("stationId", value)}
                          required
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select Station" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {stations.map((station) => (
                              <SelectItem key={station.id} value={station.id}>
                                {station.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-white/60">Select the station this plan will be associated with.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-brand-green">
                          Price
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Price"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                        <p className="text-xs text-white/60">Enter the price for this plan.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiration" className="text-brand-green">
                            Expiration
                          </Label>
                          <Input
                            id="expiration"
                            name="expiration"
                            type="number"
                            value={formData.expiration}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                          <p className="text-xs text-white/60">Specify the duration before the plan expires.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expirationType" className="text-brand-green">
                            Expiration Type
                          </Label>
                          <Select
                            value={formData.expirationType}
                            onValueChange={(value) => handleSelectChange("expirationType", value)}
                            required
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="minute">Minute</SelectItem>
                              <SelectItem value="hour">Hour</SelectItem>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="week">Week</SelectItem>
                              <SelectItem value="month">Month</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-white/60">Select the unit of time for expiration.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="speedLimit" className="text-brand-green">
                          Speed Limit (M/M)
                        </Label>
                        <Input
                          id="speedLimit"
                          name="speedLimit"
                          value={formData.speedLimit}
                          onChange={handleInputChange}
                          placeholder="eg 1M/1M"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                        <p className="text-xs text-white/60">Enter the speed limit in megabits per second (e.g., 1M/1M).</p>
                     </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddPlanDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
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
            <Table>
              <TableHeader>
                <TableRow className="border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Station Name</TableHead>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Plan Code</TableHead>
                  <TableHead>Method Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Sync Plan</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={() => handleCheckboxChange(plan.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.stationName}</TableCell>
                    <TableCell className="text-white">{plan.planType}</TableCell>
                    <TableCell>{plan.planCode}</TableCell>
                    <TableCell>{plan.methodType}</TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.speed}</TableCell>
                    <TableCell>
                      {plan.syncPlan ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">No</Badge>
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
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleSync(plan.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {plan.syncPlan ? "Unsync" : "Sync"} Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={handleExport}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Plan
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
      <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Network Plan</DialogTitle>
            <DialogDescription className="text-white/80">
              Update plan for PPPoE or Static IP connections
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-planName" className="text-brand-green">
                  Plan Name
                </Label>
                <Input
                  id="edit-planName"
                  name="planName"
                  value={editFormData.planName}
                  onChange={handleEditInputChange}
                  placeholder="Enter plan name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-planType" className="text-brand-green">
                  Select Plan Type
                </Label>
                <Select
                  value={editFormData.planType}
                  onValueChange={(value) => handleEditSelectChange("planType", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="pppoe">PPPoE</SelectItem>
                    <SelectItem value="static">Static IP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stationId" className="text-brand-green">
                  Choose Station
                </Label>
                <Select
                  value={editFormData.stationId}
                  onValueChange={(value) => handleEditSelectChange("stationId", value)}
                  required
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select Station" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-brand-green">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditInputChange}
                  placeholder="Price"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-expiration" className="text-brand-green">
                    Expiration
                  </Label>
                  <Input
                    id="edit-expiration"
                    name="expiration"
                    type="number"
                    value={editFormData.expiration}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expirationType" className="text-brand-green">
                    Expiration Type
                  </Label>
                  <Select
                    value={editFormData.expirationType}
                    onValueChange={(value) => handleEditSelectChange("expirationType", value)}
                    required
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="minute">Minute</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-speedLimit" className="text-brand-green">
                  Speed Limit (M/M)
                </Label>
                <Input
                  id="edit-speedLimit"
                  name="speedLimit"
                  value={editFormData.speedLimit}
                  onChange={handleEditInputChange}
                  placeholder="eg 1M/1M"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditPlanDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                UPDATE PLAN
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

export default PPPoEPlans