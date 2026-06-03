import { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box } from '@mui/material'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import WarningIcon from '@mui/icons-material/Warning'
import BadgeIcon from '@mui/icons-material/Badge'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import { dashboardAPI, reportsAPI } from '../services/api'
import { formatCurrency } from '../utils/helpers'

const COLORS = ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2']

export default function Dashboard() {
  const [data, setData] = useState<any>({})
  const [salesData, setSalesData] = useState<any[]>([])
  const [report, setReport] = useState<any>({})

  useEffect(() => {
    dashboardAPI.summary().then((res) => setData(res.data)).catch(() => {})
    reportsAPI.sales({ group_by: 'day' }).then((res) => {
      setSalesData(res.data.daily_data?.slice(-14) || [])
    }).catch(() => {})
    reportsAPI.summary().then((res) => setReport(res.data)).catch(() => {})
  }, [])

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>لوحة التحكم</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="إجمالي الإيرادات" value={formatCurrency(data.total_revenue || 0)} icon={<TrendingUpIcon />} color="success.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="عدد العملاء" value={data.total_customers || 0} icon={<PeopleIcon />} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="مبيعات اليوم" value={formatCurrency(data.today_sales || 0)} icon={<PointOfSaleIcon />} color="info.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="المنتجات" value={data.total_products || 0} icon={<InventoryIcon />} color="secondary.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="منتجات منخفضة" value={data.low_stock_products || 0} icon={<WarningIcon />} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard title="الموظفين" value={data.total_employees || 0} icon={<BadgeIcon />} color="error.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>تحليل المبيعات (آخر 14 يوم)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#1976d2" name="الإيرادات" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>تحليل الأرباح</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'المبيعات', value: Math.max(report.monthly_sales || 0, 1) },
                    { name: 'المصروفات', value: Math.max(report.monthly_expenses || 0, 1) },
                    { name: 'صافي الربح', value: Math.max(report.monthly_profit || 0, 1) },
                  ]}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                >
                  {COLORS.slice(0, 3).map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">مبيعات الشهر</Typography>
              <Typography variant="h6" color="success.main">{formatCurrency(report.monthly_sales || 0)}</Typography>
              <Typography variant="body2" color="text.secondary">مصروفات الشهر</Typography>
              <Typography variant="h6" color="error.main">{formatCurrency(report.monthly_expenses || 0)}</Typography>
              <Typography variant="body2" color="text.secondary">صافي الربح</Typography>
              <Typography variant="h6" color="primary.main">{formatCurrency(report.monthly_profit || 0)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
