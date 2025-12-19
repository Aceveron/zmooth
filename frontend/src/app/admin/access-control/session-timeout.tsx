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
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Sample session timeout data
const initialSessionTimeouts = [
  {
    id: "1",
    ruleName: "Standard Users",
    userGroup: "Basic",
    timeoutMinutes: 30,
    warningMinutes: 5,
    autoLogout: true,
    active: true,
  },
  {
    id: "2",
    ruleName: "Premium Users",
    userGroup: "Premium",
    timeoutMinutes: 120,
    warningMinutes: 10,
    autoLogout: true,
    active: true,
  },
  {
    id: "3",
    ruleName: "Guest Access",
    userGroup: "Guest",
    timeoutMinutes: 15,
    warningMinutes: 2,
    autoLogout: true,
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [sessionTimeouts, setSessionTimeouts] = useState(initialSessionTimeouts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTimeoutId, setEditTimeoutId] = useState<string | null>(null)
  const [selectedTimeouts, setSelectedTimeouts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    ruleName: "",
    userGroup: "Basic",
    timeoutMinutes: "30",
    warningMinutes: "5",
    autoLogout: true,
  })
  const [editFormData, setEditFormData] = useState({
    ruleName: "",
    userGroup: "Basic",
    timeoutMinutes: "30",
    warningMinutes: "5",
    autoLogout: true,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTimeoutId, setDeleteTimeoutId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedTimeouts((prev) => (prev.includes(id) ? prev.filter((timeoutId) => timeoutId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedTimeouts([])
    } else {
      setSelectedTimeouts(sessionTimeouts.map((timeout) => timeout.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTimeout = {
      id: (sessionTimeouts.length + 1).toString(),
      ruleName: formData.ruleName,
      userGroup: formData.userGroup,
      timeoutMinutes: Number.parseInt(formData.timeoutMinutes),
      warningMinutes: Number.parseInt(formData.warningMinutes),
      autoLogout: formData.autoLogout,
      active: true,
    }
    setSessionTimeouts((prev) => [...prev, newTimeout])
    setIsAddDialogOpen(false)
    setFormData({
      ruleName: "",
      userGroup: "Basic",
      timeoutMinutes: "30",
      warningMinutes: "5",
      autoLogout: true,
    })
    toast({
      title: "Success",
      description: "Session timeout rule created successfully!",
    })
  }

  // Filter based on search query
  const filteredSessionTimeouts = sessionTimeouts.filter(
    (timeout) =>
      timeout.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeout.userGroup.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Timeout - Pre-fill form with selected timeout data
  const handleEditClick = (timeout: any) => {
    setEditTimeoutId(timeout.id)
    setEditFormData({
      ruleName: timeout.ruleName,
      userGroup: timeout.userGroup,
      timeoutMinutes: timeout.timeoutMinutes.toString(),
      warningMinutes: timeout.warningMinutes.toString(),
      autoLogout: timeout.autoLogout,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSessionTimeouts((prev) =>
      prev.map((timeout) =>
        timeout.id === editTimeoutId
          ? {
              ...timeout,
              ruleName: editFormData.ruleName,
              userGroup: editFormData.userGroup,
              timeoutMinutes: Number.parseInt(editFormData.timeoutMinutes),
              warningMinutes: Number.parseInt(editFormData.warningMinutes),
              autoLogout: editFormData.autoLogout,
            }
          : timeout,
      ),
    )
    setIsEditDialogOpen(false)
    setEditTimeoutId(null)
    toast({
      title: "Success",
      description: "Session timeout rule updated successfully!",
    })
  }

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setSessionTimeouts((prev) =>
      prev.map((timeout) => (timeout.id === id ? { ...timeout, active: !timeout.active } : timeout)),
    )
    const timeout = sessionTimeouts.find((t) => t.id === id)
    toast({
      title: "Success",
      description: `Session timeout rule ${timeout?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Timeout
  const handleDeleteTimeout = (id: string) => {
    setDeleteTimeoutId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTimeout = () => {
    setSessionTimeouts((prev) => prev.filter((timeout) => timeout.id !== deleteTimeoutId))
    setIsDeleteDialogOpen(false)
    setDeleteTimeoutId(null)
    toast({
      title: "Success",
      description: "Session timeout rule deleted successfully!",
    })
  }

  const cancelDeleteTimeout = () => {
    setIsDeleteDialogOpen(false)
    setDeleteTimeoutId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setSessionTimeouts((prev) =>
        prev.map((timeout) => (selectedTimeouts.includes(timeout.id) ? { ...timeout, active: true } : timeout)),
      )
      toast({
        title: "Success",
        description: `${selectedTimeouts.length} session timeout rules activated successfully!`,
      })
      setSelectedTimeouts([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setSessionTimeouts((prev) =>
        prev.map((timeout) => (selectedTimeouts.includes(timeout.id) ? { ...timeout, active: false } : timeout)),
      )
      toast({
        title: "Success",
        description: `${selectedTimeouts.length} session timeout rules deactivated successfully!`,
      })
      setSelectedTimeouts([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedTimeouts.length
    setSessionTimeouts((prev) => prev.filter((timeout) => !selectedTimeouts.includes(timeout.id)))
    setSelectedTimeouts([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} session timeout rule${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
                <Clock className="h-5 w-5" />
                Session Timeout Rules
              </CardTitle>
              <CardDescription>Configure automatic session timeout settings</CardDescription>
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
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedTimeouts.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Timeout Rule</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Session Timeout Rule</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new session timeout rule for user groups
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-brand-green">Rule Name</Label>
                          <Input
                            id="ruleName"
                            name="ruleName"
                            value={formData.ruleName}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter rule name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="userGroup" className="text-brand-green">
                            User Group
                          </Label>
                          <Select
                            value={formData.userGroup}
                            onValueChange={(value) => handleSelectChange("userGroup", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select user group" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timeoutMinutes" className="text-brand-green">
                            Timeout (Minutes)
                          </Label>
                          <Input
                            id="timeoutMinutes"
                            name="timeoutMinutes"
                            type="number"
                            min="5"
                            max="480"
                            value={formData.timeoutMinutes}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter timeout in minutes"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="warningMinutes" className="text-brand-green">
                            Warning (Minutes)
                          </Label>
                          <Input
                            id="warningMinutes"
                            name="warningMinutes"
                            type="number"
                            min="1"
                            max="30"
                            value={formData.warningMinutes}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Warning before timeout"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoLogout"
                          name="autoLogout"
                          checked={formData.autoLogout}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, autoLogout: checked as boolean }))
                          }
                          className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        />
                        <Label htmlFor="autoLogout" className="text-brand-green">
                          Enable automatic logout
                        </Label>
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
                          Create Rule
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
                  <TableHead className="border-0">Rule Name</TableHead>
                  <TableHead className="border-0">User Group</TableHead>
                  <TableHead className="border-0">Timeout</TableHead>
                  <TableHead className="border-0">Warning</TableHead>
                  <TableHead className="border-0">Auto Logout</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessionTimeouts.map((timeout) => (
                  <TableRow key={timeout.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedTimeouts.includes(timeout.id)}
                        onCheckedChange={() => handleCheckboxChange(timeout.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{timeout.ruleName}</TableCell>
                    <TableCell className="border-0">{timeout.userGroup}</TableCell>
                    <TableCell className="border-0">{timeout.timeoutMinutes} min</TableCell>
                    <TableCell className="border-0">{timeout.warningMinutes} min</TableCell>
                    <TableCell className="border-0">
                      {timeout.autoLogout ? (
                        <Badge variant="success">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="border-0">
                      {timeout.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">
                          Inactive
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
                            onClick={() => handleEditClick(timeout)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(timeout.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {timeout.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteTimeout(timeout.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Rule
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
            <DialogTitle className="text-brand-green">Edit Session Timeout Rule</DialogTitle>
            <DialogDescription className="text-white/80">Edit session timeout rule details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Rule Name</Label>
                  <Input
                    value={editFormData.ruleName}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, ruleName: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter rule name"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">User Group</Label>
                  <Select
                    value={editFormData.userGroup}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, userGroup: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Timeout (Minutes)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="480"
                    value={editFormData.timeoutMinutes}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, timeoutMinutes: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter timeout in minutes"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Warning (Minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={editFormData.warningMinutes}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, warningMinutes: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Warning before timeout"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={editFormData.autoLogout}
                  onCheckedChange={(checked) =>
                    setEditFormData((prev) => ({ ...prev, autoLogout: checked as boolean }))
                  }
                  className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                />
                <Label className="text-brand-green">Enable automatic logout</Label>
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
              Are you sure you want to delete this session timeout rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteTimeout}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteTimeout}
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
              {`Are you sure you want to delete ${selectedTimeouts.length} selected session timeout rule${selectedTimeouts.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedTimeouts.length} Rule${selectedTimeouts.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
