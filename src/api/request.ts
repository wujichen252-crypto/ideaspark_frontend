import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { setActivePinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
import router from '@/router'
import store, { useUserStore } from '@/store'

// Define response structure
export interface Result<T = unknown> {
  code: number
  message: string
  data: T
}

const { message } = createDiscreteApi(['message'])

/**
 * 获取当前可用的鉴权 Token
 * @description 优先从 Pinia UserStore 读取；不可用时回退到 localStorage
 */
function getAuthToken(): string | null {
  try {
    setActivePinia(store)
    const userStore = useUserStore()
    return userStore.token
  } catch {
    return localStorage.getItem('token')
  }
}

/**
 * 清理本地登录状态
 * @description 优先调用 UserStore.logout；不可用时仅移除 localStorage token
 */
function clearAuthState(): void {
  try {
    setActivePinia(store)
    const userStore = useUserStore()
    userStore.logout()
  } catch {
    localStorage.removeItem('token')
  }
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// Request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as Result<unknown>
    // You can adjust this check based on your actual API response structure
    if (res.code !== 0) {
      const msg = res.message || '请求失败'
      message.error(msg)
      return Promise.reject(new Error(msg))
    }
    return response
  },
  (error) => {
    const axiosError = error as AxiosError
    const status = axiosError.response?.status

    if (axiosError.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    if (status === 401) {
      message.error('登录已过期，请重新登录')
      clearAuthState()
      if (router.currentRoute.value.name !== 'Login') {
        router.push('/login')
      }
      return Promise.reject(error)
    }

    const serverMessage =
      (axiosError.response?.data as { message?: string } | undefined)?.message ||
      axiosError.message ||
      '网络异常，请稍后重试'

    message.error(serverMessage)
    return Promise.reject(error)
  }
)

export default service
