import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Wifi,
  Network,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  MessageSquare,
  Globe,
  FileText,
  Bell,
  ChevronDown,
  ChevronRight,
  Tag,
  Gauge,
  PlusCircle,
  Database,
  Server,
  Shield,
  Wallet,
  Receipt,
} from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  isOpen: boolean
}

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    hotspot: false,
    pppoe: false,
    stations: false,
    transactions: false,
    reports: false,
    billing: false,
    setup: false,
    support: false,
    ums: false,
    access: false,
  })
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Globe, label: "ISP Portal", href: "/admin/isp" },
    { icon: MessageSquare, label: "Bulk SMS", href: "/admin/sms" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  ]

  const hotspotSubMenu = [
    { icon: Wifi, label: "Hotspot Plans", href: "/admin/hotspot/plans" },
    { icon: Users, label: "Hotspot Accounts", href: "/admin/hotspot/accounts" },
    { icon: Users, label: "Hotspot Clients", href: "/admin/hotspot/clients" },
    { icon: Tag, label: "Generate Access Code", href: "/admin/hotspot/generate-code" },
    { icon: Gauge, label: "Bandwidth Profile", href: "/admin/hotspot/bandwidth" },
  ]

  const pppoeSubMenu = [
    { icon: Database, label: "PPPoE / Static IP Pool", href: "/admin/pppoe/ip-pool" },
    { icon: Server, label: "PPPoE / Static Plans", href: "/admin/pppoe/plans" },
    { icon: Users, label: "PPPoE / Static Clients", href: "/admin/pppoe/clients" },
  ]

  const stationsSubMenu = [
    { icon: Database, label: "List Stations", href: "/admin/stations/list" },
    { icon: PlusCircle, label: "Add Stations", href: "/admin/stations/add" },
    { icon: Network, label: "Station VPN", href: "/admin/stations/vpn" },
  ]

  const transactionsSubMenu = [{ icon: CreditCard, label: "Payments", href: "/admin/transactions" }]

  const reportsSubMenu = [
    { icon: BarChart3, label: "User Activity Reports", href: "/admin/report-analysis/user-activity" },
    { icon: BarChart3, label: "Top Users", href: "/admin/report-analysis/top-users" },
    { icon: BarChart3, label: "Sales Reports", href: "/admin/report-analysis/sales" },
    { icon: BarChart3, label: "Data Usage Reports", href: "/admin/report-analysis/data-usage" },
    { icon: BarChart3, label: "Session Logs", href: "/admin/report-analysis/session-logs" },
    { icon: BarChart3, label: "Performance Graphs", href: "/admin/report-analysis/performance" },
    { icon: BarChart3, label: "Failed Logins", href: "/admin/report-analysis/failed-logins" },
    { icon: BarChart3, label: "Voucher Stats", href: "/admin/report-analysis/voucher-stats" },
  ]

  const billingSubMenu = [
    { icon: Receipt, label: "Invoice History", href: "/admin/billing-invoices/invoice-history" },
    { icon: CreditCard, label: "Make Payment", href: "/admin/billing-invoices/make-payment" },
    { icon: FileText, label: "Balance Overview", href: "/admin/billing-invoices/balance" },
    { icon: FileText, label: "Billing Plan", href: "/admin/billing-invoices/billing-plan" },
    { icon: FileText, label: "Auto Billing", href: "/admin/billing-invoices/auto-billing" },
    { icon: FileText, label: "Print or Email", href: "/admin/billing-invoices/print-email" },
  ]

  const setupSubMenu = [
    { icon: Settings, label: "Router & NAS Settings", href: "/admin/setup/router-nas" },
    { icon: Tag, label: "Voucher Generator", href: "/admin/setup/voucher-generator" },
    { icon: FileText, label: "Branding Options", href: "/admin/setup/branding" },
    { icon: Gauge, label: "Tariff Plans", href: "/admin/setup/tariff-plans" },
    { icon: Globe, label: "Network Zones", href: "/admin/setup/network-zones" },
    { icon: Users, label: "Device Limits", href: "/admin/setup/device-limits" },
    { icon: Gauge, label: "Bandwidth Control", href: "/admin/setup/bandwidth-control" },
    { icon: Settings, label: "Auto-Logout Timer", href: "/admin/setup/auto-logout" },
  ]

  const supportSubMenu = [
    { icon: HelpCircle, label: "Help Center (FAQ)", href: "/admin/support/help-center" },
    { icon: MessageSquare, label: "Contact Support", href: "/admin/support/contact-support" },
    { icon: Gauge, label: "System Status", href: "/admin/support/system-status" },
  ]

  const umsSubMenu = [
    { icon: Wallet, label: "My Linked Account", href: "/admin/ums-pay/linked-account" },
    { icon: BarChart3, label: "Earnings Summary", href: "/admin/ums-pay/earnings" },
    { icon: CreditCard, label: "Payouts", href: "/admin/ums-pay/payouts" },
    { icon: Settings, label: "Add/Remove Account", href: "/admin/ums-pay/account-management" },
    { icon: Receipt, label: "Transaction History", href: "/admin/ums-pay/transaction-history" },
  ]

  const accessSubMenu = [
    { icon: Shield, label: "MAC Whitelist/Blacklist", href: "/admin/access-control/mac-filtering" },
    { icon: Users, label: "Device Limit per User", href: "/admin/access-control/device-limit" },
    { icon: Gauge, label: "Session Timeout", href: "/admin/access-control/session-timeout" },
    { icon: Users, label: "User Group Permissions", href: "/admin/access-control/user-groups" },
    { icon: Tag, label: "Auth Options", href: "/admin/access-control/auth-options" },
    { icon: Shield, label: "Concurrent Sessions", href: "/admin/access-control/concurrent-sessions" },
    { icon: Shield, label: "Firewall Rules", href: "/admin/access-control/firewall-rules" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-brand-green/30 z-40 shadow-lg"
        >
          {/* Logo */}
          <div className="p-4 border-b border-brand-green/30">
            <h1 className="text-xl font-bold text-brand-green neon-text">Aceveronn UMS</h1>
            <p className="text-xs text-white/70">Unified Management System</p>
          </div>

          {/* Menu Items */}
          <div className="py-4 overflow-y-auto h-[calc(100vh-64px-60px)]">
            <nav className="px-2 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.href)}
                  className="w-full flex items-center px-4 py-2.5 text-white/80 rounded-md hover:bg-brand-green/10 transition-colors group"
                >
                  <item.icon className="h-5 w-5 mr-3 text-brand-green group-hover:text-brand-neongreen" />
                  <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                </button>
              ))}

              {[
                { key: "hotspot", label: "Hotspot", icon: Wifi, items: hotspotSubMenu },
                { key: "pppoe", label: "PPPoE", icon: Network, items: pppoeSubMenu },
                { key: "stations", label: "Stations", icon: Server, items: stationsSubMenu },
                { key: "transactions", label: "Transactions", icon: CreditCard, items: transactionsSubMenu },
                { key: "reports", label: "Report & analysis", icon: BarChart3, items: reportsSubMenu },
                { key: "billing", label: "Billing & Invoices", icon: FileText, items: billingSubMenu },
                { key: "setup", label: "SetUp", icon: Settings, items: setupSubMenu },
                { key: "support", label: "Support", icon: HelpCircle, items: supportSubMenu },
                { key: "ums", label: "UMS Pay", icon: Wallet, items: umsSubMenu },
                { key: "access", label: "Access Control", icon: Shield, items: accessSubMenu },
              ].map((group) => (
                <div className="space-y-1" key={group.key}>
                  <button
                    onClick={() => toggleMenu(group.key)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-white/80 rounded-md hover:bg-brand-green/10 transition-colors group"
                  >
                    <div className="flex items-center">
                      <group.icon className="h-5 w-5 mr-3 text-brand-green group-hover:text-brand-neongreen" />
                      <span className="group-hover:translate-x-1 transition-transform">{group.label}</span>
                    </div>
                    {expandedMenus[group.key] ? (
                      <ChevronDown className="h-4 w-4 text-brand-green" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-brand-green" />
                    )}
                  </button>
                  {expandedMenus[group.key] && (
                    <div className="pl-10 space-y-1">
                      {group.items.map((subItem, subIndex) => (
                        <button
                          key={`${group.key}-${subIndex}`}
                          onClick={() => navigate(subItem.href)}
                          className="w-full flex items-center px-4 py-2 text-sm text-white/70 rounded-md hover:bg-brand-green/10 transition-colors group"
                        >
                          <subItem.icon className="h-4 w-4 mr-2 text-brand-green group-hover:text-brand-neongreen" />
                          <span className="group-hover:translate-x-1 transition-transform">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-green/30">
            <Button
              variant="ghost"
              className="w-full justify-start text-white/80 hover:text-white hover:bg-brand-green/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 text-brand-green" />
              Logout
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
