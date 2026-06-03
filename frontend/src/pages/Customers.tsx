import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { customersAPI } from '../services/api'

const columns = [
  { id: 'name', label: 'الاسم' },
  { id: 'phone', label: 'رقم الهاتف' },
  { id: 'email', label: 'البريد الإلكتروني' },
  { id: 'company', label: 'الشركة' },
  { id: 'total_purchases', label: 'عدد المشتريات' },
  { id: 'status', label: 'الحالة' },
]

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<any>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', company: '', notes: '' })

  useEffect(() => { loadCustomers() }, [])

  const loadCustomers = () => {
    customersAPI.list().then((res) => setCustomers(res.data)).catch(() => {})
  }

  const handleSave = async () => {
    try {
      if (editCustomer) {
        await customersAPI.update(editCustomer.id, form)
      } else {
        await customersAPI.create(form)
      }
      setOpen(false)
      setEditCustomer(null)
      setForm({ name: '', phone: '', email: '', address: '', company: '', notes: '' })
      loadCustomers()
    } catch (err) {
      alert('Error saving customer')
    }
  }

  const handleEdit = (row: any) => {
    setEditCustomer(row)
    setForm({ name: row.name, phone: row.phone, email: row.email || '', address: row.address || '', company: row.company || '', notes: row.notes || '' })
    setOpen(true)
  }

  const handleDelete = async (row: any) => {
    if (window.confirm('Are you sure?')) {
      await customersAPI.delete(row.id)
      loadCustomers()
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>العملاء</Typography>
      <DataTable
        columns={columns}
        rows={customers}
        onAdd={() => setOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editCustomer ? 'تعديل عميل' : 'إضافة عميل'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="رقم الهاتف" sx={{ mt: 2 }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth label="البريد الإلكتروني" sx={{ mt: 2 }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="العنوان" sx={{ mt: 2 }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <TextField fullWidth label="الشركة" sx={{ mt: 2 }} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
