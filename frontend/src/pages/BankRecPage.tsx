import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { bankRecAPI } from '../services/api'

export default function BankRecPage() {
  const [tab, setTab] = useState(0)
  const [statements, setStatements] = useState<any[]>([])
  const [reconciliations, setReconciliations] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    bankRecAPI.statements.list().then(r => setStatements(r.data))
    bankRecAPI.reconciliations.list().then(r => setReconciliations(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bank Reconciliation</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Statements" /><Tab label="Reconciliations" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Statement</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Account</TableCell><TableCell>Date</TableCell><TableCell>Balance</TableCell></TableRow></TableHead><TableBody>
            {statements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => <TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.account_id}</TableCell><TableCell>{s.statement_date?.slice(0,10)}</TableCell><TableCell>{s.ending_balance}</TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={statements.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Reconciliation</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Statement</TableCell><TableCell>Matched</TableCell><TableCell>Difference</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {reconciliations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.statement_id}</TableCell><TableCell>{r.matched_transactions}</TableCell><TableCell>{r.difference}</TableCell><TableCell><Chip label={r.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={reconciliations.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Statement' : 'Reconciliation'}</DialogTitle><DialogContent><TextField fullWidth label="Account ID" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
