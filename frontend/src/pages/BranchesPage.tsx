import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip } from '@mui/material'
import DataTable from '../components/DataTable'
import { branchesAPI } from '../services/api'

const columns = [
  { id: 'code', label: 'الكود' },
  { id: 'name', label: 'الاسم' },
  { id: 'address', label: 'العنوان' },
  { id: 'phone', label: 'الهاتف' },
  { id: 'manager', label: 'المدير' },
  { id: 'is_active', label: 'نشط', render: (v: number) => <Chip label={v ? 'نعم' : 'لا'} color={v ? 'success' : 'default'} size="small" /> },
]

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', address: '', phone: '', manager: '' })

  useEffect(() => { branchesAPI.list().then((r) => setBranches(r.data)).catch(() => {}) }, [])

  const handleSave = async () => {
    try { await branchesAPI.create(form); setOpen(false); setForm({ name: '', code: '', address: '', phone: '', manager: '' }); branchesAPI.list().then((r) => setBranches(r.data)).catch(() => {}) }
    catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الفروع</Typography>
      <DataTable columns={columns} rows={branches} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>فرع جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="الكود" sx={{ mt: 2 }} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <TextField fullWidth label="العنوان" sx={{ mt: 2 }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <TextField fullWidth label="الهاتف" sx={{ mt: 2 }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth label="المدير" sx={{ mt: 2 }} value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
