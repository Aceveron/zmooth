"use client"

import { useState } from "react"
import { Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function AddStationsPage() {
  const [name, setName] = useState("")
  const [domain, setDomain] = useState("")
  const [town, setTown] = useState("")
  const [serviceType, setServiceType] = useState<string>("")
  const [poolName, setPoolName] = useState("")
  const [poolStatus, setPoolStatus] = useState<string>("")
  const [nasIp, setNasIp] = useState("")
  const [nasSecret, setNasSecret] = useState("")
  const [supportNo, setSupportNo] = useState("")
  const [email, setEmail] = useState("")
  const [maxUsers, setMaxUsers] = useState("")
  const [sessionTimeout, setSessionTimeout] = useState("")
  const [idleTimeout, setIdleTimeout] = useState("")
  const [desc, setDesc] = useState("")

  const canSave = !!name && !!domain && !!town && !!serviceType && !!poolName && !!poolStatus && !!nasIp && !!nasSecret

  const reset = () => {
    setName("")
    setDomain("")
    setTown("")
    setServiceType("")
    setPoolName("")
    setPoolStatus("")
    setNasIp("")
    setNasSecret("")
    setSupportNo("")
    setEmail("")
    setMaxUsers("")
    setSessionTimeout("")
    setIdleTimeout("")
    setDesc("")
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="glass border-brand-green/30 shadow-lg w-full max-w-4xl">
        <CardHeader className="flex flex-col gap-4 relative">
          <button
            type="button"
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-white/80 hover:text-white transition-colors font-semibold shadow text-xl"
            onClick={() => window.history.back()}
            aria-label="Cancel"
          >
            &times;
          </button>
          <div className="flex-1 flex flex-col items-center">
            <CardTitle className="text-brand-green">Add Station</CardTitle>
            <CardDescription>Provide details to create a new station.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg NASTU HOTSPOT"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Domain Name</Label>
                  <Input
                    id="domain"
                    name="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg tandao.net"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Location / Town / City / Village</Label>
                  <Input
                    id="town"
                    name="town"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg Nairobi, Kenya"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="bg-brand-darkgray text-white">
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotspot">Hotspot</SelectItem>
                      <SelectItem value="PPPoE">PPPoE</SelectItem>
                      <SelectItem value="Static">Static</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Pool Name</Label>
                  <Input
                    id="poolName"
                    name="poolName"
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg NASTU-HOTSPOT-POOL"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Pool Status</Label>
                  <Select value={poolStatus} onValueChange={setPoolStatus}>
                    <SelectTrigger className="bg-brand-darkgray text-white">
                      <SelectValue placeholder="Select Pool Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Nas IP Address</Label>
                  <Input
                    id="nasIp"
                    name="nasIp"
                    value={nasIp}
                    onChange={(e) => setNasIp(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg 180.122.26.10"
                    required
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Nas Secret</Label>
                  <Input
                    id="nasSecret"
                    name="nasSecret"
                    value={nasSecret}
                    onChange={(e) => setNasSecret(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg 748619325"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Support Phone</Label>
                  <Input
                    id="supportNo"
                    name="supportNo"
                    value={supportNo}
                    onChange={(e) => setSupportNo(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg +254712345678"
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Support Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg support@tandao.net"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Max Users</Label>
                  <Input
                    id="maxUsers"
                    name="maxUsers"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg 200"
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Session Timeout (mins)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg 60"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-green">Idle Timeout (mins)</Label>
                  <Input
                    id="idleTimeout"
                    name="idleTimeout"
                    value={idleTimeout}
                    onChange={(e) => setIdleTimeout(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="eg 10"
                  />
                </div>
                <div>
                  <Label className="text-brand-green">Description</Label>
                  <Input
                    id="desc"
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-brand-darkgray text-white placeholder:text-white/70"
                    placeholder="Optional description..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button disabled={!canSave} className="bg-brand-green text-brand-black hover:bg-brand-neongreen font-bold">
                  <Save className="mr-2 h-4 w-4" />
                  Save Station
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddStationsPage