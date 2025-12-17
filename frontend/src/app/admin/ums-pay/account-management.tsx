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
// Sample accounts data
const initialAccounts = [
  {
    id: "1",
    accountId: "UMS-ACC-1",
    accountName: "Zmooth Wifi Main",
    status: "linked",
    owner: "Zmooth Wifi",
    balance: "15000",
    currency: "KES",
  dateLinked: "2024-01-15 00:00:00",
    active: true,
  },
  {
    id: "2",
    accountId: "UMS-ACC-2045",
    accountName: "Branch Account",
    status: "pending",
    owner: "Branch Office",
    balance: "8500",
    currency: "KES",
  dateLinked: "2024-02-10 00:00:00",
    active: false,
  },
  {
    id: "3",
    accountId: "UMS-ACC-3078",
    accountName: "Secondary Account",
    status: "unlinked",
    owner: "Secondary Branch",
    balance: "0",
    currency: "KES",
  dateLinked: "",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState(initialAccounts)
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editAccountId, setEditAccountId] = useState<string | null>(null)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    accountId: "",
    accountName: "",
    owner: "",
    currency: "KES",
  })
  const [editFormData, setEditFormData] = useState({
    accountId: "",
    accountName: "",
    owner: "",
    currency: "KES",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null)
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
    setSelectedAccounts((prev) => (prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedAccounts([])
    } else {
      setSelectedAccounts(accounts.map((account) => account.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAccount = {
      id: (accounts.length + 1).toString(),
      accountId: formData.accountId,
      accountName: formData.accountName,
      status: "pending",
      owner: formData.owner,
      balance: "0",
      currency: formData.currency,
      dateLinked: formatDateTime(new Date()),
      active: false,
    }
    setAccounts((prev) => [...prev, newAccount])
    setIsAddAccountDialogOpen(false)
    setFormData({
      accountId: "",
      accountName: "",
      owner: "",
      currency: "KES",
    })
    toast({
      title: "Success",
      description: "Account linked successfully!",
    })
  }

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Account - Pre-fill form with selected account data
  const handleEditClick = (account: any) => {
    setEditAccountId(account.id)
    setEditFormData({
      accountId: account.accountId,
      accountName: account.accountName,
      owner: account.owner,
      currency: account.currency,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === editAccountId
          ? {
              ...account,
              accountId: editFormData.accountId,
              accountName: editFormData.accountName,
              owner: editFormData.owner,
              currency: editFormData.currency,
            }
          : account,
      ),
    )
    setIsEditDialogOpen(false)
    setEditAccountId(null)
    toast({
      title: "Success",
      description: "Account updated successfully!",
    })
  }

  // Toggle Account Status
  const handleToggleActive = (id: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? { ...account, active: !account.active, status: account.active ? "unlinked" : "linked" }
          : account,
      ),
    )
    const account = accounts.find((a) => a.id === id)
    toast({
      title: "Success",
      description: `Account ${account?.active ? "unlinked" : "linked"} successfully!`,
    })
  }

  // Delete Account
  const handleDeleteAccount = (id: string) => {
    setDeleteAccountId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    setAccounts((prev) => prev.filter((account) => account.id !== deleteAccountId))
    setIsDeleteDialogOpen(false)
    setDeleteAccountId(null)
    toast({
      title: "Success",
      description: "Account deleted successfully!",
    })
  }

  const cancelDeleteAccount = () => {
    setIsDeleteDialogOpen(false)
    setDeleteAccountId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "link") {
      setAccounts((prev) =>
        prev.map((account) =>
          selectedAccounts.includes(account.id) ? { ...account, active: true, status: "linked" } : account,
        ),
      )
      toast({
        title: "Success",
        description: `${selectedAccounts.length} accounts linked successfully!`,
      })
      setSelectedAccounts([])
      setSelectAll(false)
    } else if (bulkAction === "unlink") {
      setAccounts((prev) =>
        prev.map((account) =>
          selectedAccounts.includes(account.id) ? { ...account, active: false, status: "unlinked" } : account,
        ),
      )
      toast({
        title: "Success",
        description: `${selectedAccounts.length} accounts unlinked successfully!`,
      })
      setSelectedAccounts([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedAccounts.length
    setAccounts((prev) => prev.filter((account) => !selectedAccounts.includes(account.id)))
    setSelectedAccounts([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} account${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
                <CardTitle className="text-brand-green">UMS Pay - Account Management</CardTitle>
              </div>
                <CardDescription>Link and manage UMS Pay accounts</CardDescription>
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
                  <SelectItem value="link">Link Selected</SelectItem>
                  <SelectItem value="unlink">Unlink Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedAccounts.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Link Account</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Link UMS Pay Account</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Link a new UMS Pay account to your system
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Account ID</Label>
                          <Input
                            id="accountId"
                            name="accountId"
                            value={formData.accountId}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="UMS-ACC-XXXX"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountName" className="text-brand-green">
                            Account Name
                          </Label>
                          <Input
                            id="accountName"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter account name"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="owner" className="text-brand-green">
                            Owner
                          </Label>
                          <Input
                            id="owner"
                            name="owner"
                            value={formData.owner}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter owner name"
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
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddAccountDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Link Account
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
                  <TableHead className="border-0">Account ID</TableHead>
                  <TableHead className="border-0">Account Name</TableHead>
                  <TableHead className="border-0">Owner</TableHead>
                  <TableHead className="border-0">Balance</TableHead>
                  <TableHead className="border-0">Currency</TableHead>
                  <TableHead className="border-0">Date Linked</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={() => handleCheckboxChange(account.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{account.accountId}</TableCell>
                    <TableCell className="border-0">{account.accountName}</TableCell>
                    <TableCell className="border-0">{account.owner}</TableCell>
                    <TableCell className="border-0">
                      {account.currency} {account.balance}
                    </TableCell>
                    <TableCell className="border-0">{account.currency}</TableCell>
                    <TableCell className="border-0">{account.dateLinked || "-"}</TableCell>
                    <TableCell className="border-0">
                      {account.status === "linked" ? (
                        <Badge variant="success">Linked</Badge>
                      ) : account.status === "pending" ? (
                        <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Pending</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700">Unlinked</Badge>
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
                            onClick={() => handleEditClick(account)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(account.id)}
                          >
                            {account.active ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Unlink
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Link
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteAccount(account.id)}
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

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit UMS Pay Account</DialogTitle>
            <DialogDescription className="text-white/80">Edit account details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Account ID</Label>
                  <Input
                    id="edit-accountId"
                    name="accountId"
                    value={editFormData.accountId}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, accountId: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-accountName" className="text-brand-green">
                    Account Name
                  </Label>
                  <Input
                    id="edit-accountName"
                    name="accountName"
                    value={editFormData.accountName}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, accountName: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-owner" className="text-brand-green">
                    Owner
                  </Label>
                  <Input
                    id="edit-owner"
                    name="owner"
                    value={editFormData.owner}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, owner: e.target.value }))}
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
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteAccount}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAccount}
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
              {`Are you sure you want to delete ${selectedAccounts.length} selected account${selectedAccounts.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedAccounts.length} Account${selectedAccounts.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Utility function for formatting date/time
function formatDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}