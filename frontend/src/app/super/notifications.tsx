"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, XCircle } from "lucide-react"

type Notif = {
  id: string
  label: string
  desc: string
  icon: any
}

const ALL_NOTIFICATIONS: Notif[] = [
  { id: "n1", label: "Failed Login Attempts", desc: "Security monitoring alerts.", icon: XCircle },
  { id: "n2", label: "Admin Alerts", desc: "Suspicious activity or system errors.", icon: Bell },
]

export default function NotificationsCenter() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    n1: true,
    n2: true,
  })
  const navigate = useNavigate()

  return (
    <Card className="glass border-brand-green/30 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button
          variant="ghost"
          className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        <div className="flex-1 flex justify-center">
          <CardTitle className="flex items-center gap-2 text-brand-green text-center">
            <Bell className="size-5" />
            Notifications
          </CardTitle>
        </div>
        <div style={{ width: 48 }} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {ALL_NOTIFICATIONS.map((n) => {
            const Icon = n.icon
            const on = enabled[n.id]
            return (
              <div key={n.id} className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{n.label}</div>
                    <div className="text-sm text-muted-foreground">{n.desc}</div>
                  </div>
                </div>
                <Button
                  className={on
                    ? "bg-brand-green text-brand-black hover:bg-brand-neongreen"
                    : "bg-red-600 text-white hover:bg-red-700"
                  }
                  onClick={() => setEnabled((s) => ({ ...s, [n.id]: !on }))}
                >
                  {on ? "Enabled" : "Disabled"}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

