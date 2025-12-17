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
import {
  MoreVertical,
  Trash,
  Edit,
  RefreshCw,
  Plus,
  Search,
  Download,
  Power,
  PowerOff,
  Eye,
  TestTube2,
  ShieldCheck,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Router = {
  id: string
  name: string
  assignedStation: string
  login: string
  connectionType: "OpenVPN" | "IPSec" | "WireGuard"
  status: "Online" | "Offline"
  sync: boolean
  lastSeen: string
  vpnServer: string
  port: string
  publicKey?: string
  privateKey?: string
  serverEndpoint: string
}

// Sample VPN Routers data
const initialRouters: Router[] = [
  {
    id: "R-1001",
    name: "Core Router A",
    assignedStation: "NASTU HOTSPOT",
    login: "admin@10.0.0.1",
    connectionType: "OpenVPN",
    status: "Online",
    sync: true,
    lastSeen: "2023-05-15 14:30",
    vpnServer: "vpn1.example.com",
    port: "1194",
    serverEndpoint: "vpn1.example.com:1194",
  },
  {
    id: "R-1002",
    name: "Edge Router B",
    assignedStation: "Westside PPPoE",
    login: "admin@10.0.0.2",
    connectionType: "WireGuard",
    status: "Offline",
    sync: false,
    lastSeen: "2023-05-14 09:15",
    vpnServer: "vpn2.example.com",
    port: "51820",
    publicKey: "ABC123...",
    serverEndpoint: "vpn2.example.com:51820",
  },
  {
    id: "R-1003",
    name: "Branch Router C",
    assignedStation: "Lakeside Static",
    login: "admin@10.0.0.3",
    connectionType: "IPSec",
    status: "Online",
    sync: true,
    lastSeen: "2023-05-15 16:45",
    vpnServer: "vpn3.example.com",
    port: "500",
    serverEndpoint: "vpn3.example.com:500",
  },
]

// Sample stations
const stations = [
  { id: "1", name: "NASTU HOTSPOT" },
  { id: "2", name: "Westside PPPoE" },
  { id: "3", name: "Lakeside Static" },
  { id: "4", name: "Downtown Fiber" },
]

function StationVpnPage() {
  const navigate = useNavigate()
  const [isAddRouterDialogOpen, setIsAddRouterDialogOpen] = useState(false)
  const [isEditRouterDialogOpen, setIsEditRouterDialogOpen] = useState(false)
  const [routersState, setRoutersState] = useState<Router[]>(initialRouters)
  const [selectedRouters, setSelectedRouters] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRouter, setEditingRouter] = useState<Router | null>(null)
  const [viewConfigFor, setViewConfigFor] = useState<Router | null>(null)
  const [formData, setFormData] = useState({
    routerName: "",
    assignedStation: "",
    login: "",
    connectionType: "OpenVPN" as Router["connectionType"],
    vpnServer: "",
    port: "",
    publicKey: "",
    privateKey: "",
  })
  const [editFormData, setEditFormData] = useState({
    routerName: "",
    assignedStation: "",
    login: "",
    connectionType: "OpenVPN" as Router["connectionType"],
    vpnServer: "",
    port: "",
    publicKey: "",
    privateKey: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteRouterId, setDeleteRouterId] = useState<string | null>(null)

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
    setSelectedRouters((prev) => (prev.includes(id) ? prev.filter((routerId) => routerId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRouters([])
    } else {
      setSelectedRouters(routersState.map((router) => router.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter routers based on search query
  const filteredRouters = routersState.filter(
    (router) =>
      router.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.assignedStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.connectionType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRouter: Router = {
      id: "R-" + Math.floor(Math.random() * 9000 + 1000),
      name: formData.routerName,
      assignedStation: stations.find((s) => s.id === formData.assignedStation)?.name || "",
      login: formData.login,
      connectionType: formData.connectionType,
      status: "Offline",
      sync: false,
      lastSeen: new Date().toLocaleString(),
      vpnServer: formData.vpnServer,
      port: formData.port,
      publicKey: formData.publicKey,
      privateKey: formData.privateKey,
      serverEndpoint: `${formData.vpnServer}:${formData.port}`,
    }
    setRoutersState((prev) => [...prev, newRouter])
    setIsAddRouterDialogOpen(false)
    setFormData({
      routerName: "",
      assignedStation: "",
      login: "",
      connectionType: "OpenVPN",
      vpnServer: "",
      port: "",
      publicKey: "",
      privateKey: "",
    })
    toast({
      title: "Success",
      description: "Router added successfully!",
    })
  }

  // Handle edit router
  const handleEditRouter = (router: Router) => {
    setEditingRouter(router)
    setEditFormData({
      routerName: router.name,
      assignedStation: stations.find((s) => s.name === router.assignedStation)?.id || "",
      login: router.login,
      connectionType: router.connectionType,
      vpnServer: router.vpnServer,
      port: router.port,
      publicKey: router.publicKey || "",
      privateKey: router.privateKey || "",
    })
    setIsEditRouterDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRoutersState((prev) =>
      prev.map((router) =>
        router.id === editingRouter?.id
          ? {
              ...router,
              name: editFormData.routerName,
              assignedStation:
                stations.find((s) => s.id === editFormData.assignedStation)?.name || router.assignedStation,
              login: editFormData.login,
              connectionType: editFormData.connectionType,
              vpnServer: editFormData.vpnServer,
              port: editFormData.port,
              publicKey: editFormData.publicKey,
              privateKey: editFormData.privateKey,
              serverEndpoint: `${editFormData.vpnServer}:${editFormData.port}`,
            }
          : router,
      ),
    )
    setIsEditRouterDialogOpen(false)
    setEditingRouter(null)
    toast({
      title: "Success",
      description: "Router updated successfully!",
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setRoutersState((prev) =>
      prev.map((router) =>
        router.id === id ? { ...router, status: router.status === "Online" ? "Offline" : "Online" } : router,
      ),
    )
    const router = routersState.find((r) => r.id === id)
    toast({
      title: "Success",
      description: `Router ${router?.status === "Online" ? "disconnected" : "connected"} successfully!`,
    })
  }

  // Handle sync toggle
  const handleToggleSync = (id: string) => {
    setRoutersState((prev) => prev.map((router) => (router.id === id ? { ...router, sync: !router.sync } : router)))
    const router = routersState.find((r) => r.id === id)
    toast({
      title: "Success",
      description: `Router ${router?.sync ? "unsynced" : "synced"} successfully!`,
    })
  }

  // Handle delete single router
  const handleDeleteRouter = (id: string) => {
    setDeleteRouterId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRouter = () => {
    setRoutersState((prev) => prev.filter((router) => router.id !== deleteRouterId))
    setIsDeleteDialogOpen(false)
    setDeleteRouterId(null)
    toast({
      title: "Success",
      description: "Router deleted successfully!",
    })
  }

  const cancelDeleteRouter = () => {
    setIsDeleteDialogOpen(false)
    setDeleteRouterId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (bulkAction === "export") {
      handleExport()
      setBulkAction("")
      return
    }
    if (selectedRouters.length === 0) {
      toast({
        title: "Error",
        description: "Please select routers first",
        variant: "destructive",
      })
      return
    }
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "sync") {
      setRoutersState((prev) =>
        prev.map((router) => (selectedRouters.includes(router.id) ? { ...router, sync: true } : router)),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers synced successfully!`,
      })
    } else if (bulkAction === "unsync") {
      setRoutersState((prev) =>
        prev.map((router) => (selectedRouters.includes(router.id) ? { ...router, sync: false } : router)),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers unsynced successfully!`,
      })
    } else if (bulkAction === "connect") {
      setRoutersState((prev) =>
        prev.map((router) => (selectedRouters.includes(router.id) ? { ...router, status: "Online" } : router)),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers connected successfully!`,
      })
    } else if (bulkAction === "disconnect") {
      setRoutersState((prev) =>
        prev.map((router) => (selectedRouters.includes(router.id) ? { ...router, status: "Offline" } : router)),
      )
      setSelectedRouters([])
      toast({
        title: "Success",
        description: `${selectedRouters.length} routers disconnected successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setRoutersState((prev) => prev.filter((router) => !selectedRouters.includes(router.id)))
    setSelectedRouters([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected routers deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Router ID", "Name", "Station", "Login", "Connection Type", "Status", "Sync", "VPN Server", "Port"].join(","),
      ...filteredRouters.map((router) =>
        [
          router.id,
          router.name,
          router.assignedStation,
          router.login,
          router.connectionType,
          router.status,
          router.sync ? "Yes" : "No",
          router.vpnServer,
          router.port,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vpn-routers.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Routers exported successfully!",
    })
  }

  // Test connection
  const handleTestConnection = (router: Router) => {
    toast({
      title: "Testing Connection",
      description: `Testing connection to ${router.name}...`,
    })
    // Simulate test result after 2 seconds
    setTimeout(() => {
      toast({
        title: router.status === "Online" ? "Connection Successful" : "Connection Failed",
        description: `${router.name} is ${router.status === "Online" ? "reachable" : "unreachable"}`,
        variant: router.status === "Online" ? "default" : "destructive",
      })
    }, 2000)
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
              <CardTitle className="text-brand-green">Station VPN Routers</CardTitle>
              <CardDescription>Manage VPN router connections and configurations</CardDescription>
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
                  <SelectItem value="sync">Sync Selected</SelectItem>
                  <SelectItem value="unsync">Unsync Selected</SelectItem>
                  <SelectItem value="connect">Connect Selected</SelectItem>
                  <SelectItem value="disconnect">Disconnect Selected</SelectItem>
                  <SelectItem value="export">Export Routers</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedRouters.length === 0 && bulkAction !== "export"}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddRouterDialogOpen} onOpenChange={setIsAddRouterDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Router</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Router</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new VPN router configuration
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="routerName" className="text-brand-green">
                          Router Name
                        </Label>
                        <Input
                          id="routerName"
                          name="routerName"
                          value={formData.routerName}
                          onChange={handleInputChange}
                          placeholder="eg Core Router A"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedStation" className="text-brand-green">
                          Assigned Station
                        </Label>
                        <Select
                          value={formData.assignedStation}
                          onValueChange={(value) => handleSelectChange("assignedStation", value)}
                          required
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select Station" />
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
                      <div className="space-y-2">
                        <Label htmlFor="login" className="text-brand-green">
                          Router Login
                        </Label>
                        <Input
                          id="login"
                          name="login"
                          value={formData.login}
                          onChange={handleInputChange}
                          placeholder="eg admin@10.0.0.1"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="connectionType" className="text-brand-green">
                          Connection Type
                        </Label>
                        <Select
                          value={formData.connectionType}
                          onValueChange={(value) => handleSelectChange("connectionType", value)}
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select Connection Type" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            <SelectItem value="OpenVPN">OpenVPN</SelectItem>
                            <SelectItem value="IPSec">IPSec</SelectItem>
                            <SelectItem value="WireGuard">WireGuard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vpnServer" className="text-brand-green">
                            VPN Server
                          </Label>
                          <Input
                            id="vpnServer"
                            name="vpnServer"
                            value={formData.vpnServer}
                            onChange={handleInputChange}
                            placeholder="vpn.example.com"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port" className="text-brand-green">
                            Port
                          </Label>
                          <Input
                            id="port"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            placeholder="1194"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      {formData.connectionType === "WireGuard" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="publicKey" className="text-brand-green">
                              Public Key
                            </Label>
                            <Input
                              id="publicKey"
                              name="publicKey"
                              value={formData.publicKey}
                              onChange={handleInputChange}
                              placeholder="Public key for WireGuard"
                              className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="privateKey" className="text-brand-green">
                              Private Key
                            </Label>
                            <Input
                              id="privateKey"
                              name="privateKey"
                              type="password"
                              value={formData.privateKey}
                              onChange={handleInputChange}
                              placeholder="Private key for WireGuard"
                              className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddRouterDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Router
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
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Router ID</TableHead>
                  <TableHead>Router Name</TableHead>
                  <TableHead>Assigned Station</TableHead>
                  <TableHead>Router Login</TableHead>
                  <TableHead>Connection Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>VPN Server</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRouters.map((router, index) => (
                  <TableRow key={router.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedRouters.includes(router.id)}
                        onCheckedChange={() => handleCheckboxChange(router.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{router.id}</TableCell>
                    <TableCell>{router.name}</TableCell>
                    <TableCell>{router.assignedStation}</TableCell>
                    <TableCell>{router.login}</TableCell>
                    <TableCell>{router.connectionType}</TableCell>
                    <TableCell>
                      {router.status === "Online" ? (
                        <Badge variant="success">Online</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          Offline
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {router.sync ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{router.lastSeen}</TableCell>
                    <TableCell>{router.serverEndpoint}</TableCell>
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
                            onClick={() => handleEditRouter(router)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Router
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => setViewConfigFor(router)}
                          >
                            <Eye className="h-4 w-4 mr-2 text-white" />
                            View Config
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleTestConnection(router)}
                          >
                            <TestTube2 className="h-4 w-4 mr-2 text-white" />
                            Test Connection
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleSync(router.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {router.sync ? "Unsync" : "Sync"} Router
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(router.id)}
                          >
                            {router.status === "Online" ? (
                              <PowerOff className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <Power className="h-4 w-4 mr-2 text-white" />
                            )}
                            {router.status === "Online" ? "Disconnect" : "Connect"}
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
                            onClick={() => handleDeleteRouter(router.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Router
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

      {/* Edit Router Dialog */}
      <Dialog open={isEditRouterDialogOpen} onOpenChange={setIsEditRouterDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Router</DialogTitle>
            <DialogDescription className="text-white/80">Update router configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-routerName" className="text-brand-green">
                  Router Name
                </Label>
                <Input
                  id="edit-routerName"
                  name="routerName"
                  value={editFormData.routerName}
                  onChange={handleEditInputChange}
                  placeholder="eg Core Router A"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignedStation" className="text-brand-green">
                  Assigned Station
                </Label>
                <Select
                  value={editFormData.assignedStation}
                  onValueChange={(value) => handleEditSelectChange("assignedStation", value)}
                  required
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select Station" />
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
              <div className="space-y-2">
                <Label htmlFor="edit-login" className="text-brand-green">
                  Router Login
                </Label>
                <Input
                  id="edit-login"
                  name="login"
                  value={editFormData.login}
                  onChange={handleEditInputChange}
                  placeholder="eg admin@10.0.0.1"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-connectionType" className="text-brand-green">
                  Connection Type
                </Label>
                <Select
                  value={editFormData.connectionType}
                  onValueChange={(value) => handleEditSelectChange("connectionType", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select Connection Type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="OpenVPN">OpenVPN</SelectItem>
                    <SelectItem value="IPSec">IPSec</SelectItem>
                    <SelectItem value="WireGuard">WireGuard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vpnServer" className="text-brand-green">
                    VPN Server
                  </Label>
                  <Input
                    id="edit-vpnServer"
                    name="vpnServer"
                    value={editFormData.vpnServer}
                    onChange={handleEditInputChange}
                    placeholder="vpn.example.com"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-port" className="text-brand-green">
                    Port
                  </Label>
                  <Input
                    id="edit-port"
                    name="port"
                    value={editFormData.port}
                    onChange={handleEditInputChange}
                    placeholder="1194"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              {editFormData.connectionType === "WireGuard" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-publicKey" className="text-brand-green">
                      Public Key
                    </Label>
                    <Input
                      id="edit-publicKey"
                      name="publicKey"
                      value={editFormData.publicKey}
                      onChange={handleEditInputChange}
                      placeholder="Public key for WireGuard"
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-privateKey" className="text-brand-green">
                      Private Key
                    </Label>
                    <Input
                      id="edit-privateKey"
                      name="privateKey"
                      type="password"
                      value={editFormData.privateKey}
                      onChange={handleEditInputChange}
                      placeholder="Private key for WireGuard"
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditRouterDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Router
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={!!viewConfigFor} onOpenChange={(open) => !open && setViewConfigFor(null)}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-brand-green">VPN Config: {viewConfigFor?.name}</DialogTitle>
            <DialogDescription className="text-white/80">
              Configuration preview for {viewConfigFor?.connectionType}
            </DialogDescription>
          </DialogHeader>
          <pre className="text-xs p-4 rounded-md bg-black/50 overflow-auto text-white">{`# ${viewConfigFor?.connectionType} config for ${viewConfigFor?.name}
            ${
              viewConfigFor?.connectionType === "WireGuard"
              ? `[Interface]
              PrivateKey = ${viewConfigFor?.privateKey || "<redacted>"}
              Address = 10.8.0.2/24

              [Peer]
              PublicKey = ${viewConfigFor?.publicKey || "<server-key>"}
              Endpoint = ${viewConfigFor?.serverEndpoint}
              AllowedIPs = 0.0.0.0/0
              PersistentKeepalive = 25`
      
              : viewConfigFor?.connectionType === "OpenVPN"
      
              ? `client
              dev tun
              proto udp
              remote ${viewConfigFor?.vpnServer} ${viewConfigFor?.port}
              resolv-retry infinite
              nobind
              persist-key
              persist-tun
              ca ca.crt
              cert client.crt
              key client.key
              verb 3`

              : `# IPSec configuration
              conn ${viewConfigFor?.name}
              type=tunnel
              authby=secret
              left=%defaultroute
              leftid=@client
              right=${viewConfigFor?.vpnServer}
              rightid=@server
              auto=start`
            }
          `}</pre>
          <DialogFooter>
            <Button className="bg-brand-green text-brand-black hover:bg-brand-neongreen font-bold">
              <ShieldCheck className="mr-2 h-4 w-4" /> Copy Config
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass border-red-600/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this router? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteRouter}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteRouter} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedRouters.length} selected routers? This action cannot be undone.`}
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
              {`Delete ${selectedRouters.length} Routers`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StationVpnPage