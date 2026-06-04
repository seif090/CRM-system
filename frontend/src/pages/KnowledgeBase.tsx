import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip,
  IconButton, TablePagination, TableSortLabel,
} from '@mui/material'
import { Add, Edit, Visibility } from '@mui/icons-material'
import { knowledgeAPI } from '../services/api'

export default function KnowledgeBase() {
  const [tab, setTab] = useState(0)
  const [categories, setCategories] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    knowledgeAPI.categories.list().then(r => setCategories(r.data))
    knowledgeAPI.articles.list().then(r => setArticles(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Knowledge Base</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Categories" /><Tab label="Articles" />
      </Tabs>

      <Box sx={{ pt: 2 }}>
        {tab === 0 && (
          <>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Category</Button>
            <TableContainer component={Paper}>
              <Table size="small"><TableHead><TableRow>
                <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell>Icon</TableCell>
              </TableRow></TableHead><TableBody>
                {categories.map(c => (
                  <TableRow key={c.id}><TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.description}</TableCell><TableCell>{c.icon}</TableCell></TableRow>
                ))}
              </TableBody></Table>
            </TableContainer>
          </>
        )}
        {tab === 1 && (
          <>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditItem(null); setOpen(true) }} sx={{ mb: 2 }}>New Article</Button>
            <TableContainer component={Paper}>
              <Table size="small"><TableHead><TableRow>
                <TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell>Views</TableCell><TableCell>Published</TableCell><TableCell>Actions</TableCell>
              </TableRow></TableHead><TableBody>
                {articles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell><TableCell>{a.title}</TableCell>
                    <TableCell>{a.category_id}</TableCell><TableCell>{a.views}</TableCell>
                    <TableCell><Chip label={a.is_published ? 'Yes' : 'No'} color={a.is_published ? 'success' : 'default'} size="small" /></TableCell>
                    <TableCell><IconButton size="small"><Visibility /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
              <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={articles.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} />
            </TableContainer>
          </>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'New'} {tab === 0 ? 'Category' : 'Article'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
