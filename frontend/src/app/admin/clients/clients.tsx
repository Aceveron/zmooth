import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'

type Client = {
  id: string
  name: string
  phone: string
  packageName: string
  startTime: string // ISO
  endTime: string // ISO
}

const sampleClients: Client[] = [
  {
    id: "c-1001",
    name: "Alice Johnson",
    phone: "+254700111222",
    packageName: "30 Minutes",
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  },
  {
    id: "c-1002",
    name: "Brian Otieno",
    phone: "+254711555666",
    packageName: "1 Hour",
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  },
  {
    id: "c-1003",
    name: "Nafula Wanjiru",
    phone: "+254733999000",
    packageName: "Daily",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
  },
]

function AdminClients() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const clients = useMemo(() => {
    if (!query) return sampleClients
    const q = query.toLowerCase()
    return sampleClients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.packageName.toLowerCase().includes(q),
    )
  }, [query])

  function formatDateTime(dt: string) {
    const d = new Date(dt)
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const exportCsv = () => {
    const headers = ["Name", "Phone", "Package", "Start Time", "Expiry Time"]
    const lines = clients.map((c) =>
      [
        c.name,
        c.phone,
        c.packageName,
        formatDateTime(c.startTime),
        formatDateTime(c.endTime),
      ].join(","),
    )
    const csv = [headers.join(","), ...lines].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "clients.csv"
    a.click()
    URL.revokeObjectURL(url)
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
            <CardTitle className="text-brand-green">Clients</CardTitle>
          </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <div className="relative w-[200px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search name, phone, ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 w-full bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
              />
            </div>
              <Button variant="outline" onClick={exportCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
          </div>

          <div className="rounded-md border border-brand-green/30 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-brand-green/30 hover:bg-brand-green/5">
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Expiry Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c, idx) => (
                  <TableRow
                    key={c.id}
                    className={
                      "hover:bg-white/5" +
                      (idx !== clients.length - 1 ? " border-b border-brand-green/30" : "")
                    }
                  >
                    <TableCell className="py-2 pr-4 border-t border-brand-green/30">{c.name}</TableCell>
                    <TableCell className="py-2 pr-4 border-t border-brand-green/30">{c.phone}</TableCell>
                    <TableCell className="py-2 pr-4 border-t border-brand-green/30">{c.packageName}</TableCell>
                    <TableCell className="py-2 pr-4 border-t border-brand-green/30">
                      {formatDateTime(c.startTime)}
                    </TableCell>
                    <TableCell className="py-2 pr-4 border-t border-brand-green/30">
                      {formatDateTime(c.endTime)}
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-white/60 border-t border-brand-green/30">
                      No clients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>                                
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminClients