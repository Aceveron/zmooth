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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Utility function for formatting date/time
function formatDateTime(date: Date) {
  const pad
 = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Sample payouts data
const initialPayouts = [
  {
    id: "1",
    requestId: "PO-2024-001",
    amount: "5000",
    currency: "KES",
    requestDate: "2024-08-15 00:00:00",
    status: "completed",
    method: "M-Pesa",
    accountNumber: "254712345678",
    processedDate: "2024-08-16 00:00:00",
    fees: "50",
  },
  {
    id: "2",
    requestId: "PO-2024-002",
    amount: "3500",
    currency: "KES",
    requestDate: "2024-08-18 00:00:00",
    status: "pending",
    method: "Bank Transfer",
    accountNumber: "1234567890",
    processedDate: "",
    fees: "100",
  },
  {
    id: "3",
    requestId: "PO-2024-003",
    amount: "7500",
    currency: "KES",
    requestDate: "2024-08-20 00:00:00",
    status: "processing",
    method: "M-Pesa",
    accountNumber: "254798765432",
    processedDate: "",
    fees: "75",
  },
]

export default function Page() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [payouts, setPayouts] = useState(initialPayouts)
  const [isAddPayoutDialogOpen, setIsAddPayoutDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editPayoutId, setEditPayoutId] = useState<string | null>(null)
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    method: "M-Pesa",
    accountNumber: "",
    currency: "KES",
  })
  const [editFormData, setEditFormData] = useState({
    amount: "",
    method: "M-Pesa",
    accountNumber: "",
    currency: "KES",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePayoutId, setDeletePayoutId] = useState<string | null>(null)
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
    setSelectedPayouts((prev) => (prev.includes(id) ? prev.filter((payoutId) => payoutId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedPayouts([])
    } else {
      setSelectedPayouts(payouts.map((payout) => payout.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPayout = {
      id: (payouts.length + 1).toString(),
      requestId: `PO-2024-${String(payouts.length + 1).padStart(3, "0")}`,
      amount: formData.amount,
      currency: formData.currency,
      requestDate: formatDateTime(new Date()),
      status: "pending",
      method: formData.method,
      accountNumber: formData.accountNumber,
      processedDate: "",
      fees: formData.method === "M-Pesa" ? "50" : "100",
    }
    setPayouts((prev) => [...prev, newPayout])
    setIsAddPayoutDialogOpen(false)
    setFormData({
      amount: "",
      method: "M-Pesa",
      accountNumber: "",
      currency: "KES",
    })
    toast({
      title: "Success",
      description: `Payout requested: KES ${formData.amount}`,
    })
  }

  // Filter payouts based on search query
  const filteredPayouts = payouts.filter(
    (payout) =>
      payout.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Payout - Pre-fill form with selected payout data
  const handleEditClick = (payout: any) => {
    setEditPayoutId(payout.id)
    setEditFormData({
      amount: payout.amount,
      method: payout.method,
      accountNumber: payout.accountNumber,
      currency: payout.currency,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPayouts((prev) =>
      prev.map((payout) =>
        payout.id === editPayoutId
          ? {
              ...payout,
              amount: editFormData.amount,
              method: editFormData.method,
              accountNumber: editFormData.accountNumber,
              currency: editFormData.currency,
              fees: editFormData.method === "M-Pesa" ? "50" : "100",
            }
          : payout,
      ),
    )
    setIsEditDialogOpen(false)
    setEditPayoutId(null)
    toast({
      title: "Success",
      description: "Payout request updated successfully!",
    })
  }

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setPayouts((prev) =>
      prev.map((payout) => {
        if (payout.id === id) {
          const newStatus =
            payout.status === "completed" ? "pending" : payout.status === "pending" ? "processing" : "completed"
          return {
            ...payout,
            status: newStatus,
            processedDate: newStatus === "completed" ? formatDateTime(new Date()) : "",
          }
        }
        return payout
      }),
    )
    toast({
      title: "Success",
      description: `Payout status updated successfully!`,
    })
  }

  // Delete Payout
  const handleDeletePayout = (id: string) => {
    setDeletePayoutId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePayout = () => {
    setPayouts((prev) => prev.filter((payout) => payout.id !== deletePayoutId))
    setIsDeleteDialogOpen(false)
    setDeletePayoutId(null)
    toast({
      title: "Success",
      description: "Payout request deleted successfully!",
    })
  }

  const cancelDeletePayout = () => {
    setIsDeleteDialogOpen(false)
    setDeletePayoutId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "approve") {
      setPayouts((prev) =>
        prev.map((payout) => (selectedPayouts.includes(payout.id) ? { ...payout, status: "processing" } : payout)),
      )
      toast({
        title: "Success",
        description: `${selectedPayouts.length} payout requests approved successfully!`,
      })
      setSelectedPayouts([])
      setSelectAll(false)
    } else if (bulkAction === "complete") {
      setPayouts((prev) =>
        prev.map((payout) =>
          selectedPayouts.includes(payout.id)
            ? { ...payout, status: "completed", processedDate: formatDateTime(new Date()) }
            : payout,
        ),
      )
      toast({
        title: "Success",
        description: `${selectedPayouts.length} payout requests completed successfully!`,
      })
      setSelectedPayouts([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedPayouts.length
    setPayouts((prev) => prev.filter((payout) => !selectedPayouts.includes(payout.id)))
    setSelectedPayouts([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} payout request${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green">UMS Pay - Payouts</CardTitle>
            </div>
            <CardDescription>Request and manage your UMS Pay payouts</CardDescription>
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
                  <SelectItem value="complete">Complete Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedPayouts.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddPayoutDialogOpen} onOpenChange={setIsAddPayoutDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Request Payout</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Request New Payout</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Request a payout from your UMS Pay earnings
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Amount</Label>
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
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="method" className="text-brand-green">
                            Payout Method
                          </Label>
                          <Select
                            value={formData.method}
                            onValueChange={(value) => handleSelectChange("method", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="accountNumber" className="text-brand-green">
                            Account Number
                          </Label>
                          <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter account number"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddPayoutDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Request Payout
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
                  <TableHead className="border-0">Request ID</TableHead>
                  <TableHead className="border-0">Amount</TableHead>
                  <TableHead className="border-0">Method</TableHead>
                  <TableHead className="border-0">Account</TableHead>
                  <TableHead className="border-0">Request Date</TableHead>
                  <TableHead className="border-0">Processed Date</TableHead>
                  <TableHead className="border-0">Fees</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedPayouts.includes(payout.id)}
                        onCheckedChange={() => handleCheckboxChange(payout.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{payout.requestId}</TableCell>
                    <TableCell className="border-0">
                      {payout.currency} {payout.amount}
                    </TableCell>
                    <TableCell className="border-0">{payout.method}</TableCell>
                    <TableCell className="border-0">{payout.accountNumber}</TableCell>
                    <TableCell className="border-0">{payout.requestDate}</TableCell>
                    <TableCell className="border-0">{payout.processedDate || "-"}</TableCell>
                    <TableCell className="border-0">
                      {payout.currency} {payout.fees}
                    </TableCell>
                    <TableCell className="border-0">
                      {payout.status === "completed" ? (
                        <Badge variant="success">Completed</Badge>
                      ) : payout.status === "processing" ? (
                        <Badge className="bg-blue-600 text-white hover:bg-blue-700">Processing</Badge>
                      ) : (
                        <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Pending</Badge>
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
                            onClick={() => handleEditClick(payout)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Payout
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(payout.id)}
                          >
                            {payout.status === "completed" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Pending
                              </>
                            ) : payout.status === "pending" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Processing
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Mark as Completed
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeletePayout(payout.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Payout
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

      {/* Edit Payout Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Payout Request</DialogTitle>
            <DialogDescription className="text-white/80">Edit payout request details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Amount</Label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-method" className="text-brand-green">
                    Payout Method
                  </Label>
                  <Select
                    value={editFormData.method}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-accountNumber" className="text-brand-green">
                    Account Number
                  </Label>
                  <Input
                    id="edit-accountNumber"
                    name="accountNumber"
                    value={editFormData.accountNumber}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
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
              Are you sure you want to delete this payout request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeletePayout}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeletePayout}
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
              {`Are you sure you want to delete ${selectedPayouts.length} selected payout request${selectedPayouts.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedPayouts.length} Request${selectedPayouts.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}