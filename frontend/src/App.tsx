import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './app/login/login'
import ProfilePage from './app/profile/page'
import AdminLayout from './app/admin/layout'
import AdminDashboard from './app/admin/page'

// Admin pages
import AccessControl from './app/admin/access-control/auth-options'
import ConcurrentSessions from './app/admin/access-control/concurrent-sessions'
import DeviceLimit from './app/admin/access-control/device-limit'
import FirewallRules from './app/admin/access-control/firewall-rules'
import MacFiltering from './app/admin/access-control/mac-filtering'
import SessionTimeout from './app/admin/access-control/session-timeout'
import UserGroups from './app/admin/access-control/user-groups'

// Billing pages
import AutoBilling from './app/admin/billing-invoices/auto-billing'
import Balance from './app/admin/billing-invoices/balance'
import BillingPlan from './app/admin/billing-invoices/billing-plan'
import InvoiceHistory from './app/admin/billing-invoices/invoice-history'
import MakePayment from './app/admin/billing-invoices/make-payment'
import PrintEmail from './app/admin/billing-invoices/print-email'

// Other admin pages
import Clients from './app/admin/clients/clients'
import Notifications from './app/admin/notifications/notifications'
import HotspotPlans from './app/admin/hotspot/plans'
import HotspotGenerateCode from './app/admin/hotspot/generate-code'
import HotspotClients from './app/admin/hotspot/clients'
import HotspotBandwidth from './app/admin/hotspot/bandwidth'
import HotspotAccounts from './app/admin/hotspot/accounts'
import PppoeIpPool from './app/admin/pppoe/ip-pool'
import PppoePlans from './app/admin/pppoe/plans'
import PppoeClients from './app/admin/pppoe/clients'
import StationsList from './app/admin/stations/list'
import StationsAdd from './app/admin/stations/add'
import StationsVpn from './app/admin/stations/vpn'
import TransactionsPage from './app/admin/transactions/transactions'
import ReportUserActivity from './app/admin/report-analysis/user-activity'
import ReportTopUsers from './app/admin/report-analysis/top-users'
import ReportSales from './app/admin/report-analysis/sales'
import ReportDataUsage from './app/admin/report-analysis/data-usage'
import ReportSessionLogs from './app/admin/report-analysis/session-logs'
import ReportPerformance from './app/admin/report-analysis/performance'
import ReportFailedLogins from './app/admin/report-analysis/failed-logins'
import ReportVoucherStats from './app/admin/report-analysis/voucher-stats'
import SetupRouterNas from './app/admin/setup/router-nas'
import SetupVoucherGenerator from './app/admin/setup/voucher-generator'
import SetupBranding from './app/admin/setup/branding'
import SetupTariffPlans from './app/admin/setup/tariff-plans'
import SetupNetworkZones from './app/admin/setup/network-zones'
import SetupDeviceLimits from './app/admin/setup/device-limits'
import SetupBandwidthControl from './app/admin/setup/bandwidth-control'
import SetupAutoLogout from './app/admin/setup/auto-logout'
import SupportHelpCenter from './app/admin/support/help-center'
import SupportContactSupport from './app/admin/support/contact-support'
import SupportSystemStatus from './app/admin/support/system-status'
import UmsLinkedAccount from './app/admin/ums-pay/linked-account'
import UmsEarnings from './app/admin/ums-pay/earnings'
import UmsPayouts from './app/admin/ums-pay/payouts'
import UmsAccountManagement from './app/admin/ums-pay/account-management'
import UmsTransactionHistory from './app/admin/ums-pay/transaction-history'

// Super admin pages
import SuperAdminLayout from './app/super/layout'
import SuperAdminDashboard from './app/super/page'
import SuperNotifications from './app/super/notifications'
import SuperAdminList from './app/super/admin-list'
import SuperLogs from './app/super/logs'
import { ClientHotspot } from './app/portal/client'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        
        {/* Access Control */}
        <Route path="access-control/auth" element={<AccessControl />} />
        {/* legacy / alternate paths used in some links */}
        <Route path="access-control/auth-options" element={<AccessControl />} />
        <Route path="access-control/concurrent-sessions" element={<ConcurrentSessions />} />
        <Route path="access-control/device-limit" element={<DeviceLimit />} />
        <Route path="access-control/firewall" element={<FirewallRules />} />
        <Route path="access-control/firewall-rules" element={<FirewallRules />} />
        <Route path="access-control/mac-filtering" element={<MacFiltering />} />
        <Route path="access-control/session-timeout" element={<SessionTimeout />} />
        <Route path="access-control/user-groups" element={<UserGroups />} />

        {/* Billing */}
        <Route path="billing-invoices/auto-billing" element={<AutoBilling />} />
        <Route path="billing-invoices/balance" element={<Balance />} />
        <Route path="billing-invoices/billing-plan" element={<BillingPlan />} />
        <Route path="billing-invoices/invoice-history" element={<InvoiceHistory />} />
        <Route path="billing-invoices/make-payment" element={<MakePayment />} />
        <Route path="billing-invoices/print-email" element={<PrintEmail />} />

        {/* Other */}
        <Route path="clients" element={<Clients />} />
        <Route path="notifications" element={<Notifications />} />
        {/* Hotspot */}
        <Route path="hotspot/plans" element={<HotspotPlans />} />
        <Route path="hotspot/accounts" element={<HotspotAccounts />} />
        <Route path="hotspot/clients" element={<HotspotClients />} />
        <Route path="hotspot/generate-code" element={<HotspotGenerateCode />} />
        <Route path="hotspot/bandwidth" element={<HotspotBandwidth />} />

        {/* PPPoE */}
        <Route path="pppoe/ip-pool" element={<PppoeIpPool />} />
        <Route path="pppoe/plans" element={<PppoePlans />} />
        <Route path="pppoe/clients" element={<PppoeClients />} />

        {/* Stations */}
        <Route path="stations/list" element={<StationsList />} />
        <Route path="stations/add" element={<StationsAdd />} />
        <Route path="stations/vpn" element={<StationsVpn />} />

        {/* Transactions */}
        <Route path="transactions" element={<TransactionsPage />} />

        {/* Report Analysis */}
        <Route path="report-analysis/user-activity" element={<ReportUserActivity />} />
        <Route path="report-analysis/top-users" element={<ReportTopUsers />} />
        <Route path="report-analysis/sales" element={<ReportSales />} />
        <Route path="report-analysis/data-usage" element={<ReportDataUsage />} />
        <Route path="report-analysis/session-logs" element={<ReportSessionLogs />} />
        <Route path="report-analysis/performance" element={<ReportPerformance />} />
        <Route path="report-analysis/failed-logins" element={<ReportFailedLogins />} />
        <Route path="report-analysis/voucher-stats" element={<ReportVoucherStats />} />

        {/* Setup */}
        <Route path="setup/router-nas" element={<SetupRouterNas />} />
        <Route path="setup/voucher-generator" element={<SetupVoucherGenerator />} />
        <Route path="setup/branding" element={<SetupBranding />} />
        <Route path="setup/tariff-plans" element={<SetupTariffPlans />} />
        <Route path="setup/network-zones" element={<SetupNetworkZones />} />
        <Route path="setup/device-limits" element={<SetupDeviceLimits />} />
        <Route path="setup/bandwidth-control" element={<SetupBandwidthControl />} />
        <Route path="setup/auto-logout" element={<SetupAutoLogout />} />

        {/* Support */}
        <Route path="support/help-center" element={<SupportHelpCenter />} />
        <Route path="support/contact-support" element={<SupportContactSupport />} />
        <Route path="support/system-status" element={<SupportSystemStatus />} />

        {/* UMS Pay */}
        <Route path="ums-pay/linked-account" element={<UmsLinkedAccount />} />
        <Route path="ums-pay/earnings" element={<UmsEarnings />} />
        <Route path="ums-pay/payouts" element={<UmsPayouts />} />
        <Route path="ums-pay/account-management" element={<UmsAccountManagement />} />
        <Route path="ums-pay/transaction-history" element={<UmsTransactionHistory />} />
      </Route>

      {/* Super Admin Routes */}
      <Route path="/super" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="notifications" element={<SuperNotifications />} />
        <Route path="admin-list" element={<SuperAdminList />} />
        <Route path="logs" element={<SuperLogs />} />
      </Route>
      {/* Client Portal */}
      <Route path="/portal/client" element={<ClientHotspot />} />
    </Routes>
  )
}

export default App
