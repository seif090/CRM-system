import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { procurementAPI } from '../services/api'

export default function ProcurementPage() {
  const [tab, setTab] = useState(0)
  const [requests, setRequests] = useState<any[]>([])
  const [rfqs, setRfqs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    procurementAPI.requests.list().then(r => setRequests(r.data))
    procurementAPI.rfqs.list().then(r => setRfqs(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Procurement</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Purchase Requests" /><Tab label="RFQs" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Request</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Department</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell><TableCell>{r.department}</TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={requests.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New RFQ</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Issue Date</TableCell><TableCell>Due Date</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {rfqs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell><TableCell>{r.issue_date?.slice(0,10)}</TableCell><TableCell>{r.due_date?.slice(0,10)}</TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={rfqs.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Purchase Request' : 'RFQ'}</DialogTitle><DialogContent><TextField fullWidth label="Title" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
