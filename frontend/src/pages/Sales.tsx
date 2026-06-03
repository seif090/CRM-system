import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { salesAPI, customersAPI, productsAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'invoice_number', label: 'رقم الفاتورة' },
  { id: 'customer_name', label: 'العميل' },
  { id: 'grand_total', label: 'الإجمالي', render: (v: number) => formatCurrency(v) },
  { id: 'paid_amount', label: 'المدفوع', render: (v: number) => formatCurrency(v) },
  { id: 'due_amount', label: 'المتبقي', render: (v: number) => formatCurrency(v) },
  { id: 'payment_status', label: 'حالة الدفع', render: (v: string) => (
    <Chip label={v} color={v === 'paid' ? 'success' : v === 'partial' ? 'warning' : 'error'} size="small" />
  )},
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function Sales() {
  const [sales, setSales] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<any>({
    customer_id: '', customer_name: '', customer_phone: '', discount: 0, tax: 0, paid_amount: 0, payment_method: 'cash', notes: '', items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }],
  })

  useEffect(() => {
    loadSales()
    customersAPI.list().then((res) => setCustomers(res.data)).catch(() => {})
    productsAPI.list().then((res) => setProducts(res.data)).catch(() => {})
  }, [])

  const loadSales = () => salesAPI.list().then((res) => setSales(res.data)).catch(() => {})

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items]
    items[index][field] = value
    if (field === 'product_id') {
      const product = products.find((p) => p.id === Number(value))
      if (product) {
        items[index].product_name = product.name
        items[index].unit_price = product.unit_price
      }
    }
    setForm({ ...form, items })
  }

  const removeItem = (index: number) => {
    setForm({ ...form, items: form.items.filter((_: any, i: number) => i !== index) })
  }

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        customer_id: form.customer_id ? Number(form.customer_id) : null,
        items: form.items.map((i: any) => ({ ...i, product_id: i.product_id ? Number(i.product_id) : null })),
      }
      await salesAPI.create(payload)
      setOpen(false)
      setForm({ customer_id: '', customer_name: '', customer_phone: '', discount: 0, tax: 0, paid_amount: 0, payment_method: 'cash', notes: '', items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })
      loadSales()
    } catch (err) {
      alert('Error creating sale')
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المبيعات</Typography>
      <DataTable columns={columns} rows={sales} onAdd={() => setOpen(true)} searchable />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>فاتورة جديدة</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>العميل</InputLabel>
            <Select value={form.customer_id} label="العميل" onChange={(e) => {
              const customer = customers.find((c) => c.id === Number(e.target.value))
              setForm({ ...form, customer_id: e.target.value, customer_name: customer?.name || '', customer_phone: customer?.phone || '' })
            }}>
              {customers.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name} - {c.phone}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="اسم العميل (يدوي)" sx={{ mt: 2 }} value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
          <TextField fullWidth label="رقم الهاتف" sx={{ mt: 2 }} value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>المنتجات</Typography>
          {form.items.map((item: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>منتج</InputLabel>
                <Select value={item.product_id} label="منتج" onChange={(e) => updateItem(index, 'product_id', e.target.value)}>
                  {products.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>)}
                </Select>
              </FormControl>
              <TextField size="small" label="الكمية" type="number" sx={{ width: 80 }} value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
              <TextField size="small" label="السعر" type="number" sx={{ width: 100 }} value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))} />
              <Button size="small" color="error" onClick={() => removeItem(index)}>×</Button>
            </Box>
          ))}
          <Button size="small" onClick={addItem}>+ إضافة منتج</Button>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="الخصم" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
            <TextField label="الضريبة %" type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })} />
            <TextField label="المدفوع" type="number" value={form.paid_amount} onChange={(e) => setForm({ ...form, paid_amount: Number(e.target.value) })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ الفاتورة</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
