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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Trash, Edit, RefreshCw, UserPlus, Search, Download, Power, PowerOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample PPPoE Clients data
const initialClients = [

  {
    id: "1",
    client: "John Doe",
    type: "PPPoE",
    status: "active",
    sync: true,
    recharge: "2023-05-15",
    plan: "Basic PPPoE",
    api: "MikroTik API",
    station: "Station A",
    speed: "5M/5M",
    username: "john.doe",
    password: "password123",
    email: "john@example.com",
    phone: "+254700111222",
    ipAddress: "192.168.1.10",
  },
  {
    id: "2",
    client: "Jane Smith",
    type: "Static",
    status: "active",
    sync: true,
    recharge: "2023-05-20",
    plan: "Premium Static",
    api: "Radius",
    station: "Station B",
    speed: "10M/10M",
    username: "jane.smith",
    password: "password456",
    email: "jane@example.com",
    phone: "+254700222333",
    ipAddress: "192.168.1.11",
  },
  {
    id: "3",
    client: "Robert Johnson",
    type: "PPPoE",
    status: "inactive",
    sync: false,
    recharge: "2023-04-30",
    plan: "Enterprise PPPoE",
    api: "MikroTik API",
    station: "Station A",
    speed: "20M/20M",
    username: "robert.johnson",
    password: "password789",
    email: "robert@example.com",
    phone: "+254700333444",
    ipAddress: "192.168.1.12",
  },
]

// Sample plans and stations
const plans = [
  { id: "1", name: "Basic PPPoE" },
  { id: "2", name: "Premium Static" },
  { id: "3", name: "Enterprise PPPoE" },
]

const stations = [
  { id: "1", name: "Station A" },
  { id: "2", name: "Station B" },
  { id: "3", name: "Station C" },
]

function PPPoEClients() {
  const navigate = useNavigate()
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [clientsState, setClientsState] = useState(initialClients)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingClient, setEditingClient] = useState<any>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientType: "pppoe",
    planId: "",
    stationId: "",
    api: "MikroTik API",
    username: "",
    password: "",
    ipAddress: "",
  })
  const [editFormData, setEditFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientType: "pppoe",
    planId: "",
    stationId: "",
    api: "MikroTik API",
    username: "",
    password: "",
    ipAddress: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null)

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
    setSelectedClients((prev) => (prev.includes(id) ? prev.filter((clientId) => clientId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedClients([])
    } else {
      setSelectedClients(clientsState.map((client) => client.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter clients based on search query
  const filteredClients = clientsState.filter(
    (client) =>
      client.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newClient = {
      id: (clientsState.length + 1).toString(),
      client: formData.clientName,
      type: formData.clientType === "pppoe" ? "PPPoE" : "Static",
      status: "active",
      sync: true,
      recharge: formattedDate,
      plan: plans.find((p) => p.id === formData.planId)?.name || "",
      api: formData.clientType === "pppoe" ? "MikroTik API" : "Radius",
      station: stations.find((s) => s.id === formData.stationId)?.name || "",
      speed: "5M/5M",
      username: formData.username,
      password: formData.password,
      email: formData.clientEmail,
      phone: formData.clientPhone,
      ipAddress: formData.ipAddress,
    };
    setClientsState((prev) => [...prev, newClient]);
    setIsAddClientDialogOpen(false);
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientType: "pppoe",
      planId: "",
      stationId: "",
      api: "MikroTik API",
      username: "",
      password: "",
      ipAddress: "",
    });
    toast({
      title: "Success",
      description: "Client added successfully!",
    });
  }

  // Handle edit client
  const handleEditClient = (client: any) => {
    setEditingClient(client)
    setEditFormData({
      clientName: client.client,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientType: client.type.toLowerCase() === "pppoe" ? "pppoe" : "static",
      planId: plans.find((p) => p.name === client.plan)?.id || "",
      stationId: stations.find((s) => s.name === client.station)?.id || "",
      api: client.api,
      username: client.username,
      password: client.password,
      ipAddress: client.ipAddress,
    })
    setIsEditClientDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setClientsState((prev) =>
      prev.map((client) =>
        client.id === editingClient.id
          ? {
              ...client,
              client: editFormData.clientName,
              email: editFormData.clientEmail,
              phone: editFormData.clientPhone,
              type: editFormData.clientType === "pppoe" ? "PPPoE" : "Static",
              plan: plans.find((p) => p.id === editFormData.planId)?.name || client.plan,
              station: stations.find((s) => s.id === editFormData.stationId)?.name || client.station,
              api: editFormData.api,
              username: editFormData.username,
              password: editFormData.password,
              ipAddress: editFormData.ipAddress,
            }
          : client,
      ),
    )
    setIsEditClientDialogOpen(false)
    setEditingClient(null)
    toast({
      title: "Success",
      description: "Client updated successfully!",
    })
  }

  // Handle status toggle
  const handleToggleStatus = (id: string) => {
    setClientsState((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, status: client.status === "active" ? "inactive" : "active" } : client,
      ),
    )
    const client = clientsState.find((c) => c.id === id)
    toast({
      title: "Success",
      description: `Client ${client?.status === "active" ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Handle sync toggle
  const handleToggleSync = (id: string) => {
    setClientsState((prev) => prev.map((client) => (client.id === id ? { ...client, sync: !client.sync } : client)))
    const client = clientsState.find((c) => c.id === id)
    toast({
      title: "Success",
      description: `Client ${client?.sync ? "unsynced" : "synced"} successfully!`,
    })
  }

  // Handle delete single client
  const handleDeleteClient = (id: string) => {
    setDeleteClientId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteClient = () => {
    setClientsState((prev) => prev.filter((client) => client.id !== deleteClientId))
    setIsDeleteDialogOpen(false)
    setDeleteClientId(null)
    toast({
      title: "Success",
      description: "Client deleted successfully!",
    })
  }

  const cancelDeleteClient = () => {
    setIsDeleteDialogOpen(false)
    setDeleteClientId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Error",
        description: "Please select clients first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "sync") {
      setClientsState((prev) =>
        prev.map((client) => (selectedClients.includes(client.id) ? { ...client, sync: true } : client)),
      )
      setSelectedClients([])
      toast({
        title: "Success",
        description: `${selectedClients.length} clients synced successfully!`,
      })
    } else if (bulkAction === "unsync") {
      setClientsState((prev) =>
        prev.map((client) => (selectedClients.includes(client.id) ? { ...client, sync: false } : client)),
      )
      setSelectedClients([])
      toast({
        title: "Success",
        description: `${selectedClients.length} clients unsynced successfully!`,
      })
    } else if (bulkAction === "activate") {
      setClientsState((prev) =>
        prev.map((client) => (selectedClients.includes(client.id) ? { ...client, status: "active" } : client)),
      )
      setSelectedClients([])
      toast({
        title: "Success",
        description: `${selectedClients.length} clients activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setClientsState((prev) =>
        prev.map((client) => (selectedClients.includes(client.id) ? { ...client, status: "inactive" } : client)),
      )
      setSelectedClients([])
      toast({
        title: "Success",
        description: `${selectedClients.length} clients deactivated successfully!`,
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setClientsState((prev) => prev.filter((client) => !selectedClients.includes(client.id)))
    setSelectedClients([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected clients deleted successfully!",
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Client", "Type", "Status", "Sync", "Plan", "API/Radius", "Station", "Username", "Email", "Phone"].join(","),
      ...filteredClients.map((client) =>
        [
          client.client,
          client.type,
          client.status,
          client.sync ? "Yes" : "No",
          client.plan,
          client.api,
          client.station,
          client.username,
          client.email,
          client.phone,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pppoe-clients.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Clients exported successfully!",
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
              <CardTitle className="text-brand-green">PPPoE / Static Clients</CardTitle>
              <CardDescription>Manage clients with PPPoE and Static IP connections</CardDescription>
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
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={() => {
                  if (bulkAction === "export") {
                    handleExport();
                  } else {
                    handleBulkAction();
                  }
                }}
                disabled={selectedClients.length === 0 && bulkAction !== "export"}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-[150px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-[150px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <UserPlus className="h-4 w-4" />
                    <span>Add New PPPoE / Static Client</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Client</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new client with PPPoE or Static IP connection
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-brand-green">
                          Client Name
                        </Label>
                        <Input
                          id="clientName"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="Enter client name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail" className="text-brand-green">
                            Email
                          </Label>
                          <Input
                            id="clientEmail"
                            name="clientEmail"
                            type="email"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            placeholder="Enter client email"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientPhone" className="text-brand-green">
                            Phone
                          </Label>
                          <Input
                            id="clientPhone"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleInputChange}
                            placeholder="Enter client phone"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientType" className="text-brand-green">
                          Client Type
                        </Label>
                        <Select
                          value={formData.clientType}
                          onValueChange={(value) => handleSelectChange("clientType", value)}
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            <SelectItem value="pppoe">PPPoE</SelectItem>
                            <SelectItem value="static">Static IP</SelectItem>
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
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-brand-green">
                            Username
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-brand-green">
                            Password
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required
                          />
                        </div>
                      </div>
                      {formData.clientType === "static" && (
                        <div className="space-y-2">
                          <Label htmlFor="ipAddress" className="text-brand-green">
                            IP Address
                          </Label>
                          <Input
                            id="ipAddress"
                            name="ipAddress"
                            value={formData.ipAddress}
                            onChange={handleInputChange}
                            placeholder="e.g. 192.168.1.100"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                            required={formData.clientType === "static"}
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="api" className="text-brand-green">
                            API/Radius
                          </Label>
                          <Select
                            value={formData.api}
                            onValueChange={(value) => handleSelectChange("api", value)}
                            required
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select API/Radius" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="MikroTik API">MikroTik API</SelectItem>
                              <SelectItem value="Radius">Radius</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddClientDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Client
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
                  <TableHead>Client</TableHead>
                  <TableHead>PPPoE / Static</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync</TableHead>
                  <TableHead>Recharge</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>API/Radius</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client, index) => (
                  <TableRow key={client.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleCheckboxChange(client.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{client.client}</TableCell>
                    <TableCell>{client.type}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === "active" ? "success" : "destructive"} className="capitalize">
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.sync ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{client.recharge}</TableCell>
                    <TableCell>{client.plan}</TableCell>
                    <TableCell>{client.api}</TableCell>
                    <TableCell>{client.station}</TableCell>
                    <TableCell>{client.speed}</TableCell>
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
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleSync(client.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-wite" />
                            {client.sync ? "Unsync" : "Sync"} Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={handleExport}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(client.id)}
                          >
                            {client.status === "active" ? (
                              <PowerOff className="h-4 w-4 mr-2 text-white" />
                            ) : (
                              <Power className="h-4 w-4 mr-2 text-white" />
                            )}
                            {client.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Client
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

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Client</DialogTitle>
            <DialogDescription className="text-white/80">Update client information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clientName" className="text-brand-green">
                  Client Name
                </Label>
                <Input
                  id="edit-clientName"
                  name="clientName"
                  value={editFormData.clientName}
                  onChange={handleEditInputChange}
                  placeholder="Enter client name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-clientEmail" className="text-brand-green">
                    Email
                  </Label>
                  <Input
                    id="edit-clientEmail"
                    name="clientEmail"
                    type="email"
                    value={editFormData.clientEmail}
                    onChange={handleEditInputChange}
                    placeholder="Enter client email"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-clientPhone" className="text-brand-green">
                    Phone
                  </Label>
                  <Input
                    id="edit-clientPhone"
                    name="clientPhone"
                    value={editFormData.clientPhone}
                    onChange={handleEditInputChange}
                    placeholder="Enter client phone"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-clientType" className="text-brand-green">
                  Client Type
                </Label>
                <Select
                  value={editFormData.clientType}
                  onValueChange={(value) => handleEditSelectChange("clientType", value)}
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="pppoe">PPPoE</SelectItem>
                    <SelectItem value="static">Static IP</SelectItem>
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username" className="text-brand-green">
                    Username
                  </Label>
                  <Input
                    id="edit-username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    placeholder="Enter username"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-brand-green">
                    Password
                  </Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={editFormData.password}
                    onChange={handleEditInputChange}
                    placeholder="Enter password"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
              </div>
              {editFormData.clientType === "static" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-ipAddress" className="text-brand-green">
                    IP Address
                  </Label>
                  <Input
                    id="edit-ipAddress"
                    name="ipAddress"
                    value={editFormData.ipAddress}
                    onChange={handleEditInputChange}
                    placeholder="e.g. 192.168.1.100"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required={editFormData.clientType === "static"}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-api" className="text-brand-green">
                  API/Radius
                </Label>
                <Select
                  value={editFormData.api}
                  onValueChange={(value) => handleEditSelectChange("api", value)}
                  required
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select API/Radius" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="MikroTik API">MikroTik API</SelectItem>
                    <SelectItem value="Radius">Radius</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditClientDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Client
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
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteClient}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteClient} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedClients.length} selected clients? This action cannot be undone.`}
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
              {`Delete ${selectedClients.length} Clients`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PPPoEClients