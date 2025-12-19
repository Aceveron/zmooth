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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { Copy, Tag, QrCode, MoreVertical, Edit, Trash2, RotateCcw } from "lucide-react"
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from 'react-router-dom'

// Sample profiles
const profiles = [
  { id: "1", name: "30 Min" },
  { id: "2", name: "Hourly Unlimited" },
  { id: "3", name: "Daily Unlimited" },
  { id: "4", name: "Weekly Super" },
  { id: "5", name: "Monthly Rocket" },
]

interface GeneratedCode {
  id: string
  username: string
  password: string
  profile: string
  createdAt: string
  expiresAt: string
  status: "unused" | "used"
}

const GenerateAccessCode: React.FC = () => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  // Show QR code dialog ya a code
  const handleShowQRCode = (code: GeneratedCode) => {
    // unaweza encode username/password ama username ama any info unataka
    setQrCodeData(`Username: ${code.username}\nPassword: ${code.password}`);
    setQrDialogOpen(true);
  };
  const navigate = useNavigate()
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<GeneratedCode | null>(null)
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteCodeId, setDeleteCodeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")
  const [searchTerm, setSearchTerm] = useState("")
  const [bulkAction, setBulkAction] = useState("")
  const [formData, setFormData] = useState({
    profileId: "",
    quantity: "1"
  })
  const [editFormData, setEditFormData] = useState({
    profileId: "",
    expiresAt: "",
  })

  // Sample generated codes with state management
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([
    {
      id: "1",
      username: "code_12345",
      password: "pass_12345",
      profile: "Daily Unlimited",
      createdAt: "2023-05-15 14:30:22",
      expiresAt: "2023-05-16 14:30:22",
      status: "unused",
    },
    {
      id: "2",
      username: "code_67890",
      password: "pass_67890",
      profile: "Weekly Super",
      createdAt: "2023-05-20 12:15:45",
      expiresAt: "2023-05-27 12:15:45",
      status: "unused",
    },
    {
      id: "3",
      username: "code_13579",
      password: "pass_13579",
      profile: "Hourly Unlimited",
      createdAt: "2023-05-20 10:05:33",
      expiresAt: "2023-05-20 11:05:33",
      status: "used",
    },
    {
      id: "4",
      username: "code_24680",
      password: "pass_24680",
      profile: "Monthly Rocket",
      createdAt: "2023-05-19 18:45:12",
      expiresAt: "2023-06-19 18:45:12",
      status: "unused",
    },
    {
      id: "5",
      username: "code_97531",
      password: "pass_97531",
      profile: "30 Min",
      createdAt: "2023-05-19 16:30:55",
      expiresAt: "2023-05-19 17:00:55",
      status: "used",
    },
  ])

  // Filter codes based on search term
  const filteredCodes = generatedCodes.filter(
    (code) =>
      code.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle edit select changes
  const handleEditSelectChange = (name: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    setSelectedCodes((prev) => (prev.includes(id) ? prev.filter((codeId) => codeId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedCodes([])
    } else {
      setSelectedCodes(filteredCodes.map((code) => code.id))
    }
    setSelectAll(!selectAll)
  }

  // Generate random string (fixed: no extra characters)
  // Avoid ambiguous characters: 0, O, 1, l, I
  const randomChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

  // Always generate 8-character usernames, A-Z, a-z, 2-9, avoiding ambiguous chars
  const generateRandomUsername = (existingUsernames: Set<string>) => {
    let username;
    do {
      username = Array.from({ length: 8 }, () => randomChars.charAt(Math.floor(Math.random() * randomChars.length))).join("");
    } while (existingUsernames.has(username));
    return username;
  };

  // Password: random, 8 chars, same charset
  const generateRandomPassword = () => {
    return Array.from({ length: 8 }, () => randomChars.charAt(Math.floor(Math.random() * randomChars.length))).join("");
  };


  // Handle form submission for generating new codes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedProfile = profiles.find((p) => p.id === formData.profileId)
    if (!selectedProfile) {
      toast({
        title: "Error",
        description: "Please select a profile",
        variant: "destructive",
      })
      return
    }

    const quantity = Number.parseInt(formData.quantity);
    const newCodes: GeneratedCode[] = [];
    const existingUsernames = new Set(generatedCodes.map(code => code.username));
    for (let i = 0; i < quantity; i++) {
      const createdAtDate = new Date();
      let expiresAtDate = new Date(createdAtDate);
      // Flexible duration parsing
      const durationStr = selectedProfile.name.trim().toLowerCase();
      let matched = false;
      const minMatch = durationStr.match(/([\d.]+)\s*(min|minute|minutes)/);
      if (minMatch) {
        expiresAtDate.setMinutes(expiresAtDate.getMinutes() + parseFloat(minMatch[1]));
        matched = true;
      }
      const hrMatch = durationStr.match(/([\d.]+)\s*(hr|hour|hours)/);
      if (hrMatch) {
        expiresAtDate.setHours(expiresAtDate.getHours() + parseFloat(hrMatch[1]));
        matched = true;
      }
      const dayMatch = durationStr.match(/([\d.]+)\s*(day|days)/);
      if (dayMatch) {
        expiresAtDate.setDate(expiresAtDate.getDate() + parseFloat(dayMatch[1]));
        matched = true;
      }
      const weekMatch = durationStr.match(/([\d.]+)\s*(week|weeks)/);
      if (weekMatch) {
        expiresAtDate.setDate(expiresAtDate.getDate() + 7 * parseFloat(weekMatch[1]));
        matched = true;
      }
      const monthMatch = durationStr.match(/([\d.]+)\s*(month|months)/);
      if (monthMatch) {
        expiresAtDate.setMonth(expiresAtDate.getMonth() + parseFloat(monthMatch[1]));
        matched = true;
      }
      if (!matched) {
        switch (durationStr) {
          case "30 min":
            expiresAtDate.setMinutes(expiresAtDate.getMinutes() + 30);
            break;
          case "hourly unlimited":
            expiresAtDate.setHours(expiresAtDate.getHours() + 1);
            break;
          case "daily unlimited":
            expiresAtDate.setDate(expiresAtDate.getDate() + 1);
            break;
          case "weekly super":
            expiresAtDate.setDate(expiresAtDate.getDate() + 7);
            break;
          case "monthly rocket":
            expiresAtDate.setMonth(expiresAtDate.getMonth() + 1);
            break;
          default:
            expiresAtDate.setDate(expiresAtDate.getDate() + 1);
        }
      }
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedCreated = `${createdAtDate.getFullYear()}-${pad(createdAtDate.getMonth() + 1)}-${pad(createdAtDate.getDate())} ${pad(createdAtDate.getHours())}:${pad(createdAtDate.getMinutes())}:${pad(createdAtDate.getSeconds())}`;
      const formattedExpires = `${expiresAtDate.getFullYear()}-${pad(expiresAtDate.getMonth() + 1)}-${pad(expiresAtDate.getDate())} ${pad(expiresAtDate.getHours())}:${pad(expiresAtDate.getMinutes())}:${pad(expiresAtDate.getSeconds())}`;
  // Username: unique, 8 chars, avoid ambiguous chars, includes numbers
  const username = generateRandomUsername(existingUsernames);
  existingUsernames.add(username);
  // Password: random, 8 chars, avoid ambiguous chars, includes numbers
  const password = generateRandomPassword();
      const newCode: GeneratedCode = {
        id: Date.now().toString() + i,
        username,
        password,
        profile: selectedProfile.name,
        createdAt: formattedCreated,
        expiresAt: formattedExpires,
        status: "unused",
      };
      newCodes.push(newCode);
    }

    // Add new codes to the beginning of the array
    setGeneratedCodes((prev) => [...newCodes, ...prev])
    setIsGenerateDialogOpen(false)

    // Reset form
    setFormData({
      profileId: "",
      quantity: "1"
    })

    toast({
      title: "Success",
      description: `Generated ${quantity} access code${quantity > 1 ? "s" : ""} successfully`,
    })
  }

  // Handle edit code
  const handleEditCode = (code: GeneratedCode) => {
    setEditingCode(code)
    const profileId = profiles.find((p) => p.name === code.profile)?.id || ""
    setEditFormData({
      profileId: profileId,
      expiresAt: code.expiresAt,
    })
    setIsEditDialogOpen(true)
  }

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCode) return

    const selectedProfile = profiles.find((p) => p.id === editFormData.profileId)
    if (!selectedProfile) {
      toast({
        title: "Error",
        description: "Please select a profile",
        variant: "destructive",
      })
      return
    }

    // Flexible duration parsing for edit
    const createdAtDate = new Date();
    let expiresAtDate = new Date(createdAtDate);
    const durationStr = selectedProfile.name.trim().toLowerCase();
    let matched = false;
    const minMatch = durationStr.match(/([\d.]+)\s*(min|minute|minutes)/);
    if (minMatch) {
      expiresAtDate.setMinutes(expiresAtDate.getMinutes() + parseFloat(minMatch[1]));
      matched = true;
    }
    const hrMatch = durationStr.match(/([\d.]+)\s*(hr|hour|hours)/);
    if (hrMatch) {
      expiresAtDate.setHours(expiresAtDate.getHours() + parseFloat(hrMatch[1]));
      matched = true;
    }
    const dayMatch = durationStr.match(/([\d.]+)\s*(day|days)/);
    if (dayMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + parseFloat(dayMatch[1]));
      matched = true;
    }
    const weekMatch = durationStr.match(/([\d.]+)\s*(week|weeks)/);
    if (weekMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + 7 * parseFloat(weekMatch[1]));
      matched = true;
    }
    const monthMatch = durationStr.match(/([\d.]+)\s*(month|months)/);
    if (monthMatch) {
      expiresAtDate.setMonth(expiresAtDate.getMonth() + parseFloat(monthMatch[1]));
      matched = true;
    }
    if (!matched) {
      switch (durationStr) {
        case "30 min":
          expiresAtDate.setMinutes(expiresAtDate.getMinutes() + 30);
          break;
        case "hourly unlimited":
          expiresAtDate.setHours(expiresAtDate.getHours() + 1);
          break;
        case "daily unlimited":
          expiresAtDate.setDate(expiresAtDate.getDate() + 1);
          break;
        case "weekly super":
          expiresAtDate.setDate(expiresAtDate.getDate() + 7);
          break;
        case "monthly rocket":
          expiresAtDate.setMonth(expiresAtDate.getMonth() + 1);
          break;
        default:
          expiresAtDate.setDate(expiresAtDate.getDate() + 1);
      }
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedCreated = `${createdAtDate.getFullYear()}-${pad(createdAtDate.getMonth() + 1)}-${pad(createdAtDate.getDate())} ${pad(createdAtDate.getHours())}:${pad(createdAtDate.getMinutes())}:${pad(createdAtDate.getSeconds())}`;
    const formattedExpires = `${expiresAtDate.getFullYear()}-${pad(expiresAtDate.getMonth() + 1)}-${pad(expiresAtDate.getDate())} ${pad(expiresAtDate.getHours())}:${pad(expiresAtDate.getMinutes())}:${pad(expiresAtDate.getSeconds())}`;
    setGeneratedCodes((prev) =>
      prev.map((code) =>
        code.id === editingCode.id
          ? {
              ...code,
              profile: selectedProfile.name,
              createdAt: formattedCreated,
              expiresAt: formattedExpires,
            }
          : code,
      ),
    )

    setIsEditDialogOpen(false)
    setEditingCode(null)
    setEditFormData({
      profileId: "",
      expiresAt: "",
    })

    toast({
      title: "Success",
      description: "Access code updated successfully",
    })
  }

  // Handle bulk actions
  const handleBulkAction = () => {
    if (!bulkAction || selectedCodes.length === 0) {
      toast({
        title: "Error",
        description: "Please select an action and at least one code",
        variant: "destructive",
      })
      return
    }

    switch (bulkAction) {
      case "delete":
        setIsBulkDeleteDialogOpen(true)
        break
      case "mark-used":
        setGeneratedCodes((prev) =>
          prev.map((code) => (selectedCodes.includes(code.id) ? { ...code, status: "used" as const } : code)),
        )
        toast({
          title: "Success",
          description: `Marked ${selectedCodes.length} code${selectedCodes.length > 1 ? "s" : ""} as used`,
        })
        setSelectedCodes([])
        setSelectAll(false)
        setBulkAction("")
        break
      case "mark-unused":
        setGeneratedCodes((prev) =>
          prev.map((code) => (selectedCodes.includes(code.id) ? { ...code, status: "unused" as const } : code)),
        )
        toast({
          title: "Success",
          description: `Marked ${selectedCodes.length} code${selectedCodes.length > 1 ? "s" : ""} as unused`,
        })
        setSelectedCodes([])
        setSelectAll(false)
        setBulkAction("")
        break
      case "print":
        handlePrintCodes()
        setSelectedCodes([])
        setSelectAll(false)
        setBulkAction("")
        break
      case "download":
        handleDownloadCodes()
        setSelectedCodes([])
        setSelectAll(false)
        setBulkAction("")
        break
    }
  }

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    setGeneratedCodes((prev) => prev.filter((code) => !selectedCodes.includes(code.id)))
    toast({
      title: "Success",
      description: `Deleted ${selectedCodes.length} code${selectedCodes.length > 1 ? "s" : ""}`,
    })
    setSelectedCodes([])
    setSelectAll(false)
    setBulkAction("")
    setIsBulkDeleteDialogOpen(false)
  }

  // Cancel bulk delete
  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false)
  }

  // Handle print selected codes
  const handlePrintCodes = () => {
    const codesToPrint = generatedCodes.filter((code) => selectedCodes.includes(code.id))
    console.log("Printing codes:", codesToPrint)
    toast({
      title: "Print",
      description: `Printing ${codesToPrint.length} code${codesToPrint.length > 1 ? "s" : ""}`,
    })
  }

  // Handle download selected codes
  const handleDownloadCodes = () => {
    const codesToDownload = generatedCodes.filter((code) => selectedCodes.includes(code.id))
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Username,Password,Profile,Created At,Expires At,Status\n" +
      codesToDownload
        .map(
          (code) =>
            `${code.username},${code.password},${code.profile},${code.createdAt},${code.expiresAt},${code.status}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "access_codes.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download",
      description: `Downloaded ${codesToDownload.length} code${codesToDownload.length > 1 ? "s" : ""}`,
    })
  }

  // Handle copy code to clipboard
  const handleCopyCode = (username: string, password: string) => {
    const textToCopy = `Username: ${username}\nPassword: ${password}`
    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied",
      description: "Credentials copied to clipboard",
    })
  }

  // Handle individual code actions
  const handleToggleStatus = (id: string) => {
    setGeneratedCodes((prev) =>
      prev.map((code) => (code.id === id ? { ...code, status: code.status === "used" ? "unused" : "used" } : code)),
    )

    const code = generatedCodes.find((c) => c.id === id)
    const newStatus = code?.status === "used" ? "unused" : "used"

    toast({
      title: "Status Updated",
      description: `Code marked as ${newStatus}`,
    })
  }

  // Open confirmation dialog for deleting a code
  const handleDeleteCode = (id: string) => {
    setDeleteCodeId(id)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete action
  const confirmDeleteCode = () => {
    if (deleteCodeId) {
      setGeneratedCodes((prev) => prev.filter((code) => code.id !== deleteCodeId))
      toast({
        title: "Deleted",
        description: "Access code deleted successfully",
      })
    }
    setIsDeleteDialogOpen(false)
    setDeleteCodeId(null)
  }

  // Cancel delete action
  const cancelDeleteCode = () => {
    setIsDeleteDialogOpen(false)
    setDeleteCodeId(null)
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
                    <CardTitle className="text-brand-green">Generate Access Codes</CardTitle>
                    <CardDescription>Create and manage hotspot access codes for clients</CardDescription>
                </div>
                </div>
            </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="glass p-1 rounded-xl border border-brand-green/30">
                <TabsTrigger
                  value="generate"
                  className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black"
                >
                  Generate Codes
                </TabsTrigger>
                <TabsTrigger
                  value="print"
                  className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black"
                >
                  Print Codes
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="generate" className="space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">

                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent className="glass border-brand-green/30">
                      <SelectItem value="delete">Delete Selected</SelectItem>
                      <SelectItem value="mark-used">Mark as Used</SelectItem>
                      <SelectItem value="mark-unused">Mark as Unused</SelectItem>
                      <SelectItem value="print">Print Selected</SelectItem>
                      <SelectItem value="download">Download Selected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                    onClick={handleBulkAction}
                    disabled={selectedCodes.length === 0 || !bulkAction}
                  >
                    Apply
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-32 sm:w-40 bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green text-sm px-2 py-1"
                  />

              <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <Tag className="h-4 w-4" />
                    <span>Generate New Codes</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Generate Access Codes</DialogTitle>
                    <DialogDescription className="text-white/80">
                      Create new access codes for hotspot clients
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="profileId" className="text-brand-green">
                          Profile
                        </Label>
                        <Select
                          value={formData.profileId}
                          onValueChange={(value) => handleSelectChange("profileId", value)}
                          required
                        >
                          <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                            <SelectValue placeholder="Select profile" />
                          </SelectTrigger>
                          <SelectContent className="glass border-brand-green/30">
                            {profiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-brand-green">
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          max="100"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                          required
                        />
                        <p className="text-xs text-white/60">Number of codes to generate (max 100)</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsGenerateDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={false}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Generate Codes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
                </div>
              </div>

              <div className="rounded-md border border-brand-green/30 overflow-x-auto">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="border-b border-brand-green/30 hover:bg-brand-green/5">
                      <TableHead className="border-b border-brand-green/30 w-[50px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAllChange}
                          className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                        />
                      </TableHead>
                      <TableHead className="border-b border-brand-green/30">Username</TableHead>
                      <TableHead className="border-b border-brand-green/30">Password</TableHead>
                      <TableHead className="border-b border-brand-green/30">Profile</TableHead>
                      <TableHead className="border-b border-brand-green/30">Created At</TableHead>
                      <TableHead className="border-b border-brand-green/30">Expires At</TableHead>
                      <TableHead className="border-b border-brand-green/30">Status</TableHead>
                      <TableHead className="border-b border-brand-green/30 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCodes.map((code) => (
                      <TableRow key={code.id} className="border-b border-brand-green/20 hover:bg-brand-green/5">
                        <TableCell className="border-b border-brand-green/20">
                          <Checkbox
                            checked={selectedCodes.includes(code.id)}
                            onCheckedChange={() => handleCheckboxChange(code.id)}
                            className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                          />
                        </TableCell>
                        <TableCell className="border-b border-brand-green/20 font-medium">{code.username}</TableCell>
                        <TableCell className="border-b border-brand-green/20">{code.password}</TableCell>
                        <TableCell className="border-b border-brand-green/20">{code.profile}</TableCell>
                        <TableCell className="border-b border-brand-green/20">{code.createdAt}</TableCell>
                        <TableCell className="border-b border-brand-green/20">{code.expiresAt}</TableCell>
                        <TableCell className="border-b border-brand-green/20">
                            {code.status === "unused" ? (
                              <Badge variant="success">Used</Badge>
                            ) : (
                              <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Unused</Badge>
                            )}
                        </TableCell>
                        <TableCell className="border-b border-brand-green/20 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4 text-brand-green" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass border-brand-green/30">
                              <DropdownMenuItem onClick={() => handleEditCode(code)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyCode(code.username, code.password)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Credentials
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShowQRCode(code)}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Generate QR Code
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(code.id)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Mark as {code.status === "used" ? "Unused" : "Used"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCode(code.id)}
                                className="text-red-400 focus:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Code
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Access Code QR</DialogTitle>
            <DialogDescription className="text-white/80">Scan to get credentials</DialogDescription>
          </DialogHeader>
          {qrCodeData && (
            <div className="flex flex-col items-center gap-2 py-4">
              <QRCodeSVG value={qrCodeData} size={180} bgColor="#fff" fgColor="#22c55e" />
              <div className="text-xs text-white/80 mt-2">{qrCodeData.split("\n").map((line, i) => <div key={i}>{line}</div>)}</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setQrDialogOpen(false)} className="bg-brand-green text-brand-black hover:bg-brand-neongreen">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="print" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedCodes
                  .filter((code) => code.status === "unused")
                  .map((code) => (
                    <Card key={code.id} className="glass border-brand-green/30">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg text-brand-green">Access Code</CardTitle>
                        <CardDescription>{code.profile}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Username:</span>
                            <span className="font-mono font-bold text-white">{code.username}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Password:</span>
                            <span className="font-mono font-bold text-white">{code.password}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Expires:</span>
                            <span className="text-white">{code.expiresAt}</span>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-brand-green/50 text-brand-green hover:bg-brand-green/10 flex items-center gap-1 bg-transparent"
                              onClick={() => handleCopyCode(code.username, code.password)}
                            >
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Code Dialog */}
      {/* Edit dialog inakubali profile na expiration changes, not username/password */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Access Code</DialogTitle>
            <DialogDescription className="text-white/80">Modify the details of this access code</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-profileId" className="text-brand-green">
                  Profile
                </Label>
                <Select
                  value={editFormData.profileId}
                  onValueChange={(value) => handleEditSelectChange("profileId", value)}
                  required
                >
                  <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent className="glass border-brand-green/30">
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiresAt" className="text-brand-green">
                  Expires At
                </Label>
                <Input
                  id="edit-expiresAt"
                  name="expiresAt"
                  value={editFormData.expiresAt}
                  onChange={handleEditInputChange}
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
                <p className="text-xs text-white/60">Format: YYYY-MM-DD HH:MM:SS</p>
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
                Update Code
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
                Are you sure you want to delete this code? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelDeleteCode}
                className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" disabled={false}>
                Cancel
              </Button>
              <Button onClick={confirmDeleteCode} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedCodes.length} selected codes? This action cannot be undone.`}
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
              {`Delete ${selectedCodes.length} Codes`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GenerateAccessCode
