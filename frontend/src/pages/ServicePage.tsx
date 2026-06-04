import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { serviceAPI } from '../services/api'

export default function ServicePage() {
  const [tab, setTab] = useState(0)
  const [requests, setRequests] = useState<any[]>([])
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    serviceAPI.requests.list().then(r => setRequests(r.data))
    serviceAPI.workOrders.list().then(r => setWorkOrders(r.data))
    serviceAPI.schedules.list().then(r => setSchedules(r.data))
  }, [])

  const priorityColor = (p: string) => ({ high: 'error', medium: 'warning', low: 'info' } as any)[p] || 'default'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Service Management</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Requests" /><Tab label="Work Orders" /><Tab label="Schedules" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Request</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Priority</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell><TableCell><Chip label={r.priority} color={priorityColor(r.priority)} size="small" /></TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={requests.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Work Order</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Request</TableCell><TableCell>Status</TableCell><TableCell>Scheduled</TableCell></TableRow></TableHead><TableBody>
            {workOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(w => <TableRow key={w.id}><TableCell>{w.id}</TableCell><TableCell>{w.service_request_id}</TableCell><TableCell><Chip label={w.status} size="small" /></TableCell><TableCell>{w.scheduled_date?.slice(0,10)}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={workOrders.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Type</TableCell><TableCell>Next Date</TableCell></TableRow></TableHead><TableBody>
          {schedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => <TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.customer_id}</TableCell><TableCell>{s.service_type}</TableCell><TableCell>{s.next_date?.slice(0,10)}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={schedules.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Service Request' : 'Work Order'}</DialogTitle><DialogContent><TextField fullWidth label="Title" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
