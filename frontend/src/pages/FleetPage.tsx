import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, TablePagination } from '@mui/material'
import { Add } from '@mui/icons-material'
import { fleetAPI } from '../services/api'

export default function FleetPage() {
  const [tab, setTab] = useState(0)
  const [drivers, setDrivers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [fuel, setFuel] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    fleetAPI.drivers.list().then(r => setDrivers(r.data))
    fleetAPI.vehicles.list().then(r => setVehicles(r.data))
    fleetAPI.maintenance.list().then(r => setMaintenance(r.data))
    fleetAPI.fuel.list().then(r => setFuel(r.data))
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Fleet Management</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Vehicles" /><Tab label="Drivers" /><Tab label="Maintenance" /><Tab label="Fuel" /></Tabs>
      <Box sx={{ pt: 2 }}>
        {tab === 0 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Vehicle</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Plate</TableCell><TableCell>Model</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(v => <TableRow key={v.id}><TableCell>{v.id}</TableCell><TableCell>{v.plate_number}</TableCell><TableCell>{v.model}</TableCell><TableCell><Chip label={v.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={vehicles.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 1 && (<><Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>New Driver</Button>
          <TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>License</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
            {drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(d => <TableRow key={d.id}><TableCell>{d.id}</TableCell><TableCell>{d.name}</TableCell><TableCell>{d.license_number}</TableCell><TableCell><Chip label={d.status} size="small" /></TableCell></TableRow>)}
          </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={drivers.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer></>)}
        {tab === 2 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Vehicle</TableCell><TableCell>Type</TableCell><TableCell>Cost</TableCell></TableRow></TableHead><TableBody>
          {maintenance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(m => <TableRow key={m.id}><TableCell>{m.id}</TableCell><TableCell>{m.vehicle_id}</TableCell><TableCell>{m.maintenance_type}</TableCell><TableCell>{m.cost}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={maintenance.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
        {tab === 3 && (<TableContainer component={Paper}><Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Vehicle</TableCell><TableCell>Liters</TableCell><TableCell>Total Cost</TableCell></TableRow></TableHead><TableBody>
          {fuel.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(f => <TableRow key={f.id}><TableCell>{f.id}</TableCell><TableCell>{f.vehicle_id}</TableCell><TableCell>{f.liters}</TableCell><TableCell>{f.total_cost}</TableCell></TableRow>)}
        </TableBody></Table><TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={fuel.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0) }} /></TableContainer>)}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth><DialogTitle>New {tab === 0 ? 'Vehicle' : 'Driver'}</DialogTitle><DialogContent><TextField fullWidth label="Name" sx={{ mt: 2 }} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained">Save</Button></DialogActions></Dialog>
    </Box>
  )
}
