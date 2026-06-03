import { useState, useEffect } from 'react'
import { Typography, Card, CardContent, TextField, Button, Box, Chip, Paper } from '@mui/material'
import DataTable from '../components/DataTable'
import { paymentsAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

export default function PaymentsPage() {
  const [gateways, setGateways] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', provider: '', api_key: '', api_secret: '' })

  useEffect(() => {
    paymentsAPI.gateways.list().then((r) => setGateways(r.data)).catch(() => {})
    paymentsAPI.transactions.list().then((r) => setTransactions(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try { await paymentsAPI.gateways.create(form); paymentsAPI.gateways.list().then((r) => setGateways(r.data)).catch(() => {}) }
    catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المدفوعات الإلكترونية</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>بوابات الدفع</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {gateways.map((g: any) => <Chip key={g.id} label={`${g.name} (${g.provider})`} color={g.is_active ? 'success' : 'default'} />)}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField label="الاسم" size="small" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="المزود" size="small" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
            <TextField label="API Key" size="small" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} />
            <Button variant="contained" onClick={handleSave}>إضافة</Button>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="h6" sx={{ mb: 2 }}>المعاملات</Typography>
      <DataTable columns={[
        { id: 'amount', label: 'المبلغ', render: (v: number) => formatCurrency(v) },
        { id: 'currency', label: 'العملة' },
        { id: 'status', label: 'الحالة', render: (v: string) => <Chip label={v} size="small" /> },
        { id: 'transaction_id', label: 'رقم المعاملة' },
        { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
      ]} rows={transactions} />
    </>
  )
}
