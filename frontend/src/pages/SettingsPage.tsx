import { useState, useEffect } from 'react'
import {
  Typography, Paper, TextField, Button, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import { permissionsAPI } from '../services/api'

export default function SettingsPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', permissions: '' })

  useEffect(() => {
    permissionsAPI.roles.list().then((res) => setRoles(res.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await permissionsAPI.roles.create(form)
      setOpen(false)
      setForm({ name: '', description: '', permissions: '' })
      permissionsAPI.roles.list().then((res) => setRoles(res.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الإعدادات والصلاحيات</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>الأدوار والصلاحيات</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الدور</TableCell>
                <TableCell>الوصف</TableCell>
                <TableCell>صلاحيات</TableCell>
                <TableCell>نظامي</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{r.name}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {(r.permissions || '').split(',').filter(Boolean).map((p: string) => (
                        <Chip key={p} label={p} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{r.is_system ? 'نعم' : 'لا'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>إضافة دور</Button>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>دور جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="اسم الدور" sx={{ mt: 2 }} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="الوصف" sx={{ mt: 2 }} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField fullWidth label="الصلاحيات (مفصولة بفاصلة)" sx={{ mt: 2 }} value={form.permissions}
            onChange={(e) => setForm({ ...form, permissions: e.target.value })} placeholder="sales.read, sales.write, products.read" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
