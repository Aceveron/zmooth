"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wifi, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"

export function AdminOverview() {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className="glass border-brand-green/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-brand-green">Total Users</CardTitle>
              <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-brand-green" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">128</div>
              <p className="text-xs text-gray-400 flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className="glass border-brand-green/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-brand-green">Active Sessions</CardTitle>
              <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-brand-green" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">42</div>
              <p className="text-xs text-gray-400 flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8%
                </span>
                from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className="glass border-brand-green/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-brand-green">Revenue (Today)</CardTitle>
              <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-brand-green" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">KES 4,250</div>
              <p className="text-xs text-gray-400 flex items-center">
                <span className="text-red-500 flex items-center mr-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  3%
                </span>
                from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className="glass border-brand-green/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-brand-green">Revenue (Month)</CardTitle>
              <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-brand-green" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white">KES 86,400</div>
              <p className="text-xs text-gray-400 flex items-center">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  18%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass border-brand-green/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-brand-green">Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full flex items-center justify-center text-gray-400 border border-brand-green/20 rounded-md">
              <div className="text-center p-4">
                <div className="mb-2 text-brand-green">📊</div>
                Revenue chart will be displayed here
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-brand-green/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-brand-green">User Activity</CardTitle>
            <CardDescription>Active users over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full flex items-center justify-center text-gray-400 border border-brand-green/20 rounded-md">
              <div className="text-center p-4">
                <div className="mb-2 text-brand-green">👥</div>
                User activity chart will be displayed here
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border-brand-green/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-brand-green">Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4 border-brand-green/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">New user registered</p>
                  <p className="text-sm text-gray-400">John Doe (john@example.com)</p>
                </div>
                <span className="text-sm text-gray-400 bg-brand-green/10 px-2 py-1 rounded-full">2 minutes ago</span>
              </div>
            </div>
            <div className="border-b pb-4 border-brand-green/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Payment received</p>
                  <p className="text-sm text-gray-400">KES 500 - Monthly Plan (Transaction #12345)</p>
                </div>
                <span className="text-sm text-gray-400 bg-brand-green/10 px-2 py-1 rounded-full">15 minutes ago</span>
              </div>
            </div>
            <div className="border-b pb-4 border-brand-green/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">User disconnected</p>
                  <p className="text-sm text-gray-400">Jane Smith (jane@example.com)</p>
                </div>
                <span className="text-sm text-gray-400 bg-brand-green/10 px-2 py-1 rounded-full">1 hour ago</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Plan updated</p>
                  <p className="text-sm text-gray-400">Added new "Stream like a Pro" plan</p>
                </div>
                <span className="text-sm text-gray-400 bg-brand-green/10 px-2 py-1 rounded-full">3 hours ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
