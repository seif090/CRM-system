import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, Box,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { returnsAPI, salesAPI, productsAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'return_number', label: 'رقم المرتجع' },
  { id: 'customer_name', label: 'العميل' },
  { id: 'total_amount', label: 'الإجمالي', render: (v: number) => formatCurrency(v) },
  { id: 'reason', label: 'السبب' },
  { id: 'status', label: 'الحالة' },
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function Returns() {
  const [returns, setReturns] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<any>({
    sale_id: '', customer_name: '', reason: '',
    items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }],
  })

  useEffect(() => {
    returnsAPI.list().then((res) => setReturns(res.data)).catch(() => {})
    salesAPI.list().then((res) => setSales(res.data)).catch(() => {})
    productsAPI.list().then((res) => setProducts(res.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await returnsAPI.create(form)
      setOpen(false)
      setForm({ sale_id: '', customer_name: '', reason: '', items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })
      returnsAPI.list().then((res) => setReturns(res.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items]
    items[index][field] = value
    if (field === 'product_id') {
      const p = products.find((p) => p.id === Number(value))
      if (p) { items[index].product_name = p.name; items[index].unit_price = p.unit_price }
    }
    setForm({ ...form, items })
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المرتجعات</Typography>
      <DataTable columns={columns} rows={returns} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>مرتجع جديد</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>الفاتورة</InputLabel>
            <Select value={form.sale_id} label="الفاتورة" onChange={(e) => setForm({ ...form, sale_id: e.target.value })}>
              {sales.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.invoice_number} - {s.customer_name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="السبب" sx={{ mt: 2 }} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>المنتجات</Typography>
          {form.items.map((item: any, i: number) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>منتج</InputLabel>
                <Select value={item.product_id} label="منتج" onChange={(e) => updateItem(i, 'product_id', e.target.value)}>
                  {products.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField size="small" label="الكمية" type="number" sx={{ width: 80 }} value={item.quantity}
                onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} />
              <TextField size="small" label="السعر" type="number" sx={{ width: 100 }} value={item.unit_price}
                onChange={(e) => updateItem(i, 'unit_price', Number(e.target.value))} />
            </Box>
          ))}
          <Button size="small" onClick={addItem}>+ إضافة</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
