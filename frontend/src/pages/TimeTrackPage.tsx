import { useState, useEffect } from 'react'
import {
  Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { timeTrackAPI } from '../services/api'

export default function TimeTrackPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [summary, setSummary] = useState({ total_hours: 0 })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], duration_minutes: 0, description: '' })

  useEffect(() => {
    timeTrackAPI.list().then((r) => setEntries(r.data))
    timeTrackAPI.summary().then((r) => setSummary(r.data))
  }, [])

  const create = async () => {
    await timeTrackAPI.create(form)
    setOpen(false)
    setForm({ date: new Date().toISOString().split('T')[0], duration_minutes: 0, description: '' })
    timeTrackAPI.list().then((r) => setEntries(r.data))
    timeTrackAPI.summary().then((r) => setSummary(r.data))
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>تسجيل الوقت</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>تسجيل وقت</Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={700} color="primary">{summary.total_hours}</Typography>
            <Typography color="text.secondary">إجمالي الساعات</Typography>
          </Paper>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow><TableCell>التاريخ</TableCell><TableCell>الوصف</TableCell><TableCell>المدة</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.date}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell>{e.duration_minutes} دقيقة</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>تسجيل وقت</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="date" label="التاريخ" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth type="number" label="المدة (دقائق)" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: +e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mt: 2 }} />
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={create}>حفظ</Button></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
