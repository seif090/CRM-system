import { useState, useEffect } from 'react'
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Box, Chip, IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { ticketsAPI } from '../services/api'

const statusColors: any = { open: 'error', in_progress: 'warning', resolved: 'success', closed: 'default' }

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' })

  useEffect(() => { ticketsAPI.list().then((r) => setTickets(r.data)).catch(() => {}) }, [])

  const create = async () => {
    await ticketsAPI.create(form)
    setOpen(false)
    setForm({ subject: '', description: '', priority: 'medium' })
    ticketsAPI.list().then((r) => setTickets(r.data))
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>الدعم الفني (تذاكر)</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>تذكرة جديدة</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell><TableCell>الموضوع</TableCell><TableCell>الأولوية</TableCell><TableCell>الحالة</TableCell><TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.subject}</TableCell>
                <TableCell><Chip label={t.priority} size="small" color={t.priority === 'high' ? 'error' : t.priority === 'medium' ? 'warning' : 'default'} /></TableCell>
                <TableCell><Chip label={t.status} size="small" color={statusColors[t.status] || 'default'} /></TableCell>
                <TableCell><IconButton><VisibilityIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>تذكرة جديدة</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الموضوع" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="الوصف" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth select label="الأولوية" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} sx={{ mt: 2 }}>
            <MenuItem value="low">منخفضة</MenuItem><MenuItem value="medium">متوسطة</MenuItem><MenuItem value="high">عالية</MenuItem>
          </TextField>
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={create}>إنشاء</Button></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
