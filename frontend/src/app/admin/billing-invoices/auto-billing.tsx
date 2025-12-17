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
import { Switch } from "@/components/ui/switch"
import {
  MoreVertical,
  Trash,
  Edit,
  Download,
  Search,
  Plus,
  Calendar,
  Clock,
  CreditCard,
  Pause,
  Play,
} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { toast } from "@/hooks/use-toast"

// Sample Auto Billing data
const initialAutoBilling = [
  {
    id: "1",
    customer: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+254700111222",
    plan: "Basic Monthly",
    amount: 1200,
    billingCycle: "monthly",
    nextBilling: "2025-02-01",
    lastBilled: "2025-01-01",
    status: "active",
    paymentMethod: "M-Pesa",
    autoRenewal: true,
    failedAttempts: 0,
    createdDate: "2024-12-01",
  },
  {
    id: "2",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+254700222333",
    plan: "Premium Weekly",
    amount: 350,
    billingCycle: "weekly",
    nextBilling: "2025-01-21",
    lastBilled: "2025-01-14",
    status: "active",
    paymentMethod: "Card",
    autoRenewal: true,
    failedAttempts: 1,
    createdDate: "2024-11-15",
  },
  {
    id: "3",
    customer: "Robert Johnson",
    customerEmail: "robert@example.com",
    customerPhone: "+254700333444",
    plan: "Enterprise Quarterly",
    amount: 15000,
    billingCycle: "quarterly",
    nextBilling: "2025-04-01",
    lastBilled: "2025-01-01",
    status: "paused",
    paymentMethod: "Bank Transfer",
    autoRenewal: false,
    failedAttempts: 3,
    createdDate: "2024-10-01",
  },
]

// Sample plans
const plans = [
  { id: "1", name: "Basic Monthly", price: 1200 },
  { id: "2", name: "Premium Weekly", price: 350 },
  { id: "3", name: "Enterprise Quarterly", price: 15000 },
]

// Utility function for date formatting
function formatDateTime(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function AutoBillingPage() {
  const navigate = useNavigate()
  const [isAddBillingDialogOpen, setIsAddBillingDialogOpen] = useState(false)
  const [isEditBillingDialogOpen, setIsEditBillingDialogOpen] = useState(false)
  const [billingState, setBillingState] = useState(initialAutoBilling)
  const [selectedBilling, setSelectedBilling] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingBilling, setEditingBilling] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    planId: "",
    billingCycle: "monthly",
    paymentMethod: "mpesa",
    autoRenewal: true,
    startDate: "",
  })
  const [editFormData, setEditFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    planId: "",
    billingCycle: "monthly",
    paymentMethod: "mpesa",
    autoRenewal: true,
    startDate: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteBillingId, setDeleteBillingId] = useState<string | null>(null)

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

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleEditSwitchChange = (name: string, checked: boolean) => {
    setEditFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedBilling((prev) => (prev.includes(id) ? prev.filter((billingId) => billingId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedBilling([])
    } else {
      setSelectedBilling(billingState.map((billing) => billing.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter billing based on search query
  const filteredBilling = billingState.filter(
    (billing) =>
      billing.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      billing.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      billing.billingCycle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      billing.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate next billing date
  const calculateNextBilling = (startDate: string, cycle: string) => {
    const start = new Date(startDate)
    const next = new Date(start)

    switch (cycle) {
      case "daily":
        next.setDate(start.getDate() + 1)
        break
      case "weekly":
        next.setDate(start.getDate() + 7)
        break
      case "monthly":
        next.setMonth(start.getMonth() + 1)
        break
      case "quarterly":
        next.setMonth(start.getMonth() + 3)
        break
      case "yearly":
        next.setFullYear(start.getFullYear() + 1)
        break
    }

    return next.toISOString().split("T")[0]
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPlan = plans.find((p) => p.id === formData.planId)
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const startDateTime = formData.startDate ? `${formData.startDate} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : ""
    const nextBilling = calculateNextBilling(formData.startDate, formData.billingCycle)
    const nextBillingDateTime = nextBilling ? `${nextBilling} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : ""
    const newBilling = {
      id: (billingState.length + 1).toString(),
      customer: formData.customer,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      plan: selectedPlan?.name || "",
      amount: selectedPlan?.price || 0,
      billingCycle: formData.billingCycle,
      nextBilling: formatDateTime(nextBillingDateTime),
      lastBilled: formatDateTime(startDateTime),
      status: "active",
      paymentMethod: formData.paymentMethod,
      autoRenewal: formData.autoRenewal,
      failedAttempts: 0,
      createdDate: formatDateTime(now.toISOString()),
    }
    setBillingState((prev) => [...prev, newBilling])
    setIsAddBillingDialogOpen(false)
    setFormData({
      customer: "",
      customerEmail: "",
      customerPhone: "",
      planId: "",
      billingCycle: "monthly",
      paymentMethod: "mpesa",
      autoRenewal: true,
      startDate: "",
    })
    toast({
      title: "Success",
      description: "Auto billing setup created successfully!",
    })
  }

  // Handle edit billing
  const handleEditBilling = (billing: any) => {
    setEditingBilling(billing)
    setEditFormData({
      customer: billing.customer,
      customerEmail: billing.customerEmail,
      customerPhone: billing.customerPhone,
      planId: plans.find((p) => p.name === billing.plan)?.id || "",
      billingCycle: billing.billingCycle,
      paymentMethod: billing.paymentMethod.toLowerCase().replace("-", "").replace(" ", ""),
      autoRenewal: billing.autoRenewal,
      startDate: billing.lastBilled,
    })
    setIsEditBillingDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPlan = plans.find((p) => p.id === editFormData.planId)
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const startDateTime = editFormData.startDate ? `${editFormData.startDate} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : ""
    const nextBilling = calculateNextBilling(editFormData.startDate, editFormData.billingCycle)
    const nextBillingDateTime = nextBilling ? `${nextBilling} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : ""
    setBillingState((prev) =>
      prev.map((billing) =>
        billing.id === editingBilling.id
          ? {
              ...billing,
              customer: editFormData.customer,
              customerEmail: editFormData.customerEmail,
              customerPhone: editFormData.customerPhone,
              plan: selectedPlan?.name || billing.plan,
              amount: selectedPlan?.price || billing.amount,
              billingCycle: editFormData.billingCycle,
              nextBilling: formatDateTime(nextBillingDateTime),
              lastBilled: formatDateTime(startDateTime),
              paymentMethod: editFormData.paymentMethod,
              autoRenewal: editFormData.autoRenewal,
            }
          : billing,
      ),
    )
    setIsEditBillingDialogOpen(false)
    setEditingBilling(null)
    toast({
      title: "Success",
      description: "Auto billing updated successfully!",
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setBillingState((prev) =>
      prev.map((billing) =>
        billing.id === id
          ? {
              ...billing,
              status: billing.status === "active" ? "paused" : "active",
            }
          : billing,
      ),
    )
    const billing = billingState.find((b) => b.id === id)
    toast({
      title: "Success",
      description: `Auto billing ${billing?.status === "active" ? "paused" : "activated"} successfully!`,
    })
  }

  // Handle auto renewal toggle
  const handleToggleAutoRenewal = (id: string) => {
    setBillingState((prev) =>
      prev.map((billing) =>
        billing.id === id
          ? {
              ...billing,
              autoRenewal: !billing.autoRenewal,
            }
          : billing,
      ),
    )
    const billing = billingState.find((b) => b.id === id)
    toast({
      title: "Success",
      description: `Auto renewal ${billing?.autoRenewal ? "disabled" : "enabled"} successfully!`,
    })
  }

  // Handle delete single billing
  const handleDeleteBilling = (id: string) => {
    setDeleteBillingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteBilling = () => {
    setBillingState((prev) => prev.filter((billing) => billing.id !== deleteBillingId))
    setIsDeleteDialogOpen(false)
    setDeleteBillingId(null)
    toast({
      title: "Success",
      description: "Auto billing deleted successfully!",
    })
  }

  const cancelDeleteBilling = () => {
    setIsDeleteDialogOpen(false)
    setDeleteBillingId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedBilling.length === 0) {
      toast({
        title: "Error",
        description: "Please select billing setups first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setBillingState((prev) =>
        prev.map((billing) => (selectedBilling.includes(billing.id) ? { ...billing, status: "active" } : billing)),
      )
      setSelectedBilling([])
      toast({
        title: "Success",
        description: `${selectedBilling.length} billing setups activated successfully!`,
      })
    } else if (bulkAction === "pause") {
      setBillingState((prev) =>
        prev.map((billing) => (selectedBilling.includes(billing.id) ? { ...billing, status: "paused" } : billing)),
      )
      setSelectedBilling([])
      toast({
        title: "Success",
        description: `${selectedBilling.length} billing setups paused successfully!`,
      })
    } else if (bulkAction === "enable-renewal") {
      setBillingState((prev) =>
        prev.map((billing) => (selectedBilling.includes(billing.id) ? { ...billing, autoRenewal: true } : billing)),
      )
      setSelectedBilling([])
      toast({
        title: "Success",
        description: `Auto renewal enabled for ${selectedBilling.length} billing setups!`,
      })
    } else if (bulkAction === "disable-renewal") {
      setBillingState((prev) =>
        prev.map((billing) => (selectedBilling.includes(billing.id) ? { ...billing, autoRenewal: false } : billing)),
      )
      setSelectedBilling([])
      toast({
        title: "Success",
        description: `Auto renewal disabled for ${selectedBilling.length} billing setups!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setBillingState((prev) => prev.filter((billing) => !selectedBilling.includes(billing.id)))
    setSelectedBilling([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected billing setups deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Customer", "Plan", "Amount", "Billing Cycle", "Next Billing", "Status", "Auto Renewal", "Payment Method"].join(
        ",",
      ),
      ...filteredBilling.map((billing) =>
        [
          billing.customer,
          billing.plan,
          billing.amount,
          billing.billingCycle,
          billing.nextBilling,
          billing.status,
          billing.autoRenewal ? "Yes" : "No",
          billing.paymentMethod,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "auto-billing.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Auto billing data exported successfully!",
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
              <CardTitle className="text-brand-green">Auto Billing</CardTitle>
              <CardDescription>Manage automatic billing and subscription renewals</CardDescription>
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
                  <SelectItem value="pause">Pause Selected</SelectItem>
                  <SelectItem value="enable-renewal">Enable Auto Renewal</SelectItem>
                  <SelectItem value="disable-renewal">Disable Auto Renewal</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected billing setups
                    const csvContent = [
                      ["Customer", "Plan", "Amount", "Billing Cycle", "Next Billing", "Status", "Auto Renewal", "Payment Method"].join(","),
                      ...billingState
                        .filter((billing) => selectedBilling.includes(billing.id))
                        .map((billing) =>
                          [
                            billing.customer,
                            billing.plan,
                            billing.amount,
                            billing.billingCycle,
                            formatDateTime(billing.nextBilling),
                            billing.status,
                            billing.autoRenewal ? "Yes" : "No",
                            billing.paymentMethod,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "auto-billing.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected auto billing setups exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedBilling.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search billing setups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddBillingDialogOpen} onOpenChange={setIsAddBillingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Setup Auto Billing</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Setup Auto Billing</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Configure automatic billing for a customer
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer" className="text-brand-green">
                          Customer Name
                        </Label>
                        <Input
                          id="customer"
                          name="customer"
                          value={formData.customer}
                          onChange={handleInputChange}
                          placeholder="Enter customer name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail" className="text-brand-green">
                            Customer Email
                          </Label>
                          <Input
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="Enter customer email"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone" className="text-brand-green">
                            Customer Phone
                          </Label>
                          <Input
                            id="customerPhone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="Enter customer phone"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="planId" className="text-brand-green">
                          Plan
                        </Label>
                        <Select
                          value={formData.planId}
                          onValueChange={(value) => handleSelectChange("planId", value)}
                          required
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - KES {plan.price.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCycle" className="text-brand-green">
                            Billing Cycle
                          </Label>
                          <Select
                            value={formData.billingCycle}
                            onValueChange={(value) => handleSelectChange("billingCycle", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select cycle" />
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
                          <Label htmlFor="paymentMethod" className="text-brand-green">
                            Payment Method
                          </Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="mpesa">M-Pesa</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-brand-green">
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoRenewal"
                          checked={formData.autoRenewal}
                          onCheckedChange={(checked) => handleSwitchChange("autoRenewal", checked)}
                          className="data-[state=checked]:bg-brand-green"
                        />
                        <Label htmlFor="autoRenewal" className="text-brand-green">
                          Enable Auto Renewal
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddBillingDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                          Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Setup Billing
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount (KES)</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto Renewal</TableHead>
                  <TableHead>Failed Attempts</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBilling.map((billing, index) => (
                  <TableRow key={billing.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedBilling.includes(billing.id)}
                        onCheckedChange={() => handleCheckboxChange(billing.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{billing.customer}</TableCell>
                    <TableCell>{billing.plan}</TableCell>
                    <TableCell>{billing.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-brand-green" />
                        {billing.billingCycle}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-brand-green" />
                        {formatDateTime(billing.nextBilling)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {billing.status === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {billing.autoRenewal ? (
                        <Badge variant="success">Enabled</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={billing.failedAttempts > 2 ? "text-red-500" : "text-white"}>
                        {billing.failedAttempts}
                      </span>
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
                            onClick={() => handleEditBilling(billing)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Billing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(billing.id)}
                          >
                            {billing.status === "active" ? (
                              <Pause className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <Play className="h-4 w-4 mr-2 text-white" />
                            )}
                            {billing.status === "active" ? "Pause" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleAutoRenewal(billing.id)}
                          >
                            <CreditCard className="h-4 w-4 mr-2 text-white" />
                            {billing.autoRenewal ? "Disable" : "Enable"} Auto Renewal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              const csvContent = [
                                ["Customer", "Plan", "Amount", "Billing Cycle", "Next Billing", "Status", "Auto Renewal", "Payment Method"].join(","),
                                [
                                  billing.customer,
                                  billing.plan,
                                  billing.amount,
                                  billing.billingCycle,
                                  formatDateTime(billing.nextBilling),
                                  billing.status,
                                  billing.autoRenewal ? "Yes" : "No",
                                  billing.paymentMethod,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `auto-billing-${billing.customer}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Auto billing for '${billing.customer}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteBilling(billing.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Billing
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

      {/* Edit Billing Dialog */}
      <Dialog open={isEditBillingDialogOpen} onOpenChange={setIsEditBillingDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Auto Billing</DialogTitle>
            <DialogDescription className="text-white/80">Update billing configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customer" className="text-brand-green">
                  Customer Name
                </Label>
                <Input
                  id="edit-customer"
                  name="customer"
                  value={editFormData.customer}
                  onChange={handleEditInputChange}
                  placeholder="Enter customer name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customerEmail" className="text-brand-green">
                    Customer Email
                  </Label>
                  <Input
                    id="edit-customerEmail"
                    name="customerEmail"
                    type="email"
                    value={editFormData.customerEmail}
                    onChange={handleEditInputChange}
                    placeholder="Enter customer email"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-customerPhone" className="text-brand-green">
                    Customer Phone
                  </Label>
                  <Input
                    id="edit-customerPhone"
                    name="customerPhone"
                    value={editFormData.customerPhone}
                    onChange={handleEditInputChange}
                    placeholder="Enter customer phone"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-planId" className="text-brand-green">
                  Plan
                </Label>
                <Select
                  value={editFormData.planId}
                  onValueChange={(value) => handleEditSelectChange("planId", value)}
                  required
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - KES {plan.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-billingCycle" className="text-brand-green">
                    Billing Cycle
                  </Label>
                  <Select
                    value={editFormData.billingCycle}
                    onValueChange={(value) => handleEditSelectChange("billingCycle", value)}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select cycle" />
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
                  <Label htmlFor="edit-paymentMethod" className="text-brand-green">
                    Payment Method
                  </Label>
                  <Select
                    value={editFormData.paymentMethod}
                    onValueChange={(value) => handleEditSelectChange("paymentMethod", value)}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-autoRenewal"
                  checked={editFormData.autoRenewal}
                  onCheckedChange={(checked) => handleEditSwitchChange("autoRenewal", checked)}
                  className="data-[state=checked]:bg-brand-green"
                />
                <Label htmlFor="edit-autoRenewal" className="text-brand-green">
                  Enable Auto Renewal
                </Label>
              </div>
              </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditBillingDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Billing
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
              Are you sure you want to delete this auto billing setup? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteBilling}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
            Cancel
            </Button>
            <Button onClick={confirmDeleteBilling} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedBilling.length} selected billing setups? This action cannot be undone.`}
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
              {`Delete ${selectedBilling.length} Setups`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
