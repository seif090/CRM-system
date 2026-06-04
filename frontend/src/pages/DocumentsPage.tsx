import { useState, useEffect } from 'react'
import {
  Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import { documentsAPI } from '../services/api'

const fileTypeIcons: any = { pdf: '📄', doc: '📝', xls: '📊', image: '🖼️', other: '📎' }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [form, setForm] = useState({ title: '', file_name: '', file_type: '', folder_id: 0 })
  const [folderForm, setFolderForm] = useState({ name: '' })

  useEffect(() => {
    documentsAPI.list().then((r) => setDocs(r.data))
    documentsAPI.folders.list().then((r) => setFolders(r.data))
  }, [])

  const create = async () => {
    await documentsAPI.create({ ...form, folder_id: form.folder_id || null })
    setOpen(false)
    setForm({ title: '', file_name: '', file_type: '', folder_id: 0 })
    documentsAPI.list().then((r) => setDocs(r.data))
  }

  const createFolder = async () => {
    await documentsAPI.folders.create(folderForm)
    setFolderOpen(false)
    setFolderForm({ name: '' })
    documentsAPI.folders.list().then((r) => setFolders(r.data))
  }

  const remove = async (id: number) => {
    await documentsAPI.delete(id)
    documentsAPI.list().then((r) => setDocs(r.data))
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>المستندات</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => setFolderOpen(true)}>➕ مجلد</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>مستند جديد</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {folders.map((f) => (
          <Chip key={f.id} label={f.name} icon={<DescriptionIcon />} variant="outlined" />
        ))}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow><TableCell>الاسم</TableCell><TableCell>النوع</TableCell><TableCell>الحجم</TableCell><TableCell>المجلد</TableCell><TableCell></TableCell></TableRow>
          </TableHead>
          <TableBody>
            {docs.map((d) => (
              <TableRow key={d.id}>
                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>{fileTypeIcons[d.file_type] || '📎'}</span>{d.title}</Box></TableCell>
                <TableCell><Chip label={d.file_type || 'other'} size="small" /></TableCell>
                <TableCell>{d.file_size ? `${(d.file_size / 1024).toFixed(1)} KB` : '-'}</TableCell>
                <TableCell>{folders.find((f) => f.id === d.folder_id)?.name || '-'}</TableCell>
                <TableCell><IconButton color="error" onClick={() => remove(d.id)}><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>مستند جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="اسم الملف" value={form.file_name} onChange={(e) => setForm({ ...form, file_name: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="نوع الملف" value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth select label="المجلد" value={form.folder_id} onChange={(e) => setForm({ ...form, folder_id: +e.target.value })} sx={{ mt: 2 }}>
            <MenuItem value={0}>بدون مجلد</MenuItem>
            {folders.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
          </TextField>
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={create}>إنشاء</Button></Box>
        </DialogContent>
      </Dialog>
      <Dialog open={folderOpen} onClose={() => setFolderOpen(false)}>
        <DialogTitle>مجلد جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="اسم المجلد" value={folderForm.name} onChange={(e) => setFolderForm({ name: e.target.value })} sx={{ mt: 2 }} />
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={createFolder}>إنشاء</Button></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
