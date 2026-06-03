import { useState, useEffect } from 'react'
import {
  Typography, List, ListItem, ListItemText, ListItemIcon, Paper, Button, Chip, Box, IconButton,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { notificationsAPI } from '../services/api'
import { formatDateTime } from '../utils/helpers'

const typeIcons: any = {
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  error: <ErrorIcon color="error" />,
  success: <CheckCircleIcon color="success" />,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    notificationsAPI.list().then((res) => setNotifications(res.data)).catch(() => {})
  }, [])

  const markRead = async (id: number) => {
    await notificationsAPI.markRead(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: 1 } : n))
  }

  const markAllRead = async () => {
    await notificationsAPI.markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })))
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>الإشعارات</Typography>
        <Button startIcon={<DoneAllIcon />} onClick={markAllRead}>تحديد الكل كمقروء</Button>
      </Box>
      <Paper>
        <List>
          {notifications.map((n) => (
            <ListItem key={n.id} sx={{
              bgcolor: n.is_read ? 'transparent' : 'action.hover',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}>
              <ListItemIcon>{typeIcons[n.notification_type] || <InfoIcon />}</ListItemIcon>
              <ListItemText
                primary={n.title}
                secondary={`${n.message} - ${formatDateTime(n.created_at)}`}
              />
              {!n.is_read && (
                <IconButton size="small" onClick={() => markRead(n.id)}>
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              )}
              <Chip label={n.notification_type} size="small" sx={{ ml: 1 }} />
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <ListItem><ListItemText primary="لا توجد إشعارات" /></ListItem>
          )}
        </List>
      </Paper>
    </>
  )
}
