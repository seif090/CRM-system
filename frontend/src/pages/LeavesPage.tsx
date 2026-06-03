import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Box } from '@mui/material'
import DataTable from '../components/DataTable'
import { leavesAPI, employeesAPI } from '../services/api'

const columns = [
  { id: 'employee_id', label: 'رقم الموظف' },
  { id: 'leave_type_name', label: 'نوع الإجازة' },
  { id: 'start_date', label: 'من' },
  { id: 'end_date', label: 'إلى' },
  { id: 'total_days', label: 'عدد الأيام' },
  { id: 'status', label: 'الحالة', render: (v: string) => <Chip label={v} color={v === 'approved' ? 'success' : v === 'rejected' ? 'error' : 'warning'} size="small" /> },
]

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [leaveTypes, setLeaveTypes] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', reason: '' })

  useEffect(() => {
    leavesAPI.list().then((r) => setLeaves(r.data)).catch(() => {})
    employeesAPI.list().then((r) => setEmployees(r.data)).catch(() => {})
    leavesAPI.types.list().then((r) => setLeaveTypes(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await leavesAPI.create({
        employee_id: Number(form.employee_id),
        leave_type_id: form.leave_type_id ? Number(form.leave_type_id) : null,
        start_date: form.start_date, end_date: form.end_date, reason: form.reason,
      })
      setOpen(false); setForm({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', reason: '' })
      leavesAPI.list().then((r) => setLeaves(r.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  const handleApprove = async (id: number, status: string) => {
    await leavesAPI.approve(id, status)
    leavesAPI.list().then((r) => setLeaves(r.data)).catch(() => {})
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الإجازات</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {leaveTypes.map((t: any) => <Chip key={t.id} label={`${t.name} (${t.days_allowed} يوم)`} />)}
      </Box>
      <DataTable columns={columns} rows={leaves} onAdd={() => setOpen(true)} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>طلب إجازة</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>الموظف</InputLabel>
            <Select value={form.employee_id} label="الموظف" onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
              {employees.map((e: any) => <MenuItem key={e.id} value={e.id}>{e.full_name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>نوع الإجازة</InputLabel>
            <Select value={form.leave_type_id} label="نوع الإجازة" onChange={(e) => setForm({ ...form, leave_type_id: e.target.value })}>
              {leaveTypes.map((t: any) => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="من تاريخ" type="date" sx={{ mt: 2 }} value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField fullWidth label="إلى تاريخ" type="date" sx={{ mt: 2 }} value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField fullWidth label="السبب" sx={{ mt: 2 }} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
