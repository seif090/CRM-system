import { useState, useEffect } from 'react'
import {
  Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Grid, IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { calendarAPI } from '../services/api'

const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const [form, setForm] = useState({ title: '', start_time: '', end_time: '', event_type: 'meeting', color: '#1976d2' })

  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  useEffect(() => {
    const from = new Date(year, month, 1).toISOString()
    const to = new Date(year, month + 1, 0).toISOString()
    calendarAPI.list({ from_date: from, to_date: to }).then((r) => setEvents(r.data)).catch(() => {})
  }, [year, month])

  const create = async () => {
    await calendarAPI.create({ ...form, start_time: new Date(form.start_time).toISOString(), end_time: form.end_time ? new Date(form.end_time).toISOString() : null })
    setOpen(false)
    setForm({ title: '', start_time: '', end_time: '', event_type: 'meeting', color: '#1976d2' })
    calendarAPI.list({ from_date: new Date(year, month, 1).toISOString(), to_date: new Date(year, month + 1, 0).toISOString() }).then((r) => setEvents(r.data))
  }

  const deleteEvent = async (id: number) => {
    await calendarAPI.delete(id)
    calendarAPI.list({ from_date: new Date(year, month, 1).toISOString(), to_date: new Date(year, month + 1, 0).toISOString() }).then((r) => setEvents(r.data))
  }

  const dayEvents = (day: number) => events.filter((e) => {
    const d = new Date(e.start_time)
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
  })

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>التقويم</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>حدث جديد</Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setDate(new Date(year, month - 1))}><ArrowForwardIcon /></IconButton>
          <Typography variant="h6">{months[month]} {year}</Typography>
          <IconButton onClick={() => setDate(new Date(year, month + 1))}><ArrowBackIcon /></IconButton>
        </Box>
        <Grid container spacing={0}>
          {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((d) => (
            <Grid key={d} xs={12 / 7}><Typography textAlign="center" fontWeight={700} sx={{ p: 1, color: 'text.secondary' }}>{d}</Typography></Grid>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <Grid key={`e${i}`} xs={12 / 7} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const evs = dayEvents(day)
            return (
              <Grid key={day} xs={12 / 7}>
                <Box sx={{
                  p: 0.5, minHeight: 80, border: '1px solid', borderColor: 'divider',
                  bgcolor: day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'action.selected' : 'transparent',
                }}>
                  <Typography variant="caption" fontWeight={600}>{day}</Typography>
                  {evs.slice(0, 2).map((e) => (
                    <Box key={e.id} sx={{ bgcolor: e.color, borderRadius: 1, px: 0.5, fontSize: 10, color: '#fff', mb: 0.3, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                      <DeleteIcon sx={{ fontSize: 12, cursor: 'pointer' }} onClick={() => deleteEvent(e.id)} />
                    </Box>
                  ))}
                  {evs.length > 2 && <Typography variant="caption" color="text.secondary">+{evs.length - 2}</Typography>}
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>حدث جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="تاريخ البدء" type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth label="تاريخ الانتهاء" type="datetime-local" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth select label="النوع" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} sx={{ mt: 2 }}>
            <MenuItem value="meeting">اجتماع</MenuItem><MenuItem value="call">مكالمة</MenuItem><MenuItem value="task">مهمة</MenuItem><MenuItem value="reminder">تذكير</MenuItem>
          </TextField>
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={create}>إنشاء</Button></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
