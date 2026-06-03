import { useState } from 'react'
import { Typography, Card, CardContent, Button, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { importExportAPI } from '../services/api'

const entities = [
  { value: 'customers', label: 'العملاء' },
  { value: 'products', label: 'المنتجات' },
  { value: 'employees', label: 'الموظفين' },
  { value: 'sales', label: 'المبيعات' },
]

export default function ImportExportPage() {
  const [entity, setEntity] = useState('customers')
  const [format, setFormat] = useState('csv')

  const handleExport = async () => {
    try {
      const res = await importExportAPI.export(entity, format)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${entity}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error exporting')
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>استيراد وتصدير البيانات</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>تصدير البيانات</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>البيانات</InputLabel>
              <Select value={entity} label="البيانات" onChange={(e) => setEntity(e.target.value)}>
                {entities.map((e) => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>الصيغة</InputLabel>
              <Select value={format} label="الصيغة" onChange={(e) => setFormat(e.target.value)}>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExport}>تصدير</Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
