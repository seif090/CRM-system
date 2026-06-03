import { useState, useEffect } from 'react'
import {
  Typography, Grid, Paper, Box, Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { reportsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'
import StatCard from '../components/StatCard'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

const COLORS = ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2', '#00796b']

export default function Reports() {
  const [summary, setSummary] = useState<any>({})
  const [salesData, setSalesData] = useState<any[]>([])
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    reportsAPI.summary().then((res) => setSummary(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const days = parseInt(period)
    const from = new Date()
    from.setDate(from.getDate() - days)
    reportsAPI.sales({ from_date: from.toISOString().split('T')[0] }).then((res) => {
      setSalesData(res.data.daily_data || [])
    }).catch(() => {})
  }, [period])

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>التقارير</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="مبيعات الشهر" value={formatCurrency(summary.monthly_sales || 0)} icon={<PointOfSaleIcon />} color="success.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="مصروفات الشهر" value={formatCurrency(summary.monthly_expenses || 0)} icon={<MoneyOffIcon />} color="error.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="صافي الربح" value={formatCurrency(summary.monthly_profit || 0)} icon={<AccountBalanceIcon />} color="primary.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">تحليل المبيعات</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>الفترة</InputLabel>
                <Select value={period} label="الفترة" onChange={(e) => setPeriod(e.target.value)}>
                  <MenuItem value="7">7 أيام</MenuItem>
                  <MenuItem value="30">30 يوم</MenuItem>
                  <MenuItem value="90">3 شهور</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#1976d2" name="الإيرادات" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>ملخص سريع</Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">إجمالي الفواتير</Typography>
              <Typography variant="h6">{summary.total_sales || 0}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">إجمالي المنتجات</Typography>
              <Typography variant="h6">{summary.total_products || 0}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">منتجات منخفضة المخزون</Typography>
              <Chip label={summary.low_stock || 0} color={(summary.low_stock || 0) > 0 ? 'error' : 'success'} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[
                    { name: 'المبيعات', value: Math.max(summary.monthly_sales || 0, 1) },
                    { name: 'المصروفات', value: Math.max(summary.monthly_expenses || 0, 1) },
                  ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {COLORS.slice(0, 2).map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
