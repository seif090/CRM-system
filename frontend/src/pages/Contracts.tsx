import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  Select, MenuItem, FormControl, InputLabel, TablePagination, TableSortLabel,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { contractsAPI } from '../services/api'

const statusColor: Record<string, any> = { active: 'success', expired: 'default', terminated: 'error', draft: 'warning' }

export default function Contracts() {
  const [rows, setRows] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [orderDir, setOrderDir] = useState<'asc'|'desc'>('desc')

  useEffect(() => { contractsAPI.list().then(r => setRows(r.data)) }, [])

  const handleSort = (col: string) => {
    const isAsc = orderBy === col && orderDir === 'asc'
    setOrderBy(col); setOrderDir(isAsc ? 'desc' : 'asc')
  }

  const sorted = [...rows].sort((a, b) => {
    const aVal = a[orderBy] ?? '', bVal = b[orderBy] ?? ''
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
    return orderDir === 'asc' ? cmp : -cmp
  })

  const handleDelete = async (id: number) => {
    await contractsAPI.delete(id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const cols = ['id','title','contract_type','party_name','amount','status','start_date','end_date','notes','actions']

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Contract Management</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Contract</Button>
      <TableContainer component={Paper}>
        <Table size="small"><TableHead>
          <TableRow>
            {cols.map(col => col !== 'actions' ? (
              <TableCell key={col} sortDirection={orderBy === col ? orderDir : false}>
                <TableSortLabel active={orderBy === col} direction={orderBy === col ? orderDir : 'asc'} onClick={() => handleSort(col)}>
                  {col.replace('_',' ').toUpperCase()}
                </TableSortLabel>
              </TableCell>
            ) : <TableCell key="actions">ACTIONS</TableCell>)}
          </TableRow>
        </TableHead><TableBody>
          {sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell><TableCell>{r.title}</TableCell>
              <TableCell><Chip label={r.contract_type} size="small" /></TableCell>
              <TableCell>{r.party_name}</TableCell>
              <TableCell>{r.amount}</TableCell>
              <TableCell><Chip label={r.status} color={statusColor[r.status] || 'default'} size="small" /></TableCell>
              <TableCell>{r.start_date?.slice(0,10)}</TableCell><TableCell>{r.end_date?.slice(0,10)}</TableCell>
              <TableCell>{r.notes}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => { setEditItem(r); setOpen(true) }}><Edit /></IconButton>
                <IconButton size="small" onClick={() => handleDelete(r.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody></Table>
        <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'New'} Contract</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" sx={{ mt: 2 }} defaultValue={editItem?.title || ''} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
