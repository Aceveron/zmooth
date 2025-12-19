"use client"

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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search, Shield } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample authentication options data
const initialAuthOptions = [
  {
    id: "1",
    authMethod: "Username/Password",
    provider: "Internal",
    priority: 1,
    description: "Standard username and password authentication",
    enabled: true,
    userCount: 150,
  },
  {
    id: "2",
    authMethod: "SMS OTP",
    provider: "Twilio",
    priority: 2,
    description: "SMS-based one-time password verification",
    enabled: true,
    userCount: 85,
  },
  {
    id: "3",
    authMethod: "Google OAuth",
    provider: "Google",
    priority: 3,
    description: "Google account authentication",
    enabled: true,
    userCount: 45,
  },
  {
    id: "4",
    authMethod: "LDAP",
    provider: "Active Directory",
    priority: 4,
    description: "Corporate LDAP authentication",
    enabled: false,
    userCount: 0,
  },
]

export default function Page() {
  const navigate = useNavigate()
  useEffect(() => {
    // Quick runtime check for browser console
    // eslint-disable-next-line no-console
    console.log("[DEBUG] auth-options mounted")
  }, [])
  const [authOptions, setAuthOptions] = useState(initialAuthOptions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editOptionId, setEditOptionId] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    authMethod: "",
    provider: "",
    priority: "1",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    authMethod: "",
    provider: "",
    priority: "1",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null)
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
    setSelectedOptions((prev) => (prev.includes(id) ? prev.filter((optionId) => optionId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedOptions([])
    } else {
      setSelectedOptions(authOptions.map((option) => option.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOption = {
      id: (authOptions.length + 1).toString(),
      authMethod: formData.authMethod,
      provider: formData.provider,
      priority: Number.parseInt(formData.priority),
      description: formData.description,
      enabled: true,
      userCount: 0,
    }
    setAuthOptions((prev) => [...prev, newOption])
    setIsAddDialogOpen(false)
    setFormData({
      authMethod: "",
      provider: "",
      priority: "1",
      description: "",
    })
    toast({
      title: "Success",
      description: "Authentication method created successfully!",
    })
  }

  // Filter based on search query
  const filteredAuthOptions = authOptions.filter(
    (option) =>
      option.authMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Option - Pre-fill form with selected option data
  const handleEditClick = (option: any) => {
    setEditOptionId(option.id)
    setEditFormData({
      authMethod: option.authMethod,
      provider: option.provider,
      priority: option.priority.toString(),
      description: option.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthOptions((prev) =>
      prev.map((option) =>
        option.id === editOptionId
          ? {
              ...option,
              authMethod: editFormData.authMethod,
              provider: editFormData.provider,
              priority: Number.parseInt(editFormData.priority),
              description: editFormData.description,
            }
          : option,
      ),
    )
    setIsEditDialogOpen(false)
    setEditOptionId(null)
    toast({
      title: "Success",
      description: "Authentication method updated successfully!",
    })
  }

  // Toggle Enabled/Disabled
  const handleToggleEnabled = (id: string) => {
    setAuthOptions((prev) =>
      prev.map((option) => (option.id === id ? { ...option, enabled: !option.enabled } : option)),
    )
    const option = authOptions.find((o) => o.id === id)
    toast({
      title: "Success",
      description: `Authentication method ${option?.enabled ? "disabled" : "enabled"} successfully!`,
    })
  }

  // Delete Option
  const handleDeleteOption = (id: string) => {
    setDeleteOptionId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteOption = () => {
    setAuthOptions((prev) => prev.filter((option) => option.id !== deleteOptionId))
    setIsDeleteDialogOpen(false)
    setDeleteOptionId(null)
    toast({
      title: "Success",
      description: "Authentication method deleted successfully!",
    })
  }

  const cancelDeleteOption = () => {
    setIsDeleteDialogOpen(false)
    setDeleteOptionId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "enable") {
      setAuthOptions((prev) =>
        prev.map((option) => (selectedOptions.includes(option.id) ? { ...option, enabled: true } : option)),
      )
      toast({
        title: "Success",
        description: `${selectedOptions.length} authentication methods enabled successfully!`,
      })
      setSelectedOptions([])
      setSelectAll(false)
    } else if (bulkAction === "disable") {
      setAuthOptions((prev) =>
        prev.map((option) => (selectedOptions.includes(option.id) ? { ...option, enabled: false } : option)),
      )
      toast({
        title: "Success",
        description: `${selectedOptions.length} authentication methods disabled successfully!`,
      })
      setSelectedOptions([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedOptions.length
    setAuthOptions((prev) => prev.filter((option) => !selectedOptions.includes(option.id)))
    setSelectedOptions([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} authentication method${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Options
              </CardTitle>
              <CardDescription>Configure available authentication methods</CardDescription>
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
                  <SelectItem value="enable">Enable Selected</SelectItem>
                  <SelectItem value="disable">Disable Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedOptions.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search auth methods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Auth Method</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Authentication Method</DialogTitle>
                  <DialogDescription className="text-white/80">
                      Configure a new authentication method for users
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Authentication Method</Label>
                          <Input
                            id="authMethod"
                            name="authMethod"
                            value={formData.authMethod}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="e.g., LDAP, OAuth, etc."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="provider" className="text-brand-green">
                            Provider
                          </Label>
                          <Input
                            id="provider"
                            name="provider"
                            value={formData.provider}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="e.g., Google, Microsoft, etc."
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority" className="text-brand-green">
                            Priority
                          </Label>
                          <Input
                            id="priority"
                            name="priority"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="1-10 (1 = highest)"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-brand-green">
                            Description
                          </Label>
                          <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                          Create Method
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
                  <TableHead className="border-0">Method</TableHead>
                  <TableHead className="border-0">Provider</TableHead>
                  <TableHead className="border-0">Priority</TableHead>
                  <TableHead className="border-0">Users</TableHead>
                  <TableHead className="border-0">Description</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthOptions.map((option) => (
                  <TableRow key={option.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleCheckboxChange(option.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">
                      {option.authMethod}
                    </TableCell>
                    <TableCell className="border-0">{option.provider}</TableCell>
                    <TableCell className="border-0">
                      {option.priority}
                    </TableCell>
                    <TableCell className="border-0">{option.userCount}</TableCell>
                    <TableCell className="border-0 max-w-[200px] truncate">{option.description}</TableCell>
                    <TableCell className="border-0">
                      {option.enabled ? (
                        <Badge variant="success">Enabled</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          Disabled
                        </Badge>
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
                            onClick={() => handleEditClick(option)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Method
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleEnabled(option.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {option.enabled ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteOption(option.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Method
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Authentication Method</DialogTitle>
            <DialogDescription className="text-white/80">Edit authentication method details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Authentication Method</Label>
                  <Input
                    value={editFormData.authMethod}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, authMethod: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="e.g., LDAP, OAuth, etc."
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Provider</Label>
                  <Input
                    value={editFormData.provider}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, provider: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="e.g., Google, Microsoft, etc."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Priority</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, priority: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="1-10 (1 = highest)"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Description</Label>
                  <Input
                    value={editFormData.description}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter description"
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
              Are you sure you want to delete this authentication method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteOption}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteOption}
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
              {`Are you sure you want to delete ${selectedOptions.length} selected authentication method${selectedOptions.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedOptions.length} Method${selectedOptions.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
