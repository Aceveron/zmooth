import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  username: string
  password: string
  role: "admin" | "super"
  email: string
  phone: string
  name: string
}

// Mock credentials
const VALID_USERS: User[] = [
  {
    username: "admin1",
    password: "admin123",
    role: "admin",
    email: "admin@zmooth.local",
    phone: "+254712345678",
    name: "Admin One",
  },
  {
    username: "super",
    password: "super123",
    role: "super",
    email: "root@zmooth.local",
    phone: "+254787654321",
    name: "Super User",
  },
]

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      // Find user by email and password
      const user = VALID_USERS.find((u) => u.email === email && u.password === password)

      if (!user) {
        setError("Invalid email or password")
        setPending(false)
        return
      }

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.username,
          role: user.role,
          email: user.email,
          phone: user.phone,
          name: user.name,
        })
      )

      // Navigate based on role
      if (user.role === "super") {
        navigate("/super")
      } else {
        navigate("/admin")
      }
    } catch (err: any) {
      setError("Login failed. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-xs text-gray-500 space-y-1 mt-4 pt-4 border-t">
              <p className="font-semibold">Test Credentials:</p>
              <p>Admin: admin@zmooth.local / admin123</p>
              <p>Super: root@zmooth.local / super123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
