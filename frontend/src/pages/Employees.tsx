import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material'
import DataTable from '../components/DataTable'
import { employeesAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const columns = [
  { id: 'employee_code', label: 'الكود' },
  { id: 'full_name', label: 'الاسم' },
  { id: 'phone', label: 'الهاتف' },
  { id: 'position', label: 'الوظيفة' },
  { id: 'department', label: 'القسم' },
  { id: 'salary', label: 'الراتب', render: (v: number) => v ? formatCurrency(v) : '-' },
  { id: 'status', label: 'الحالة' },
]

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editEmp, setEditEmp] = useState<any>(null)
  const [form, setForm] = useState<any>({ employee_code: '', full_name: '', phone: '', email: '', position: '', department: '', salary: '', hire_date: '', address: '' })

  useEffect(() => { loadEmployees() }, [])

  const loadEmployees = () => employeesAPI.list().then((res) => setEmployees(res.data)).catch(() => {})

  const handleSave = async () => {
    try {
      const payload = { ...form, salary: form.salary ? Number(form.salary) : null }
      if (editEmp) { await employeesAPI.update(editEmp.id, payload) }
      else { await employeesAPI.create(payload) }
      setOpen(false); setEditEmp(null)
      setForm({ employee_code: '', full_name: '', phone: '', email: '', position: '', department: '', salary: '', hire_date: '', address: '' })
      loadEmployees()
    } catch (err) { alert('Error saving employee') }
  }

  const handleEdit = (row: any) => {
    setEditEmp(row)
    setForm({ employee_code: row.employee_code, full_name: row.full_name, phone: row.phone || '', email: row.email || '', position: row.position || '', department: row.department || '', salary: row.salary || '', hire_date: row.hire_date || '', address: row.address || '' })
    setOpen(true)
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الموظفين</Typography>
      <DataTable columns={columns} rows={employees} onAdd={() => setOpen(true)} onEdit={handleEdit} onDelete={async (row) => { if (window.confirm('Are you sure?')) { await employeesAPI.delete(row.id); loadEmployees() } }} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editEmp ? 'تعديل موظف' : 'إضافة موظف'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="كود الموظف" sx={{ mt: 2 }} value={form.employee_code} onChange={(e) => setForm({ ...form, employee_code: e.target.value })} />
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <TextField fullWidth label="الهاتف" sx={{ mt: 2 }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth label="البريد" sx={{ mt: 2 }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="الوظيفة" sx={{ mt: 2 }} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <TextField fullWidth label="القسم" sx={{ mt: 2 }} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <TextField fullWidth label="الراتب" type="number" sx={{ mt: 2 }} value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
