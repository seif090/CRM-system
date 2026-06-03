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
