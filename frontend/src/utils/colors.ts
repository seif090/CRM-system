export const statusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  const map: Record<string, any> = {
    active: 'success', completed: 'success', pass: 'success', paid: 'success',
    open: 'info', pending: 'warning', draft: 'default',
    cancelled: 'error', terminated: 'error', fail: 'error',
    new: 'info', scheduled: 'info', in_progress: 'info',
    expired: 'default',
  }
  return map[status] || 'default'
}
