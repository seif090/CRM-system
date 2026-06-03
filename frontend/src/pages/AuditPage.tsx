import { useState, useEffect } from 'react'
import { Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'
import DataTable from '../components/DataTable'
import { auditAPI } from '../services/api'
import { formatDateTime } from '../utils/helpers'

const columns = [
  { id: 'username', label: 'المستخدم' },
  { id: 'action', label: 'الإجراء' },
  { id: 'entity_type', label: 'النوع' },
  { id: 'entity_id', label: 'رقم العنصر' },
  { id: 'created_at', label: 'التاريخ', render: (v: string) => formatDateTime(v) },
]

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [entityFilter, setEntityFilter] = useState('')

  useEffect(() => {
    auditAPI.list({ entity_type: entityFilter || undefined }).then((res) => setLogs(res.data)).catch(() => {})
  }, [entityFilter])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>سجل النشاطات</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>تصفية حسب</InputLabel>
          <Select value={entityFilter} label="تصفية حسب" onChange={(e) => setEntityFilter(e.target.value)}>
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="customer">عملاء</MenuItem>
            <MenuItem value="product">منتجات</MenuItem>
            <MenuItem value="sale">مبيعات</MenuItem>
            <MenuItem value="purchase">مشتريات</MenuItem>
            <MenuItem value="employee">موظفين</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataTable columns={columns} rows={logs} />
    </>
  )
}
