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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Trash, Edit, RefreshCw, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample firewall rules data
const initialFirewallRules = [
  {
    id: "1",
    ruleName: "Block P2P",
    protocol: "TCP/UDP",
    port: "6881-6889",
    action: "Drop",
    priority: 1,
    description: "Block peer-to-peer traffic",
    active: true,
  },
  {
    id: "2",
    ruleName: "Allow HTTPS",
    protocol: "TCP",
    port: "443",
    action: "Allow",
    priority: 2,
    description: "Allow secure web traffic",
    active: true,
  },
  {
    id: "3",
    ruleName: "Block Gaming",
    protocol: "UDP",
    port: "27015",
    action: "Drop",
    priority: 3,
    description: "Block gaming traffic during work hours",
    active: false,
  },
]

export default function Page() {
  const navigate = useNavigate()
  const [firewallRules, setFirewallRules] = useState(initialFirewallRules)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editRuleId, setEditRuleId] = useState<string | null>(null)
  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    ruleName: "",
    protocol: "TCP",
    port: "",
    action: "Allow",
    priority: "1",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    ruleName: "",
    protocol: "TCP",
    port: "",
    action: "Allow",
    priority: "1",
    description: "",
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

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
    setSelectedRules((prev) => (prev.includes(id) ? prev.filter((ruleId) => ruleId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRules([])
    } else {
      setSelectedRules(firewallRules.map((rule) => rule.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRule = {
      id: (firewallRules.length + 1).toString(),
      ruleName: formData.ruleName,
      protocol: formData.protocol,
      port: formData.port,
      action: formData.action,
      priority: Number(formData.priority),
      description: formData.description,
      active: true,
    }
    setFirewallRules((prev) => [...prev, newRule])
    setIsAddDialogOpen(false)
    setFormData({
      ruleName: "",
      protocol: "TCP",
      port: "",
      action: "Allow",
      priority: "1",
      description: "",
    })
    toast({
      title: "Success",
      description: "Firewall rule created successfully!",
    })
  }

  // Filter based on search query
  const filteredFirewallRules = firewallRules.filter(
    (rule) =>
      rule.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Rule - Pre-fill form with selected rule data
  const handleEditClick = (rule: any) => {
    setEditRuleId(rule.id)
    setEditFormData({
      ruleName: rule.ruleName,
      protocol: rule.protocol,
      port: rule.port,
      action: rule.action,
      priority: rule.priority.toString(),
      description: rule.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFirewallRules((prev) =>
      prev.map((rule) =>
        rule.id === editRuleId
          ? {
              ...rule,
              ruleName: editFormData.ruleName,
              protocol: editFormData.protocol,
              port: editFormData.port,
              action: editFormData.action,
              priority: Number(editFormData.priority),
              description: editFormData.description,
            }
          : rule,
      ),
    )
    setIsEditDialogOpen(false)
    setEditRuleId(null)
    toast({
      title: "Success",
      description: "Firewall rule updated successfully!",
    })
  }

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setFirewallRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, active: !rule.active } : rule)))
    const rule = firewallRules.find((r) => r.id === id)
    toast({
      title: "Success",
      description: `Firewall rule ${rule?.active ? "deactivated" : "activated"} successfully!`,
    })
  }

  // Delete Rule
  const handleDeleteRule = (id: string) => {
    setDeleteRuleId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRule = () => {
    setFirewallRules((prev) => prev.filter((rule) => rule.id !== deleteRuleId))
    setIsDeleteDialogOpen(false)
    setDeleteRuleId(null)
    toast({
      title: "Success",
      description: "Firewall rule deleted successfully!",
    })
  }

  const cancelDeleteRule = () => {
    setIsDeleteDialogOpen(false)
    setDeleteRuleId(null)
  }

  // Bulk Action Handler
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setFirewallRules((prev) =>
        prev.map((rule) => (selectedRules.includes(rule.id) ? { ...rule, active: true } : rule)),
      )
      toast({
        title: "Success",
        description: `${selectedRules.length} firewall rules activated successfully!`,
      })
      setSelectedRules([])
      setSelectAll(false)
    } else if (bulkAction === "deactivate") {
      setFirewallRules((prev) =>
        prev.map((rule) => (selectedRules.includes(rule.id) ? { ...rule, active: false } : rule)),
      )
      toast({
        title: "Success",
        description: `${selectedRules.length} firewall rules deactivated successfully!`,
      })
      setSelectedRules([])
      setSelectAll(false)
    }
    setBulkAction("")
  }

  // Bulk Delete Handlers
  const confirmBulkDelete = () => {
    const deletedCount = selectedRules.length
    setFirewallRules((prev) => prev.filter((rule) => !selectedRules.includes(rule.id)))
    setSelectedRules([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")
    toast({
      title: "Success",
      description: `${deletedCount} firewall rule${deletedCount === 1 ? "" : "s"} deleted successfully!`,
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
              <CardTitle className="text-brand-green">Firewall Rules Management</CardTitle>
              <CardDescription>Configure network traffic filtering and security rules</CardDescription>
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
                disabled={selectedRules.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Rule Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Firewall Rule</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Firewall Rule</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create a new firewall rule to control network traffic
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
                          <Label htmlFor="protocol" className="text-brand-green">
                            Protocol
                          </Label>
                          <Select
                            value={formData.protocol}
                          onValueChange={(value) => handleSelectChange("protocol", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="TCP">TCP</SelectItem>
                              <SelectItem value="UDP">UDP</SelectItem>
                              <SelectItem value="TCP/UDP">TCP/UDP</SelectItem>
                              <SelectItem value="ICMP">ICMP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="port" className="text-brand-green">
                            Port/Port Range
                          </Label>
                          <Input
                            id="port"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="e.g., 80 or 8000-8080"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="action" className="text-brand-green">
                            Action
                          </Label>
                          <Select
                            value={formData.action}
                            onValueChange={(value) => handleSelectChange("action", value)}
                          >
                            <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent className="glass border-brand-green/30">
                              <SelectItem value="Allow">Allow</SelectItem>
                              <SelectItem value="Drop">Drop</SelectItem>
                              <SelectItem value="Reject">Reject</SelectItem>
                            </SelectContent>
                          </Select>
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
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="bg-brand-darkgray text-white placeholder:text-white/70"
                            placeholder="Enter priority (1-100)"
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
                  <TableHead className="border-0">Protocol</TableHead>
                  <TableHead className="border-0">Port</TableHead>
                  <TableHead className="border-0">Action</TableHead>
                  <TableHead className="border-0">Priority</TableHead>
                  <TableHead className="border-0">Description</TableHead>
                  <TableHead className="border-0">Status</TableHead>
                  <TableHead className="text-right border-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFirewallRules.map((rule) => (
                  <TableRow key={rule.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-0">
                      <Checkbox
                        checked={selectedRules.includes(rule.id)}
                        onCheckedChange={() => handleCheckboxChange(rule.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-0">{rule.ruleName}</TableCell>
                    <TableCell className="border-0">{rule.protocol}</TableCell>
                    <TableCell className="border-0">{rule.port}</TableCell>
                    <TableCell className="border-0">
                      <Badge variant={rule.action === "Allow" ? "success" : "destructive"}>{rule.action}</Badge>
                    </TableCell>
                    <TableCell className="border-0">{rule.priority}</TableCell>
                    <TableCell className="border-0">{rule.description}</TableCell>
                    <TableCell className="border-0">
                      {rule.active ? (
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
                            onClick={() => handleEditClick(rule)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(rule.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {rule.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteRule(rule.id)}
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
            <DialogTitle className="text-brand-green">Edit Firewall Rule</DialogTitle>
            <DialogDescription className="text-white/80">Edit firewall rule details</DialogDescription>
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
                  <Label className="text-brand-green">Protocol</Label>
                  <Select
                    value={editFormData.protocol}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, protocol: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="TCP/UDP">TCP/UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Port/Port Range</Label>
                  <Input
                    value={editFormData.port}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, port: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="e.g., 80 or 8000-8080"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Action</Label>
                  <Select
                    value={editFormData.action}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, action: value }))}
                  >
                    <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="Allow">Allow</SelectItem>
                      <SelectItem value="Drop">Drop</SelectItem>
                    <SelectItem value="Reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Priority</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, priority: e.target.value }))}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Enter priority (1-100)"
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
              Are you sure you want to delete this firewall rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteRule}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteRule}
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
              {`Are you sure you want to delete ${selectedRules.length} selected firewall rule${selectedRules.length === 1 ? "" : "s"}? This action cannot be undone.`}
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
              {`Delete ${selectedRules.length} Rule${selectedRules.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
