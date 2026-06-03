import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material'
import DataTable from '../components/DataTable'
import { assetsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const columns = [
  { id: 'code', label: 'الكود' },
  { id: 'name', label: 'الاسم' },
  { id: 'purchase_price', label: 'سعر الشراء', render: (v: number) => formatCurrency(v) },
  { id: 'current_value', label: 'القيمة الحالية', render: (v: number) => formatCurrency(v) },
  { id: 'location', label: 'الموقع' },
  { id: 'status', label: 'الحالة', render: (v: string) => <Chip label={v} size="small" /> },
]

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category_id: '', code: '', purchase_price: 0, current_value: 0, location: '', notes: '' })

  useEffect(() => {
    assetsAPI.list().then((r) => setAssets(r.data)).catch(() => {})
    assetsAPI.categories.list().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await assetsAPI.create({ ...form, category_id: form.category_id ? Number(form.category_id) : null, purchase_price: Number(form.purchase_price), current_value: Number(form.current_value) || Number(form.purchase_price) })
      setOpen(false); setForm({ name: '', category_id: '', code: '', purchase_price: 0, current_value: 0, location: '', notes: '' })
      assetsAPI.list().then((r) => setAssets(r.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>إدارة الأصول</Typography>
      <DataTable columns={columns} rows={assets} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>أصل جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="الكود" sx={{ mt: 2 }} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>التصنيف</InputLabel>
            <Select value={form.category_id} label="التصنيف" onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="سعر الشراء" type="number" sx={{ mt: 2 }} value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: Number(e.target.value) })} />
          <TextField fullWidth label="الموقع" sx={{ mt: 2 }} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
