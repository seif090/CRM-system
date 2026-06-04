import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { taxAPI } from '../services/api'

export default function TaxPage() {
  const [tab, setTab] = useState(0)
  const [codes, setCodes] = useState<any[]>([])
  const [returns, setReturns] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    taxAPI.codes.list().then(r => setCodes(r.data))
    taxAPI.returns.list().then(r => setReturns(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tax Management</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Tax Codes" /><Tab label="Tax Returns" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Tax Code</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Rate</TableCell><TableCell>Type</TableCell><TableCell>Active</TableCell></TableRow></TableHead><TableBody>
            {codes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.rate}%</TableCell><TableCell>{c.type}</TableCell><TableCell><Chip label={c.is_active ? 'Yes' : 'No'} color={c.is_active ? 'success' : 'default'} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={codes.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Tax Return</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Sales Tax</TableCell><TableCell>Purchase Tax</TableCell><TableCell>Net Due</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {returns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.name}</TableCell><TableCell>{r.total_sales_tax}</TableCell><TableCell>{r.total_purchase_tax}</TableCell><TableCell>{r.net_due}</TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={returns.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Tax Code' : 'Tax Return'}</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
