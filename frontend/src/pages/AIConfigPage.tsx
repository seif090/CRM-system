import { useState, useEffect } from 'react'
import {
  Typography, Card, CardContent, TextField, Button, Box,
} from '@mui/material'
import { aiAPI } from '../services/api'

export default function AIConfigPage() {
  const [configs, setConfigs] = useState<any[]>([])
  const [name, setName] = useState('')
  const [promptTemplate, setPromptTemplate] = useState('')
  const [temperature, setTemperature] = useState(70)
  const [maxTokens, setMaxTokens] = useState(1024)

  useEffect(() => {
    aiAPI.config.list().then((res) => setConfigs(res.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    try {
      await aiAPI.config.create({ name, prompt_template: promptTemplate, temperature, max_tokens: maxTokens })
      setName('')
      setPromptTemplate('')
      aiAPI.config.list().then((res) => setConfigs(res.data)).catch(() => {})
    } catch (err) { alert('Error saving config') }
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>الذكاء الاصطناعي</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>إعدادات AI</Typography>
          <TextField fullWidth label="اسم الإعداد" sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth label="قالب التعليمات (Prompt Template)" multiline rows={6} sx={{ mb: 2 }}
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            placeholder="مثال: أنت مساعد مبيعات خبير. اسم العميل: {customer_name}. أجب عن استفسار العميل بلطف واحترافية."
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="درجة الحرارة (0-100)" type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
            <TextField label="أقصى عدد كلمات" type="number" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} />
          </Box>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>حفظ الإعدادات</Button>
        </CardContent>
      </Card>

      {configs.map((cfg: any) => (
        <Card key={cfg.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{cfg.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{cfg.prompt_template}</Typography>
            <Typography variant="caption" color="text.secondary">Temperature: {cfg.temperature} | Max Tokens: {cfg.max_tokens}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
