import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { batchSerialAPI } from '../services/api'

export default function BatchSerialPage() {
  const [tab, setTab] = useState(0)
  const [batches, setBatches] = useState<any[]>([])
  const [serials, setSerials] = useState<any[]>([])
  const [tracking, setTracking] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    batchSerialAPI.batches.list().then(r => setBatches(r.data))
    batchSerialAPI.serials.list().then(r => setSerials(r.data))
    batchSerialAPI.tracking.list().then(r => setTracking(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Batch & Serial Tracking</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Batches" /><Tab label="Serials" /><Tab label="Tracking" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Batch</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Batch #</TableCell><TableCell>Product</TableCell><TableCell>Quantity</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {batches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(b => <TableRow key={b.id}><TableCell>{b.id}</TableCell><TableCell>{b.batch_number}</TableCell><TableCell>{b.product_id}</TableCell><TableCell>{b.quantity}</TableCell><TableCell><Chip label={b.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={batches.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Serial</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Serial #</TableCell><TableCell>Product</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {serials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => <TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.serial_number}</TableCell><TableCell>{s.product_id}</TableCell><TableCell><Chip label={s.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={serials.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Type</TableCell><TableCell>Quantity</TableCell><TableCell>Date</TableCell></TableRow></TableHead><TableBody>
          {tracking.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(t => <TableRow key={t.id}><TableCell>{t.id}</TableCell><TableCell>{t.movement_type}</TableCell><TableCell>{t.quantity}</TableCell><TableCell>{t.created_at?.slice(0,10)}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={tracking.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Batch' : 'Serial'}</DialogTitle><DialogContent><TextField fullWidth label="Number" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
