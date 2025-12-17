"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreVertical, Edit, Trash, Search, Download, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to initialSettings
const initialSettings = [
 {
    id: "1",
    plan: "30-min",
    download: "512 kbps",
    upload: "256 kbps",
    downloadKbps: 512,
    uploadKbps: 256,
    status: "active",
    description: "Basic bandwidth for short sessions",
    active: true,
  },
  {
    id: "2",
    plan: "Daily",
    download: "2 Mbps",
    upload: "1 Mbps",
    downloadKbps: 2048,
    uploadKbps: 1024,
    status: "active",
    description: "Standard bandwidth for daily users",
    active: true,
  },
  {
    id: "3",
    plan: "Weekly",
    download: "5 Mbps",
    upload: "2 Mbps",
    downloadKbps: 5120,
    uploadKbps: 2048,
    status: "active",
    description: "Enhanced bandwidth for weekly subscribers",
    active: true,
  },
]

export default function BandwidthControlPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(initialSettings)
  const [selectedSettings, setSelectedSettings] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<any>(null)
  const [deleteSettingId, setDeleteSettingId] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState("")
  const [formData, setFormData] = useState({
    plan: "",
    downloadSpeed: "",
    uploadSpeed: "",
    downloadUnit: "kbps",
    uploadUnit: "kbps",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    plan: "",
    downloadSpeed: "",
    uploadSpeed: "",
    downloadUnit: "kbps",
    uploadUnit: "kbps",
    description: "",
  })

  const formatBandwidth = (kbps: number) => {
    if (kbps >= 1024) {
      return `${kbps / 1024} Mbps`
    }
    return `${kbps} kbps`
  }

  const convertToKbps = (speed: string, unit: string) => {
    const speedNum = Number.parseInt(speed)
    return unit === "mbps" ? speedNum * 1024 : speedNum
  }

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
    setSelectedSettings((prev) => (prev.includes(id) ? prev.filter((settingId) => settingId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedSettings([])
    } else {
      setSelectedSettings(settings.map((setting) => setting.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter settings based on search query
  const filteredSettings = settings.filter(
    (setting) =>
      setting.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.download.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.upload.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const downloadKbps = convertToKbps(formData.downloadSpeed, formData.downloadUnit)
    const uploadKbps = convertToKbps(formData.uploadSpeed, formData.uploadUnit)

    const newSetting = {
      id: (settings.length + 1).toString(),
      plan: formData.plan,
      download: formatBandwidth(downloadKbps),
      upload: formatBandwidth(uploadKbps),
      downloadKbps,
      uploadKbps,
      status: "active",
      description: formData.description,
      active: true,
    }
    setSettings((prev) => [...prev, newSetting])
    setIsAddDialogOpen(false)
    setFormData({
      plan: "",
      downloadSpeed: "",
      uploadSpeed: "",
      downloadUnit: "kbps",
      uploadUnit: "kbps",
      description: "",
    })
    toast({
      title: "Success",
      description: "Bandwidth control setting added successfully!",
    })
  }

  // Handle edit setting
  const handleEdit = (setting: any) => {
    setEditingSetting(setting)
    const downloadUnit = setting.downloadKbps >= 1024 ? "mbps" : "kbps"
    const uploadUnit = setting.uploadKbps >= 1024 ? "mbps" : "kbps"
    const downloadSpeed =
      downloadUnit === "mbps" ? (setting.downloadKbps / 1024).toString() : setting.downloadKbps.toString()
    const uploadSpeed = uploadUnit === "mbps" ? (setting.uploadKbps / 1024).toString() : setting.uploadKbps.toString()

    setEditFormData({
      plan: setting.plan,
      downloadSpeed,
      uploadSpeed,
      downloadUnit,
      uploadUnit,
      description: setting.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const downloadKbps = convertToKbps(editFormData.downloadSpeed, editFormData.downloadUnit)
    const uploadKbps = convertToKbps(editFormData.uploadSpeed, editFormData.uploadUnit)

    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === editingSetting.id
          ? {
              ...setting,
              plan: editFormData.plan,
              download: formatBandwidth(downloadKbps),
              upload: formatBandwidth(uploadKbps),
              downloadKbps,
              uploadKbps,
              description: editFormData.description,
            }
          : setting,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingSetting(null)
    toast({
      title: "Success",
      description: "Bandwidth control setting updated successfully!",
    })
  }

  // Handle delete single setting
  const handleDelete = (id: string) => {
    setDeleteSettingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSetting = () => {
    setSettings((prev) => prev.filter((setting) => setting.id !== deleteSettingId))
    setIsDeleteDialogOpen(false)
    setDeleteSettingId(null)
    toast({
      title: "Success",
      description: "Bandwidth control setting deleted successfully!",
    })
  }

  const cancelDeleteSetting = () => {
    setIsDeleteDialogOpen(false)
    setDeleteSettingId(null)
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

  // Handle bulk actions
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
      const csvContent = [
        ["Plan", "Download", "Upload", "Status", "Description"].join(","),
        ...settings
          .filter((setting) => selectedSettings.includes(setting.id))
          .map((setting) => [setting.plan, setting.download, setting.upload, setting.status, setting.description].join(",")),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "bandwidth-control-settings.csv"
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Selected settings exported successfully!",
      })
      setSelectedSettings([])
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
              <CardTitle className="text-brand-green">Bandwidth Control Settings</CardTitle>
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
                    const csvContent = [
                      ["Plan", "Download", "Upload", "Status", "Description"].join(","),
                      ...settings
                        .filter((setting) => selectedSettings.includes(setting.id))
                        .map((setting) =>
                          [
                            setting.plan,
                            setting.download,
                            setting.upload,
                            setting.status,
                            setting.description,
                          ].join(","),
                        ),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "bandwidth-control-settings.csv"
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
                  <Button className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Setting
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add Bandwidth Control Setting</DialogTitle>
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
                          className="bg-brand-darkgray border-brand-green/30 text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="downloadSpeed" className="text-brand-green">
                            Download Speed
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="downloadSpeed"
                              name="downloadSpeed"
                              type="number"
                              min="1"
                              value={formData.downloadSpeed}
                              onChange={handleInputChange}
                              placeholder="Speed"
                              className="bg-brand-darkgray border-brand-green/30 text-white"
                              required
                            />
                            <Select
                              value={formData.downloadUnit}
                              onValueChange={(value) => handleSelectChange("downloadUnit", value)}
                            >
                              <SelectTrigger className="w-20 bg-brand-darkgray border-brand-green/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass border-brand-green/30">
                                <SelectItem value="kbps">kbps</SelectItem>
                                <SelectItem value="mbps">Mbps</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uploadSpeed" className="text-brand-green">
                            Upload Speed
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="uploadSpeed"
                              name="uploadSpeed"
                              type="number"
                              min="1"
                              value={formData.uploadSpeed}
                              onChange={handleInputChange}
                              placeholder="Speed"
                              className="bg-brand-darkgray border-brand-green/30 text-white"
                              required
                            />
                            <Select
                              value={formData.uploadUnit}
                              onValueChange={(value) => handleSelectChange("uploadUnit", value)}
                            >
                              <SelectTrigger className="w-20 bg-brand-darkgray border-brand-green/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass border-brand-green/30">
                                <SelectItem value="kbps">kbps</SelectItem>
                                <SelectItem value="mbps">Mbps</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
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
                          className="bg-brand-darkgray border-brand-green/30 text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={false}
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
            <Table className="min-w-full text-sm border-collapse">
              <TableHeader>
                <TableRow className="border-b border-brand-green/40">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Download</TableHead>
                  <TableHead>Upload</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.map((setting, index) => (
                  <TableRow key={setting.id} className="border-b border-brand-green/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedSettings.includes(setting.id)}
                        onCheckedChange={() => handleCheckboxChange(setting.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{setting.plan}</TableCell>
                    <TableCell>{setting.download}</TableCell>
                    <TableCell>{setting.upload}</TableCell>
                    <TableCell>
                      {setting.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{setting.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border-brand-green/30">
                          <DropdownMenuItem onClick={() => handleEdit(setting)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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
                                ["Plan", "Download", "Upload", "Status", "Description"].join(","),
                                [
                                  setting.plan,
                                  setting.download,
                                  setting.upload,
                                  setting.status,
                                  setting.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `bandwidth-control-${setting.plan}.csv`
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
                          <DropdownMenuItem onClick={() => handleDelete(setting.id)} className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
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
        <DialogContent className="glass border-brand-green/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Bandwidth Control Setting</DialogTitle>
            <DialogDescription className="text-white/80">Edit setting details</DialogDescription>
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
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-downloadSpeed" className="text-brand-green">
                    Download Speed
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-downloadSpeed"
                      name="downloadSpeed"
                      type="number"
                      min="1"
                      value={editFormData.downloadSpeed}
                      onChange={handleEditInputChange}
                      className="bg-brand-darkgray border-brand-green/30 text-white"
                      required
                    />
                    <Select
                      value={editFormData.downloadUnit}
                      onValueChange={(value) => handleEditSelectChange("downloadUnit", value)}
                    >
                      <SelectTrigger className="w-20 bg-brand-darkgray border-brand-green/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-brand-green/30">
                        <SelectItem value="kbps">kbps</SelectItem>
                        <SelectItem value="mbps">Mbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-uploadSpeed" className="text-brand-green">
                    Upload Speed
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-uploadSpeed"
                      name="uploadSpeed"
                      type="number"
                      min="1"
                      value={editFormData.uploadSpeed}
                      onChange={handleEditInputChange}
                      className="bg-brand-darkgray border-brand-green/30 text-white"
                      required
                    />
                    <Select
                      value={editFormData.uploadUnit}
                      onValueChange={(value) => handleEditSelectChange("uploadUnit", value)}
                    >
                      <SelectTrigger className="w-20 bg-brand-darkgray border-brand-green/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-brand-green/30">
                        <SelectItem value="kbps">kbps</SelectItem>
                        <SelectItem value="mbps">Mbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={false}
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
              Are you sure you want to delete this bandwidth control setting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteSetting}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
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
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
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
