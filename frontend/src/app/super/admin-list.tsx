import type React from "react"
import { useState, useEffect } from "react"
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
import { Plus, MoreVertical, Trash, Edit, Search, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

type Role = "admin" | "super_admin"

export type AdminRecord = {
  id: string
  username: string
  email: string
  phone: string
  role: Role
  createdAt: number
  status: "active" | "blocked"
}

const KEY = "super:admins"

function write(data: AdminRecord[]) {
  if (typeof localStorage === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(data))
}

function seed(): AdminRecord[] {
  const demo: AdminRecord[] = [
    {
      id: "1",
      username: "super",
      email: "root@zmooth.local",
      phone: "+254700000001",
      role: "super_admin",
      createdAt: Date.now() - 86400000 * 10,
      status: "active",
    },
    {
      id: "2",
      username: "alice",
      email: "admin@zmooth.local",
      phone: "+254700000002",
      role: "admin",
      createdAt: Date.now() - 86400000 * 7,
      status: "active",
    },
    {
      id: "3",
      username: "bob",
      email: "bob@zmooth.local",
      phone: "+254700000003",
      role: "admin",
      createdAt: Date.now() - 86400000 * 3,
      status: "blocked",
    },
  ]
  write(demo)
  return demo
}

function read(): AdminRecord[] {
  try {
    if (typeof localStorage === "undefined") return seed()
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as AdminRecord[]
  } catch {
    return seed()
  }
}

const AdminService = {
  list(): AdminRecord[] {
    return read()
  },

  create(input: { username: string; email: string; phone: string; role?: Role; password: string }): AdminRecord {
    const data = read()
    const rec: AdminRecord = {
      id: crypto.randomUUID(),
      username: input.username,
      email: input.email,
      phone: input.phone,
      role: input.role ?? "admin",
      createdAt: Date.now(),
      status: "active",
    }
    write([rec, ...data])
    return rec
  },

  update(id: string, update: Partial<Pick<AdminRecord, "username" | "email" | "phone" | "role" | "status">>): AdminRecord | null {
    const data = read()
    const idx = data.findIndex((a) => a.id === id)
    if (idx === -1) return null
  const updated = { ...data[idx], ...update }
    data[idx] = updated
    write(data)
    return updated
  },

  remove(id: string) {
    const data = read()
    write(data.filter((a) => a.id !== id))
  },
}

function AdminList() {
  function formatDateTime(dt: number) {
    const d = new Date(dt)
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  const navigate = useNavigate()
  const [admins, setAdmins] = useState<AdminRecord[]>([])
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editAdminId, setEditAdminId] = useState<string | null>(null)
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "admin" as Role,
  })
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "admin" as Role,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  const loadAdmins = () => setAdmins(AdminService.list())

  useEffect(() => {
    loadAdmins()
  }, [])

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
    setSelectedAdmins((prev) => (prev.includes(id) ? prev.filter((adminId) => adminId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedAdmins([])
    } else {
      setSelectedAdmins(admins.map((admin) => admin.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      AdminService.create(formData)
      setIsAddAdminDialogOpen(false)
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "admin",
      })
      loadAdmins()
      toast({
        title: "Success",
        description: "Admin created successfully!",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create admin",
      })
    }
  }

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Admin - Pre-fill form with selected admin data
  const handleEditClick = (admin: AdminRecord) => {
    setEditAdminId(admin.id)
    setEditFormData({
      username: admin.username,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      AdminService.update(editAdminId!, editFormData)
      setIsEditDialogOpen(false)
      setEditAdminId(null)
      loadAdmins()
      toast({
        title: "Success",
        description: "Admin updated successfully!",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update admin",
      })
    }
  }

  // Delete Admin
  const handleDeleteAdmin = (id: string) => {
    setDeleteAdminId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAdmin = () => {
    AdminService.remove(deleteAdminId!)
    setIsDeleteDialogOpen(false)
    setDeleteAdminId(null)
    loadAdmins()
    toast({
      title: "Success",
      description: "Admin deleted successfully!",
    })
  }

  const cancelDeleteAdmin = () => {
    setIsDeleteDialogOpen(false)
    setDeleteAdminId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "block") {
      selectedAdmins.forEach((id) => AdminService.update(id, { status: "blocked" }))
      toast({ title: "Success", description: `Blocked ${selectedAdmins.length} admin${selectedAdmins.length === 1 ? "" : "s"}` })
      setSelectedAdmins([])
      setSelectAll(false)
      loadAdmins()
    } else if (bulkAction === "activate") {
      selectedAdmins.forEach((id) => AdminService.update(id, { status: "active" }))
      toast({ title: "Success", description: `Activated ${selectedAdmins.length} admin${selectedAdmins.length === 1 ? "" : "s"}` })
      setSelectedAdmins([])
      setSelectAll(false)
      loadAdmins()
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedAdmins.length
    selectedAdmins.forEach((id) => AdminService.remove(id))
    setSelectedAdmins([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    loadAdmins()
    toast({
      title: "Success",
      description: `${deletedCount} admin${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
            <Button
              variant="ghost"
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Admin Management</CardTitle>
              <CardDescription>Manage system administrators and their roles</CardDescription>
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
                  <SelectItem value="block">Block Selected</SelectItem>
                  <SelectItem value="activate">Activate Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedAdmins.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Admin</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Admin</DialogTitle>
                    <DialogDescription className="text-white/80">Create a new administrator account</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Username</Label>
                          <Input
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter username"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-brand-green">Email</Label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter email"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Phone</Label>
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-brand-green">Role</Label>
                          <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-brand-green">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray text-white placeholder:text-white/70"
                          placeholder="Enter password"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddAdminDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Create Admin
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
                  <TableHead className="border-0">Username</TableHead>
                  <TableHead className="border-0">Email</TableHead>
                  <TableHead className="border-0">Phone</TableHead>
                  <TableHead className="border-0">Role</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="border-0">Created</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedAdmins.includes(admin.id)}
                        onCheckedChange={() => handleCheckboxChange(admin.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{admin.username}</TableCell>
                    <TableCell className="border-0">{admin.email}</TableCell>
                    <TableCell className="border-0">{admin.phone}</TableCell>
                    <TableCell className="border-0">
                      <Badge variant="outline" className="border-brand-green/40">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-0">
                      <Badge
                        className={admin.status === "active"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-red-600 text-white border-red-600"}
                      >
                        {admin.status === "active" ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-0">{formatDateTime(admin.createdAt)}</TableCell>
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
                            onClick={() => handleEditClick(admin)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-yellow-500/10 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                              AdminService.update(admin.id, { status: admin.status === "active" ? "blocked" : "active" })
                              loadAdmins()
                              toast({
                                title: "Success",
                                description: `Admin ${admin.status === "active" ? "blocked" : "activated"} successfully!`,
                              })
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-1 text-white" />
                            {admin.status === "active" ? "Block" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell className="text-center text-white/60 py-8" colSpan={7}>
                      No admins found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Admin</DialogTitle>
            <DialogDescription className="text-white/80">Update admin details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Username</Label>
                  <Input
                    value={editFormData.username}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, username: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Email</Label>
                  <Input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Phone</Label>
                  <Input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Role</Label>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, role: value as Role }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
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
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
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
              Are you sure you want to delete this admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteAdmin}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteAdmin} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedAdmins.length} selected admin${selectedAdmins.length === 1 ? "" : "s"}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              {`Delete ${selectedAdmins.length} Admin${selectedAdmins.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminList
