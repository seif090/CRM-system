import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Customers from './pages/Customers'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Purchases from './pages/Purchases'
import Returns from './pages/Returns'
import Inventory from './pages/Inventory'
import Expenses from './pages/Expenses'
import Employees from './pages/Employees'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import WhatsAppPage from './pages/WhatsAppPage'
import AIConfigPage from './pages/AIConfigPage'
import NotificationsPage from './pages/NotificationsPage'
import AuditPage from './pages/AuditPage'
import SettingsPage from './pages/SettingsPage'
import ShippingPage from './pages/ShippingPage'
import EmailPage from './pages/EmailPage'
import LeavesPage from './pages/LeavesPage'
import PayrollPage from './pages/PayrollPage'
import PaymentsPage from './pages/PaymentsPage'
import AssetsPage from './pages/AssetsPage'
import BudgetsPage from './pages/BudgetsPage'
import BranchesPage from './pages/BranchesPage'
import LoyaltyPage from './pages/LoyaltyPage'
import ImportExportPage from './pages/ImportExportPage'
import PrintPage from './pages/PrintPage'
import PortalPage from './pages/PortalPage'
import Layout from './components/Layout'
import { useAuth } from './utils/auth'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pos" element={<PrivateRoute><POS /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
      <Route path="/purchases" element={<PrivateRoute><Purchases /></PrivateRoute>} />
      <Route path="/returns" element={<PrivateRoute><Returns /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/whatsapp" element={<PrivateRoute><WhatsAppPage /></PrivateRoute>} />
      <Route path="/ai" element={<PrivateRoute><AIConfigPage /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
      <Route path="/audit" element={<PrivateRoute><AuditPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
      <Route path="/email" element={<PrivateRoute><EmailPage /></PrivateRoute>} />
      <Route path="/leaves" element={<PrivateRoute><LeavesPage /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute><PayrollPage /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
      <Route path="/assets" element={<PrivateRoute><AssetsPage /></PrivateRoute>} />
      <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />
      <Route path="/branches" element={<PrivateRoute><BranchesPage /></PrivateRoute>} />
      <Route path="/loyalty" element={<PrivateRoute><LoyaltyPage /></PrivateRoute>} />
      <Route path="/import-export" element={<PrivateRoute><ImportExportPage /></PrivateRoute>} />
      <Route path="/print" element={<PrivateRoute><PrintPage /></PrivateRoute>} />
      <Route path="/portal" element={<PrivateRoute><PortalPage /></PrivateRoute>} />
    </Routes>
  )
}
