import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { purchasesAPI, productsAPI, suppliersAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'reference_number', label: 'رقم الأمر' },
  { id: 'supplier_name', label: 'المورد' },
  { id: 'total_amount', label: 'الإجمالي', render: (v: number) => formatCurrency(v) },
  { id: 'paid_amount', label: 'المدفوع', render: (v: number) => formatCurrency(v) },
  { id: 'payment_status', label: 'حالة الدفع', render: (v: string) => (
    <Chip label={v} color={v === 'paid' ? 'success' : v === 'partial' ? 'warning' : 'error'} size="small" />
  )},
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<any>({
    supplier_id: '', supplier_name: '', paid_amount: 0, notes: '',
    items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }],
  })

  useEffect(() => {
    loadPurchases()
    purchasesAPI.suppliers.list().then((res) => setSuppliers(res.data)).catch(() => {})
    productsAPI.list().then((res) => setProducts(res.data)).catch(() => {})
  }, [])

  const loadPurchases = () => purchasesAPI.list().then((res) => setPurchases(res.data)).catch(() => {})

  const addItem = () => setForm({ ...form, items: [...form.items, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.items]
    items[index][field] = value
    if (field === 'product_id') {
      const product = products.find((p) => p.id === Number(value))
      if (product) { items[index].product_name = product.name; items[index].unit_price = product.cost_price || 0 }
    }
    setForm({ ...form, items })
  }

  const removeItem = (index: number) => setForm({ ...form, items: form.items.filter((_: any, i: number) => i !== index) })

  const handleSave = async () => {
    try {
      const payload = { ...form, supplier_id: form.supplier_id ? Number(form.supplier_id) : null, items: form.items.map((i: any) => ({ ...i, product_id: i.product_id ? Number(i.product_id) : null })) }
      await purchasesAPI.create(payload)
      setOpen(false)
      setForm({ supplier_id: '', supplier_name: '', paid_amount: 0, notes: '', items: [{ product_id: '', product_name: '', quantity: 1, unit_price: 0 }] })
      loadPurchases()
    } catch (err) { alert('Error creating purchase') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المشتريات</Typography>
      <DataTable columns={columns} rows={purchases} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>أمر شراء جديد</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>المورد</InputLabel>
            <Select value={form.supplier_id} label="المورد" onChange={(e) => {
              const supplier = suppliers.find((s) => s.id === Number(e.target.value))
              setForm({ ...form, supplier_id: e.target.value, supplier_name: supplier?.name || '' })
            }}>
              {suppliers.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>المنتجات</Typography>
          {form.items.map((item: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>منتج</InputLabel>
                <Select value={item.product_id} label="منتج" onChange={(e) => updateItem(index, 'product_id', e.target.value)}>
                  {products.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField size="small" label="الكمية" type="number" sx={{ width: 80 }} value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
              <TextField size="small" label="السعر" type="number" sx={{ width: 100 }} value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))} />
              <Button size="small" color="error" onClick={() => removeItem(index)}>×</Button>
            </Box>
          ))}
          <Button size="small" onClick={addItem}>+ إضافة منتج</Button>
          <TextField fullWidth label="المدفوع" type="number" sx={{ mt: 2 }} value={form.paid_amount} onChange={(e) => setForm({ ...form, paid_amount: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
