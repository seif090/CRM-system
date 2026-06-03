import { useState, useEffect } from 'react'
import {
  Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Box, Paper, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { inventoryAPI, productsAPI } from '../services/api'
import { formatDateTime } from '../utils/helpers'

const movementColumns = [
  { id: 'product_name', label: 'المنتج' },
  { id: 'movement_type', label: 'النوع' },
  { id: 'quantity', label: 'الكمية' },
  { id: 'reference_type', label: 'المرجع' },
  { id: 'notes', label: 'ملاحظات' },
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function Inventory() {
  const [movements, setMovements] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ product_id: '', new_quantity: 0, reason: '' })

  useEffect(() => {
    inventoryAPI.movements.list().then((res) => setMovements(res.data)).catch(() => {})
    productsAPI.list().then((res) => setProducts(res.data)).catch(() => {})
  }, [])

  const handleAdjust = async () => {
    try {
      await inventoryAPI.adjust({ ...form, product_id: Number(form.product_id), new_quantity: Number(form.new_quantity) })
      setOpen(false)
      setForm({ product_id: '', new_quantity: 0, reason: '' })
      inventoryAPI.movements.list().then((res) => setMovements(res.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>حركات المخزون</Typography>
      <DataTable columns={movementColumns} rows={movements} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>تسوية مخزون</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>المنتج</InputLabel>
            <Select value={form.product_id} label="المنتج" onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
              {products.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name} (المخزون: {p.quantity_in_stock})</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="الكمية الجديدة" type="number" sx={{ mt: 2 }} value={form.new_quantity}
            onChange={(e) => setForm({ ...form, new_quantity: Number(e.target.value) })} />
          <TextField fullWidth label="السبب" sx={{ mt: 2 }} value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleAdjust}>تسوية</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
