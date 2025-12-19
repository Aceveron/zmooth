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
import { Plus, MoreVertical, Trash, Edit, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

interface BandwidthProfile {
  id: string
  name: string
  downloadRate: string
  uploadRate: string
  priority: string
  burstLimit: string
  burstThreshold: string
  burstTime: string
  active: boolean
}

// Sample bandwidth profiles data
const initialBandwidthProfiles: BandwidthProfile[] = [
  {
    id: "1",
    name: "Basic",
    downloadRate: "2M",
    uploadRate: "1M",
    priority: "8",
    burstLimit: "3M/2M",
    burstThreshold: "1M/512k",
    burstTime: "10s/10s",
    active: true,
  },
  {
    id: "2",
    name: "Standard",
    downloadRate: "5M",
    uploadRate: "2M",
    priority: "5",
    burstLimit: "7M/3M",
    burstThreshold: "3M/1M",
    burstTime: "15s/15s",
    active: true,
  },
  {
    id: "3",
    name: "Premium",
    downloadRate: "10M",
    uploadRate: "5M",
    priority: "3",
    burstLimit: "15M/7M",
    burstThreshold: "7M/3M",
    burstTime: "20s/20s",
    active: true,
  },
  {
    id: "4",
    name: "Ultra",
    downloadRate: "20M",
    uploadRate: "10M",
    priority: "1",
    burstLimit: "30M/15M",
    burstThreshold: "15M/7M",
    burstTime: "30s/30s",
    active: true,
  },
  {
    id: "5",
    name: "Limited",
    downloadRate: "1M",
    uploadRate: "512k",
    priority: "10",
    burstLimit: "2M/1M",
    burstThreshold: "512k/256k",
    burstTime: "5s/5s",
    active: false,
  },
]

const BandwidthProfile: React.FC = () => {
  const navigate = useNavigate()
  const [isAddProfileDialogOpen, setIsAddProfileDialogOpen] = useState(false)
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    profileName: "",
    downloadRate: "",
    uploadRate: "",
    priority: "8",
    burstLimit: "",
    burstThreshold: "",
    burstTime: "",
  })
  const [editingProfile, setEditingProfile] = useState<BandwidthProfile | null>(null)
  const [profilesState, setProfilesState] = useState(initialBandwidthProfiles)
  const [bulkAction, setBulkAction] = useState("")
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null)

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
    setSelectedProfiles((prev) => (prev.includes(id) ? prev.filter((profileId) => profileId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedProfiles([])
    } else {
      setSelectedProfiles(profilesState.map((profile) => profile.id))
    }
    setSelectAll(!selectAll)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      profileName: "",
      downloadRate: "",
      uploadRate: "",
      priority: "8",
      burstLimit: "",
      burstThreshold: "",
      burstTime: "",
    })
  }

  // Handle form submission for adding new profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check for duplicate profile name
    const isDuplicate = profilesState.some(
      (profile) => profile.name.toLowerCase() === formData.profileName.toLowerCase(),
    )

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "A profile with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const newProfile: BandwidthProfile = {
      id: Date.now().toString(),
      name: formData.profileName,
      downloadRate: formData.downloadRate,
      uploadRate: formData.uploadRate,
      priority: formData.priority,
      burstLimit: formData.burstLimit,
      burstThreshold: formData.burstThreshold,
      burstTime: formData.burstTime,
      active: true,
    }

    setProfilesState((prev) => [newProfile, ...prev])
    setIsAddProfileDialogOpen(false)
    resetForm()

    toast({
      title: "Success",
      description: "Bandwidth profile created successfully.",
    })
  }

  // Handle edit profile
  const handleEditProfile = (profile: BandwidthProfile) => {
    setEditingProfile(profile)
    setFormData({
      profileName: profile.name,
      downloadRate: profile.downloadRate,
      uploadRate: profile.uploadRate,
      priority: profile.priority,
      burstLimit: profile.burstLimit,
      burstThreshold: profile.burstThreshold,
      burstTime: profile.burstTime,
    })
    setIsEditProfileDialogOpen(true)
  }

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingProfile) return

    // Check for duplicate profile name (excluding current profile)
    const isDuplicate = profilesState.some(
      (profile) =>
        profile.id !== editingProfile.id && profile.name.toLowerCase() === formData.profileName.toLowerCase(),
    )

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "A profile with this name already exists.",
        variant: "destructive",
      })
      return
    }

    const updatedProfile: BandwidthProfile = {
      ...editingProfile,
      name: formData.profileName,
      downloadRate: formData.downloadRate,
      uploadRate: formData.uploadRate,
      priority: formData.priority,
      burstLimit: formData.burstLimit,
      burstThreshold: formData.burstThreshold,
      burstTime: formData.burstTime,
    }

    setProfilesState((prev) => prev.map((profile) => (profile.id === editingProfile.id ? updatedProfile : profile)))
    setIsEditProfileDialogOpen(false)
    setEditingProfile(null)
    resetForm()

    toast({
      title: "Success",
      description: "Bandwidth profile updated successfully.",
    })
  }

  // Handle toggle profile status
  const handleToggleStatus = (id: string) => {
    setProfilesState((prev) =>
      prev.map((profile) => (profile.id === id ? { ...profile, active: !profile.active } : profile)),
    )

    const profile = profilesState.find((p) => p.id === id)
    toast({
      title: "Success",
      description: `Profile ${profile?.active ? "deactivated" : "activated"} successfully.`,
    })
  }

  // Handle delete single profile
  const handleDeleteProfile = (id: string) => {
    setDeleteProfileId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProfile = () => {
    if (deleteProfileId) {
      setProfilesState((prev) => prev.filter((profile) => profile.id !== deleteProfileId))
      setIsDeleteDialogOpen(false)
      setDeleteProfileId(null)

      toast({
        title: "Success",
        description: "Profile deleted successfully.",
      })
    }
  }

  const cancelDeleteProfile = () => {
    setIsDeleteDialogOpen(false)
    setDeleteProfileId(null)
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (selectedProfiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one profile.",
        variant: "destructive",
      })
      return
    }

    if (bulkAction === "delete") {
      setIsBulkDeleteDialogOpen(true)
    } else if (bulkAction === "activate") {
      setProfilesState((prev) =>
        prev.map((profile) => (selectedProfiles.includes(profile.id) ? { ...profile, active: true } : profile)),
      )
      setSelectedProfiles([])
      setSelectAll(false)
      setBulkAction("")

      toast({
        title: "Success",
        description: `${selectedProfiles.length} profile(s) activated successfully.`,
      })
    } else if (bulkAction === "deactivate") {
      setProfilesState((prev) =>
        prev.map((profile) => (selectedProfiles.includes(profile.id) ? { ...profile, active: false } : profile)),
      )
      setSelectedProfiles([])
      setSelectAll(false)
      setBulkAction("")

      toast({
        title: "Success",
        description: `${selectedProfiles.length} profile(s) deactivated successfully.`,
      })
    }
  }

  const confirmBulkDelete = () => {
    setProfilesState((prev) => prev.filter((profile) => !selectedProfiles.includes(profile.id)))
    setSelectedProfiles([])
    setSelectAll(false)
    setIsBulkDeleteDialogOpen(false)
    setBulkAction("")

    toast({
      title: "Success",
      description: "Selected profiles deleted successfully.",
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
            <CardTitle className="text-brand-green">Bandwidth Profiles</CardTitle>
            <CardDescription>Manage bandwidth profiles for hotspot users</CardDescription>
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
                  <SelectItem value="activate">Activate Selected</SelectItem>
                  <SelectItem value="deactivate">Deactivate Selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                onClick={handleBulkAction}
                disabled={selectedProfiles.length === 0}
              >
                Apply
              </Button>
            </div>
            <Dialog open={isAddProfileDialogOpen} onOpenChange={setIsAddProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                  <Plus className="h-4 w-4" />
                  <span>Add Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-brand-green">Add New Bandwidth Profile</DialogTitle>
                  <DialogDescription className="text-white/80">
                    Create a new bandwidth profile for hotspot users
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName" className="text-brand-green">
                        Profile Name
                      </Label>
                      <Input
                        id="profileName"
                        name="profileName"
                        value={formData.profileName}
                        onChange={handleInputChange}
                        placeholder="Enter profile name"
                        className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="downloadRate" className="text-brand-green">
                          Download Rate
                        </Label>
                        <Input
                          id="downloadRate"
                          name="downloadRate"
                          value={formData.downloadRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 5M"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                        <p className="text-xs text-white/60">Specify download rate (e.g., 5M, 10M)</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="uploadRate" className="text-brand-green">
                          Upload Rate
                        </Label>
                        <Input
                          id="uploadRate"
                          name="uploadRate"
                          value={formData.uploadRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 2M"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                        <p className="text-xs text-white/60">Specify upload rate (e.g., 2M, 5M)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-brand-green">
                        Priority
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="glass border-brand-green/30">
                          <SelectItem value="1">1 (Highest)</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="8">8 (Default)</SelectItem>
                          <SelectItem value="10">10 (Lowest)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/60">Lower number means higher priority</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="burstLimit" className="text-brand-green">
                        Burst Limit
                      </Label>
                      <Input
                        id="burstLimit"
                        name="burstLimit"
                        value={formData.burstLimit}
                        onChange={handleInputChange}
                        placeholder="e.g. 7M/3M"
                        className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                      />
                      <p className="text-xs text-white/60">Format: download/upload (e.g., 7M/3M)</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="burstThreshold" className="text-brand-green">
                          Burst Threshold
                        </Label>
                        <Input
                          id="burstThreshold"
                          name="burstThreshold"
                          value={formData.burstThreshold}
                          onChange={handleInputChange}
                          placeholder="e.g. 3M/1M"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        />
                        <p className="text-xs text-white/60">Format: download/upload</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="burstTime" className="text-brand-green">
                          Burst Time
                        </Label>
                        <Input
                          id="burstTime"
                          name="burstTime"
                          value={formData.burstTime}
                          onChange={handleInputChange}
                          placeholder="e.g. 15s/15s"
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                        />
                        <p className="text-xs text-white/60">Format: download/upload (in seconds)</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setIsAddProfileDialogOpen(false)
                            resetForm()
                    }}
                    className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" disabled={false}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                      Add Profile
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border border-brand-green/30 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead className="w-[50px] border-r-0">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                      className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                    />
                  </TableHead>
                  <TableHead className="border-r-0">Profile Name</TableHead>
                  <TableHead className="border-r-0">Download Rate</TableHead>
                  <TableHead className="border-r-0">Upload Rate</TableHead>
                  <TableHead className="border-r-0">Priority</TableHead>
                  <TableHead className="border-r-0">Burst Limit</TableHead>
                  <TableHead className="border-r-0">Burst Threshold</TableHead>
                  <TableHead className="border-r-0">Burst Time</TableHead>
                  <TableHead className="border-r-0">Status</TableHead>
                  <TableHead className="text-right border-r-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profilesState.map((profile) => (
                  <TableRow key={profile.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                    <TableCell className="border-r-0">
                      <Checkbox
                        checked={selectedProfiles.includes(profile.id)}
                        onCheckedChange={() => handleCheckboxChange(profile.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium border-r-0">{profile.name}</TableCell>
                    <TableCell className="border-r-0">{profile.downloadRate}</TableCell>
                    <TableCell className="border-r-0">{profile.uploadRate}</TableCell>
                    <TableCell className="border-r-0">{profile.priority}</TableCell>
                    <TableCell className="border-r-0">{profile.burstLimit}</TableCell>
                    <TableCell className="border-r-0">{profile.burstThreshold}</TableCell>
                    <TableCell className="border-r-0">{profile.burstTime}</TableCell>
                    <TableCell className="border-r-0">
                      {profile.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right border-r-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-brand-green" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-brand-green/30">
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleStatus(profile.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-white" />
                            {profile.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Profile
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Bandwidth Profile</DialogTitle>
            <DialogDescription className="text-white/80">Update the bandwidth profile settings</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editProfileName" className="text-brand-green">
                  Profile Name
                </Label>
                <Input
                  id="editProfileName"
                  name="profileName"
                  value={formData.profileName}
                  onChange={handleInputChange}
                  placeholder="Enter profile name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDownloadRate" className="text-brand-green">
                    Download Rate
                  </Label>
                  <Input
                    id="editDownloadRate"
                    name="downloadRate"
                    value={formData.downloadRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 5M"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                  <p className="text-xs text-white/60">Specify download rate (e.g., 5M, 10M)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editUploadRate" className="text-brand-green">
                    Upload Rate
                  </Label>
                  <Input
                    id="editUploadRate"
                    name="uploadRate"
                    value={formData.uploadRate}
                    onChange={handleInputChange}
                    placeholder="e.g. 2M"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    required
                  />
                  <p className="text-xs text-white/60">Specify upload rate (e.g., 2M, 5M)</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPriority" className="text-brand-green">
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    <SelectItem value="1">1 (Highest)</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="8">8 (Default)</SelectItem>
                    <SelectItem value="10">10 (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/60">Lower number means higher priority</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBurstLimit" className="text-brand-green">
                  Burst Limit
                </Label>
                <Input
                  id="editBurstLimit"
                  name="burstLimit"
                  value={formData.burstLimit}
                  onChange={handleInputChange}
                  placeholder="e.g. 7M/3M"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
                <p className="text-xs text-white/60">Format: download/upload (e.g., 7M/3M)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editBurstThreshold" className="text-brand-green">
                    Burst Threshold
                  </Label>
                  <Input
                    id="editBurstThreshold"
                    name="burstThreshold"
                    value={formData.burstThreshold}
                    onChange={handleInputChange}
                    placeholder="e.g. 3M/1M"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                  <p className="text-xs text-white/60">Format: download/upload</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editBurstTime" className="text-brand-green">
                    Burst Time
                  </Label>
                  <Input
                    id="editBurstTime"
                    name="burstTime"
                    value={formData.burstTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 15s/15s"
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  />
                  <p className="text-xs text-white/60">Format: download/upload (in seconds)</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditProfileDialogOpen(false)
                  setEditingProfile(null)
                  resetForm()
                }}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" disabled={false}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                Update Profile
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
              Are you sure you want to delete this profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteProfile}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteProfile} className="bg-red-600 text-white hover:bg-red-700">
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
              Are you sure you want to delete {selectedProfiles.length} selected profile{selectedProfiles.length === 1 ? '' : 's'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelBulkDelete}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" disabled={false}>
              Cancel
            </Button>
            <Button onClick={confirmBulkDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete {selectedProfiles.length} Profile{selectedProfiles.length === 1 ? '' : 's'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BandwidthProfile
