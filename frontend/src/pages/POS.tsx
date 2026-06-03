import { useState, useEffect, useCallback } from 'react'
import {
  Box, Paper, TextField, Button, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { posAPI, salesAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

export default function POS() {
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [paidAmount, setPaidAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [openProducts, setOpenProducts] = useState(false)
  const [openCustomers, setOpenCustomers] = useState(false)
  const [successDialog, setSuccessDialog] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const loadProducts = useCallback(() => {
    posAPI.products({ search }).then((res) => setProducts(res.data)).catch(() => {})
  }, [search])

  const loadCustomers = useCallback(() => {
    posAPI.customers({}).then((res) => setCustomers(res.data)).catch(() => {})
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])
  useEffect(() => { loadCustomers() }, [loadCustomers])

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.unit_price,
      }]
    })
  }

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const items = [...prev]
      const newQty = items[index].quantity + delta
      if (newQty <= 0) return items.filter((_, i) => i !== index)
      items[index] = { ...items[index], quantity: newQty }
      return items
    })
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const grandTotal = subtotal

  const handleCheckout = async () => {
    try {
      const res = await salesAPI.create({
        customer_id: selectedCustomer?.id || null,
        customer_name: selectedCustomer?.name || '',
        customer_phone: selectedCustomer?.phone || '',
        items: cart,
        paid_amount: paidAmount,
        payment_method: paymentMethod,
      })
      setInvoiceNumber(res.data.invoice_number)
      setCart([])
      setSelectedCustomer(null)
      setPaidAmount(0)
      setSuccessDialog(true)
    } catch (err) {
      alert('Error completing sale')
    }
  }

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>نقطة البيع (POS)</Typography>

      <Grid container spacing={2} sx={{ height: 'calc(100% - 50px)' }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
            <TextField
              size="small" fullWidth placeholder="بحث عن منتج بالاسم أو الباركود..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
            />
            <Button variant="outlined" onClick={() => setOpenProducts(true)}>تصفح</Button>
            <Button variant="outlined" onClick={() => setOpenCustomers(true)}>
              {selectedCustomer ? selectedCustomer.name : 'اختيار عميل'}
            </Button>
          </Paper>

          <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 300, overflow: 'auto', mb: 2 }}>
            {products.slice(0, 20).map((p) => (
              <Paper
                key={p.id}
                sx={{ p: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, minWidth: 120, textAlign: 'center' }}
                onClick={() => addToCart(p)}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                <Typography variant="caption" color="text.secondary">{p.sku}</Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>{formatCurrency(p.unit_price)}</Typography>
                <Chip label={`مخزون: ${p.quantity_in_stock}`} size="small" color={p.quantity_in_stock > 0 ? 'success' : 'error'} />
              </Paper>
            ))}
          </Paper>

          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>المنتج</TableCell>
                  <TableCell align="center">الكمية</TableCell>
                  <TableCell align="center">السعر</TableCell>
                  <TableCell align="center">الإجمالي</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => updateQty(i, -1)}><RemoveIcon fontSize="small" /></IconButton>
                      {item.quantity}
                      <IconButton size="small" onClick={() => updateQty(i, 1)}><AddIcon fontSize="small" /></IconButton>
                    </TableCell>
                    <TableCell align="center">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell align="center">{formatCurrency(item.quantity * item.unit_price)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => removeFromCart(i)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {cart.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center">السلة فارغة</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>ملخص الفاتورة</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>العميل:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedCustomer?.name || 'نقدي'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>عدد الأصناف:</Typography>
                <Typography>{cart.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>العدد الكلي:</Typography>
                <Typography>{cart.reduce((s, i) => s + i.quantity, 0)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">الإجمالي:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>{formatCurrency(grandTotal)}</Typography>
              </Box>
              <TextField fullWidth label="المدفوع" type="number" size="small" sx={{ mb: 2 }}
                value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {['cash', 'card', 'credit'].map((m) => (
                  <Chip key={m} label={m === 'cash' ? 'نقدي' : m === 'card' ? 'بطاقة' : 'آجل'}
                    color={paymentMethod === m ? 'primary' : 'default'}
                    onClick={() => setPaymentMethod(m)} />
                ))}
              </Box>
              {paidAmount > 0 && paidAmount >= grandTotal && (
                <Typography color="success.main" sx={{ mb: 1 }}>
                  الباقي: {formatCurrency(paidAmount - grandTotal)}
                </Typography>
              )}
            </Box>
            <Button variant="contained" size="large" fullWidth sx={{ py: 2 }}
              disabled={cart.length === 0 || paidAmount <= 0}
              onClick={handleCheckout}>
              إتمام البيع ({formatCurrency(grandTotal)})
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openProducts} onClose={() => setOpenProducts(false)} maxWidth="md" fullWidth>
        <DialogTitle>المنتجات</DialogTitle>
        <DialogContent>
          <TextField fullWidth placeholder="بحث..." size="small" sx={{ mb: 2 }} value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {products.map((p) => (
              <Chip key={p.id} label={`${p.name} - ${formatCurrency(p.unit_price)}`}
                onClick={() => { addToCart(p); setOpenProducts(false) }} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openCustomers} onClose={() => setOpenCustomers(false)}>
        <DialogTitle>اختيار عميل</DialogTitle>
        <DialogContent>
          {customers.map((c) => (
            <Button key={c.id} fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}
              onClick={() => { setSelectedCustomer(c); setOpenCustomers(false) }}>
              {c.name} - {c.phone}
            </Button>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <DialogTitle>تم البيع بنجاح!</DialogTitle>
        <DialogContent>
          <Typography>رقم الفاتورة: {invoiceNumber}</Typography>
          <Typography>الإجمالي: {formatCurrency(grandTotal)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSuccessDialog(false); window.open(`/sales`, '_blank') }}>عرض الفاتورة</Button>
          <Button variant="contained" onClick={() => setSuccessDialog(false)}>فتح فاتورة جديدة</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
