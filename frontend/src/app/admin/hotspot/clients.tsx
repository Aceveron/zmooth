"use client"
import { useNavigate } from "react-router-dom"
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
import { MoreVertical, Trash, Edit, Search, UserPlus, Wifi, WifiOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample hotspot clients data
const initialClients = [
  {
    id: "1",
    name: "John Doe",
    username: "john_doe",
    ip: "192.168.1.101",
    mac: "00:1A:2B:3C:4D:5E",
    uptime: "2h 15m",
    download: "1.2 GB",
    upload: "120 MB",
    plan: "Daily Unlimited",
    status: "online" as const,
    lastSeen: "Active now",
    email: "john@example.com",
    phone: "+254712345678",
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "jane_smith",
    ip: "192.168.1.102",
    mac: "00:2B:3C:4D:5E:6F",
    uptime: "45m",
    download: "350 MB",
    upload: "50 MB",
    plan: "Weekly Super",
    status: "online" as const,
    lastSeen: "Active now",
    email: "jane@example.com",
    phone: "+254712345679",
  },
  {
    id: "3",
    name: "Robert Johnson",
    username: "robert_johnson",
    ip: "192.168.1.103",
    mac: "00:3C:4D:5E:6F:7G",
    uptime: "0m",
    download: "0 MB",
    upload: "0 MB",
    plan: "Hourly Unlimited",
    status: "offline" as const,
    lastSeen: "2 hours ago",
    email: "robert@example.com",
    phone: "+254712345680",
  },
  {
    id: "4",
    name: "Sarah Williams",
    username: "sarah_williams",
    ip: "192.168.1.104",
    mac: "00:4D:5E:6F:7G:8H",
    uptime: "4h 30m",
    download: "3.5 GB",
    upload: "450 MB",
    plan: "Monthly Rocket",
    status: "online" as const,
    lastSeen: "Active now",
    email: "sarah@example.com",
    phone: "+254712345681",
  },
  {
    id: "5",
    name: "Michael Brown",
    username: "michael_brown",
    ip: "192.168.1.105",
    mac: "00:5E:6F:7G:8H:9I",
    uptime: "0m",
    download: "0 MB",
    upload: "0 MB",
    plan: "30 Min",
    status: "offline" as const,
    lastSeen: "1 day ago",
    email: "michael@example.com",
    phone: "+254712345682",
  },
]

// Sample plans
const plans = [
  { id: "1", name: "30 Min" },
  { id: "2", name: "Hourly Unlimited" },
  { id: "3", name: "Daily Unlimited" },
  { id: "4", name: "Weekly Super" },
  { id: "5", name: "Monthly Rocket" },
]

type Client = (typeof initialClients)[0]

export function HotspotClients() {
  const navigate = useNavigate()
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [clientsState, setClientsState] = useState(initialClients)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    plan: "",
    mac: "",
    email: "",
    phone: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null)

  // Generate unique ID for new clients
  const generateId = () => {
    return (Math.max(...clientsState.map((c) => Number.parseInt(c.id))) + 1).toString()
  }

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
    setSelectedClients((prev) => {
      const newSelected = prev.includes(id) ? prev.filter((clientId) => clientId !== id) : [...prev, id]
      setSelectAll(newSelected.length === filteredClients.length && filteredClients.length > 0)
      return newSelected
    })
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedClients([])
    } else {
      setSelectedClients(filteredClients.map((client) => client.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter clients based on search query
  const filteredClients = clientsState.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      plan: "",
      mac: "",
      email: "",
      phone: "",
    })
  }

  // Handle form submission for adding new client
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.username || !formData.password || !formData.plan) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists
    if (clientsState.some((client) => client.username === formData.username)) {
      toast({
        title: "Error",
        description: "Username already exists",
        variant: "destructive",
      })
      return
    }

    const newClient: Client = {
      id: generateId(),
      name: formData.name,
      username: formData.username,
      ip: `192.168.1.${100 + Number.parseInt(generateId())}`,
      mac:
        formData.mac ||
        `00:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
      uptime: "0m",
      download: "0 MB",
      upload: "0 MB",
      plan: formData.plan,
      status: "offline",
      lastSeen: "Never",
      email: formData.email,
      phone: formData.phone,
    }

    setClientsState((prev) => [...prev, newClient])
    setIsAddClientDialogOpen(false)
    resetFormData()

    toast({
      title: "Success",
      description: `Client ${formData.name} has been added successfully`,
    })
  }

  // Handle edit client
  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      username: client.username,
      password: "", // Don't pre-fill password for security
      plan: client.plan,
      mac: client.mac,
      email: client.email || "",
      phone: client.phone || "",
    })
    setIsEditClientDialogOpen(true)
  }

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingClient) return

    // Validate required fields
    if (!formData.name || !formData.username || !formData.plan) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists (excluding current client)
    if (clientsState.some((client) => client.username === formData.username && client.id !== editingClient.id)) {
      toast({
        title: "Error",
        description: "Username already exists",
        variant: "destructive",
      })
      return
    }

    setClientsState((prev) =>
      prev.map((client) =>
        client.id === editingClient.id
          ? {
              ...client,
              name: formData.name,
              username: formData.username,
              plan: formData.plan,
              mac: formData.mac || client.mac,
              email: formData.email,
              phone: formData.phone,
            }
          : client,
      ),
    )

    setIsEditClientDialogOpen(false)
    setEditingClient(null)
    resetFormData()

    toast({
      title: "Success",
      description: `Client ${formData.name} has been updated successfully`,
    })
  }

  // Handle disconnect client
  const handleDisconnect = (id: string) => {
    const client = clientsState.find((c) => c.id === id)
    if (!client) return

    setClientsState((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "offline" as const,
              uptime: "0m",
              lastSeen: "Just now",
            }
          : c,
      ),
    )

    toast({
      title: "Success",
      description: `${client.name} has been disconnected`,
    })
  }

  // Handle connect client
  const handleConnect = (id: string) => {
    const client = clientsState.find((c) => c.id === id)
    if (!client) return

    setClientsState((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "online" as const,
              uptime: "0m",
              lastSeen: "Active now",
            }
          : c,
      ),
    )

    toast({
      title: "Success",
      description: `${client.name} has been connected`,
    })
  }

  // Handle delete single client
  const handleDeleteClient = (id: string) => {
    setDeleteClientId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteClient = () => {
    if (!deleteClientId) return

    const client = clientsState.find((c) => c.id === deleteClientId)
    setClientsState((prev) => prev.filter((client) => client.id !== deleteClientId))
    setIsDeleteDialogOpen(false)
    setDeleteClientId(null)

    toast({
      title: "Success",
      description: `Client ${client?.name} has been deleted`,
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
        description: "Please select clients to perform bulk action",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "disconnect") {
      const onlineClients = clientsState.filter((c) => selectedClients.includes(c.id) && c.status === "online")

      setClientsState((prev) =>
        prev.map((c) =>
          selectedClients.includes(c.id) && c.status === "online"
            ? {
                ...c,
                status: "offline" as const,
                uptime: "0m",
                lastSeen: "Just now",
              }
            : c,
        ),
      )

      setSelectedClients([])
      setSelectAll(false)
      setBulkAction("")

      toast({
        title: "Success",
        description: `${onlineClients.length} clients have been disconnected`,
      })
    } else if (bulkAction === "connect") {
      const offlineClients = clientsState.filter((c) => selectedClients.includes(c.id) && c.status === "offline")

      setClientsState((prev) =>
        prev.map((c) =>
          selectedClients.includes(c.id) && c.status === "offline"
            ? {
                ...c,
                status: "online" as const,
                uptime: "0m",
                lastSeen: "Active now",
              }
            : c,
        ),
      )

      setSelectedClients([])
      setSelectAll(false)
      setBulkAction("")

      toast({
        title: "Success",
        description: `${offlineClients.length} clients have been connected`,
      })
    }
  }

  const confirmBulkDelete = () => {
    const deletedCount = selectedClients.length
    setClientsState((prev) => prev.filter((client) => !selectedClients.includes(client.id)))
    setSelectedClients([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")

    toast({
      title: "Success",
      description: `${deletedCount} clients have been deleted`,
    })
  }

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
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
              <CardTitle className="text-brand-green">Hotspot Clients</CardTitle>
              <CardDescription>Manage connected hotspot clients and their sessions</CardDescription>
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
                  <SelectItem value="disconnect">Disconnect Selected</SelectItem>
                  <SelectItem value="connect">Connect Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedClients.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <div className="relative w-[180px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen whitespace-nowrap">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Client</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Hotspot Client</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new client for hotspot access
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-brand-green">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter client name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="space-y-2">
                        <Label htmlFor="plan" className="text-brand-green">
                          Plan
                        </Label>
                        <Select
                          value={formData.plan}
                          onValueChange={(value) => handleSelectChange("plan", value)}
                          required
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {plans.map((p) => (
                              <SelectItem key={p.id} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-brand-green">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-brand-green">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddClientDialogOpen(false)
                          resetFormData()
                        }}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={false}
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
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="min-w-[120px]">Full Name</TableHead>
                  <TableHead className="min-w-[100px]">Username</TableHead>
                  <TableHead className="min-w-[120px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">IP Address</TableHead>
                  <TableHead className="min-w-[140px]">MAC Address</TableHead>
                  <TableHead className="min-w-[80px]">Uptime</TableHead>
                  <TableHead className="min-w-[90px]">Download</TableHead>
                  <TableHead className="min-w-[80px]">Upload</TableHead>
                  <TableHead className="min-w-[120px]">Plan</TableHead>
                  <TableHead className="min-w-[100px]">Last Seen</TableHead>
                  <TableHead className="min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleCheckboxChange(client.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.username}</TableCell>
                    <TableCell>{client.email || "N/A"}</TableCell>
                    <TableCell>{client.ip}</TableCell>
                    <TableCell className="font-mono text-xs">{client.mac}</TableCell>
                    <TableCell>{client.uptime}</TableCell>
                    <TableCell>{client.download}</TableCell>
                    <TableCell>{client.upload}</TableCell>
                    <TableCell>{client.plan}</TableCell>
                    <TableCell>{client.lastSeen}</TableCell>
                    <TableCell>{client.phone || "N/A"}</TableCell>
                    <TableCell>
                      {client.status === "online" ? (
                        <Badge variant="success">Online</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Offline</Badge>
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
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Client
                          </DropdownMenuItem>
                          {client.status === "online" ? (
                            <DropdownMenuItem
                              className="text-white hover:bg-brand-green/10 cursor-pointer"
                              onClick={() => handleDisconnect(client.id)}
                            >
                              <WifiOff className="h-4 w-4 mr-2 text-white" />
                              Disconnect
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-white hover:bg-brand-green/10 cursor-pointer"
                              onClick={() => handleConnect(client.id)}
                            >
                              <Wifi className="h-4 w-4 mr-2 text-white" />
                              Connect
                            </DropdownMenuItem>
                          )}
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
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8 text-white/60">
                      {searchQuery ? "No clients found matching your search." : "No clients found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Hotspot Client</DialogTitle>
            <DialogDescription className="text-white/80">Update client information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-brand-green">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username" className="text-brand-green">
                    Username
                  </Label>
                  <Input
                    id="edit-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-brand-green">
                    New Password
                  </Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plan" className="text-brand-green">
                  Plan
                </Label>
                <Input
                  id="edit-plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  placeholder="Enter plan name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-brand-green">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-brand-green">
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditClientDialogOpen(false)
                  setEditingClient(null)
                  resetFormData()
                }}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={false}
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
              disabled={false}
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
              Are you sure you want to delete {selectedClients.length} selected clients? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete {selectedClients.length} Clients
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HotspotClients
