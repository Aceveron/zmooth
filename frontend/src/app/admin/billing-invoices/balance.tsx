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
import {
  MoreVertical,
  Trash,
  Edit,
  Download,
  Search,
  Plus,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample Balance data
import { useNavigate } from 'react-router-dom'
const initialBalances = [
  {
    id: "1",
    customer: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+254700111222",
    accountType: "prepaid",
    currentBalance: 1250,
    creditLimit: 0,
    lastTopup: "2025-01-10 00:00:00",
    lastUsage: "2025-01-14 00:00:00",
    status: "active",
    plan: "Basic Plan",
    station: "Station A",
  },
  {
    id: "2",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+254700222333",
    accountType: "postpaid",
    currentBalance: -800,
    creditLimit: 5000,
    lastTopup: "2024-12-15 00:00:00",
    lastUsage: "2025-01-14 00:00:00",
    status: "active",
    plan: "Premium Plan",
    station: "Station B",
  },
  {
    id: "3",
    customer: "Robert Johnson",
    customerEmail: "robert@example.com",
    customerPhone: "+254700333444",
    accountType: "prepaid",
    currentBalance: 0,
    creditLimit: 0,
    lastTopup: "2024-12-20 00:00:00",
    lastUsage: "2025-01-05 00:00:00",
    status: "suspended",
    plan: "Enterprise Plan",
    station: "Station A",
  },
]

// Sample plans and stations
const plans = [
  { id: "1", name: "Basic Plan" },
  { id: "2", name: "Premium Plan" },
  { id: "3", name: "Enterprise Plan" },
]

const stations = [
  { id: "1", name: "Station A" },
  { id: "2", name: "Station B" },
  { id: "3", name: "Station C" },
]

// Helper to format date/time as YYYY-MM-DD HH:MM:SS
function formatDateTime(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function BalancePage() {
  const navigate = useNavigate()
  const [isAddBalanceDialogOpen, setIsAddBalanceDialogOpen] = useState(false)
  const [isEditBalanceDialogOpen, setIsEditBalanceDialogOpen] = useState(false)
  const [isTopupDialogOpen, setIsTopupDialogOpen] = useState(false)
  const [balancesState, setBalancesState] = useState(initialBalances)
  const [selectedBalances, setSelectedBalances] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingBalance, setEditingBalance] = useState<any>(null)
  const [topupCustomer, setTopupCustomer] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    accountType: "prepaid",
    currentBalance: "",
    creditLimit: "",
    planId: "",
    stationId: "",
  })
  const [editFormData, setEditFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    accountType: "prepaid",
    currentBalance: "",
    creditLimit: "",
    planId: "",
    stationId: "",
  })
  const [topupData, setTopupData] = useState({
    amount: "",
    method: "mpesa",
    reference: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteBalanceId, setDeleteBalanceId] = useState<string | null>(null)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTopupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTopupData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTopupSelectChange = (name: string, value: string) => {
    setTopupData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedBalances((prev) => (prev.includes(id) ? prev.filter((balanceId) => balanceId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedBalances([])
    } else {
      setSelectedBalances(balancesState.map((balance) => balance.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter balances based on search query
  const filteredBalances = balancesState.filter(
    (balance) =>
      balance.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.accountType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const formattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const newBalance = {
      id: (balancesState.length + 1).toString(),
      customer: formData.customer,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      accountType: formData.accountType,
      currentBalance: Number.parseFloat(formData.currentBalance),
      creditLimit: Number.parseFloat(formData.creditLimit) || 0,
      lastTopup: formattedNow,
      lastUsage: formattedNow,
      status: "active",
      plan: plans.find((p) => p.id === formData.planId)?.name || "",
      station: stations.find((s) => s.id === formData.stationId)?.name || "",
    }
    setBalancesState((prev) => [...prev, newBalance])
    setIsAddBalanceDialogOpen(false)
    setFormData({
      customer: "",
      customerEmail: "",
      customerPhone: "",
      accountType: "prepaid",
      currentBalance: "",
      creditLimit: "",
      planId: "",
      stationId: "",
    })
    toast({
      title: "Success",
      description: "Balance account created successfully!",
    })
  }

  // Handle edit balance
  const handleEditBalance = (balance: any) => {
    setEditingBalance(balance)
    setEditFormData({
      customer: balance.customer,
      customerEmail: balance.customerEmail,
      customerPhone: balance.customerPhone,
      accountType: balance.accountType,
      currentBalance: balance.currentBalance.toString(),
      creditLimit: balance.creditLimit.toString(),
      planId: plans.find((p) => p.name === balance.plan)?.id || "",
      stationId: stations.find((s) => s.name === balance.station)?.id || "",
    })
    setIsEditBalanceDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBalancesState((prev) =>
      prev.map((balance) =>
        balance.id === editingBalance.id
          ? {
              ...balance,
              customer: editFormData.customer,
              customerEmail: editFormData.customerEmail,
              customerPhone: editFormData.customerPhone,
              accountType: editFormData.accountType,
              currentBalance: Number.parseFloat(editFormData.currentBalance),
              creditLimit: Number.parseFloat(editFormData.creditLimit) || 0,
              plan: plans.find((p) => p.id === editFormData.planId)?.name || balance.plan,
              station: stations.find((s) => s.id === editFormData.stationId)?.name || balance.station,
              lastTopup: formatDateTime(balance.lastTopup),
              lastUsage: formatDateTime(balance.lastUsage),
            }
          : balance,
      ),
    )
    setIsEditBalanceDialogOpen(false)
    setEditingBalance(null)
    toast({
      title: "Success",
      description: "Balance updated successfully!",
    })
  }

  // Handle topup
  const handleTopup = (balance: any) => {
    setTopupCustomer(balance)
    setTopupData({
      amount: "",
      method: "mpesa",
      reference: "",
    })
    setIsTopupDialogOpen(true)
  }

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const topupAmount = Number.parseFloat(topupData.amount)
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const formattedTopupNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    setBalancesState((prev) =>
      prev.map((balance) =>
        balance.id === topupCustomer.id
          ? {
              ...balance,
              currentBalance: balance.currentBalance + topupAmount,
              lastTopup: formattedTopupNow,
              status: "active",
            }
          : balance,
      ),
    )
    setIsTopupDialogOpen(false)
    setTopupCustomer(null)
    toast({
      title: "Success",
      description: `Account topped up with KES ${topupAmount.toLocaleString()} successfully!`,
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setBalancesState((prev) =>
      prev.map((balance) =>
        balance.id === id
          ? {
              ...balance,
              status: balance.status === "active" ? "suspended" : "active",
            }
          : balance,
      ),
    )
    const balance = balancesState.find((b) => b.id === id)
    toast({
      title: "Success",
      description: `Account ${balance?.status === "active" ? "suspended" : "activated"} successfully!`,
    })
  }

  // Handle delete single balance
  const handleDeleteBalance = (id: string) => {
    setDeleteBalanceId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteBalance = () => {
    setBalancesState((prev) => prev.filter((balance) => balance.id !== deleteBalanceId))
    setIsDeleteDialogOpen(false)
    setDeleteBalanceId(null)
    toast({
      title: "Success",
      description: "Balance account deleted successfully!",
    })
  }

  const cancelDeleteBalance = () => {
    setIsDeleteDialogOpen(false)
    setDeleteBalanceId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedBalances.length === 0) {
      toast({
        title: "Error",
        description: "Please select balance accounts first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setBalancesState((prev) =>
        prev.map((balance) => (selectedBalances.includes(balance.id) ? { ...balance, status: "active" } : balance)),
      )
      setSelectedBalances([])
      toast({
        title: "Success",
        description: `${selectedBalances.length} accounts activated successfully!`,
      })
    } else if (bulkAction === "suspend") {
      setBalancesState((prev) =>
        prev.map((balance) => (selectedBalances.includes(balance.id) ? { ...balance, status: "suspended" } : balance)),
      )
      setSelectedBalances([])
      toast({
        title: "Success",
        description: `${selectedBalances.length} accounts suspended successfully!`,
      })
    } else if (bulkAction === "export") {
      // Only export selected balances
      const csvContent = [
        ["Customer", "Account Type", "Current Balance", "Credit Limit", "Status", "Plan", "Station", "Last Topup"].join(","),
        ...balancesState
          .filter((balance) => selectedBalances.includes(balance.id))
          .map((balance) =>
            [
              balance.customer,
              balance.accountType,
              balance.currentBalance,
              balance.creditLimit,
              balance.status,
              balance.plan,
              balance.station,
              balance.lastTopup,
            ].join(","),
          ),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "balance-overview.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Selected balances exported successfully!",
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setBalancesState((prev) => prev.filter((balance) => !selectedBalances.includes(balance.id)))
    setSelectedBalances([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected balance accounts deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Calculate totals
  const totalPrepaidBalance = balancesState
    .filter((b) => b.accountType === "prepaid")
    .reduce((sum, b) => sum + b.currentBalance, 0)
  const totalPostpaidBalance = balancesState
    .filter((b) => b.accountType === "postpaid")
    .reduce((sum, b) => sum + b.currentBalance, 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass border-brand-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Prepaid Balance</p>
                <p className={`text-2xl font-bold ${totalPrepaidBalance < 0 ? 'text-red-500' : 'text-brand-green'}`}>KES {totalPrepaidBalance.toLocaleString()}</p>
              </div>
              <Wallet className={`h-8 w-8 ${totalPrepaidBalance < 0 ? 'text-red-500' : 'text-brand-green'}`} />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-brand-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Postpaid Balance</p>
                <p className={`text-2xl font-bold ${totalPostpaidBalance < 0 ? 'text-red-500' : 'text-brand-green'}`}>KES {totalPostpaidBalance.toLocaleString()}</p>
              </div>
              <CreditCard className={`h-8 w-8 ${totalPostpaidBalance < 0 ? 'text-red-500' : 'text-brand-green'}`} />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-brand-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Active Accounts</p>
                <p className="text-2xl font-bold text-brand-green">
                  {balancesState.filter((b) => b.status === "active").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-brand-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
         <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
            <CardTitle className="text-brand-green">Balance Overview</CardTitle>
            <CardDescription>Manage customer account balances and credit limits</CardDescription>
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
                  <SelectItem value="suspend">Suspend Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedBalances.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search balances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddBalanceDialogOpen} onOpenChange={setIsAddBalanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Balance Account</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add Balance Account</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new customer balance account
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
                        <Label htmlFor="accountType" className="text-brand-green">
                          Account Type
                        </Label>
                        <Select
                          value={formData.accountType}
                          onValueChange={(value) => handleSelectChange("accountType", value)}
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            <SelectItem value="prepaid">Prepaid</SelectItem>
                            <SelectItem value="postpaid">Postpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentBalance" className="text-brand-green">
                            Current Balance (KES)
                          </Label>
                          <Input
                            id="currentBalance"
                            name="currentBalance"
                            type="number"
                            value={formData.currentBalance}
                            onChange={handleInputChange}
                            placeholder="Enter current balance"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        {formData.accountType === "postpaid" && (
                          <div className="space-y-2">
                            <Label htmlFor="creditLimit" className="text-brand-green">
                              Credit Limit (KES)
                            </Label>
                            <Input
                              id="creditLimit"
                              name="creditLimit"
                              type="number"
                              value={formData.creditLimit}
                              onChange={handleInputChange}
                              placeholder="Enter credit limit"
                              className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-4">
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
                                  {plan.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stationId" className="text-brand-green">
                            Station
                          </Label>
                          <Select
                            value={formData.stationId}
                            onValueChange={(value) => handleSelectChange("stationId", value)}
                            required
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select station" />
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
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddBalanceDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Account
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
                  <TableHead>Account Type</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Topup</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBalances.map((balance, index) => (
                  <TableRow key={balance.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedBalances.includes(balance.id)}
                        onCheckedChange={() => handleCheckboxChange(balance.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{balance.customer}</TableCell>
                    <TableCell>{balance.accountType}</TableCell>
                    <TableCell>
                      <span className={balance.currentBalance < 0 ? "text-red-500" : "text-brand-green"}>
                        KES {balance.currentBalance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>KES {balance.creditLimit.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={balance.status === "active" ? "success" : "destructive"} className="capitalize">
                        {balance.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(balance.lastTopup)}</TableCell>
                    <TableCell>{balance.plan}</TableCell>
                    <TableCell>{balance.station}</TableCell>
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
                            onClick={() => handleEditBalance(balance)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleTopup(balance)}
                          >
                            <Plus className="h-4 w-4 mr-2 text-white" />
                            Top Up
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(balance.id)}
                          >
                            {balance.status === "active" ? (
                              <TrendingDown className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <TrendingUp className="h-4 w-4 mr-2 text-white" />
                            )}
                            {balance.status === "active" ? "Suspend" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single balance record
                              const csvContent = [
                                ["Customer", "Account Type", "Current Balance", "Credit Limit", "Status", "Plan", "Station", "Last Topup"].join(","),
                                [
                                  balance.customer,
                                  balance.accountType,
                                  balance.currentBalance,
                                  balance.creditLimit,
                                  balance.status,
                                  balance.plan,
                                  balance.station,
                                  balance.lastTopup,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = "balance.csv"
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: "Balance exported successfully!",
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteBalance(balance.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Account
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

      {/* Edit Balance Dialog */}
      <Dialog open={isEditBalanceDialogOpen} onOpenChange={setIsEditBalanceDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Balance Account</DialogTitle>
            <DialogDescription className="text-white/80">Update balance account information</DialogDescription>
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
                <Label htmlFor="edit-accountType" className="text-brand-green">
                  Account Type
                </Label>
                <Select
                  value={editFormData.accountType}
                  onValueChange={(value) => handleEditSelectChange("accountType", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="postpaid">Postpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-currentBalance" className="text-brand-green">
                    Current Balance (KES)
                  </Label>
                  <Input
                    id="edit-currentBalance"
                    name="currentBalance"
                    type="number"
                    value={editFormData.currentBalance}
                    onChange={handleEditInputChange}
                    placeholder="Enter current balance"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                {editFormData.accountType === "postpaid" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-creditLimit" className="text-brand-green">
                      Credit Limit (KES)
                    </Label>
                    <Input
                      id="edit-creditLimit"
                      name="creditLimit"
                      type="number"
                      value={editFormData.creditLimit}
                      onChange={handleEditInputChange}
                      placeholder="Enter credit limit"
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
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
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stationId" className="text-brand-green">
                    Station
                  </Label>
                  <Select
                    value={editFormData.stationId}
                    onValueChange={(value) => handleEditSelectChange("stationId", value)}
                    required
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select station" />
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
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditBalanceDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Topup Dialog */}
      <Dialog open={isTopupDialogOpen} onOpenChange={setIsTopupDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Top Up Account</DialogTitle>
            <DialogDescription className="text-white/80">
              Add credit to {topupCustomer?.customer}'s account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTopupSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-brand-green">Current Balance</Label>
                <div className="p-3 bg-brand-darkgray/50 rounded-lg">
                  <span className={topupCustomer?.currentBalance < 0 ? "text-red-500" : "text-brand-green"}>
                    KES {topupCustomer?.currentBalance?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topup-amount" className="text-brand-green">
                  Top Up Amount (KES)
                </Label>
                <Input
                  id="topup-amount"
                  name="amount"
                  type="number"
                  value={topupData.amount}
                  onChange={handleTopupInputChange}
                  placeholder="Enter amount to add"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topup-method" className="text-brand-green">
                  Payment Method
                </Label>
                <Select value={topupData.method} onValueChange={(value) => handleTopupSelectChange("method", value)}>
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topup-reference" className="text-brand-green">
                  Reference Number
                </Label>
                <Input
                  id="topup-reference"
                  name="reference"
                  value={topupData.reference}
                  onChange={handleTopupInputChange}
                  placeholder="Enter payment reference"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopupDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Top Up Account
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
              Are you sure you want to delete this balance account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteBalance}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteBalance} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedBalances.length} selected balance accounts? This action cannot be undone.`}
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
              {`Delete ${selectedBalances.length} Accounts`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
