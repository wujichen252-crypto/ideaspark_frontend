/**
 * 项目管理接口
 * @description 封装项目模块的所有 HTTP 请求方法
 */
import service from './request'
import type { ApiResponse } from './types'
import type { ProjectListResult, GetMyProjectsParams } from './types'

/**
 * 获取我的项目列表
 * @param params - 分页和筛选参数
 */
export function getMyProjects(params?: GetMyProjectsParams) {
  return service.get<ApiResponse<ProjectListResult>>('/projects/my', { params })
}
