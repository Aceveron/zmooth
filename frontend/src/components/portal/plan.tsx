"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Wifi } from "lucide-react"

interface Plan {
  id: string
  title: string
  description: string
  price: number
  devices: number
  duration: string
}

interface PlanCardProps {
  plan: Plan
  onSelect: () => void
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }} className="relative">
      <Card className="overflow-hidden glass border-brand-green/30 text-white shadow-lg">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent opacity-50"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <CardHeader className="relative z-10 border-b border-brand-green/30 p-3 sm:p-4">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-green opacity-70 shadow-neon-sm"></div>
          <CardTitle className="text-brand-green text-base sm:text-lg font-bold">{plan.title}</CardTitle>
          <CardDescription className="text-white text-xs sm:text-sm font-medium">{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-3 sm:pt-4 p-3 sm:p-4 relative z-10">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-green" />
              <span>
                {plan.devices} {plan.devices === 1 ? "device" : "devices"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium">
              <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-brand-green" />
              <span>{plan.duration}</span>
            </div>
          </div>
          <div className="text-center">
            <motion.p
              className="text-2xl sm:text-3xl font-bold text-brand-green"
              animate={{ textShadow: ["0 0 0px #39FF14", "0 0 10px #39FF14", "0 0 0px #39FF14"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              KES {plan.price}
            </motion.p>
          </div>
        </CardContent>
        <CardFooter className="relative z-10 p-3 sm:p-4 pt-0 sm:pt-0">
          <Button
            className="w-full bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon font-bold transition-all"
            onClick={onSelect}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
