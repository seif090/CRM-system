import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { recurringInvoiceAPI } from '../services/api'

export default function RecurringInvoicesPage() {
  const [tab, setTab] = useState(0)
  const [recurring, setRecurring] = useState<any[]>([])
  const [generated, setGenerated] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    recurringInvoiceAPI.list().then(r => setRecurring(r.data))
    recurringInvoiceAPI.generated.list().then(r => setGenerated(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Recurring Invoices</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Templates" /><Tab label="Generated" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Template</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Frequency</TableCell><TableCell>Next Date</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {recurring.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.customer_id}</TableCell><TableCell>{r.frequency}</TableCell><TableCell>{r.next_date?.slice(0,10)}</TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={recurring.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Template</TableCell><TableCell>Invoice</TableCell><TableCell>Generated</TableCell></TableRow></TableHead><TableBody>
          {generated.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(g => <TableRow key={g.id}><TableCell>{g.id}</TableCell><TableCell>{g.recurring_id}</TableCell><TableCell>{g.invoice_id}</TableCell><TableCell>{g.generated_date?.slice(0,10)}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={generated.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Recurring Invoice</DialogTitle><DialogContent><TextField fullWidth label="Customer ID" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
