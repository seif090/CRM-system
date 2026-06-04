import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { trainingAPI } from '../services/api'

export default function TrainingPage() {
  const [tab, setTab] = useState(0)
  const [courses, setCourses] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    trainingAPI.courses.list().then(r => setCourses(r.data))
    trainingAPI.sessions.list().then(r => setSessions(r.data))
    trainingAPI.enrollments.list().then(r => setEnrollments(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Training & Development</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Courses" /><Tab label="Sessions" /><Tab label="Enrollments" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Course</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Hours</TableCell><TableCell>Max</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.title}</TableCell><TableCell>{c.duration_hours}</TableCell><TableCell>{c.max_participants}</TableCell><TableCell><Chip label={c.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={courses.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Course</TableCell><TableCell>Instructor</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => <TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.course_id}</TableCell><TableCell>{s.instructor}</TableCell><TableCell><Chip label={s.status} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={sessions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Session</TableCell><TableCell>Employee</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {enrollments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => <TableRow key={e.id}><TableCell>{e.id}</TableCell><TableCell>{e.session_id}</TableCell><TableCell>{e.employee_id}</TableCell><TableCell><Chip label={e.status} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={enrollments.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Course</DialogTitle><DialogContent><TextField fullWidth label="Title" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
