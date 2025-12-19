"use client"
import { useState } from "react"
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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, Ticket } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { useNavigate } from 'react-router-dom'

// Sample Voucher Statistics data
const initialVoucherStats = [
  {
    id: "1",
    type: "30-min",
    sold: 120,
    revenue: 600,
    redeemed: 115,
    expired: 3,
    active: 2,
    price: 5,
    redemptionRate: "95.8%",
    status: "active",
  },
  {
    id: "2",
    type: "Daily",
    sold: 80,
    revenue: 2400,
    redeemed: 75,
    expired: 2,
    active: 3,
    price: 30,
    redemptionRate: "93.8%",
    status: "active",
  },
  {
    id: "3",
    type: "Weekly",
    sold: 35,
    revenue: 8750,
    redeemed: 32,
    expired: 1,
    active: 2,
    price: 250,
    redemptionRate: "91.4%",
    status: "active",
  },
  {
    id: "4",
    type: "Monthly",
    sold: 18,
    revenue: 9000,
    redeemed: 16,
    expired: 0,
    active: 2,
    price: 500,
    redemptionRate: "88.9%",
    status: "active",
  },
  {
    id: "5",
    type: "1-Hour",
    sold: 95,
    revenue: 950,
    redeemed: 88,
    expired: 5,
    active: 2,
    price: 10,
    redemptionRate: "92.6%",
    status: "discontinued",
  },
]

export default function VoucherStatsPage() {
  const navigate = useNavigate()
  const [voucherStatsState, setVoucherStatsState] = useState(initialVoucherStats)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteVoucherId, setDeleteVoucherId] = useState<string | null>(null)
  const [showGraph, setShowGraph] = useState(false)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedVouchers((prev) => (prev.includes(id) ? prev.filter((voucherId) => voucherId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedVouchers([])
    } else {
      setSelectedVouchers(voucherStatsState.map((voucher) => voucher.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter vouchers based on search query
  const filteredVouchers = voucherStatsState.filter(
    (voucher) =>
      voucher.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.redemptionRate.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single voucher
  const handleDeleteVoucher = (id: string) => {
    setDeleteVoucherId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteVoucher = () => {
    setVoucherStatsState((prev) => prev.filter((voucher) => voucher.id !== deleteVoucherId))
    setIsDeleteDialogOpen(false)
    setDeleteVoucherId(null)
    toast({
      title: "Success",
      description: "Voucher statistics deleted successfully!",
    })
  }

  const cancelDeleteVoucher = () => {
    setIsDeleteDialogOpen(false)
    setDeleteVoucherId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedVouchers.length === 0) {
      toast({
        title: "Error",
        description: "Please select voucher records first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "refresh") {
      setSelectedVouchers([])
      toast({
        title: "Success",
        description: `${selectedVouchers.length} voucher records refreshed successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setVoucherStatsState((prev) => prev.filter((voucher) => !selectedVouchers.includes(voucher.id)))
    setSelectedVouchers([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected voucher records deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Voucher Type",
        "Sold",
        "Revenue (KES)",
        "Redeemed",
        "Expired",
        "Active",
        "Price",
        "Redemption Rate",
        "Status",
      ].join(","),
      ...filteredVouchers.map((voucher) =>
        [
          voucher.type,
          voucher.sold,
          voucher.revenue,
          voucher.redeemed,
          voucher.expired,
          voucher.active,
          voucher.price,
          voucher.redemptionRate,
          voucher.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "voucher-statistics-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Voucher statistics exported successfully!",
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
              <div className="flex items-center gap-2">
                <CardTitle className="text-brand-green flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Voucher Redemption Statistics
                </CardTitle>
              </div>
              <CardDescription>Track voucher sales, redemption rates, and revenue performance</CardDescription>
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
                  <SelectItem value="refresh">Refresh Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    // Only export selected vouchers
                    const csvContent = [
                      [
                        "Voucher Type",
                        "Sold",
                        "Revenue (KES)",
                        "Redeemed",
                        "Expired",
                        "Active",
                        "Price",
                        "Redemption Rate",
                        "Status",
                      ].join(","),
                      ...voucherStatsState
                        .filter((voucher) => selectedVouchers.includes(voucher.id))
                        .map((voucher) =>
                          [
                            voucher.type,
                            voucher.sold,
                            voucher.revenue,
                            voucher.redeemed,
                            voucher.expired,
                            voucher.active,
                            voucher.price,
                            voucher.redemptionRate,
                            voucher.status,
                          ].join(","),
                        ),
                    ].join("\n")

                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "voucher-statistics-report.csv"
                    a.click()
                    URL.revokeObjectURL(url)

                    toast({
                      title: "Success",
                      description: "Selected voucher statistics exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedVouchers.length === 0 && bulkAction !== "refresh"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search voucher stats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Button variant="outline" onClick={() => setShowGraph((s) => !s)}>
                {showGraph ? "Hide Graph" : "Show Graph"}
              </Button>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleExport}
              >
                Export
              </Button>
            </div>
          </div>

          {showGraph && (
            <div className="mb-6">
              <ChartContainer
                className="h-[320px] w-full"
                config={{
                  sold: { label: "Sold (count)", color: "hsl(var(--chart-1))" },
                  revenue: { label: "Revenue (KES)", color: "hsl(var(--chart-2))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredVouchers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" label={{ value: "Voucher Type", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Value (Count / KES)", angle: -90, position: "insideLeft" }} />
                    <Legend verticalAlign="top" height={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sold" fill="var(--color-sold)" />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

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
                  <TableHead>Voucher Type</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Revenue (KES)</TableHead>
                  <TableHead>Redeemed</TableHead>
                  <TableHead>Expired</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Redemption Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher, index) => (
                  <TableRow key={voucher.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedVouchers.includes(voucher.id)}
                        onCheckedChange={() => handleCheckboxChange(voucher.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{voucher.type}</TableCell>
                    <TableCell>{voucher.sold}</TableCell>
                    <TableCell>{voucher.revenue.toLocaleString()}</TableCell>
                    <TableCell>{voucher.redeemed}</TableCell>
                    <TableCell>
                      <Badge variant={voucher.expired > 0 ? "destructive" : "success"}>{voucher.expired}</Badge>
                    </TableCell>
                    <TableCell>{voucher.active}</TableCell>
                    <TableCell>{voucher.price}</TableCell>
                    <TableCell>
                      <Badge variant={Number.parseFloat(voucher.redemptionRate) > 90 ? "success" : "secondary"}>
                        {voucher.redemptionRate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {voucher.status === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Discontinued</Badge>
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
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer">
                            <Eye className="h-4 w-4 mr-2 text-white" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-brand-green/10 cursor-pointer">
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            Refresh Data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              // Export single voucher record
                              const csvContent = [
                                [
                                  "Voucher Type",
                                  "Sold",
                                  "Revenue (KES)",
                                  "Redeemed",
                                  "Expired",
                                  "Active",
                                  "Price",
                                  "Redemption Rate",
                                  "Status",
                                ].join(","),
                                [
                                  voucher.type,
                                  voucher.sold,
                                  voucher.revenue,
                                  voucher.redeemed,
                                  voucher.expired,
                                  voucher.active,
                                  voucher.price,
                                  voucher.redemptionRate,
                                  voucher.status,
                                ].join(","),
                              ].join("\n")

                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = "voucher-statistics.csv"
                              a.click()
                              URL.revokeObjectURL(url)

                              toast({
                                title: "Success",
                                description: "Voucher statistics exported successfully!",
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Record
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
              Are you sure you want to delete this voucher statistics record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteVoucher}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteVoucher} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedVouchers.length} selected voucher records? This action cannot be undone.`}
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
              {`Delete ${selectedVouchers.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
