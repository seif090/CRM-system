import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { recruitmentAPI } from '../services/api'
import { statusColor } from '../utils/colors'

export default function Recruitment() {
  const [tab, setTab] = useState(0)
  const [jobs, setJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [interviews, setInterviews] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    recruitmentAPI.jobs.list().then(r => setJobs(r.data))
    recruitmentAPI.applicants.list().then(r => setApplicants(r.data))
    recruitmentAPI.interviews.list().then(r => setInterviews(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Recruitment</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Job Postings" /><Tab label="Applicants" /><Tab label="Interviews" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Job</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Department</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(j => <TableRow key={j.id}><TableCell>{j.id}</TableCell><TableCell>{j.title}</TableCell><TableCell>{j.department}</TableCell><TableCell><Chip label={j.status} color={statusColor(j.status)} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={jobs.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Job</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {applicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(a => <TableRow key={a.id}><TableCell>{a.id}</TableCell><TableCell>{a.name}</TableCell><TableCell>{a.job_id}</TableCell><TableCell><Chip label={a.status} color={statusColor(a.status)} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={applicants.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Applicant</TableCell><TableCell>Interviewer</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
          {interviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(i => <TableRow key={i.id}><TableCell>{i.id}</TableCell><TableCell>{i.applicant_id}</TableCell><TableCell>{i.interviewer}</TableCell><TableCell><Chip label={i.status} color={statusColor(i.status)} size="small" /></TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={interviews.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New Job Posting</DialogTitle><DialogContent><TextField fullWidth label="Title" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
