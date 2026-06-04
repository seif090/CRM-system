import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip,
  Select, MenuItem, FormControl, InputLabel, IconButton,
  TablePagination, TableSortLabel,
} from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import { manufacturingAPI } from '../services/api'

interface TabPanelProps { children?: React.ReactNode; index: number; value: number }
function TabPanel({ children, value, index }: TabPanelProps) {
  return <div role="tabpanel" hidden={value !== index}>{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}</div>
}

export default function Manufacturing() {
  const [tab, setTab] = useState(0)
  const [boms, setBoms] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [orderDir, setOrderDir] = useState<'asc'|'desc'>('desc')

  useEffect(() => {
    manufacturingAPI.boms.list().then(r => setBoms(r.data))
    manufacturingAPI.orders.list().then(r => setOrders(r.data))
  }, [])

  const handleSort = (col: string) => {
    const isAsc = orderBy === col && orderDir === 'asc'
    setOrderBy(col)
    setOrderDir(isAsc ? 'desc' : 'asc')
  }

  const sorted = (arr: any[]) => [...arr].sort((a, b) => {
    const aVal = a[orderBy] ?? '', bVal = b[orderBy] ?? ''
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
    return orderDir === 'asc' ? cmp : -cmp
  })

  const statusColor: Record<string, any> = { draft: 'default', confirmed: 'primary', in_progress: 'info', completed: 'success', cancelled: 'error' }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manufacturing / MRP</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Bills of Materials" />
        <Tab label="Production Orders" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New BOM</Button>
        <TableContainer component={Paper}>
          <Table size="small"><TableHead>
            <TableRow>
              {['id','name','product_id','quantity','notes','created_by'].map(col =>
                <TableCell key={col} sortDirection={orderBy === col ? orderDir : false}>
                  <TableSortLabel active={orderBy === col} direction={orderBy === col ? orderDir : 'asc'} onClick={() => handleSort(col)}>
                    {col.replace('_',' ').toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead><TableBody>
            {sorted(boms).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell><TableCell>{b.name}</TableCell>
                <TableCell>{b.product_id}</TableCell><TableCell>{b.quantity}</TableCell>
                <TableCell>{b.notes}</TableCell><TableCell>{b.created_by}</TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
          <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={boms.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
        </TableContainer>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Order</Button>
        <TableContainer component={Paper}>
          <Table size="small"><TableHead>
            <TableRow>
              {['id','reference','bom_id','quantity','status','start_date','end_date','notes','created_by'].map(col =>
                <TableCell key={col} sortDirection={orderBy === col ? orderDir : false}>
                  <TableSortLabel active={orderBy === col} direction={orderBy === col ? orderDir : 'asc'} onClick={() => handleSort(col)}>
                    {col.replace('_',' ').toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead><TableBody>
            {sorted(orders).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(o => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell><TableCell>{o.reference}</TableCell>
                <TableCell>{o.bom_id}</TableCell><TableCell>{o.quantity}</TableCell>
                <TableCell><Chip label={o.status} color={statusColor[o.status] || 'default'} size="small" /></TableCell>
                <TableCell>{o.start_date?.slice(0,10)}</TableCell><TableCell>{o.end_date?.slice(0,10)}</TableCell>
                <TableCell>{o.notes}</TableCell><TableCell>{o.created_by}</TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
          <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={orders.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
        </TableContainer>
      </TabPanel>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'New'} {tab === 0 ? 'BOM' : 'Production Order'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
