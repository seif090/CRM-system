import { useState } from 'react'
import { Typography, Card, CardContent, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { portalAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/helpers'

export default function PortalPage() {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loyalty, setLoyalty] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!phone) return
    try {
      const [cRes, iRes, lRes] = await Promise.all([
        portalAPI.customer(phone),
        portalAPI.invoices(phone),
        portalAPI.loyalty(phone),
      ])
      setCustomer(cRes.data)
      setInvoices(iRes.data)
      setLoyalty(lRes.data)
      setSearched(true)
    } catch (err) {
      alert('Customer not found')
      setSearched(true)
      setCustomer(null)
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>بوابة العميل</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="رقم هاتف العميل" value={phone} onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} sx={{ minWidth: 300 }} />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>بحث</Button>
          </Box>
        </CardContent>
      </Card>

      {searched && !customer && (
        <Typography color="error">العميل غير موجود</Typography>
      )}

      {customer && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{customer.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {customer.phone} | {customer.email} | {customer.company}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip label={`مشتريات: ${customer.total_purchases}`} />
                <Chip label={`إجمالي الإنفاق: ${formatCurrency(customer.total_spent)}`} />
                {loyalty && <Chip label={`نقاط الولاء: ${loyalty.points}`} color="primary" />}
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6" sx={{ mb: 2 }}>الفواتير</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>رقم الفاتورة</TableCell>
                  <TableCell>الإجمالي</TableCell>
                  <TableCell>المدفوع</TableCell>
                  <TableCell>المتبقي</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>التاريخ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.invoice_number}</TableCell>
                    <TableCell>{formatCurrency(inv.grand_total)}</TableCell>
                    <TableCell>{formatCurrency(inv.paid_amount)}</TableCell>
                    <TableCell>{formatCurrency(inv.due_amount)}</TableCell>
                    <TableCell><Chip label={inv.payment_status} size="small" /></TableCell>
                    <TableCell>{formatDateTime(inv.created_at)}</TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center">لا توجد فواتير</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}
