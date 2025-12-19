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
import { MoreVertical, Trash, Edit, Plus, Search, Download, Smartphone, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to settings
const initialSettings = [

  {
    id: "1",
    plan: "30-min",
    devices: 1,
    status: "active",
    description: "Single device for basic plan",
    active: true,
  },
  {
    id: "2",
    plan: "Daily",
    devices: 2,
    status: "active",
    description: "Two devices for daily users",
    active: true,
  },
  {
    id: "3",
    plan: "Weekly",
    devices: 3,
    status: "active",
    description: "Three devices for weekly subscribers",
    active: true,
  },
  {
    id: "4",
    plan: "Monthly",
    devices: 5,
    status: "active",
    description: "Five devices for monthly subscribers",
    active: true,
  },
]

export default function DeviceLimitsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(initialSettings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSettings, setSelectedSettings] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSetting, setEditingSetting] = useState<any>(null)
  const [formData, setFormData] = useState({
    plan: "",
    devices: "",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    plan: "",
    devices: "",
    description: "",
  })
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteSettingId, setDeleteSettingId] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedSettings((prev) => (prev.includes(id) ? prev.filter((settingId) => settingId !== id) : [...prev, id]))
  }

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedSettings([])
    } else {
      setSelectedSettings(settings.map((setting) => setting.id))
    }
    setSelectAll(!selectAll)
  }

  const filteredSettings = settings.filter(
    (setting) =>
      setting.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSetting = {
      id: (settings.length + 1).toString(),
      plan: formData.plan,
      devices: Number.parseInt(formData.devices),
      status: "active",
      description: formData.description,
      active: true,
    }
    setSettings((prev) => [...prev, newSetting])
    setIsAddDialogOpen(false)
    setFormData({
      plan: "",
      devices: "",
      description: "",
    })
    toast({
      title: "Success",
      description: "Device limit setting added successfully!",
    })
  }

  const handleEditSetting = (setting: any) => {
    setEditingSetting(setting)
    setEditFormData({
      plan: setting.plan,
      devices: setting.devices.toString(),
      description: setting.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === editingSetting.id
          ? {
              ...setting,
              plan: editFormData.plan,
              devices: Number.parseInt(editFormData.devices),
              description: editFormData.description,
            }
          : setting,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingSetting(null)
    toast({
      title: "Success",
      description: "Device limit setting updated successfully!",
    })
  }

  const handleDeleteSetting = (id: string) => {
    setDeleteSettingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSetting = () => {
    setSettings((prev) => prev.filter((setting) => setting.id !== deleteSettingId))
    setIsDeleteDialogOpen(false)
    setDeleteSettingId(null)
    toast({
      title: "Success",
      description: "Device limit setting deleted successfully!",
    })
  }

  const handleBulkAction = () => {
    if (selectedSettings.length === 0) {
      toast({
        title: "Error",
        description: "Please select settings first",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setSettings((prev) =>
        prev.map((setting) => (selectedSettings.includes(setting.id) ? { ...setting, status: "active" } : setting)),
      )
      setSelectedSettings([])
      toast({
        title: "Success",
        description: `${selectedSettings.length} settings activated successfully!`,
      })
    } else if (bulkAction === "deactivate") {
      setSettings((prev) =>
        prev.map((setting) => (selectedSettings.includes(setting.id) ? { ...setting, status: "inactive" } : setting)),
      )
      setSelectedSettings([])
      toast({
        title: "Success",
        description: `${selectedSettings.length} settings deactivated successfully!`,
      })
    } else if (bulkAction === "export") {
      // Only export selected settings
      const csvContent = [
        ["Plan", "Device Limit", "Status", "Description"].join(","),
        ...settings
          .filter((setting) => selectedSettings.includes(setting.id))
          .map((setting) => [setting.plan, setting.devices.toString(), setting.status, setting.description].join(",")),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "device-limits.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Selected settings exported successfully!",
      })
    }
    setBulkAction("")
  }

  const confirmBulkDelete = () => {
    setSettings((prev) => prev.filter((setting) => !selectedSettings.includes(setting.id)))
    setSelectedSettings([])
    setIsBulkDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Selected settings deleted successfully!",
    })
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              active: !setting.active,
              status: setting.active ? "inactive" : "active",
            }
          : setting,
      ),
    )
    const settingObj = settings.find((s) => s.id === id)
    toast({
      title: "Success",
      description: `Setting ${settingObj?.active ? "deactivated" : "activated"} successfully!`,
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
              <CardTitle className="text-brand-green">Device Limits</CardTitle>
              <CardDescription>Configure maximum device connections per plan</CardDescription>
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
                    // Only export selected settings
                    const csvContent = [
                      ["Plan", "Device Limit", "Status", "Description"].join(","),
                      ...settings
                        .filter((setting) => selectedSettings.includes(setting.id))
                        .map((setting) =>
                          [
                            setting.plan,
                            setting.devices.toString(),
                            setting.status,
                            setting.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "device-limits.csv"
                    a.click()
                    URL.revokeObjectURL(url)
                    toast({
                      title: "Success",
                      description: "Selected settings exported successfully!",
                    })
                    setBulkAction("")
                  } else {
                    handleBulkAction()
                  }
                }}
                disabled={selectedSettings.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4" />
                    <span>Add Device Limit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add Device Limit Setting</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Configure maximum device connections for a plan
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan" className="text-brand-green">
                          Plan Name
                        </Label>
                        <Input
                          id="plan"
                          name="plan"
                          value={formData.plan}
                          onChange={handleInputChange}
                          placeholder="Enter plan name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="devices" className="text-brand-green">
                          Device Limit
                        </Label>
                        <Input
                          id="devices"
                          name="devices"
                          type="number"
                          min="1"
                          max="50"
                          value={formData.devices}
                          onChange={handleInputChange}
                          placeholder="Enter device limit"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-brand-green">
                          Description
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter description"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
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
                        Add Setting
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
                  <TableHead>Plan</TableHead>
                  <TableHead>Device Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.map((setting) => (
                  <TableRow key={setting.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedSettings.includes(setting.id)}
                        onCheckedChange={() => handleCheckboxChange(setting.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{setting.plan}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-brand-green" />
                        {setting.devices} {setting.devices === 1 ? "device" : "devices"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {setting.active ? (
                        <Badge variant="success" className="capitalize">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer capitalize">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{setting.description}</TableCell>
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
                            onClick={() => handleEditSetting(setting)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Setting
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(setting.id)}
                          >
                            {setting.active ? (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-2 text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-2 text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => {
                              const csvContent = [
                                ["Plan", "Device Limit", "Status", "Description"].join(","),
                                [
                                  setting.plan,
                                  setting.devices.toString(),
                                  setting.status,
                                  setting.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `device-limit-${setting.plan}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Setting '${setting.plan}' exported successfully!`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2 text-white" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteSetting(setting.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Setting
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
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Device Limit Setting</DialogTitle>
            <DialogDescription className="text-white/80">Update device limit configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan" className="text-brand-green">
                  Plan Name
                </Label>
                <Input
                  id="edit-plan"
                  name="plan"
                  value={editFormData.plan}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-devices" className="text-brand-green">
                  Device Limit
                </Label>
                <Input
                  id="edit-devices"
                  name="devices"
                  type="number"
                  min="1"
                  max="50"
                  value={editFormData.devices}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-brand-green">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
            </div>
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
                Update Setting
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
              Are you sure you want to delete this device limit setting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteSetting} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedSettings.length} selected settings? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              {`Delete ${selectedSettings.length} Settings`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
