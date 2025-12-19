"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Smartphone, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"

interface Plan {
  id: string
  title: string
  description: string
  price: number
  devices: number
  duration: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [autoRenew, setAutoRenew] = useState(false)

  // Handle payment submission
  const handleSubmitPayment = async () => {
    if (!plan) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // This would be replaced with actual payment processing logic
      // using Firebase Cloud Functions to handle M-Pesa STK Push or Stripe
      setIsProcessing(false)
      setIsSuccess(true)

      // If auto-renewal is enabled, store this preference
      if (autoRenew) {
        // In a real implementation, this would store the auto-renewal preference in Firebase
        console.log(`Auto-renewal enabled for plan: ${plan.id}`)

        // Store in localStorage for demo purposes
        const renewals = JSON.parse(localStorage.getItem("autoRenewals") || "[]")
        renewals.push({
          planId: plan.id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          paymentMethod,
          phoneNumber: paymentMethod === "mpesa" || paymentMethod === "airtel" ? phoneNumber : undefined,
          cardDetails:
            paymentMethod === "card"
              ? {
                  lastFour: cardNumber.slice(-4),
                }
              : undefined,
          nextRenewal: new Date(Date.now() + getMillisecondsFromDuration(plan.duration)).toISOString(),
        })
        localStorage.setItem("autoRenewals", JSON.stringify(renewals))
      }

      // Simulate auto-connect after successful payment
      setTimeout(() => {
        // This would trigger MikroTik API to create user and connect
        onClose()
        // Reset success state for next payment
        setIsSuccess(false)
      }, 3000)
    }, 2000)
  }

  // Helper function to convert duration string to milliseconds
  const getMillisecondsFromDuration = (duration: string): number => {
    if (duration.includes("minute")) {
      const minutes = Number.parseInt(duration.split(" ")[0])
      return minutes * 60 * 1000
    } else if (duration.includes("hour")) {
      const hours = Number.parseInt(duration.split(" ")[0])
      return hours * 60 * 60 * 1000
    } else if (duration.includes("day")) {
      const days = Number.parseInt(duration.split(" ")[0])
      return days * 24 * 60 * 60 * 1000
    } else if (duration.includes("week")) {
      const weeks = Number.parseInt(duration.split(" ")[0])
      return weeks * 7 * 24 * 60 * 60 * 1000
    } else {
      // Default to 30 days for monthly plans
      return 30 * 24 * 60 * 60 * 1000
    }
  }

  // Show auto-renewal option only for the 30-minute plan
  const showAutoRenewal = plan?.id === "hourly-1"

  if (!plan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-brand-green/30 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-brand-green font-bold">Complete Your Purchase</DialogTitle>
          <DialogDescription className="text-white font-medium">
            {isSuccess
              ? "Payment successful! Connecting you to the internet..."
              : `Select your preferred payment method to purchase ${plan.title} for KES ${plan.price}`}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-brand-green p-3 text-brand-black mb-4 animate-pulse shadow-neon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <motion.p
              className="text-center text-white font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your payment of KES {plan.price} has been processed successfully. You will be connected automatically in a
              moment.
            </motion.p>
            {autoRenew && (
              <motion.div
                className="mt-4 p-3 bg-brand-green/10 border border-brand-green/30 rounded-lg flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RefreshCw className="h-5 w-5 text-brand-green" />
                <p className="text-sm text-white">
                  Auto-renewal is active. Your plan will be renewed automatically when it expires.
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <Tabs defaultValue="mpesa" className="w-full" onValueChange={setPaymentMethod}>
              <TabsList className="grid grid-cols-3 mb-4 bg-brand-darkgray p-1 rounded-lg">
                <TabsTrigger
                  value="mpesa"
                  className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
                >
                  M-Pesa
                </TabsTrigger>
                <TabsTrigger
                  value="airtel"
                  className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
                >
                  Airtel Money
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  className="data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
                >
                  Card
                </TabsTrigger>
              </TabsList>

              {/* M-Pesa Payment */}
              <TabsContent value="mpesa">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-phone" className="text-brand-green font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="mpesa-phone"
                      placeholder="254700000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                    <p className="text-sm text-white font-medium">
                      You will receive an STK push notification to complete the payment.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Airtel Money Payment */}
              <TabsContent value="airtel">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="airtel-phone" className="text-brand-green font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="airtel-phone"
                      placeholder="254700000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                    <p className="text-sm text-white font-medium">You will receive a prompt to complete the payment.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Card Payment */}
              <TabsContent value="card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-brand-green font-medium">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-brand-green font-medium">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc" className="text-brand-green font-medium">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Auto-renewal option for 30-minute plan */}
            {showAutoRenewal && (
              <div className="mt-4 p-3 bg-brand-green/10 border border-brand-green/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-brand-green" />
                    <div>
                      <h4 className="text-sm font-medium text-brand-green">Enable Auto-Renewal</h4>
                      <p className="text-xs text-white/80">Your plan will be automatically renewed every 30 minutes</p>
                    </div>
                  </div>
                  <Switch
                    checked={autoRenew}
                    onCheckedChange={setAutoRenew}
                    className="data-[state=checked]:bg-brand-green"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between mt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="mb-2 sm:mb-0 border-brand-green/50 text-brand-green hover:bg-brand-green/10 font-medium"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPayment}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "card" ? <CreditCard className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    Pay KES {plan?.price}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
