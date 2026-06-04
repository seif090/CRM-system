import { useState, useEffect, useRef } from 'react'
import {
  Typography, Box, Paper, TextField, IconButton, List, ListItem, ListItemText, Avatar, Badge,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { chatAPI } from '../services/api'

export default function ChatPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [activeRoom, setActiveRoom] = useState<number | null>(null)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { chatAPI.rooms.list().then((r) => setRooms(r.data)) }, [])

  useEffect(() => {
    if (activeRoom) {
      chatAPI.messages.list(activeRoom).then((r) => setMessages(r.data))
    }
  }, [activeRoom])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!text.trim() || !activeRoom) return
    const msg = await chatAPI.messages.send({ room_id: activeRoom, message: text })
    setMessages((prev) => [...prev, msg.data])
    setText('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 160px)' }}>
      <Paper sx={{ width: 260, overflow: 'auto', flexShrink: 0 }}>
        <Typography sx={{ p: 2, fontWeight: 700 }}>المحادثات</Typography>
        <List>
          {rooms.map((r) => (
            <ListItem key={r.id} button selected={activeRoom === r.id} onClick={() => setActiveRoom(r.id)}>
              <Avatar sx={{ width: 32, height: 32, ml: 1 }}>{r.name?.[0] || 'G'}</Avatar>
              <ListItemText primary={r.name || 'مجموعة'} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeRoom ? (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((m) => (
                <Box key={m.id} sx={{ display: 'flex', justifyContent: m.sender_id === 1 ? 'flex-start' : 'flex-end', mb: 1 }}>
                  <Box sx={{
                    bgcolor: m.sender_id === 1 ? 'primary.main' : 'grey.800',
                    color: '#fff', borderRadius: 2, px: 2, py: 1, maxWidth: '70%',
                  }}>
                    <Typography variant="body2">{m.message}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {new Date(m.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={bottomRef} />
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" placeholder="اكتب رسالة..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
              <IconButton color="primary" onClick={send}><SendIcon /></IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'text.secondary' }}>
            اختر محادثة للبدء
          </Box>
        )}
      </Paper>
    </Box>
  )
}
