"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wifi, Clock, Calendar, CalendarDays, CheckCircle } from "lucide-react"
import { PlanCard } from "@/components/portal/plan"
import { PaymentModal } from "@/components/portal/pay"
import { ChatbotButton } from "@/components/chatbot"
import { AutoRenewalManager } from "@/components/portal/renewal"

// Plan data structure
interface Plan {
  id: string
  title: string
  description: string
  price: number
  devices: number
  duration: string
}

// Plans organized by category
const plans = {
  hourly: [
    {
      id: "hourly-1",
      title: "Mwananchi Ji Enjoy Unlimited",
      description: "Unlimited browsing for 30 minutes",
      price: 5,
      devices: 1,
      duration: "30 minutes",
    },
    {
      id: "hourly-2",
      title: "Unlimited 1 Hour",
      description: "Premium speed for 1 hour",
      price: 10,
      devices: 1,
      duration: "1 hour",
    },
  ],
  daily: [
    {
      id: "daily-1",
      title: "Daily Unlimited",
      description: "Unlimited browsing for 24 hours",
      price: 30,
      devices: 2,
      duration: "24 hours",
    },
    {
      id: "daily-2",
      title: "5GB Two Days",
      description: "5GB data valid for 2 days",
      price: 40,
      devices: 1,
      duration: "48 hours",
    },
  ],
  weekly: [
    {
      id: "weekly-1",
      title: "Unlimited Weekly",
      description: "Unlimited browsing for 7 days",
      price: 150,
      devices: 1,
      duration: "7 days",
    },
    {
      id: "weekly-2",
      title: "Super Weekly",
      description: "High-speed browsing for 7 days",
      price: 250,
      devices: 2,
      duration: "7 days",
    },
  ],
  monthly: [
    {
      id: "monthly-1",
      title: "Rocket Monthly",
      description: "Basic monthly plan",
      price: 500,
      devices: 1,
      duration: "30 days",
    },
    {
      id: "monthly-2",
      title: "Stream like a Pro",
      description: "Optimized for streaming services",
      price: 1000,
      devices: 2,
      duration: "30 days",
    },
    {
      id: "monthly-3",
      title: "Online Surfing Monthly",
      description: "Perfect for families",
      price: 1500,
      devices: 3,
      duration: "30 days",
    },
    {
      id: "monthly-4",
      title: "Online Gurus",
      description: "For small offices and power users",
      price: 2500,
      devices: 5,
      duration: "30 days",
    },
    {
      id: "monthly-5",
      title: "Special Plan",
      description: "Enterprise-grade connectivity",
      price: 3500,
      devices: 10,
      duration: "30 days",
    },
  ],
}

export function ClientHotspot() {
  // State for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [activeTab, setActiveTab] = useState("hourly")
  const [voucherCode, setVoucherCode] = useState("")
  const [transactionCode, setTransactionCode] = useState("")
  const [showVoucherInput, setShowVoucherInput] = useState(false)
  const [showTransactionInput, setShowTransactionInput] = useState(false)

  // Handle plan selection and open payment modal
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)
  }

  // Handle connecting with voucher
  const handleVoucherConnect = () => {
    // This would connect to Firebase and MikroTik API
    console.log("Connecting with voucher:", voucherCode)
    // Reset and close input
    setVoucherCode("")
    setShowVoucherInput(false)
  }

  // Handle connecting with transaction code
  const handleTransactionConnect = () => {
    // This would verify the transaction and connect
    console.log("Connecting with transaction:", transactionCode)
    // Reset and close input
    setTransactionCode("")
    setShowTransactionInput(false)
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 overflow-x-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-block relative">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-red-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
                  <span className="text-2xl sm:text-4xl font-bold text-black absolute right-1">ZMO</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-black ml-[-10px]">OTH</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-green mb-1 sm:mb-2 neon-text">Zmooth Wifi</h2>
              <p className="text-white/90 text-base sm:text-lg font-medium">
                Connect to the internet at your own convenience
              </p>
              <p className="mt-1 text-yellow-300 font-semibold text-sm sm:text-base">Unmatched Network Reliability</p>
            </div>
          </div>

          {/* Instructions - Redesigned for better mobile experience */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-green mb-3 sm:mb-4">How to Connect:</h2>
            <div className="glass border border-brand-green/30 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              {/* Step 1 */}
              <div className="flex items-center mb-4 bg-black/50 rounded-lg p-3 border-l-4 border-brand-green">
                <div className="bg-brand-green text-brand-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-neon mr-3">
                  1
                </div>
                <div>
                  <h3 className="text-brand-green font-semibold text-sm sm:text-base">Select Your Plan</h3>
                  <p className="text-white text-xs sm:text-sm font-medium">
                    Choose from our hourly, daily, weekly, or monthly plans
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center mb-4 bg-black/50 rounded-lg p-3 border-l-4 border-brand-green">
                <div className="bg-brand-green text-brand-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-neon mr-3">
                  2
                </div>
                <div>
                  <h3 className="text-brand-green font-semibold text-sm sm:text-base">Click "Buy Now"</h3>
                  <p className="text-white text-xs sm:text-sm font-medium">
                    Proceed to payment with your selected plan
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center mb-4 bg-black/50 rounded-lg p-3 border-l-4 border-brand-green">
                <div className="bg-brand-green text-brand-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-neon mr-3">
                  3
                </div>
                <div>
                  <h3 className="text-brand-green font-semibold text-sm sm:text-base">Complete Payment</h3>
                  <p className="text-white text-xs sm:text-sm font-medium">
                    Enter your payment details and confirm with your PIN
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-center bg-black/50 rounded-lg p-3 border-l-4 border-brand-green">
                <div className="bg-brand-green text-brand-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-neon mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-brand-green font-semibold text-sm sm:text-base">Instant Connection</h3>
                  <p className="text-white text-xs sm:text-sm font-medium">
                    You're automatically connected to our high-speed network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Auto-Renewal Manager */}
        <AutoRenewalManager />

        {/* Plan Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <Tabs value={activeTab} defaultValue="hourly" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 glass p-1 rounded-xl border border-brand-green/30">
              <TabsTrigger
                value="hourly"
                className="flex items-center gap-1 data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Hourly</span>
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="flex items-center gap-1 data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Daily</span>
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="flex items-center gap-1 data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
              >
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Weekly</span>
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="flex items-center gap-1 data-[state=active]:bg-brand-green data-[state=active]:text-brand-black font-medium"
              >
                <Wifi className="h-4 w-4" />
                <span className="hidden sm:inline">Monthly</span>
              </TabsTrigger>
            </TabsList>

            {/* Hourly Plans */}
            <TabsContent value="hourly" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {plans.hourly.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={() => handleSelectPlan(plan)} />
                ))}
              </div>
            </TabsContent>

            {/* Daily Plans */}
            <TabsContent value="daily" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {plans.daily.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={() => handleSelectPlan(plan)} />
                ))}
              </div>
            </TabsContent>

            {/* Weekly Plans */}
            <TabsContent value="weekly" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {plans.weekly.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={() => handleSelectPlan(plan)} />
                ))}
              </div>
            </TabsContent>

            {/* Monthly Plans */}
            <TabsContent value="monthly" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {plans.monthly.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={() => handleSelectPlan(plan)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          {/* Already Purchased */}
          <Card className="glass border-brand-green/30">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg text-brand-green">Already Purchased?</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Button className="w-full bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon transition-all font-medium">
                Connect
              </Button>
            </CardContent>
          </Card>

          {/* Voucher Code */}
          <Card className="glass border-brand-green/30">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg text-brand-green">Have Voucher Code?</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <AnimatePresence>
                {showVoucherInput ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Input
                      placeholder="Enter voucher code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/20 font-medium"
                        onClick={() => setShowVoucherInput(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon font-medium"
                        onClick={handleVoucherConnect}
                      >
                        Connect
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    className="w-full bg-black/50 border-brand-green/50 text-brand-green hover:bg-brand-green/20 font-medium"
                    variant="outline"
                    onClick={() => setShowVoucherInput(true)}
                  >
                    Proceed
                  </Button>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Transaction Code */}
          <Card className="glass border-brand-green/30">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg text-brand-green">Use Transaction Code?</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <AnimatePresence>
                {showTransactionInput ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Input
                      placeholder="Enter transaction code"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/20 font-medium"
                        onClick={() => setShowTransactionInput(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon font-medium"
                        onClick={handleTransactionConnect}
                      >
                        Connect
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    className="w-full bg-black/50 border-brand-green/50 text-brand-green hover:bg-brand-green/20 font-medium"
                    variant="outline"
                    onClick={() => setShowTransactionInput(true)}
                  >
                    Proceed
                  </Button>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <Card className="glass border-brand-green/30">
            <CardHeader className="p-3 sm:p-4 sm:pb-2">
              <CardTitle className="text-base sm:text-lg text-brand-green">Recent Purchases</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-white/90">
                Your recent transactions and connection status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-2">
              <div className="text-center text-white py-3 sm:py-4 text-sm font-medium">No recent purchases found</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <div className="mt-6 sm:mt-8 text-center pb-16 sm:pb-8">
          <p className="text-white text-sm sm:text-base font-medium">For more inquiries</p>
          <div className="flex items-center justify-center gap-2 text-brand-green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-lg sm:text-xl font-bold">0745437063</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} plan={selectedPlan} />

      {/* Chatbot Button */}
      <ChatbotButton />
    </div>
  )
}
