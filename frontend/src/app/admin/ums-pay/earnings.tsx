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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample earnings data
const initialEarnings = [
  {
    id: "1",
    period: "2025-08-01 00:00:00",
    earnings: 4500,
    transactions: 45,
    commission: 225,
    status: "confirmed",
    payoutStatus: "pending",
  },
  {
    id: "2",
    period: "2025-08-02 00:00:00",
    earnings: 5200,
    transactions: 52,
    commission: 260,
    status: "confirmed",
    payoutStatus: "completed",
  },
  {
    id: "3",
    period: "2025-08-03 00:00:00",
    earnings: 6100,
    transactions: 61,
    commission: 305,
    status: "confirmed",
    payoutStatus: "pending",
  },
  {
    id: "4",
    period: "2025-08-04 00:00:00",
    earnings: 4800,
    transactions: 48,
    commission: 240,
    status: "pending",
    payoutStatus: "pending",
  },
  {
    id: "5",
    period: "2025-08-05 00:00:00",
    earnings: 7000,
    transactions: 70,
    commission: 350,
    status: "confirmed",
    payoutStatus: "pending",
  },
]

export default function Page() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [earnings, setEarnings] = useState(initialEarnings)
  const [isAddEarningDialogOpen, setIsAddEarningDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editEarningId, setEditEarningId] = useState<string | null>(null)
  const [selectedEarnings, setSelectedEarnings] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [formData, setFormData] = useState({
    period: "",
    earnings: "",
    transactions: "",
    commission: "",
  })
  const [editFormData, setEditFormData] = useState({
    period: "",
    earnings: "",
    transactions: "",
    commission: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteEarningId, setDeleteEarningId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedEarnings((prev) => (prev.includes(id) ? prev.filter((earningId) => earningId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedEarnings([])
    } else {
      setSelectedEarnings(earnings.map((earning) => earning.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Format date to YYYY-MM-DD HH:MM:SS
  // Use selected date for YYYY-MM-DD, but use current time for HH:MM:SS
  const selectedDate = formData.period ? new Date(formData.period) : new Date()
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formattedPeriod = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const newEarning = {
      id: (earnings.length + 1).toString(),
      period: formattedPeriod,
      earnings: Number(formData.earnings),
      transactions: Number(formData.transactions),
      commission: Number(formData.commission),
      status: "pending",
      payoutStatus: "pending",
    }
    setEarnings((prev) => [...prev, newEarning])
    setIsAddEarningDialogOpen(false)
    setFormData({
      period: "",
      earnings: "",
      transactions: "",
      commission: "",
    })
    toast({
      title: "Success",
      description: "Earning record added successfully!",
    })
  }

  // Filter earnings based on search query
  const filteredEarnings = earnings.filter(
    (earning) =>
      earning.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      earning.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      earning.payoutStatus.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Earning - Pre-fill form with selected earning data
  const handleEditClick = (earning: any) => {
    setEditEarningId(earning.id)
    setEditFormData({
      period: earning.period,
      earnings: earning.earnings.toString(),
      transactions: earning.transactions.toString(),
      commission: earning.commission.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  const selectedDate = editFormData.period ? new Date(editFormData.period) : new Date()
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formattedPeriod = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth()+1)}-${pad(selectedDate.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    setEarnings((prev) =>
      prev.map((earning) =>
        earning.id === editEarningId
          ? {
              ...earning,
              period: formattedPeriod,
              earnings: Number(editFormData.earnings),
              transactions: Number(editFormData.transactions),
              commission: Number(editFormData.commission),
            }
          : earning,
      ),
    )
    setIsEditDialogOpen(false)
    setEditEarningId(null)
    toast({
      title: "Success",
      description: "Earning record updated successfully!",
    })
  }

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setEarnings((prev) =>
      prev.map((earning) =>
        earning.id === id ? { ...earning, status: earning.status === "confirmed" ? "pending" : "confirmed" } : earning,
      ),
    )
    const earning = earnings.find((e) => e.id === id)
    toast({
      title: "Success",
      description: `Earning ${earning?.status === "confirmed" ? "marked as pending" : "confirmed"} successfully!`,
    })
  }

  // Delete Earning
  const handleDeleteEarning = (id: string) => {
    setDeleteEarningId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEarning = () => {
    setEarnings((prev) => prev.filter((earning) => earning.id !== deleteEarningId))
    setIsDeleteDialogOpen(false)
    setDeleteEarningId(null)
    toast({
      title: "Success",
      description: "Earning record deleted successfully!",
    })
  }

  const cancelDeleteEarning = () => {
    setIsDeleteDialogOpen(false)
    setDeleteEarningId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "confirm") {
      setEarnings((prev) =>
        prev.map((earning) => (selectedEarnings.includes(earning.id) ? { ...earning, status: "confirmed" } : earning)),
      )
      toast({
        title: "Success",
        description: `${selectedEarnings.length} earnings confirmed successfully!`,
      })
      setSelectedEarnings([])
      setSelectAll(false)
    } else if (bulkAction === "pending") {
      setEarnings((prev) =>
        prev.map((earning) => (selectedEarnings.includes(earning.id) ? { ...earning, status: "pending" } : earning)),
      )
      toast({
        title: "Success",
        description: `${selectedEarnings.length} earnings marked as pending successfully!`,
      })
      setSelectedEarnings([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedEarnings.length
    setEarnings((prev) => prev.filter((earning) => !selectedEarnings.includes(earning.id)))
    setSelectedEarnings([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} earning record${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green">UMS Pay - Earnings Summary</CardTitle>
            </div>
              <CardDescription>Track and manage your earnings from UMS Pay transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <Dialog open={isAddEarningDialogOpen} onOpenChange={setIsAddEarningDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen mb-4 ml-auto">
                  <Plus className="h-4 w-4" />
                  <span>Add Earning</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-brand-green/30 shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-brand-green">Add New Earning Record</DialogTitle>
                  <DialogDescription className="text-white/80">
                    Add a new earning record to track your UMS Pay earnings
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-brand-green">Period (Date)</Label>
                        <Input
                          id="period"
                          name="period"
                          type="date"
                          value={formData.period}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="earnings" className="text-brand-green">
                          Earnings (KES)
                        </Label>
                        <Input
                          id="earnings"
                          name="earnings"
                          type="number"
                          value={formData.earnings}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter earnings amount"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="transactions" className="text-brand-green">
                          Transactions Count
                        </Label>
                        <Input
                          id="transactions"
                          name="transactions"
                          type="number"
                          value={formData.transactions}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter transaction count"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="commission" className="text-brand-green">
                          Commission (KES)
                        </Label>
                        <Input
                          id="commission"
                          name="commission"
                          type="number"
                          value={formData.commission}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter commission amount"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddEarningDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-brand-green text-brand-black hover:bg-brand-neongreen"
                      >
                        Add Earning
                      </Button>
                    </DialogFooter>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          <div className="flex flex-wrap gap-2 items-center mb-4 justify-between">
            <div className="flex gap-2 items-center">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="confirm">Confirm Selected</SelectItem>
                  <SelectItem value="pending">Mark as Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedEarnings.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search earnings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
                <Button variant="outline" onClick={() => setShowGraph((s) => !s)}>
                  {showGraph ? "Hide Graph" : "Show Graph"}
                </Button>
            </div>
          </div>

          {showGraph && (
            <div className="mb-6">
              <ChartContainer
                className="h-[320px] w-full"
                config={{
                  earnings: { label: "Earnings (KES)", color: "hsl(var(--chart-4))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" label={{ value: "Date", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Earnings (KES)", angle: -90, position: "insideLeft" }} />
                    <Legend verticalAlign="top" height={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="var(--color-earnings)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-sm"
                    style={{ backgroundColor: "var(--color-earnings)" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border border-brand-green/30 mb-6">
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
                  <TableHead className="border-0">Date</TableHead>
                  <TableHead className="border-0">Earnings (KES)</TableHead>
                  <TableHead className="border-0">Transactions</TableHead>
                  <TableHead className="border-0">Commission</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="border-0">Payout Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEarnings.map((earning) => (
                  <TableRow key={earning.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedEarnings.includes(earning.id)}
                        onCheckedChange={() => handleCheckboxChange(earning.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{earning.period}</TableCell>
                    <TableCell className="border-0">{earning.earnings.toLocaleString()}</TableCell>
                    <TableCell className="border-0">{earning.transactions}</TableCell>
                    <TableCell className="border-0">{earning.commission}</TableCell>
                    <TableCell className="border-0">
                      {earning.status === "confirmed" ? (
                        <Badge variant="success">Confirmed</Badge>
                      ) : (
                        <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="border-0">
                      {earning.payoutStatus === "completed" ? (
                        <Badge variant="success">Completed</Badge>
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
                            onClick={() => handleEditClick(earning)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Earning
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(earning.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {earning.status === "confirmed" ? "Mark Pending" : "Confirm"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteEarning(earning.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Earning
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

      {/* Edit Earning Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Earning Record</DialogTitle>
            <DialogDescription className="text-white/80">Edit earning details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Period (Date)</Label>
                  <Input
                    id="edit-period"
                    name="period"
                    type="date"
                    value={editFormData.period}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, period: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-earnings" className="text-brand-green">
                    Earnings (KES)
                  </Label>
                  <Input
                    id="edit-earnings"
                    name="earnings"
                    type="number"
                    value={editFormData.earnings}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, earnings: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-transactions" className="text-brand-green">
                    Transactions Count
                  </Label>
                  <Input
                    id="edit-transactions"
                    name="transactions"
                    type="number"
                    value={editFormData.transactions}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, transactions: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-commission" className="text-brand-green">
                    Commission (KES)
                  </Label>
                  <Input
                    id="edit-commission"
                    name="commission"
                    type="number"
                    value={editFormData.commission}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, commission: e.target.value }))}
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
              Are you sure you want to delete this earning record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteEarning}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteEarning}
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
              {`Are you sure you want to delete ${selectedEarnings.length} selected earning record${selectedEarnings.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedEarnings.length} Record${selectedEarnings.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
