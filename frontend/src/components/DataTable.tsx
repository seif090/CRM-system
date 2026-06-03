import { useState } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Box, IconButton, Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

interface Column {
  id: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface Props {
  columns: Column[]
  rows: any[]
  onAdd?: () => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  searchable?: boolean
  onSearch?: (term: string) => void
}

export default function DataTable({ columns, rows, onAdd, onEdit, onDelete, searchable, onSearch }: Props) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        {searchable && (
          <TextField
            size="small"
            placeholder="بحث..."
            onChange={(e) => onSearch?.(e.target.value)}
            sx={{ minWidth: 300 }}
          />
        )}
        <Box sx={{ flexGrow: 1 }} />
        {onAdd && (
          <Tooltip title="إضافة">
            <IconButton color="primary" onClick={onAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 700 }}>{col.label}</TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell sx={{ fontWeight: 700 }}>إجراءات</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
              <TableRow key={row.id || i} hover>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {col.render ? col.render(row[col.id], row) : row[col.id] ?? '-'}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell>
                    {onEdit && (
                      <IconButton size="small" onClick={() => onEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
        labelRowsPerPage="عدد الصفوف"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
      />
    </Paper>
  )
}
