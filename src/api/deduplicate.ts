import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * 请求去重管理
 * @description 管理正在进行的请求，避免重复发送相同请求
 */

/**
 * 请求标识接口
 */
interface RequestIdentity {
  /** 请求 URL */
  url: string
  /** 请求方法 */
  method: string
  /** 请求参数 */
  params?: string
  /** 请求数据 */
  data?: string
}

/**
 * 请求去重管理类
 */
class RequestDeduplicator {
  /** 正在进行的请求 Map */
  private pendingRequests: Map<string, Promise<AxiosResponse>> = new Map()

  /**
   * 生成请求标识键
   * @param config - Axios 请求配置
   * @returns 请求标识键
   */
  private generateKey(config: InternalAxiosRequestConfig): string {
    const identity: RequestIdentity = {
      url: config.url || '',
      method: config.method || 'GET',
      params: config.params ? JSON.stringify(config.params) : undefined,
      data: config.data ? JSON.stringify(config.data) : undefined
    }
    return JSON.stringify(identity)
  }

  /**
   * 添加请求到 pending 队列
   * @param config - Axios 请求配置
   * @param request - 请求 Promise
   */
  add(config: InternalAxiosRequestConfig, request: Promise<AxiosResponse>): void {
    const key = this.generateKey(config)
    this.pendingRequests.set(key, request)

    // 请求完成后自动移除
    request
      .then(() => this.remove(config))
      .catch(() => this.remove(config))
  }

  /**
   * 获取正在进行的相同请求
   * @param config - Axios 请求配置
   * @returns 相同的请求 Promise 或 undefined
   */
  get(config: InternalAxiosRequestConfig): Promise<AxiosResponse> | undefined {
    const key = this.generateKey(config)
    return this.pendingRequests.get(key)
  }

  /**
   * 移除请求
   * @param config - Axios 请求配置
   */
  remove(config: InternalAxiosRequestConfig): void {
    const key = this.generateKey(config)
    this.pendingRequests.delete(key)
  }

  /**
   * 检查是否存在相同的请求
   * @param config - Axios 请求配置
   * @returns 是否存在
   */
  has(config: InternalAxiosRequestConfig): boolean {
    const key = this.generateKey(config)
    return this.pendingRequests.has(key)
  }

  /**
   * 清除所有 pending 请求
   */
  clear(): void {
    this.pendingRequests.clear()
  }
}

/**
 * 请求去重实例
 */
export const deduplicator = new RequestDeduplicator()

/**
 * 需要去重的请求方法
 */
const DEDUPLICATE_METHODS = ['GET', 'HEAD']

/**
 * 检查请求是否需要去重
 * @param config - Axios 请求配置
 * @returns 是否需要去重
 */
export function shouldDeduplicate(config: InternalAxiosRequestConfig): boolean {
  const method = config.method?.toUpperCase() || 'GET'
  return DEDUPLICATE_METHODS.includes(method)
}
