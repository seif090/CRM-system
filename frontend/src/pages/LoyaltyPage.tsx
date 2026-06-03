import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Chip, Card, CardContent, Paper } from '@mui/material'
import DataTable from '../components/DataTable'
import { loyaltyAPI, customersAPI } from '../services/api'

export default function LoyaltyPage() {
  const [tiers, setTiers] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [openTier, setOpenTier] = useState(false)
  const [openCoupon, setOpenCoupon] = useState(false)
  const [tierForm, setTierForm] = useState({ name: '', min_points: 0, discount_percent: 0, benefits: '' })
  const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'percent', discount_value: 0, min_purchase: 0, max_uses: 100, expires_at: '' })

  useEffect(() => {
    loyaltyAPI.tiers.list().then((r) => setTiers(r.data)).catch(() => {})
    loyaltyAPI.coupons.list().then((r) => setCoupons(r.data)).catch(() => {})
    customersAPI.list().then((r) => setCustomers(r.data)).catch(() => {})
  }, [])

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>ولاء العملاء</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>المستويات</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {tiers.map((t: any) => (
            <Card key={t.id} sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t.name}</Typography>
                <Typography variant="body2">نقاط: {t.min_points}+</Typography>
                <Typography variant="body2">خصم: {t.discount_percent}%</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Button variant="outlined" onClick={() => setOpenTier(true)}>إضافة مستوى</Button>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>الكوبونات</Typography>
      <DataTable columns={[
        { id: 'code', label: 'الكود' },
        { id: 'discount_type', label: 'النوع' },
        { id: 'discount_value', label: 'القيمة' },
        { id: 'min_purchase', label: 'الحد الأدنى' },
        { id: 'used_count', label: 'المستخدم' },
        { id: 'is_active', label: 'نشط', render: (v: number) => <Chip label={v ? 'نعم' : 'لا'} color={v ? 'success' : 'default'} size="small" /> },
      ]} rows={coupons} onAdd={() => setOpenCoupon(true)} />

      <Dialog open={openTier} onClose={() => setOpenTier(false)} maxWidth="sm" fullWidth>
        <DialogTitle>مستوى ولاء جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })} />
          <TextField fullWidth label="الحد الأدنى للنقاط" type="number" sx={{ mt: 2 }} value={tierForm.min_points} onChange={(e) => setTierForm({ ...tierForm, min_points: Number(e.target.value) })} />
          <TextField fullWidth label="نسبة الخصم" type="number" sx={{ mt: 2 }} value={tierForm.discount_percent} onChange={(e) => setTierForm({ ...tierForm, discount_percent: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTier(false)}>إلغاء</Button>
          <Button variant="contained" onClick={async () => { await loyaltyAPI.tiers.create(tierForm); setOpenTier(false); loyaltyAPI.tiers.list().then((r) => setTiers(r.data)).catch(() => {}) }}>حفظ</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCoupon} onClose={() => setOpenCoupon(false)} maxWidth="sm" fullWidth>
        <DialogTitle>كوبون جديد</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الكود" sx={{ mt: 2 }} value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} />
          <TextField fullWidth label="قيمة الخصم" type="number" sx={{ mt: 2 }} value={couponForm.discount_value} onChange={(e) => setCouponForm({ ...couponForm, discount_value: Number(e.target.value) })} />
          <TextField fullWidth label="الحد الأدنى للشراء" type="number" sx={{ mt: 2 }} value={couponForm.min_purchase} onChange={(e) => setCouponForm({ ...couponForm, min_purchase: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoupon(false)}>إلغاء</Button>
          <Button variant="contained" onClick={async () => { await loyaltyAPI.coupons.create(couponForm); setOpenCoupon(false); loyaltyAPI.coupons.list().then((r) => setCoupons(r.data)).catch(() => {}) }}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
