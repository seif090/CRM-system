import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { marketingAPI } from '../services/api'

export default function MarketingPage() {
  const [tab, setTab] = useState(0)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    marketingAPI.campaigns.list().then(r => setCampaigns(r.data))
    marketingAPI.leads.list().then(r => setLeads(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Marketing Campaigns</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Campaigns" /><Tab label="Leads" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Campaign</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Budget</TableCell><TableCell>Spent</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {campaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.budget}</TableCell><TableCell>{c.spent}</TableCell><TableCell><Chip label={c.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={campaigns.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Lead</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Source</TableCell><TableCell>Score</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {leads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(l => <TableRow key={l.id}><TableCell>{l.id}</TableCell><TableCell>{l.name}</TableCell><TableCell>{l.source}</TableCell><TableCell>{l.score}</TableCell><TableCell><Chip label={l.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={leads.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Campaign' : 'Lead'}</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
