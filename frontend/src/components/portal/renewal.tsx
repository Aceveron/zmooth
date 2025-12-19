"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AutoRenewal {
  planId: string
  title: string
  price: number
  duration: string
  paymentMethod: string
  phoneNumber?: string
  cardDetails?: {
    lastFour: string
  }
  nextRenewal: string
}

export function AutoRenewalManager() {
  const [renewals, setRenewals] = useState<AutoRenewal[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRenewal, setSelectedRenewal] = useState<AutoRenewal | null>(null)

  // Load auto-renewals from localStorage on component mount
  useEffect(() => {
    const storedRenewals = localStorage.getItem("autoRenewals")
    if (storedRenewals) {
      setRenewals(JSON.parse(storedRenewals))
    }
  }, [])

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Handle cancellation of auto-renewal
  const handleCancelRenewal = (renewal: AutoRenewal) => {
    setSelectedRenewal(renewal)
    setIsDeleteDialogOpen(true)
  }

  // Confirm cancellation
  const confirmCancelRenewal = () => {
    if (!selectedRenewal) return

    const updatedRenewals = renewals.filter((r) => r.planId !== selectedRenewal.planId)
    setRenewals(updatedRenewals)
    localStorage.setItem("autoRenewals", JSON.stringify(updatedRenewals))
    setIsDeleteDialogOpen(false)
    setSelectedRenewal(null)
  }

  // If no auto-renewals, don't render the component
  if (renewals.length === 0) return null

  return (
    <>
      <Card className="glass border-brand-green/30 mt-6">
        <CardHeader className="p-3 sm:p-4 sm:pb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-brand-green" />
            <div>
              <CardTitle className="text-base sm:text-lg text-brand-green">Active Auto-Renewals</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-white/90">
                Your plans that will be automatically renewed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-2">
          <div className="space-y-3">
            {renewals.map((renewal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-brand-green/10 border border-brand-green/30 rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium text-brand-green">{renewal.title}</h4>
                  <p className="text-xs text-white/80">
                    KES {renewal.price} • {renewal.paymentMethod.toUpperCase()} • Next renewal:{" "}
                    {formatDate(renewal.nextRenewal)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-red-500/20"
                  onClick={() => handleCancelRenewal(renewal)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass border-brand-green/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brand-green">Cancel Auto-Renewal</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              Are you sure you want to cancel the auto-renewal for {selectedRenewal?.title}? Your plan will not be
              renewed automatically when it expires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-brand-green/50 text-brand-green hover:bg-brand-green/10">
              Keep Auto-Renewal
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600" onClick={confirmCancelRenewal}>
              Cancel Auto-Renewal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
