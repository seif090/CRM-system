import { useState, useEffect } from 'react'
import { Typography, Paper, TextField, Button, Box, Card, CardContent } from '@mui/material'
import DataTable from '../components/DataTable'
import { emailAPI } from '../services/api'
import { formatDateTime } from '../utils/helpers'

export default function EmailPage() {
  const [configs, setConfigs] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [form, setForm] = useState({ smtp_host: '', smtp_port: 587, smtp_user: '', smtp_password: '', sender_email: '', sender_name: '' })
  const [sendForm, setSendForm] = useState({ recipient: '', subject: '', body_html: '' })

  useEffect(() => {
    emailAPI.config.list().then((r) => setConfigs(r.data)).catch(() => {})
    emailAPI.templates.list().then((r) => setTemplates(r.data)).catch(() => {})
    emailAPI.logs().then((r) => setLogs(r.data)).catch(() => {})
  }, [])

  const handleSaveConfig = async () => {
    try { await emailAPI.config.create(form); emailAPI.config.list().then((r) => setConfigs(r.data)).catch(() => {}) }
    catch (err) { alert('Error') }
  }

  const handleSend = async () => {
    try { await emailAPI.send(sendForm); alert('Sent!') }
    catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>البريد الإلكتروني</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>إعدادات SMTP</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField label="SMTP Host" size="small" value={form.smtp_host} onChange={(e) => setForm({ ...form, smtp_host: e.target.value })} />
            <TextField label="Port" type="number" size="small" value={form.smtp_port} onChange={(e) => setForm({ ...form, smtp_port: Number(e.target.value) })} />
            <TextField label="User" size="small" value={form.smtp_user} onChange={(e) => setForm({ ...form, smtp_user: e.target.value })} />
            <TextField label="Password" type="password" size="small" value={form.smtp_password} onChange={(e) => setForm({ ...form, smtp_password: e.target.value })} />
            <TextField label="Sender Email" size="small" value={form.sender_email} onChange={(e) => setForm({ ...form, sender_email: e.target.value })} />
            <Button variant="contained" onClick={handleSaveConfig}>حفظ</Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>إرسال بريد</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField label="المستلم" size="small" value={sendForm.recipient} onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })} />
            <TextField label="الموضوع" size="small" value={sendForm.subject} onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })} />
            <TextField label="المحتوى" size="small" multiline rows={3} value={sendForm.body_html} onChange={(e) => setSendForm({ ...sendForm, body_html: e.target.value })} />
            <Button variant="contained" onClick={handleSend}>إرسال</Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>سجل البريد</Typography>
      <DataTable columns={[
        { id: 'recipient', label: 'المستلم' },
        { id: 'subject', label: 'الموضوع' },
        { id: 'status', label: 'الحالة' },
        { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
      ]} rows={logs} />
    </>
  )
}
