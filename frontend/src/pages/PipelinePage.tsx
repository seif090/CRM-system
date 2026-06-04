import { useState, useEffect } from 'react'
import {
  Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { pipelineAPI } from '../services/api'

export default function PipelinePage() {
  const [stages, setStages] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', value: 0, stage_id: 0, probability: 50 })

  useEffect(() => {
    pipelineAPI.stages.list().then((r) => setStages(r.data))
    pipelineAPI.deals.list().then((r) => setDeals(r.data))
  }, [])

  const create = async () => {
    await pipelineAPI.deals.create(form)
    setOpen(false)
    pipelineAPI.deals.list().then((r) => setDeals(r.data))
  }

  const updateStage = async (dealId: number, stageId: number) => {
    await pipelineAPI.deals.update(dealId, { stage_id: stageId })
    pipelineAPI.deals.list().then((r) => setDeals(r.data))
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>خط أنابيب المبيعات</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setForm({ ...form, stage_id: stages[0]?.id || 0 }); setOpen(true) }}>صفقة جديدة</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 2 }}>
        {stages.map((stage) => (
          <Paper key={stage.id} sx={{ minWidth: 280, p: 2, bgcolor: 'background.default' }}>
            <Typography fontWeight={700} sx={{ mb: 2, color: stage.color }}>{stage.name}</Typography>
            {deals.filter((d) => d.stage_id === stage.id).map((deal) => (
              <Paper key={deal.id} sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <Typography variant="body2" fontWeight={600}>{deal.title}</Typography>
                <Typography variant="caption" color="text.secondary">{deal.value?.toLocaleString()} ج.م</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                  {stages.filter((s) => s.order < stage.order).map((s) => (
                    <Chip key={s.id} label={s.name} size="small" variant="outlined" onClick={() => updateStage(deal.id, s.id)} sx={{ cursor: 'pointer' }} />
                  ))}
                </Box>
              </Paper>
            ))}
          </Paper>
        ))}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>صفقة جديدة</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth label="القيمة" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} sx={{ mt: 2 }} />
          <TextField fullWidth select label="المرحلة" value={form.stage_id} onChange={(e) => setForm({ ...form, stage_id: +e.target.value })} sx={{ mt: 2 }}>
            {stages.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          <Box sx={{ mt: 2, textAlign: 'left' }}><Button variant="contained" onClick={create}>إنشاء</Button></Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
