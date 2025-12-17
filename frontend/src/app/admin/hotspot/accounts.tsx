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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Trash, Edit, RefreshCw, Search, UserPlus } from "lucide-react"

// Sample hotspot accounts data
const accounts = [
  {
    id: "1",
    username: "john_doe",
    password: "********",
    profile: "Daily Unlimited",
    createdAt: "2023-05-15 14:30:22",
    expiresAt: "2023-05-16 14:30:22",
    status: "active",
    usedTime: "2h 15m",
    dataUsed: "1.2 GB",
  },
  {
    id: "2",
    username: "jane_smith",
    password: "********",
    profile: "Weekly Super",
    createdAt: "2023-05-20 12:15:45",
    expiresAt: "2023-05-27 12:15:45",
    status: "active",
    usedTime: "5h 30m",
    dataUsed: "3.5 GB",
  },
  {
    id: "3",
    username: "robert_johnson",
    password: "********",
    profile: "Hourly Unlimited",
    createdAt: "2023-05-20 10:05:33",
    expiresAt: "2023-05-20 11:05:33",
    status: "expired",
    usedTime: "1h 0m",
    dataUsed: "750 MB",
  },
  {
    id: "4",
    username: "sarah_williams",
    password: "********",
    profile: "Monthly Rocket",
    createdAt: "2023-05-19 18:45:12",
    expiresAt: "2023-06-19 18:45:12",
    status: "active",
    usedTime: "12h 45m",
    dataUsed: "8.2 GB",
  },
  {
    id: "5",
    username: "michael_brown",
    password: "********",
    profile: "30 Min",
    createdAt: "2023-05-19 16:30:55",
    expiresAt: "2023-05-19 17:00:55",
    status: "expired",
    usedTime: "30m",
    dataUsed: "250 MB",
  },
]

// Sample profiles
const profiles = [
  { id: "1", name: "30 Min" },
  { id: "2", name: "Hourly Unlimited" },
  { id: "3", name: "Daily Unlimited" },
  { id: "4", name: "Weekly Super" },
  { id: "5", name: "Monthly Rocket" },
]

export default function HotspotAccounts() {
  const navigate = useNavigate();
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profileId: "",
    generateCredentials: false,
  })
  const [accountsState, setAccountsState] = useState(accounts)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editAccountId, setEditAccountId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
    profileId: "",
  });

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
    setSelectedAccounts((prev) => (prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]))
  }

  // Handle select all checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedAccounts([])
    } else {
      setSelectedAccounts(accounts.map((account) => account.id))
    }
    setSelectAll(!selectAll)
  }

  // Filter accounts based on search query
  const filteredAccounts = accountsState.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.profile.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    let expiresAtDate = new Date(now);
    // Get profile name from profiles list
    const selectedProfile = profiles.find((p) => p.id === formData.profileId);
    const durationStr = selectedProfile ? selectedProfile.name.trim().toLowerCase() : formData.profileId.trim().toLowerCase();
    let matched = false;
    // Match minutes
    const minMatch = durationStr.match(/([\d.]+)\s*(min|minute|minutes)/);
    if (minMatch) {
      expiresAtDate.setMinutes(expiresAtDate.getMinutes() + parseFloat(minMatch[1]));
      matched = true;
    }
    // Match hours
    const hrMatch = durationStr.match(/([\d.]+)\s*(hr|hour|hours)/);
    if (hrMatch) {
      expiresAtDate.setHours(expiresAtDate.getHours() + parseFloat(hrMatch[1]));
      matched = true;
    }
    // Match days
    const dayMatch = durationStr.match(/([\d.]+)\s*(day|days)/);
    if (dayMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + parseFloat(dayMatch[1]));
      matched = true;
    }
    // Match weeks
    const weekMatch = durationStr.match(/([\d.]+)\s*(week|weeks)/);
    if (weekMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + 7 * parseFloat(weekMatch[1]));
      matched = true;
    }
    // Match months
    const monthMatch = durationStr.match(/([\d.]+)\s*(month|months)/);
    if (monthMatch) {
      expiresAtDate.setMonth(expiresAtDate.getMonth() + parseFloat(monthMatch[1]));
      matched = true;
    }
    // Fallback for common names
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
    const formattedExpires = `${expiresAtDate.getFullYear()}-${pad(expiresAtDate.getMonth() + 1)}-${pad(expiresAtDate.getDate())} ${pad(expiresAtDate.getHours())}:${pad(expiresAtDate.getMinutes())}:${pad(expiresAtDate.getSeconds())}`;
    const newAccount = {
      id: (accountsState.length + 1).toString(),
      username: formData.username,
      password: formData.password,
      profile: selectedProfile ? selectedProfile.name : formData.profileId,
      createdAt: formattedDate,
      expiresAt: formattedExpires,
      status: "active",
      usedTime: "0m",
      dataUsed: "0 MB",
    };
    setAccountsState((prev) => [...prev, newAccount]);
    setIsAddAccountDialogOpen(false);
    setFormData({
      username: "",
      password: "",
      profileId: "",
      generateCredentials: false,
    });
  };

  // Edit Account
  const handleEditClick = (account: any) => {
    setEditAccountId(account.id);
    setEditFormData({
      username: account.username,
      password: account.password,
      profileId: account.profile,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    let expiresAtDate = new Date(now);
    // Get profile name from profiles list
    const selectedProfile = profiles.find((p) => p.id === editFormData.profileId);
    const durationStr = selectedProfile ? selectedProfile.name.trim().toLowerCase() : editFormData.profileId.trim().toLowerCase();
    let matched = false;
    // Match minutes
    const minMatch = durationStr.match(/([\d.]+)\s*(min|minute|minutes)/);
    if (minMatch) {
      expiresAtDate.setMinutes(expiresAtDate.getMinutes() + parseFloat(minMatch[1]));
      matched = true;
    }
    // Match hours
    const hrMatch = durationStr.match(/([\d.]+)\s*(hr|hour|hours)/);
    if (hrMatch) {
      expiresAtDate.setHours(expiresAtDate.getHours() + parseFloat(hrMatch[1]));
      matched = true;
    }
    // Match days
    const dayMatch = durationStr.match(/([\d.]+)\s*(day|days)/);
    if (dayMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + parseFloat(dayMatch[1]));
      matched = true;
    }
    // Match weeks
    const weekMatch = durationStr.match(/([\d.]+)\s*(week|weeks)/);
    if (weekMatch) {
      expiresAtDate.setDate(expiresAtDate.getDate() + 7 * parseFloat(weekMatch[1]));
      matched = true;
    }
    // Match months
    const monthMatch = durationStr.match(/([\d.]+)\s*(month|months)/);
    if (monthMatch) {
      expiresAtDate.setMonth(expiresAtDate.getMonth() + parseFloat(monthMatch[1]));
      matched = true;
    }
    // Fallback for common names
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
    const formattedExpires = `${expiresAtDate.getFullYear()}-${pad(expiresAtDate.getMonth() + 1)}-${pad(expiresAtDate.getDate())} ${pad(expiresAtDate.getHours())}:${pad(expiresAtDate.getMinutes())}:${pad(expiresAtDate.getSeconds())}`;
    setAccountsState((prev) =>
      prev.map((account) =>
        account.id === editAccountId
          ? {
              ...account,
              username: editFormData.username,
              password: editFormData.password,
              profile: selectedProfile ? selectedProfile.name : editFormData.profileId,
              createdAt: formattedDate,
              expiresAt: formattedExpires,
            }
          : account,
      ),
    );
    setIsEditDialogOpen(false);
    setEditAccountId(null);
  };

  // Deactivate/Activate Account
  const handleToggleActive = (id: string) => {
    setAccountsState((prev) =>
      prev.map((account) =>
        account.id === id
          ? {
              ...account,
              status: account.status === "active" ? "expired" : "active",
            }
          : account
      )
    );
  };

  // Delete Account
  const handleDeleteAccount = (id: string) => {
    setDeleteAccountId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    setAccountsState((prev) => prev.filter((account) => account.id !== deleteAccountId));
    setIsDeleteDialogOpen(false);
    setDeleteAccountId(null);
  };

  const cancelDeleteAccount = () => {
    setIsDeleteDialogOpen(false);
    setDeleteAccountId(null);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    setAccountsState((prev) => prev.filter((account) => !selectedAccounts.includes(account.id)));
    setSelectedAccounts([]);
    setIsBulkDeleteDialogOpen(false);
  };

  const cancelBulkDelete = () => {
    setIsBulkDeleteDialogOpen(false);
  };

  // --- Bulk Action Handler ---
  const handleBulkAction = () => {
    if (bulkAction === "delete") {
      handleBulkDelete();
    } else if (bulkAction === "activate") {
      setAccountsState((prev) => prev.map((account) =>
        selectedAccounts.includes(account.id) ? { ...account, status: "active" } : account
      ));
    } else if (bulkAction === "deactivate") {
      setAccountsState((prev) => prev.map((account) =>
        selectedAccounts.includes(account.id) ? { ...account, status: "expired" } : account
      ));
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex-1 flex flex-col items-center">
              <CardTitle className="text-brand-green">Hotspot Accounts</CardTitle>
              <CardDescription>Manage hotspot user accounts and credentials</CardDescription>
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
                  disabled={selectedAccounts.length === 0}
              >
                Apply
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[200px] bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                />
              </div>
              <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 bg-brand-green text-brand-black hover:bg-brand-neongreen">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Account</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-brand-green/30 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-brand-green">Add New Hotspot Account</DialogTitle>
                    <DialogDescription className="text-white/80">Create a new account for hotspot access</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                
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
                      <div className="space-y-2">
                        <Label htmlFor="profile" className="text-brand-green">
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
                            {profiles.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddAccountDialogOpen(false)}
                        className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={false}
                       >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-brand-green text-brand-black hover:bg-brand-neongreen">
                        Add Account
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
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used Time</TableHead>
                  <TableHead>Data Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} className="border-brand-green/30 hover:bg-brand-green/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={() => handleCheckboxChange(account.id)}
                        className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{account.username}</TableCell>
                    <TableCell>{account.password}</TableCell>
                    <TableCell>{account.profile}</TableCell>
                    <TableCell>{account.createdAt}</TableCell>
                    <TableCell>{account.expiresAt}</TableCell>
                    <TableCell>
                      {account.status === "active" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{account.usedTime}</TableCell>
                    <TableCell>{account.dataUsed}</TableCell>
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
                            onClick={() => handleEditClick(account)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-white" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-brand-green/10 cursor-pointer"
                            onClick={() => handleToggleActive(account.id)}
                          >
                            {account.status === "active" ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 cursor-pointer" onClick={() => handleDeleteAccount(account.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Account
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
              onClick={cancelDeleteAccount} 
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={false}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeleteAccount} className="bg-red-600 text-white hover:bg-red-700">
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
              {`Are you sure you want to delete ${selectedAccounts.length} selected clients? This action cannot be undone.`}
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
              {`Delete ${selectedAccounts.length} Clients`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-brand-green/30 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-green">Edit Hotspot Account</DialogTitle>
            <DialogDescription className="text-white/80">Edit account details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username" className="text-brand-green">
                  Username
                </Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-brand-green">
                  Password
                </Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-profile" className="text-brand-green">
                  Profile
                </Label>
                <Input
                  id="edit-profile"
                  name="profile"
                  value={editFormData.profileId}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, profileId: e.target.value }))}
                  placeholder="Enter profile name"
                  className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                  required
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
    </div>
  )
}
