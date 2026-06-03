import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Box, Paper } from '@mui/material'
import DataTable from '../components/DataTable'
import { payrollAPI, employeesAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const columns = [
  { id: 'employee_name', label: 'الموظف' },
  { id: 'month', label: 'الشهر' },
  { id: 'year', label: 'السنة' },
  { id: 'basic_salary', label: 'الأساسي', render: (v: number) => formatCurrency(v) },
  { id: 'bonuses', label: 'الحوافز', render: (v: number) => formatCurrency(v) },
  { id: 'deductions', label: 'الخصومات', render: (v: number) => formatCurrency(v) },
  { id: 'net_salary', label: 'الصافي', render: (v: number) => <Chip label={formatCurrency(v)} color="primary" /> },
  { id: 'payment_status', label: 'الحالة', render: (v: string) => <Chip label={v} size="small" /> },
]

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ employee_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic_salary: 0, bonuses: 0, deductions: 0, overtime: 0, notes: '' })

  useEffect(() => {
    payrollAPI.list().then((r) => setPayrolls(r.data)).catch(() => {})
    employeesAPI.list().then((r) => setEmployees(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      const emp = employees.find((e) => e.id === Number(form.employee_id))
      await payrollAPI.create({ ...form, employee_id: Number(form.employee_id), basic_salary: emp?.salary || 0, bonuses: Number(form.bonuses), deductions: Number(form.deductions), overtime: Number(form.overtime) })
      setOpen(false); payrollAPI.list().then((r) => setPayrolls(r.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الرواتب والأجور</Typography>
      <DataTable columns={columns} rows={payrolls} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>مرتب جديد</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>الموظف</InputLabel>
            <Select value={form.employee_id} label="الموظف" onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
              {employees.map((e: any) => <MenuItem key={e.id} value={e.id}>{e.full_name} - {formatCurrency(e.salary || 0)}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="الشهر" type="number" sx={{ mt: 2 }} value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} />
          <TextField fullWidth label="السنة" type="number" sx={{ mt: 2 }} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
          <TextField fullWidth label="الحوافز" type="number" sx={{ mt: 2 }} value={form.bonuses} onChange={(e) => setForm({ ...form, bonuses: Number(e.target.value) })} />
          <TextField fullWidth label="الخصومات" type="number" sx={{ mt: 2 }} value={form.deductions} onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })} />
          <TextField fullWidth label="الإضافي" type="number" sx={{ mt: 2 }} value={form.overtime} onChange={(e) => setForm({ ...form, overtime: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
