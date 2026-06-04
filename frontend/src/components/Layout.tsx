import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
  Button, Divider, Badge, BottomNavigation, BottomNavigationAction, Paper,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BadgeIcon from '@mui/icons-material/Badge'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LogoutIcon from '@mui/icons-material/Logout'
import AssessmentIcon from '@mui/icons-material/Assessment'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import TaskIcon from '@mui/icons-material/Task'
import ReplyIcon from '@mui/icons-material/Reply'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HistoryIcon from '@mui/icons-material/History'
import SecurityIcon from '@mui/icons-material/Security'
import PointOfSaleIcon2 from '@mui/icons-material/PointOfSale'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import EmailIcon from '@mui/icons-material/Email'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaymentIcon from '@mui/icons-material/Payment'
import BusinessIcon from '@mui/icons-material/Business'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PrintIcon from '@mui/icons-material/Print'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SettingsIcon from '@mui/icons-material/Settings'
import { notificationsAPI } from '../services/api'

const drawerWidth = 280

const menuItems = [
  { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/' },
  { text: 'نقطة البيع (POS)', icon: <PointOfSaleIcon2 />, path: '/pos' },
  { text: 'العملاء', icon: <PeopleIcon />, path: '/customers' },
  { text: 'المنتجات', icon: <InventoryIcon />, path: '/products' },
  { text: 'المبيعات', icon: <PointOfSaleIcon />, path: '/sales' },
  { text: 'المشتريات', icon: <ShoppingCartIcon />, path: '/purchases' },
  { text: 'المرتجعات', icon: <ReplyIcon />, path: '/returns' },
  { text: 'حركات المخزون', icon: <WarehouseIcon />, path: '/inventory' },
  { text: 'المصروفات', icon: <MoneyOffIcon />, path: '/expenses' },
  { text: 'الموظفين', icon: <BadgeIcon />, path: '/employees' },
  { text: 'المهام والمشاريع', icon: <TaskIcon />, path: '/tasks' },
  { text: 'التقارير', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'واتساب', icon: <WhatsAppIcon />, path: '/whatsapp' },
  { text: 'الذكاء الاصطناعي', icon: <SmartToyIcon />, path: '/ai' },
  { text: 'الإشعارات', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'سجل النشاطات', icon: <HistoryIcon />, path: '/audit' },
  { text: 'الشحن والتوصيل', icon: <LocalShippingIcon />, path: '/shipping' },
  { text: 'البريد الإلكتروني', icon: <EmailIcon />, path: '/email' },
  { text: 'الإجازات', icon: <BeachAccessIcon />, path: '/leaves' },
  { text: 'الرواتب', icon: <AttachMoneyIcon />, path: '/payroll' },
  { text: 'المدفوعات الإلكترونية', icon: <PaymentIcon />, path: '/payments' },
  { text: 'الأصول', icon: <BusinessIcon />, path: '/assets' },
  { text: 'الميزانيات', icon: <AccountBalanceWalletIcon />, path: '/budgets' },
  { text: 'الفروع', icon: <StorefrontIcon />, path: '/branches' },
  { text: 'ولاء العملاء', icon: <CardGiftcardIcon />, path: '/loyalty' },
  { text: 'استيراد/تصدير', icon: <FileDownloadIcon />, path: '/import-export' },
  { text: 'طباعة', icon: <PrintIcon />, path: '/print' },
  { text: 'بوابة العميل', icon: <PersonIcon />, path: '/portal' },
  { text: 'الصلاحيات', icon: <SecurityIcon />, path: '/settings' },
]

const bottomNavItems = [
  { label: 'الرئيسية', icon: <HomeIcon />, path: '/' },
  { label: 'المبيعات', icon: <PointOfSaleIcon />, path: '/sales' },
  { label: 'العملاء', icon: <PeopleIcon />, path: '/customers' },
  { label: 'المخزون', icon: <InventoryIcon />, path: '/products' },
  { label: 'المزيد', icon: <MenuBookIcon />, path: '' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    notificationsAPI.unreadCount().then((res) => setUnreadCount(res.data.count)).catch(() => {})
  }, [location])

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          ERP & CRM
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); setDrawerOpen(false) }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : undefined }}>
                {item.text === 'الإشعارات' && unreadCount > 0 ? (
                  <Badge badgeContent={unreadCount} color="error">{item.icon}</Badge>
                ) : item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', pb: { xs: 7, md: 0 } }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: { xs: 16, md: 20 } }}>
            {menuItems.find((m) => m.path === location.pathname)?.text || 'ERP & CRM'}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => { localStorage.clear(); navigate('/login') }} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            تسجيل خروج
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8, mb: { xs: 7, md: 0 }, minHeight: '100vh' }}>
        {children}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100, display: { md: 'none' } }} elevation={3}>
        <BottomNavigation
          showLabels
          value={bottomNavItems.findIndex((i) => i.path === location.pathname)}
          onChange={(_, idx) => {
            const item = bottomNavItems[idx]
            if (item.path) {
              navigate(item.path)
            } else {
              setDrawerOpen(!drawerOpen)
            }
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.label === 'الإشعارات' && unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} color="error">{item.icon}</Badge>
              ) : item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
        PaperProps={{ sx: { maxHeight: '70vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
      >
        <Box sx={{ p: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => { navigate(item.path); setDrawerOpen(false) }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : undefined }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
