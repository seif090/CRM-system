import { useState, useEffect } from 'react'
import { Typography, Card, CardContent, Button, Box, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import { printAPI, salesAPI, productsAPI } from '../services/api'

export default function PrintPage() {
  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedSale, setSelectedSale] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  useEffect(() => {
    salesAPI.list({ limit: 50 }).then((r) => setSales(r.data)).catch(() => {})
    productsAPI.list().then((r) => setProducts(r.data)).catch(() => {})
  }, [])

  const handlePrintInvoice = async () => {
    if (!selectedSale) { alert('Select an invoice'); return }
    try {
      const res = await printAPI.invoice(Number(selectedSale))
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      window.open(url)
    } catch (err) { alert('Error printing') }
  }

  const handlePrintBarcode = async () => {
    if (!selectedProduct) { alert('Select a product'); return }
    try {
      const res = await printAPI.barcode(Number(selectedProduct))
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      window.open(url)
    } catch (err) { alert('Error printing') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>طباعة</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>طباعة فاتورة</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <InputLabel>الفاتورة</InputLabel>
              <Select value={selectedSale} label="الفاتورة" onChange={(e) => setSelectedSale(e.target.value)}>
                {sales.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.invoice_number} - {s.customer_name}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintInvoice}>طباعة PDF</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>طباعة باركود منتج</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <InputLabel>المنتج</InputLabel>
              <Select value={selectedProduct} label="المنتج" onChange={(e) => setSelectedProduct(e.target.value)}>
                {products.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintBarcode}>طباعة باركود</Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
