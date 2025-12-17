"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"

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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"

// Sample IP Pool data
const initialIPPools = [
  {
    id: "1",
    poolName: "Main Pool",
    ipRangeStart: "192.168.1.100",
    ipRangeEnd: "192.168.1.200",
    router: "MikroTik-01",
    syncPool: true,
    createdAt: "2023-05-15 14:30:22",
    totalIPs: "101",
    usedIPs: "45",
  },
  {
    id: "2",
    poolName: "Secondary Pool",
    ipRangeStart: "192.168.2.50",
    ipRangeEnd: "192.168.2.150",
    router: "MikroTik-02",
    syncPool: true,
    createdAt: "2023-05-20 12:15:45",
    totalIPs: "101",
    usedIPs: "23",
  },
  {
    id: "3",
    poolName: "VIP Pool",
    ipRangeStart: "10.0.0.10",
    ipRangeEnd: "10.0.0.50",
    router: "MikroTik-01",
    syncPool: false,
    createdAt: "2023-05-20 10:05:33",
    totalIPs: "41",
    usedIPs: "12",
  },
]

// Sample routers
const routers = [
  { id: "1", name: "MikroTik-01" },
  { id: "2", name: "MikroTik-02" },
  { id: "3", name: "MikroTik-03" },
]

function PPPoEIPPool() {
  const navigate = useNavigate()
  const [ipPoolsState, setIPPoolsState] = useState(initialIPPools)
  const [isAddPoolDialogOpen, setIsAddPoolDialogOpen] = useState(false)
  const [isEditPoolDialogOpen, setIsEditPoolDialogOpen] = useState(false)
  const [selectedPools, setSelectedPools] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [editPoolId, setEditPoolId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePoolId, setDeletePoolId] = useState<string | null>(null)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    poolName: "",
    ipRangeStart: "",
    ipRangeEnd: "",
    router: "",
    syncPool: true,
  })

  const [editFormData, setEditFormData] = useState({
    poolName: "",
    ipRangeStart: "",
    ipRangeEnd: "",
    router: "",
    syncPool: true,
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    setSelectedPools((prev) => (prev.includes(id) ? prev.filter((poolId) => poolId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedPools([])
    } else {
      setSelectedPools(filteredPools.map((pool) => pool.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter pools based on search query
  const filteredPools = ipPoolsState.filter(
    (pool) =>
      pool.poolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.router.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.ipRangeStart.includes(searchQuery) ||
      pool.ipRangeEnd.includes(searchQuery),
  )

  // Handle form submission for add
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newPool = {
      id: (ipPoolsState.length + 1).toString(),
      ...formData,
      createdAt: formattedDate,
      totalIPs: "100",
      usedIPs: "0",
    };
    setIPPoolsState((prev) => [...prev, newPool]);
    setIsAddPoolDialogOpen(false);
    // Reset form
    setFormData({
      poolName: "",
      ipRangeStart: "",
      ipRangeEnd: "",
      router: "",
      syncPool: true,
    });
  }

  // Edit Pool
  const handleEditClick = (pool: any) => {
    setEditPoolId(pool.id)
    setEditFormData({
      poolName: pool.poolName,
      ipRangeStart: pool.ipRangeStart,
      ipRangeEnd: pool.ipRangeEnd,
      router: pool.router,
      syncPool: pool.syncPool,
    })
    setIsEditPoolDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIPPoolsState((prev) =>
      prev.map((pool) =>
        pool.id === editPoolId
          ? {
              ...pool,
              poolName: editFormData.poolName,
              ipRangeStart: editFormData.ipRangeStart,
              ipRangeEnd: editFormData.ipRangeEnd,
              router: editFormData.router,
              syncPool: editFormData.syncPool,
            }
          : pool,
      ),
    )
    setIsEditPoolDialogOpen(false)
    setEditPoolId(null)
  }

  // Toggle Sync/Unsync Pool
  const handleToggleSync = (id: string) => {
    setIPPoolsState((prev) =>
      prev.map((pool) =>
        pool.id === id
          ? {
              ...pool,
              syncPool: !pool.syncPool,
            }
          : pool,
      ),
    )
  }

  // Delete Pool
  const handleDeletePool = (id: string) => {
    setDeletePoolId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePool = () => {
    setIPPoolsState((prev) => prev.filter((pool) => pool.id !== deletePoolId))
    setIsDeleteDialogOpen(false)
    setDeletePoolId(null)
  }

  const cancelDeletePool = () => {
    setIsDeleteDialogOpen(false)
    setDeletePoolId(null)
  }

  // Bulk Delete
  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = () => {
    setIPPoolsState((prev) => prev.filter((pool) => !selectedPools.includes(pool.id)))
    setSelectedPools([])
    setIsBulkDeleteDialogOpen(false)
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      handleBulkDelete()
    } else if (bulkAction === "sync") {
      setIPPoolsState((prev) =>
        prev.map((pool) => (selectedPools.includes(pool.id) ? { ...pool, syncPool: true } : pool)),
      )
      setSelectedPools([])
      setBulkAction("")
    } else if (bulkAction === "unsync") {
      setIPPoolsState((prev) =>
        prev.map((pool) => (selectedPools.includes(pool.id) ? { ...pool, syncPool: false } : pool)),
      )
      setSelectedPools([])
      setBulkAction("")
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
              <CardTitle className="text-brand-green">PPPoE / Static IP Pool</CardTitle>
              <CardDescription>Manage IP address pools for PPPoE and Static IP assignments</CardDescription>
            </div>
            <div className="flex gap-2 items-center w-full md:w-auto justify-end">
              <Dialog open={isAddPoolDialogOpen} onOpenChange={setIsAddPoolDialogOpen}>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New IP Pool</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new IP address pool for PPPoE or Static IP assignments
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="poolName" className="text-brand-green">
                          Pool Name
                        </Label>
                        <Input
                          id="poolName"
                          name="poolName"
                          value={formData.poolName}
                          onChange={handleInputChange}
                          placeholder="Enter pool name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ipRangeStart" className="text-brand-green">
                            IP Range Start
                          </Label>
                          <Input
                            id="ipRangeStart"
                            name="ipRangeStart"
                            value={formData.ipRangeStart}
                            onChange={handleInputChange}
                            placeholder="e.g. 192.168.1.100"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ipRangeEnd" className="text-brand-green">
                            IP Range End
                          </Label>
                          <Input
                            id="ipRangeEnd"
                            name="ipRangeEnd"
                            value={formData.ipRangeEnd}
                            onChange={handleInputChange}
                            placeholder="e.g. 192.168.1.200"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="router" className="text-brand-green">
                          Router
                        </Label>
                        <Select value={formData.router} onValueChange={(value) => handleSelectChange("router", value)}>
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select router" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {routers.map((router) => (
                              <SelectItem key={router.id} value={router.name}>
                                {router.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="syncPool"
                          checked={formData.syncPool}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, syncPool: checked === true }))
                          }
                          className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        />
                        <Label htmlFor="syncPool" className="text-white">
                          Sync pool with router
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddPoolDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Pool
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="delete">Delete Selected</SelectItem>
                  <SelectItem value="sync">Sync Selected</SelectItem>
                  <SelectItem value="unsync">Unsync Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedPools.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddPoolDialogOpen} onOpenChange={setIsAddPoolDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Pool</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New IP Pool</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new IP address pool for PPPoE or Static IP assignments
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="poolName" className="text-brand-green">
                          Pool Name
                        </Label>
                        <Input
                          id="poolName"
                          name="poolName"
                          value={formData.poolName}
                          onChange={handleInputChange}
                          placeholder="Enter pool name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ipRangeStart" className="text-brand-green">
                            IP Range Start
                          </Label>
                          <Input
                            id="ipRangeStart"
                            name="ipRangeStart"
                            value={formData.ipRangeStart}
                            onChange={handleInputChange}
                            placeholder="e.g. 192.168.1.100"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ipRangeEnd" className="text-brand-green">
                            IP Range End
                          </Label>
                          <Input
                            id="ipRangeEnd"
                            name="ipRangeEnd"
                            value={formData.ipRangeEnd}
                            onChange={handleInputChange}
                            placeholder="e.g. 192.168.1.200"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="router" className="text-brand-green">
                          Router
                        </Label>
                        <Select value={formData.router} onValueChange={(value) => handleSelectChange("router", value)}>
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select router" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {routers.map((router) => (
                              <SelectItem key={router.id} value={router.name}>
                                {router.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="syncPool"
                          checked={formData.syncPool}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, syncPool: checked === true }))
                          }
                          className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        />
                        <Label htmlFor="syncPool" className="text-white">
                          Sync pool with router
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddPoolDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Pool
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
                  <TableHead>Pool Name</TableHead>
                  <TableHead>IP Range Start</TableHead>
                  <TableHead>IP Range End</TableHead>
                  <TableHead>Router</TableHead>
                  <TableHead>Sync Pool</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Total IPs</TableHead>
                  <TableHead>Used IPs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPools.map((pool) => (
                  <TableRow key={pool.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedPools.includes(pool.id)}
                        onCheckedChange={() => handleCheckboxChange(pool.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pool.poolName}</TableCell>
                    <TableCell>{pool.ipRangeStart}</TableCell>
                    <TableCell>{pool.ipRangeEnd}</TableCell>
                    <TableCell>{pool.router}</TableCell>
                    <TableCell>
                      {pool.syncPool ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{pool.createdAt}</TableCell>
                    <TableCell>{pool.totalIPs}</TableCell>
                    <TableCell>{pool.usedIPs}</TableCell>
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
                            onClick={() => handleEditClick(pool)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Pool
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleSync(pool.id)}
                          >
                            {pool.syncPool ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Unsync Pool
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Sync Pool
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeletePool(pool.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Pool
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

      {/* Edit Pool Dialog */}
      <Dialog open={isEditPoolDialogOpen} onOpenChange={setIsEditPoolDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit IP Pool</DialogTitle>
            <DialogDescription className="text-white/80">Update the IP address pool information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPoolName" className="text-brand-green">
                  Pool Name
                </Label>
                <Input
                  id="editPoolName"
                  name="poolName"
                  value={editFormData.poolName}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, poolName: e.target.value }))}
                  placeholder="Enter pool name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editIpRangeStart" className="text-brand-green">
                    IP Range Start
                  </Label>
                  <Input
                    id="editIpRangeStart"
                    name="ipRangeStart"
                    value={editFormData.ipRangeStart}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, ipRangeStart: e.target.value }))}
                    placeholder="e.g. 192.168.1.100"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIpRangeEnd" className="text-brand-green">
                    IP Range End
                  </Label>
                  <Input
                    id="editIpRangeEnd"
                    name="ipRangeEnd"
                    value={editFormData.ipRangeEnd}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, ipRangeEnd: e.target.value }))}
                    placeholder="e.g. 192.168.1.200"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRouter" className="text-brand-green">
                  Router
                </Label>
                <Select value={editFormData.router} onValueChange={(value) => handleEditSelectChange("router", value)}>
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select router" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {routers.map((router) => (
                      <SelectItem key={router.id} value={router.name}>
                        {router.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editSyncPool"
                  checked={editFormData.syncPool}
                  onCheckedChange={(checked) => setEditFormData((prev) => ({ ...prev, syncPool: checked === true }))}
                  className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                />
                <Label htmlFor="editSyncPool" className="text-white">
                  Sync pool with router
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditPoolDialogOpen(false)}
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
              Are you sure you want to delete this IP pool? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeletePool}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeletePool} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedPools.length} selected pools? This action cannot be undone.`}
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
              {`Delete ${selectedPools.length} Pools`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PPPoEIPPool