"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function Page() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Message sent", description: "Support will reply soon." })
    }, 800)
  }

  return (
    <div className="p-4 md:p-6 flex items-center justify-center min-h-screen">
      <Card className="glass border-brand-green/30 max-w-2xl">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 mb-2 w-fit px-3"
            onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <CardTitle className="text-brand-green">Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Your Email" required />
            <Input placeholder="Subject" required />
            <Textarea placeholder="Describe your issue..." required />
            <Button disabled={loading}>{loading ? "Sending..." : "Send"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
