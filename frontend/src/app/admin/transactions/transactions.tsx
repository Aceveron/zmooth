"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Trash, RefreshCw, Search, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample Transactions data
const initialTransactions = [
  {
    id: "T-240810-0001",
    userId: "c-1001",
    userRef: "+254700111222",
    clientName: "John Doe",
    amount: 500,
    method: "M-Pesa",
    status: "successful",
    processed: true,
    startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    endTime: new Date().toISOString(),
    reference: "MPX123456789",
    description: "Internet package payment",
    plan: "Basic Plan",
    station: "Station A",
  },
  {
    id: "T-240810-0002",
    userId: "c-1002",
    userRef: "brian@example.com",
    clientName: "Brian Smith",
    amount: 1000,
    method: "Card",
    status: "failed",
    processed: false,
    startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    reference: "CARD987654321",
    description: "Premium package payment",
    plan: "Premium Plan",
    station: "Station B",
  },
  {
    id: "T-240810-0003",
    userId: "c-1003",
    userRef: "+254733999000",
    clientName: "Alice Johnson",
    amount: 2000,
    method: "Voucher",
    status: "reversed",
    processed: true,
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    reference: "VCH456789123",
    description: "Enterprise package payment",
    plan: "Enterprise Plan",
    station: "Station A",
  },
  {
    id: "T-240810-0004",
    userId: "c-1001",
    userRef: "+254700111222",
    clientName: "John Doe",
    amount: 750,
    method: "M-Pesa",
    status: "pending",
    processed: false,
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    reference: "MPX789123456",
    description: "Data bundle payment",
    plan: "Data Bundle",
    station: "Station C",
  },
]

function AdminTransactions() {
  const navigate = useNavigate()
  const [transactionsState, setTransactionsState] = useState(initialTransactions)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedTransactions((prev) => (prev.includes(id) ? prev.filter((txnId) => txnId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactionsState.map((txn) => txn.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter transactions based on search query
  const filteredTransactions = transactionsState.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setTransactionsState((prev) =>
      prev.map((txn) =>
        txn.id === id
          ? {
              ...txn,
              status: txn.status === "successful" ? "failed" : txn.status === "failed" ? "pending" : "successful",
            }
          : txn,
      ),
    )
    toast({
      title: "Success",
      description: "Transaction status updated successfully!",
    })
  }

  // Handle process toggle
  const handleToggleProcess = (id: string) => {
    setTransactionsState((prev) => prev.map((txn) => (txn.id === id ? { ...txn, processed: !txn.processed } : txn)))
    const transaction = transactionsState.find((t) => t.id === id)
    toast({
      title: "Success",
      description: `Transaction ${transaction?.processed ? "unprocessed" : "processed"} successfully!`,
    })
  }

  // Handle delete single transaction
  const handleDeleteTransaction = (id: string) => {
    setDeleteTransactionId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTransaction = () => {
    setTransactionsState((prev) => prev.filter((txn) => txn.id !== deleteTransactionId))
    setIsDeleteDialogOpen(false)
    setDeleteTransactionId(null)
    toast({
      title: "Success",
      description: "Transaction deleted successfully!",
    })
  }

  const cancelDeleteTransaction = () => {
    setIsDeleteDialogOpen(false)
    setDeleteTransactionId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (bulkAction === "export") {
      handleExport();
      setBulkAction("");
      return;
    }
    if (selectedTransactions.length === 0) {
      toast({
        title: "Error",
        description: "Please select transactions first",
        variant: "destructive",
      });
      return;
    }
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true);
    } else if (bulkAction === "process") {
      setTransactionsState((prev) =>
        prev.map((txn) => (selectedTransactions.includes(txn.id) ? { ...txn, processed: true } : txn)),
      )
      setSelectedTransactions([])
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions processed successfully!`,
      })
    } else if (bulkAction === "unprocess") {
      setTransactionsState((prev) =>
        prev.map((txn) => (selectedTransactions.includes(txn.id) ? { ...txn, processed: false } : txn)),
      )
      setSelectedTransactions([])
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions unprocessed successfully!`,
      })
    } else if (bulkAction === "approve") {
      setTransactionsState((prev) =>
        prev.map((txn) => (selectedTransactions.includes(txn.id) ? { ...txn, status: "successful" } : txn)),
      )
      setSelectedTransactions([])
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions approved successfully!`,
      })
    } else if (bulkAction === "reject") {
      setTransactionsState((prev) =>
        prev.map((txn) => (selectedTransactions.includes(txn.id) ? { ...txn, status: "failed" } : txn)),
      )
      setSelectedTransactions([])
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions rejected successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setTransactionsState((prev) => prev.filter((txn) => !selectedTransactions.includes(txn.id)))
    setSelectedTransactions([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected transactions deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Transaction ID",
        "Client",
        "User Ref",
        "Amount",
        "Method",
        "Status",
        "Processed",
        "Reference",
        "Plan",
        "Station",
      ].join(","),
      ...filteredTransactions.map((txn) =>
        [
          txn.id,
          txn.clientName,
          txn.userRef,
          txn.amount,
          txn.method,
          txn.status,
          txn.processed ? "Yes" : "No",
          txn.reference,
          txn.plan,
          txn.station,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Transactions exported successfully!",
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
      case "pending":
        return "bg-amber-500/15 text-amber-300 border border-amber-500/30"
      case "failed":
        return "bg-red-500/15 text-red-300 border border-red-500/30"
      case "reversed":
        return "bg-sky-500/15 text-sky-300 border border-sky-500/30"
      default:
        return "bg-gray-500/15 text-gray-300 border border-gray-500/30"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Transactions</CardTitle>
              <CardDescription>Manage payment transactions and financial records</CardDescription>
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
                  <SelectItem value="process">Process Selected</SelectItem>
                  <SelectItem value="unprocess">Unprocess Selected</SelectItem>
                  <SelectItem value="approve">Approve Selected</SelectItem>
                  <SelectItem value="reject">Reject Selected</SelectItem>
                  <SelectItem value="export">Export Transactions</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedTransactions.length === 0 && bulkAction !== "export"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative -w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
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
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>User Ref</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn, index) => (
                  <TableRow key={txn.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(txn.id)}
                        onCheckedChange={() => handleCheckboxChange(txn.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.clientName}</TableCell>
                    <TableCell>{txn.userRef}</TableCell>
                    <TableCell>KES {txn.amount.toLocaleString()}</TableCell>
                    <TableCell>{txn.method}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${statusColor(txn.status)}`}
                      >
                        {txn.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {txn.processed ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{txn.reference}</TableCell>
                    <TableCell>{txn.plan}</TableCell>
                    <TableCell>{txn.station}</TableCell>
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
                            onClick={() => handleToggleProcess(txn.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {txn.processed ? "Unprocess" : "Process"} Transaction
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(txn.id)}
                          >
                            {txn.status === "successful" ? (
                              <XCircle className="h-4 w-4 mr-2 text-white" />
                            ) : txn.status === "failed" ? (
                              <Clock className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2 text-white" />
                            )}
                            Change Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={handleExport}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteTransaction(txn.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Transaction
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass border-red-600/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteTransaction}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteTransaction} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedTransactions.length} selected transactions? This action cannot be undone.`}
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
              {`Delete ${selectedTransactions.length} Transactions`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTransactions