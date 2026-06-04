import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Chip, IconButton, TablePagination, TableSortLabel,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { subscriptionsAPI } from '../services/api'

const statusColor: Record<string, any> = { active: 'success', expired: 'default', cancelled: 'error', pending: 'warning' }

export default function Subscriptions() {
  const [tab, setTab] = useState(0)
  const [plans, setPlans] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    subscriptionsAPI.plans.list().then(r => setPlans(r.data))
    subscriptionsAPI.customers.list().then(r => setCustomers(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Subscription Plans</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Plans" /><Tab label="Customer Subscriptions" />
      </Tabs>

      <Box sx={{ pt: 2 }}>
        {tab === 0 && (
          <>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Plan</Button>
            <TableContainer component={Paper}>
              <Table size="small"><TableHead><TableRow>
                <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Price</TableCell><TableCell>Cycle</TableCell><TableCell>Max Users</TableCell><TableCell>Storage</TableCell><TableCell>Active</TableCell>
              </TableRow></TableHead><TableBody>
                {plans.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell><TableCell>{p.name}</TableCell>
                    <TableCell>{p.price}</TableCell><TableCell>{p.billing_cycle}</TableCell>
                    <TableCell>{p.max_users}</TableCell><TableCell>{p.max_storage}GB</TableCell>
                    <TableCell><Chip label={p.is_active ? 'Yes' : 'No'} color={p.is_active ? 'success' : 'default'} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </TableContainer>
          </>
        )}
        {tab === 1 && (
          <>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Subscription</Button>
            <TableContainer component={Paper}>
              <Table size="small"><TableHead><TableRow>
                <TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Plan</TableCell><TableCell>Status</TableCell><TableCell>Start</TableCell><TableCell>End</TableCell><TableCell>Auto Renew</TableCell>
              </TableRow></TableHead><TableBody>
                {customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell><TableCell>{s.customer_id}</TableCell>
                    <TableCell>{s.plan_id}</TableCell>
                    <TableCell><Chip label={s.status} color={statusColor[s.status] || 'default'} size="small" /></TableCell>
                    <TableCell>{s.start_date?.slice(0,10)}</TableCell>
                    <TableCell>{s.end_date?.slice(0,10)}</TableCell>
                    <TableCell><Chip label={s.auto_renew ? 'Yes' : 'No'} color={s.auto_renew ? 'info' : 'default'} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
              <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={customers.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
            </TableContainer>
          </>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New {tab === 0 ? 'Plan' : 'Subscription'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
