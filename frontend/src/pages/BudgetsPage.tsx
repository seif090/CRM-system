import { useState, useEffect } from 'react'
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Chip, Paper, LinearProgress } from '@mui/material'
import { budgetsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', fiscal_year: new Date().getFullYear(), notes: '', lines: [{ category: '', planned_amount: 0 }] })

  useEffect(() => { budgetsAPI.list().then((r) => setBudgets(r.data)).catch(() => {}) }, [])

  const addLine = () => setForm({ ...form, lines: [...form.lines, { category: '', planned_amount: 0 }] })

  const handleSave = async () => {
    try {
      await budgetsAPI.create({ ...form, fiscal_year: Number(form.fiscal_year), lines: form.lines.map((l: any) => ({ ...l, planned_amount: Number(l.planned_amount) })) })
      setOpen(false); setForm({ name: '', fiscal_year: new Date().getFullYear(), notes: '', lines: [{ category: '', planned_amount: 0 }] })
      budgetsAPI.list().then((r) => setBudgets(r.data)).catch(() => {})
    } catch (err) { alert('Error') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الميزانيات</Typography>
      {budgets.map((b: any) => (
        <Paper key={b.id} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">{b.name} ({b.fiscal_year})</Typography>
            <Chip label={`${formatCurrency(b.spent_amount)} / ${formatCurrency(b.total_amount)}`} color={b.spent_amount > b.total_amount ? 'error' : 'success'} />
          </Box>
          <LinearProgress variant="determinate" value={b.total_amount > 0 ? (b.spent_amount / b.total_amount) * 100 : 0} sx={{ height: 10, borderRadius: 5 }} />
          {(b.lines || []).map((line: any) => (
            <Box key={line.id} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">{line.category}</Typography>
              <Typography variant="body2">{formatCurrency(line.spent_amount)} / {formatCurrency(line.planned_amount)}</Typography>
            </Box>
          ))}
        </Paper>
      ))}
      <Button variant="contained" onClick={() => setOpen(true)}>إضافة ميزانية</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ميزانية جديدة</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="الاسم" sx={{ mt: 2 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="السنة المالية" type="number" sx={{ mt: 2 }} value={form.fiscal_year} onChange={(e) => setForm({ ...form, fiscal_year: Number(e.target.value) })} />
          {form.lines.map((line: any, i: number) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <TextField size="small" label="التصنيف" value={line.category} onChange={(e) => { const lines = [...form.lines]; lines[i].category = e.target.value; setForm({ ...form, lines }) }} />
              <TextField size="small" label="المبلغ" type="number" value={line.planned_amount} onChange={(e) => { const lines = [...form.lines]; lines[i].planned_amount = Number(e.target.value); setForm({ ...form, lines }) }} />
            </Box>
          ))}
          <Button size="small" sx={{ mt: 1 }} onClick={addLine}>+ إضافة بند</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
