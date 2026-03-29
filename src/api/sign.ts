/**
 * 报名审核统计接口
 * @description 封装报名审核统计模块的 HTTP 请求方法
 */
import service from './request'
import type { ApiResponse } from './types'
import type {
  GetSignApplicationStatsParams,
  SignApplicationStatsResponse
} from './types'

/**
 * 获取报名审核统计
 * @param params - 统计参数
 */
export function getSignApplicationStats(params?: GetSignApplicationStatsParams) {
  return service.get<ApiResponse<SignApplicationStatsResponse>>('/api/sign/applications/stats', { params })
}
