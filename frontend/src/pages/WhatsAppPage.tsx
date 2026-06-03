import { useState, useEffect } from 'react'
import {
  Typography, Box, TextField, Button, Card, CardContent, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import { whatsappAPI, customersAPI } from '../services/api'
import DataTable from '../components/DataTable'
import { formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'customer_phone', label: 'رقم الهاتف' },
  { id: 'direction', label: 'الاتجاه', render: (v: string) => v === 'outgoing' ? 'صادر' : 'وارد' },
  { id: 'content', label: 'الرسالة', render: (v: string) => v?.substring(0, 100) || '' },
  { id: 'status', label: 'الحالة' },
  { id: 'ai_responded', label: 'رد AI', render: (v: number) => v ? 'نعم' : 'لا' },
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedPhone, setSelectedPhone] = useState('')
  const [messageText, setMessageText] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  useEffect(() => {
    whatsappAPI.messages.list().then((res) => setMessages(res.data)).catch(() => {})
    customersAPI.list().then((res) => setCustomers(res.data)).catch(() => {})
  }, [])

  const handleSend = async () => {
    if (!selectedPhone || !messageText) return
    try {
      await whatsappAPI.messages.send({ customer_phone: selectedPhone, message: messageText })
      setMessageText('')
      whatsappAPI.messages.list().then((res) => setMessages(res.data)).catch(() => {})
    } catch (err) { alert('Error sending message') }
  }

  const handleAIReply = async () => {
    if (!selectedPhone || !messageText) return
    try {
      const res = await aiReplyAPI(selectedPhone, messageText)
      setAiResponse(res.data.reply)
    } catch (err) { alert('Error generating AI reply') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>واتساب</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>إرسال رسالة</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>رقم العميل</InputLabel>
              <Select value={selectedPhone} label="رقم العميل" onChange={(e) => setSelectedPhone(e.target.value)}>
                {customers.map((c: any) => <MenuItem key={c.id} value={c.phone}>{c.name} - {c.phone}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="الرسالة" value={messageText} onChange={(e) => setMessageText(e.target.value)} sx={{ minWidth: 300 }} multiline rows={2} />
            <Button variant="contained" onClick={handleSend}>إرسال</Button>
            <Button variant="outlined" onClick={handleAIReply}>رد AI</Button>
          </Box>
          {aiResponse && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f4ff', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">رد الذكاء الاصطناعي:</Typography>
              <Typography>{aiResponse}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <DataTable columns={columns} rows={messages} />
    </>
  )
}

async function aiReplyAPI(phone: string, message: string) {
  const { aiAPI } = await import('../services/api')
  return aiAPI.reply({ customer_phone: phone, message })
}
