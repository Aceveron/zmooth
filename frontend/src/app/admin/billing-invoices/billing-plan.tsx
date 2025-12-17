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
import { MoreVertical, Trash, Edit, Download, Search, Plus, Calendar, Clock, Zap, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { useNavigate } from 'react-router-dom'

// Sample Billing Plan data
const initialPlans = [
  {
    id: "1",
    planName: "Basic Monthly",
    planType: "monthly",
    price: 1200,
    speed: "5M/5M",
    dataLimit: "Unlimited",
    billingCycle: "monthly",
    status: "active",
    customers: 45,
    description: "Basic internet plan for home users",
    features: ["24/7 Support", "Basic Speed", "Unlimited Data"],
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
  },
  {
    id: "2",
    planName: "Premium Weekly",
    planType: "weekly",
    price: 350,
    speed: "10M/10M",
    dataLimit: "50GB",
    billingCycle: "weekly",
    status: "active",
    customers: 23,
    description: "Premium weekly plan for businesses",
    features: ["Priority Support", "High Speed", "50GB Data"],
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
  },
  {
    id: "3",
    planName: "Enterprise Quarterly",
    planType: "quarterly",
    price: 15000,
    speed: "50M/50M",
    dataLimit: "Unlimited",
    billingCycle: "quarterly",
    status: "inactive",
    customers: 8,
    description: "Enterprise plan for large organizations",
    features: ["Dedicated Support", "Ultra Speed", "Unlimited Data", "SLA Guarantee"],
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
  },
]

// Utility function for date formatting
function formatDateTime(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function BillingPlanPage() {
  const navigate = useNavigate()
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false)
  const [plansState, setPlansState] = useState(initialPlans)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    planName: "",
    planType: "monthly",
    price: "",
    speed: "",
    dataLimit: "",
    billingCycle: "monthly",
    description: "",
    features: "",
  })
  const [editFormData, setEditFormData] = useState({
    planName: "",
    planType: "monthly",
    price: "",
    speed: "",
    dataLimit: "",
    billingCycle: "monthly",
    description: "",
    features: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)

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
      setSelectedPlans(plansState.map((plan) => plan.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter plans based on search query
  const filteredPlans = plansState.filter(
    (plan) =>
      plan.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.billingCycle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const validFrom = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    let validTo = validFrom
    switch (formData.planType) {
      case "daily": {
        const toDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "weekly": {
        const toDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "monthly": {
        const toDate = new Date(now)
        toDate.setMonth(toDate.getMonth() + 1)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "quarterly": {
        const toDate = new Date(now)
        toDate.setMonth(toDate.getMonth() + 3)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "yearly": {
        const toDate = new Date(now)
        toDate.setFullYear(toDate.getFullYear() + 1)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      default:
        validTo = validFrom
    }
    const newPlan = {
      id: (plansState.length + 1).toString(),
      planName: formData.planName,
      planType: formData.planType,
      price: Number.parseFloat(formData.price),
      speed: formData.speed,
      dataLimit: formData.dataLimit,
      billingCycle: formData.billingCycle,
      status: "active",
      customers: 0,
      description: formData.description,
      features: formData.features.split(",").map((f) => f.trim()),
      validFrom,
      validTo,
    }
    setPlansState((prev) => [...prev, newPlan])
    setIsAddPlanDialogOpen(false)
    setFormData({
      planName: "",
      planType: "monthly",
      price: "",
      speed: "",
      dataLimit: "",
      billingCycle: "monthly",
      description: "",
      features: "",
    })
    toast({
      title: "Success",
      description: "Billing plan created successfully!",
    })
  }

  // Handle edit plan
  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan)
    setEditFormData({
      planName: plan.planName,
      planType: plan.planType,
      price: plan.price.toString(),
      speed: plan.speed,
      dataLimit: plan.dataLimit,
      billingCycle: plan.billingCycle,
      description: plan.description,
      features: plan.features.join(", "),
    })
    setIsEditPlanDialogOpen(true)
  }
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const validFrom = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    let validTo = validFrom
    switch (editFormData.planType) {
      case "daily": {
        const toDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "weekly": {
        const toDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "monthly": {
        const toDate = new Date(now)
        toDate.setMonth(toDate.getMonth() + 1)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "quarterly": {
        const toDate = new Date(now)
        toDate.setMonth(toDate.getMonth() + 3)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      case "yearly": {
        const toDate = new Date(now)
        toDate.setFullYear(toDate.getFullYear() + 1)
        validTo = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        break
      }
      default:
        validTo = validFrom
    }
    setPlansState((prev) =>
      prev.map((plan) =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              planName: editFormData.planName,
              planType: editFormData.planType,
              price: Number.parseFloat(editFormData.price),
              speed: editFormData.speed,
              dataLimit: editFormData.dataLimit,
              billingCycle: editFormData.billingCycle,
              description: editFormData.description,
              features: editFormData.features.split(",").map((f) => f.trim()),
              validFrom,
              validTo,
            }
          : plan,
      ),
    )
    setIsEditPlanDialogOpen(false)
    setEditingPlan(null)
    toast({
      title: "Success",
      description: "Billing plan updated successfully!",
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setPlansState((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              status: plan.status === "active" ? "inactive" : "active",
            }
          : plan,
      ),
    )
    const plan = plansState.find((p) => p.id === id)
    toast({
      title: "Success",
      description: `Plan ${plan?.status === "active" ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Handle delete single plan
  const handleDeletePlan = (id: string) => {
    setDeletePlanId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlan = () => {
    setPlansState((prev) => prev.filter((plan) => plan.id !== deletePlanId))
    setIsDeleteDialogOpen(false)
    setDeletePlanId(null)
    toast({
      title: "Success",
      description: "Billing plan deleted successfully!",
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
      setPlansState((prev) =>
        prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, status: "active" } : plan)),
      )
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setPlansState((prev) =>
        prev.map((plan) => (selectedPlans.includes(plan.id) ? { ...plan, status: "inactive" } : plan)),
      )
      setSelectedPlans([])
      toast({
        title: "Success",
        description: `${selectedPlans.length} plans deactivated successfully!`,
      })
    } else if (bulkAction === "export") {
      // Export selected plans pekee
      const csvContent = [
        ["Plan Name", "Type", "Price", "Speed", "Data Limit", "Billing Cycle", "Status", "Customers"].join(","),
        ...plansState
          .filter((plan) => selectedPlans.includes(plan.id))
          .map((plan) =>
            [
              plan.planName,
              plan.planType,
              plan.price,
              plan.speed,
              plan.dataLimit,
              plan.billingCycle,
              plan.status,
              plan.customers,
            ].join(","),
          ),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "billing-plans-selected.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Selected billing plans exported successfully!",
      })
      setSelectedPlans([])
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setPlansState((prev) => prev.filter((plan) => !selectedPlans.includes(plan.id)))
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

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Billing Plans</CardTitle>
              <CardDescription>Manage subscription plans and pricing</CardDescription>
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
                onClick={handleBulkAction}
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
              <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Create New Plan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Create New Billing Plan</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Set up a new subscription plan for customers
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="planType" className="text-brand-green">
                            Plan Type
                          </Label>
                          <Select
                            value={formData.planType}
                            onValueChange={(value) => handleSelectChange("planType", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
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
                            placeholder="Enter price"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="speed" className="text-brand-green">
                            Speed
                          </Label>
                          <Input
                            id="speed"
                            name="speed"
                            value={formData.speed}
                            onChange={handleInputChange}
                            placeholder="e.g. 10M/10M"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataLimit" className="text-brand-green">
                            Data Limit
                          </Label>
                          <Input
                            id="dataLimit"
                            name="dataLimit"
                            value={formData.dataLimit}
                            onChange={handleInputChange}
                            placeholder="e.g. 50GB or Unlimited"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCycle" className="text-brand-green">
                          Billing Cycle
                        </Label>
                        <Select
                          value={formData.billingCycle}
                          onValueChange={(value) => handleSelectChange("billingCycle", value)}
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
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
                          placeholder="Enter plan description"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="features" className="text-brand-green">
                          Features (comma separated)
                        </Label>
                        <Input
                          id="features"
                          name="features"
                          value={formData.features}
                          onChange={handleInputChange}
                          placeholder="e.g. 24/7 Support, High Speed, Unlimited Data"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        />
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
                        Create Plan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border border-brand-green/30 overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Data Limit</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedPlans.includes(plan.id)}
                        onCheckedChange={() => handleCheckboxChange(plan.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{plan.planName}</TableCell>
                    <TableCell>{plan.planType}</TableCell>
                    <TableCell>{plan.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-brand-green" />
                        {plan.speed}
                      </div>
                    </TableCell>
                    <TableCell>{plan.dataLimit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-brand-green" />
                        {plan.billingCycle}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.status === "active" ? "success" : "destructive"} className="capitalize">
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{plan.customers}</TableCell>
                    <TableCell>{formatDateTime(plan.validFrom)}</TableCell>
                    <TableCell>{formatDateTime(plan.validTo)}</TableCell>
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
                            onClick={() => handleToggleStatus(plan.id)}
                          >
                            {plan.status === "active" ? (
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
                                ["Plan Name", "Type", "Price", "Speed", "Data Limit", "Billing Cycle", "Status", "Customers"].join(","),
                                [
                                  plan.planName,
                                  plan.planType,
                                  plan.price,
                                  plan.speed,
                                  plan.dataLimit,
                                  plan.billingCycle,
                                  plan.status,
                                  plan.customers,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `billing-plan-${plan.planName}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Billing plan '${plan.planName}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
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
            <DialogTitle className="text-brand-green">Edit Billing Plan</DialogTitle>
            <DialogDescription className="text-white/80">Update plan information</DialogDescription>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-planType" className="text-brand-green">
                    Plan Type
                  </Label>
                  <Select
                    value={editFormData.planType}
                    onValueChange={(value) => handleEditSelectChange("planType", value)}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Enter price"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-speed" className="text-brand-green">
                    Speed
                  </Label>
                  <Input
                    id="edit-speed"
                    name="speed"
                    value={editFormData.speed}
                    onChange={handleEditInputChange}
                    placeholder="e.g. 10M/10M"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dataLimit" className="text-brand-green">
                    Data Limit
                  </Label>
                  <Input
                    id="edit-dataLimit"
                    name="dataLimit"
                    value={editFormData.dataLimit}
                    onChange={handleEditInputChange}
                    placeholder="e.g. 50GB or Unlimited"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-billingCycle" className="text-brand-green">
                  Billing Cycle
                </Label>
                <Select
                  value={editFormData.billingCycle}
                  onValueChange={(value) => handleEditSelectChange("billingCycle", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
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
                  placeholder="Enter plan description"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-features" className="text-brand-green">
                  Features (comma separated)
                </Label>
                <Input
                  id="edit-features"
                  name="features"
                  value={editFormData.features}
                  onChange={handleEditInputChange}
                  placeholder="e.g. 24/7 Support, High Speed, Unlimited Data"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
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
                Update Plan
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
              Are you sure you want to delete this billing plan? This action cannot be undone.
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
