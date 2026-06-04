import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { crmActivitiesAPI } from '../services/api'

export default function CRMActivitiesPage() {
  const [tab, setTab] = useState(0)
  const [calls, setCalls] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    crmActivitiesAPI.calls.list().then(r => setCalls(r.data))
    crmActivitiesAPI.meetings.list().then(r => setMeetings(r.data))
    crmActivitiesAPI.notes.list().then(r => setNotes(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>CRM Activities</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Call Logs" /><Tab label="Meetings" /><Tab label="Notes" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Call Log</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Duration (s)</TableCell><TableCell>Outcome</TableCell></TableRow></TableHead><TableBody>
            {calls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.customer_id}</TableCell><TableCell>{c.duration}</TableCell><TableCell>{c.outcome}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={calls.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Meeting</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {meetings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(m => <TableRow key={m.id}><TableCell>{m.id}</TableCell><TableCell>{m.title}</TableCell><TableCell><Chip label={m.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={meetings.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Note</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Content</TableCell><TableCell>Date</TableCell></TableRow></TableHead><TableBody>
            {notes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => <TableRow key={n.id}><TableCell>{n.id}</TableCell><TableCell>{n.customer_id}</TableCell><TableCell>{n.content?.slice(0,80)}</TableCell><TableCell>{n.created_at?.slice(0,10)}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={notes.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Call Log' : tab === 1 ? 'Meeting' : 'Note'}</DialogTitle><DialogContent><TextField fullWidth label="Title" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
