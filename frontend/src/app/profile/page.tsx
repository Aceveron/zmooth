import type React from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const navigate = useNavigate()

  // Example state for profile info
  const [profile, setProfile] = useState({
    name: "Aceveronn Admin",
    email: "admin@zmoothwifi.net",
    role: "Admin", // or "Super Admin"
    phone: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setProfile((prev) => ({ ...prev, role: value === "super_admin" ? "Super Admin" : "Admin" }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Send profile update to backend using axios
      console.log("Profile updated:", profile)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
      })
    }
  }

  const handleReset = () => {
    setProfile({
      name: "Aceveronn Admin",
      email: "admin@zmoothwifi.net",
      role: "Admin",
      phone: "",
      password: "",
    })
    toast({
      title: "Reset",
      description: "Profile form has been reset.",
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="glass border-brand-green/30 shadow-lg w-full max-w-xl mx-auto rounded-xl">
        <div className="flex flex-row items-center justify-between w-full p-6 pb-0">
          <Button
            variant="ghost"
            className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-brand-green text-2xl font-bold">Profile Settings</span>
            <span className="text-gray-300">Manage your account information and preferences</span>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-brand-green">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="bg-brand-darkgray text-white placeholder:text-white/70 border-brand-green/30 focus-visible:ring-brand-green"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-green">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="bg-brand-darkgray text-white placeholder:text-white/70 border-brand-green/30 focus-visible:ring-brand-green"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-brand-green">Role</Label>
              <Select value={profile.role === "Super Admin" ? "super_admin" : "admin"} onValueChange={handleRoleChange}>
                <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green">
                  <SelectValue placeholder="Select admin role" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-brand-green">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                pattern="^\+?\d{10,15}$"
                inputMode="tel"
                title="Enter a valid phone number, e.g. +254701234567"
                className="bg-brand-darkgray text-white placeholder:text-white/70 border-brand-green/30 focus-visible:ring-brand-green"
                placeholder="+254701234567"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password" className="text-brand-green">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
                className="bg-brand-darkgray text-white placeholder:text-white/70 border-brand-green/30 focus-visible:ring-brand-green"
                placeholder="Enter new password (leave blank to keep current)"
              />
            </div>
          </div>
          <div className="flex w-full justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-brand-green text-brand-black hover:bg-brand-neongreen font-semibold transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
