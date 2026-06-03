import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { productsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const columns = [
  { id: 'name', label: 'الاسم' },
  { id: 'sku', label: 'كود المنتج' },
  { id: 'unit_price', label: 'سعر البيع', render: (v: number) => formatCurrency(v) },
  { id: 'cost_price', label: 'سعر التكلفة', render: (v: number) => v ? formatCurrency(v) : '-' },
  { id: 'quantity_in_stock', label: 'المخزون', render: (v: number, row: any) => (
    <Chip label={v} color={v <= row.min_stock_level ? 'error' : 'success'} size="small" />
  )},
  { id: 'unit', label: 'الوحدة' },
]

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState<any>({ name: '', sku: '', unit_price: 0, cost_price: 0, quantity_in_stock: 0, min_stock_level: 0, unit: 'piece', category_id: '', description: '' })

  useEffect(() => {
    loadProducts()
    productsAPI.categories.list().then((res) => setCategories(res.data)).catch(() => {})
  }, [])

  const loadProducts = () => {
    productsAPI.list().then((res) => setProducts(res.data)).catch(() => {})
  }

  const handleSave = async () => {
    try {
      const payload = { ...form, category_id: form.category_id ? Number(form.category_id) : null }
      if (editProduct) {
        await productsAPI.update(editProduct.id, payload)
      } else {
        await productsAPI.create(payload)
      }
      setOpen(false)
      setEditProduct(null)
      setForm({ name: '', sku: '', unit_price: 0, cost_price: 0, quantity_in_stock: 0, min_stock_level: 0, unit: 'piece', category_id: '', description: '' })
      loadProducts()
    } catch (err) {
      alert('Error saving product')
    }
  }

  const handleEdit = (row: any) => {
    setEditProduct(row)
    setForm({ name: row.name, sku: row.sku, unit_price: row.unit_price, cost_price: row.cost_price || 0, quantity_in_stock: row.quantity_in_stock, min_stock_level: row.min_stock_level, unit: row.unit, category_id: row.category_id || '', description: row.description || '' })
    setOpen(true)
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المنتجات</Typography>
      <DataTable
        columns={columns}
        rows={products}
        onAdd={() => setOpen(true)}
        onEdit={handleEdit}
        onDelete={async (row) => { if (window.confirm('Are you sure?')) { await productsAPI.delete(row.id); loadProducts() } }}
        searchable
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editProduct ? 'تعديل منتج' : 'إضافة منتج'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="اسم المنتج" sx={{ mt: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="كود المنتج (SKU)" sx={{ mt: 2 }} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <TextField fullWidth label="سعر البيع" type="number" sx={{ mt: 2 }} value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })} />
          <TextField fullWidth label="سعر التكلفة" type="number" sx={{ mt: 2 }} value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: Number(e.target.value) })} />
          <TextField fullWidth label="الكمية في المخزون" type="number" sx={{ mt: 2 }} value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: Number(e.target.value) })} />
          <TextField fullWidth label="الحد الأدنى" type="number" sx={{ mt: 2 }} value={form.min_stock_level} onChange={(e) => setForm({ ...form, min_stock_level: Number(e.target.value) })} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>التصنيف</InputLabel>
            <Select value={form.category_id} label="التصنيف" onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
