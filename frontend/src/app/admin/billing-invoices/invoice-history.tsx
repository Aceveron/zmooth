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
import { MoreVertical, Trash, Edit, Download, Search, FileText, Eye } from "lucide-react"
import { RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample Invoice data
const initialInvoices = [
  {
    id: "1",
    invoiceId: "INV-2025-001",
    customer: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+254700111222",
    amount: 1200,
    status: "paid",
    dueDate: "2025-01-15",
    issueDate: "2025-01-01",
    paymentMethod: "M-Pesa",
    description: "Monthly Internet Plan - Basic",
    plan: "Basic Plan",
    station: "Station A",
  },
  {
    id: "2",
    invoiceId: "INV-2025-002",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+254700222333",
    amount: 800,
    status: "unpaid",
    dueDate: "2025-01-20",
    issueDate: "2025-01-05",
    paymentMethod: "Card",
    description: "Monthly Internet Plan - Premium",
    plan: "Premium Plan",
    station: "Station B",
  },
  {
    id: "3",
    invoiceId: "INV-2025-003",
    customer: "Robert Johnson",
    customerEmail: "robert@example.com",
    customerPhone: "+254700333444",
    amount: 1500,
    status: "overdue",
    dueDate: "2024-12-30",
    issueDate: "2024-12-15",
    paymentMethod: "Bank Transfer",
    description: "Monthly Internet Plan - Enterprise",
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

export default function InvoiceHistoryPage() {
  // Helper to check invoice status
  function isActive(status: string) {
    return status === "paid";
  }
  function isOverdue(status: string) {
    return status === "overdue";
  }
  // Toggle active (paid/unpaid)
  function handleToggleActive(id: string) {
    setInvoicesState((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: invoice.status === "paid" ? "unpaid" : "paid",
            }
          : invoice,
      ),
    );
    toast({
      title: "Success",
      description: `Invoice status updated successfully!`,
    });
  }
  // Mark as overdue
  function handleMarkOverdue(id: string) {
    setInvoicesState((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: "overdue",
            }
          : invoice,
      ),
    );
    toast({
      title: "Success",
      description: `Invoice marked as overdue!`,
    });
  }
  // Helper to format date/time as YYYY-MM-DD HH:MM:SS
  function formatDateTime(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // fallback ya invalid date
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  const navigate = useNavigate()
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false)
  const [isEditInvoiceDialogOpen, setIsEditInvoiceDialogOpen] = useState(false)
  const [invoicesState, setInvoicesState] = useState(initialInvoices)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    amount: "",
    dueDate: "",
    paymentMethod: "mpesa",
    description: "",
    planId: "",
    stationId: "",
  })
  const [editFormData, setEditFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    amount: "",
    dueDate: "",
    paymentMethod: "mpesa",
    description: "",
    planId: "",
    stationId: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null)

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
    setSelectedInvoices((prev) => (prev.includes(id) ? prev.filter((invoiceId) => invoiceId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(invoicesState.map((invoice) => invoice.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter invoices based on search query
  const filteredInvoices = invoicesState.filter(
    (invoice) =>
      invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dueDateTime = formData.dueDate ? `${formData.dueDate} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "";
    const newInvoice = {
      id: (invoicesState.length + 1).toString(),
      invoiceId: `INV-2025-${String(invoicesState.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      amount: Number.parseFloat(formData.amount),
      status: "unpaid",
      dueDate: formatDateTime(dueDateTime),
      issueDate: formattedNow,
      paymentMethod: formData.paymentMethod,
      description: formData.description,
      plan: plans.find((p) => p.id === formData.planId)?.name || "",
      station: stations.find((s) => s.id === formData.stationId)?.name || "",
    }
    setInvoicesState((prev) => [...prev, newInvoice])
    setIsAddInvoiceDialogOpen(false)
    setFormData({
      customer: "",
      customerEmail: "",
      customerPhone: "",
      amount: "",
      dueDate: "",
      paymentMethod: "mpesa",
      description: "",
      planId: "",
      stationId: "",
    })
    toast({
      title: "Success",
      description: "Invoice created successfully!",
    })
  }

  // Handle edit invoice
  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice)
    setEditFormData({
      customer: invoice.customer,
      customerEmail: invoice.customerEmail,
      customerPhone: invoice.customerPhone,
      amount: invoice.amount.toString(),
      dueDate: invoice.dueDate,
      paymentMethod: invoice.paymentMethod.toLowerCase(),
      description: invoice.description,
      planId: plans.find((p) => p.name === invoice.plan)?.id || "",
      stationId: stations.find((s) => s.name === invoice.station)?.id || "",
    })
    setIsEditInvoiceDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pad = (n: number) => n.toString().padStart(2, "0")
    setInvoicesState((prev) =>
      prev.map((invoice) =>
        invoice.id === editingInvoice.id
          ? {
              ...invoice,
              customer: editFormData.customer,
              customerEmail: editFormData.customerEmail,
              customerPhone: editFormData.customerPhone,
              amount: Number.parseFloat(editFormData.amount),
              dueDate: formatDateTime(editFormData.dueDate ? `${editFormData.dueDate} ${pad(new Date().getHours())}:${pad(new Date().getMinutes())}:${pad(new Date().getSeconds())}` : ""),
              paymentMethod: editFormData.paymentMethod,
              description: editFormData.description,
              plan: plans.find((p) => p.id === editFormData.planId)?.name || invoice.plan,
              station: stations.find((s) => s.id === editFormData.stationId)?.name || invoice.station,
            }
          : invoice,
      ),
    )
    setIsEditInvoiceDialogOpen(false)
    setEditingInvoice(null)
    toast({
      title: "Success",
      description: "Invoice updated successfully!",
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setInvoicesState((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: invoice.status === "paid" ? "unpaid" : invoice.status === "unpaid" ? "paid" : "paid",
            }
          : invoice,
      ),
    )
    const invoice = invoicesState.find((i) => i.id === id)
    toast({
      title: "Success",
      description: `Invoice status updated successfully!`,
    })
  }

  // Handle delete single invoice
  const handleDeleteInvoice = (id: string) => {
    setDeleteInvoiceId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteInvoice = () => {
    setInvoicesState((prev) => prev.filter((invoice) => invoice.id !== deleteInvoiceId))
    setIsDeleteDialogOpen(false)
    setDeleteInvoiceId(null)
    toast({
      title: "Success",
      description: "Invoice deleted successfully!",
    })
  }

  const cancelDeleteInvoice = () => {
    setIsDeleteDialogOpen(false)
    setDeleteInvoiceId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "Error",
        description: "Please select invoices first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "mark-paid") {
      setInvoicesState((prev) =>
        prev.map((invoice) => (selectedInvoices.includes(invoice.id) ? { ...invoice, status: "paid" } : invoice)),
      )
      setSelectedInvoices([])
      toast({
        title: "Success",
        description: `${selectedInvoices.length} invoices marked as paid!`,
      })
    } else if (bulkAction === "mark-unpaid") {
      setInvoicesState((prev) =>
        prev.map((invoice) => (selectedInvoices.includes(invoice.id) ? { ...invoice, status: "unpaid" } : invoice)),
      )
      setSelectedInvoices([])
      toast({
        title: "Success",
        description: `${selectedInvoices.length} invoices marked as unpaid!`,
      })
    } else if (bulkAction === "mark-overdue") {
      setInvoicesState((prev) =>
        prev.map((invoice) => (selectedInvoices.includes(invoice.id) ? { ...invoice, status: "overdue" } : invoice)),
      )
      setSelectedInvoices([])
      toast({
        title: "Success",
        description: `${selectedInvoices.length} invoices marked as overdue!`,
      })
    } else if (bulkAction === "send-reminder") {
      setSelectedInvoices([])
      toast({
        title: "Success",
        description: `Payment reminders sent for ${selectedInvoices.length} invoices!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setInvoicesState((prev) => prev.filter((invoice) => !selectedInvoices.includes(invoice.id)))
    setSelectedInvoices([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected invoices deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Invoice ID", "Customer", "Amount", "Status", "Due Date", "Issue Date", "Plan", "Station"].join(","),
      ...filteredInvoices.map((invoice) =>
        [
          invoice.invoiceId,
          invoice.customer,
          invoice.amount,
          invoice.status,
          invoice.dueDate,
          invoice.issueDate,
          invoice.plan,
          invoice.station,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "invoice-history.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Invoice history exported successfully!",
    })
  }

  // Handle download invoice
  const handleDownloadInvoice = (invoice: any) => {
    const invoiceContent = `
Invoice: ${invoice.invoiceId}
Customer: ${invoice.customer}
Email: ${invoice.customerEmail}
Phone: ${invoice.customerPhone}
Amount: KES ${invoice.amount.toLocaleString()}
Status: ${invoice.status}
Due Date: ${invoice.dueDate}
Issue Date: ${invoice.issueDate}
Plan: ${invoice.plan}
Station: ${invoice.station}
Description: ${invoice.description}
    `

    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoice.invoiceId}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Invoice downloaded successfully!",
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
              <CardTitle className="text-brand-green">Invoice History</CardTitle>
              <CardDescription>Manage and track all customer invoices</CardDescription>
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
                  <SelectItem value="mark-paid">Mark as Paid</SelectItem>
                  <SelectItem value="mark-unpaid">Mark as Unpaid</SelectItem>
                  <SelectItem value="mark-overdue">Mark as Overdue</SelectItem>
                  <SelectItem value="send-reminder">Send Reminder</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected invoices
                    const csvContent = [
                      ["Invoice ID", "Customer", "Amount", "Status", "Due Date", "Issue Date", "Plan", "Station"].join(","),
                      ...invoicesState
                        .filter((invoice) => selectedInvoices.includes(invoice.id))
                        .map((invoice) =>
                          [
                            invoice.invoiceId,
                            invoice.customer,
                            invoice.amount,
                            invoice.status,
                            invoice.dueDate,
                            invoice.issueDate,
                            invoice.plan,
                            invoice.station,
                          ].join(","),
                        ),
                    ].join("\n")

                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "invoice-history.csv"
                    a.click()
                    URL.revokeObjectURL(url)

                    toast({
                      title: "Success",
                      description: "Selected invoice history exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedInvoices.length === 0 && bulkAction !== "send-reminder"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddInvoiceDialogOpen} onOpenChange={setIsAddInvoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <FileText className="h-4 w-4" />
                    <span>Create New Invoice</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Create New Invoice</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Generate a new invoice for a customer
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
                            required
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
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount" className="text-brand-green">
                            Amount (KES)
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate" className="text-brand-green">
                            Due Date
                          </Label>
                          <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
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
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-brand-green">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter invoice description"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddInvoiceDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Create Invoice
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
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead>Amount (KES)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice, index) => (
                  <TableRow key={invoice.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedInvoices.includes(invoice.id)}
                        onCheckedChange={() => handleCheckboxChange(invoice.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.customerEmail}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "success"
                            : invoice.status === "overdue"
                              ? "destructive"
                              : invoice.status === "unpaid"
                                ? undefined
                                : "secondary"
                        }
                        className={`capitalize ${invoice.status === "unpaid" ? "bg-blue-500 text-white hover:bg-blue-700 transition-colors" : ""}`}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{invoice.station}</TableCell>
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
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single invoice record
                              const csvContent = [
                                ["Invoice ID", "Customer", "Amount", "Status", "Due Date", "Issue Date", "Plan", "Station"].join(","),
                                [
                                  invoice.invoiceId,
                                  invoice.customer,
                                  invoice.amount,
                                  invoice.status,
                                  invoice.dueDate,
                                  invoice.issueDate,
                                  invoice.plan,
                                  invoice.station,
                                ].join(","),
                              ].join("\n")

                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = "invoice.csv"
                              a.click()
                              URL.revokeObjectURL(url)

                              toast({
                                title: "Success",
                                description: "Invoice exported successfully!",
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(invoice.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {isActive(invoice.status) ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleMarkOverdue(invoice.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            Mark as Overdue
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Invoice
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

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditInvoiceDialogOpen} onOpenChange={setIsEditInvoiceDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Invoice</DialogTitle>
            <DialogDescription className="text-white/80">Update invoice information</DialogDescription>
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
                    required
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount" className="text-brand-green">
                    Amount (KES)
                  </Label>
                  <Input
                    id="edit-amount"
                    name="amount"
                    type="number"
                    value={editFormData.amount}
                    onChange={handleEditInputChange}
                    placeholder="Enter amount"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate" className="text-brand-green">
                    Due Date
                  </Label>
                  <Input
                    id="edit-dueDate"
                    name="dueDate"
                    type="date"
                    value={editFormData.dueDate}
                    onChange={handleEditInputChange}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-brand-green">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Enter invoice description"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditInvoiceDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Invoice
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
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteInvoice}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteInvoice} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedInvoices.length} selected invoices? This action cannot be undone.`}
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
              {`Delete ${selectedInvoices.length} Invoices`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
