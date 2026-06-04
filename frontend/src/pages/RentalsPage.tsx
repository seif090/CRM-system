import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { rentalsAPI } from '../services/api'

export default function RentalsPage() {
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    rentalsAPI.items.list().then(r => setItems(r.data))
    rentalsAPI.orders.list().then(r => setOrders(r.data))
    rentalsAPI.contracts.list().then(r => setContracts(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Rental Management</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Items" /><Tab label="Orders" /><Tab label="Contracts" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Item</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Daily</TableCell><TableCell>Weekly</TableCell><TableCell>Monthly</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(i => <TableRow key={i.id}><TableCell>{i.id}</TableCell><TableCell>{i.name}</TableCell><TableCell>{i.daily_rate}</TableCell><TableCell>{i.weekly_rate}</TableCell><TableCell>{i.monthly_rate}</TableCell><TableCell><Chip label={i.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={items.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Order</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Item</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(o => <TableRow key={o.id}><TableCell>{o.id}</TableCell><TableCell>{o.customer_id}</TableCell><TableCell>{o.item_id}</TableCell><TableCell>{o.total_amount}</TableCell><TableCell><Chip label={o.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={orders.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Order</TableCell><TableCell>Deposit</TableCell></TableRow></TableHead><TableBody>
          {contracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.order_id}</TableCell><TableCell>{c.deposit_amount}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={contracts.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Rental Item' : 'Rental Order'}</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
