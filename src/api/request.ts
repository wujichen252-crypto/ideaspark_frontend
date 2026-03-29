import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { setActivePinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
import router from '@/router'
import store, { useUserStore } from '@/store'

// Define response structure (matches backend: { status, message, data })
export interface Result<T = unknown> {
  status: number
  message: string
  data: T
}

const { message } = createDiscreteApi(['message'])

/**
 * 获取当前可用的鉴权 Token
 * @description 直接从 localStorage 读取，避免频繁的 Pinia 操作
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * 清理本地登录状态
 * @description 优先调用 UserStore.logout；不可用时仅移除 localStorage token
 */
function clearAuthState(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  try {
    setActivePinia(store)
    const userStore = useUserStore()
    userStore.logout()
  } catch {
    // 忽略错误
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
    
    // 开发环境日志记录
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: res,
        config: {
          params: response.config.params,
          data: response.config.data
        }
      })
    }
    
    // 如果响应是数组或直接数据（没有 status 字段），直接返回
    if (Array.isArray(res) || (typeof res === 'object' && res !== null && !('status' in res))) {
      return response
    }
    
    // Backend returns status=200 for success, other values indicate errors
    if (res.status !== 200 && res.status !== 201) {
      const msg = res.message || '请求失败'
      
      // 根据状态码提供更友好的错误提示
      let userMessage = msg
      if (res.status === 400) {
        userMessage = `请求参数错误: ${msg}`
      } else if (res.status === 403) {
        userMessage = `权限不足: ${msg}`
      } else if (res.status === 404) {
        userMessage = `资源不存在: ${msg}`
      } else if (res.status >= 500) {
        userMessage = `服务器错误: ${msg}`
      }
      
      message.error(userMessage)
      return Promise.reject(new Error(msg))
    }
    
    return response
  },
  (error) => {
    const axiosError = error as AxiosError
    const status = axiosError.response?.status

    // 开发环境错误日志
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        status,
        error: axiosError.message,
        response: axiosError.response?.data
      })
    }

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

    // 根据状态码提供更友好的错误提示
    let userMessage = '网络异常，请稍后重试'
    if (status === 400) {
      userMessage = '请求参数错误，请检查输入'
    } else if (status === 403) {
      userMessage = '权限不足，无法访问此资源'
    } else if (status === 404) {
      userMessage = '请求的资源不存在'
    } else if (status === 429) {
      userMessage = '请求过于频繁，请稍后再试'
    } else if (status && status >= 500) {
      userMessage = '服务器内部错误，请稍后再试'
    } else if (axiosError.message.includes('Network Error')) {
      userMessage = '网络连接失败，请检查网络设置'
    } else if (axiosError.message.includes('timeout')) {
      userMessage = '请求超时，请检查网络连接'
    }

    // 优先使用服务器返回的错误信息
    const serverMessage =
      (axiosError.response?.data as { message?: string } | undefined)?.message
    if (serverMessage) {
      userMessage = serverMessage
    }

    message.error(userMessage)
    return Promise.reject(error)
  }
)

export default service
