"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample transactions data
const initialTransactions = [
  {
    id: "1",
    transactionId: "TX-01",
    method: "M-Pesa",
    amount: "500",
    currency: "KES",
    status: "successful",
    date: "2024-08-21",
    time: "10:30:45",
    reference: "MPX123456789",
    description: "Hotspot payment",
    fees: "25",
  },
  {
    id: "2",
    transactionId: "TX-02",
    method: "Card",
    amount: "1200",
    currency: "KES",
    status: "failed",
    date: "2024-08-20",
    time: "15:22:10",
    reference: "CRD987654321",
    description: "Monthly subscription",
    fees: "60",
  },
  {
    id: "3",
    transactionId: "TX-03",
    method: "Bank",
    amount: "800",
    currency: "KES",
    status: "pending",
    date: "2024-08-19",
    time: "09:15:30",
    reference: "BNK456789123",
    description: "Data bundle purchase",
    fees: "40",
  },
  {
    id: "4",
    transactionId: "TX-04",
    method: "Airtel Money",
    amount: "350",
    currency: "KES",
    status: "successful",
    date: "2024-08-18",
    time: "14:45:20",
    reference: "ATL789123456",
    description: "Voucher purchase",
    fees: "18",
  },
]

export default function Page() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTransactionId, setEditTransactionId] = useState<string | null>(null)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    method: "M-Pesa",
    amount: "",
    currency: "KES",
    reference: "",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    method: "M-Pesa",
    amount: "",
    currency: "KES",
    reference: "",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null)
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
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((transactionId) => transactionId !== id) : [...prev, id],
    )
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map((transaction) => transaction.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      transactionId: `TX-${String(transactions.length + 1).padStart(2, "0")}`,
      method: formData.method,
      amount: formData.amount,
      currency: formData.currency,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
      reference: formData.reference,
      description: formData.description,
      fees: Math.round(Number(formData.amount) * 0.05).toString(),
    }
    setTransactions((prev) => [...prev, newTransaction])
    setIsAddTransactionDialogOpen(false)
    setFormData({
      method: "M-Pesa",
      amount: "",
      currency: "KES",
      reference: "",
      description: "",
    })
    toast({
      title: "Success",
      description: "Transaction record added successfully!",
    })
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Transaction - Pre-fill form with selected transaction data
  const handleEditClick = (transaction: any) => {
    setEditTransactionId(transaction.id)
    setEditFormData({
      method: transaction.method,
      amount: transaction.amount,
      currency: transaction.currency,
      reference: transaction.reference,
      description: transaction.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === editTransactionId
          ? {
              ...transaction,
              method: editFormData.method,
              amount: editFormData.amount,
              currency: editFormData.currency,
              reference: editFormData.reference,
              description: editFormData.description,
              fees: Math.round(Number(editFormData.amount) * 0.05).toString(),
            }
          : transaction,
      ),
    )
    setIsEditDialogOpen(false)
    setEditTransactionId(null)
    toast({
      title: "Success",
      description: "Transaction updated successfully!",
    })
  }

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((transaction) => {
        if (transaction.id === id) {
          const newStatus =
            transaction.status === "successful" ? "pending" : transaction.status === "pending" ? "failed" : "successful"
          return { ...transaction, status: newStatus }
        }
        return transaction
      }),
    )
    toast({
      title: "Success",
      description: `Transaction status updated successfully!`,
    })
  }

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    setDeleteTransactionId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTransaction = () => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== deleteTransactionId))
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

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "approve") {
      setTransactions((prev) =>
        prev.map((transaction) =>
          selectedTransactions.includes(transaction.id) ? { ...transaction, status: "successful" } : transaction,
        ),
      )
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions approved successfully!`,
      })
      setSelectedTransactions([])
      setSelectAll(false)
    } else if (bulkAction === "reject") {
      setTransactions((prev) =>
        prev.map((transaction) =>
          selectedTransactions.includes(transaction.id) ? { ...transaction, status: "failed" } : transaction,
        ),
      )
      toast({
        title: "Success",
        description: `${selectedTransactions.length} transactions rejected successfully!`,
      })
      setSelectedTransactions([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedTransactions.length
    setTransactions((prev) => prev.filter((transaction) => !selectedTransactions.includes(transaction.id)))
    setSelectedTransactions([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} transaction${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
            <div className="flex items-center gap-2">
              <CardTitle className="text-brand-green">UMS Pay - Transaction History</CardTitle>
            </div>
              <CardDescription>View and manage all UMS Pay transaction records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="approve">Approve Selected</SelectItem>
                  <SelectItem value="reject">Reject Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedTransactions.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddTransactionDialogOpen} onOpenChange={setIsAddTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Transaction</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Transaction</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Add a new transaction record to the history
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Payment Method</Label>
                          <Select
                            value={formData.method}
                            onValueChange={(value) => handleSelectChange("method", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                              <SelectItem value="Bank">Bank Transfer</SelectItem>
                              <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="amount" className="text-brand-green">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter amount"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="currency" className="text-brand-green">
                            Currency
                          </Label>
                          <Select
                            value={formData.currency}
                            onValueChange={(value) => handleSelectChange("currency", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="KES">KES</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="reference" className="text-brand-green">
                            Reference
                          </Label>
                          <Input
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter reference number"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-brand-green">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter transaction description"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddTransactionDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Add Transaction
                        </Button>
                      </DialogFooter>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="rounded-md border border-brand-green/30">
            <Table className="min-w-full text-sm border-collapse">
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px] border-0">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="border-0">Transaction ID</TableHead>
                  <TableHead className="border-0">Method</TableHead>
                  <TableHead className="border-0">Amount</TableHead>
                  <TableHead className="border-0">Reference</TableHead>
                  <TableHead className="border-0">Description</TableHead>
                  <TableHead className="border-0">Date</TableHead>
                  <TableHead className="border-0">Time</TableHead>
                  <TableHead className="border-0">Fees</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={() => handleCheckboxChange(transaction.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{transaction.transactionId}</TableCell>
                    <TableCell className="border-0">{transaction.method}</TableCell>
                    <TableCell className="border-0">
                      {transaction.currency} {transaction.amount}
                    </TableCell>
                    <TableCell className="border-0">{transaction.reference}</TableCell>
                    <TableCell className="border-0">{transaction.description}</TableCell>
                    <TableCell className="border-0">{transaction.date}</TableCell>
                    <TableCell className="border-0">{transaction.time}</TableCell>
                    <TableCell className="border-0">
                      {transaction.currency} {transaction.fees}
                    </TableCell>
                    <TableCell className="border-0">
                      {transaction.status === "successful" ? (
                        <Badge variant="success">Successful</Badge>
                      ) : transaction.status === "pending" ? (
                        <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Pending</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700">Failed</Badge>
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
                            onClick={() => handleEditClick(transaction)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Transaction
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(transaction.id)}
                          >
                            {transaction.status === "pending" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Failed
                              </>
                            ) : transaction.status === "successful" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Pending
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Successful
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteTransaction(transaction.id)}
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

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Transaction</DialogTitle>
            <DialogDescription className="text-white/80">Edit transaction details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Payment Method</Label>
                  <Select
                    value={editFormData.method}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-amount" className="text-brand-green">
                    Amount
                  </Label>
                  <Input
                    id="edit-amount"
                    name="amount"
                    type="number"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-currency" className="text-brand-green">
                    Currency
                  </Label>
                  <Select
                    value={editFormData.currency}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-reference" className="text-brand-green">
                    Reference
                  </Label>
                  <Input
                    id="edit-reference"
                    name="reference"
                    value={editFormData.reference}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, reference: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-brand-green">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-brand-darkgray text-white placeholder:text-white/70"
                  required
                />
              </div>
            </div>
            <div className="mt-6" />
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
            <Button
              onClick={confirmDeleteTransaction}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:text-white"
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
              {`Are you sure you want to delete ${selectedTransactions.length} selected transaction${selectedTransactions.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedTransactions.length} Transaction${selectedTransactions.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
