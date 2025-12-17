import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}

