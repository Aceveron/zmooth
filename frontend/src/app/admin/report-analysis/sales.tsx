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
import { MoreVertical, Trash, RefreshCw, Search, Download, Eye, TrendingUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { useNavigate } from 'react-router-dom'

// Sample Sales data
const initialSales = [
  {
    id: "1",
    date: "2025-08-01",
    transactions: 32,
    revenue: 5400,
    avgTransaction: 168.75,
    topPlan: "Premium",
    paymentMethod: "M-Pesa",
    commission: 540,
    status: "completed",
    growth: "+12%",
  },
  {
    id: "2",
    date: "2025-08-02",
    transactions: 28,
    revenue: 4800,
    avgTransaction: 171.43,
    topPlan: "Basic",
    paymentMethod: "Card",
    commission: 480,
    status: "completed",
    growth: "-8%",
  },
  {
    id: "3",
    date: "2025-08-03",
    transactions: 41,
    revenue: 7130,
    avgTransaction: 173.9,
    topPlan: "Enterprise",
    paymentMethod: "M-Pesa",
    commission: 713,
    status: "completed",
    growth: "+48%",
  },
  {
    id: "4",
    date: "2025-08-04",
    transactions: 37,
    revenue: 6000,
    avgTransaction: 162.16,
    topPlan: "Premium",
    paymentMethod: "Bank",
    commission: 600,
    status: "pending",
    growth: "-16%",
  },
  {
    id: "5",
    date: "2025-08-05",
    transactions: 50,
    revenue: 8100,
    avgTransaction: 162.0,
    topPlan: "Premium",
    paymentMethod: "M-Pesa",
    commission: 810,
    status: "completed",
    growth: "+35%",
  },
]

export default function SalesPage() {
  const navigate = useNavigate()
  const [salesState, setSalesState] = useState(initialSales)
  const [selectedSales, setSelectedSales] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteSaleId, setDeleteSaleId] = useState<string | null>(null)
  const [showGraph, setShowGraph] = useState(false)

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedSales((prev) => (prev.includes(id) ? prev.filter((saleId) => saleId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedSales([])
    } else {
      setSelectedSales(salesState.map((sale) => sale.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter sales based on search query
  const filteredSales = salesState.filter(
    (sale) =>
      sale.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.topPlan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete single sale
  const handleDeleteSale = (id: string) => {
    setDeleteSaleId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSale = () => {
    setSalesState((prev) => prev.filter((sale) => sale.id !== deleteSaleId))
    setIsDeleteDialogOpen(false)
    setDeleteSaleId(null)
    toast({
      title: "Success",
      description: "Sales record deleted successfully!",
    })
  }

  const cancelDeleteSale = () => {
    setIsDeleteDialogOpen(false)
    setDeleteSaleId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedSales.length === 0) {
      toast({
        title: "Error",
        description: "Please select sales records first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "refresh") {
      setSelectedSales([])
      toast({
        title: "Success",
        description: `${selectedSales.length} sales records refreshed successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setSalesState((prev) => prev.filter((sale) => !selectedSales.includes(sale.id)))
    setSelectedSales([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected sales records deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Date",
        "Transactions",
        "Revenue (KES)",
        "Avg Transaction",
        "Top Plan",
        "Payment Method",
        "Commission",
        "Status",
        "Growth",
      ].join(","),
      ...filteredSales.map((sale) =>
        [
          sale.date,
          sale.transactions,
          sale.revenue,
          sale.avgTransaction,
          sale.topPlan,
          sale.paymentMethod,
          sale.commission,
          sale.status,
          sale.growth,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sales-report.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Sales report exported successfully!",
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
              <TrendingUp className="h-5 w-5 text-brand-green" />
              <CardTitle className="text-brand-green">Sales Reports</CardTitle>
            </div>
            <CardDescription>Track daily sales performance, revenue trends, and transaction analytics</CardDescription>
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
                    <SelectItem value="refresh">Refresh Selected</SelectItem>
                    <SelectItem value="export">Export Selected</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                  onClick={() => {
                    if (bulkAction === "export") {
                      // Only export selected sales with correct fields
                      const csvContent = [
                        [
                          "Date",
                          "Transactions",
                          "Revenue (KES)",
                          "Avg Transaction",
                          "Top Plan",
                          "Payment Method",
                          "Commission",
                          "Growth",
                          "Status"
                        ].join(","),
                        ...salesState
                          .filter((sale) => selectedSales.includes(sale.id))
                          .map((sale) =>
                            [
                              sale.date,
                              sale.transactions,
                              sale.revenue,
                              sale.avgTransaction,
                              sale.topPlan,
                              sale.paymentMethod,
                              sale.commission,
                              sale.growth,
                              sale.status,
                            ].join(","),
                          ),
                      ].join("\n");

                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "sales-report.csv";
                      a.click();
                      URL.revokeObjectURL(url);

                      toast({
                        title: "Success",
                        description: "Selected sales records exported successfully!",
                      });
                      setBulkAction("");
                    } else {
                      handleBulkAction();
                    }
                  }}
                  disabled={selectedSales.length === 0 && bulkAction !== "refresh"}
                >
                  Apply
                </Button>
            </div>    
              <div className="flex items-center gap-2">
                <div className="relative -w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
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
                  revenue: { label: "Revenue (KES)", color: "hsl(var(--chart-2))" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredSales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: "Date", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Revenue (KES)", angle: -90, position: "insideLeft" }} />
                    <Legend verticalAlign="top" height={36} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                  </LineChart>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Revenue (KES)</TableHead>
                  <TableHead>Avg Transaction</TableHead>
                  <TableHead>Top Plan</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Growth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale, index) => (
                  <TableRow key={sale.id} className="border-b border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedSales.includes(sale.id)}
                        onCheckedChange={() => handleCheckboxChange(sale.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{sale.date}</TableCell>
                    <TableCell>{sale.transactions}</TableCell>
                    <TableCell>{sale.revenue.toLocaleString()}</TableCell>
                    <TableCell>{sale.avgTransaction.toFixed(2)}</TableCell>
                    <TableCell>{sale.topPlan}</TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                    <TableCell>{sale.commission.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={sale.growth.startsWith("+") ? "success" : "destructive"}>{sale.growth}</Badge>
                    </TableCell>
                    <TableCell>
                      {sale.status === "pending" ? (
                        <Badge
                          className="bg-blue-500 text-white hover:bg-blue-700 transition-colors capitalize cursor-pointer"
                        >
                          {sale.status}
                        </Badge>
                      ) : (
                        <Badge variant={sale.status === "completed" ? "success" : "secondary"} className="capitalize">
                          {sale.status}
                        </Badge>
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
                              // Export single sale record
                              const csvContent = [
                                [
                                  "Date",
                                  "Transactions",
                                  "Revenue (KES)",
                                  "Avg Transaction",
                                  "Top Plan",
                                  "Payment Method",
                                  "Commission",
                                  "Growth",
                                  "Status"
                                ].join(","),
                                [
                                  sale.date,
                                  sale.transactions,
                                  sale.revenue,
                                  sale.avgTransaction,
                                  sale.topPlan,
                                  sale.paymentMethod,
                                  sale.commission,
                                  sale.growth,
                                  sale.status,
                                ].join(","),
                              ].join("\n");

                              const blob = new Blob([csvContent], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "sales-record.csv";
                              a.click();
                              URL.revokeObjectURL(url);

                              toast({
                                title: "Success",
                                description: "Sales record exported successfully!",
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Record
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteSale(sale.id)}
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
              Are you sure you want to delete this sales record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteSale}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteSale} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedSales.length} selected sales records? This action cannot be undone.`}
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
              {`Delete ${selectedSales.length} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
