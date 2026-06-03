import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Box } from '@mui/material'
import DataTable from '../components/DataTable'
import { shippingAPI, salesAPI } from '../services/api'
import { formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'customer_name', label: 'العميل' },
  { id: 'customer_phone', label: 'الهاتف' },
  { id: 'customer_address', label: 'العنوان' },
  { id: 'status', label: 'الحالة', render: (v: string) => <Chip label={v} size="small" color={v === 'delivered' ? 'success' : v === 'in_transit' ? 'info' : 'warning'} /> },
  { id: 'estimated_date', label: 'التاريخ المتوقع', render: (v: string) => v ? formatDateTime(v) : '-' },
  { id: 'created_at', label: 'تاريخ الطلب', render: (v: string) => formatDateTime(v) },
]

export default function ShippingPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ sale_id: '', customer_name: '', customer_phone: '', customer_address: '', delivery_person_id: '', estimated_date: '', notes: '' })

  useEffect(() => {
    shippingAPI.list().then((r) => setDeliveries(r.data)).catch(() => {})
    shippingAPI.persons.list().then((r) => setPersons(r.data)).catch(() => {})
    salesAPI.list({ limit: 50 }).then((r) => setSales(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      const sale = sales.find((s) => s.id === Number(form.sale_id))
      await shippingAPI.create({
        ...form,
        sale_id: form.sale_id ? Number(form.sale_id) : null,
        delivery_person_id: form.delivery_person_id ? Number(form.delivery_person_id) : null,
        customer_name: sale?.customer_name || form.customer_name,
        customer_phone: sale?.customer_phone || form.customer_phone,
      })
      setOpen(false)
      setForm({ sale_id: '', customer_name: '', customer_phone: '', customer_address: '', delivery_person_id: '', estimated_date: '', notes: '' })
      shippingAPI.list().then((r) => setDeliveries(r.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الشحن والتوصيل</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {persons.map((p: any) => <Chip key={p.id} label={`${p.name} - ${p.phone}`} />)}
      </Box>
      <DataTable columns={columns} rows={deliveries} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة شحنة</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>الفاتورة</InputLabel>
            <Select value={form.sale_id} label="الفاتورة" onChange={(e) => {
              const sale = sales.find((s) => s.id === Number(e.target.value))
              setForm({ ...form, sale_id: e.target.value, customer_name: sale?.customer_name || '', customer_phone: sale?.customer_phone || '' })
            }}>
              {sales.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.invoice_number}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="العميل" sx={{ mt: 2 }} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
          <TextField fullWidth label="رقم الهاتف" sx={{ mt: 2 }} value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
          <TextField fullWidth label="العنوان" sx={{ mt: 2 }} value={form.customer_address} onChange={(e) => setForm({ ...form, customer_address: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
