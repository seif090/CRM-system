import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination, Rating } from '@mui/material'
import { Add } from '@mui/icons-material'
import { performanceAPI } from '../services/api'

export default function PerformancePage() {
  const [tab, setTab] = useState(0)
  const [cycles, setCycles] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    performanceAPI.cycles.list().then(r => setCycles(r.data))
    performanceAPI.reviews.list().then(r => setReviews(r.data))
    performanceAPI.goals.list().then(r => setGoals(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Performance Reviews</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Cycles" /><Tab label="Reviews" /><Tab label="Goals" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Cycle</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {cycles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell><TableCell><Chip label={c.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={cycles.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Employee</TableCell><TableCell>Rating</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {reviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.employee_id}</TableCell><TableCell><Rating value={r.rating} readOnly size="small" /></TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={reviews.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Progress</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {goals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(g => <TableRow key={g.id}><TableCell>{g.id}</TableCell><TableCell>{g.title}</TableCell><TableCell>{g.progress}%</TableCell><TableCell><Chip label={g.status} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={goals.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Review Cycle</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
