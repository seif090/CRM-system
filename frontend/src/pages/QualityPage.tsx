import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { qualityAPI } from '../services/api'

export default function QualityPage() {
  const [tab, setTab] = useState(0)
  const [checklists, setChecklists] = useState<any[]>([])
  const [inspections, setInspections] = useState<any[]>([])
  const [nc, setNc] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    qualityAPI.checklists.list().then(r => setChecklists(r.data))
    qualityAPI.inspections.list().then(r => setInspections(r.data))
    qualityAPI.nonConformance.list().then(r => setNc(r.data))
  }, [])

  const sc = (s: string) => ({ pass: 'success', fail: 'error', pending: 'warning' } as any)[s] || 'default'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Quality Control</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Checklists" /><Tab label="Inspections" /><Tab label="Non-Conformance" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Checklist</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell></TableRow></TableHead><TableBody>
            {checklists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={checklists.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Product</TableCell><TableCell>Inspector</TableCell><TableCell>Result</TableCell></TableRow></TableHead><TableBody>
          {inspections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(i => <TableRow key={i.id}><TableCell>{i.id}</TableCell><TableCell>{i.product_id}</TableCell><TableCell>{i.inspector}</TableCell><TableCell><Chip label={i.result} color={sc(i.result)} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={inspections.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Severity</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {nc.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => <TableRow key={n.id}><TableCell>{n.id}</TableCell><TableCell><Chip label={n.severity} color={n.severity === 'critical' ? 'error' : 'warning'} size="small" /></TableCell><TableCell><Chip label={n.status} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={nc.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Checklist</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
