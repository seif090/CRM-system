import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Chip, IconButton, Rating, TablePagination, TableSortLabel,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { feedbackAPI } from '../services/api'

export default function Feedback() {
  const [tab, setTab] = useState(0)
  const [forms, setForms] = useState<any[]>([])
  const [responses, setResponses] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    feedbackAPI.forms.list().then(r => setForms(r.data))
    feedbackAPI.responses.list().then(r => setResponses(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Feedback & Surveys</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Forms" /><Tab label="Responses" />
      </Tabs>

      <Box sx={{ pt: 2 }}>
        {tab === 0 && (
          <>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Form</Button>
            <TableContainer component={Paper}>
              <Table size="small"><TableHead><TableRow>
                <TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Active</TableCell><TableCell>Created</TableCell>
              </TableRow></TableHead><TableBody>
                {forms.map(f => (
                  <TableRow key={f.id}>
                    <TableCell>{f.id}</TableCell><TableCell>{f.title}</TableCell>
                    <TableCell><Chip label={f.is_active ? 'Yes' : 'No'} color={f.is_active ? 'success' : 'default'} size="small" /></TableCell>
                    <TableCell>{f.created_at?.slice(0,10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </TableContainer>
          </>
        )}
        {tab === 1 && (
          <TableContainer component={Paper}>
            <Table size="small"><TableHead><TableRow>
              <TableCell>ID</TableCell><TableCell>Form</TableCell><TableCell>Customer</TableCell><TableCell>Rating</TableCell><TableCell>Date</TableCell>
            </TableRow></TableHead><TableBody>
              {responses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell><TableCell>{r.form_id}</TableCell>
                  <TableCell>{r.customer_id || '-'}</TableCell>
                  <TableCell><Rating value={r.rating} readOnly size="small" /></TableCell>
                  <TableCell>{r.created_at?.slice(0,10)}</TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
            <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={responses.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
          </TableContainer>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Feedback Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
