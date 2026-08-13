import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(config => {

  const token = localStorage.getItem('AUTH_TOKEN')

  const publicRoutes = [
    'auth/login',
    'auth/register',
    'auth/confirm-account',
    'auth/request-code',
    'auth/forgot-password'
  ]
  
  const isPublicRoute = publicRoutes.includes(config.url || '')

  if (!isPublicRoute && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api