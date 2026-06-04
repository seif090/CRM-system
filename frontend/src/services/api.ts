import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default API

export const authAPI = {
  login: (data: { username: string; password: string }) => API.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string; full_name?: string }) =>
    API.post('/auth/register', data),
}

export const customersAPI = {
  list: (params?: any) => API.get('/customers', { params }),
  get: (id: number) => API.get(`/customers/${id}`),
  create: (data: any) => API.post('/customers', data),
  update: (id: number, data: any) => API.put(`/customers/${id}`, data),
  delete: (id: number) => API.delete(`/customers/${id}`),
}

export const productsAPI = {
  list: (params?: any) => API.get('/products', { params }),
  get: (id: number) => API.get(`/products/${id}`),
  create: (data: any) => API.post('/products', data),
  update: (id: number, data: any) => API.put(`/products/${id}`, data),
  delete: (id: number) => API.delete(`/products/${id}`),
  categories: {
    list: () => API.get('/products/categories'),
    create: (data: any) => API.post('/products/categories', data),
  },
}

export const salesAPI = {
  list: (params?: any) => API.get('/sales', { params }),
  get: (id: number) => API.get(`/sales/${id}`),
  create: (data: any) => API.post('/sales', data),
}

export const purchasesAPI = {
  list: (params?: any) => API.get('/purchases', { params }),
  get: (id: number) => API.get(`/purchases/${id}`),
  create: (data: any) => API.post('/purchases', data),
  suppliers: {
    list: () => API.get('/purchases/suppliers'),
    create: (data: any) => API.post('/purchases/suppliers', data),
  },
}

export const employeesAPI = {
  list: () => API.get('/employees'),
  get: (id: number) => API.get(`/employees/${id}`),
  create: (data: any) => API.post('/employees', data),
  update: (id: number, data: any) => API.put(`/employees/${id}`, data),
  delete: (id: number) => API.delete(`/employees/${id}`),
}

export const accountingAPI = {
  accounts: {
    list: () => API.get('/accounting/accounts'),
    create: (data: any) => API.post('/accounting/accounts', data),
  },
}

export const whatsappAPI = {
  messages: {
    list: () => API.get('/whatsapp/messages'),
    send: (data: any) => API.post('/whatsapp/send', data),
  },
  templates: {
    list: () => API.get('/whatsapp/templates'),
    create: (data: any) => API.post('/whatsapp/templates', data),
  },
}

export const aiAPI = {
  reply: (data: any) => API.post('/ai/reply', data),
  config: {
    list: () => API.get('/ai/config'),
    create: (data: any) => API.post('/ai/config', data),
  },
}

export const dashboardAPI = {
  summary: () => API.get('/dashboard/summary'),
}

export const expensesAPI = {
  list: (params?: any) => API.get('/expenses', { params }),
  create: (data: any) => API.post('/expenses', data),
  summary: (params?: any) => API.get('/expenses/summary', { params }),
  categories: {
    list: () => API.get('/expenses/categories'),
    create: (data: any) => API.post('/expenses/categories', data),
  },
}

export const tasksAPI = {
  list: (params?: any) => API.get('/tasks', { params }),
  create: (data: any) => API.post('/tasks', data),
  update: (id: number, data: any) => API.put(`/tasks/${id}`, data),
  projects: {
    list: () => API.get('/tasks/projects'),
    create: (data: any) => API.post('/tasks/projects', data),
  },
}

export const returnsAPI = {
  list: () => API.get('/returns'),
  create: (data: any) => API.post('/returns', data),
}

export const inventoryAPI = {
  movements: {
    list: () => API.get('/inventory/movements'),
  },
  adjust: (data: any) => API.post('/inventory/adjust', data),
  warehouses: {
    list: () => API.get('/inventory/warehouses'),
    create: (data: any) => API.post('/inventory/warehouses', data),
  },
}

export const notificationsAPI = {
  list: () => API.get('/notifications'),
  unreadCount: () => API.get('/notifications/unread-count'),
  markRead: (id: number) => API.post(`/notifications/${id}/read`),
  markAllRead: () => API.post('/notifications/read-all'),
}

export const auditAPI = {
  list: (params?: any) => API.get('/audit', { params }),
}

export const permissionsAPI = {
  roles: {
    list: () => API.get('/permissions/roles'),
    create: (data: any) => API.post('/permissions/roles', data),
  },
  my: () => API.get('/permissions/my'),
}

export const posAPI = {
  products: (params?: any) => API.get('/pos/products', { params }),
  customers: (params?: any) => API.get('/pos/customers', { params }),
}

export const reportsAPI = {
  sales: (params?: any) => API.get('/reports/sales', { params }),
  summary: () => API.get('/reports/summary'),
}

export const shippingAPI = {
  list: () => API.get('/shipping'),
  create: (data: any) => API.post('/shipping', data),
  updateStatus: (id: number, status: string) => API.put(`/shipping/${id}/status?status=${status}`),
  persons: {
    list: () => API.get('/shipping/persons'),
    create: (data: any) => API.post('/shipping/persons', data),
  },
}

export const emailAPI = {
  config: {
    list: () => API.get('/email/config'),
    create: (data: any) => API.post('/email/config', data),
  },
  templates: {
    list: () => API.get('/email/templates'),
    create: (data: any) => API.post('/email/templates', data),
  },
  send: (data: any) => API.post('/email/send', data),
  logs: () => API.get('/email/logs'),
}

export const leavesAPI = {
  list: () => API.get('/leaves'),
  create: (data: any) => API.post('/leaves', data),
  approve: (id: number, status: string) => API.put(`/leaves/${id}/status?status=${status}`),
  types: {
    list: () => API.get('/leaves/types'),
    create: (data: any) => API.post('/leaves/types', data),
  },
}

export const payrollAPI = {
  list: (params?: any) => API.get('/payroll', { params }),
  create: (data: any) => API.post('/payroll', data),
  bonuses: {
    create: (data: any) => API.post('/payroll/bonuses', data),
  },
  deductions: {
    create: (data: any) => API.post('/payroll/deductions', data),
  },
}

export const paymentsAPI = {
  gateways: {
    list: () => API.get('/payments/gateways'),
    create: (data: any) => API.post('/payments/gateways', data),
  },
  transactions: {
    list: () => API.get('/payments/transactions'),
  },
}

export const assetsAPI = {
  list: () => API.get('/assets'),
  create: (data: any) => API.post('/assets', data),
  categories: {
    list: () => API.get('/assets/categories'),
    create: (data: any) => API.post('/assets/categories', data),
  },
  maintenance: (data: any) => API.post('/assets/maintenance', data),
}

export const budgetsAPI = {
  list: (params?: any) => API.get('/budgets', { params }),
  create: (data: any) => API.post('/budgets', data),
}

export const branchesAPI = {
  list: () => API.get('/branches'),
  create: (data: any) => API.post('/branches', data),
}

export const loyaltyAPI = {
  tiers: {
    list: () => API.get('/loyalty/tiers'),
    create: (data: any) => API.post('/loyalty/tiers', data),
  },
  customer: (id: number) => API.get(`/loyalty/customers/${id}`),
  coupons: {
    list: () => API.get('/loyalty/coupons'),
    create: (data: any) => API.post('/loyalty/coupons', data),
  },
}

export const importExportAPI = {
  export: (entity: string, format?: string) => API.get(`/import-export/export/${entity}?format=${format || 'csv'}`, { responseType: 'blob' }),
}

export const printAPI = {
  invoice: (id: number) => API.get(`/print/invoice/${id}`, { responseType: 'blob' }),
  barcode: (id: number) => API.get(`/print/barcode/${id}`, { responseType: 'blob' }),
}

export const portalAPI = {
  customer: (phone: string) => API.get(`/portal/customer/${phone}`),
  invoices: (phone: string) => API.get(`/portal/customer/${phone}/invoices`),
  loyalty: (phone: string) => API.get(`/portal/customer/${phone}/loyalty`),
}

export const ticketsAPI = {
  list: (params?: any) => API.get('/tickets', { params }),
  get: (id: number) => API.get(`/tickets/${id}`),
  create: (data: any) => API.post('/tickets', data),
  update: (id: number, data: any) => API.put(`/tickets/${id}`, data),
  messages: {
    list: (ticketId: number) => API.get(`/tickets/${ticketId}/messages`),
    create: (ticketId: number, data: any) => API.post(`/tickets/${ticketId}/messages`, data),
  },
}

export const pipelineAPI = {
  stages: {
    list: () => API.get('/pipeline/stages'),
    create: (data: any) => API.post('/pipeline/stages', data),
  },
  deals: {
    list: (stageId?: number) => API.get('/pipeline/deals', { params: { stage_id: stageId } }),
    create: (data: any) => API.post('/pipeline/deals', data),
    update: (id: number, data: any) => API.put(`/pipeline/deals/${id}`, data),
    delete: (id: number) => API.delete(`/pipeline/deals/${id}`),
  },
}

export const calendarAPI = {
  list: (params?: any) => API.get('/calendar', { params }),
  create: (data: any) => API.post('/calendar', data),
  update: (id: number, data: any) => API.put(`/calendar/${id}`, data),
  delete: (id: number) => API.delete(`/calendar/${id}`),
}

export const chatAPI = {
  rooms: {
    list: () => API.get('/chat/rooms'),
    create: (data: any) => API.post('/chat/rooms', data),
  },
  messages: {
    list: (roomId: number, params?: any) => API.get(`/chat/rooms/${roomId}/messages`, { params }),
    send: (data: any) => API.post('/chat/messages', data),
  },
}

export const documentsAPI = {
  list: (params?: any) => API.get('/documents', { params }),
  create: (data: any) => API.post('/documents', data),
  delete: (id: number) => API.delete(`/documents/${id}`),
  folders: {
    list: () => API.get('/documents/folders'),
    create: (data: any) => API.post('/documents/folders', data),
  },
}

export const timeTrackAPI = {
  list: (params?: any) => API.get('/time-track', { params }),
  create: (data: any) => API.post('/time-track', data),
  summary: (params?: any) => API.get('/time-track/summary', { params }),
}

export const manufacturingAPI = {
  boms: {
    list: () => API.get('/manufacturing/boms'),
    create: (data: any) => API.post('/manufacturing/boms', data),
  },
  orders: {
    list: (params?: any) => API.get('/manufacturing/orders', { params }),
    create: (data: any) => API.post('/manufacturing/orders', data),
    updateStatus: (id: number, status: string) => API.put(`/manufacturing/orders/${id}/status?status=${status}`),
  },
}

export const contractsAPI = {
  list: (params?: any) => API.get('/contracts', { params }),
  create: (data: any) => API.post('/contracts', data),
  update: (id: number, data: any) => API.put(`/contracts/${id}`, data),
  delete: (id: number) => API.delete(`/contracts/${id}`),
}

export const knowledgeAPI = {
  categories: {
    list: () => API.get('/knowledge/categories'),
    create: (data: any) => API.post('/knowledge/categories', data),
  },
  articles: {
    list: (params?: any) => API.get('/knowledge/articles', { params }),
    get: (id: number) => API.get(`/knowledge/articles/${id}`),
    create: (data: any) => API.post('/knowledge/articles', data),
  },
}

export const feedbackAPI = {
  forms: {
    list: () => API.get('/feedback/forms'),
    create: (data: any) => API.post('/feedback/forms', data),
  },
  responses: {
    list: (params?: any) => API.get('/feedback/responses', { params }),
    submit: (data: any) => API.post('/feedback/responses', data),
  },
}

export const subscriptionsAPI = {
  plans: {
    list: () => API.get('/subscriptions/plans'),
    create: (data: any) => API.post('/subscriptions/plans', data),
  },
  customers: {
    list: () => API.get('/subscriptions/customers'),
    create: (data: any) => API.post('/subscriptions/customers', data),
    updateStatus: (id: number, status: string) => API.put(`/subscriptions/customers/${id}/status?status=${status}`),
  },
}
