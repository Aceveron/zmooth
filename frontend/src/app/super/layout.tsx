"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { SuperDashboard } from "../../components/super/dashboard"

export default function SuperLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const _importMeta = (import.meta as unknown) as { env?: { VITE_API_URL?: string } }
        const apiBase = _importMeta.env?.VITE_API_URL ?? "http://localhost:8000"
        const res = await fetch(`${apiBase}/auth/me`, { credentials: "include" })
        if (!res.ok) throw new Error("unauth")
        const user = await res.json()
        if (user.role !== "super") {
          if (!cancelled) navigate("/unauthorized")
          return
        }
        if (!cancelled) setAuthorized(true)
      } catch {
        const next = encodeURIComponent(location.pathname || "/")
        if (!cancelled) navigate(`/login?next=${next}`)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [navigate, location])

  if (!authorized) return null
  return (
    <main className="min-h-screen">
      <SuperDashboard />
    </main>
  )
}
