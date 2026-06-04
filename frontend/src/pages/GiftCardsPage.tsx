import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { giftCardsAPI } from '../services/api'

export default function GiftCardsPage() {
  const [tab, setTab] = useState(0)
  const [cards, setCards] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    giftCardsAPI.list().then(r => setCards(r.data))
    giftCardsAPI.transactions.list().then(r => setTransactions(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gift Cards</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Cards" /><Tab label="Transactions" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Gift Card</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Card #</TableCell><TableCell>Balance</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {cards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.card_number}</TableCell><TableCell>{c.current_balance}</TableCell><TableCell><Chip label={c.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={cards.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Card</TableCell><TableCell>Amount</TableCell><TableCell>Type</TableCell><TableCell>Date</TableCell></TableRow></TableHead><TableBody>
          {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(t => <TableRow key={t.id}><TableCell>{t.id}</TableCell><TableCell>{t.gift_card_id}</TableCell><TableCell>{t.amount}</TableCell><TableCell><Chip label={t.type} size="small" /></TableCell><TableCell>{t.created_at?.slice(0,10)}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={transactions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Gift Card</DialogTitle><DialogContent><TextField fullWidth label="Card Number" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
