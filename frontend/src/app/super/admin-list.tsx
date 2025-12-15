"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from 'react-router-dom'

type Role = "admin" | "super"

export type AdminRecord = {
  id: string
  username: string
  email: string
  phone: string
  role: Role
  createdAt: number
  status: "active" | "blocked"
}

// Lightweight local toast fallback to avoid dependency on UI library
const toast = (opts: { title?: string; description?: string; variant?: string }) => {
  // console log for developer visibility; no UI toast available in this build
  // fallback: log to console
  console.log("TOAST:", opts.title, opts.description, opts.variant)
}

const _importMeta = (import.meta as unknown) as { env?: { VITE_API_URL?: string } }
const apiBase = _importMeta.env?.VITE_API_URL ?? "http://localhost:8000"

const AdminService = {
  async list(): Promise<AdminRecord[]> {
    try {
      const res = await fetch(`${apiBase}/admin/list`, { credentials: "include" })
      if (!res.ok) return []
      return (await res.json()) as AdminRecord[]
    } catch {
      return []
    }
  },
  async create(input: { username: string; email: string; phone: string; role?: Role; password: string }) {
    const res = await fetch(`${apiBase}/admin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(text || `HTTP ${res.status}`)
    }
    return await res.json().catch(() => null)
  },
  async update(id: string, update: Partial<Pick<AdminRecord, "username" | "email" | "phone" | "role" | "status">>) {
    const res = await fetch(`${apiBase}/admin/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(text || `HTTP ${res.status}`)
    }
    return await res.json().catch(() => null)
  },
  async remove(id: string) {
    const res = await fetch(`${apiBase}/admin/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new Error(text || `HTTP ${res.status}`)
    }
  },
}

const DUMMY_ADMINS: AdminRecord[] = [
  {
    id: "1",
    username: "super",
    email: "root@zmooth.local",
    phone: "+2547000000001",
    role: "super",
    status: "blocked",
    createdAt: Date.parse("2025-08-01T01:30:45Z"),
  },
  {
    id: "2",
    username: "alice",
    email: "admin@zmooth.local",
    phone: "+2547000000002",
    role: "admin",
    status: "active",
    createdAt: Date.parse("2025-08-04T01:30:45Z"),
  },
  {
    id: "3",
    username: "bob",
    email: "bob@zmooth.local",
    phone: "+2547000000003",
    role: "admin",
    status: "blocked",
    createdAt: Date.parse("2025-08-08T01:30:45Z"),
  },
]

function AdminList() {
  
  function formatDateTime(dt: number) {
    const d = new Date(dt)
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
  const router = useNavigate()
  const [admins, setAdmins] = useState<AdminRecord[]>(DUMMY_ADMINS)
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "admin" as Role,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [actionOpen, setActionOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState("Select action")
  const actions = ["Delete Selected", "Block Selected", "Activate Selected"]
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ id: "", username: "", email: "", phone: "", role: "admin" as Role })
  const [editRoleOpen, setEditRoleOpen] = useState(false)
  const [addRoleOpen, setAddRoleOpen] = useState(false)

  const loadAdmins = useCallback(async () => {
    const data = await AdminService.list()
    if (data && data.length) {
      const merged = data.map((d) => {
        const dummy = DUMMY_ADMINS.find((x) => x.id === d.id)
        return dummy ? { ...d, status: dummy.status ?? d.status } : d
      })
      setAdmins(merged)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await loadAdmins()
    })()
    return () => {
      cancelled = true
    }
  }, [loadAdmins])

  useEffect(() => {
    const onDocClick = () => setOpenActionMenuId(null)
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // (checkbox/select handlers removed — table uses simple actions)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await AdminService.create(formData)
      setIsAddAdminDialogOpen(false)
      setFormData({ username: "", email: "", phone: "", password: "", role: "admin" })
      await loadAdmins()
      toast({ title: "Success", description: "Admin created successfully!" })
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error)
        toast({ variant: "destructive", title: "Error", description: msg || "Failed to create admin" })
      }
  }

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Edit Admin - open modal with pre-filled data
  const handleEditClick = (admin: AdminRecord) => {
    setEditFormData({ id: admin.id, username: admin.username, email: admin.email, phone: admin.phone, role: admin.role })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { id, username, email, phone, role } = editFormData
      await AdminService.update(id, { username, email, phone, role })
      await loadAdmins()
      setIsEditDialogOpen(false)
      toast({ title: "Success", description: "Admin updated successfully!" })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      toast({ variant: "destructive", title: "Error", description: msg || "Failed to update admin" })
    }
  }

  // Delete Admin handled inline from button click

  // Bulk actions removed — use inline actions in table

  // Bulk delete handlers removed

  return (
    <div className="py-6 px-8 text-white">
      <div className="w-full mx-auto">
        <div className="mb-6 flex items-center">
          <button onClick={() => router(-1)} className="px-3 py-2 rounded bg-white text-black">← Back</button>
          <div className="flex-1 text-center">
            <h2 className="text-4xl font-extrabold text-green-400 drop-shadow-lg">Admin Management</h2>
            <p className="text-sm text-gray-300">Manage system administrators and their roles</p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setActionOpen((s) => !s)}
                className="flex items-center gap-3 px-4 py-2 bg-[#050705] border border-green-700 rounded text-white min-w-[160px]"
              >
                <span className="flex-1 text-left">{selectedAction}</span>
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {actionOpen && (
                <div className="absolute z-20 mt-2 w-40 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg">
                  {actions.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setSelectedAction(a)
                        setActionOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-3 ${selectedAction === a ? 'bg-lime-400 text-black' : 'text-white'} hover:bg-lime-900/30 whitespace-nowrap overflow-hidden`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={async () => {
                try {
                  if (selectedAction === 'Delete Selected') {
                    await Promise.all(selectedIds.map((id) => AdminService.remove(id)))
                  } else if (selectedAction === 'Block Selected') {
                    await Promise.all(selectedIds.map((id) => AdminService.update(id, { status: 'blocked' })))
                  } else if (selectedAction === 'Activate Selected') {
                    await Promise.all(selectedIds.map((id) => AdminService.update(id, { status: 'active' })))
                  }
                  await loadAdmins()
                  setSelectedIds([])
                  toast({ title: 'Success', description: 'Action applied' })
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : String(err)
                  toast({ variant: 'destructive', title: 'Error', description: msg || 'Failed to apply action' })
                }
              }} className="px-3 py-2 border border-green-700 text-green-300 rounded">Apply</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input
                placeholder="Search by username, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 bg-[#07100b] border border-green-700 rounded text-white"
              />
            </div>
            <button onClick={() => setIsAddAdminDialogOpen((s) => !s)} className="px-4 py-2 bg-green-500 text-black rounded">+ Add Admin</button>
          </div>
        </div>

        {isAddAdminDialogOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsAddAdminDialogOpen(false)} />
            <div className="relative z-50 w-full max-w-2xl mx-4">
              <form onSubmit={handleSubmit} className="mb-4 p-6 bg-[#07100b] border border-green-700 rounded-lg">
                <button type="button" onClick={() => setIsAddAdminDialogOpen(false)} className="absolute right-4 top-4 text-white/80">✕</button>
                <h3 className="text-2xl text-green-400 font-bold mb-2">Add New Admin</h3>
                <p className="text-sm text-gray-300 mb-4">Create a new administrator account</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-green-400">Username</label>
                    <input name="username" placeholder="Enter username" value={formData.username} onChange={handleInputChange} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Email</label>
                    <input name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Phone</label>
                    <input name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleInputChange} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Role</label>
                    <div className="relative">
                      <button type="button" onClick={() => setAddRoleOpen((s) => !s)} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full flex items-center justify-between">
                        <span>{formData.role === 'super' ? 'Super Admin' : 'Admin'}</span>
                        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>

                      {addRoleOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg z-50">
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectChange('role', 'admin')
                              setAddRoleOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${formData.role === 'admin' ? 'bg-lime-400 text-black' : 'text-white'} hover:bg-lime-900/30`}
                          >
                            {formData.role === 'admin' && (
                              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                            <span className="flex-1">Admin</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSelectChange('role', 'super')
                              setAddRoleOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${formData.role === 'super' ? 'bg-lime-400 text-black' : 'text-white'} hover:bg-lime-900/30`}
                          >
                            {formData.role === 'super' && (
                              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                            <span className="flex-1">Super Admin</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-green-400">Password</label>
                    <input name="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddAdminDialogOpen(false)} className="px-4 py-2 rounded bg-gray-700 text-white">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-lime-400 text-black">Create Admin</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditDialogOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsEditDialogOpen(false)} />
            <div className="relative z-50 w-full max-w-2xl mx-4">
              <form onSubmit={handleEditSubmit} className="mb-4 p-6 bg-[#07100b] border border-green-700 rounded-lg">
                <button type="button" onClick={() => setIsEditDialogOpen(false)} className="absolute right-4 top-4 text-white/80">✕</button>
                <h3 className="text-2xl text-green-400 font-bold mb-2">Edit Admin</h3>
                <p className="text-sm text-gray-300 mb-4">Update admin details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-green-400">Username</label>
                    <input name="username" placeholder="Username" value={editFormData.username} onChange={(e) => setEditFormData((p) => ({ ...p, username: e.target.value }))} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Email</label>
                    <input name="email" type="email" placeholder="Email" value={editFormData.email} onChange={(e) => setEditFormData((p) => ({ ...p, email: e.target.value }))} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Phone</label>
                    <input name="phone" placeholder="Phone" value={editFormData.phone} onChange={(e) => setEditFormData((p) => ({ ...p, phone: e.target.value }))} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full" required />
                  </div>
                  <div>
                    <label className="text-sm text-green-400">Role</label>
                    <div className="relative">
                      <button type="button" onClick={() => setEditRoleOpen((s) => !s)} className="mt-1 p-3 bg-[#071014] border border-green-600 rounded text-white w-full flex items-center justify-between">
                        <span>{editFormData.role === 'super' ? 'Super Admin' : 'Admin'}</span>
                        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>

                      {editRoleOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg z-50">
                          <button
                            type="button"
                            onClick={() => {
                              setEditFormData((p) => ({ ...p, role: 'admin' }))
                              setEditRoleOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${editFormData.role === 'admin' ? 'bg-lime-400 text-black' : 'text-white'} hover:bg-lime-900/30`}
                          >
                            {editFormData.role === 'admin' && (
                              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                            <span className="flex-1">Admin</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditFormData((p) => ({ ...p, role: 'super' }))
                              setEditRoleOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${editFormData.role === 'super' ? 'bg-lime-400 text-black' : 'text-white'} hover:bg-lime-900/30`}
                          >
                            {editFormData.role === 'super' && (
                              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                            <span className="flex-1">Super Admin</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditDialogOpen(false)} className="px-4 py-2 rounded bg-gray-700 text-white">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-lime-400 text-black">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-[#050705] border border-green-700 rounded-xl p-4 overflow-hidden h-90">
          <div className="overflow-auto">
            <table className="overflow-auto w-full text-left table-fixed h-100">
              <thead>
                <tr className="text-sm text-gray-300 border-b border-green-700">
                  <th className="w-12 py-3 pl-3 align-middle">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-green-600"
                      checked={filteredAdmins.length > 0 && selectedIds.length === filteredAdmins.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(filteredAdmins.map((a) => a.id))
                        else setSelectedIds([])
                      }}
                    />
                  </th>
                  <th className="py-3 align-middle">Username</th>
                  <th className="align-middle">Email</th>
                  <th className="align-middle">Phone</th>
                  <th className="align-middle">Role</th>
                  <th className="align-middle">Status</th>
                  <th className="align-middle">Created</th>
                  <th className="py-3 pr-12 w-24 align-middle">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="h-16 border-b border-green-700 hover:bg-black/20">
                    <td className="py-3 pl-3 align-middle">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-green-600"
                        checked={selectedIds.includes(admin.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setSelectedIds((prev) => {
                            if (checked) return Array.from(new Set([...prev, admin.id]))
                            return prev.filter((id) => id !== admin.id)
                          })
                        }}
                      />
                    </td>
                    <td className="py-3 align-middle">{admin.username}</td>
                    <td className="align-middle">{admin.email}</td>
                    <td className="align-middle">{admin.phone}</td>
                    <td className="align-middle">
                      <span className="inline-block text-sm px-3 py-1 rounded-full border border-green-700 text-white bg-[#071014]">
                        {admin.role === 'super' ? 'super_admin' : 'admin'}
                      </span>
                    </td>
                    <td className="align-middle">
                      {admin.status === 'active' ? (
                        <span className="inline-block text-sm px-3 py-1 rounded-full bg-green-500 text-white font-semibold">Active</span>
                      ) : (
                        <span className="inline-block text-sm px-3 py-1 rounded-full bg-red-500 text-white font-semibold">Blocked</span>
                      )}
                    </td>
                    <td className="align-middle">{formatDateTime(admin.createdAt)}</td>
                    <td className="py-2 relative pr-12 align-middle">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenActionMenuId((cur) => (cur === admin.id ? null : admin.id))
                        }}
                        className="p-2 rounded hover:bg-black/20"
                        aria-haspopup="true"
                        aria-expanded={openActionMenuId === admin.id}
                      >
                        <svg className="w-5 h-5 text-green-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                        </svg>
                      </button>

                      {openActionMenuId === admin.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-3 top-full mt-2 w-28 bg-[#07100b] border border-green-700 rounded-lg overflow-hidden shadow-lg z-30"
                        >
                          <button
                                onClick={() => {
                                  handleEditClick(admin)
                                  setOpenActionMenuId(null)
                                }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-green-900/30"
                          >
                            <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3.75L14.06 6.19a1.5 1.5 0 0 1 2.12 0l1.63 1.63a1.5 1.5 0 0 1 0 2.12L6.75 21H3z" stroke="currentColor" strokeWidth="0" fill="currentColor"/></svg>
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                const newStatus = admin.status === "blocked" ? "active" : "blocked"
                                await AdminService.update(admin.id, { status: newStatus })
                                await loadAdmins()
                                toast({ title: "Success", description: `Admin ${newStatus === 'active' ? 'activated' : 'blocked'}.` })
                              } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : String(err)
                                toast({ variant: "destructive", title: "Error", description: msg || "Failed to update status" })
                              } finally {
                                setOpenActionMenuId(null)
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-green-900/30"
                          >
                            <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span>{admin.status === "blocked" ? "Activate" : "Block"}</span>
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                await AdminService.remove(admin.id)
                                await loadAdmins()
                                toast({ title: "Success", description: "Admin deleted successfully!" })
                              } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : String(err)
                                toast({ variant: "destructive", title: "Error", description: msg || "Failed to delete admin" })
                              } finally {
                                setOpenActionMenuId(null)
                              }
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-500 text-sm hover:bg-red-600/10"
                          >
                            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-white/60">No admins found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminList
