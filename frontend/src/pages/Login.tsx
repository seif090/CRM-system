import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material'
import { authAPI } from '../services/api'
import { useAuth } from '../utils/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await authAPI.login({ username, password })
      login(res.data.user, res.data.access_token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper sx={{ p: 4, width: 400, maxWidth: '90%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
          ERP & CRM System
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="اسم المستخدم" sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField fullWidth label="كلمة المرور" type="password" sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button fullWidth type="submit" variant="contained" size="large">تسجيل الدخول</Button>
        </form>
      </Paper>
    </Box>
  )
}
