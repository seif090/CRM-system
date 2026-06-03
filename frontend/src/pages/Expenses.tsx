import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { expensesAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'category_name', label: 'التصنيف' },
  { id: 'amount', label: 'المبلغ', render: (v: number) => formatCurrency(v) },
  { id: 'description', label: 'البيان' },
  { id: 'paid_to', label: 'المدفوع لـ' },
  { id: 'payment_method', label: 'طريقة الدفع' },
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category_id: '', amount: 0, description: '', paid_to: '', payment_method: 'cash' })

  useEffect(() => {
    loadExpenses()
    expensesAPI.categories.list().then((res) => setCategories(res.data)).catch(() => {})
  }, [])

  const loadExpenses = () => expensesAPI.list().then((res) => setExpenses(res.data)).catch(() => {})

  const handleSave = async () => {
    try {
      await expensesAPI.create({
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
        amount: Number(form.amount),
      })
      setOpen(false)
      setForm({ category_id: '', amount: 0, description: '', paid_to: '', payment_method: 'cash' })
      loadExpenses()
    } catch (err) { alert('Error saving expense') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المصروفات</Typography>
      <DataTable columns={columns} rows={expenses} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة مصروف</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>التصنيف</InputLabel>
            <Select value={form.category_id} label="التصنيف" onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="المبلغ" type="number" sx={{ mt: 2 }} value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <TextField fullWidth label="البيان" sx={{ mt: 2 }} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField fullWidth label="المدفوع لـ" sx={{ mt: 2 }} value={form.paid_to}
            onChange={(e) => setForm({ ...form, paid_to: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
