import { Paper, Typography, Box } from '@mui/material'

interface Props {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
}

export default function StatCard({ title, value, icon, color = 'primary.main' }: Props) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ color, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
    </Paper>
  )
}
