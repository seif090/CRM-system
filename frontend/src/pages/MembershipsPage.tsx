import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { membershipsAPI } from '../services/api'

export default function MembershipsPage() {
  const [tab, setTab] = useState(0)
  const [plans, setPlans] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [visits, setVisits] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    membershipsAPI.plans.list().then(r => setPlans(r.data))
    membershipsAPI.members.list().then(r => setMembers(r.data))
    membershipsAPI.visits.list().then(r => setVisits(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Membership Program</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Plans" /><Tab label="Members" /><Tab label="Visits" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Plan</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Price</TableCell><TableCell>Duration</TableCell><TableCell>Max Visits</TableCell></TableRow></TableHead><TableBody>
            {plans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(p => <TableRow key={p.id}><TableCell>{p.id}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.price}</TableCell><TableCell>{p.duration_days}d</TableCell><TableCell>{p.max_visits}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={plans.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Member</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Plan</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(m => <TableRow key={m.id}><TableCell>{m.id}</TableCell><TableCell>{m.customer_id}</TableCell><TableCell>{m.plan_id}</TableCell><TableCell><Chip label={m.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={members.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Member</TableCell><TableCell>Date</TableCell></TableRow></TableHead><TableBody>
          {visits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(v => <TableRow key={v.id}><TableCell>{v.id}</TableCell><TableCell>{v.member_id}</TableCell><TableCell>{v.visit_date?.slice(0,10)}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={visits.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Plan' : 'Member'}</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
