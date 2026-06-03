import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
  Button, Divider, Badge,
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
  { text: 'الصلاحيات', icon: <SecurityIcon />, path: '/settings' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
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
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {menuItems.find((m) => m.path === location.pathname)?.text || 'ERP & CRM'}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => { localStorage.clear(); navigate('/login') }}>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  )
}
