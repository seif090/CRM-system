import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography,
  Select, MenuItem, FormControl, InputLabel, Chip, Box, Paper,
} from '@mui/material'
import DataTable from '../components/DataTable'
import { tasksAPI } from '../services/api'

const taskColumns = [
  { id: 'title', label: 'المهمة' },
  { id: 'priority', label: 'الأولوية', render: (v: string) => (
    <Chip label={v} color={v === 'high' ? 'error' : v === 'medium' ? 'warning' : 'success'} size="small" />
  )},
  { id: 'status', label: 'الحالة', render: (v: string) => (
    <Chip label={v} color={v === 'completed' ? 'success' : v === 'in_progress' ? 'info' : 'default'} size="small" />
  )},
  { id: 'due_date', label: 'تاريخ التسليم' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [form, setForm] = useState({ title: '', project_id: '', priority: 'medium', assigned_to: '', due_date: '' })
  const [projectForm, setProjectForm] = useState({ name: '', description: '', priority: 'medium' })

  useEffect(() => {
    tasksAPI.list().then((res) => setTasks(res.data)).catch(() => {})
    tasksAPI.projects.list().then((res) => setProjects(res.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await tasksAPI.create({ ...form, project_id: form.project_id ? Number(form.project_id) : null })
      setOpen(false)
      setForm({ title: '', project_id: '', priority: 'medium', assigned_to: '', due_date: '' })
      tasksAPI.list().then((res) => setTasks(res.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  const handleProjectSave = async () => {
    try {
      await tasksAPI.projects.create(projectForm)
      setProjectOpen(false)
      setProjectForm({ name: '', description: '', priority: 'medium' })
      tasksAPI.projects.list().then((res) => setProjects(res.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>المهام والمشاريع</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {projects.map((p: any) => (
          <Paper key={p.id} sx={{ p: 2, minWidth: 200, cursor: 'pointer' }}>
            <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
            <Typography variant="caption" color="text.secondary">{p.status} - {p.priority}</Typography>
          </Paper>
        ))}
        <Button variant="outlined" onClick={() => setProjectOpen(true)}>+ مشروع</Button>
      </Box>

      <DataTable columns={taskColumns} rows={tasks} onAdd={() => setOpen(true)} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة مهمة</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="المهمة" sx={{ mt: 2 }} value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>المشروع</InputLabel>
            <Select value={form.project_id} label="المشروع" onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
              {projects.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>الأولوية</InputLabel>
            <Select value={form.priority} label="الأولوية" onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <MenuItem value="low">منخفضة</MenuItem><MenuItem value="medium">متوسطة</MenuItem><MenuItem value="high">عالية</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={projectOpen} onClose={() => setProjectOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>مشروع جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="اسم المشروع" sx={{ mt: 2 }} value={projectForm.name}
            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
          <TextField fullWidth label="الوصف" sx={{ mt: 2 }} value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleProjectSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
