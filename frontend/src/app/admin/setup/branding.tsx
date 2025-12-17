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
import { MoreVertical, Trash, Edit, Plus, Search, Download, Palette, Upload, RefreshCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

// Add active property to settings
const initialSettings
 = [
  {
    id: "1",
    setting: "Logo",
    value: "zmooth-logo.png",
    type: "image",
    status: "active",
    description: "Main company logo displayed on portal",
    active: true,
  },
  {
    id: "2",
    setting: "Splash Page",
    value: "/portal/splash",
    type: "url",
    status: "active",
    description: "Custom splash page for user login",
    active: true,
  },
  {
    id: "3",
    setting: "Redirect Link",
    value: "https://zmoothwifi.net",
    type: "url",
    status: "active",
    description: "Post-login redirect destination",
    active: true,
  },
  {
    id: "4",
    setting: "Company Name",
    value: "Zmooth WiFi",
    type: "text",
    status: "active",
    description: "Company name displayed on portal",
    active: true,
  },
]

const settingTypes = [
  { id: "text", name: "Text" },
  { id: "url", name: "URL" },
  { id: "image", name: "Image" },
  { id: "color", name: "Color" },
]

export default function BrandingPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(initialSettings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSettings, setSelectedSettings] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSetting, setEditingSetting] = useState<any>(null)
  const [formData, setFormData] = useState({
    setting: "",
    value: "",
    type: "text",
    description: "",
  })
  const [editFormData, setEditFormData] = useState({
    setting: "",
    value: "",
    type: "text",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
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
      setting.setting.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSetting = {
      id: (settings.length + 1).toString(),
      setting: formData.setting,
      value: formData.value,
      type: formData.type,
      status: "active",
      description: formData.description,
      active: true,
    }
    setSettings((prev) => [...prev, newSetting])
    setIsAddDialogOpen(false)
    setFormData({
      setting: "",
      value: "",
      type: "text",
      description: "",
    })
    toast({
      title: "Success",
      description: "Branding setting added successfully!",
    })
  }

  const handleEditSetting = (setting: any) => {
    setEditingSetting(setting)
    setEditFormData({
      setting: setting.setting,
      value: setting.value,
      type: setting.type,
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
              setting: editFormData.setting,
              value: editFormData.value,
              type: editFormData.type,
              description: editFormData.description,
            }
          : setting,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingSetting(null)
    toast({
      title: "Success",
      description: "Branding setting updated successfully!",
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
      description: "Branding setting deleted successfully!",
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
        ["Setting", "Value", "Type", "Status", "Description"].join(","),
        ...settings
          .filter((setting) => selectedSettings.includes(setting.id))
          .map((setting) => [setting.setting, setting.value, setting.type, setting.status, setting.description].join(",")),
      ].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "branding-settings.csv"
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Selected settings exported successfully!",
      })
      setBulkAction("")
    }
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

  const renderValuePreview = (setting: any) => {
    if (setting.type === "image") {
      return (
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-brand-green" />
          <span className="truncate max-w-[200px]">{setting.value}</span>
        </div>
      )
    } else if (setting.type === "color") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-brand-green/30" style={{ backgroundColor: setting.value }} />
          <span>{setting.value}</span>
        </div>
      )
    }
    return <span className="truncate max-w-[200px]">{setting.value}</span>
  }

  return (
    <div className="p-4 md:p-6">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Branding Options</CardTitle>
              <CardDescription>Customize portal appearance and branding elements</CardDescription>
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
                      ["Setting", "Value", "Type", "Status", "Description"].join(","),
                      ...settings
                        .filter((setting) => selectedSettings.includes(setting.id))
                        .map((setting) => [setting.setting, setting.value, setting.type, setting.status, setting.description].join(",")),
                    ].join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "branding-settings.csv"
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
                    <span>Add Branding Setting</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add Branding Setting</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Configure portal branding and appearance
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="setting" className="text-brand-green">
                          Setting Name
                        </Label>
                        <Input
                          id="setting"
                          name="setting"
                          value={formData.setting}
                          onChange={handleInputChange}
                          placeholder="Enter setting name"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-brand-green">
                          Setting Type
                        </Label>
                        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {settingTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value" className="text-brand-green">
                          Value
                        </Label>
                        <Input
                          id="value"
                          name="value"
                          type={formData.type === "color" ? "color" : "text"}
                          value={formData.value}
                          onChange={handleInputChange}
                          placeholder={
                            formData.type === "url"
                              ? "https://example.com"
                              : formData.type === "image"
                                ? "image-filename.png"
                                : formData.type === "color"
                                  ? "#000000"
                                  : "Enter value"
                          }
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
                  <TableHead>Setting</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-brand-green" />
                        {setting.setting}
                      </div>
                    </TableCell>
                    <TableCell>{renderValuePreview(setting)}</TableCell>
                    <TableCell>{setting.type}</TableCell>
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
                                ["Setting", "Value", "Type", "Status", "Description"].join(","),
                                [
                                  setting.setting,
                                  setting.value,
                                  setting.type,
                                  setting.status,
                                  setting.description,
                                ].join(","),
                              ].join("\n")
                              const blob = new Blob([csvContent], { type: "text/csv" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `branding-setting-${setting.setting}.csv`
                              a.click()
                              URL.revokeObjectURL(url)
                              toast({
                                title: "Success",
                                description: `Setting '${setting.setting}' exported successfully!`,
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
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Branding Setting</DialogTitle>
            <DialogDescription className="text-white/80">Update branding configuration</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-setting" className="text-brand-green">
                  Setting Name
                </Label>
                <Input
                  id="edit-setting"
                  name="setting"
                  value={editFormData.setting}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type" className="text-brand-green">
                  Setting Type
                </Label>
                <Select value={editFormData.type} onValueChange={(value) => handleEditSelectChange("type", value)}>
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {settingTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value" className="text-brand-green">
                  Value
                </Label>
                <Input
                  id="edit-value"
                  name="value"
                  type={editFormData.type === "color" ? "color" : "text"}
                  value={editFormData.value}
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
              Are you sure you want to delete this branding setting? This action cannot be undone.
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
